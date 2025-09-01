// 햄버거 토글
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.drops_menu');

// 슬라이더
const slides = document.querySelectorAll('.slide');
const track = document.querySelector('.slider_track');
const dotsContainer = document.querySelector('.dots');
const pauseBtn = document.querySelector('#pauseBtn');

// 아코디언
const headers = document.querySelectorAll('.accordion_header');

hamburger.addEventListener('click', () => {
   menu.classList.toggle('active');
});

// 슬라이드 너비 계산 함수 (반응형 대응)
function getSlideWidth() {
   return slides[0].offsetWidth + 20; // 슬라이드 너비 + 간격
}

// 1. 슬라이드 복제 (앞뒤 모두 복제)
const lastClone = slides[slides.length - 1].cloneNode(true);
lastClone.classList.add('clone');
track.insertBefore(lastClone, track.firstChild);

const firstClone = slides[0].cloneNode(true);
firstClone.classList.add('clone');
track.appendChild(firstClone);

const totalSlides = slides.length + 2; // 복제 포함

let currentIndex = 1; // 실제 첫 슬라이드 위치 (복제 포함)
let slideInterval;
let isPaused = false;

// 인디케이터 생성
for (let i = 0; i < slides.length; i++) {
   const dot = document.createElement('span');
   dot.classList.add('dot');
   if (i === 0) dot.classList.add('active');
   dot.dataset.index = i;
   dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function updateSlide() {
   const slideWidth = getSlideWidth();

   // 실제 슬라이드 인덱스 보정
   let realIndex = currentIndex - 1;
   if (realIndex < 0) realIndex = slides.length - 1;
   if (realIndex >= slides.length) realIndex = 0;

   slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === realIndex);
   });

   dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === realIndex);
   });

   const offset = -(currentIndex * slideWidth - (window.innerWidth / 2 - slides[0].offsetWidth / 2));
   track.style.transition = 'transform 0.5s ease';
   track.style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
   const slideWidth = getSlideWidth();

   currentIndex++;

   if (currentIndex === totalSlides - 1) {
      updateSlide();

      setTimeout(() => {
         track.style.transition = 'none';
         currentIndex = 1;
         const offset = -(currentIndex * slideWidth - (window.innerWidth / 2 - slides[0].offsetWidth / 2));
         track.style.transform = `translateX(${offset}px)`;

         setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
         }, 50);
      }, 500);
   } else {
      updateSlide();
   }
}

// 도트 클릭 시 슬라이드 이동 (복제 인덱스 보정)
dots.forEach(dot => {
   dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.dataset.index) + 1;
      updateSlide();
   });
});

// 일시정지 버튼 토글
pauseBtn.addEventListener('click', () => {
   if (isPaused) {
      slideInterval = setInterval(nextSlide, 5000);
      pauseBtn.textContent = '⏸';
   } else {
      clearInterval(slideInterval);
      pauseBtn.textContent = '▶';
   }
   isPaused = !isPaused;
});

// 리사이즈 시 슬라이드 위치 재조정
window.addEventListener('resize', () => {
   updateSlide();
});

// 초기 셋업 및 자동 슬라이드 시작
updateSlide();
slideInterval = setInterval(nextSlide, 5000);

headers.forEach(header => {
   header.addEventListener('click', () => {
      const isOpen = header.classList.contains('active');
      // 닫기
      headers.forEach(h => {
         h.classList.remove('active');
         h.setAttribute('aria-expanded', 'false');
         const content = h.nextElementSibling;
         content.classList.remove('open');
         content.setAttribute('aria-hidden', 'true');
         content.style.maxHeight = null;
         content.style.padding = '0 20px';
      });

      if (!isOpen) {
         header.classList.add('active');
         header.setAttribute('aria-expanded', 'true');
         const content = header.nextElementSibling;
         content.classList.add('open');
         content.setAttribute('aria-hidden', 'false');
         content.style.maxHeight = content.scrollHeight + 'px';
         content.style.padding = '0px 20px';
      }
   });
});
