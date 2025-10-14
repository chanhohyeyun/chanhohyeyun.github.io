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
    const slideLinks = document.querySelectorAll('a.slide'); // <a> 태그 선택
    
    let currentIndex = 0;
    let images = [];
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let hasMoved = false; 
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
    // function handleStart(e) {
    //     isDragging = true;
    //     startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        
    //     // 멀티터치 차단
    //     if (e.touches && e.touches.length > 1) {
    //         isDragging = false;
    //         return;
    //     }
    // }

    // function handleMove(e) {
    //     if (!isDragging) return;
        
    //     // 멀티터치 차단
    //     if (e.touches && e.touches.length > 1) {
    //         isDragging = false;
    //         return;
    //     }
        
    //     currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    // }

    // function handleEnd() {
    //     if (!isDragging) return;
        
    //     const diff = startX - currentX;
        
    //     if (Math.abs(diff) > 50) {
    //         if (diff > 0) {
    //             nextImage();
    //         } else {
    //             prevImage();
    //         }
    //     }
        
    //     isDragging = false;
    // }

    function handleStart(e) {
    isDragging = true;
    hasMoved = false;  // 드래그 시작 시 초기화
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
    hasMoved = true;  // 실제로 이동 발생 -> 드래그임을 표시
    }
    
    function handleEnd() {
    if (!isDragging) return;

    if (!hasMoved) {
        // 클릭만 한 경우, 슬라이드 이동 안 함
        isDragging = false;
        return;
    }

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
        // <a> 태그 클릭 시 기본 동작 막고 모달 열기
        slideLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // 링크 이동 차단
                e.stopPropagation();
                const img = link.querySelector('.thumbnail');
                if (img) {
                    
                    const index = parseInt(img.dataset.index);
                    console.log('갤러리 링크 클릭:',index + '이미지');

                    openModal(index);
                }
            });
        });

        // 썸네일 직접 클릭 (혹시 모를 경우 대비)
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                openModal(parseInt(thumb.dataset.index));
                console.log('갤러리 썸네일 클릭:',parseInt(thumb.dataset.index) + '이미지');

            });
        });

    // 닫기 버튼
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();  // ✅ 여기 수정
            closeModal();
        });
    }
    
    // 이전/다음 버튼
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();  // ✅ 여기 수정
            prevImage();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();  // ✅ 여기 수정
            nextImage();
        });
    }

    // 모달 배경 클릭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // ✅ 실제 배경만 감지
            closeModal();
        }
    });
        
        // // 닫기 버튼
        // if (closeBtn) {
        //     closeBtn.addEventListener('click', closeModal);
        // }
        
        // // 이전/다음 버튼
        // if (prevBtn) {
        //     prevBtn.addEventListener('click', prevImage);
        // }
        // if (nextBtn) {
        //     nextBtn.addEventListener('click', nextImage);
        // }

        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });

        // // 배경 클릭시 닫기
        // modal.addEventListener('click', (e) => {
        //     if (e.target === modal) closeModal();
        // });

        // 터치 이벤트
        if (sliderWrapper) {
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
    }

    // 초기화
    function init() {
        if (!gallery || !modal) {
            console.error('갤러리 요소를 찾을 수 없습니다.');
            return;
        }
        
        if (images.length === 0) {
            console.error('이미지가 없습니다.');
            return;
        }
        
        initSlider();
        attachEventListeners();
        console.log('갤러리 초기화 완료:', images.length + '개 이미지');
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
