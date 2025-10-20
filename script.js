/* ----- البيانات: قائمة 200 كلمة (English + Arabic) ----- */
const words = [  "paramedic",
  "architect",
  "water resources engineer",
  "mechanic",
  "tailor",
  "delivery person",
  "street cleaner",
  "traffic officer",
  "community",
  "research",
  "emergency",
  "brave",
  "vehicles",
  "control",
  "afraid",
  "difficult",
  "success",
  "quick",
  "life",
  "happen",
  "stop",
  "need",
  "fix",
  "save",
  "cross",
  "matter"
];
const arabicWords = [  "مسعف",
  "مهندس معماري",
  "مهندس موارد مائية",
  "ميكانيكي",
  "ترزي (خياط ملابس)",
  "عامل توصيل طلبات",
  "عامل نظافة الشارع",
  "ضابط مرور",
  "مجتمع",
  "بحث علمي",
  "طوارئ",
  "شجاع",
  "مركبات",
  "تحكم",
  "خائف",
  "صعب",
  "نجاح",
  "سريع",
  "حياة",
  "يحدث",
  "يتوقف",
  "يحتاج",
  "يصلح",
  "ينقذ/يوفر",
  "يعبر",
  "يهم/أمر"
];
/* ----- إعداد النجوم ----- */
function initStars(){
  const board = document.getElementById('starBoard');
  board.innerHTML = '';
  for(let i=0;i<28;i++){
    const s = document.createElement('span');
    s.textContent = '☆';
    s.onclick = ()=> s.textContent = s.textContent==='☆' ? '⭐' : '☆';
    board.appendChild(s);
  }
}

/* ----- عرض الأقسام ----- */
function showRound(id){
  document.querySelectorAll('.content').forEach(sec=>sec.classList.remove('active'));
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add('active');
  if(id==='dictionary') filterDictionary();
  if(id==='round1') startFlashcards();
  if(id==='round2') startRound2();
  if(id==='round3') startRound3();
}

window.onload = ()=>{
  initStars();
  filterDictionary();
  showRound('dictionary');
};

/* ----- Dictionary ----- */
function filterDictionary(){
  const q = (document.getElementById('dictFilter').value||'').toLowerCase();
  const list = document.getElementById('dictList');
  list.innerHTML = '';
  for(let i=0;i<words.length;i++){
    if(!q || words[i].toLowerCase().includes(q) || arabicWords[i].includes(q)){
      const li = document.createElement('li');
      li.textContent = words[i] + ' — ' + arabicWords[i];
      list.appendChild(li);
    }
  }
}

/* ----- Round 1: Flashcards ----- */
let currentFlash = 0;
let flashTimerId = null;
let flashCounting = false;

function startFlashcards(){
  if(currentFlash >= words.length) currentFlash = 0;
  showFlash();
}

function showFlash(){
  clearInterval(flashTimerId);
  document.getElementById('flashInputBox').style.display = 'none';
  const flashEl = document.getElementById('flashcard');
  flashEl.style.display = 'block';
  flashEl.textContent = words[currentFlash] + ' — ' + arabicWords[currentFlash];

  let t = 15;
  const timerEl = document.getElementById('flashTimer');
  timerEl.textContent = `الوقت لعرض الكلمة: ${t}s`;
  flashCounting = true;
  flashTimerId = setInterval(()=>{
    t--;
    if(t>=0) timerEl.textContent = `الوقت لعرض الكلمة: ${t}s`;
    if(t<=0){
      clearInterval(flashTimerId);
      flashCounting = false;
      flashEl.style.display = 'none';
      timerEl.textContent = `اكتب الكلمة الآن`;
      document.getElementById('flashInputBox').style.display = 'block';
      document.getElementById('flashInput').value = '';
      document.getElementById('flashInput').focus();
    }
  },1000);
  updateRound1Progress();
}

function checkFlashBtn(){
  if(flashCounting){
    alert('انتظر قليلاً حتى تختفي الكلمة ثم اكتبها في الصندوق');
    return;
  }
  const val = (document.getElementById('flashInput').value||'').trim().toLowerCase();
  if(val === words[currentFlash].toLowerCase()){
    currentFlash++;
    if(currentFlash >= words.length) currentFlash = 0;
    document.getElementById('flashInputBox').style.display = 'none';
    document.getElementById('flashTimer').textContent = '';
    showFlash();
  } else {
    alert('خطأ — حاول تاني');
    document.getElementById('flashInput').value = '';
    document.getElementById('flashInput').focus();
  }
}

function updateRound1Progress(){
  const el = document.getElementById('round1Progress');
  el.textContent = `الكلمة رقم ${currentFlash+1} من ${words.length}`;
}

/* ----- Round 2: كل الكلمات ----- */
function startRound2(){
  const container = document.getElementById('round2-tables');
  container.innerHTML = '';

  const table = document.createElement('table');
  let tr = document.createElement('tr');

  for(let i=0; i<words.length; i++){
    const td = document.createElement('td');
    td.style.verticalAlign = 'top';

    const arabic = document.createElement('div');
    arabic.textContent = arabicWords[i];

    const input = document.createElement('input');
    input.className = 'word-input';
    input.id = 'r2_in_' + i;
    input.placeholder = 'English';
    input.style.color = '#000';

    const btn = document.createElement('button');
    btn.className = 'small';
    btn.textContent = 'Check';
    btn.onclick = ()=> checkRound2(i);

    td.appendChild(arabic);
    td.appendChild(input);
    td.appendChild(document.createElement('br'));
    td.appendChild(btn);
    tr.appendChild(td);

    if((i+1)%6 === 0){
      table.appendChild(tr);
      tr = document.createElement('tr');
    }
  }
  if(tr.children.length > 0) table.appendChild(tr);

  container.appendChild(table);

  const info = document.createElement('div');
  info.style.marginTop='8px';
  info.textContent = `اكتب الإنجليزية لكل الكلمات واضغط Check لكل كلمة.`;
  container.appendChild(info);
}

function checkRound2(index){
  const input = document.getElementById('r2_in_' + index);
  const val = (input.value||'').trim().toLowerCase();
  if(val === words[index].toLowerCase()){
    input.classList.remove('incorrect'); input.classList.add('correct');
  } else {
    input.classList.remove('correct'); input.classList.add('incorrect');
  }
}

/* ----- Round 3 ----- */
function startRound3(){
  const container = document.getElementById('round3Words');
  container.innerHTML = '';
  const shuffled = words.slice().sort(()=>Math.random()-0.5).slice(0,20);
  shuffled.forEach(w=>{
    const sp = document.createElement('span');
    sp.textContent = w;
    container.appendChild(sp);
  });
}
