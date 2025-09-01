// 슬라이더

// 1.상대 변수들을 선언
let allGameData = [];
let currentGamePage = 0;
const gamesPerPage = 10;

// 2. 버튼 요소를 미리 찾아둔다.
// game_container 안에 있는 버튼을 정확히 찾아야한다.
const gameContainer = document.querySelector('.game_container');
const nextBtn = gameContainer.querySelector('.slide_right_btn');
const prevBtn = gameContainer.querySelector('.slide_left_btn');

document.addEventListener('DOMContentLoaded', async () => {
   try {
      const response = await fetch('../assets/data/netData.json');
      if (!response.ok) throw new Error('Game Data 불러오기 실패');

      const data = await response.json();

      // 3. fetch로 받아온 전체 데이터를 상태 변수에 저장.
      allGameData = data.gameData;

      // 4. 웹이 시작되면, 첫 페이지를 먼저 보여주기
      displayCurrentGamePage();
      updateButtons(); // 버튼 상태도 처음 한번 업데이트
   } catch (error) {
      console.error(error);
   }
});

// 5. 현재 페이지 보여주기 함수 (위에서 설계한 것)
function displayCurrentGamePage() {
   const startIndex = currentGamePage * gamesPerPage;
   const endIndex = startIndex + gamesPerPage;
   const gameToShow = allGameData.slice(startIndex, endIndex);

   renderItems(gameToShow, '.game_gallery', game => {
      // 게임 슬라이드 HTML
      return ` <div class="game_cade">
                <img src="${game.image}" alt="${game.title}"> 
                <div class="game_title">
                    <h4>${game.genre}</h4>
                    <p>${game.title}</p>
                </div>
            </div>`;
   });
}

// 6. 버튼 활성화/비활성화 상태를 업데이트하는 함수
function updateButtons() {
   // 이전 버튼
   prevBtn.disabled = currentGamePage === 0;

   // 다음 버튼
   nextBtn.totalPages = Math.ceil(allGameData.length / gamesPerPage);
   nextBtn.disabled = currentGamePage >= totalPages - 1;
}

// 7. 버튼 클릭 이벤트 리스너를 설정
nextBtn.addEventListener('click', () => {
   const totalPages = Math.ceil(allGameData.length / gamesPerPage);
   if (currentGamePage < totalPages - 1)
      // 마지막 페이지가 아니면
      currentGamePage++; // 페이지 1증가해라
   displayCurrentGamePage(); // 화면 다시 그리기
   updateButtons(); // 버튼 상태 업데이트
});

prevBtn.addEventListener('click', () => {
   if (currentGamePage > 0)
      // 첫 페이지가 아니면
      currentGamePage--; // 페이지 1 감소
   displayCurrentGamePage(); // 화면 다시 그리기
   updateButtons(); // 버튼 상태 업데이트
});

/**
 *  2. 이것이 바로 우리가 만든 범용 랜더링 함수.
 *  @param {Array} items - 랜더링할 데이터 배열
 *  @param {string} containerSelector - 데이터가 들어갈 부모 요소의 CSS 선택자
 *  @param {Function} itemTemplate - 배열의 각 항목을 HTML 문자열로 변환하는 함수.
 */

function renderItems(items, containerSelector, itemTemplate) {
   const container = document.querySelector(containerSelector);

   // 컨테이너가 없을 경우 에러를 출력하고 함수 종료.
   if (!container) {
      console.error(`Error: Container   "${containerSelector}" not found. `);
      return;
   }

   // map()을 사용해 각 데이터 항목을 HTML 문자열로 반환하고, join('')으로 합칩니다.
   const html = items.map(itemTemplate).join('');

   container.innerHTML = html;
}
