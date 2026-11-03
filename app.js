/* Número da loja no formato internacional, só dígitos. */
const WHATSAPP = "5561916760607";

const CATS = {
  perfume:  {nome:"Perfumaria", desc:"Perfumes árabes originais", icon:"perfume"},
  pod:      {nome:"Eletrônicos", desc:"Pods e descartáveis", icon:"pod"},
  liquido:  {nome:"Líquidos", desc:"Nic Salt e juices", icon:"drop"}
};

/* ícones de traço (dourado) */
const S = (p) => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICONS = {
  perfume: S('<rect x="18" y="24" width="28" height="32" rx="6"/><path d="M26 24v-6h12v6M28 12h8v6h-8zM24 36h16"/>'),
  pod:     S('<rect x="22" y="8" width="20" height="48" rx="8"/><path d="M28 16h8M26 46h12"/>'),
  drop:    S('<path d="M32 8c8 12 16 20 16 30a16 16 0 01-32 0c0-10 8-18 16-30z"/><path d="M24 40a8 8 0 008 8"/>'),
  hookah:  S('<path d="M26 10h12l-2 6h-8zM32 16v18M24 22h16M22 34h20l-2 8c4 3 6 7 6 10a14 14 0 01-28 0c0-3 2-7 6-10z"/><path d="M42 40c8 0 12 4 12 10v6"/>'),
  leaf:    S('<path d="M12 52C12 28 28 12 52 12c0 24-16 40-40 40z"/><path d="M12 52l26-26"/>'),
  bowl:    S('<path d="M14 22h36l-6 18H20zM24 40v8h16v-8M20 48h24"/><path d="M24 16c0-3 3-3 3-6M32 16c0-3 3-3 3-6"/>'),
  hose:    S('<path d="M12 48c0-14 10-20 20-20s20-6 20-20"/><path d="M46 8l8 0 0 8"/><rect x="8" y="46" width="10" height="10" rx="2"/>'),
  pouch:   S('<path d="M16 14h32l-2 40H18z"/><path d="M16 22h32M24 34h16M26 42h12"/>'),
  coal:    S('<rect x="10" y="30" width="16" height="16" rx="2"/><rect x="30" y="30" width="16" height="16" rx="2"/><rect x="20" y="14" width="16" height="16" rx="2"/><path d="M50 22c4-4 2-8 0-10M54 30c3-3 2-6 0-8"/>'),
  paper:   S('<rect x="12" y="16" width="40" height="32" rx="4"/><path d="M12 26h40M20 36h24"/>'),
  tips:    S('<path d="M14 40l30-30 10 10-30 30z"/><path d="M20 34l10 10M26 28l10 10"/>'),
  tobacco: S('<path d="M14 18h36v34H14z"/><path d="M14 26h36M22 38c4-4 8 4 12 0s8 4 8 0"/>'),
  lighter: S('<rect x="20" y="24" width="24" height="32" rx="4"/><path d="M20 32h24M26 24v-6h12v6"/><path d="M32 6c3 4 3 7 0 9-3-2-3-5 0-9z"/>'),
  torch:   S('<rect x="22" y="26" width="20" height="30" rx="4"/><path d="M28 26V14h8v12M32 14V6"/><path d="M28 6h8"/>'),
  grinder: S('<ellipse cx="32" cy="18" rx="18" ry="6"/><path d="M14 18v24c0 3.3 8 6 18 6s18-2.7 18-6V18M14 30c0 3.3 8 6 18 6s18-2.7 18-6"/>')
};

const fix = {"pieapple":"pineapple","fcuking":"f*cking","fcukin":"f*ckin"};
const tc = s => s.toLowerCase().replace(/\s+/g," ").trim().split(" ").map(w=>{w=fix[w]||w;return w.charAt(0).toUpperCase()+w.slice(1)}).join(" ");
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const num = s => parseFloat(String(s||"").replace(/\./g,"").replace(",","."))||0;
const P = (window.PRODUTOS||[]).map((p,i)=>({...p,id:i,price:num(p.preco),old:num(p.de),
  flavors:[...new Set((p.sabores||[]).map(s=>p.cat==="pod"||p.cat==="liquido"?tc(s):s))]}));

const $ = s => document.querySelector(s);
const wa = t => "https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(t);
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* idade */
(function(){let ok=false;try{ok=sessionStorage.getItem("gt-age")==="1"}catch(e){}
  if(ok)$("#gate").hidden=true;
  $("#gateYes").onclick=()=>{try{sessionStorage.setItem("gt-age","1")}catch(e){}$("#gate").hidden=true};
  $("#gateNo").onclick=()=>{$("#gate .box").innerHTML='<img src="img/logo-grand.webp" alt="Grand Tabacaria" style="height:96px;width:auto;margin:0 auto 14px"><h2>Volte quando tiver 18 anos</h2><p>Este catálogo é exclusivo para maiores de idade.</p>'};})();

let view="home", sub="all", query="", sort="rel";
let cart = store.get("gt-cart3",[]).filter(l=>P[l.id]);
let mode="pick";
const SLUG={perfumaria:"perfume",eletronicos:"pod",liquidos:"liquido"};
const SLUG_OF=Object.fromEntries(Object.entries(SLUG).map(([k,v])=>[v,k]));
const plus='<span class="add" aria-hidden="true"><svg viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg></span>';

function cardHTML(p){
  const isP=p.cat==="perfume";
  const subt=isP?`${p.genero} · ${p.familia}`:(p.flavors.length?p.flavors.length+(p.flavors.length>1?" sabores":" sabor"):"Sabor na loja");
  const tag=p.old?'<span class="tag">OFERTA</span>':(isP&&p.destaque)?'<span class="tag dark">MAIS PEDIDO</span>':p.novo?'<span class="tag">NOVO</span>':"";
  return `<button class="card${isP?" pc":""}" data-id="${p.id}" aria-label="${esc(p.nome)}, ${money(p.price)}">
    <div style="position:relative"><div class="ph${isP?" perf":""}"><img src="${p.imagem}" alt="" decoding="async"></div>${tag}</div>
    <div class="bd"><span class="br">${esc(p.marca)}</span><span class="nm">${esc(p.nome)}</span>
      <div class="ft"><div>${p.old?`<div class="old">${money(p.old)}</div>`:""}<div class="pr">${money(p.price)}</div><div class="fl">${esc(subt)}</div></div>${plus}</div></div>
  </button>`;
}

function renderStatic(){
  $("#dept").innerHTML='<a href="#inicio" data-v="home">Início</a>'+Object.entries(SLUG).map(([s,c])=>`<a href="#${s}" data-v="${c}">${CATS[c].nome}</a>`).join("")+'<a href="#ofertas" data-v="ofertas" class="hot">Ofertas</a>';
  const cover={perfume:P.find(p=>p.cat==="perfume"&&p.destaque&&!p.old)||P.find(p=>p.cat==="perfume"),pod:P.find(p=>p.cat==="pod"&&p.novo),liquido:P.find(p=>p.cat==="liquido")};
  $("#tiles").innerHTML=Object.entries(SLUG).map(([s,c],i)=>{const n=P.filter(p=>p.cat===c).length;
    return `<a class="tile${i===0?" lead":" white"}" href="#${s}"><img src="${cover[c].imagem}" alt=""><span class="lab"><b>${CATS[c].nome}</b><span><i class="d" style="font-style:normal">${CATS[c].desc} · </i>${n} produtos</span></span></a>`}).join("");
  const o=P.find(p=>p.old);
  if(o)$("#promo").outerHTML=`<button class="promo card-like" data-id="${o.id}" id="promo"><span class="tx"><span class="k">Oferta da semana</span><b>${esc(o.nome)}</b><span class="pp"><s>${money(o.old)}</s> por <strong>${money(o.price)}</strong></span><span class="pp">${esc(o.marca)} · ${esc(o.familia)} · ${o.tamanho}</span><span class="go">Quero este perfume</span></span><img src="${o.imagem}" alt=""></button>`;
  const shelves=[
    {t:"Perfumes mais pedidos",k:"Perfumaria árabe",href:"#perfumaria",list:P.filter(p=>p.cat==="perfume").sort((a,b)=>(b.destaque|0)-(a.destaque|0)).slice(0,10)},
    {t:"Lançamentos em eletrônicos",k:"Eletrônicos",href:"#eletronicos",list:P.filter(p=>p.cat==="pod"&&p.novo).slice(0,10)},
    {t:"Líquidos e Nic Salt",k:"Líquidos",href:"#liquidos",list:P.filter(p=>p.cat==="liquido").slice(0,10)}];
  $("#shelves").innerHTML=shelves.map(s=>`<section class="wrap shelf"><div class="sh"><div><span class="eyebrow" style="font-size:11.5px">${s.k}</span><h2 class="sec" style="margin:4px 0 0">${s.t}</h2></div><a href="${s.href}">Ver tudo ›</a></div><div class="rail">${s.list.map(cardHTML).join("")}</div></section>`).join("");
  $("#waTxt").href=wa("Olá! Vim pelo catálogo da Grand e quero tirar uma dúvida.");
}

const fold=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function listFor(v){
  if(v==="busca"){const q=fold(query);return P.filter(p=>fold([p.nome,p.marca,p.familia||"",p.genero||"",CATS[p.cat].nome,...p.flavors].join(" ")).includes(q))}
  if(v==="ofertas")return P.filter(p=>p.old||p.novo);
  return P.filter(p=>p.cat===v);
}
function renderPLP(){
  let list=listFor(view);
  let opts=[];
  if(view==="perfume")opts=["Feminino","Masculino"];
  else if(view==="pod"||view==="liquido")opts=[...new Set(list.map(p=>p.marca))];
  $("#sub").innerHTML=opts.length?['<button class="chip sm" data-s="all" aria-pressed="'+(sub==="all")+'">Todos</button>'].concat(opts.map(o=>`<button class="chip sm" data-s="${esc(o)}" aria-pressed="${o===sub}">${esc(o)}</button>`)).join(""):"";
  if(sub!=="all")list=list.filter(p=>view==="perfume"?p.genero===sub:p.marca===sub);
  if(sort==="low")list=[...list].sort((a,b)=>a.price-b.price);
  if(sort==="high")list=[...list].sort((a,b)=>b.price-a.price);
  const title=view==="busca"?`Resultados para “${query}”`:view==="ofertas"?"Ofertas e novidades":CATS[view].nome;
  $("#plpTitle").textContent=title; $("#crCur").textContent=view==="busca"?"Busca":title;
  $("#count").textContent=list.length+(list.length===1?" produto":" produtos");
  $("#grid").innerHTML=list.length?list.map(cardHTML).join(""):`<div class="empty" style="grid-column:1/-1">Nada encontrado. Pergunte no WhatsApp, a loja tem mais produtos.</div>`;
}
function route(){
  const h=location.hash.replace("#","");
  if(view!=="busca"||h!==""){ if(SLUG[h])view=SLUG[h]; else if(h==="ofertas")view="ofertas"; else if(h==="busca"&&query)view="busca"; else view="home"; }
  $("#home").hidden=view!=="home"; $("#plp").hidden=view==="home";
  document.querySelectorAll("#dept a").forEach(a=>a.toggleAttribute("aria-current",a.dataset.v===view));
  if(view!=="home")renderPLP();
}
function go(v){sub="all";sort="rel";$("#sort").value="rel";const h=v==="home"?"inicio":v==="ofertas"?"ofertas":v==="busca"?"busca":SLUG_OF[v];if(location.hash!=="#"+h)location.hash=h;else route();window.scrollTo(0,0)}
window.addEventListener("hashchange",()=>{sub="all";route();window.scrollTo(0,0)});

/* folha do produto */
let cur=null,curOpt=null,qty=1;
function openSheet(el){$("#scrim").classList.add("on");el.classList.add("on");el.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeSheets(){document.querySelectorAll(".sheet").forEach(s=>{s.classList.remove("on");s.setAttribute("aria-hidden","true")});$("#scrim").classList.remove("on");document.body.style.overflow=""}
function openProduct(id){
  cur=P[id];curOpt=null;qty=1;
  const isP=cur.cat==="perfume", isVape=cur.cat==="pod"||cur.cat==="liquido";
  const ph=$("#pPh"); ph.className="ph"+(cur.imagem?(isP?" perf":""):" ico");
  ph.innerHTML=cur.imagem?`<img src="${cur.imagem}" alt="${esc(cur.nome)}">`:(ICONS[cur.icone]||ICONS.leaf);
  $("#pBrand").textContent=cur.marca+" · "+CATS[cur.cat].nome;
  $("#pName").textContent=cur.nome; $("#pPrice").textContent=money(cur.price); $("#pOld").textContent=cur.old?money(cur.old):"";
  $("#pDesc").textContent=cur.descricao||""; $("#pDesc").hidden=!cur.descricao;
  $("#pFacts").innerHTML=isP?[cur.genero,cur.familia,cur.tamanho,"Original"].map(f=>`<span>${esc(f)}</span>`).join(""):""; $("#pFacts").hidden=!isP;
  $("#pNotes").innerHTML=(cur.notas||[]).map(n=>`<li>${esc(n)}</li>`).join(""); $("#pNotes").hidden=!(cur.notas&&cur.notas.length);
  $("#qVal").textContent=1;
  if(cur.flavors.length){
    $("#pFlavWrap").hidden=false; $("#pFlavLbl").textContent=isVape?"Sabor":"Opção";
    $("#pFlav").innerHTML=cur.flavors.map(f=>`<button class="fl-opt" aria-pressed="false" data-fl="${esc(f)}">${esc(f)}</button>`).join("");
    $("#pFlavCount").textContent=cur.flavors.length+(cur.flavors.length>1?" opções":" opção");
    if(cur.flavors.length===1)curOpt=cur.flavors[0];
  } else if(isVape){
    $("#pFlavWrap").hidden=false; $("#pFlavLbl").textContent="Sabor"; $("#pFlavCount").textContent="";
    $("#pFlav").innerHTML='<div class="note">Sabores deste modelo confirmados no WhatsApp, conforme o estoque do dia.</div>';
  } else $("#pFlavWrap").hidden=true;
  sync(); openSheet($("#pSheet"));
}
function sync(){
  document.querySelectorAll("#pFlav .fl-opt").forEach(b=>b.setAttribute("aria-pressed",b.dataset.fl===curOpt));
  const need=cur.flavors.length>1&&!curOpt;
  $("#pAdd").textContent=need?(cur.cat==="pod"||cur.cat==="liquido"?"Escolha um sabor":"Escolha uma opção"):"Adicionar · "+money(cur.price*qty);
  $("#pAdd").disabled=need; $("#pAdd").style.opacity=need?.55:1;
  $("#pSolo").href=wa(`Olá! Vim pelo catálogo da Grand e quero ${qty}x ${cur.nome}${curOpt?" ("+curOpt+")":""}.`);
}

/* carrinho */
function save(){store.set("gt-cart3",cart)}
function addToCart(){const key=cur.id+"|"+(curOpt||"");const l=cart.find(x=>x.key===key);if(l)l.qty+=qty;else cart.push({key,id:cur.id,opt:curOpt||"",qty});save();renderCart();closeSheets();toast("Adicionado ao pedido")}
function totals(){return cart.reduce((a,l)=>({n:a.n+l.qty,v:a.v+l.qty*P[l.id].price}),{n:0,v:0})}
function message(){
  const t=totals(),name=$("#fName").value.trim(),addr=$("#fAddr").value.trim();
  const lines=cart.map(l=>{const p=P[l.id];return `• ${l.qty}x ${p.nome}${l.opt?" — "+l.opt:""} — ${money(p.price*l.qty)}`});
  return ["Olá! Quero fazer este pedido pelo catálogo da Grand:","",...lines,"",`Total: ${money(t.v)}`,
    mode==="pick"?"Vou retirar na loja.":`Entrega em: ${addr||"(informo o endereço)"}`,`Pagamento: ${$("#fPay").value}`,name?`Nome: ${name}`:""].join("\n").replace(/\n+$/,"");
}
function thumb(p){return p.imagem?`<div class="th${p.cat==="perfume"?" perf":""}"><img src="${p.imagem}" alt=""></div>`:`<div class="th ico">${ICONS[p.icone]||ICONS.leaf}</div>`}
function renderCart(){
  const t=totals();
  $("#badge").textContent=t.n;$("#badge").dataset.n=t.n;
  $("#bar").classList.toggle("on",t.n>0);$("#barTxt").textContent=`Ver pedido · ${t.n} ${t.n>1?"itens":"item"}`;$("#barTot").textContent=money(t.v);
  $("#cSub").textContent=t.n?`${t.n} ${t.n>1?"itens":"item"} · revise antes de enviar`:"";
  $("#cQty").textContent=t.n?`· ${t.n} ${t.n>1?"itens":"item"}`:"";$("#cTotal").textContent=money(t.v);
  $("#cItems").innerHTML=cart.length?cart.map((l,i)=>{const p=P[l.id];return `<div class="line">${thumb(p)}
      <div><div class="t">${esc(p.nome)}</div><div class="s">${l.opt?esc(l.opt)+" · ":""}${money(p.price)}</div>
      <div style="display:flex;align-items:center"><div class="mini"><button data-dec="${i}" aria-label="Diminuir">−</button><output>${l.qty}</output><button data-inc="${i}" aria-label="Aumentar">+</button></div><button class="rm" data-rm="${i}">Remover</button></div></div>
      <div class="p">${money(p.price*l.qty)}</div></div>`}).join(""):'<div class="zero">Seu pedido está vazio.<br>Toque em um produto para adicionar.</div>';
  $("#cFoot").style.display=cart.length?"":"none";
  const s=$("#send");s.setAttribute("aria-disabled",cart.length?"false":"true");s.href=cart.length?wa(message()):"#";
}
function setMode(m){mode=m;$("#mPick").setAttribute("aria-pressed",m==="pick");$("#mShip").setAttribute("aria-pressed",m==="ship");$("#addrWrap").hidden=m!=="ship";renderCart()}
let tt;function toast(s){const t=$("#toast");t.textContent=s;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),1600)}

document.addEventListener("click",e=>{
  const c=e.target.closest(".card,[data-id]");if(c&&c.dataset.id){openProduct(+c.dataset.id);return}
  const sb=e.target.closest("[data-s]");if(sb){sub=sb.dataset.s;renderPLP();return}
  const fl=e.target.closest(".fl-opt");if(fl){curOpt=fl.dataset.fl;sync();return}
  if(e.target.closest("[data-close]")||e.target.id==="scrim"){closeSheets();return}
  const d=e.target.closest("[data-dec],[data-inc],[data-rm]");
  if(d){const i=+(d.dataset.dec??d.dataset.inc??d.dataset.rm);
    if(d.dataset.inc!==undefined)cart[i].qty++;else if(d.dataset.dec!==undefined){cart[i].qty--;if(cart[i].qty<1)cart.splice(i,1)}else cart.splice(i,1);
    save();renderCart();}
});
$("#qMinus").onclick=()=>{qty=Math.max(1,qty-1);$("#qVal").textContent=qty;sync()};
$("#qPlus").onclick=()=>{qty=Math.min(20,qty+1);$("#qVal").textContent=qty;sync()};
$("#pAdd").onclick=addToCart;
$("#openCart").onclick=$("#barBtn").onclick=()=>{renderCart();openSheet($("#cSheet"))};
$("#mPick").onclick=()=>setMode("pick");$("#mShip").onclick=()=>setMode("ship");
["#fName","#fAddr","#fPay"].forEach(s=>$(s).addEventListener("input",()=>{$("#send").href=wa(message())}));
$("#send").addEventListener("click",e=>{if(!cart.length)e.preventDefault()});
$("#q").addEventListener("input",e=>{query=e.target.value.trim();if(query){view="busca";sub="all";if(location.hash!=="#busca")history.replaceState(null,"","#busca");$("#home").hidden=true;$("#plp").hidden=false;document.querySelectorAll("#dept a").forEach(a=>a.removeAttribute("aria-current"));renderPLP()}else go("home")});
$("#sort").onchange=e=>{sort=e.target.value;renderPLP()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheets()});
renderStatic();route();renderCart();
