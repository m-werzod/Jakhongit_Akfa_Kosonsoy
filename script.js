/* script.js
   Interaktiv mahsulotlar ro'yxati, kalkulyator va Telegram orqali yuborish.
   Til: Uzbek (Latin)
*/

const phoneNumber = '+998916413501';
// Telegram username yoki kanal: o'zingizning username-ni qo'ying yoki quyidagi namunani almashtiring
const telegramUsername = 'jakhongir_akfa_kosonsoy'; // agar mavjud bo'lsa
const telegramShareBase = 'https://t.me/share/url';

const products = [
  {
    id: 'w1',
    name: 'Standart Akfa Oyna',
    materialOptions: [
      { name: 'PVC 58 mm', pricePerM2: 120000 },
      { name: 'PVC 70 mm', pricePerM2: 160000 }
    ],
    description: 'Oddiy, byudjet uchun mos oyna.',
    image: makeSVGDataURL('#f0f6ff', '#2b6eff', 'Oyna 1')
  },
  {
    id: 'w2',
    name: 'Izolyatsiyalangan Akfa Oyna',
    materialOptions: [
      { name: 'PVC 70 mm + izolyatsiya', pricePerM2: 200000 },
      { name: 'PVC 70 mm + premium izolyatsiya', pricePerM2: 260000 }
    ],
    description: 'Yaxshi issiqlik va shovqinni to\'sig\'.',
    image: makeSVGDataURL('#fff7ed', '#ff8c00', 'Izolyatsiya')
  },
  {
    id: 'd1',
    name: 'Sürmeli Esik (Sliding Door)',
    materialOptions: [
      { name: 'Aluminium ramka', pricePerM2: 220000 },
      { name: 'PVC ramka', pricePerM2: 190000 }
    ],
    description: 'Katta joylar uchun sürmeli eshiklar.',
    image: makeSVGDataURL('#f3fff0', '#22c55e', 'Eshik')
  },
  {
    id: 'd2',
    name: 'Premium Akfa Esik',
    materialOptions: [
      { name: 'Premium profil + 3 qavat', pricePerM2: 320000 },
      { name: 'Premium + to\'liq izolyatsiya', pricePerM2: 390000 }
    ],
    description: 'Eng yaxshi materiallar va ko\'rkam dizayn.',
    image: makeSVGDataURL('#fff0f6', '#db2777', 'Premium')
  },
  {
    id: 'w3',
    name: 'Kichik Ramkali Oyna',
    materialOptions: [
      { name: 'PVC 58 mm', pricePerM2: 110000 },
      { name: 'PVC 70 mm', pricePerM2: 150000 }
    ],
    description: 'Kichik balkon va xonalar uchun.',
    image: makeSVGDataURL('#f7f7ff', '#6366f1', 'Mini')
  }
];

// helpers
function makeSVGDataURL(bg = '#fff', stroke = '#000', label = '') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'>
  <rect width='100%' height='100%' rx='12' fill='${bg}' stroke='${stroke}' stroke-width='2'/>
  <g transform='translate(20,40)'>
    <rect x='0' y='0' width='160' height='140' rx='6' fill='#fff' stroke='${stroke}' opacity='0.9'/>
    <rect x='190' y='0' width='190' height='60' rx='6' fill='#fff' stroke='${stroke}' opacity='0.9'/>
    <text x='10' y='170' font-family='Arial' font-size='20' fill='${stroke}'>${label}</text>
  </g></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

function formatNumber(n){
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// DOM refs
const productsGrid = document.getElementById('productsGrid');
const selectProduct = document.getElementById('selectProduct');
const selectMaterial = document.getElementById('selectMaterial');
const inputArea = document.getElementById('inputArea');
const calcBtn = document.getElementById('calcBtn');
const addToEstimateBtn = document.getElementById('addToEstimate');
const resultText = document.getElementById('resultText');
const resultTotal = document.getElementById('resultTotal');
const estimateList = document.getElementById('estimateList');
const estimateTotalEl = document.getElementById('estimateTotal');
const sendTelegramBtn = document.getElementById('sendTelegram');
const yearEl = document.getElementById('year');

// header nav controls
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');
const navClose = document.getElementById('navClose');
const telegramChat = document.getElementById('telegramChat');
const openTelegram = document.getElementById('openTelegram');

let estimate = []; // {id, name, material, area, unitPrice, subtotal}

// initialize
function init(){
  yearEl.textContent = new Date().getFullYear();
  renderProducts();
  populateSelectProducts();
  selectProduct.addEventListener('change', onProductChange);
  calcBtn.addEventListener('click', onCalculate);
  addToEstimateBtn.addEventListener('click', onAddToEstimate);
  sendTelegramBtn.addEventListener('click', onSendTelegram);
  hamburger.addEventListener('click', () => mainNav.classList.add('open'));
  navClose.addEventListener('click', () => mainNav.classList.remove('open'));
  telegramChat.addEventListener('click', openTelegramChat);
  openTelegram.addEventListener('click', openTelegramChat);
  populateMaterialOptions(0);
  // keyboard: Enter in area triggers calc
  inputArea.addEventListener('keydown', (e)=>{ if(e.key==='Enter') onCalculate(); });
}

function renderProducts(){
  productsGrid.innerHTML = '';
  products.forEach(prod=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="img"><img src="${prod.image}" alt="${prod.name}" style="max-width:100%;height:100%;object-fit:cover;border-radius:6px" /></div>
      <h4>${prod.name}</h4>
      <p class="small-muted">${prod.description}</p>
      <div class="meta">
        <span class="small-muted">Boshlang'ich narx: ${formatNumber(prod.materialOptions[0].pricePerM2)} so'm/m²</span>
        <button class="btn btn-sm" data-id="${prod.id}">Tanlash</button>
      </div>
    `;
    const btn = div.querySelector('button');
    btn.addEventListener('click', ()=> {
      selectProduct.value = prod.id;
      onProductChange();
      document.getElementById('calculator').scrollIntoView({behavior:'smooth'});
    });
    productsGrid.appendChild(div);
  });
}

function populateSelectProducts(){
  selectProduct.innerHTML = '';
  products.forEach((p, idx)=> {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} — ${formatNumber(p.materialOptions[0].pricePerM2)} so'm/m²`;
    selectProduct.appendChild(opt);
  });
}

function populateMaterialOptions(productIndexOrId){
  let prod;
  if(typeof productIndexOrId === 'number'){
    prod = products[productIndexOrId];
  } else {
    prod = products.find(p => p.id === productIndexOrId) || products[0];
  }
  selectMaterial.innerHTML = '';
  prod.materialOptions.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${m.name} — ${formatNumber(m.pricePerM2)} so'm/m²`;
    selectMaterial.appendChild(opt);
  });
}

function onProductChange(){
  const selectedId = selectProduct.value;
  populateMaterialOptions(selectedId);
}

function onCalculate(){
  const prodId = selectProduct.value || products[0].id;
  const prod = products.find(p=>p.id===prodId);
  const matIndex = Number(selectMaterial.value || 0);
  const area = Number(inputArea.value || 0);
  if(!prod || isNaN(area) || area <= 0){
    resultText.textContent = 'Iltimos, mahsulot va maydonni to\'liq kiriting (m²).';
    resultTotal.textContent = '';
    return;
  }
  const unit = prod.materialOptions[matIndex].pricePerM2;
  const subtotal = Math.round(unit * area);
  resultText.textContent = `${prod.name} — ${prod.materialOptions[matIndex].name} — ${formatNumber(unit)} so'm/m² × ${area} m²`;
  resultTotal.textContent = `${formatNumber(subtotal)} so'm`;
}

function onAddToEstimate(){
  const prodId = selectProduct.value || products[0].id;
  const prod = products.find(p=>p.id===prodId);
  const matIndex = Number(selectMaterial.value || 0);
  const area = Number(inputArea.value || 0);
  if(!prod || isNaN(area) || area <= 0){
    alert('Iltimos, mahsulot va maydonni to\'liq kiriting (m²).');
    return;
  }
  const unit = prod.materialOptions[matIndex].pricePerM2;
  const subtotal = Math.round(unit * area);
  const item = {
    uid: `${prodId}-${Date.now()}`,
    id: prodId,
    name: prod.name,
    material: prod.materialOptions[matIndex].name,
    area,
    unitPrice: unit,
    subtotal
  };
  estimate.push(item);
  renderEstimate();
  // clear area for next input
  inputArea.value = '';
  resultText.textContent = 'Buyurtma ro\'yxatiga qo\'shildi.';
  resultTotal.textContent = '';
}

function renderEstimate(){
  estimateList.innerHTML = '';
  if(estimate.length === 0){
    estimateList.innerHTML = `<p class="small-muted">Hech qanday mahsulot yo'q</p>`;
    estimateTotalEl.textContent = '0';
    return;
  }
  estimate.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'estimate-item';
    el.innerHTML = `
      <div>
        <div style="font-weight:700">${it.name} — ${it.material}</div>
        <div class="small-muted">${it.area} m² × ${formatNumber(it.unitPrice)} so'm</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700">${formatNumber(it.subtotal)} so'm</div>
        <button class="remove" data-uid="${it.uid}" title="O'chirish">✕</button>
      </div>
    `;
    const removeBtn = el.querySelector('.remove');
    removeBtn.addEventListener('click', ()=> {
      estimate = estimate.filter(x => x.uid !== it.uid);
      renderEstimate();
    });
    estimateList.appendChild(el);
  });
  const total = estimate.reduce((s,i)=>s+i.subtotal,0);
  estimateTotalEl.textContent = formatNumber(total);
}

function onSendTelegram(){
  if(estimate.length === 0){
    alert('Iltimos, avval buyurtma ro\'yxatiga mahsulot qo\'shing.');
    return;
  }
  const total = estimate.reduce((s,i)=>s+i.subtotal,0);
  let text = `Buyurtma: Jakhongir Akfa Kosonsoy\nTelefon: ${phoneNumber}\n\nMahsulotlar:\n`;
  estimate.forEach((it, idx) => {
    text += `${idx+1}. ${it.name} — ${it.material} — ${it.area} m² — ${formatNumber(it.subtotal)} so'm\n`;
  });
  text += `\nJami: ${formatNumber(total)} so'm\n\nIltimos, bog'laning.`;
  // Use share link to open Telegram
  const url = `${telegramShareBase}?url=&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// open Telegram chat with username or with phone (tg://resolve)
function openTelegramChat(){
  // First try to open telegram app by tg:// scheme
  const tgUrlApp = `tg://resolve?domain=${telegramUsername}`;
  const tgUrlWeb = `https://t.me/${telegramUsername}`;
  // Try to open tg:// then fallback to web after a short timeout
  const now = Date.now();
  const win = window.open(tgUrlApp, '_blank');
  // if popup blocked or not handled, fallback to web.t.me
  setTimeout(()=> {
    // If window couldn't open, use web link
    window.open(tgUrlWeb, '_blank');
  }, 700);
}

// run
init();