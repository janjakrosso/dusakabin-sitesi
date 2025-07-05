/**
 * main.js - Geliştirilmiş Final Versiyon
 * - Aktif sayfa vurgulama
 * - Scroll'da header stili değişimi
 * - Mobil menüde linke tıklayınca otomatik kapanma
 * - Diğer tüm önceki fonksiyonlar
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Stili ve Aktif Sayfa Belirleme ---
    const siteHeader = document.querySelector('.site-header');
    const navLinksList = document.querySelectorAll('.nav-links > li');
    const currentPage = window.location.pathname.split('/').pop(); // Mevcut sayfa adını alır (örn: "urunler.html")

    // 1. Scroll Event'i ile Header'a 'scrolled' class'ı ekleme/kaldırma
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            // 50 pikselden fazla kaydırıldıysa 'scrolled' class'ını ekle
            siteHeader.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // 2. Aktif Sayfa Vurgulama
    navLinksList.forEach(li => {
        const link = li.querySelector('a');
        if (link && link.getAttribute('href') === currentPage) {
            li.classList.add('active-page');
        }
        // Eğer Ana Sayfa'daysak (index.html veya boş path)
        if (currentPage === 'index.html' || currentPage === '') {
            if (link && link.getAttribute('href') === 'index.html') {
                 li.classList.add('active-page');
            }
        }
    });


    // --- Hamburger Menü & Mobil Dropdown Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
 
    if (menuToggle && navLinksContainer) {
        // Menü açma/kapama butonu
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('is-open');
        });

        // YENİ: Mobil menüdeki bir linke tıklanınca menüyü kapat
        const allNavLinks = navLinksContainer.querySelectorAll('a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Sadece dropdown toggle değilse kapat (açılır menünün kendisi kapanmasın)
                if (!link.classList.contains('dropdown-toggle')) {
                    menuToggle.classList.remove('is-active');
                    navLinksContainer.classList.remove('is-open');
                }
            });
        });
    }
 
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Sadece mobil görünümde çalışmasını sağlıyoruz
            if (window.innerWidth <= 767) {
                e.preventDefault();
                
                const currentDropdown = toggle.parentElement;
                const isAlreadyOpen = currentDropdown.classList.contains('open');

                document.querySelectorAll('.nav-links .dropdown.open').forEach(openDropdown => {
                    openDropdown.classList.remove('open');
                });

                if (!isAlreadyOpen) {
                    currentDropdown.classList.add('open');
                }
            }
        });
    });

    // --- Diğer Fonksiyonlar (Aynı kalıyor) ---

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeInSections.forEach(section => observer.observe(section));
    }
    
    // Slider'lar (Tüm sayfalarda hata vermeden çalışır)
    if (document.querySelector('.featured-products .product-slider')) {
        new Swiper('.featured-products .product-slider', { loop: true, spaceBetween: 20, slidesPerView: 1, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 25 }, 992: { slidesPerView: 3, spaceBetween: 30 } }, pagination: { el: '.swiper-pagination', clickable: true, }, });
    }
    
    if (document.querySelector('.related-products .product-slider')) {
        new Swiper('.related-products .product-slider', { loop: true, spaceBetween: 20, slidesPerView: 1, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 25 }, 992: { slidesPerView: 3, spaceBetween: 30 } }, pagination: { el: '.swiper-pagination', clickable: true, }, });
    }

    // Ürün Detay Sayfası Galerisi ve Sekmeler
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        const activeThumbnail = document.querySelector('.thumbnail-gallery .thumbnail.active');
        if (activeThumbnail) { mainImage.src = activeThumbnail.src; }

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                button.classList.add('active');
                const targetTab = document.getElementById(button.dataset.tab);
                if (targetTab) { targetTab.classList.add('active'); }
            });
        });
    }
});