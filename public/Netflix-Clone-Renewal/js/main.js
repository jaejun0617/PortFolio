// =================================================================
// ----- 1. GSAP & 배너 스크롤 기능 -----
// =================================================================

// 1-1. GSAP의 'ScrollToPlugin'을 사용하기 위해 플러그인을 등록합니다.
gsap.registerPlugin(ScrollToPlugin);

// =================================================================
// ----- 2. 공용 렌더링 함수 및 데이터 로딩 -----
// =================================================================

/**
 * 2-1. [만능 렌더링 함수]
 *      데이터를 화면에 그려주는 재사용 가능한 '기계'입니다.
 */
function renderItems(items, containerSelector, itemTemplate) {
   const container = document.querySelector(containerSelector);
   if (!container) {
      console.error(`Error: Container "${containerSelector}" not found.`);
      return;
   }
   const html = items.map(itemTemplate).join('');
   container.innerHTML = html;
}

// 2-2. 웹 페이지 로딩이 끝나면 모든 기능을 초기화합니다.
document.addEventListener('DOMContentLoaded', async () => {
   try {
      // 2-3. 모든 데이터를 서버에서 단 한 번만 가져옵니다.
      const response = await fetch('./assets/data/netData.json');
      if (!response.ok) throw new Error('데이터 불러오기 실패');
      const data = await response.json();

      // 2-4. [명작 영화 섹션 렌더링]
      renderItems(data.classicMovies, '.classic_movies', movie => {
         return `
            <div class="classic_movie">
               <img src="${movie.image}" alt="${movie.category}">
               <div class="classic_movie_title">
                  <h4>${movie.category}</h4>
                  <p>${movie.plot}</p>
               </div>
            </div>`;
      });

      // 2-5. [게임 슬라이더 기능 활성화]
      const gameContainer = document.querySelector('.game_container');
      const nextBtn = gameContainer.querySelector('.slide_right_btn');
      const prevBtn = gameContainer.querySelector('.slide_left_btn');
      setupGameSlider(data.gameData, nextBtn, prevBtn);

      // 2-6. [카테고리 탭 메뉴 기능 활성화]
      setupCategoryTabs(data.categoryTopTen);
   } catch (error) {
      console.error(error);
   }
});

// =================================================================
// ----- 3. 게임 무한 슬라이더 기능 -----
// =================================================================

function setupGameSlider(gameData, nextBtn, prevBtn) {
   // 3-1. 슬라이더에 필요한 HTML 요소와 상태 변수들을 선언합니다.
   const viewport = document.querySelector('.game_content');
   const gallery = document.querySelector('.game_gallery');

   if (!viewport || !gallery || !nextBtn || !prevBtn) return;

   let currentPage = 1;
   let isAnimating = false;
   const itemsPerPage = 10;
   const totalOriginalPages = Math.ceil(gameData.length / itemsPerPage);

   // 3-2. 무한 루프를 위한 데이터 복제
   const firstClones = gameData.slice(0, itemsPerPage);
   const lastClones = gameData.slice(gameData.length - itemsPerPage);
   const infiniteData = [...lastClones, ...gameData, ...firstClones];

   // 3-3. 복제된 데이터로 슬라이더 '필름'을 렌더링합니다.
   renderItems(infiniteData, '.game_gallery', game => {
      return `
           <div class="game_card">
               <div class="game_card_image_wrapper">
                   <img src="${game.image}" alt="${game.title}">
               </div>
               <span>${game.title}</span>
           </div>`;
   });

   // 3-4. 슬라이더 이동 '엔진' 함수
   function slide(withAnimation = true) {
      gallery.style.transition = withAnimation ? 'transform 0.6s ease-in-out' : 'none';
      const viewportWidth = viewport.offsetWidth;
      const slideDistance = currentPage * viewportWidth;
      gallery.style.transform = `translateX(-${slideDistance}px)`;
   }

   // 3-5. 애니메이션이 끝난 후 '순간이동' 처리
   gallery.addEventListener('transitionend', () => {
      isAnimating = false;
      if (currentPage >= totalOriginalPages + 1) {
         currentPage = 1;
         slide(false);
      }
      if (currentPage <= 0) {
         currentPage = totalOriginalPages;
         slide(false);
      }
   });

   // 3-6. 버튼 클릭 이벤트
   nextBtn.addEventListener('click', () => {
      if (isAnimating) return;
      isAnimating = true;
      currentPage++;
      slide();
   });

   prevBtn.addEventListener('click', () => {
      if (isAnimating) return;
      isAnimating = true;
      currentPage--;
      slide();
   });

   // 3-7. 최초 실행 및 반응형 처리
   const initialViewportWidth = viewport.offsetWidth;
   gallery.style.transform = `translateX(-${initialViewportWidth}px)`;
   window.addEventListener('resize', () => slide(false));
}

// =================================================================
// ----- 4. 카테고리 탭 메뉴 및 더보기/닫기 기능 -----
// =================================================================

function setupCategoryTabs(allCategoryData) {
   // 4-1. 필요한 HTML 요소를 모두 찾습니다.
   const menuContainer = document.querySelector('.category_menu ul');
   const gallery = document.querySelector('.category_gallery');
   const showMoreBtn = document.querySelector('.show_more_btn');
   // [추가] 스크롤의 기준점이 될 부모 섹션을 찾습니다.
   const categoryContainer = document.querySelector('.category_container');

   // 4-2. '전체' 보기를 위한 모든 데이터를 하나의 배열로 합칩니다.
   const allContentData = Object.values(allCategoryData).flat();

   // 4-3. 탭 내용을 화면에 표시하는 핵심 함수
   function displayCategoryContent(categoryKey) {
      let dataToRender;
      if (categoryKey === 'all') {
         dataToRender = allContentData;
         showMoreBtn.style.display = 'block';
         gallery.classList.remove('expanded');
         showMoreBtn.textContent = '더보기';
      } else {
         dataToRender = allCategoryData[categoryKey];
         showMoreBtn.style.display = 'none';
         gallery.classList.add('expanded');
      }

      if (!dataToRender) {
         gallery.innerHTML = '';
         return;
      }

      renderItems(dataToRender, '.category_gallery', item => {
         return `
            <div class="rank_card">
               <img src="${item.image}" alt="${item.title}">
            </div>
         `;
      });
   }

   // 4-4. 메뉴 클릭 이벤트 처리
   menuContainer.addEventListener('click', event => {
      const clickedLink = event.target.closest('a');
      if (!clickedLink) return;
      event.preventDefault();
      menuContainer.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      clickedLink.classList.add('active');
      const categoryKey = clickedLink.dataset.category;
      displayCategoryContent(categoryKey);
   });

   // 4-5. '더보기/닫기' 버튼 클릭 이벤트 처리 (스크롤 기능 추가됨)
   showMoreBtn.addEventListener('click', () => {
      gallery.classList.toggle('expanded');
      const isExpanded = gallery.classList.contains('expanded');
      showMoreBtn.textContent = isExpanded ? '닫기' : '더보기';

      // [핵심 수정] 만약 '닫기'를 눌러서 갤러리가 접힌 상태라면,
      if (!isExpanded) {
         // GSAP을 이용해 category_container의 상단으로 부드럽게 스크롤합니다.
         gsap.to(window, {
            duration: 0.7, // 애니메이션 지속 시간 (CSS transition 시간과 비슷하게)
            scrollTo: categoryContainer, // 목표 지점
            ease: 'power2.inOut',
         });
      }
   });

   // 4-6. 최초 실행
   displayCategoryContent('all');
}

const mobileBtn = document.querySelector('.hamburger_btn');
const headerMenu = document.querySelector('nav ul');

mobileBtn.addEventListener('click', () => {
   // 메뉴(ul)와 버튼 자신에게 active 클래스를 토글(toggle)
   headerMenu.classList.toggle('active');
   mobileBtn.classList.toggle('active');

   // [추가] 접근성을 위한 aria-label 변경
   const isOpened = mobileBtn.classList.contains('active');
   if (isOpened) {
      mobileBtn.setAttribute('aria-label', '메뉴 닫기');
   } else {
      mobileBtn.setAttribute('aria-label', '메뉴 열기');
   }
});
