const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

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

const KW_ATELIER = ["deposees","demontees","transportees","en atelier","avant pose",
  "en usine","lot peinture","pieces deposees","avant repose","livraison atelier",
  "avant installation","atelier","usine"];

const KW_EXCLUS = ["ravalement","facade","enduit","peinture interieure",
  "maintien circulation","autoroute","genie civil","terrassement","toiture","couverture"];

function nrm(s){
  return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function estDist(dept, ref="51"){
  if(!dept) return 400;
  const d = dept.toString().padStart(2,"0").substring(0,2);
  if(d===ref) return 15;
  return DIST51[d]||350;
}

function calculScore(m, kwRecherche){
  let s=0, det=[];
  const tx = nrm([m.titre, m.description, m.acheteur].join(" "));

  // Correspondance métier en premier (max 35)
  let kc=0;
  for(const k of kwRecherche){ if(tx.includes(nrm(k))) kc++; }
  let kp=Math.min(35,kc*6);
  det.push({l:`Correspondance métier (${kc}/${kwRecherche.length})`,p:kp,mx:35});
  s+=kp;

  // Compatible atelier (max 25)
  let ap=8;
  for(const k of KW_ATELIER){ if(tx.includes(nrm(k))){ ap=25; break; } }
  det.push({l:"Compatible atelier",p:ap,mx:25});
  s+=ap;

  // Distance (max 25)
  const d=m.distance||400;
  let dp=d<50?25:d<100?20:d<150?15:d<250?10:d<350?5:2;
  det.push({l:`Distance (${d} km)`,p:dp,mx:25});
  s+=dp;

  // Pénalité
  for(const k of KW_EXCLUS){ if(tx.includes(nrm(k))){ s=Math.max(0,s-25); break; } }

  return {total:Math.min(100,Math.round(s)),det};
}

function couleur(sc){ return sc>=55?"vert":sc>=35?"orange":"rouge"; }

function typeAtelier(tx){
  for(const k of KW_ATELIER){ if(nrm(tx).includes(nrm(k))) return "✓ Pièces atelier"; }
  return "? À vérifier";
}

async function fetchBOAMP(keywords){
  const where = keywords.slice(0,5).map(k=>`search(objet,"${k.replace(/"/g,'')}")`).join(' OR ');
  const url = `https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records?where=${encodeURIComponent(where)}&limit=25&order_by=dateparution%20desc`;
  try{
    const res = await fetch(url,{headers:{'Accept':'application/json'},signal:AbortSignal.timeout(15000)});
    if(!res.ok){ console.error(`BOAMP ${res.status}`); return []; }
    const data = await res.json();
    const records = data?.results||[];
    return records.map(r=>{
      const idweb=r.idweb||"";
      const dept=(r.code_departement||r.code_departement_prestation||"").toString().padStart(2,"0").substring(0,2);
      const dateLimit=r.datelimitereponse||"";
      const datePub=r.dateparution||"";
      const daysLeft=dateLimit?Math.round((new Date(dateLimit)-Date.now())/86400000):null;
      return {
        id:idweb||Math.random().toString(36).substring(2),
        reference:idweb,
        titre:r.objet||"Sans titre",
        description:[r.objet||"",r.descripteur_libelle||"",r.famille_libelle||""].join(" "),
        acheteur:r.nomacheteur||"Acheteur public",
        ville:r.perimetre||"",
        dept,
        montant:parseFloat(r.montant||0)||null,
        datePublication:datePub,
        dateLimit,
        daysLeft,
        urlDirecte:r.url_avis||(idweb?`https://www.boamp.fr/avis/detail/${idweb}`:"https://www.boamp.fr"),
        source:"BOAMP"
      };
    });
  }catch(e){ console.error("BOAMP:",e.message); return []; }
}

app.get('/api/marches', async (req,res)=>{
  const dept=req.query.dept||"51";
  const tri=req.query.tri||"score";
  const kwParam=req.query.kw||"";
  const kwRecherche=kwParam
    ? kwParam.split(",").map(k=>k.trim()).filter(Boolean)
    : ["sablage","grenaillage","peinture industrielle","anticorrosion",
       "traitement de surface","thermolaquage","metallisation",
       "garde-corps","candelabre","serrurerie acier"];

  console.log(`Recherche dept:${dept} kw:${kwRecherche.join(",")}`);

  let tous=[];
  for(let i=0;i<kwRecherche.length;i+=5){
    const chunk=kwRecherche.slice(i,i+5);
    const r=await fetchBOAMP(chunk);
    tous.push(...r);
    if(i+5<kwRecherche.length) await new Promise(r=>setTimeout(r,300));
  }

  const seen=new Set();
  tous=tous.filter(m=>{ if(seen.has(m.id)) return false; seen.add(m.id); return true; });
  tous=tous.filter(m=>m.daysLeft===null||m.daysLeft>0);
  tous=tous.map(m=>{
    m.distance=estDist(m.dept,dept);
    const sc=calculScore(m,kwRecherche);
    m.score=sc.total; m.scoreDetails=sc.det;
    m.couleur=couleur(m.score);
    m.typeAtelier=typeAtelier(m.description);
    return m;
  });

  if(tri==="distance") tous.sort((a,b)=>a.distance-b.distance);
  else if(tri==="date") tous.sort((a,b)=>new Date(b.datePublication)-new Date(a.datePublication));
  else tous.sort((a,b)=>b.score-a.score);

  console.log(`${tous.length} annonces trouvées`);
  res.json({success:true,total:tous.length,marches:tous});
});

app.post('/api/analyser', async (req,res)=>{
  const {marche}=req.body;
  const apiKey=process.env.ANTHROPIC_API_KEY;
  if(!apiKey) return res.status(500).json({error:"Clé API manquante"});
  if(!marche) return res.status(400).json({error:"Données manquantes"});

  const montantTxt=marche.montant?Math.round(marche.montant).toLocaleString('fr-FR')+" €":"non communiqué";
  const prompt=`Résume ce marché public en 4 lignes pour un artisan spécialisé en sablage et peinture industrielle.

TITRE : ${marche.titre}
ACHETEUR : ${marche.acheteur}
LIEU : dept ${marche.dept||"?"} — ${marche.distance} km de l'atelier
BUDGET : ${montantTxt}
DÉLAI : ${marche.daysLeft?marche.daysLeft+" jours":"?"}
DESCRIPTION : ${marche.description.slice(0,600)}

Réponds EXACTEMENT avec ces 4 lignes :
🔧 Travaux : (décris ce qu'il faut faire)
📦 Matériaux : (pièces métalliques, garde-corps, etc.)
💰 Budget : (montant ou estimation)
✅ Verdict : Compatible / Peu compatible / À éviter — (raison courte)`;

  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:300,messages:[{role:"user",content:prompt}]})
    });
    const data=await r.json();
    if(data.error) throw new Error(data.error.message);
    const texte=data.content?.map(b=>b.text||"").join("\n").trim()||"";
    res.json({success:true,resume:texte});
  }catch(e){
    console.error("IA:",e.message);
    res.status(500).json({error:"Erreur: "+e.message});
  }
});

app.get('/api/ping',(req,res)=>res.json({status:"ok",message:"Serveur CTS Hervé actif"}));

app.listen(PORT,()=>console.log(`Serveur CTS Hervé port ${PORT}`));
