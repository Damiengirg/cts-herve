const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const KW_RECHERCHE = [
  "sablage", "grenaillage", "traitement de surface", "peinture industrielle",
  "anticorrosion", "epoxy", "polyurethane", "metallisation", "thermolaquage",
  "remise en peinture", "garde-corps", "candelabre", "lampadaire",
  "mobilier urbain", "barriere metallique", "serrurerie metallique",
  "portail acier", "charpente metallique", "passerelle acier",
  "ouvrages metalliques", "zinc silicate", "protection anticorrosion",
  "peinture acier", "traitement anticorrosion"
];

const KW_ATELIER = [
  "deposees", "demontees", "transportees", "en atelier", "avant pose",
  "en usine", "lot peinture", "pieces deposees", "avant repose",
  "traitement en serie", "livraison atelier", "avant installation",
  "atelier", "usine"
];

const KW_EXCLUS = [
  "ravalement", "facade", "enduit", "peinture interieure",
  "maintien circulation", "autoroute", "genie civil",
  "terrassement", "VRD", "toiture", "couverture", "batiment"
];

// Distances depuis Marne (51) en km
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
  if (!dept) return 400;
  const d = dept.toString().padStart(2, '0');
  if (d === refDept) return 15;
  return DIST51[d] || 350;
}

function calculScore(m) {
  let s = 0, det = [];
  const tx = nrm([m.titre, m.description, m.acheteur].join(" "));

  // Distance (max 25 pts)
  const d = m.distance || 999;
  let dp = d<50?25:d<100?20:d<200?14:d<300?8:d<400?4:1;
  det.push({l: `Distance (${d} km)`, p: dp, mx: 25}); s += dp;

  // Compatible atelier (max 20 pts)
  let ap = 0;
  for (const k of KW_ATELIER) { if (tx.includes(nrm(k))) { ap = 20; break; } }
  if (!ap) ap = 8; // neutre par défaut
  det.push({l: "Compatible atelier", p: ap, mx: 20}); s += ap;

  // Correspondance métier (max 30 pts)
  let kc = 0;
  for (const k of KW_RECHERCHE) { if (tx.includes(nrm(k))) kc++; }
  let kp = Math.min(30, kc * 5);
  det.push({l: "Correspondance métier", p: kp, mx: 30}); s += kp;

  // Délai raisonnable (max 15 pts)
  const dl = m.daysLeft || 0;
  let tp = dl>20?15:dl>10?10:dl>5?5:dl>0?2:0;
  det.push({l: "Temps pour répondre", p: tp, mx: 15}); s += tp;

  // Pénalité mots exclus
  let penalite = 0;
  for (const k of KW_EXCLUS) {
    if (tx.includes(nrm(k))) { penalite = 20; break; }
  }
  if (penalite) det.push({l: "⚠️ Hors métier", p: -penalite, mx: 0});
  s = Math.max(0, s - penalite);

  return { total: Math.min(100, Math.round(s)), det };
}

function couleur(sc) { return sc>=50?"vert":sc>=30?"orange":"rouge"; }

function typeAtelier(tx) {
  const t = nrm(tx);
  for (const k of KW_ATELIER) { if (t.includes(nrm(k))) return "✓ Pièces atelier"; }
  if (t.includes("nacelle") || t.includes("echafaudage")) return "✗ Sur site";
  return "? À vérifier";
}

async function fetchBOAMP(query) {
  const words = query.split(' ').filter(w => w.length > 3).map(w => `search(objet,"${w}")`).join(' OR ');
  const url = `https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records?where=${encodeURIComponent(words)}&limit=25&order_by=dateparution%20desc`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CTS-Marches/1.0)',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) {
      console.error(`BOAMP error ${res.status} for query: ${query}`);
      return [];
    }
    const data = await res.json();
    const records = data?.results || [];

    // Log les champs du premier résultat pour debug
    if (records.length > 0) {
      const r0 = records[0];
      console.log("Champs disponibles:", Object.keys(r0).join(", "));
      console.log("Sample:", JSON.stringify({
        idweb: r0.idweb, lieu_exec_code_postal: r0.lieu_exec_code_postal,
        cp_acheteur: r0.cp_acheteur, lieu_exec_cp: r0.lieu_exec_cp,
        lieu_exec_localite: r0.lieu_exec_localite, commune: r0.commune,
        code_postal: r0.code_postal, dept: r0.departement_execution
      }));
    }

    return records.map(r => {
      // L'API v2.1 retourne les champs directement (pas dans r.fields)
      const idweb = r.idweb || r.id_web || r.numero_avis || "";
      // Chercher le département dans plusieurs champs
      const deptDirect = (r.departement_execution || r.dept_exec || "").toString().padStart(2,'0').substring(0,2);
      const cpVille = r.lieu_exec_code_postal || r.cp_acheteur || r.lieu_exec_cp || r.code_postal || "";
      const deptFromCP = cpVille.toString().replace(/[^0-9]/g, "").substring(0, 2);
      const dept = deptDirect || deptFromCP || "";
      const dateLimit = r.date_limite_reponse || r.datelimitereponse || r.date_limite || "";
      const datePub = r.dateparution || r.date_parution || "";
      const daysLeft = dateLimit
        ? Math.round((new Date(dateLimit) - Date.now()) / 86400000)
        : null;
      const uid = idweb || (r.id || Math.random().toString(36).substring(2));
      const urlDirecte = idweb
        ? `https://www.boamp.fr/avis/detail/${idweb}`
        : "https://www.boamp.fr";

      return {
        id: uid,
        reference: idweb || r.reference || "",
        titre: r.objet || r.intitule || r.libelle || "Marché sans titre",
        description: [r.objet || "", r.descriptif || "", r.libelle_nature || ""].join(" "),
        acheteur: r.nom_acheteur || r.acheteur || r.intitule_acheteur || "Acheteur public",
        ville: r.lieu_exec_localite || r.commune || r.ville || cpVille || "",
        dept,
        montant: parseFloat(r.montant_estime || r.montant || 0) || null,
        datePublication: datePub,
        dateLimit,
        daysLeft,
        urlDirecte,
        source: "BOAMP"
      };
    });
  } catch (e) {
    console.error("BOAMP fetch error:", e.message);
    return [];
  }
}

app.get('/api/marches', async (req, res) => {
  const dept = req.query.dept || "51";
  const tri = req.query.tri || "distance"; // distance, score, date
  console.log(`Recherche lancée — dept: ${dept}, tri: ${tri}`);

  const queries = [
    "sablage grenaillage surface",
    "peinture industrielle metallique acier",
    "anticorrosion epoxy polyurethane",
    "garde-corps candélabre lampadaire",
    "mobilier urbain traitement surface",
    "serrurerie portail acier peinture",
    "thermolaquage metallisation zinc",
    "charpente passerelle acier peinture"
  ];

  let tous = [];
  for (const q of queries) {
    const res2 = await fetchBOAMP(q);
    tous.push(...res2);
    await new Promise(r => setTimeout(r, 250));
  }

  // Dédupliquer
  const seen = new Set();
  tous = tous.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // Garder annonces valides
  tous = tous.filter(m => m.daysLeft === null || m.daysLeft > 0);

  // Enrichir
  tous = tous.map(m => {
    m.distance = estDist(m.dept, dept);
    const sc = calculScore(m);
    m.score = sc.total;
    m.scoreDetails = sc.det;
    m.couleur = couleur(m.score);
    m.typeAtelier = typeAtelier(m.description);
    return m;
  });

  // Tri
  if (tri === "distance") {
    tous.sort((a, b) => a.distance - b.distance);
  } else if (tri === "score") {
    tous.sort((a, b) => b.score - a.score);
  } else {
    tous.sort((a, b) => {
      if (a.datePublication && b.datePublication)
        return new Date(b.datePublication) - new Date(a.datePublication);
      return b.score - a.score;
    });
  }

  console.log(`Résultats: ${tous.length} annonces valides`);
  res.json({ success: true, total: tous.length, marches: tous });
});

app.post('/api/analyser', async (req, res) => {
  const { marche } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Clé API non configurée" });
  if (!marche) return res.status(400).json({ error: "Données manquantes" });

  const montantTxt = marche.montant
    ? marche.montant.toLocaleString('fr-FR') + " €"
    : "Prix non communiqué";

  const prompt = `Tu es expert marchés publics français, spécialiste traitement de surface industriel.

Analyse ce marché pour CTS Hervé (sablage, grenaillage, peinture industrielle, anticorrosion) situé dans la Marne (51).

RÉFÉRENCE : ${marche.reference || "Non précisée"}
MARCHÉ : ${marche.titre}
ACHETEUR : ${marche.acheteur}
LIEU : ${marche.ville} (${marche.dept}) — ${marche.distance} km
MONTANT : ${montantTxt}
DÉLAI : ${marche.daysLeft ? marche.daysLeft + " jours" : "Non précisé"}
DESCRIPTION : ${marche.description.slice(0, 600)}

Analyse en 5 points courts :
1. 🔧 TRAVAUX DEMANDÉS :
2. 📦 TYPE DE PIÈCES :
3. 💰 PRIX :
4. 🏭 COMPATIBLE ATELIER : Oui / Non / Incertain
5. ✅ VERDICT : Compatible / Peu compatible / À éviter`;

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
    const data = await response.json();
    const texte = data.content?.map(b => b.text || "").join("\n").trim() || "";
    res.json({ success: true, resume: texte });
  } catch (e) {
    res.status(500).json({ error: "Erreur: " + e.message });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ status: "ok", message: "Serveur CTS Hervé actif" });
});

app.listen(PORT, () => {
  console.log(`Serveur CTS Hervé démarré sur le port ${PORT}`);
});
