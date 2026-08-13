(() => {
  "use strict";

  const AUDIO_BASE = "https://djtguide.neocities.org/kana/audio/";
  const STORAGE_KEY = "kana-v2-settings";
  const PROGRESS_KEY = "kana-v2-progress";

  const kanaRows = {
    vowel: [
      ["あ","ア","a"],["い","イ","i"],["う","ウ","u"],["え","エ","e"],["お","オ","o"]
    ],
    k: [["か","カ","ka"],["き","キ","ki"],["く","ク","ku"],["け","ケ","ke"],["こ","コ","ko"]],
    s: [["さ","サ","sa"],["し","シ","shi"],["す","ス","su"],["せ","セ","se"],["そ","ソ","so"]],
    t: [["た","タ","ta"],["ち","チ","chi"],["つ","ツ","tsu"],["て","テ","te"],["と","ト","to"]],
    n: [["な","ナ","na"],["に","ニ","ni"],["ぬ","ヌ","nu"],["ね","ネ","ne"],["の","ノ","no"]],
    h: [["は","ハ","ha"],["ひ","ヒ","hi"],["ふ","フ","fu",["fu","hu"]],["へ","ヘ","he"],["ほ","ホ","ho"]],
    m: [["ま","マ","ma"],["み","ミ","mi"],["む","ム","mu"],["め","メ","me"],["も","モ","mo"]],
    y: [["や","ヤ","ya"],["ゆ","ユ","yu"],["よ","ヨ","yo"]],
    r: [["ら","ラ","ra"],["り","リ","ri"],["る","ル","ru"],["れ","レ","re"],["ろ","ロ","ro"]],
    w: [["わ","ワ","wa"],["を","ヲ","o",["o","wo"]]],
    nn: [["ん","ン","n"]],
    g: [["が","ガ","ga"],["ぎ","ギ","gi"],["ぐ","グ","gu"],["げ","ゲ","ge"],["ご","ゴ","go"]],
    z: [["ざ","ザ","za"],["じ","ジ","ji"],["ず","ズ","zu"],["ぜ","ゼ","ze"],["ぞ","ゾ","zo"]],
    d: [["だ","ダ","da"],["ぢ","ヂ","ji"],["づ","ヅ","zu"],["で","デ","de"],["ど","ド","do"]],
    b: [["ば","バ","ba"],["び","ビ","bi"],["ぶ","ブ","bu"],["べ","ベ","be"],["ぼ","ボ","bo"]],
    p: [["ぱ","パ","pa"],["ぴ","ピ","pi"],["ぷ","プ","pu"],["ぺ","ペ","pe"],["ぽ","ポ","po"]],
    kya: [["きゃ","キャ","kya"],["きゅ","キュ","kyu"],["きょ","キョ","kyo"]],
    sha: [["しゃ","シャ","sha"],["しゅ","シュ","shu"],["しょ","ショ","sho"]],
    cha: [["ちゃ","チャ","cha"],["ちゅ","チュ","chu"],["ちょ","チョ","cho"]],
    nya: [["にゃ","ニャ","nya"],["にゅ","ニュ","nyu"],["にょ","ニョ","nyo"]],
    hya: [["ひゃ","ヒャ","hya"],["ひゅ","ヒュ","hyu"],["ひょ","ヒョ","hyo"]],
    mya: [["みゃ","ミャ","mya"],["みゅ","ミュ","myu"],["みょ","ミョ","myo"]],
    rya: [["りゃ","リャ","rya"],["りゅ","リュ","ryu"],["りょ","リョ","ryo"]],
    gya: [["ぎゃ","ギャ","gya"],["ぎゅ","ギュ","gyu"],["ぎょ","ギョ","gyo"]],
    ja: [["じゃ","ジャ","ja"],["じゅ","ジュ","ju"],["じょ","ジョ","jo"]],
    ja2: [["ぢゃ","ヂャ","ja"],["ぢゅ","ヂュ","ju"],["ぢょ","ヂョ","jo"]],
    bya: [["びゃ","ビャ","bya"],["びゅ","ビュ","byu"],["びょ","ビョ","byo"]],
    pya: [["ぴゃ","ピャ","pya"],["ぴゅ","ピュ","pyu"],["ぴょ","ピョ","pyo"]]
  };

  const regularRowKeys = ["vowel","k","s","t","n","h","m","y","r","w","nn","g","z","d","b","p"];
  const comboRowKeys = ["kya","sha","cha","nya","hya","mya","rya","gya","ja","ja2","bya","pya"];
  const allRowKeys = [...regularRowKeys, ...comboRowKeys];
  const rowLabels = {
    vowel:"Vowels", k:"K row", s:"S row", t:"T row", n:"N row", h:"H row", m:"M row", y:"Y row", r:"R row", w:"W row", nn:"ん / ン",
    g:"G dakuten", z:"Z dakuten", d:"D dakuten", b:"B dakuten", p:"P handakuten",
    kya:"K combinations", sha:"S combinations", cha:"Ch combinations", nya:"N combinations", hya:"H combinations", mya:"M combinations", rya:"R combinations", gya:"G combinations", ja:"J combinations", ja2:"J (ぢ) combinations", bya:"B combinations", pya:"P combinations"
  };

  const stages = [
    {name:"Vowels", keys:["vowel"]},
    {name:"Consonant K", keys:["k"]},
    {name:"Consonant S", keys:["s"]},
    {name:"Consonant T", keys:["t"]},
    {name:"Consonant N", keys:["n"]},
    {name:"Consonant H", keys:["h"]},
    {name:"Consonant M", keys:["m"]},
    {name:"Consonant Y", keys:["y"]},
    {name:"Consonant R", keys:["r"]},
    {name:"Consonant W", keys:["w"]},
    {name:"Consonant N (single)", keys:["nn"]},
    {name:"Dakuten", keys:["g","z","d","b","p"]},
    {name:"Combinations", keys:comboRowKeys}
  ];

  const hiraganaWords = [
    ["あさごはん","asagohan"],["あした","ashita"],["あそぶ","asobu"],["あたま","atama"],["あぶない","abunai"],["あまい","amai"],["あるく","aruku"],["いくら","ikura"],["いそぐ","isogu"],["いっしょ","issho"],
    ["うたう","utau"],["えいが","eiga"],["えきまえ","ekimae"],["おいしい","oishii"],["おきる","okiru"],["おしえる","oshieru"],["おとな","otona"],["おねがい","onegai"],["およぐ","oyogu"],["おんがく","ongaku"],
    ["かいしゃ","kaisha"],["かぞく","kazoku"],["がっこう","gakkou"],["からだ","karada"],["かわいい","kawaii"],["きっぷ","kippu"],["きょう","kyou"],["ぎんこう","ginkou"],["くるま","kuruma"],["こうえん","kouen"],
    ["ことば","kotoba"],["さくら","sakura"],["しごと","shigoto"],["じしょ","jisho"],["しゃしん","shashin"],["しゅくだい","shukudai"],["しんぶん","shinbun"],["すみません","sumimasen"],["せんせい","sensei"],["そろそろ","sorosoro"],
    ["だいがく","daigaku"],["たのしい","tanoshii"],["たべもの","tabemono"],["ちかてつ","chikatetsu"],["ちょっと","chotto"],["つくえ","tsukue"],["てがみ","tegami"],["でんしゃ","densha"],["としょかん","toshokan"],["なまえ","namae"],
    ["にほんご","nihongo"],["のみもの","nomimono"],["はじめる","hajimeru"],["ひこうき","hikouki"],["びょういん","byouin"],["ふくろ","fukuro"],["べんきょう","benkyou"],["まいにち","mainichi"],["みず","mizu"],["むずかしい","muzukashii"],
    ["やさい","yasai"],["ゆうびんきょく","yuubinkyoku"],["よる","yoru"],["りょこう","ryokou"],["れんしゅう","renshuu"],["わかる","wakaru"]
  ];
  const katakanaWords = [
    ["アニメ","anime"],["アイス","aisu"],["アメリカ","amerika"],["エアコン","eakon"],["オレンジ","orenji"],["カメラ","kamera"],["カレー","karee"],["ギター","gitaa"],["ゲーム","geemu"],["コーヒー","koohii"],
    ["コンビニ","konbini"],["サラダ","sarada"],["サンドイッチ","sandoicchi"],["シャワー","shawaa"],["ジュース","juusu"],["スーパー","suupaa"],["スプーン","supuun"],["スポーツ","supootsu"],["タクシー","takushii"],["テレビ","terebi"],
    ["テスト","tesuto"],["デパート","depaato"],["トイレ","toire"],["ノート","nooto"],["バス","basu"],["パーティー","paatii"],["パン","pan"],["ホテル","hoteru"],["ボール","booru"],["メニュー","menyuu"],
    ["ラジオ","rajio"],["レストラン","resutoran"],["ワイン","wain"],["インターネット","intaanetto"],["スマートフォン","sumaato fon"],["チョコレート","chokoreeto"],["ドア","doa"],["フォーク","fooku"],["ベッド","beddo"],["ミルク","miruku"]
  ];

  const basicNumbers = [
    {n:0,k:"零",r:["zero","rei"]},{n:1,k:"一",r:["ichi"]},{n:2,k:"二",r:["ni"]},{n:3,k:"三",r:["san"]},{n:4,k:"四",r:["yon","shi"]},{n:5,k:"五",r:["go"]},
    {n:6,k:"六",r:["roku"]},{n:7,k:"七",r:["nana","shichi"]},{n:8,k:"八",r:["hachi"]},{n:9,k:"九",r:["kyuu","ku"]},{n:10,k:"十",r:["juu"]},{n:100,k:"百",r:["hyaku"]},{n:1000,k:"千",r:["sen"]},{n:10000,k:"万",r:["man"]}
  ];

  const defaultSettings = {
    theme:"light",
    textSize:100,
    font:"system",
    customFont:"",
    autoplay:false,
    showCorrect:true,
    script:"hiragana",
    freeScripts:"both",
    freeRows:["vowel","k","s","t","n"],
    wordScripts:"both",
    numberPhase:"basic",
    numberMode:"kanji_to_romaji",
    numberRange:9999
  };

  const defaultProgress = {
    total:0, correct:0, streak:0, bestStreak:0,
    recent:[], bruteStage:{hiragana:0,katakana:0},
    completed:[]
  };

  function readJSON(key, fallback){
    try { return {...fallback, ...(JSON.parse(localStorage.getItem(key) || "{}"))}; }
    catch { return {...fallback}; }
  }

  const state = {
    page:"home",
    settings:readJSON(STORAGE_KEY, defaultSettings),
    progress:readJSON(PROGRESS_KEY, defaultProgress),
    chartScript:"hiragana",
    practice:null,
    toastTimer:null,
    audioUnlocked:false
  };

  if (!Array.isArray(state.settings.freeRows) || !state.settings.freeRows.length) state.settings.freeRows = ["vowel"];
  if (!Array.isArray(state.progress.recent)) state.progress.recent=[];

  function saveSettings(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings)); }
  function saveProgress(){ localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); }

  const FONT_MAP = {
    system:'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    verdana:'Verdana,Geneva,sans-serif',
    arial:'Arial,Helvetica,sans-serif',
    serif:'Georgia,"Times New Roman",serif',
    mono:'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace'
  };
  function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
  function safeFontName(value){ return String(value||"").replace(/[;{}]/g,"").trim().slice(0,80); }
  function applyAccessibility(){
    const root=document.documentElement;
    const theme=["light","dark","warm","contrast"].includes(state.settings.theme)?state.settings.theme:"light";
    const size=clamp(Number(state.settings.textSize)||100,85,140);
    let font=FONT_MAP[state.settings.font]||FONT_MAP.system;
    if(state.settings.font==="custom" && safeFontName(state.settings.customFont)){
      const clean=safeFontName(state.settings.customFont).replace(/"/g,"");
      font=`"${clean}", ${FONT_MAP.system}`;
    }
    root.dataset.theme=theme;
    root.style.setProperty("--text-scale",String(size/100));
    root.style.setProperty("--ui-font",font);
  }
  function escapeHTML(str){ return String(str).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
  function normalize(str){ return String(str).trim().toLowerCase().replace(/\s+/g, "").replace(/[’']/g,""); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function shuffled(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function toItem(tuple, script){ return {char:script==="katakana"?tuple[1]:tuple[0], romaji:tuple[2], answers:tuple[3]||[tuple[2]], tuple}; }
  function getRows(keys, script){ return keys.flatMap(k => kanaRows[k].map(t=>toItem(t,script))); }
  function accuracy(){ return state.progress.total ? Math.round((state.progress.correct/state.progress.total)*100) : 0; }
  function todayLabel(){ return new Date().toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"}); }

  function toast(message){
    let el=document.querySelector(".toast");
    if(!el){ el=document.createElement("div"); el.className="toast"; document.body.appendChild(el); }
    el.textContent=message; el.classList.add("show"); clearTimeout(state.toastTimer); state.toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
  }

  function audioUrl(romaji){ return `${AUDIO_BASE}${encodeURIComponent(romaji)}.mp3`; }
  async function playKanaAudio(romaji, quiet=false){
    try {
      const audio=new Audio(audioUrl(romaji));
      audio.preload="auto";
      await audio.play();
      state.audioUnlocked=true;
      return true;
    } catch(e) {
      if(!quiet) toast("Audio was blocked. Tap the speaker once, then autoplay will work.");
      return false;
    }
  }
  function speakJapanese(text, quiet=false){
    if(!("speechSynthesis" in window)) { if(!quiet) toast("Speech synthesis is not available in this browser."); return; }
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang="ja-JP"; u.rate=.86; speechSynthesis.speak(u);
    state.audioUnlocked=true;
  }
  function playCurrentSound(quiet=false){
    const p=state.practice; if(!p || !p.current) return;
    if(p.kind==="kana" || p.kind==="brute") return playKanaAudio(p.current.romaji, quiet);
    if(p.kind==="word") return speakJapanese(p.current.char, quiet);
    if(p.kind==="number") return speakJapanese(p.current.speech || p.current.prompt, quiet);
  }
  function maybeAutoplay(){
    if(!state.settings.autoplay || !state.practice) return;
    setTimeout(()=>playCurrentSound(true),100);
  }

  function recordResult(correct, label){
    state.progress.total++;
    if(correct){ state.progress.correct++; state.progress.streak++; state.progress.bestStreak=Math.max(state.progress.bestStreak,state.progress.streak); }
    else state.progress.streak=0;
    state.progress.recent.unshift({correct,label,t:Date.now()});
    state.progress.recent=state.progress.recent.slice(0,20);
    saveProgress();
  }

  function shell(content){
    const pageTitle = ({home:"Study",chart:"Kana chart",settings:"Settings"})[state.page] || (state.practice?.title || "Practice");
    return `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="brand"><div class="brand-mark">かな</div><div><h1>Kana</h1></div></div>
          <nav class="nav">
            ${navButton("home","⌂","Study")}
            ${navButton("chart","字","Kana chart")}
            ${navButton("settings","⚙","Settings")}
          </nav>
          <div class="sidebar-spacer"></div>
          <div class="sidebar-card"><b>Shortcuts</b><p>Enter submits typed answers. Press S during practice to replay the current sound.</p></div>
        </aside>
        <main class="main">
          <header class="topbar">
            <div class="topbar-title"><h2>${escapeHTML(pageTitle)}</h2><span>${todayLabel()}</span></div>
            <div class="topbar-actions">
              <button class="pill-btn" id="audio-toggle" data-on="${state.settings.autoplay}" title="Sound on sight"><span>♫</span><span class="audio-text">Sound ${state.settings.autoplay?"on":"off"}</span></button>
              <button class="icon-btn a11y-open" id="a11y-open" title="Accessibility settings" aria-haspopup="dialog" aria-controls="a11y-panel" aria-label="Accessibility settings" aria-expanded="false">Aa</button>
            </div>
          </header>
          <div class="content">${content}</div>
        </main>
        <nav class="mobile-nav">
          ${mobileNav("home","⌂","Study")}${mobileNav("chart","字","Chart")}${mobileNav("settings","⚙","Settings")}
        </nav>
        ${accessibilityPanel()}
      </div>`;
  }
  function accessibilityPanel(){
    const theme=state.settings.theme||"light";
    const font=state.settings.font||"system";
    const size=clamp(Number(state.settings.textSize)||100,85,140);
    return `
      <div class="a11y-backdrop" id="a11y-backdrop" hidden></div>
      <aside class="a11y-panel" id="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-title" hidden>
        <div class="a11y-head"><h2 id="a11y-title">Accessibility</h2><button class="a11y-close" id="a11y-close" aria-label="Close accessibility settings">×</button></div>
        <div class="a11y-group">
          <span class="a11y-label">Theme</span>
          <div class="theme-grid">${[["light","Light"],["dark","Dark"],["warm","Warm"],["contrast","High contrast"]].map(([v,l])=>`<button class="theme-btn ${theme===v?"on":""}" data-a11y-theme="${v}" aria-pressed="${theme===v}">${l}</button>`).join("")}</div>
        </div>
        <div class="a11y-group">
          <label class="a11y-label" for="a11y-text-size">Text size</label>
          <div class="range-row"><input id="a11y-text-size" type="range" min="85" max="140" step="5" value="${size}"><output id="a11y-text-value">${size}%</output></div>
        </div>
        <div class="a11y-group">
          <label class="a11y-label" for="a11y-font">Font</label>
          <select id="a11y-font" class="a11y-select">
            ${[["system","System"],["verdana","Verdana"],["arial","Arial"],["serif","Serif"],["mono","Monospace"],["custom","Custom installed font…"]].map(([v,l])=>`<option value="${v}" ${font===v?"selected":""}>${l}</option>`).join("")}
          </select>
          <input id="a11y-custom-font" class="a11y-custom-font" type="text" value="${escapeHTML(state.settings.customFont||"")}" placeholder="Font name, e.g. Lexend" aria-label="Custom installed font name" ${font==="custom"?"":"hidden"}>
        </div>
        <button class="a11y-reset" id="a11y-reset">Reset accessibility settings</button>
      </aside>`;
  }
  function navButton(page,ico,label){ return `<button class="nav-btn ${state.page===page?"active":""}" data-nav="${page}"><span class="nav-ico">${ico}</span>${label}</button>`; }
  function mobileNav(page,ico,label){ return `<button class="${state.page===page?"active":""}" data-nav="${page}"><span>${ico}</span><span>${label}</span></button>`; }

  function render(){
    let content="";
    if(state.page==="home") content=renderHome();
    else if(state.page==="chart") content=renderChart();
    else if(state.page==="settings") content=renderSettings();
    else content=renderPractice();
    document.getElementById("app").innerHTML=shell(content);
    wireGlobal();
    if(state.page.startsWith("practice")) wirePractice();
    else if(state.page==="chart") wireChart();
    else if(state.page==="settings") wireSettings();
    else if(state.page==="home") wireHome();
  }

  function renderHome(){
    return `
      <section class="tool-overview">
        <div>
          <h3>Practice</h3>
          <p>Choose a mode.</p>
        </div>
        <div class="tool-stats" aria-label="Saved practice statistics">
          <div><b>${accuracy()}%</b><span>accuracy</span></div>
          <div><b>${state.progress.total}</b><span>answers</span></div>
          <div><b>${state.progress.streak}</b><span>streak</span></div>
          <div><b>${state.settings.autoplay?"On":"Off"}</b><span>sound on sight</span></div>
        </div>
      </section>
      <section class="mode-grid tool-mode-grid">
        ${modeCard("brute","↗","Brute Force","Structured row-by-row learning with review stages.")}
        ${modeCard("free","◎","Free Practice","Choose the scripts and kana rows you want to drill.")}
        ${modeCard("word","文","Word Mode","Practice kana in common hiragana and katakana words.")}
        ${modeCard("number","百","Numbers","Practice Japanese number readings and compound values.")}
      </section>`;
  }
  function modeCard(id,ico,title,desc){ return `<button class="mode-card" data-start="${id}"><span class="mode-icon">${ico}</span><h4>${title}</h4><p>${desc}</p></button>`; }

  function wireHome(){ document.querySelectorAll("[data-start]").forEach(b=>b.addEventListener("click",()=>startPractice(b.dataset.start))); }

  function startPractice(mode){
    if(mode==="brute") initBrute();
    if(mode==="free") initFree();
    if(mode==="word") initWord();
    if(mode==="number") initNumber();
    state.page="practice-"+mode; render(); maybeAutoplay();
  }

  function initBase(kind,title){
    return {kind,title,correct:0,total:0,feedback:"",feedbackType:"",lastAnswer:"",locked:false,current:null,queue:[],misses:[],seen:0};
  }
  function nextFromQueue(p, pool){
    if(p.misses.length && Math.random()<.35) return p.misses.shift();
    if(!p.queue.length) p.queue=shuffled(pool);
    let item=p.queue.shift();
    if(pool.length>1 && p.current && item===p.current){ p.queue.push(item); item=p.queue.shift(); }
    return item;
  }

  function initBrute(){
    const script=state.settings.script;
    const stageIndex=Math.min(state.progress.bruteStage?.[script] || 0, stages.length-1);
    const p=initBase("brute","Brute Force");
    Object.assign(p,{script,stageIndex,phase:"learn",stageScore:0,stageAttempts:0,firstSeen:new Set(),reviewWindow:[]});
    p.pool=brutePool(p); p.current=nextFromQueue(p,p.pool); state.practice=p;
  }
  function brutePool(p){
    const keys=p.phase==="learn" ? stages[p.stageIndex].keys : stages.slice(0,p.stageIndex+1).flatMap(s=>s.keys);
    return getRows(keys,p.script);
  }
  function bruteProgress(p){
    const threshold=p.phase==="learn" ? Math.max(10,p.pool.length*3) : 20;
    return Math.min(100,Math.round((p.stageScore/threshold)*100));
  }

  function initFree(){
    const p=initBase("kana","Free practice");
    p.scripts=state.settings.freeScripts; p.rows=[...state.settings.freeRows]; p.pool=freePool(p); p.current=nextFromQueue(p,p.pool); state.practice=p;
  }
  function freePool(p){
    const scripts=p.scripts==="both"?["hiragana","katakana"]:[p.scripts];
    return scripts.flatMap(s=>getRows(p.rows,s));
  }

  function initWord(){
    const p=initBase("word","Word mode"); p.scripts=state.settings.wordScripts; p.pool=wordPool(p); p.current=nextFromQueue(p,p.pool); state.practice=p;
  }
  function wordPool(p){
    let out=[];
    if(p.scripts==="both"||p.scripts==="hiragana") out.push(...hiraganaWords.map(([char,answer])=>({char,answer,answers:[answer],romaji:answer,script:"hiragana"})));
    if(p.scripts==="both"||p.scripts==="katakana") out.push(...katakanaWords.map(([char,answer])=>({char,answer:answer.replace(/\s/g,""),answers:[answer.replace(/\s/g,"")],romaji:answer,script:"katakana"})));
    return out;
  }

  function initNumber(){
    const p=initBase("number","Number practice"); Object.assign(p,{phase:state.settings.numberPhase,mode:state.settings.numberMode,range:state.settings.numberRange}); p.current=nextNumber(p); state.practice=p;
  }

  function numberToKanji(n){
    if(n===0) return "零";
    const digitKanji=["","一","二","三","四","五","六","七","八","九"];
    const units=[[10000,"万"],[1000,"千"],[100,"百"],[10,"十"]];
    let out="",rest=n;
    for(const [value,k] of units){
      const count=Math.floor(rest/value);
      if(count){ if(count>1) out+=digitKanji[count]; out+=k; rest%=value; }
    }
    if(rest) out+=digitKanji[rest];
    return out;
  }
  function numberToRomaji(n){
    if(n===0) return "zero";
    const ones=["","ichi","ni","san","yon","go","roku","nana","hachi","kyuu"];
    const under100=(x)=>{
      if(x<10) return ones[x];
      const tens=Math.floor(x/10),o=x%10; return (tens===1?"juu":ones[tens]+"juu")+(o?ones[o]:"");
    };
    const under1000=(x)=>{
      const h=Math.floor(x/100),r=x%100; let s="";
      if(h){ s=({1:"hyaku",3:"sanbyaku",6:"roppyaku",8:"happyaku"}[h]||ones[h]+"hyaku"); }
      return s+(r?under100(r):"");
    };
    const under10000=(x)=>{
      const th=Math.floor(x/1000),r=x%1000; let s="";
      if(th){ s=({1:"sen",3:"sanzen",8:"hassen"}[th]||ones[th]+"sen"); }
      return s+(r?under1000(r):"");
    };
    const man=Math.floor(n/10000),r=n%10000; return (man?under10000(man)+"man":"")+(r?under10000(r):"");
  }
  function nextNumber(p){
    if(p.phase==="basic"){
      const x=pick(basicNumbers);
      if(p.mode==="digits_to_romaji") return {prompt:String(x.n),answers:x.r,speech:numberToKanji(x.n),label:String(x.n),answerLabel:x.r.join(" / ")};
      return {prompt:x.k,answers:x.r,speech:x.k,label:x.k,answerLabel:x.r.join(" / ")};
    }
    const n=Math.floor(Math.random()*Math.max(2,p.range-10))+11;
    return {prompt:numberToKanji(n),answers:[String(n)],speech:numberToKanji(n),label:numberToKanji(n),answerLabel:String(n)};
  }

  function practiceProgress(p){
    if(p.kind==="brute") return bruteProgress(p);
    return p.total ? Math.min(100,Math.round((p.correct/Math.max(10,p.total))*100)) : 0;
  }
  function promptMarkup(p){
    const c=p.current;
    if(p.kind==="brute" || p.kind==="kana") return `<div class="kana-display">${escapeHTML(c.char)}</div>`;
    if(p.kind==="word") return `<div class="word-display">${escapeHTML(c.char)}</div>`;
    return `<div class="number-display">${escapeHTML(c.prompt)}</div>`;
  }
  function answerText(p){
    if(p.kind==="number") return p.current.answerLabel;
    if(p.kind==="word") return p.current.answer;
    return (p.current.answers||[p.current.romaji]).join(" / ");
  }
  function practiceSubtitle(p){
    if(p.kind==="brute") return `${p.script} · ${p.phase==="learn"?"Learning":"Reviewing"} ${stages[p.stageIndex].name}`;
    if(p.kind==="kana") return `${p.scripts} · ${p.rows.length} row${p.rows.length===1?"":"s"} selected`;
    if(p.kind==="word") return `${p.scripts} words · kana chaining`;
    return p.phase==="basic" ? `Foundations · ${p.mode.replaceAll("_"," ")}` : `Compound numbers · up to ${Number(p.range).toLocaleString()}`;
  }
  function promptChip(p){
    if(p.kind==="brute") return `${p.phase} · ${stages[p.stageIndex].name}`;
    if(p.kind==="kana") return "type the romaji";
    if(p.kind==="word") return "read the word";
    return p.phase==="compound" ? "type the number" : "type the reading";
  }

  function renderPractice(){
    const p=state.practice; if(!p){ state.page="home"; return renderHome(); }
    const acc=p.total?Math.round((p.correct/p.total)*100):0;
    const fb=p.feedback ? `<div class="feedback ${p.feedbackType}">${p.feedback}</div>` : `<div class="feedback"></div>`;
    return `<section class="practice-shell">
      <div class="practice-top">
        <div class="practice-meta"><button class="back-btn" id="practice-back">←</button><div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(practiceSubtitle(p))}</p></div></div>
        <div class="practice-actions"><button class="pill-btn" id="practice-sound"><span>♫</span><span>Play sound</span></button><button class="pill-btn" id="practice-reset"><span>↻</span><span>Reset</span></button></div>
      </div>
      <div class="workspace">
        <div class="study-area">
          <div class="progress-row"><div class="progress-track"><div class="progress-fill" style="width:${practiceProgress(p)}%"></div></div><span class="progress-label">${practiceProgress(p)}% session progress</span></div>
          <div class="prompt-zone"><div class="prompt-chip">${escapeHTML(promptChip(p))}</div>${promptMarkup(p)}
            ${p.kind==="brute" && p.phase==="learn" && !p.firstSeen.has(p.current.char) ? `<div class="first-look">New kana · <b>${escapeHTML(answerText(p))}</b></div>` : ""}
            <div class="sound-row"><button class="sound-btn" id="inline-sound">♫ hear pronunciation</button>${state.settings.autoplay?'<span class="muted" style="font-size:10px">autoplay on</span>':''}</div>
            <form class="answer-wrap" id="answer-form"><input id="answer-input" class="answer-input ${p.feedbackType==="good"?"correct":p.feedbackType==="bad"?"wrong":""}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer…" value="${escapeHTML(p.lastAnswer||"")}" ${p.locked?"disabled":""}/><button class="submit-arrow" type="submit">→</button></form>
            ${fb}<div class="hint">Enter to submit · S to replay sound</div>
          </div>
          <div class="session-stats"><div class="session-stat"><b>${p.correct}</b><span>Correct</span></div><div class="session-stat"><b>${acc}%</b><span>Accuracy</span></div><div class="session-stat"><b>${state.progress.streak}</b><span>Streak</span></div></div>
        </div>
        <aside class="options-panel">${renderPracticeOptions(p)}</aside>
      </div>
    </section>`;
  }

  function renderPracticeOptions(p){
    if(p.kind==="brute") return `
      <h4>Practice setup</h4>
      <div class="option-group"><div class="option-label"><span>Script</span></div>${segmented("brute-script",[["hiragana","Hiragana"],["katakana","Katakana"]],p.script)}</div>
      <div class="option-group"><div class="option-label"><span>Stage</span><span class="muted">${p.stageIndex+1}/${stages.length}</span></div><div class="stage-list">${stages.map((s,i)=>`<button class="stage-btn ${i===p.stageIndex?"active":""}" data-stage="${i}"><span>${escapeHTML(s.name)}</span><span class="dot"></span></button>`).join("")}</div></div>
      <div class="option-group"><div class="option-label"><span>Phase</span></div>${segmented("brute-phase",[["learn","Learn"],["review","Review"]],p.phase)}</div>
      ${generalSwitches()}`;
    if(p.kind==="kana") return `
      <h4>Practice setup</h4>
      <div class="option-group"><div class="option-label"><span>Scripts</span></div>${segmented("free-scripts",[["hiragana","Hira"],["katakana","Kata"],["both","Both"]],p.scripts)}</div>
      <div class="option-group"><div class="option-label"><span>Kana rows</span><button class="sound-btn" id="select-all-rows">All</button></div><div class="checkbox-list">${allRowKeys.map(k=>`<label class="check-pill"><input type="checkbox" data-row="${k}" ${p.rows.includes(k)?"checked":""}/><span>${escapeHTML(rowLabels[k])}</span></label>`).join("")}</div></div>
      ${generalSwitches()}`;
    if(p.kind==="word") return `
      <h4>Practice setup</h4><div class="option-group"><div class="option-label"><span>Word scripts</span></div>${segmented("word-scripts",[["hiragana","Hira"],["katakana","Kata"],["both","Both"]],p.scripts)}</div>
      <div class="notice">Word mode focuses on chaining kana into complete readings. Audio uses your browser's Japanese speech voice when available.</div>${generalSwitches()}`;
    return `
      <h4>Practice setup</h4>
      <div class="option-group"><div class="option-label"><span>Practice type</span></div>${segmented("number-phase",[["basic","Foundations"],["compound","Compound"]],p.phase)}</div>
      ${p.phase==="basic"?`<div class="option-group"><div class="option-label"><span>Mode</span></div>${segmented("number-mode",[["kanji_to_romaji","Kanji → romaji"],["digits_to_romaji","Digits → romaji"]],p.mode)}</div>`:`<div class="option-group"><div class="option-label"><span>Range</span></div>${segmented("number-range",[[99,"99"],[999,"999"],[9999,"9,999"],[99999,"99,999"]],String(p.range))}</div>`}
      ${generalSwitches()}`;
  }
  function segmented(name,options,value){ return `<div class="segmented" data-segment="${name}">${options.map(([v,l])=>`<button type="button" data-value="${v}" class="${String(v)===String(value)?"active":""}">${l}</button>`).join("")}</div>`; }
  function generalSwitches(){ return `<div class="option-group"><div class="switch-row"><span>Show correct answer after a miss</span><button type="button" class="switch ${state.settings.showCorrect?"on":""}" id="feedback-switch" aria-label="Toggle correct answer feedback"></button></div><div class="switch-row"><span>Play sound when prompt appears</span><button type="button" class="switch ${state.settings.autoplay?"on":""}" id="autoplay-switch" aria-label="Toggle autoplay"></button></div></div>`; }

  function submitAnswer(){
    const p=state.practice, input=document.getElementById("answer-input"); if(!p || !input || p.locked) return;
    const value=normalize(input.value); if(!value) return;
    const answers=(p.current.answers || [p.current.romaji]).map(normalize);
    const correct=answers.includes(value);
    p.total++; if(correct)p.correct++;
    recordResult(correct,p.current.char||p.current.prompt||p.current.label);
    p.lastAnswer=input.value;
    if(correct){ p.feedback="Correct"; p.feedbackType="good"; }
    else { p.feedback=state.settings.showCorrect?`Not quite — ${answerText(p)}`:"Not quite"; p.feedbackType="bad"; if(p.kind!=="number") p.misses.push(p.current); }

    if(p.kind==="brute"){
      if(p.phase==="learn") p.firstSeen.add(p.current.char);
      p.stageAttempts++; if(correct)p.stageScore++;
      if(!correct) p.stageScore=Math.max(0,p.stageScore-1);
    }
    p.locked=true; render();
    setTimeout(()=>advancePractice(), correct?420:820);
  }
  function advancePractice(){
    const p=state.practice; if(!p)return;
    if(p.kind==="brute"){
      const threshold=p.phase==="learn"?Math.max(10,p.pool.length*3):20;
      if(p.stageScore>=threshold){
        if(p.phase==="learn") { p.phase="review"; p.stageScore=0; p.stageAttempts=0; p.pool=brutePool(p); p.queue=[]; p.misses=[]; toast("Learning goal reached — now review everything so far."); }
        else if(p.stageIndex<stages.length-1){ p.stageIndex++; p.phase="learn"; p.stageScore=0; p.stageAttempts=0; p.pool=brutePool(p); p.queue=[]; p.misses=[]; state.progress.bruteStage[p.script]=p.stageIndex; saveProgress(); toast(`Stage cleared — ${stages[p.stageIndex].name}`); }
        else { toast(`You cleared the full ${p.script} path!`); p.stageScore=threshold; }
      }
      p.current=nextFromQueue(p,p.pool);
    } else if(p.kind==="number") p.current=nextNumber(p);
    else p.current=nextFromQueue(p,p.pool);
    p.feedback=""; p.feedbackType=""; p.lastAnswer=""; p.locked=false; render(); maybeAutoplay();
    const input=document.getElementById("answer-input"); if(input)input.focus();
  }

  function wirePractice(){
    const form=document.getElementById("answer-form"); if(form)form.addEventListener("submit",e=>{e.preventDefault();submitAnswer();});
    document.getElementById("practice-back")?.addEventListener("click",()=>{state.page="home";state.practice=null;render();});
    document.getElementById("practice-sound")?.addEventListener("click",()=>playCurrentSound());
    document.getElementById("inline-sound")?.addEventListener("click",()=>playCurrentSound());
    document.getElementById("practice-reset")?.addEventListener("click",()=>{ const mode=state.page.replace("practice-",""); startPractice(mode); toast("Session reset"); });
    document.getElementById("feedback-switch")?.addEventListener("click",()=>{state.settings.showCorrect=!state.settings.showCorrect;saveSettings();render();});
    document.getElementById("autoplay-switch")?.addEventListener("click",async()=>{state.settings.autoplay=!state.settings.autoplay;saveSettings();render(); if(state.settings.autoplay){await playCurrentSound(); toast("Sound on sight enabled");}});

    document.querySelectorAll("[data-segment] button").forEach(btn=>btn.addEventListener("click",()=>handleSegment(btn.parentElement.dataset.segment,btn.dataset.value)));
    document.querySelectorAll("[data-stage]").forEach(btn=>btn.addEventListener("click",()=>{ const p=state.practice;p.stageIndex=Number(btn.dataset.stage);p.phase="learn";p.stageScore=0;p.pool=brutePool(p);p.queue=[];p.misses=[];p.current=nextFromQueue(p,p.pool);render();maybeAutoplay();}));
    document.querySelectorAll("[data-row]").forEach(ch=>ch.addEventListener("change",()=>{const p=state.practice;const key=ch.dataset.row;if(ch.checked&&!p.rows.includes(key))p.rows.push(key);if(!ch.checked&&p.rows.includes(key)&&p.rows.length>1)p.rows=p.rows.filter(x=>x!==key);state.settings.freeRows=[...p.rows];saveSettings();p.pool=freePool(p);p.queue=[];p.current=nextFromQueue(p,p.pool);render();maybeAutoplay();}));
    document.getElementById("select-all-rows")?.addEventListener("click",()=>{const p=state.practice;p.rows=[...allRowKeys];state.settings.freeRows=[...p.rows];saveSettings();p.pool=freePool(p);p.queue=[];p.current=nextFromQueue(p,p.pool);render();maybeAutoplay();});
    setTimeout(()=>document.getElementById("answer-input")?.focus(),0);
  }

  function handleSegment(name,value){
    const p=state.practice;
    if(name==="brute-script"){p.script=value;state.settings.script=value;saveSettings();p.stageIndex=Math.min(state.progress.bruteStage[value]||0,stages.length-1);p.phase="learn";p.stageScore=0;p.pool=brutePool(p);p.queue=[];p.misses=[];p.current=nextFromQueue(p,p.pool);}
    if(name==="brute-phase"){p.phase=value;p.stageScore=0;p.pool=brutePool(p);p.queue=[];p.misses=[];p.current=nextFromQueue(p,p.pool);}
    if(name==="free-scripts"){p.scripts=value;state.settings.freeScripts=value;saveSettings();p.pool=freePool(p);p.queue=[];p.current=nextFromQueue(p,p.pool);}
    if(name==="word-scripts"){p.scripts=value;state.settings.wordScripts=value;saveSettings();p.pool=wordPool(p);p.queue=[];p.current=nextFromQueue(p,p.pool);}
    if(name==="number-phase"){p.phase=value;state.settings.numberPhase=value;if(value==="basic"&&!state.settings.numberMode)state.settings.numberMode="kanji_to_romaji";saveSettings();p.current=nextNumber(p);}
    if(name==="number-mode"){p.mode=value;state.settings.numberMode=value;saveSettings();p.current=nextNumber(p);}
    if(name==="number-range"){p.range=Number(value);state.settings.numberRange=p.range;saveSettings();p.current=nextNumber(p);}
    render();maybeAutoplay();
  }

  function renderChart(){
    const script=state.chartScript;
    const cell=(t,k)=>{const item=toItem(t,script);const selected=state.settings.freeRows.includes(k);return `<button class="kana-cell ${selected?"selected":""}" data-chart-sound="${escapeHTML(item.romaji)}" title="Play ${escapeHTML(item.romaji)}"><span class="char">${escapeHTML(item.char)}</span><span class="romaji">${escapeHTML(item.romaji)}</span></button>`;};
    return `<section class="chart-shell"><div class="chart-toolbar"><div><h3>Kana chart</h3><p>Tap any character to hear it. Selected rows are highlighted because they are active in Free Practice.</p></div><div class="chart-tabs">${segmented("chart-script",[["hiragana","Hiragana"],["katakana","Katakana"]],script)}</div></div>
      <div class="chart-section"><h4>Basic + voiced kana</h4><div class="kana-grid">${regularRowKeys.flatMap(k=>kanaRows[k].map(t=>cell(t,k))).join("")}</div></div>
      <div class="chart-section"><h4>Combinations</h4><div class="kana-grid">${comboRowKeys.flatMap(k=>kanaRows[k].map(t=>cell(t,k))).join("")}</div></div>
    </section>`;
  }
  function wireChart(){
    document.querySelectorAll('[data-segment="chart-script"] button').forEach(b=>b.addEventListener("click",()=>{state.chartScript=b.dataset.value;render();}));
    document.querySelectorAll("[data-chart-sound]").forEach(b=>b.addEventListener("click",()=>playKanaAudio(b.dataset.chartSound)));
  }

  function renderSettings(){
    return `<section class="settings-shell"><h3>Settings</h3><p>Saved on this device.</p><div class="settings-grid">
      <div class="setting-card"><h4>Sound on sight</h4><p>Play the pronunciation automatically when a new prompt appears.</p><div class="switch-row"><span>${state.settings.autoplay?"Enabled":"Disabled"}</span><button class="switch ${state.settings.autoplay?"on":""}" data-setting="autoplay" aria-label="Toggle sound on sight"></button></div></div>
      <div class="setting-card"><h4>Accessibility</h4><p>Theme, high contrast, text size, and font controls.</p><button class="secondary-btn" id="settings-a11y">Open accessibility</button></div>
      <div class="setting-card"><h4>Wrong-answer feedback</h4><p>Reveal the correct romaji after an incorrect answer.</p><div class="switch-row"><span>${state.settings.showCorrect?"Reveal answer":"Keep hidden"}</span><button class="switch ${state.settings.showCorrect?"on":""}" data-setting="showCorrect" aria-label="Toggle wrong-answer feedback"></button></div></div>
      <div class="setting-card"><h4>Default learning script</h4><p>Used when you open Brute Force.</p>${segmented("settings-script",[["hiragana","Hiragana"],["katakana","Katakana"]],state.settings.script)}</div>
    </div><div class="notice">If your browser blocks the first automatic sound, use the speaker once. Later prompts can autoplay after that interaction.</div>
    <div style="margin-top:22px"><button class="danger-btn" id="reset-progress">Reset saved progress</button></div></section>`;
  }
  function wireSettings(){
    document.querySelector('[data-setting="autoplay"]')?.addEventListener("click",async()=>{state.settings.autoplay=!state.settings.autoplay;saveSettings();render(); if(state.settings.autoplay){await playKanaAudio("a",true);toast("Sound on sight enabled");}});
    document.querySelector('[data-setting="showCorrect"]')?.addEventListener("click",()=>{state.settings.showCorrect=!state.settings.showCorrect;saveSettings();render();});
    document.querySelectorAll('[data-segment="settings-script"] button').forEach(b=>b.addEventListener("click",()=>{state.settings.script=b.dataset.value;saveSettings();render();}));
    document.getElementById("settings-a11y")?.addEventListener("click",openAccessibility);
    document.getElementById("reset-progress")?.addEventListener("click",()=>{state.progress={...defaultProgress,bruteStage:{hiragana:0,katakana:0},recent:[],completed:[]};saveProgress();render();toast("Saved progress reset");});
  }

  function openAccessibility(){
    const panel=document.getElementById("a11y-panel"),backdrop=document.getElementById("a11y-backdrop");
    if(!panel||!backdrop)return;
    panel.hidden=false;backdrop.hidden=false;document.getElementById("a11y-open")?.setAttribute("aria-expanded","true");
    setTimeout(()=>document.getElementById("a11y-close")?.focus(),0);
  }
  function closeAccessibility(){
    const panel=document.getElementById("a11y-panel"),backdrop=document.getElementById("a11y-backdrop");
    if(!panel||!backdrop)return;
    panel.hidden=true;backdrop.hidden=true;document.getElementById("a11y-open")?.setAttribute("aria-expanded","false");
    document.getElementById("a11y-open")?.focus();
  }
  function updateAccessibility(next){
    Object.assign(state.settings,next);applyAccessibility();saveSettings();
  }
  function wireGlobal(){
    document.querySelectorAll("[data-nav]").forEach(btn=>btn.addEventListener("click",()=>{state.page=btn.dataset.nav;state.practice=null;render();}));
    document.getElementById("audio-toggle")?.addEventListener("click",async()=>{state.settings.autoplay=!state.settings.autoplay;saveSettings();render();if(state.settings.autoplay){ if(state.practice) await playCurrentSound(); else await playKanaAudio("a",true); toast("Sound on sight enabled"); }});
    document.getElementById("a11y-open")?.addEventListener("click",openAccessibility);
    document.getElementById("a11y-close")?.addEventListener("click",closeAccessibility);
    document.getElementById("a11y-backdrop")?.addEventListener("click",closeAccessibility);
    document.querySelectorAll("[data-a11y-theme]").forEach(btn=>btn.addEventListener("click",()=>{updateAccessibility({theme:btn.dataset.a11yTheme});render();openAccessibility();}));
    document.getElementById("a11y-text-size")?.addEventListener("input",e=>{const value=clamp(Number(e.target.value)||100,85,140);document.getElementById("a11y-text-value").textContent=value+"%";updateAccessibility({textSize:value});});
    document.getElementById("a11y-font")?.addEventListener("change",e=>{updateAccessibility({font:e.target.value});const custom=document.getElementById("a11y-custom-font");if(custom){custom.hidden=e.target.value!=="custom";if(e.target.value==="custom")custom.focus();}});
    document.getElementById("a11y-custom-font")?.addEventListener("input",e=>updateAccessibility({customFont:e.target.value}));
    document.getElementById("a11y-reset")?.addEventListener("click",()=>{updateAccessibility({theme:"light",textSize:100,font:"system",customFont:""});render();openAccessibility();toast("Accessibility reset");});
  }

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape" && !document.getElementById("a11y-panel")?.hidden){ closeAccessibility(); return; }
    if(!state.page.startsWith("practice")) return;
    if(e.key.toLowerCase()==="s" && document.activeElement?.id!=="answer-input"){e.preventDefault();playCurrentSound();}
  });

  applyAccessibility();
  render();
})();
