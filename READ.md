# Jakhongir Akfa Kosonsoy — Web sayt (namuna)

Ushbu loyiha — "Jakhongir Akfa Kosonsoy" nomli to'liq frontend namuna veb-sayt. Saytdagi asosiy funksiyalar:

- Mahsulotlar (Akfa oynalar va eshiklar) kartochkalari
- Narxlar m² (kvadrat metr) bo'yicha ko'rsatiladi
- Interaktiv kalkulyator: mahsulot va materialni tanlab, m² kiritsangiz narx hisoblanadi
- Taxminiy buyurtma ro'yxati (cart) va umumiy summa
- "Telegram orqali yuborish" tugmasi: tanlangan buyurtma matnini Telegram orqali (share link) ochadi
- Telefon link: tel:+998916413501
- To'liq responsive dizayn va mobil menyu (hamburger)
- Uzbek tilida barcha matnlar

Qanday ishga tushirish:
1. Fayllarni bir katalogga joylang (index.html, styles.css, script.js va README.md).
2. Brauzerda `index.html` faylini oching.

Eslatma:
- Ilova frontend (statik) bo'lib, haqiqiy buyurtmani serverga yuborish yoki Telegram bot orqali avtomatik jo'natish uchun backend kerak bo'ladi. Hozirgi implementatsiya Telegram "share" yoki tg://resolve orqali mijozning qurilmasida telegram ilovasini yoki web.telegram.org ni ochadi va matnni yuborish imkonini beradi.
- Mahsulot rasmlari SVG placeholder sifatida qo'shilgan. O'zingiz xohlagan rasmlarni `script.js` dagi product.obraz (image) maydoniga URL sifatida qo'yishingiz mumkin.