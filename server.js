<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MarchésAtelier — CTS Hervé</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
:root{
  --bg:#f0f2f7;--surf:#ffffff;--surf2:#f5f7fb;
  --bord:#dde1ef;--txt:#1a1d2e;--mute:#7a7f9a;
  --vert:#16a34a;--orange:#d97706;--rouge:#dc2626;
  --violet:#7c3aed;--bleu:#2563eb;--vert-light:#dcfce7;
  --orange-light:#fef3c7;--rouge-light:#fee2e2;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;min-height:100vh}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#c8cce0;border-radius:3px}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

.header{background:var(--surf);border-bottom:1px solid var(--bord);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;flex-wrap:wrap;gap:8px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.logo{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:var(--vert)}
.logo span{color:var(--txt)}
.logo sub{font-size:10px;color:var(--mute);font-weight:400;font-family:'DM Sans',sans-serif;margin-left:5px}
.badge-live{background:var(--vert-light);border:1px solid #86efac;color:var(--vert);padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;display:flex;align-items:center;gap:5px}
.dot{width:6px;height:6px;background:var(--vert);border-radius:50%;animation:pulse 1.8s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.btn-hdr{background:transparent;border:1px solid var(--bord);border-radius:8px;padding:6px 12px;color:var(--mute);font-size:12px;cursor:pointer;transition:all .2s}
.btn-hdr:hover{border-color:var(--vert);color:var(--vert)}

.tabs{background:var(--surf);border-bottom:1px solid var(--bord);display:flex;padding:0 18px;overflow-x:auto}
.tab{padding:11px 14px;background:none;border:none;color:var(--mute);cursor:pointer;border-bottom:2px solid transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;white-space:nowrap;transition:all .2s}
.tab.active{color:var(--vert);border-bottom-color:var(--vert)}
.tab-badge{background:var(--vert);color:#fff;border-radius:10px;padding:1px 6px;font-size:10px;font-weight:700}

.container{max-width:860px;margin:0 auto;padding:16px 12px}
.panel{display:none}.panel.active{display:block}

.compteurs{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:16px}
.cpt{background:var(--surf);border-radius:11px;padding:11px 12px;text-align:center;border:1px solid var(--bord);box-shadow:0 1px 3px rgba(0,0,0,.04)}
.cpt-l{font-size:10px;color:var(--mute);margin-bottom:4px;font-weight:500}
.cpt-v{font-family:'Syne',sans-serif;font-size:26px;font-weight:800}

.btn-chercher{width:100%;background:var(--vert);border:none;border-radius:12px;padding:15px;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff;cursor:pointer;margin-bottom:13px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 2px 8px rgba(22,163,74,.3)}
.btn-chercher:hover{background:#15803d}
.btn-chercher:disabled{opacity:.5;cursor:not-allowed}

.filtres{display:flex;gap:7px;margin-bottom:10px;flex-wrap:wrap}
.fbtn{background:var(--surf);border:1px solid var(--bord);border-radius:8px;padding:7px 12px;color:var(--mute);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s}
.fbtn.active{border-color:var(--vert);color:var(--vert);background:var(--vert-light)}

.search-bar{background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px;margin-bottom:13px}
.search-bar input{border:none;background:transparent;flex:1;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--txt);outline:none}
.search-bar input::placeholder{color:var(--mute)}

.carte{background:var(--surf);border-radius:13px;padding:15px;margin-bottom:11px;border:1px solid var(--bord);border-left:4px solid;animation:fadeIn .3s ease both;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.c-ref{font-size:10px;color:var(--mute);margin-bottom:5px;font-weight:500}
.c-titre{font-size:14px;font-weight:600;color:var(--txt);margin-bottom:9px;line-height:1.4}
.chips{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.chip{font-size:11px;padding:3px 8px;border-radius:6px;background:var(--surf2);border:1px solid var(--bord);color:var(--mute)}
.chip.v{background:var(--vert-light);border-color:#86efac;color:var(--vert)}
.chip.o{background:var(--orange-light);border-color:#fcd34d;color:var(--orange)}
.c-bottom{display:flex;align-items:center;justify-content:space-between}
.score-box{border-radius:9px;padding:6px 10px;border:1px solid;display:flex;align-items:baseline;gap:3px}
.score-num{font-family:'Syne',sans-serif;font-size:20px;font-weight:800}
.c-lbl{font-size:12px;font-weight:600}
.c-btns{display:flex;gap:7px;align-items:center}
.btn-rond{width:34px;height:34px;border-radius:50%;border:1px solid var(--bord);background:var(--surf);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .2s}
.btn-voir{background:var(--vert);border:none;border-radius:9px;padding:8px 16px;color:#fff;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.btn-voir:hover{background:#15803d}

.lo{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;overflow-y:auto;padding:16px}
.lo.open{display:flex;align-items:flex-start;justify-content:center}
.modal{background:var(--surf);border-radius:16px;width:100%;max-width:580px;padding:20px;margin:auto;box-shadow:0 8px 32px rgba(0,0,0,.15)}
.m-hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}
.m-ref{font-size:11px;color:var(--mute);margin-bottom:4px}
.m-titre{font-size:15px;font-weight:700;color:var(--txt);line-height:1.4}
.btn-close{background:var(--surf2);border:1px solid var(--bord);border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
.ib{background:var(--surf2);border:1px solid var(--bord);border-radius:9px;padding:10px 12px}
.ib-l{font-size:10px;color:var(--mute);margin-bottom:3px;font-weight:500}
.ib-v{font-size:13px;font-weight:600;color:var(--txt)}
.sc-sec{background:var(--surf2);border:1px solid var(--bord);border-radius:10px;padding:13px;margin-bottom:13px}
.sc-t{font-size:11px;font-weight:700;color:var(--mute);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
.sc-row{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.sc-lbl{font-size:12px;color:var(--txt);flex:1}
.sc-bar{flex:1;height:6px;background:var(--bord);border-radius:3px;overflow:hidden}
.sc-fill{height:100%;border-radius:3px;transition:width .5s}
.sc-pts{font-size:11px;font-weight:700;min-width:35px;text-align:right}
.ia-box{background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;padding:14px;margin-bottom:13px}
.ia-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.ia-lbl{font-size:12px;font-weight:700;color:var(--violet)}
.btn-ia{background:var(--violet);border:none;border-radius:8px;padding:7px 14px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-ia:disabled{opacity:.5;cursor:not-allowed}
.ia-txt{font-size:13px;color:var(--txt);line-height:1.75;min-height:40px}
.ia-ligne{margin-bottom:6px}
.m-acts{display:flex;gap:9px;flex-wrap:wrap}
.btn-boamp{background:var(--vert);border:none;border-radius:10px;padding:11px 18px;color:#fff;font-weight:600;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;flex:1;justify-content:center}
.btn-sauv{background:var(--surf2);border:1px solid var(--bord);border-radius:10px;padding:11px 18px;color:var(--txt);font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.btn-sauv.saved{background:var(--vert-light);border-color:#86efac;color:var(--vert)}

.sv-card{background:var(--surf);border:1px solid var(--bord);border-radius:11px;padding:13px;margin-bottom:9px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.sv-titre{font-size:13px;font-weight:600;margin-bottom:6px}
.sv-acts{display:flex;gap:7px;margin-top:9px}
.btn-link{background:transparent;border:1px solid var(--bleu);color:var(--bleu);border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
.btn-del{background:transparent;border:1px solid var(--rouge);color:var(--rouge);border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer}

.cfg-card{background:var(--surf);border:1px solid var(--bord);border-radius:13px;padding:18px;margin-bottom:13px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.cfg-t{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--txt);margin-bottom:10px}
.cfg-sel{width:100%;background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:10px 12px;color:var(--txt);font-family:'DM Sans',sans-serif;font-size:13px;outline:none}
.cfg-sel:focus{border-color:var(--vert)}
.kw-wrap{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.kw{font-size:11px;padding:4px 9px;border-radius:20px;background:var(--vert-light);border:1px solid #86efac;color:var(--vert);cursor:pointer;transition:all .2s}
.kw:hover{background:#fee2e2;border-color:#fca5a5;color:var(--rouge)}
.kw-input-row{display:flex;gap:7px}
.kw-input{flex:1;background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:9px 12px;color:var(--txt);font-family:'DM Sans',sans-serif;font-size:13px;outline:none}
.kw-input:focus{border-color:var(--vert)}
.btn-add{background:var(--vert);border:none;border-radius:8px;padding:9px 16px;color:#fff;font-weight:700;cursor:pointer;font-size:14px}
.btn-reset{background:transparent;border:1px solid var(--bord);border-radius:7px;padding:6px 12px;color:var(--mute);font-size:11px;cursor:pointer;margin-top:8px}

.toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%) translateY(70px);background:var(--txt);color:var(--surf);border-radius:10px;padding:10px 18px;font-size:13px;font-weight:500;z-index:9999;transition:transform .3s;white-space:nowrap}
.toast.show{transform:translateX(-50%) translateY(0)}

.vide{text-align:center;padding:40px 20px;color:var(--mute)}
.sp{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
.sp-v{width:18px;height:18px;border:2.5px solid rgba(124,58,237,.2);border-top-color:var(--violet);border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
</style>
</head>
<body>

<div class="header">
  <div class="logo">Marchés<span>Atelier</span><sub>CTS Hervé</sub></div>
  <div style="display:flex;gap:8px;align-items:center">
    <div class="badge-live" id="badgeLive"><div class="dot"></div><span id="badgeTxt">BOAMP</span></div>
    <button class="btn-hdr" onclick="exportCSV()">📊 Export</button>
  </div>
</div>

<div class="tabs">
  <button class="tab active" id="tabR" onclick="setTab('r',this)">🔍 Recherche</button>
  <button class="tab" id="tabS" onclick="setTab('s',this)">💾 Sauvegardés <span class="tab-badge" id="svBadge">0</span></button>
  <button class="tab" id="tabC" onclick="setTab('c',this)">⚙️ Paramètres</button>
</div>

<!-- RECHERCHE -->
<div class="container">
<div class="panel active" id="panR">
  <div class="compteurs">
    <div class="cpt" style="border-color:#86efac">
      <div class="cpt-l">🟢 Compatibles</div>
      <div class="cpt-v" style="color:var(--vert)" id="cV">0</div>
    </div>
    <div class="cpt" style="border-color:#fcd34d">
      <div class="cpt-l">🟡 À étudier</div>
      <div class="cpt-v" style="color:var(--orange)" id="cO">0</div>
    </div>
    <div class="cpt" style="border-color:#fca5a5">
      <div class="cpt-l">🔴 Peu compat.</div>
      <div class="cpt-v" style="color:var(--rouge)" id="cR">0</div>
    </div>
  </div>

  <div style="background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <span style="font-size:12px;color:var(--mute);flex-shrink:0">📍 Dept :</span>
    <select id="deptQuick" style="background:transparent;border:none;color:var(--txt);font-size:13px;font-weight:600;outline:none;cursor:pointer" onchange="quickDept(this.value)">
      <option value="51">51 — Marne</option>
      <option value="02">02 — Aisne</option><option value="08">08 — Ardennes</option>
      <option value="10">10 — Aube</option><option value="52">52 — Haute-Marne</option>
      <option value="54">54 — Meurthe-et-Moselle</option><option value="55">55 — Meuse</option>
      <option value="57">57 — Moselle</option><option value="67">67 — Bas-Rhin</option>
      <option value="68">68 — Haut-Rhin</option><option value="77">77 — Seine-et-Marne</option>
      <option value="75">75 — Paris</option><option value="88">88 — Vosges</option>
      <option value="89">89 — Yonne</option>
    </select>
    <span style="font-size:11px;color:var(--mute)">|</span>
    <span style="font-size:12px;color:var(--mute);flex-shrink:0">🔑 Mots-clés :</span>
    <div id="kwQuick" style="display:flex;flex-wrap:wrap;gap:4px;flex:1"></div>
  </div>
  <button class="btn-chercher" id="btnChercher" onclick="lancer()">
    <span id="btnTxt">🔄 Chercher maintenant</span>
  </button>

  <div class="filtres">
    <button class="fbtn active" onclick="setF('tous',this)">Tous</button>
    <button class="fbtn" onclick="setF('vert',this)">🟢 Compatibles</button>
    <button class="fbtn" onclick="setF('orange',this)">🟡 À étudier</button>
    <button class="fbtn" onclick="setF('rouge',this)">🔴 Éviter</button>
  </div>
  <div class="filtres">
    <span style="font-size:11px;color:var(--mute);padding:7px 2px;align-self:center">Trier :</span>
    <button class="fbtn active" id="triScore" onclick="setTri('score',this)">🎯 Score</button>
    <button class="fbtn" id="triDist" onclick="setTri('distance',this)">📏 Distance</button>
    <button class="fbtn" id="triDate" onclick="setTri('date',this)">📅 Date</button>
  </div>

  <div class="search-bar">
    <span>🔍</span>
    <input id="searchInput" placeholder="Filtrer par ville, acheteur, titre..." oninput="render()">
  </div>

  <div id="liste"></div>
</div>

<!-- SAUVEGARDÉS -->
<div class="panel" id="panS">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button onclick="goBack()" style="background:var(--surf);border:1px solid var(--bord);border-radius:8px;padding:8px 14px;color:var(--txt);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px">← Retour</button>
    <span style="font-size:14px;font-weight:700">💾 Sauvegardés</span>
  </div>
  <div id="svListe"></div>
</div>

<!-- PARAMÈTRES -->
<div class="panel" id="panC">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <button onclick="goBack()" style="background:var(--surf);border:1px solid var(--bord);border-radius:8px;padding:8px 14px;color:var(--txt);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px">← Retour</button>
    <span style="font-size:14px;font-weight:700">⚙️ Paramètres</span>
  </div>
  <div class="cfg-card">
    <div class="cfg-t">📍 Département de votre atelier</div>
    <select class="cfg-sel" id="cfgDept" onchange="saveDept()">
      <option value="51">51 — Marne</option>
      <option value="02">02 — Aisne</option><option value="08">08 — Ardennes</option>
      <option value="10">10 — Aube</option><option value="52">52 — Haute-Marne</option>
      <option value="54">54 — Meurthe-et-Moselle</option><option value="55">55 — Meuse</option>
      <option value="57">57 — Moselle</option><option value="67">67 — Bas-Rhin</option>
      <option value="68">68 — Haut-Rhin</option><option value="77">77 — Seine-et-Marne</option>
      <option value="75">75 — Paris</option><option value="88">88 — Vosges</option>
      <option value="89">89 — Yonne</option>
    </select>
  </div>

  <div class="cfg-card">
    <div class="cfg-t">🔌 Adresse du serveur</div>
    <input class="cfg-sel" id="cfgSrv" placeholder="https://cts-herve.onrender.com" oninput="saveSrv()">
    <button onclick="testConnexion()" style="margin-top:8px;background:var(--vert);border:none;border-radius:8px;padding:9px 16px;color:#fff;font-weight:600;cursor:pointer;font-size:13px">Tester la connexion</button>
    <div id="srvStatus" style="font-size:12px;margin-top:6px;color:var(--mute)"></div>
  </div>

  <div class="cfg-card">
    <div class="cfg-t">🔑 Mots-clés de recherche</div>
    <p style="font-size:12px;color:var(--mute);margin-bottom:10px">Ces mots sont utilisés pour chercher les annonces sur BOAMP. Cliquer sur un mot pour le supprimer.</p>
    <div class="kw-wrap" id="kwI"></div>
    <div class="kw-input-row">
      <input class="kw-input" id="kwInput" placeholder="Ajouter un mot-clé..." onkeydown="if(event.key==='Enter')addKw()">
      <button class="btn-add" onclick="addKw()">+</button>
    </div>
    <button class="btn-reset" onclick="resetKw()">↺ Réinitialiser par défaut</button>
  </div>
</div>
</div>

<!-- MODAL -->
<div class="lo" id="mo" onclick="closeOut(event)">
<div class="modal">
  <div style="margin-bottom:12px">
    <button onclick="closeModal()" style="background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:7px 14px;color:var(--txt);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px">← Retour aux annonces</button>
  </div>
  <div class="m-hdr">
    <div>
      <div class="m-ref" id="mRef"></div>
      <div class="m-titre" id="mT"></div>
    </div>
    <button class="btn-close" onclick="closeModal()">✕</button>
  </div>
  <div class="info-grid" id="mInfos"></div>
  <div class="sc-sec" id="mSc"></div>
  <div class="ia-box">
    <div class="ia-hdr">
      <div class="ia-lbl">✨ Analyse IA du marché</div>
      <button class="btn-ia" id="btnIA" onclick="iaModal()">Analyser</button>
    </div>
    <div class="ia-txt" id="mIATxt"><em style="color:var(--mute);font-size:12px">Cliquez sur Analyser pour un résumé de l'annonce.</em></div>
  </div>
  <div class="m-acts">
    <a id="mLien" href="#" target="_blank" class="btn-boamp">📄 Voir l'annonce BOAMP</a>
    <button id="btnSv" class="btn-sauv" onclick="toggleSvModal()">💾 Sauvegarder</button>
  </div>
</div>
</div>

<div class="toast" id="toast"></div>

<script>
const KW_DEFAULT = ["sablage","grenaillage","peinture industrielle","anticorrosion",
  "traitement de surface","thermolaquage","métallisation","garde-corps",
  "candélabre","serrurerie acier","mobilier urbain","charpente métallique"];

let marches=[], saved=JSON.parse(localStorage.getItem("cts_sv")||"[]");
let filtre="tous", tri="score", mIdx=null, toastT;

// ── UTILS ──
function goBack(){
  setTab('r', document.getElementById('tabR'));
}
function quickDept(v){
  localStorage.setItem("cts_dept",v);
  const cfgDept=document.getElementById("cfgDept");
  if(cfgDept) cfgDept.value=v;
  showToast("📍 Département: "+v);
}
function renderKwQuick(){
  const el=document.getElementById("kwQuick");
  if(!el)return;
  const kws=getKW();
  el.innerHTML=kws.map(k=>`<span style="font-size:11px;padding:2px 7px;border-radius:12px;background:var(--vert-light);border:1px solid #86efac;color:var(--vert);cursor:pointer;display:inline-flex;align-items:center;gap:3px" onclick="removeKw('${k.replace(/'/g,"\'")}');renderKwQuick()" title="Supprimer">${k} <span style="font-size:10px;opacity:.6">×</span></span>`).join("");
}
function highlightKW(txt){
  const kws=getKW();
  let r=txt;
  for(const k of kws){
    const re=new RegExp('('+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    r=r.replace(re,'<mark style="background:#bbf7d0;color:#166534;border-radius:3px;padding:0 2px">$1</mark>');
  }
  return r;
}
function getSrv(){return localStorage.getItem("cts_srv")||"https://cts-herve.onrender.com";}
function getDept(){return document.getElementById("cfgDept")?.value||localStorage.getItem("cts_dept")||"51";}
function getKW(){const s=localStorage.getItem("cts_kw");return s?JSON.parse(s):[...KW_DEFAULT];}
function cHex(c){return c==="vert"?var_css("--vert"):c==="orange"?var_css("--orange"):var_css("--rouge");}
function var_css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
function cDim(c){return c==="vert"?"rgba(22,163,74,.12)":c==="orange"?"rgba(217,119,6,.12)":"rgba(220,38,38,.12)";}
const lblC={vert:"✅ Compatible (4+ mots)",orange:"🟡 À étudier (2-3 mots)",rouge:"🔴 Peu compatible (1 mot)"};
function showToast(m){
  clearTimeout(toastT);
  const t=document.getElementById("toast");
  t.textContent=m;t.classList.add("show");
  toastT=setTimeout(()=>t.classList.remove("show"),2800);
}
function isSv(id){return saved.some(s=>s.id===id);}

// ── TABS ──
function setTab(t,btn){
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("pan"+t.toUpperCase()).classList.add("active");
  if(t==="s") renderSaved();
  if(t==="c") initCfg();
}

// ── FILTRES ──
function setF(f,btn){
  filtre=f;
  document.querySelectorAll(".filtres .fbtn").forEach(b=>{
    if(["tous","vert","orange","rouge"].some(x=>b.textContent.includes(lblC[x])||b.textContent==="Tous"))
      b.classList.remove("active");
  });
  btn.classList.add("active");
  render();
}
function setTri(t,btn){
  tri=t;
  document.querySelectorAll("#triScore,#triDist,#triDate").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  if(t==="score") marches.sort((a,b)=>b.score-a.score);
  else if(t==="distance") marches.sort((a,b)=>a.distance-b.distance);
  else marches.sort((a,b)=>new Date(b.datePublication)-new Date(a.datePublication));
  render();
}

// ── RECHERCHE ──
async function lancer(){
  const srv=getSrv();
  if(!srv){showToast("⚠️ Configurez l'adresse du serveur dans Paramètres");return;}
  const btn=document.getElementById("btnChercher");
  const txt=document.getElementById("btnTxt");
  btn.disabled=true;
  txt.innerHTML='<span class="sp"></span> Recherche en cours…';
  document.getElementById("liste").innerHTML='<div class="vide">Interrogation du BOAMP…</div>';

  const kw=getKW();
  const dept=getDept();
  const url=`${srv}/api/marches?dept=${dept}&tri=${tri}&kw=${encodeURIComponent(kw.join(","))}`;

  try{
    const res=await fetch(url,{signal:AbortSignal.timeout(60000)});
    const data=await res.json();
    marches=data.marches||[];
    maj();render();
    showToast(`✅ ${marches.length} annonces trouvées`);
    document.getElementById("badgeTxt").textContent=`BOAMP • ${new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`;
  }catch(e){
    document.getElementById("liste").innerHTML='<div class="vide">❌ Erreur de connexion au serveur.</div>';
    showToast("❌ Erreur: "+e.message);
  }finally{
    btn.disabled=false;
    txt.textContent="🔄 Chercher maintenant";
  }
}

function maj(){
  document.getElementById("cV").textContent=marches.filter(m=>m.couleur==="vert").length;
  document.getElementById("cO").textContent=marches.filter(m=>m.couleur==="orange").length;
  document.getElementById("cR").textContent=marches.filter(m=>m.couleur==="rouge").length;
  document.getElementById("svBadge").textContent=saved.length;
}

function render(){
  const q=document.getElementById("searchInput")?.value?.toLowerCase()||"";
  let data=marches.filter(m=>{
    if(filtre!=="tous"&&m.couleur!==filtre) return false;
    if(q&&!((m.titre+m.acheteur+m.ville+m.dept).toLowerCase().includes(q))) return false;
    return true;
  });
  const liste=document.getElementById("liste");
  if(!data.length){liste.innerHTML='<div class="vide">Aucune annonce trouvée.</div>';return;}
  liste.innerHTML=data.map((m,i)=>{
    const idx=marches.indexOf(m);
    const c=cHex(m.couleur),cd=cDim(m.couleur);
    const mt=m.montant?Math.round(m.montant).toLocaleString("fr-FR")+" €":"Prix non communiqué";
    const jours=m.daysLeft!=null?(m.daysLeft>0?m.daysLeft+" j":"EXPIRÉ"):"Délai ?";
    const dp=m.datePublication?new Date(m.datePublication).toLocaleDateString("fr-FR"):"?";
    const sv=isSv(m.id);
    const dist=m.dept&&m.dept!=="00"?`~${m.distance} km`:"dist. ?";
    return`<div class="carte" style="border-left-color:${c};animation-delay:${i*.03}s">
      ${m.reference?`<div class="c-ref">Réf. ${m.reference}</div>`:""}
      <div class="c-titre">${highlightKW(m.titre)}</div>
      <div class="chips">
        <span class="chip">🏢 ${m.acheteur.length>28?m.acheteur.slice(0,27)+"…":m.acheteur}</span>
        <span class="chip">📍 ${m.ville||"—"} (${m.dept||"?"})</span>
        <span class="chip">📏 ${dist}</span>
        ${m.montant?`<span class="chip">💰 ${mt}</span>`:""}
        <span class="chip ${m.daysLeft!=null&&m.daysLeft<14?"o":""}">⏰ ${jours}</span>
        <span class="chip">📅 ${dp}</span>
        <span class="chip ${m.typeAtelier==="✓ Pièces atelier"?"v":""}">${m.typeAtelier||"? À vérifier"}</span>
      </div>
      <div class="c-bottom">
        <div style="display:flex;align-items:center;gap:9px">
          <div class="score-box" style="background:${cd};border-color:${c}50">
            <span class="score-num" style="color:${c}">${m.score}</span>
            <span style="font-size:10px;color:var(--mute)">pts</span>
          </div>
          <span class="c-lbl" style="color:${c}">${lblC[m.couleur]}</span>
        </div>
        <div class="c-btns">
          <button class="btn-rond" style="${sv?"border-color:var(--vert);background:var(--vert-light);color:var(--vert)":""}" onclick="toggleSv(${idx})">${sv?"✓":"💾"}</button>
          <button class="btn-voir" onclick="openModal(${idx})">Voir ➜</button>
        </div>
      </div>
    </div>`;
  }).join("");
}

// ── MODAL ──
function openModal(idx){
  const m=marches[idx];if(!m)return;mIdx=idx;
  const c=cHex(m.couleur);
  document.getElementById("mRef").textContent=m.reference?"Réf. "+m.reference:"";
  document.getElementById("mT").textContent=m.titre;
  document.getElementById("mLien").href=m.urlDirecte||"#";
  const mt=m.montant?Math.round(m.montant).toLocaleString("fr-FR")+" €":"Prix non communiqué";
  const dl=m.daysLeft!=null?(m.daysLeft>0?m.daysLeft+" jours restants":"⚠️ Expiré"):"Non précisé";
  const dp=m.datePublication?new Date(m.datePublication).toLocaleDateString("fr-FR"):"?";
  const dist=m.dept&&m.dept!=="00"?m.distance+" km de l'atelier":"Distance inconnue";

  document.getElementById("mInfos").innerHTML=[
    ["🏢 Acheteur",m.acheteur||"—"],
    ["📍 Lieu",(m.ville||"—")+" ("+m.dept+")"],
    ["📏 Distance",dist],
    ["📅 Publié le",dp],
    ["⏰ Délai réponse",dl],
    ["💰 Montant",mt],
  ].map(([k,v])=>`<div class="ib"><div class="ib-l">${k}</div><div class="ib-v">${v}</div></div>`).join("");

  // Score : correspondance métier en 1er, sans "temps pour répondre"
  const scDetails=(m.scoreDetails||[]).filter(d=>!d.l.toLowerCase().includes("temps"));
  document.getElementById("mSc").innerHTML=`<div class="sc-t">Score : ${m.score} pts — ${lblC[m.couleur]}</div>`+
    scDetails.map(d=>`<div class="sc-row">
      <span class="sc-lbl">${d.l}</span>
      <div class="sc-bar"><div class="sc-fill" style="width:${d.mx>0?Math.round(Math.max(0,d.p)/d.mx*100):0}%;background:${c}"></div></div>
      <span class="sc-pts" style="color:${c}">${d.p}${d.mx>0?"/"+d.mx:""}</span>
    </div>`).join("");

  const div=document.getElementById("mIATxt");
  const btn=document.getElementById("btnIA");
  if(m.aiSummary){
    div.innerHTML=m.aiSummary.split("\n").filter(l=>l.trim()).map(l=>`<div class="ia-ligne">${l}</div>`).join("");
    btn.textContent="🔄 Re-analyser";
  }else{
    div.innerHTML='<em style="color:var(--mute);font-size:12px">Cliquez sur Analyser pour un résumé de l\'annonce.</em>';
    btn.textContent="✨ Analyser";
  }
  btn.disabled=false;
  const sv=isSv(m.id);
  const bs=document.getElementById("btnSv");
  bs.textContent=sv?"✓ Sauvegardé":"💾 Sauvegarder";
  bs.className="btn-sauv"+(sv?" saved":"");
  document.getElementById("mo").classList.add("open");
  history.pushState({modal:true},"","#modal");
}

function closeModal(){
  document.getElementById("mo").classList.remove("open");
  mIdx=null;
}
function closeOut(e){if(e.target===document.getElementById("mo"))closeModal();}
window.addEventListener("popstate", function() {
  if(document.getElementById("mo").classList.contains("open")){
    closeModal();
  }
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape") closeModal();
});

// ── IA ──
async function iaModal(){
  if(mIdx===null)return;
  const m=marches[mIdx];
  const srv=getSrv();
  if(!srv){showToast("⚠️ Serveur non configuré");return;}
  const btn=document.getElementById("btnIA");
  const div=document.getElementById("mIATxt");
  btn.disabled=true;btn.textContent="Analyse…";
  div.innerHTML='<span class="sp-v"></span> Analyse en cours…';
  try{
    const res=await fetch(`${srv}/api/analyser`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({marche:m}),
      signal:AbortSignal.timeout(30000)
    });
    const data=await res.json();
    if(!data.success) throw new Error(data.error||"Erreur serveur");
    marches[mIdx].aiSummary=data.resume;
    div.innerHTML=data.resume.split("\n").filter(l=>l.trim()).map(l=>`<div class="ia-ligne">${l}</div>`).join("");
    btn.textContent="🔄 Re-analyser";btn.disabled=false;
    showToast("✨ Analyse prête");
  }catch(e){
    div.innerHTML=`<em style="color:var(--rouge);font-size:12px">Erreur: ${e.message}</em>`;
    btn.textContent="↻ Réessayer";btn.disabled=false;
  }
}

// ── SAUVEGARDÉS ──
function toggleSv(idx){
  const m=marches[idx];if(!m)return;
  if(isSv(m.id)) saved=saved.filter(s=>s.id!==m.id);
  else saved.push({id:m.id,reference:m.reference,titre:m.titre,acheteur:m.acheteur,
    ville:m.ville,dept:m.dept,score:m.score,couleur:m.couleur,urlDirecte:m.urlDirecte,
    datePublication:m.datePublication,aiSummary:m.aiSummary||""});
  localStorage.setItem("cts_sv",JSON.stringify(saved));
  document.getElementById("svBadge").textContent=saved.length;
  render();
}
function toggleSvModal(){
  if(mIdx===null)return;
  toggleSv(mIdx);
  const sv=isSv(marches[mIdx].id);
  const bs=document.getElementById("btnSv");
  bs.textContent=sv?"✓ Sauvegardé":"💾 Sauvegarder";
  bs.className="btn-sauv"+(sv?" saved":"");
  showToast(sv?"💾 Sauvegardé":"🗑️ Retiré des sauvegardés");
}
function renderSaved(){
  const el=document.getElementById("svListe");
  if(!saved.length){el.innerHTML='<div class="vide">Aucun marché sauvegardé.</div>';return;}
  el.innerHTML=saved.map((s,i)=>{
    const c=s.couleur==="vert"?var_css("--vert"):s.couleur==="orange"?var_css("--orange"):var_css("--rouge");
    const dp=s.datePublication?new Date(s.datePublication).toLocaleDateString("fr-FR"):"?";
    return`<div class="sv-card" style="border-left:4px solid ${c}">
      <div class="sv-titre">${s.titre}</div>
      <div style="font-size:11px;color:var(--mute)">${s.acheteur} — ${s.ville||"?"} (${s.dept||"?"}) — Score: ${s.score}/100 — Publié ${dp}</div>
      ${s.aiSummary?`<div style="font-size:12px;color:var(--txt);margin-top:7px;line-height:1.6">${s.aiSummary.split("\n").filter(l=>l.trim()).map(l=>`<div>${l}</div>`).join("")}</div>`:""}
      <div class="sv-acts">
        <a href="${s.urlDirecte||'#'}" target="_blank" class="btn-link">📄 BOAMP</a>
        <button class="btn-del" onclick="delSv(${i})">🗑️ Supprimer</button>
      </div>
    </div>`;
  }).join("");
}
function delSv(i){saved.splice(i,1);localStorage.setItem("cts_sv",JSON.stringify(saved));document.getElementById("svBadge").textContent=saved.length;renderSaved();}

// ── CONFIG ──
function initCfg(){
  const dept=localStorage.getItem("cts_dept")||"51";
  document.getElementById("cfgDept").value=dept;
  document.getElementById("cfgSrv").value=getSrv();
  renderKW();
}
function saveDept(){
  localStorage.setItem("cts_dept",document.getElementById("cfgDept").value);
  showToast("✅ Département sauvegardé");
}
function saveSrv(){localStorage.setItem("cts_srv",document.getElementById("cfgSrv").value);}
async function testConnexion(){
  const srv=getSrv();
  const st=document.getElementById("srvStatus");
  st.textContent="Test en cours…";st.style.color="var(--mute)";
  try{
    const r=await fetch(`${srv}/api/ping`,{signal:AbortSignal.timeout(8000)});
    const d=await r.json();
    st.textContent="✅ "+d.message;st.style.color="var(--vert)";
  }catch(e){
    st.textContent="❌ Connexion impossible";st.style.color="var(--rouge)";
  }
}

// ── MOTS-CLÉS ──
function getKW(){const s=localStorage.getItem("cts_kw");return s?JSON.parse(s):[...KW_DEFAULT];}
function saveKW(kws){localStorage.setItem("cts_kw",JSON.stringify(kws));renderKW();}
function addKw(){
  const inp=document.getElementById("kwInput");
  const val=inp.value.trim().toLowerCase();
  if(!val)return;
  const kws=getKW();
  if(!kws.includes(val)){kws.push(val);saveKW(kws);showToast("✅ Mot-clé ajouté");}
  inp.value="";
}
function removeKw(k){const kws=getKW().filter(x=>x!==k);saveKW(kws);showToast("🗑️ Supprimé");}
function resetKw(){localStorage.removeItem("cts_kw");renderKW();showToast("↺ Mots-clés réinitialisés");}
function renderKW(){
  const ki=document.getElementById("kwI");
  if(!ki)return;
  ki.innerHTML=getKW().map(k=>`<span class="kw" onclick="removeKw('${k.replace(/'/g,"\\'")}')">✓ ${k} ×</span>`).join("");
}

// ── EXPORT ──
function exportCSV(){
  if(!marches.length){showToast("⚠️ Lancez d'abord une recherche");return;}
  const rows=[["Référence","Titre","Acheteur","Ville","Dept","Distance","Score","Compatibilité","Montant","Délai","URL"]];
  marches.forEach(m=>rows.push([m.reference,m.titre,m.acheteur,m.ville,m.dept,m.distance,m.score,lblC[m.couleur],m.montant||"",m.daysLeft||"",m.urlDirecte]));
  const csv=rows.map(r=>r.map(v=>`"${(v||"").toString().replace(/"/g,'""')}"`).join(";")).join("\n");
  const a=document.createElement("a");
  a.href="data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv);
  a.download=`marches-cts-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast("📊 Export CSV téléchargé");
}

// ── INIT ──
document.addEventListener("DOMContentLoaded",()=>{
  const dept=localStorage.getItem("cts_dept")||"51";
  const cfgDept=document.getElementById("cfgDept");
  if(cfgDept) cfgDept.value=dept;
  document.getElementById("cfgSrv").value=getSrv();
  document.getElementById("svBadge").textContent=saved.length;
  renderKW();
  renderKwQuick();
  const dq=document.getElementById("deptQuick");
  if(dq) dq.value=localStorage.getItem("cts_dept")||"51";
});
</script>
</body>
</html>
