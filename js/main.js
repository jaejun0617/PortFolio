'use strict';

// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
// 즉, 모든 스크립트 코드는 페이지가 준비된 후에 실행됩니다.
document.addEventListener('DOMContentLoaded', async () => {
   // --- 데이터 초기화 ---
   // 프로젝트 섹션에서 사용할 데이터를 담을 배열을 초기화합니다.
   let slideData = [];
   try {
      // fetch API를 사용하여 비동기적으로 projects.json 파일의 내용을 가져옵니다.
      const response = await fetch('./data/projects.json');
      // 응답이 성공적이지 않으면(예: 404 Not Found), 에러를 발생시킵니다.
      if (!response.ok)
         throw new Error('프로젝트 데이터를 불러오는 데 실패했습니다.');
      // 응답 본문을 JSON 형태로 파싱하여 slideData 배열에 저장합니다.
      slideData = await response.json();
   } catch (error) {
      // 데이터 로딩 중 에러가 발생하면 콘솔에 에러를 출력합니다.
      console.error(error);
      const projectsSection = document.getElementById('projects');
      // 만약 에러 발생 시 사용자에게 프로젝트를 불러올 수 없다는 메시지를 화면에 표시합니다.
      if (projectsSection)
         projectsSection.innerHTML =
            '<p style="text-align: center;">프로젝트를 불러올 수 없습니다.</p>';
      return; // 데이터 로딩에 실패했으므로 스크립트 실행을 중단합니다.
   }

   // --- 스크롤 컨테이너 및 위치 복원 ---
   // 페이지 전체의 스크롤을 담당하는 .page-wrapper 요소를 변수에 할당합니다.
   const scrollContainer = document.querySelector('.page-wrapper');

   // 페이지를 떠나기 직전에 현재 스크롤 위치를 localStorage에 저장합니다.
   // 이를 통해 사용자가 페이지를 새로고침해도 보던 위치를 기억할 수 있습니다.
   window.addEventListener('beforeunload', () => {
      localStorage.setItem('scrollPos', scrollContainer.scrollTop);
   });
   // localStorage에서 저장된 스크롤 위치를 가져옵니다.
   const scrollPos = localStorage.getItem('scrollPos');
   // 저장된 위치가 있다면, 해당 위치로 스크롤을 이동시킵니다.
   if (scrollPos) {
      scrollContainer.scrollTo(0, parseInt(scrollPos));
   }

   // =================================================================
   // ✅ 컨트롤 타워: 모든 기능 실행
   // 페이지에 필요한 모든 기능들을 여기서 순차적으로 호출하여 실행시킵니다.
   // =================================================================
   playIntroAnimation(); // 인트로 스플래시 스크린 애니메이션 실행
   setupSmoothScroll(); // 부드러운 스크롤 기능 설정
   setupScrollProgressBar(); // 스크롤 진행 상태 바 기능 설정
   setupScrollSpyAndAnimations(); // 스크롤에 따른 네비게이션 활성화 및 애니메이션 기능 설정
   setupThemeSwitcher(); // 다크/라이트 모드 테마 전환 기능 설정
   setupInfiniteScroll(); // Hero 섹션의 무한 슬라이드(마키) 기능 설정
   setupQuoteSlider(); // About 섹션의 명언 슬라이더 기능 설정
   setupResponsiveMarquee(); // 반응형 마키(Marquee) 기능 설정
   setupSkillsTypingAnimation(); // Skills 섹션의 타이핑 애니메이션 기능 설정
   setupProjectsScrollAnimation(); // Projects 섹션의 스크롤 애니메이션 기능 설정
   setupSectionAnimations(); // 각 섹션별 공통 등장 애니메이션 설정
   setupHeroTypingAnimation(); // Hero(메인) 섹션의 타이핑 애니메이션 실행

   // 외부 스크롤 애니메이션 라이브러리(AOS) 초기화
   AOS.init({});

   // =================================================================
   // ✅ 함수 정의: 각 기능의 상세 구현
   // 위에서 호출한 함수들이 실제로 어떻게 동작하는지 정의하는 부분입니다.
   // =================================================================

   /**
    * 📄 [메인] Hero 섹션 타이핑 애니메이션 설정
    * 메인 화면의 제목과 부제를 타이핑 효과로 나타내고, 부제의 키워드를 주기적으로 변경합니다.
    */
   function setupHeroTypingAnimation() {
      const titleElement = document.querySelector('.hero-title');
      const subtitleKeywordElement = document.querySelector(
         '.hero-subtitle .keyword',
      );
      const keywordContainer = document.querySelector('.keyword-container');

      if (!titleElement || !subtitleKeywordElement || !keywordContainer) return;
      const titleString = `A BLANK PAGE,<br>FILLED WITH POTENTIAL.`;

      const keywords = [
         '동료와 함께 해결하는',
         '함께 성공을 만드는',
         '긍정적인 에너지를 더하는',
         '투명하게 공유하는',
      ];
      let keywordIndex = 0;

      // 타이핑 효과를 구현하는 함수
      function typewriter(element, htmlString, speed = 100) {
         return new Promise((resolve) => {
            element.innerHTML = '';
            let i = 0;
            element.classList.add('typing-cursor');
            function type() {
               if (i < htmlString.length) {
                  // HTML 태그('<br>')를 인식하여 한 번에 처리
                  if (htmlString.charAt(i) === '<') {
                     const tagEndIndex = htmlString.indexOf('>', i);
                     element.innerHTML += htmlString.substring(
                        i,
                        tagEndIndex + 1,
                     );
                     i = tagEndIndex;
                  } else {
                     element.innerHTML += htmlString.charAt(i);
                  }
                  i++;
                  setTimeout(type, speed);
               } else {
                  element.classList.remove('typing-cursor');
                  resolve(); // 타이핑이 끝나면 Promise를 해결
               }
            }
            type();
         });
      }

      // 키워드를 변경하는 함수
      function changeKeyword() {
         subtitleKeywordElement.classList.remove('fading-in');
         subtitleKeywordElement.classList.add('fading-out');

         setTimeout(() => {
            keywordIndex = (keywordIndex + 1) % keywords.length; // 다음 키워드로 순환
            subtitleKeywordElement.textContent = keywords[keywordIndex];
            subtitleKeywordElement.classList.remove('fading-out');

            setTimeout(() => {
               subtitleKeywordElement.classList.add('fading-in');
            }, 50);
         }, 600);
      }

      // 전체 애니메이션 시퀀스를 실행하는 함수
      async function runSequence() {
         await typewriter(titleElement, titleString, 100); // 제목 타이핑
         subtitleKeywordElement.textContent = keywords[keywordIndex];

         setTimeout(() => {
            subtitleKeywordElement.classList.add('fading-in'); // 부제 키워드 등장
            keywordContainer.classList.add('is-active'); // 키워드 테두리 애니메이션
         }, 500);

         // 3초마다 키워드를 변경
         const keywordInterval = setInterval(changeKeyword, 3000);
         return keywordInterval;
      }

      let currentIntervalId = null;

      async function startAndRepeat() {
         if (currentIntervalId) clearInterval(currentIntervalId);
         currentIntervalId = await runSequence();
      }

      // 인트로 애니메이션이 재생되었는지 여부에 따라 타이핑 시작 시간을 조절
      if (sessionStorage.getItem('introPlayed')) {
         setTimeout(startAndRepeat, 1000); // 인트로 생략 시 1초 후 시작
      } else {
         setTimeout(startAndRepeat, 2500); // 인트로 재생 시 2.5초 후 시작
      }
   }

   /**
    * 📄 [어바웃, 스킬, 컨택트] 섹션 공통 등장 애니메이션 설정
    * IntersectionObserver를 사용하여 특정 요소들이 화면에 나타날 때 'in-view' 클래스를 추가하여
    * CSS 애니메이션을 트리거합니다. About, Skills, Contact 섹션의 주요 컴포넌트에 적용됩니다.
    */
   function setupSectionAnimations() {
      // 1. 애니메이션을 적용할 모든 '대상' 요소들을 찾아.
      const elementsToAnimate = document.querySelectorAll(
         '.section-title, .about-profile-card, .journey-item, .code-editor, .skills-icons-container, .contact-container',
      );

      if (elementsToAnimate.length === 0) return;

      // 2. IntersectionObserver를 설정해.
      const animationObserver = new IntersectionObserver(
         (entries, observer) => {
            entries.forEach((entry) => {
               // 화면에 보이면, 'in-view' 클래스를 추가해서 애니메이션 실행
               if (entry.isIntersecting) {
                  entry.target.classList.add('in-view');
               } else {
                  // 화면에서 사라지면, 'in-view' 클래스를 제거해서 초기 상태로 복귀
                  // (한 번만 실행하고 싶으면 이 else 부분을 지우고, 아래 unobserve 주석을 풀어)
                  entry.target.classList.remove('in-view');
               }
            });
         },
         {
            root: scrollContainer, // 스크롤 기준을 page-wrapper로 설정
            threshold: 0.4, // 요소가 40% 보였을 때 콜백 실행
         },
      );

      // 3. 찾은 모든 대상 요소에 대해 관찰을 시작해.
      elementsToAnimate.forEach((element) => {
         animationObserver.observe(element);
      });
   }

   /**
    * 📄 [메인] 인트로 스플래시 스크린 애니메이션 재생
    * 사이트 첫 방문 시에만 재생되는 인트로 애니메이션을 처리합니다.
    * sessionStorage를 통해 방문 기록을 확인하고, 애니메이션을 한 번만 보여줍니다.
    */
   function playIntroAnimation() {
      if (sessionStorage.getItem('introPlayed')) {
         const splashScreen = document.querySelector('.splash-screen');
         const pageWrapper = document.querySelector('.page-wrapper');
         const mainHeader = document.querySelector('.main-header');
         if (splashScreen) splashScreen.style.display = 'none';
         if (pageWrapper) pageWrapper.classList.add('visible');
         if (mainHeader) mainHeader.classList.add('visible');
         document.body.style.overflow = 'auto';
         return;
      }
      const splashScreen = document.querySelector('.splash-screen');
      const pageWrapper = document.querySelector('.page-wrapper');
      const mainHeader = document.querySelector('.main-header');
      const dots = document.querySelectorAll('.dot');
      const lineCanvas = document.querySelector('.line-canvas');
      const splashText = document.querySelector('.splash-text');
      if (!splashScreen) return;
      sessionStorage.setItem('introPlayed', 'true');
      const pattern = [0, 1, 2, 4, 6, 7, 8];
      let currentDot = 0;
      function drawLine(from, to) {
         const line = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'line',
         );
         line.setAttribute('class', 'pattern-line');
         const fromRect = from.getBoundingClientRect();
         const toRect = to.getBoundingClientRect();
         const containerRect = lineCanvas.parentElement.getBoundingClientRect();
         line.setAttribute(
            'x1',
            fromRect.left - containerRect.left + fromRect.width / 2,
         );
         line.setAttribute(
            'y1',
            fromRect.top - containerRect.top + fromRect.height / 2,
         );
         line.setAttribute(
            'x2',
            toRect.left - containerRect.left + toRect.width / 2,
         );
         line.setAttribute(
            'y2',
            toRect.top - containerRect.top + toRect.height / 2,
         );
         lineCanvas.appendChild(line);
      }
      const interval = setInterval(() => {
         if (currentDot < pattern.length) {
            const dotIndex = pattern[currentDot];
            if (dots[dotIndex]) dots[dotIndex].classList.add('active');
            if (currentDot > 0) {
               const fromDot = dots[pattern[currentDot - 1]];
               const toDot = dots[pattern[currentDot]];
               drawLine(fromDot, toDot);
            }
            currentDot++;
         } else {
            clearInterval(interval);
            setTimeout(() => {
               splashText.textContent = 'WELCOME JAEJUN WORLD';
               splashText.classList.add('visible');
            }, 300);
            setTimeout(() => {
               splashScreen.classList.add('hidden');
               pageWrapper.classList.add('visible');
               if (mainHeader) mainHeader.classList.add('visible');
               document.body.style.overflow = 'auto';
            }, 1500);
         }
      }, 200);
   }

   /**
    * ⚙️ [공통] 부드러운 스크롤 기능 설정
    * 네비게이션 링크 클릭 시 해당 섹션으로 부드럽게 스크롤 이동시킵니다.
    */
   function setupSmoothScroll() {
      const scrollLinks = document.querySelectorAll('.side-nav a, .main-nav a');
      scrollLinks.forEach((link) => {
         link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
               const targetSection = document.querySelector(targetId);
               if (targetSection) {
                  targetSection.scrollIntoView({
                     behavior: 'smooth',
                     block: 'start',
                  });
               }
            }
         });
      });
   }

   /**
    * ⚙️ [공통] 스크롤 진행 상태 바 설정
    * 페이지 상단의 진행 바(progress bar)가 스크롤 위치에 따라 너비가 변경되도록 설정합니다.
    */
   function setupScrollProgressBar() {
      const progressBar = document.querySelector('.progress-bar');
      if (!progressBar) return;
      function updateProgressBar() {
         const scrollableHeight =
            scrollContainer.scrollHeight - scrollContainer.clientHeight;
         const scrollTop = scrollContainer.scrollTop;
         const scrollProgress =
            scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
         progressBar.style.width = `${scrollProgress}%`;
      }
      scrollContainer.addEventListener('scroll', updateProgressBar, {
         passive: true,
      });
   }

   /**
    * ⚙️ [공통] 스크롤 스파이 및 애니메이션 설정
    * 스크롤 위치에 따라 현재 보이는 섹션을 감지하고, 사이드 네비게이션의 해당 항목을 'active' 상태로 만듭니다.
    * 또한, 현재 섹션에 맞는 색상으로 진행 바의 색상을 변경합니다.
    */
   function setupScrollSpyAndAnimations() {
      const sections = document.querySelectorAll('.section');
      const navLinks = document.querySelectorAll('.side-nav .nav-link');
      const progressBar = document.querySelector('.progress-bar');
      if (sections.length === 0) return;
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               const targetId = entry.target.id;
               const activeLink = document.querySelector(
                  `.side-nav a[href="#${targetId}"]`,
               );
               if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
               } else {
                  entry.target.classList.remove('is-visible');
               }
               if (entry.intersectionRatio >= 0.6) {
                  if (targetId === 'projects') return;
                  navLinks.forEach((link) => link.classList.remove('active'));
                  if (activeLink) activeLink.classList.add('active');
                  const newColor = entry.target.dataset.progressColor;
                  if (progressBar && newColor)
                     progressBar.style.backgroundColor = newColor;
               }
            });
         },
         { root: scrollContainer, threshold: [0.1, 0.6] },
      );
      sections.forEach((section) => {
         observer.observe(section);
      });
   }

   /**
    * ⚙️ [공통] 테마 전환(다크/라이트 모드) 기능 설정
    * 테마 토글 스위치를 클릭하면 body에 'dark-theme' 클래스를 추가/제거하고,
    * 사용자의 선택을 localStorage에 저장하여 다음 방문 시에도 유지되도록 합니다.
    */
   function setupThemeSwitcher() {
      const themeToggle = document.getElementById('theme-toggle');
      if (!themeToggle) return;

      const currentTheme = localStorage.getItem('theme');

      // ❓ 무엇이 바뀌었나요?
      // localStorage에 저장된 테마가 없을 경우 (첫 방문 시)를 처리하는 else 구문이 추가되었습니다.
      if (currentTheme) {
         // 이 부분은 기존과 동일합니다: 저장된 테마가 있으면 그대로 적용합니다.
         document.body.classList.add(currentTheme);
         if (currentTheme === 'dark-theme') {
            themeToggle.checked = true;
         }
      } else {
         // ✅ 핵심 수정: 첫 방문 시 기본으로 다크 모드를 적용합니다.
         document.body.classList.add('dark-theme'); // 1. body에 'dark-theme' 클래스 추가
         themeToggle.checked = true; // 2. 토글 스위치를 체크 상태로 변경
         localStorage.setItem('theme', 'dark-theme'); // 3. 다음 방문을 위해 'dark-theme'을 기본값으로 저장
      }

      // 이 부분은 기존과 동일합니다: 사용자가 토글을 누를 때마다 테마를 변경하고 저장합니다.
      themeToggle.addEventListener('change', () => {
         let theme = 'light-theme'; // 기본을 라이트 테마로 설정
         if (themeToggle.checked) {
            // 토글이 체크되면 다크 모드로 전환
            document.body.classList.remove('light-theme'); // 혹시 모를 라이트 테마 클래스 제거
            document.body.classList.add('dark-theme');
            theme = 'dark-theme';
         } else {
            // 토글이 체크 해제되면 라이트 모드로 전환
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme'); // 라이트 테마 클래스 추가 (선택사항이지만 명확성을 위해)
         }
         // 사용자의 선택을 localStorage에 저장합니다.
         localStorage.setItem('theme', theme);
      });
   }
   /**
    * 📄 [메인] 무한 스크롤(마키) 효과 설정
    * Hero 섹션의 배경 이미지가 끊김 없이 계속 흐르도록, 기존 콘텐츠를 복제하여 뒤에 붙여줍니다.
    */
   function setupInfiniteScroll() {
      const wrappers = document.querySelectorAll('.marquee-wrapper');
      wrappers.forEach((wrapper) => {
         const originalContent = wrapper.innerHTML;
         wrapper.innerHTML += originalContent;
      });
   }

   /**
    * 📄 [어바웃] 명언 슬라이더 설정
    * About Me 섹션의 프로필 카드 내에서 명언이 일정 시간마다 페이드 효과와 함께 변경되도록 합니다.
    */
   function setupQuoteSlider() {
      const quotes = [
         {
            text: '오늘 하나의 버그를 수정하는 것이, 내일 새로운 기능을 추가하는 것보다 낫다.',
            author: 'Software Engineering Proverb',
         },
         {
            text: '좋은 프로그래머는 사람이 이해하기 쉬운 코드를 작성한다.',
            author: "Martin Fowler, 'Refactoring' 저자",
         },
         {
            text: '단순함은 신뢰성의 전제 조건이다.',
            author: 'Edsger W. Dijkstra, 컴퓨터 과학자',
         },
         {
            text: '훌륭한 디자인은 눈에 보이지 않는다.',
            author: 'Jared Spool, UX 전문가',
         },
         {
            text: '두 번 이상 반복한다면, 자동화하라.',
            author: 'The Pragmatic Programmer (실용주의 프로그래머)',
         },
         {
            text: '진짜 문제는 기술이 아니라, 기술을 사용하여 무엇을 만들 것인가이다.',
            author: "Tim O'Reilly, 웹 2.0 창시자",
         },
      ];

      const quoteTextElement = document.querySelector('.quote-text');
      const quoteAuthorElement = document.querySelector('.quote-author');

      if (!quoteTextElement || !quoteAuthorElement) return;

      let currentIndex = 0;

      function showNextQuote() {
         quoteTextElement.classList.add('fading-out');

         setTimeout(() => {
            currentIndex = (currentIndex + 1) % quotes.length;

            quoteTextElement.innerHTML = `“ ${quotes[currentIndex].text} ”`;
            quoteAuthorElement.textContent = `- ${quotes[currentIndex].author}`;

            quoteTextElement.classList.remove('fading-out');
         }, 500);
      }

      quoteTextElement.innerHTML = `“ ${quotes[currentIndex].text} ”`;
      quoteAuthorElement.textContent = `- ${quotes[currentIndex].author}`;

      setInterval(showNextQuote, 7000);
   }

   /**
    * 📄 [메인] 반응형 마키(Marquee) 레이아웃 설정
    * 화면 너비에 따라 Hero 섹션의 마키 효과를 조정합니다.
    * 모바일에서는 두 줄의 마키를 하나로 합쳐서 보여줍니다.
    */
   function setupResponsiveMarquee() {
      const leftWrapper = document.querySelector(
         '.marquee-column:nth-child(1) .marquee-wrapper',
      );
      const rightWrapper = document.querySelector(
         '.marquee-column:nth-child(2) .marquee-wrapper',
      );

      let originalLeftItems = Array.from(leftWrapper.children);
      let originalRightItems = Array.from(rightWrapper.children);

      function rearrangeMarqueeItems() {
         const isMobile = window.innerWidth <= 768;

         if (isMobile) {
            rightWrapper.parentElement.style.display = 'none';
            leftWrapper.parentElement.style.flex = '1 0 100%';
            const mixedItems = [];
            const maxLength = Math.max(
               originalLeftItems.length,
               originalRightItems.length,
            );
            for (let i = 0; i < maxLength; i++) {
               if (originalLeftItems[i]) mixedItems.push(originalLeftItems[i]);
               if (originalRightItems[i])
                  mixedItems.push(originalRightItems[i]);
            }
            leftWrapper.innerHTML = '';
            mixedItems.forEach((item) => leftWrapper.appendChild(item));
            leftWrapper.innerHTML += leftWrapper.innerHTML;
         } else {
            rightWrapper.parentElement.style.display = 'flex';
            leftWrapper.parentElement.style.flex = '1';
            leftWrapper.innerHTML = '';
            originalLeftItems.forEach((item) => leftWrapper.appendChild(item));
            leftWrapper.innerHTML += leftWrapper.innerHTML;
            rightWrapper.innerHTML = '';
            originalRightItems.forEach((item) =>
               rightWrapper.appendChild(item),
            );
            rightWrapper.innerHTML += rightWrapper.innerHTML;
         }
      }
      rearrangeMarqueeItems();
      window.addEventListener('resize', rearrangeMarqueeItems);
   }

   /**
    * 📄 [스킬] 타이핑 애니메이션 설정
    * Skills 섹션이 화면에 나타났을 때, 코드 에디터 내부에 타이핑 효과로 스킬 내용을 표시합니다.
    * IntersectionObserver를 사용하여 섹션이 보일 때 한 번만 실행되도록 합니다.
    */
   function setupSkillsTypingAnimation() {
      const skillsSection = document.querySelector('#skills');
      if (!skillsSection) return;
      const codeToType = `const mySkills = {<br>  frontend: ['HTML', 'CSS', 'TailWindCSS' , 'JQuery' ,'JavaScript', 'React'],<br>  styling: ['Responsive Web', 'Flexbox', 'Grid', 'Animations'],<br>  tools: ['Oracle','Git', 'GitHub', 'Figma', 'VS Code']<br>};`;
      function createTypingEffect(element, htmlString, speed = 50) {
         let i = 0;
         element.innerHTML = '';
         const typing = setInterval(() => {
            if (i < htmlString.length) {
               if (htmlString.substring(i, i + 4) === '<br>') {
                  element.innerHTML += '<br>';
                  i += 4;
               } else {
                  element.innerHTML += htmlString.charAt(i);
                  i++;
               }
            } else {
               clearInterval(typing);
            }
         }, speed);
      }
      const skillsObserver = new IntersectionObserver(
         (entries, observer) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  const codeOutput = document.getElementById('code-output');
                  if (codeOutput) {
                     createTypingEffect(codeOutput, codeToType);
                  }
                  observer.unobserve(entry.target);
               }
            });
         },
         {
            root: scrollContainer,
            threshold: 0.6,
         },
      );
      skillsObserver.observe(skillsSection);
   }

   /**
    * 📄 [프로젝트] 스크롤 기반 애니메이션 설정
    * Projects 섹션에서 스크롤에 따라 오른쪽 패널의 프로젝트 이미지가 슬라이드되고,
    * 왼쪽 패널의 프로젝트 설명이 동기화되어 변경되는 스티키 스크롤 애니메이션을 구현합니다.
    * 활성화된 프로젝트 클릭 시 상세 정보를 담은 모달창을 띄웁니다.
    */
   function setupProjectsScrollAnimation() {
      const magicContainer = document.querySelector('.scroll-magic-container');
      const slides = document.querySelectorAll('#projects .slide');
      const leftTitle = document.getElementById('left-title');
      const leftText = document.getElementById('left-text');
      const leftContent = document.querySelector(
         '#projects .left-panel .content',
      );
      const progressBar = document.querySelector('.progress-bar');
      const projectsSection = document.querySelector('#projects');
      const projectProgressColor = projectsSection.dataset.progressColor;
      const navLinks = document.querySelectorAll('.side-nav .nav-link');
      const projectsNavLink = document.querySelector(
         '.side-nav a[href="#projects"]',
      );
      const projectModal = document.getElementById('projectDetailModal');
      const modalContent = projectModal.querySelector('.modal-content');

      if (!magicContainer || slides.length === 0) return;

      leftTitle.textContent = slideData[0].title;
      leftText.innerHTML = `<h3>${slideData[0].headline}</h3><p class="overview">${slideData[0].overview}</p>`;

      function openProjectModal(projectData) {
         const featuresHtml = projectData.features
            .map(
               (feature) =>
                  `<div class="feature-item"><h4>${feature.name}</h4><p class="tech-stack"><strong>Skills:</strong> ${feature.tech.join(', ')}</p><p class="feature-desc">${feature.desc}</p></div>`,
            )
            .join('');
         modalContent.innerHTML = `
            <button class="modal-close-btn">&times;</button>
            <h2>${projectData.title}</h2>
            <p class="overview">${projectData.overview}</p>
            <hr>
            ${featuresHtml}
            <div class="modal-links">
               <a href="${projectData.links.github}" target="_blank" rel="noopener noreferrer" class="link-github">GitHub</a>
               <a href="${projectData.links.site}" target="_blank" rel="noopener noreferrer" class="link-site">Visit Site</a>
            </div>
         `;
         projectModal.classList.add('visible');
         modalContent
            .querySelector('.modal-close-btn')
            .addEventListener('click', closeProjectModal);
      }

      function closeProjectModal() {
         projectModal.classList.remove('visible');
      }

      projectModal.addEventListener('click', (event) => {
         if (event.target === projectModal) {
            closeProjectModal();
         }
      });

      function handleScrollAnimation() {
         if (!magicContainer || !leftTitle || !leftText) return;
         const containerRect = magicContainer.getBoundingClientRect();
         const viewportHeight = window.innerHeight;
         const isAnimating =
            containerRect.top <= 0 && containerRect.bottom >= viewportHeight;
         if (isAnimating) {
            if (progressBar && projectProgressColor) {
               progressBar.style.backgroundColor = projectProgressColor;
            }
            navLinks.forEach((link) => link.classList.remove('active'));
            if (projectsNavLink) projectsNavLink.classList.add('active');
            const scrollableDistance = containerRect.height - viewportHeight;
            const scrollProgress = Math.max(
               0,
               Math.min(1, -containerRect.top / scrollableDistance),
            );
            let activeIndex = Math.floor(scrollProgress * slides.length);
            if (activeIndex >= slides.length) {
               activeIndex = slides.length - 1;
            }
            if (
               slideData[activeIndex] &&
               leftTitle.textContent !== slideData[activeIndex].title
            ) {
               leftContent.style.opacity = 0;
               setTimeout(() => {
                  leftTitle.textContent = slideData[activeIndex].title;
                  leftText.innerHTML = `<h3>${slideData[activeIndex].headline}</h3><p class="overview">${slideData[activeIndex].overview}</p>`;
                  leftContent.style.opacity = 1;
               }, 300);
            }
            slides.forEach((slide, index) => {
               slide.classList.remove('is-active', 'is-previous');
               if (index === activeIndex) {
                  slide.classList.add('is-active');
                  slide.style.transform = 'translateY(0) scale(1)';
                  slide.style.opacity = 1;
               } else if (index < activeIndex) {
                  slide.classList.add('is-previous');
                  const distance = activeIndex - index;
                  const offset = distance * 40;
                  const scale = 1 - distance * 0.05;
                  slide.style.transform = `translateY(-${offset}px) scale(${scale})`;
                  const opacity = 0.2 + index * 0.2;
                  slide.style.opacity = opacity;
               } else {
                  slide.style.transform = 'translateY(100vh) scale(0.9)';
                  slide.style.opacity = 0;
               }
            });
         }
      }
      scrollContainer.addEventListener('scroll', handleScrollAnimation);

      const rightPanel = document.querySelector('#projects .right-panel');
      rightPanel.addEventListener('click', (event) => {
         const clickedSlide = event.target.closest('.slide');
         if (clickedSlide && clickedSlide.classList.contains('is-active')) {
            const activeIndex = Array.from(slides).indexOf(clickedSlide);
            if (slideData[activeIndex]) {
               openProjectModal(slideData[activeIndex]);
            }
         }
      });
   }
});
