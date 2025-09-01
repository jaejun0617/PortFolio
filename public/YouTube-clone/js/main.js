// 카테고리
const lis = document.querySelectorAll('.category ul li');
const firstLi = lis[0];

// 무한스크롤

let count = 0;

// 초기상태
firstLi.classList.add('active');

lis.forEach(li => {
   li.addEventListener('click', () => {
      // 클래스 제거
      lis.forEach(CateGory => CateGory.classList.remove('active'));
      // 호버된 li에만 클래스 추가
      li.classList.add('active');
   });
});

// 1. 랜덤 날짜 생성 함수
function randomDateString() {
   const rand = Math.random();
   if (rand < 0.5) {
      const hoursAgo = Math.floor(Math.random() * 24);
      return `${hoursAgo}시간 전`;
   } else {
      const monthsAgo = Math.floor(Math.random() * 12) + 1;
      return `${monthsAgo}개월 전`;
   }
}

// 2. JSON 데이터 생성 (100개)
const itemsData = [];
for (let i = 1; i <= 1000; i++) {
   itemsData.push({
      id: i,
      date: randomDateString(),
   });
}

// 3. 렌더링 함수 (10개씩 추가)
const content = document.getElementById('content');
let loadedCount = 0;
const loadCount = 10;

function loadItems() {
   const slice = itemsData.slice(loadedCount, loadedCount + loadCount);
   slice.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.style.display = 'flex';
      div.style.marginBottom = '15px';
      div.style.position = 'relative';

      const info = document.createElement('div');
      info.style.display = 'flex';
      info.style.flexDirection = 'column';
      info.style.justifyContent = 'center';

      const date = document.createElement('span');
      date.textContent = item.date;
      date.style.fontSize = '12px';
      date.style.color = '#000';
      date.style.position = 'absolute';
      date.style.bottom = '30px';
      date.style.left = '30px';

      info.appendChild(date);

      div.appendChild(info);

      content.appendChild(div);
   });

   loadedCount += loadCount;
}

// 4. 초기 10개 로드
loadItems();

// 5. 무한 스크롤 이벤트
window.addEventListener('scroll', () => {
   if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      if (loadedCount < itemsData.length) {
         loadItems();
      }
   }
});
