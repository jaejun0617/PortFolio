// js/main.js

document.addEventListener('DOMContentLoaded', () => {
   /**
    * =================================================================
    * 1. 인트로 애니메이션
    * =================================================================
    */
   function playIntroAnimation() {
      const splashScreen = document.querySelector('.splash-screen');
      const pageWrapper = document.querySelector('.page-wrapper');
      const mainHeader = document.querySelector('.main-header');
      const dots = document.querySelectorAll('.dot');
      const lineCanvas = document.querySelector('.line-canvas');
      const splashText = document.querySelector('.splash-text');

      if (!splashScreen) return;

      const pattern = [0, 1, 2, 4, 6, 7, 8];
      let currentDot = 0;

      function drawLine(from, to) {
         const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
         line.setAttribute('class', 'pattern-line');
         const fromRect = from.getBoundingClientRect();
         const toRect = to.getBoundingClientRect();
         const containerRect = lineCanvas.parentElement.getBoundingClientRect();
         line.setAttribute('x1', fromRect.left - containerRect.left + fromRect.width / 2);
         line.setAttribute('y1', fromRect.top - containerRect.top + fromRect.height / 2);
         line.setAttribute('x2', toRect.left - containerRect.left + toRect.width / 2);
         line.setAttribute('y2', toRect.top - containerRect.top + toRect.height / 2);
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
    * =================================================================
    * 2. 부드러운 스크롤 (헤더 및 사이드바)
    * =================================================================
    */
   function setupSmoothScroll() {
      const scrollLinks = document.querySelectorAll('.side-nav a, .main-nav a');
      scrollLinks.forEach(link => {
         link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
               const targetSection = document.querySelector(targetId);
               if (targetSection) {
                  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
               }
            }
         });
      });
   }

   /**
    * =================================================================
    * 3. 스크롤 진행 바
    * =================================================================
    */
   function setupScrollProgressBar() {
      const progressBar = document.querySelector('.progress-bar');
      if (!progressBar) return;
      function updateProgressBar() {
         const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
         const scrollTop = window.scrollY;
         const scrollProgress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
         progressBar.style.width = `${scrollProgress}%`;
      }
      window.addEventListener('scroll', updateProgressBar, { passive: true });
   }

   /**
    * =================================================================
    * 4. 스크롤 스파이 & 섹션 애니메이션
    * =================================================================
    */
   function setupScrollSpyAndAnimations() {
      const sections = document.querySelectorAll('.section');
      const navLinks = document.querySelectorAll('.side-nav .nav-link');
      const progressBar = document.querySelector('.progress-bar');
      if (sections.length === 0) return;
      const observer = new IntersectionObserver(
         entries => {
            entries.forEach(entry => {
               const targetId = entry.target.id;
               const activeLink = document.querySelector(`.side-nav a[href="#${targetId}"]`);
               if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
               } else {
                  entry.target.classList.remove('is-visible');
               }
               if (entry.intersectionRatio >= 0.4) {
                  navLinks.forEach(link => link.classList.remove('active'));
                  if (activeLink) activeLink.classList.add('active');
                  const newColor = entry.target.dataset.progressColor;
                  if (progressBar && newColor) progressBar.style.backgroundColor = newColor;
               }
            });
         },
         { threshold: [0.1, 0.6] },
      );
      sections.forEach(section => {
         observer.observe(section);
      });
   }

   /**
    * =================================================================
    * 5. 다크 모드 / 라이트 모드 테마 전환
    * =================================================================
    */
   function setupThemeSwitcher() {
      const themeToggle = document.getElementById('theme-toggle');
      if (!themeToggle) return;
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) {
         document.body.classList.add(currentTheme);
         if (currentTheme === 'dark-theme') {
            themeToggle.checked = true;
         }
      }
      themeToggle.addEventListener('change', () => {
         let theme = 'light-theme';
         if (themeToggle.checked) {
            document.body.classList.add('dark-theme');
            theme = 'dark-theme';
         } else {
            document.body.classList.remove('dark-theme');
         }
         localStorage.setItem('theme', theme);
      });
   }

   /**
    * =================================================================
    * 6. Skills 섹션: 타이핑 애니메이션
    * =================================================================
    */
   function setupSkillsTypingAnimation() {
      const skillsSection = document.querySelector('#skills');
      const codeOutput = document.getElementById('code-output');
      if (!skillsSection || !codeOutput) return;
      const codeString = `const mySkills = {\n  frontend: ['HTML', 'CSS', 'TailWindCSS' ,'JavaScript', 'React'],\n  styling: ['Responsive Web', 'Flexbox', 'Grid', 'CSS Animations'],\n  tools: ['Git', 'GitHub', 'Figma', 'VS Code']\n};`;
      let charIndex = 0;
      function typeCode() {
         if (charIndex < codeString.length) {
            codeOutput.textContent += codeString.charAt(charIndex);
            charIndex++;
            setTimeout(typeCode, 50);
         }
      }
      const skillsObserver = new IntersectionObserver(
         (entries, observer) => {
            entries.forEach(entry => {
               if (entry.isIntersecting) {
                  typeCode();
                  observer.unobserve(entry.target);
               }
            });
         },
         { threshold: 0.5 },
      );
      skillsObserver.observe(skillsSection);
   }

   /**
    * =================================================================
    * 7. Projects 섹션: 호버 & 모달 기능 (최종 완성본)
    * =================================================================
    */
   function setupProjectsSection() {
      const subProjectsContainer = document.querySelector('.sub-projects-container');
      const laptopScreenImage = document.querySelector('.laptop-screen img');
      const projectInfoContainer = document.querySelector('.main-project-info');
      const projectTitle = projectInfoContainer.querySelector('.project-title');
      const projectDescription = projectInfoContainer.querySelector('.project-description');
      const projectLiveLink = projectInfoContainer.querySelector('.project-link-live');
      const projectGithubLink = projectInfoContainer.querySelector('.project-link-github');
      const folders = document.querySelectorAll('.project-folder:not(.upcoming)');
      const modal = document.querySelector('.project-modal');
      const modalContent = document.querySelector('.modal-content');

      if (!subProjectsContainer || !laptopScreenImage || !projectInfoContainer) return;

      const originalProjectInfo = {
         title: projectTitle.textContent,
         description: projectDescription.textContent,
         liveUrl: projectLiveLink.href,
         githubUrl: projectGithubLink.href,
         imageSrc: laptopScreenImage.src,
      };

      let projectsData = [];
      let restoreTimeout;

      async function fetchProjectData() {
         try {
            const response = await fetch('./data/projects.json');
            if (!response.ok) throw new Error('Network response was not ok');
            projectsData = await response.json();
         } catch (error) {
            console.error('프로젝트 데이터 로딩 실패:', error);
         }
      }

      function openModal(projectId) {
         const project = projectsData.find(p => p.id === projectId);
         if (!project) return;
         modalContent.innerHTML = `
               <button class="modal-close-btn">&times;</button>
               <h2>${project.title}</h2>
               <p>${project.description}</p>
               <h4>Key Features</h4>
               <ul>${project.features.map(f => `<li>${f}</li>`).join('')}</ul>
               <h4>Tech Stack</h4>
               <div class="tech-stack">${project.techStack.map(t => `<span>${t}</span>`).join('')}</div>
               <div class="project-links">
                   <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">View Live</a>
                   <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>
               </div>
           `;
         modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
         modal.classList.add('visible');
         document.body.style.overflow = 'hidden';
      }

      function closeModal() {
         modal.classList.remove('visible');
         document.body.style.overflow = 'auto';
      }

      function updateLaptopDisplay(project) {
         laptopScreenImage.style.opacity = 0;
         projectInfoContainer.style.opacity = 0;
         setTimeout(() => {
            laptopScreenImage.src = project.imageSrc;
            projectTitle.textContent = project.title;
            projectDescription.textContent = project.description;
            projectLiveLink.href = project.liveUrl;
            projectGithubLink.href = project.githubUrl;
            laptopScreenImage.style.opacity = 1;
            projectInfoContainer.style.opacity = 1;
         }, 300);
      }

      subProjectsContainer.addEventListener('mouseover', event => {
         const folder = event.target.closest('.project-folder:not(.upcoming)');
         if (folder) {
            clearTimeout(restoreTimeout);
            const projectId = folder.dataset.projectId;
            const projectToDisplay = projectsData.find(p => p.id === projectId);
            if (projectToDisplay && laptopScreenImage.src.includes(projectToDisplay.mainImage) === false) {
               updateLaptopDisplay({
                  title: projectToDisplay.title,
                  description: projectToDisplay.description, // json에 description 추가 필요
                  liveUrl: projectToDisplay.liveUrl,
                  githubUrl: projectToDisplay.githubUrl,
                  imageSrc: projectToDisplay.mainImage,
               });
            }
         }
      });

      subProjectsContainer.addEventListener('mouseleave', () => {
         restoreTimeout = setTimeout(() => {
            updateLaptopDisplay(originalProjectInfo);
         }, 7000);
      });

      folders.forEach(folder => {
         const projectId = folder.dataset.projectId;
         folder.addEventListener('click', () => {
            if (projectsData.length > 0) {
               openModal(projectId);
            } else {
               fetchProjectData().then(() => openModal(projectId));
            }
         });
      });

      modal.addEventListener('click', e => {
         if (e.target === modal) closeModal();
      });
      window.addEventListener('keydown', e => {
         if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
      });

      fetchProjectData();
   }

   // --- 모든 기능 실행 (페이지의 컨트롤 타워) ---
   playIntroAnimation();
   setupSmoothScroll();
   setupScrollProgressBar();
   setupScrollSpyAndAnimations();
   setupThemeSwitcher();
   setupSkillsTypingAnimation();
   setupProjectsSection();
});
