
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const el = (tag, attrs={}, ...children) => {
    const n = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs)){
      if (k === "class") n.className = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (k === "html") n.innerHTML = v;
      else n.setAttribute(k, v);
    }
    for (const c of children.flat()){
      if (c == null) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  };

  const state = { route:{tab:'courantes',view:'grid'}, scroll:{} };
  try{ const mem = sessionStorage.getItem('git_ui_state'); if (mem) Object.assign(state, JSON.parse(mem)); }catch{}
  const saveState = () => { try{ sessionStorage.setItem('git_ui_state', JSON.stringify(state)); }catch{} };

  const usageKey = 'git_usage_counts';
  const getCounts = () => { try{ return JSON.parse(localStorage.getItem(usageKey) || '{}'); }catch{ return {}; } };
  const bumpCount = (cmd) => { const m=getCounts(); m[cmd]=(m[cmd]||0)+1; try{ localStorage.setItem(usageKey, JSON.stringify(m)); }catch{} };

  const svgCopy = () => {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg"); s.setAttribute("viewBox", "0 0 24 24");
    const r1 = document.createElementNS(ns, "rect"); r1.setAttribute("x","7"); r1.setAttribute("y","7"); r1.setAttribute("width","10"); r1.setAttribute("height","12"); r1.setAttribute("rx","2");
    const r2 = document.createElementNS(ns, "rect"); r2.setAttribute("x","4"); r2.setAttribute("y","4"); r2.setAttribute("width","10"); r2.setAttribute("height","12"); r2.setAttribute("rx","2");
    s.appendChild(r2); s.appendChild(r1); return s;
  };
  const copyToClipboard = async (text, btn) => {
    try{
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else { const ta = el("textarea",{style:"position:fixed;left:-1000px;top:-1000px"}); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
      bumpCount(text); btn.classList.remove("err"); btn.classList.add("ok"); setTimeout(()=>btn.classList.remove("ok"), 900);
    }catch{ btn.classList.add("err"); setTimeout(()=>btn.classList.remove("err"), 900); }
  };

  // Smooth scroll with sticky offset (topbar + tabs)
  const smoothScrollTo = (node) => {
    const topbar = document.querySelector('.topbar'); const tabs = document.querySelector('.tabs');
    const offset = (topbar?.getBoundingClientRect().height || 0) + (tabs?.getBoundingClientRect().height || 0) + 12;
    const y = window.scrollY + node.getBoundingClientRect().top - offset;
    window.scrollTo({top:y, behavior:'smooth'});
  };

  // Global Sommaire in header
  const hamburger = $("#summaryHamburger");
  const panel = $("#summaryPanel");
  const list = $("#summaryList");
  const closeBtn = $("#summaryClose");

  const closePanel = () => { panel.hidden = true; hamburger.setAttribute('aria-expanded','false'); };
  const openPanel = () => {
    // position panel just under header/tabs (robust even if heights change)
    const topbar = document.querySelector('.topbar'); const tabs = document.querySelector('.tabs');
    const top = (topbar?.getBoundingClientRect().height || 0) + (tabs?.getBoundingClientRect().height || 0) + 10;
    panel.style.top = top + 'px';
    panel.hidden = false; hamburger.setAttribute('aria-expanded','true');
  };
  hamburger.addEventListener("click", ()=> panel.hidden ? openPanel() : closePanel());
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e)=> { if ((e.key||'').toLowerCase()==='t') (panel.hidden?openPanel():closePanel()); if (e.key==='Escape') closePanel(); });
  document.addEventListener("click", (e)=> {
    if (panel.hidden) return;
    const inside = panel.contains(e.target) || hamburger.contains(e.target);
    if (!inside) closePanel();
  });

  const setSummary = (labels, ids) => {
    // affiche le hamburger si on a des entrées, sinon le masque
    if (!labels || labels.length === 0){ hamburger.hidden = true; closePanel(); return; }
    hamburger.hidden = false;
    list.innerHTML = "";
    labels.forEach((lab, i)=>{
      const id = ids[i];
      const a = el('a',{href:'#'+id, onclick:(e)=>{ e.preventDefault(); const node=document.getElementById(id); if(node){ smoothScrollTo(node); } closePanel(); }}, lab);
      list.appendChild(el('li',{}, a));
    });
    // surlignage actif au scroll
    const links = Array.from(list.querySelectorAll('a'));
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    if (setSummary.io) setSummary.io.disconnect();
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting){
          links.forEach(a=>a.classList.remove('active'));
          const a = map.get(en.target.id);
          if (a) a.classList.add('active');
        }
      });
    }, {root:null, rootMargin:"0px 0px -70% 0px", threshold:0.1});
    ids.forEach(id => { const n = document.getElementById(id); if(n) io.observe(n); });
    setSummary.io = io;
  };

  const clearSummary = () => { setSummary([],[]); };

  // ---------- Cards
  const renderCommandCard = ({cmd, description}, id) => {
    const card = el("div", {class:"card", id});
    const input = el("input", {type:"text", readonly:"", value:cmd});
    const iconBtn = el("button", {class:"copy-icon", title:"Copier"}, svgCopy());
    iconBtn.addEventListener("click", ()=> copyToClipboard(input.value, iconBtn));
    const head = el("div", {class:"card-head"}, el("h3", {html: cmd}));
    const desc = el("p", {html: description||''});
    const row = el("div", {class:"command-input"}, input, iconBtn);
    card.appendChild(head); card.appendChild(desc); card.appendChild(row);
    return card;
  };

  const sorters = {
    'az': (a,b)=> a.cmd.localeCompare(b.cmd,'fr',{sensitivity:'base'}),
    'za': (a,b)=> b.cmd.localeCompare(a.cmd,'fr',{sensitivity:'base'}),
    'freq': (a,b)=> (getCounts()[b.cmd]||0)-(getCounts()[a.cmd]||0) || a.cmd.localeCompare(b.cmd,'fr')
  };

  // ---------- Categories
  const renderCategoryDetail = (name, items) => {
    const ctn = $("#categories-container"); ctn.innerHTML = "";
    const header = el("div",{class:"section-header"},
      el("h2",{class:"section-title"}, name),
      el("button",{class:"back-btn", onclick:()=>{ renderCategories(window._categories); window.scrollTo(0,  state.scroll['cats']||0); clearSummary(); } },"← Retour")
    );
    ctn.appendChild(header);
    const action = el("div",{class:"actionbar"},
      el("div",{class:"segment"},
        ...["az","za","freq"].map(k=>{
          const label = k==="az"?"A→Z":k==="za"?"Z→A":"Fréquence";
          const btn = el("button",{class: k==="az"?"active":"", onclick:()=>{ $$(".actionbar .segment button").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderList(k);} }, label);
          return btn;
        })
      )
    );
    ctn.appendChild(action);
    const grid = el("div",{class:"grid"}); ctn.appendChild(grid);

    const renderList = (mode='az') => {
      grid.innerHTML = "";
      const arr = [...items].sort(sorters[mode]);
      const labels=[]; const ids=[];
      arr.forEach((i, idx)=> { const id='cmd-'+idx; labels.push(i.cmd); ids.push(id); grid.appendChild(renderCommandCard(i, id)); });
      setSummary(labels, ids);
    };
    renderList('az');
  };

  const renderCategories = (cats, q="") => {
    window._categories = cats;
    const ctn = $("#categories-container"); ctn.innerHTML = "";
    const grid = el("div",{class:"cat-grid"});
    Object.entries(cats).forEach(([name, items])=>{
      const hay = (name + " " + items.map(i=>i.cmd+" "+(i.description||"")).join(" ")).toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return;
      const tile = el("div",{class:"cat-tile", onclick:()=>{
        state.scroll['cats']=window.scrollY; state.route={tab:'categories',view:'detail',cat:name}; saveState(); renderCategoryDetail(name, items); window.scrollTo(0,0);
      }}, el("h4",{}, name), el("small",{}, items.length+" commandes"));
      grid.appendChild(tile);
    });
    ctn.appendChild(grid);
    clearSummary();
  };

  // ---------- Docs
  const renderDocCard = (item, id) => {
    const card = el("div",{class:"card doc-card", id});
    const h = el("div",{class:"card-head"}, el("h3",{}, item.title));
    const copyBtn = el("button",{class:"copy-icon doc-copy", title:"Copier le contenu"}, svgCopy());
    const toCopy = (item.text || item.html || "").toString().replace(/<[^>]+>/g,'').trim();
    copyBtn.addEventListener("click",()=> copyToClipboard(`${item.title}\n\n${toCopy}`, copyBtn));
    h.appendChild(copyBtn);
    card.appendChild(h);
    if (item.text){ card.appendChild(el("p",{}, item.text)); }
    else if (item.html){ const wrap = el("div",{class:"doc-html"}); wrap.innerHTML = item.html; card.appendChild(wrap); }
    return card;
  };

  const renderDocsDetail = (name, items) => {
    const ctn = $("#docs-container"); ctn.innerHTML = "";
    const header = el("div",{class:"section-header"},
      el("h2",{class:"section-title"}, name),
      el("button",{class:"back-btn", onclick:()=>{ renderDocs(window._docs); window.scrollTo(0,  state.scroll['docs']||0); clearSummary(); } },"← Retour")
    );
    ctn.appendChild(header);
    const action = el("div",{class:"actionbar"},
      el("div",{class:"segment"},
        ...["az","za"].map(k=>{
          const label = k==="az"?"A→Z":"Z→A";
          const btn = el("button",{class: k==="az"?"active":"", onclick:()=>{ $$(".actionbar .segment button").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderList(k);} }, label);
          return btn;
        })
      )
    );
    ctn.appendChild(action);
    const list = el("div",{class:"grid"}); ctn.appendChild(list);

    const renderList = (mode='az') => {
      list.innerHTML = "";
      const arr = [...items].sort((a,b)=> mode==='az'? a.title.localeCompare(b.title,'fr'):b.title.localeCompare(a.title,'fr'));
      const labels=[]; const ids=[];
      arr.forEach((it, idx)=> { const id='doc-'+idx; labels.push(it.title); ids.push(id); list.appendChild(renderDocCard(it, id)); });
      setSummary(labels, ids);
    };
    renderList('az');
  };

  const renderDocs = (docs, q="") => {
    window._docs = docs;
    const ctn = $("#docs-container"); ctn.innerHTML = "";
    const grid = el("div",{class:"doc-grid"});
    Object.entries(docs).forEach(([name, items])=>{
      const hay = (name + " " + items.map(a=>a.title).join(" ") + " " + items.map(a=> (a.text||'')).join(" ")).toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return;
      const tile = el("div",{class:"doc-tile", onclick:()=>{
        state.scroll['docs']=window.scrollY; state.route={tab:'docs',view:'detail',doc:name}; saveState(); renderDocsDetail(name, items); window.scrollTo(0,0);
      }}, el("h4",{}, name), el("small",{}, items.length+" articles"));
      grid.appendChild(tile);
    });
    ctn.appendChild(grid);
    clearSummary();
  };

  // Tabs
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    $$(".tab-panel").forEach(p => p.classList.remove("active"));
    document.querySelector(`#tab-${t.dataset.tab}`).classList.add("active");
    state.route.tab = t.dataset.tab; state.route.view='grid'; saveState();
    window.scrollTo(0,0);
    clearSummary();
  }));

  // Init
  (async function init(){
    const courantes = await (await fetch("api/data.php?f=courantes",{cache:"no-store"})).json();
    const courCtn = $("#courantes-container");
    courCtn.innerHTML = "";
    courantes.forEach((c,i)=> courCtn.appendChild(renderCommandCard(c, 'cour-'+i)));
    $("#search-courantes").addEventListener("input", e=>{
      const q = e.target.value.toLowerCase();
      courCtn.innerHTML = "";
      courantes.filter(c=> (c.cmd+" "+(c.description||"")).toLowerCase().includes(q)).forEach((c,i)=> courCtn.appendChild(renderCommandCard(c, 'cour-'+i)));
    });

    const cats = await (await fetch("api/data.php?f=commandes_par_categorie",{cache:"no-store"})).json();
    renderCategories(cats);
    $("#search-categories").addEventListener("input", e => renderCategories(cats, e.target.value));

    const docs = await (await fetch("api/data.php?f=docs_par_categorie",{cache:"no-store"})).json();
    renderDocs(docs);
    $("#search-docs").addEventListener("input", e => renderDocs(docs, e.target.value));
  })();
})();
