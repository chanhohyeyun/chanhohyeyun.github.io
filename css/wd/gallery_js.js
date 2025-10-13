// 갤러리 이미지 슬라이더
(function() {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('imageModal');
    const sliderWrapper = document.getElementById('sliderWrapper');
    const closeBtn = document.getElementById('closeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const counter = document.getElementById('counter');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    let currentIndex = 0;
    let images = [];
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // 이미지 배열 생성
    thumbnails.forEach(thumb => {
        images.push(thumb.src);
    });

    // 슬라이더 초기화
    function initSlider() {
        sliderWrapper.innerHTML = '';
        images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${src}" alt="Image ${index + 1}">`;
            sliderWrapper.appendChild(slide);
        });
    }

    // 모달 열기
    function openModal(index) {
        currentIndex = index;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSlider();
    }

    // 모달 닫기
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 슬라이더 업데이트
    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    // 이전 이미지
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlider();
    }

    // 다음 이미지
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlider();
    }

    // 터치/마우스 이벤트 (스와이프)
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        
        // 멀티터치 차단
        if (e.touches && e.touches.length > 1) {
            isDragging = false;
            return;
        }
    }

    function handleMove(e) {
        if (!isDragging) return;
        
        // 멀티터치 차단
        if (e.touches && e.touches.length > 1) {
            isDragging = false;
            return;
        }
        
        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }

    function handleEnd() {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        
        isDragging = false;
    }

    // 이벤트 리스너 등록
    function attachEventListeners() {
        // 썸네일 클릭
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                openModal(parseInt(thumb.dataset.index));
            });
        });

        // 닫기 버튼
        closeBtn.addEventListener('click', closeModal);
        
        // 이전/다음 버튼
        prevBtn.addEventListener('click', prevImage);
        nextBtn.addEventListener('click', nextImage);

        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });

        // 배경 클릭시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 터치 이벤트
        sliderWrapper.addEventListener('touchstart', handleStart, { passive: true });
        sliderWrapper.addEventListener('touchmove', handleMove, { passive: true });
        sliderWrapper.addEventListener('touchend', handleEnd, { passive: true });

        // 마우스 이벤트
        sliderWrapper.addEventListener('mousedown', handleStart);
        sliderWrapper.addEventListener('mousemove', handleMove);
        sliderWrapper.addEventListener('mouseup', handleEnd);
        sliderWrapper.addEventListener('mouseleave', handleEnd);

        // 멀티터치 완전 차단
        sliderWrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // iOS 제스처 차단
        ['gesturestart', 'gesturechange', 'gestureend'].forEach(evt => {
            sliderWrapper.addEventListener(evt, (e) => e.preventDefault(), { passive: false });
        });
    }

    // 초기화
    function init() {
        if (!gallery || !modal) {
            console.error('갤러리 요소를 찾을 수 없습니다.');
            return;
        }
        
        initSlider();
        attachEventListeners();
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();