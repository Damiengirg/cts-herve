const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════
//  MOTS-CLÉS MÉTIER
// ══════════════════════════════════════
const KW_RECHERCHE = [
  "sablage", "grenaillage", "traitement de surface", "peinture industrielle",
  "anticorrosion", "époxy", "polyuréthane", "métallisation", "thermolaquage",
  "remise en peinture", "garde-corps", "candélabre", "lampadaire",
  "mobilier urbain", "barrière métallique", "serrurerie métallique",
  "portail acier", "charpente métallique", "passerelle acier",
  "ouvrages métalliques", "zinc silicate", "protection anticorrosion"
];

const KW_ATELIER = [
  "déposées", "démontées", "transportées", "en atelier", "avant pose",
  "en usine", "lot peinture", "pièces déposées", "avant repose",
  "traitement en série", "livraison atelier", "avant installation"
];

const KW_EXCLUS = [
  "ravalement", "façade", "enduit", "peinture intérieure", "nacelle",
  "échafaudage", "maintien circulation", "nuit", "autoroutier",
  "génie civil", "terrassement", "VRD", "toiture", "couverture"
];

// Distances réelles depuis Marne (51) en km
const DIST51 = {
  "02":90,"03":290,"04":500,"05":510,"06":620,"07":430,"08":130,"09":650,
  "10":80,"11":620,"12":430,"13":570,"14":380,"15":350,"16":480,"17":510,
  "18":250,"19":370,"21":180,"22":560,"23":340,"24":490,"25":260,"26":480,
  "27":310,"28":200,"29":680,"30":530,"31":600,"32":580,"33":540,"34":530,
  "35":480,"36":300,"37":280,"38":490,"39":270,"40":610,"41":210,"42":380,
  "43":370,"44":490,"45":170,"46":450,"47":450,"48":450,"49":400,"50":430,
  "51":15,"52":90,"53":350,"54":160,"55":110,"56":570,"57":180,"58":190,
  "59":280,"60":160,"61":310,"62":320,"63":360,"64":640,"65":610,"66":590,
  "67":300,"68":320,"69":400,"70":230,"71":280,"72":290,"73":490,"74":520,
  "75":140,"76":270,"77":110,"78":160,"79":430,"80":210,"81":570,"82":540,
  "83":610,"84":530,"85":590,"86":380,"87":400,"88":210,"89":130,"90":290,
  "91":150,"92":145,"93":140,"94":145,"95":160
};

function nrm(s) {
  return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function estDist(dept, refDept = "51") {
  if (!dept) return 300;
  if (dept === refDept) return 15;
  return DIST51[dept] || 250;
}

function calculScore(m) {
  let s = 0, det = [];
  const tx = nrm([m.titre, m.description, m.acheteur].join(" "));

  // Distance
  const d = m.distance || 999;
  let dp = d<50?18:d<100?14:d<200?10:d<300?5:1;
  det.push({l: `Distance (${d} km)`, p: dp, mx: 18}); s += dp;

  // Compatible atelier
  let ap = 0;
  for (const k of KW_ATELIER) { if (tx.includes(nrm(k))) { ap = 22; break; } }
  if (!ap) ap = 5;
  det.push({l: "Compatible atelier", p: ap, mx: 22}); s += ap;

  // Correspondance métier
  let kc = 0;
  for (const k of KW_RECHERCHE) { if (tx.includes(nrm(k))) kc++; }
  let kp = Math.min(20, kc * 4);
  det.push({l: "Correspondance métier", p: kp, mx: 20}); s += kp;

  // Délai raisonnable
  const dl = m.daysLeft || 0;
  let tp = dl>20?15:dl>10?10:dl>5?5:0;
  det.push({l: "Temps pour répondre", p: tp, mx: 15}); s += tp;

  // Pénalité mots exclus
  for (const k of KW_EXCLUS) {
    if (tx.includes(nrm(k))) { s = Math.max(0, s - 25); break; }
  }

  return { total: Math.min(100, Math.round(s)), det };
}

function couleur(sc) { return sc>=60?"vert":sc>=38?"orange":"rouge"; }

function typeAtelier(tx) {
  const t = nrm(tx);
  for (const k of KW_ATELIER) { if (t.includes(nrm(k))) return "✓ Pièces atelier"; }
  if (t.includes("nacelle") || t.includes("echafaudage")) return "✗ Sur site";
  return "? À vérifier";
}

// ══════════════════════════════════════
//  FETCH BOAMP OFFICIEL
// ══════════════════════════════════════
async function fetchBOAMP(query) {
  const url = `https://www.boamp.fr/avis/search?q=${encodeURIComponent(query)}&rows=15&sort=dateparution+desc`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CTS-Marches/1.0)',
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.hits?.hits || []).map(h => {
      const s = h._source || {};
      const cpVille = s.acheteur?.cp_ville || "";
      const dept = cpVille.replace(/[^0-9]/g, "").substring(0, 2) || "";
      const dateLimit = s.date_limite_reponse || "";
      const datePub = s.dateparution || s.date_parution || "";
      const daysLeft = dateLimit
        ? Math.round((new Date(dateLimit) - Date.now()) / 86400000)
        : null;

      // Référence du contrat
      const reference = s.reference_marche || s.numero_consultation ||
        s.numero_avis || h._id || "";

      return {
        id: h._id,
        reference: reference,
        titre: s.objet || s.intitule_marche || "Marché sans titre",
        description: [
          (s.descripteurs_libelles || []).join(" "),
          s.objet || "",
          s.description_cpv || "",
          s.description || ""
        ].join(" "),
        acheteur: s.acheteur?.nom || "Acheteur public",
        ville: s.lieu_principal_execution?.localite || cpVille || "",
        dept,
        montant: parseFloat(s.montant_estime) || null,
        datePublication: datePub,
        dateLimit,
        daysLeft,
        urlDirecte: `https://www.boamp.fr/avis/detail/${h._id}`,
        source: "BOAMP"
      };
    });
  } catch (e) {
    console.error("BOAMP fetch error:", e.message);
    return [];
  }
}

// ══════════════════════════════════════
//  ROUTE PRINCIPALE — RECHERCHE
// ══════════════════════════════════════
app.get('/api/marches', async (req, res) => {
  const dept = req.query.dept || "51";
  console.log(`Recherche lancée — dept référence: ${dept}`);

  const queries = [
    "sablage traitement surface",
    "peinture industrielle métallique",
    "anticorrosion acier",
    "garde-corps peinture",
    "mobilier urbain traitement acier",
    "candélabre peinture anticorrosion",
    "serrurerie peinture acier",
    "portail clôture traitement surface",
    "grenaillage métallisation",
    "thermolaquage acier"
  ];

  let tous = [];
  for (const q of queries) {
    const res2 = await fetchBOAMP(q);
    tous.push(...res2);
    await new Promise(r => setTimeout(r, 300));
  }

  // Dédupliquer
  const seen = new Set();
  tous = tous.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // Garder uniquement les annonces encore valides
  tous = tous.filter(m => m.daysLeft === null || m.daysLeft > 0);

  // Enrichir avec distance et score
  tous = tous.map(m => {
    m.distance = estDist(m.dept, dept);
    const sc = calculScore(m);
    m.score = sc.total;
    m.scoreDetails = sc.det;
    m.couleur = couleur(m.score);
    m.typeAtelier = typeAtelier(m.description);
    return m;
  });

  // Trier par date de publication (plus récent en premier)
  tous.sort((a, b) => {
    if (a.datePublication && b.datePublication) {
      return new Date(b.datePublication) - new Date(a.datePublication);
    }
    return b.score - a.score;
  });

  console.log(`Résultats: ${tous.length} annonces valides trouvées`);
  res.json({ success: true, total: tous.length, marches: tous });
});

// ══════════════════════════════════════
//  ROUTE IA — RÉSUMÉ (payant au clic)
// ══════════════════════════════════════
app.post('/api/analyser', async (req, res) => {
  const { marche } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non configurée" });
  }

  if (!marche) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const montantTxt = marche.montant
    ? marche.montant.toLocaleString('fr-FR') + " €"
    : "Prix non communiqué — prévoir de demander un devis ou estimer selon les quantités";

  const prompt = `Tu es expert marchés publics français, spécialiste traitement de surface industriel.

Analyse ce marché public pour un chef d'entreprise de traitement de surface (sablage, grenaillage, peinture industrielle, anticorrosion, métallisation, thermolaquage) situé dans la Marne (51).

RÉFÉRENCE : ${marche.reference || "Non précisée"}
MARCHÉ : ${marche.titre}
ACHETEUR : ${marche.acheteur}
LIEU : ${marche.ville} (${marche.dept}) — ${marche.distance} km de l'atelier
MONTANT : ${montantTxt}
DÉLAI RÉPONSE : ${marche.daysLeft ? marche.daysLeft + " jours" : "Non précisé"}
DESCRIPTION COMPLÈTE : ${marche.description.slice(0, 600)}

Donne une analyse en 5 points COURTS, HONNÊTES et UTILES :

1. 🔧 TRAVAUX DEMANDÉS : (type exact : sablage SA2,5 / primaire époxy / peinture polyuréthane / métallisation / thermolaquage — précis)
2. 📦 TYPE DE PIÈCES : (garde-corps / candélabres / barrières / charpente — nombre et poids estimés si mentionnés, sinon "non précisé dans l'annonce")
3. 💰 PRIX : (montant si connu, sinon "Prix non communiqué — prévoir devis")
4. 🏭 COMPATIBLE ATELIER : Oui / Non / Incertain — (raison courte et directe)
5. ✅ VERDICT : Compatible / Peu compatible / À éviter — (1 phrase directe et honnête)

Sois honnête. Si une info manque, dis-le clairement. Pas de faux enthousiasme.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(500).json({ error: err?.error?.message || "Erreur API" });
    }

    const data = await response.json();
    const texte = data.content?.map(b => b.text || "").join("\n").trim() || "";
    res.json({ success: true, resume: texte });

  } catch (e) {
    res.status(500).json({ error: "Erreur serveur: " + e.message });
  }
});

// ══════════════════════════════════════
//  SANTÉ DU SERVEUR
// ══════════════════════════════════════
app.get('/api/ping', (req, res) => {
  res.json({ status: "ok", message: "Serveur CTS Hervé actif" });
});

app.listen(PORT, () => {
  console.log(`Serveur CTS Hervé démarré sur le port ${PORT}`);
});
