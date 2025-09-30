
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

  const state = { route:{tab:'courantes',view:'grid', file:null}, scroll:{}, last:{} };
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

  const smoothScrollTo = (node) => {
    const topbar = document.querySelector('.topbar'); const tabs = document.querySelector('.tabs');
    const offset = (topbar?.getBoundingClientRect().height || 0) + (tabs?.getBoundingClientRect().height || 0) + 12;
    const y = window.scrollY + node.getBoundingClientRect().top - offset;
    window.scrollTo({top:y, behavior:'smooth'});
  };

  // Summary globals
  const hamburger = $("#summaryHamburger");
  const panel = $("#summaryPanel");
  const list = $("#summaryList");
  const filter = $("#summaryFilter");
  const closeBtn = $("#summaryClose");

  const closePanel = () => { panel.classList.remove('open'); panel.hidden = true; hamburger.setAttribute('aria-expanded','false'); };
  const openPanel = () => { panel.hidden = false; requestAnimationFrame(()=> panel.classList.add('open')); hamburger.setAttribute('aria-expanded','true'); filter?.focus(); };
  hamburger.addEventListener("click", ()=> panel.hidden ? openPanel() : closePanel());
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e)=> { if ((e.key||'').toLowerCase()==='t') (panel.hidden?openPanel():closePanel()); if (e.key==='Escape') closePanel(); });
  document.addEventListener("click", (e)=> {
    if (panel.hidden) return;
    const inside = panel.contains(e.target) || hamburger.contains(e.target);
    if (!inside) closePanel();
  });

  let _labels=[], _ids=[], _handlers=[];
  const applyFilter = () => {
    const q = (filter?.value || '').trim().toLowerCase();
    const items = Array.from(list.children);
    items.forEach((li, i)=>{
      const txt = _labels[i]?.toLowerCase() || '';
      li.style.display = (!q || txt.includes(q)) ? '' : 'none';
    });
  };
  const setSummary = (labels, ids, handlers=null) => {
    _labels = labels || []; _ids = ids || []; _handlers = handlers || [];
    if (!_labels.length){ hamburger.hidden = true; closePanel(); return; }
    hamburger.hidden = false;
    list.innerHTML = "";
    _labels.forEach((lab, i)=>{
      const id = _ids[i];
      const a = el('a',{href: id ? ('#'+id) : '#', onclick:(e)=>{
        e.preventDefault();
        if (_handlers[i]) { _handlers[i](); closePanel(); return; }
        if (id){ const node=document.getElementById(id); if(node){ smoothScrollTo(node); closePanel(); } }
      }}, lab);
      list.appendChild(el('li',{}, a));
    });
    if (filter){ filter.value=''; filter.removeEventListener('input', applyFilter); filter.addEventListener('input', applyFilter); }

    const validIds = _ids.filter(Boolean);
    const links = Array.from(list.querySelectorAll('a')).filter((_,i)=> !!_ids[i]);
    const map = new Map(links.map((a,i) => [validIds[i], a]));
    if (setSummary.io) setSummary.io.disconnect();
    if (validIds.length){
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting){
            links.forEach(a=>a.classList.remove('active'));
            const a = map.get(en.target.id);
            if (a) a.classList.add('active');
          }
        });
      }, {root:null, rootMargin:"0px 0px -70% 0px", threshold:0.1});
      validIds.forEach(id => { const n = document.getElementById(id); if(n) io.observe(n); });
      setSummary.io = io;
    }
  };
  const clearSummary = () => setSummary([],[],[]);

  // API helpers
  const listModules = async (tab) => {
    const r = await fetch(`api/modules.php?tab=${encodeURIComponent(tab)}&list=1`, {cache:'no-store'});
    if (!r.ok) throw new Error('Liste modules échouée');
    return r.json();
  };
  const loadModule = async (tab, file) => {
    const r = await fetch(`api/modules.php?tab=${encodeURIComponent(tab)}&file=${encodeURIComponent(file)}`, {cache:'no-store'});
    if (!r.ok) throw new Error('Chargement module échoué');
    return r.json();
  };

  // Cards
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

  // Tab controller + registry
  const controllers = {};

  const setupTab = (tab, containerId, type) => {
    const ctn = $(containerId);
    const search = $(`#search-${tab}`);

    const openModule = async (file, titleOverride=null) => {
      state.last[tab] = {file}; saveState();
      const name = titleOverride || file.replace(/\.json$/,'').replace(/[_-]+/g,' ').replace(/\b\w/g, m=>m.toUpperCase());
      ctn.innerHTML = "";
      const header = el("div",{class:"section-header"},
        el("h2",{class:"section-title"}, name),
        el("button",{class:"back-btn", onclick:()=>{ showGrid(); window.scrollTo(0, state.scroll[tab]||0); clearSummary(); } },"← Retour")
      );
      ctn.appendChild(header);

      const data = await loadModule(tab, file);

      const action = el("div",{class:"actionbar"},
        el("div",{class:"segment"},
          ...(type==='docs' ? ['az','za'] : ['az','za','freq']).map(k=>{
            const label = k==='az'?'A→Z':k==='za'?'Z→A':'Fréquence';
            const btn = el("button",{class: k==='az'?'active':'', onclick:()=>{ $$(".actionbar .segment button").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderList(k);} }, label);
            return btn;
          })
        )
      );
      ctn.appendChild(action);

      const grid = el("div",{class:"grid"}); ctn.appendChild(grid);

      const renderList = (mode='az') => {
        grid.innerHTML = "";
        if (type==='docs'){
          const arr = [...data].sort((a,b)=> mode==='az'? a.title.localeCompare(b.title,'fr'):b.title.localeCompare(a.title,'fr'));
          const labels = []; const ids = [];
          arr.forEach((it, idx)=> { const id = `doc-${idx}`; labels.push(it.title); ids.push(id); grid.appendChild(renderDocCard(it, id)); });
          setSummary(labels, ids, []);
        } else {
          const sorters = {
            'az': (a,b)=> a.cmd.localeCompare(b.cmd,'fr',{sensitivity:'base'}),
            'za': (a,b)=> b.cmd.localeCompare(a.cmd,'fr',{sensitivity:'base'}),
            'freq': (a,b)=> (getCounts()[b.cmd]||0)-(getCounts()[a.cmd]||0) || a.cmd.localeCompare(b.cmd,'fr')
          };
          const arr = [...data].sort(sorters[mode]);
          const labels = []; const ids = [];
          arr.forEach((it, idx)=> { const id = `cmd-${idx}`; labels.push(it.cmd); ids.push(id); grid.appendChild(renderCommandCard(it, id)); });
          setSummary(labels, ids, []);
        }
      };
      renderList('az');
    };

    const showGrid = async () => {
      const listing = await listModules(tab);
      const modules = listing.modules || [];
      if (modules.length <= 1){
        const m = modules[0] || {file:'default.json', title:'Module'};
        await openModule(m.file, m.title);
        return;
      }
      ctn.innerHTML = "";
      const grid = el("div",{class:"module-grid"});
      modules.forEach((m, i)=>{
        const id = `mod-${i}`;
        const tile = el("div",{class:"module-tile", id, onclick: async ()=>{ state.scroll[tab]=window.scrollY; await openModule(m.file, m.title); window.scrollTo(0,0);} },
          el("h4",{}, m.title || m.file),
          el("small",{}, m.file),
          el("span",{class:"module-count"}, `${m.count ?? 0}`)
        );
        tile.dataset.file = m.file;
        tile.dataset.title = m.title || m.file;
        grid.appendChild(tile);
      });
      ctn.appendChild(grid);
      setSummary(modules.map(m=> m.title || m.file), modules.map((_,i)=>`mod-${i}`), modules.map(m => ()=> openModule(m.file, m.title)));
    };

    search?.addEventListener('input', async (e)=>{
      const q = (e.target.value||'').toLowerCase();
      const grid = ctn.querySelector('.module-grid');
      if (grid){
        Array.from(grid.children).forEach(tile => {
          const txt = tile.innerText.toLowerCase();
          tile.style.display = txt.includes(q) ? '' : 'none';
        });
      } else {
        const cards = ctn.querySelectorAll('.card');
        cards.forEach(card => {
          const txt = card.innerText.toLowerCase();
          card.style.display = txt.includes(q) ? '' : 'none';
        });
      }
    });

    (async ()=>{
      await showGrid();
      const prev = state.last[tab]?.file;
      if (prev && (await listModules(tab)).modules.some(m => m.file === prev)){
        await openModule(prev);
      }
    })();

    const ctrl = { openModule, showGrid, containerId, type };
    controllers[tab] = ctrl;
    return ctrl;
  };

  // Rebuild summary when switching tabs
  const refreshSummaryForTab = (tab) => {
    const ctrl = controllers[tab];
    if (!ctrl) { clearSummary(); return; }
    const ctn = $(ctrl.containerId);
    if (!ctn) { clearSummary(); return; }
    const grid = ctn.querySelector('.module-grid');
    if (grid){
      const tiles = Array.from(grid.querySelectorAll('.module-tile'));
      const labels = tiles.map(t => (t.querySelector('h4')?.textContent || t.dataset.title || '').trim());
      const ids = tiles.map(t => t.id);
      const handlers = tiles.map(t => () => ctrl.openModule(t.dataset.file, t.dataset.title));
      setSummary(labels, ids, handlers);
      return;
    }
    // module detail
    const cards = Array.from(ctn.querySelectorAll('.card'));
    if (!cards.length){ clearSummary(); return; }
    const labels = cards.map(c => (c.querySelector('.card-head h3')?.textContent || '').trim());
    const ids = cards.map(c => c.id);
    setSummary(labels, ids, []);
  };

  // Tabs switching
  $$(".tab").forEach(t => t.addEventListener("click", async () => {
    $$(".tab").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    $$(".tab-panel").forEach(p => p.classList.remove("active"));
    document.querySelector(`#tab-${t.dataset.tab}`).classList.add("active");
    state.route.tab = t.dataset.tab; state.route.view='grid'; state.route.file=null; saveState();
    window.scrollTo(0,0);
    // Ne pas vider le sommaire, mais le réactualiser selon l'onglet
    refreshSummaryForTab(t.dataset.tab);
  }));

  // Init
  (async function init(){
    setupTab('courantes', '#courantes-container', 'commands');
    setupTab('categories', '#categories-container', 'commands');
    setupTab('docs', '#docs-container', 'docs');
    // première construction de sommaire pour l'onglet par défaut
    refreshSummaryForTab('courantes');
  })();
})();
