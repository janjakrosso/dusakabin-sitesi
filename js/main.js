/**
 * main.js - İyileştirilmiş ve Birleştirilmiş Versiyon
 */

// Tüm JavaScript kodlarımız, sayfa tamamen yüklendiğinde bir kez çalışır.
document.addEventListener('DOMContentLoaded', () => {

    // --- Hamburger Menü & Mobil Dropdown Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
 
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('is-open');
        });
    }
 
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Sadece mobil görünümde çalışmasını sağlıyoruz
            if (window.innerWidth <= 767) {
                e.preventDefault();
                
                const currentDropdown = toggle.parentElement;
                // Tıkladığımız menünün zaten açık olup olmadığını kontrol ediyoruz.
                const isAlreadyOpen = currentDropdown.classList.contains('open');

                // 1. Önce, açık olan tüm dropdown menüleri kapatıyoruz.
                document.querySelectorAll('.nav-links .dropdown.open').forEach(openDropdown => {
                    openDropdown.classList.remove('open');
                });

                // 2. Eğer tıkladığımız menü zaten açık değilse, onu açıyoruz.
                // Eğer zaten açıksa, yukarıdaki komut onu kapattığı için kapalı kalacaktır.
                if (!isAlreadyOpen) {
                    currentDropdown.classList.add('open');
                }
            }
        });
    });

    // --- Scroll to Top Button Logic ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Kaydırma ile Gelen Animasyonlar ---
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

    // --- Öne Çıkan Ürünler Slider (Sadece Ana Sayfada Çalışır) ---
    // Sayfada bu slider varsa, kodu çalıştır.
    if (document.querySelector('.featured-products .product-slider')) {
        new Swiper('.featured-products .product-slider', {
            loop: true,
            spaceBetween: 20,
            slidesPerView: 1, // Mobil için varsayılan
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
    
    // --- İlgili Ürünler Slider (Sadece Ürün Detay Sayfasında Çalışır) ---
    // Sayfada bu slider varsa, kodu çalıştır.
    if (document.querySelector('.related-products .product-slider')) {
        new Swiper('.related-products .product-slider', {
            loop: true,
            spaceBetween: 20,
            slidesPerView: 1, // Mobil için varsayılan
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // --- Ürün Detay Sayfası Galerisi ve Sekmeler ---
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        const activeThumbnail = document.querySelector('.thumbnail-gallery .thumbnail.active');
        if (activeThumbnail) {
            mainImage.src = activeThumbnail.src;
        }

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
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }

    // Not: Ürünler sayfasındaki filtreleme kodunuz buraya eklenebilir.
    // Şimdilik ayrı tutulması bir sorun teşkil etmiyor.
});