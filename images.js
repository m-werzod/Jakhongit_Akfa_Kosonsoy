// images.js - Rasmlar sahifasi uchun
// Bu skript mahsulotlar ro'yxatini oladi (index sahifadagi products bilan mos id ishlatiladi)
// Foydalanuvchi rasm yuklashi yoki URL kiritishi mumkin. Saqlash localStorage ga bo'ladi.

// Agar products ro'yxatini index sahifasidan import qilmasa, shu yerda qisqacha nusxa:
const productsForImages = [
  { id: 'w1', name: 'Standart Akfa Oyna', defaultLabel:'Oyna 1' },
  { id: 'w2', name: 'Izolyatsiyalangan Oyna', defaultLabel:'Izolyatsiya' },
  { id: 'd1', name: 'Sürmeli Esik', defaultLabel:'Eshik' },
  { id: 'd2', name: 'Premium Esik', defaultLabel:'Premium' },
  { id: 'w3', name: 'Kichik Ramkali Oyna', defaultLabel:'Kichik' }
];

function makeDefaultSVG(label='#R') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'>
    <rect width='100%' height='100%' rx='12' fill='#f0f6ff' stroke='#2b6eff' stroke-width='2'/>
    <text x='20' y='200' font-family='Arial' font-size='22' fill='#2b6eff'>${label}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}
function getStoredImage(id){
  const key = `product_img_${id}`;
  try{ return localStorage.getItem(key); }catch(e){ return null; }
}
function setStoredImage(id, dataUrl){
  const key = `product_img_${id}`;
  try{ localStorage.setItem(key, dataUrl); return true; }catch(e){ return false; }
}
function removeStoredImage(id){
  const key = `product_img_${id}`;
  try{ localStorage.removeItem(key); return true; }catch(e){ return false; }
}

function createRow(prod){
  const container = document.createElement('div');
  container.className = 'image-row';
  const previewSrc = getStoredImage(prod.id) || makeDefaultSVG(prod.defaultLabel || prod.name);
  container.innerHTML = `
    <div class="preview"><img src="${previewSrc}" alt="${prod.name}" style="width:100%;height:100%;object-fit:cover" /></div>
    <div class="controls">
      <div style="font-weight:800">${prod.name}</div>
      <div class="small-muted">Fayl yuklash yoki rasm URL kiriting</div>
      <input type="file" accept="image/*" class="file-input" />
      <input type="url" placeholder="Rasm URL kiriting (https://...)" class="url-input" />
      <div style="display:flex;gap:8px">
        <button class="btn save-btn">Saqlash</button>
        <button class="btn outline reset-btn">Defaultga qaytarish</button>
      </div>
      <div class="small-muted note">Saqlashdan so'ng asosiy sahifada (index.html) rasm yangilanadi.</div>
    </div>
  `;
  // handlers
  const fileInput = container.querySelector('.file-input');
  const urlInput = container.querySelector('.url-input');
  const saveBtn = container.querySelector('.save-btn');
  const resetBtn = container.querySelector('.reset-btn');
  const previewImg = container.querySelector('.preview img');

  fileInput.addEventListener('change', async (e)=>{
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      previewImg.src = ev.target.result;
      urlInput.value = ''; // clear url
      // keep data in a temp attribute for saving
      container._pendingData = ev.target.result;
    };
    reader.readAsDataURL(f);
  });

  urlInput.addEventListener('input', (e)=>{
    const v = e.target.value.trim();
    if(v){
      previewImg.src = v;
      container._pendingData = v;
    }
  });

  saveBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const data = container._pendingData;
    if(!data){
      alert('Iltimos, rasm faylini yuklang yoki rasm URL kiriting.');
      return;
    }
    const ok = setStoredImage(prod.id, data);
    if(ok) {
      alert('Rasm saqlandi. Asosiy sahifani yangilang.');
    } else alert('Rasmni saqlashda xatolik yuz berdi.');
  });

  resetBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const ok = removeStoredImage(prod.id);
    if(ok){
      previewImg.src = makeDefaultSVG(prod.defaultLabel || prod.name);
      alert('Default rasm tiklandi. Asosiy sahifani yangilang.');
    } else alert('O\'chirib bo\'lmadi.');
  });

  return container;
}

function initImagesPage(){
  const list = document.getElementById('imagesList');
  if(!list) return;
  list.innerHTML = '';
  productsForImages.forEach(p=>{
    list.appendChild(createRow(p));
  });

  document.getElementById('saveAll').addEventListener('click', ()=>{
    // Try to trigger click on each save button to persist current previews
    const rows = Array.from(document.querySelectorAll('.image-row'));
    rows.forEach((r, i)=>{
      const img = r.querySelector('.preview img');
      const prod = productsForImages[i];
      if(img && img.src){
        setStoredImage(prod.id, img.src);
      }
    });
    alert('Hammasi saqlandi. Asosiy sahifani yangilang.');
  });
  document.getElementById('resetAll').addEventListener('click', ()=>{
    if(!confirm('Hamma rasmni defaultga qaytarishni xohlaysizmi?')) return;
    productsForImages.forEach(p=> removeStoredImage(p.id));
    // refresh
    initImagesPage();
    alert('Hammasi defaultga qaytarildi.');
  });
}
document.addEventListener('DOMContentLoaded', initImagesPage);