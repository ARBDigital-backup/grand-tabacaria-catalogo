/* Número da loja no formato internacional, só dígitos (ex.: 5561999999999).
   Vazio = o WhatsApp abre e o cliente escolhe o contato. */
const WHATSAPP = "";
const BRANDS = {elfbar:"Elfbar",ignite:"Ignite",lostmary:"Lost Mary",waka:"Waka",dinnerlady:"Dinner Lady",nicsalt:"Nic Salt",juice:"Juice"};
const RAW = (window.PRODUTOS||[]).map(p=>({brand:p.marca,name:p.nome,price:p.preco,data:p.imagem,isNew:p.novo,flavors:p.sabores||[]}));

const fix = {"pieapple":"pineapple","fcuking":"f*cking","fcukin":"f*ckin"};
const tc = s => s.toLowerCase().replace(/\s+/g," ").trim().split(" ").map(w=>{w=fix[w]||w;return w.length<=2&&/^(of|e|de|da)$/.test(w)?w:w.charAt(0).toUpperCase()+w.slice(1)}).join(" ").replace(/\b(Mg|Ml)\b/g,m=>m.toLowerCase());
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const PRODUCTS = RAW.map((p,i)=>({id:i,brand:p.brand,brandName:BRANDS[p.brand]||p.brand,name:p.name.replace(/\s+/g," ").trim(),
  price:parseFloat(String(p.price).replace(/\./g,"").replace(",","."))||0,img:p.data,isNew:!!p.isNew,
  flavors:[...new Set(p.flavors.map(tc))]}));

const $ = s => document.querySelector(s);
const wa = text => "https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(text);
const store = {get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* porta de idade */
(function(){let ok=false;try{ok=sessionStorage.getItem("gt-age")==="1"}catch(e){}
  if(ok)$("#gate").hidden=true;
  $("#gateYes").onclick=()=>{try{sessionStorage.setItem("gt-age","1")}catch(e){}$("#gate").hidden=true};
  $("#gateNo").onclick=()=>{$("#gate .box").innerHTML='<div class="mark">G</div><h2>Volte quando tiver 18 anos</h2><p>Este catálogo é exclusivo para maiores de idade.</p>'};})();

/* estado */
let filter = "all", query = "", sort = "rel";
let cart = store.get("gt-cart",[]).filter(l=>PRODUCTS[l.id]);
let mode = "pick";

function cardHTML(p){
  const fl = p.flavors.length ? p.flavors.length+(p.flavors.length>1?" sabores":" sabor") : "Sabor na loja";
  return `<button class="card" data-id="${p.id}" aria-label="${p.name}, ${money(p.price)}">
    <div class="ph">${p.isNew?'<span class="tag">NOVO</span>':''}<img src="${p.img}" alt="" decoding="async"></div>
    <div class="bd"><span class="br">${p.brandName}</span><span class="nm">${p.name}</span>
      <div class="ft"><div><div class="pr">${money(p.price)}</div><div class="fl">${fl}</div></div>
      <span class="add" aria-hidden="true"><svg viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg></span></div></div>
  </button>`;
}

function renderStatic(){
  const news = PRODUCTS.filter(p=>p.isNew);
  $("#rail").innerHTML = news.map(cardHTML).join("");
  $("#newMeta").textContent = news.length+" novidades";
  const keys = Object.keys(BRANDS);
  $("#brands").innerHTML = keys.map(k=>{const ps=PRODUCTS.filter(p=>p.brand===k);const f=ps.reduce((a,p)=>a+p.flavors.length,0);
    return `<button class="brand" data-brand="${k}"><b>${BRANDS[k]}</b><span>${ps.length} ${ps.length>1?"modelos":"modelo"}${f?" · "+f+" sabores":""}</span></button>`}).join("");
  $("#brandMeta").textContent = keys.length+" marcas em estoque";
  $("#chips").innerHTML = ['<button class="chip" data-f="all" aria-pressed="true">Todos</button>','<button class="chip" data-f="new" aria-pressed="false">Lançamentos</button>']
    .concat(keys.map(k=>`<button class="chip" data-f="${k}" aria-pressed="false">${BRANDS[k]}</button>`)).join("");
  $("#perfumeWa").href = wa("Olá! Vim pelo catálogo e quero uma indicação de perfume árabe.");
}

const fold = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
function renderGrid(){
  let list = PRODUCTS.filter(p=> filter==="all" || (filter==="new"?p.isNew:p.brand===filter));
  if(query){const q=fold(query);list=list.filter(p=>fold(p.name+" "+p.brandName+" "+p.flavors.join(" ")).includes(q))}
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(sort==="new")list.sort((a,b)=>b.isNew-a.isNew);
  $("#grid").innerHTML = list.length ? list.map(cardHTML).join("") : `<div class="empty" style="grid-column:1/-1">Nada encontrado${query?` para “${query.replace(/[<>&]/g,"")}”`:""}. Tente outro sabor ou marca, ou pergunte no WhatsApp.</div>`;
  $("#count").textContent = list.length+(list.length===1?" produto":" produtos")+(query?` para “${query}”`:"");
  $("#gridTitle").textContent = filter==="all"?"Todo o catálogo":filter==="new"?"Lançamentos":BRANDS[filter];
  document.querySelectorAll("#chips .chip").forEach(c=>c.setAttribute("aria-pressed",c.dataset.f===filter));
}

/* folha de produto */
let cur=null, curFlavor=null, qty=1;
function openSheet(el){$("#scrim").classList.add("on");el.classList.add("on");el.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeSheets(){document.querySelectorAll(".sheet").forEach(s=>{s.classList.remove("on");s.setAttribute("aria-hidden","true")});$("#scrim").classList.remove("on");document.body.style.overflow=""}
function openProduct(id){
  cur=PRODUCTS[id]; curFlavor=null; qty=1;
  $("#pImg").src=cur.img; $("#pImg").alt=cur.name; $("#pBrand").textContent=cur.brandName+(cur.isNew?" · Lançamento":"");
  $("#pName").textContent=cur.name; $("#pPrice").textContent=money(cur.price); $("#qVal").textContent=1;
  if(cur.flavors.length){
    $("#pFlav").innerHTML=cur.flavors.map(f=>`<button class="fl-opt" aria-pressed="false" data-fl="${f.replace(/"/g,"&quot;")}">${f}</button>`).join("");
    $("#pFlavCount").textContent=cur.flavors.length+(cur.flavors.length>1?" opções":" opção");
    if(cur.flavors.length===1)curFlavor=cur.flavors[0];
  } else {
    $("#pFlav").innerHTML='<div class="note">Sabores deste modelo confirmados no WhatsApp, conforme o estoque do dia.</div>';
    $("#pFlavCount").textContent="";
  }
  syncProduct(); openSheet($("#pSheet"));
}
function syncProduct(){
  document.querySelectorAll("#pFlav .fl-opt").forEach(b=>b.setAttribute("aria-pressed",b.dataset.fl===curFlavor));
  const need = cur.flavors.length>1 && !curFlavor;
  $("#pAdd").textContent = need ? "Escolha um sabor" : "Adicionar · "+money(cur.price*qty);
  $("#pAdd").disabled = need; $("#pAdd").style.opacity = need?.55:1;
  $("#pSolo").href = wa(`Olá! Vim pelo catálogo e quero ${qty}x ${cur.name}${curFlavor?" sabor "+curFlavor:""}.`);
}

/* carrinho */
function save(){store.set("gt-cart",cart)}
function addToCart(){
  const key=cur.id+"|"+(curFlavor||"");
  const l=cart.find(x=>x.key===key); if(l)l.qty+=qty; else cart.push({key,id:cur.id,flavor:curFlavor||"",qty});
  save(); renderCart(); closeSheets(); toast("Adicionado ao pedido");
}
function totals(){return cart.reduce((a,l)=>({n:a.n+l.qty,v:a.v+l.qty*PRODUCTS[l.id].price}),{n:0,v:0})}
function message(){
  const t=totals(), name=$("#fName").value.trim(), addr=$("#fAddr").value.trim();
  const lines=cart.map(l=>{const p=PRODUCTS[l.id];return `• ${l.qty}x ${p.name}${l.flavor?" — "+l.flavor:""} — ${money(p.price*l.qty)}`});
  return ["Olá! Quero fazer este pedido pelo catálogo:","",...lines,"",`Total: ${money(t.v)}`,
    mode==="pick"?"Vou retirar na loja.":`Entrega em: ${addr||"(informo o endereço)"}`,
    `Pagamento: ${$("#fPay").value}`, name?`Nome: ${name}`:""].filter((x,i,a)=>x!==""||a[i-1]!=="").join("\n").trim();
}
function renderCart(){
  const t=totals();
  $("#badge").textContent=t.n; $("#badge").dataset.n=t.n;
  $("#bar").classList.toggle("on",t.n>0);
  $("#barTxt").textContent=`Ver pedido · ${t.n} ${t.n>1?"itens":"item"}`; $("#barTot").textContent=money(t.v);
  $("#cSub").textContent=t.n?`${t.n} ${t.n>1?"itens":"item"} · revise antes de enviar`:"";
  $("#cQty").textContent=t.n?`· ${t.n} ${t.n>1?"itens":"item"}`:"";
  $("#cTotal").textContent=money(t.v);
  $("#cItems").innerHTML = cart.length ? cart.map((l,i)=>{const p=PRODUCTS[l.id];return `<div class="line">
      <img src="${p.img}" alt="">
      <div><div class="t">${p.name}</div><div class="s">${l.flavor||"Sabor a confirmar"} · ${money(p.price)}</div>
        <div class="mini"><button data-dec="${i}" aria-label="Diminuir">−</button><output>${l.qty}</output><button data-inc="${i}" aria-label="Aumentar">+</button></div>
        <button class="rm" data-rm="${i}">Remover</button></div>
      <div class="p">${money(p.price*l.qty)}</div></div>`}).join("")
    : '<div class="zero">Seu pedido está vazio.<br>Toque em um produto para adicionar.</div>';
  $("#cFoot").style.display = cart.length?"":"none";
  const send=$("#send"); send.setAttribute("aria-disabled",cart.length?"false":"true"); send.href = cart.length?wa(message()):"#";
}
function setMode(m){mode=m;$("#mPick").setAttribute("aria-pressed",m==="pick");$("#mShip").setAttribute("aria-pressed",m==="ship");$("#addrWrap").hidden=m!=="ship";renderCart()}

let tt; function toast(s){const t=$("#toast");t.textContent=s;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),1600)}

/* eventos */
document.addEventListener("click",e=>{
  const card=e.target.closest(".card"); if(card){openProduct(+card.dataset.id);return}
  const br=e.target.closest(".brand"); if(br){filter=br.dataset.brand;renderGrid();$("#catalogo").scrollIntoView();return}
  const chip=e.target.closest(".chip"); if(chip){filter=chip.dataset.f;renderGrid();return}
  const fl=e.target.closest(".fl-opt"); if(fl){curFlavor=fl.dataset.fl;syncProduct();return}
  if(e.target.closest("[data-close]")||e.target.id==="scrim"){closeSheets();return}
  const d=e.target.closest("[data-dec],[data-inc],[data-rm]");
  if(d){const i=+(d.dataset.dec??d.dataset.inc??d.dataset.rm);
    if(d.dataset.inc!==undefined)cart[i].qty++; else if(d.dataset.dec!==undefined){cart[i].qty--; if(cart[i].qty<1)cart.splice(i,1)} else cart.splice(i,1);
    save();renderCart();}
});
$("#qMinus").onclick=()=>{qty=Math.max(1,qty-1);$("#qVal").textContent=qty;syncProduct()};
$("#qPlus").onclick=()=>{qty=Math.min(20,qty+1);$("#qVal").textContent=qty;syncProduct()};
$("#pAdd").onclick=addToCart;
$("#openCart").onclick=()=>{renderCart();openSheet($("#cSheet"))};
$("#barBtn").onclick=()=>{renderCart();openSheet($("#cSheet"))};
$("#mPick").onclick=()=>setMode("pick"); $("#mShip").onclick=()=>setMode("ship");
["#fName","#fAddr","#fPay"].forEach(s=>$(s).addEventListener("input",()=>{$("#send").href=wa(message())}));
$("#send").addEventListener("click",e=>{if(!cart.length)e.preventDefault()});
$("#q").addEventListener("input",e=>{query=e.target.value.trim();renderGrid();if(query&&window.scrollY<$("#catalogo").offsetTop-200)$("#catalogo").scrollIntoView()});
$("#sort").onchange=e=>{sort=e.target.value;renderGrid()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheets()});

renderStatic(); renderGrid(); renderCart();
