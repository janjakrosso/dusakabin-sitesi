/**
 * Tüm sayfa içi JavaScript etkileşimlerini başlatan ana fonksiyon.
 */
function initializeApp() {
 
    
// --- Hamburger Menu Logic ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerButton.classList.toggle('active');
        });
    }

    // --- Active Navigation Link Logic ---
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentURL = window.location.href;

    navLinks.forEach(link => {
        if (link.href === currentURL) {
            link.classList.add('active');
        }
    });

    // --- Product Gallery Logic ---
    const mainProductImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    const inPagePrevBtn = document.getElementById('prevImageBtn');
    const inPageNextBtn = document.getElementById('nextImageBtn');

    const productLightbox = document.getElementById('productLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox .close-btn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');

    if (mainProductImage && thumbnails.length > 0) {
        let currentImageIndex = 0;
    
        function updateMainImage(index) {
            if (thumbnails.length === 0) return;
            currentImageIndex = (index + thumbnails.length) % thumbnails.length;
            const selectedThumbnail = thumbnails[currentImageIndex];
            mainProductImage.src = selectedThumbnail.dataset.fullSrc;
            mainProductImage.alt = selectedThumbnail.alt;
            thumbnails.forEach(t => t.classList.remove('active'));
            selectedThumbnail.classList.add('active');
        }
    
        function openLightbox() {
            if (mainProductImage && productLightbox && lightboxImage) {
                productLightbox.style.display = 'block';
                lightboxImage.src = mainProductImage.src;
                lightboxImage.alt = mainProductImage.alt;
            }
        }
    
        function closeLightbox() {
            if (productLightbox) {
                productLightbox.style.display = 'none';
            }
        }
    
        updateMainImage(0);
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => updateMainImage(index));
        });
        if (inPagePrevBtn) inPagePrevBtn.addEventListener('click', () => updateMainImage(currentImageIndex - 1));
        if (inPageNextBtn) inPageNextBtn.addEventListener('click', () => updateMainImage(currentImageIndex + 1));
        mainProductImage.addEventListener('click', openLightbox);
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (productLightbox) productLightbox.addEventListener('click', e => { if (e.target === productLightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (productLightbox && e.key === 'Escape' && productLightbox.style.display === 'block') closeLightbox(); });
        if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => { updateMainImage(currentImageIndex - 1); lightboxImage.src = mainProductImage.src; lightboxImage.alt = mainProductImage.alt; });
        if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => { updateMainImage(currentImageIndex + 1); lightboxImage.src = mainProductImage.src; lightboxImage.alt = mainProductImage.alt; });
    }

    // --- Product Filtering and Sorting Logic GÜNCELLENDİ ---
    const productGrid = document.querySelector('.product-grid');
    const sortSelect = document.getElementById('sort-by');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');

    if (productGrid && (sortSelect || searchInput || categorySelect)) {
        const allProductsData = Array.from(productGrid.querySelectorAll('.product-card.modern')).map(productEl => ({
            name: productEl.dataset.name || '',
            category: productEl.dataset.category || 'uncategorized',
            element: productEl
        }));

        function renderProducts() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const sortBy = sortSelect ? sortSelect.value : 'default';
            const selectedCategory = categorySelect ? categorySelect.value : 'all';

            // Filtreleme ve Sıralama
            let filteredProducts = allProductsData.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
                return matchesSearch && matchesCategory;
            });

            // Sıralama
            if (sortBy === 'name-asc') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            } else if (sortBy === 'name-desc') {
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
            }
            
            // Grid'i güncelleme
            productGrid.innerHTML = '';
            if (filteredProducts.length === 0) {
                productGrid.innerHTML = '<p class="no-results">Aramanızla eşleşen ürün bulunamadı.</p>';
            } else {
                filteredProducts.forEach(product => {
                    productGrid.appendChild(product.element);
                });
            }
        }

        if (searchInput) searchInput.addEventListener('input', renderProducts);
        if (sortSelect) sortSelect.addEventListener('change', renderProducts);
        if (categorySelect) categorySelect.addEventListener('change', renderProducts);
    }

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

    // --- Mobil menü dropdown işlevselliği ---
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', e => {
                if (window.innerWidth < 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // --- Swiper Slider for Featured Products ---
    const productSlider = document.querySelector('.product-slider');
    if (productSlider) {
        new Swiper(productSlider, {
            loop: true,
            spaceBetween: 30,
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 30 }
            },
            pagination: { el: '.swiper-pagination', clickable: true },
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

/* ======================================================= */
/* ===           KOYU MOD JAVASCRIPT LOGIC             === */
/* ======================================================= */

function initializeThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // Sayfa yüklendiğinde kayıtlı temayı veya sistem tercihini uygula
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Kullanıcının işletim sistemi koyu modda ise otomatik koyu modu aç
        body.classList.add('dark-mode');
    }

    // Butona tıklama olayını dinle
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            // 'dark-mode' sınıfını body'den ekle/kaldır
            body.classList.toggle('dark-mode');

            // Kullanıcının tercihini localStorage'a kaydet
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark-mode');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }
}

// initializeApp fonksiyonunun en sonuna bu yeni fonksiyonun çağrısını ekleyin
// ÖNEMLİ: Bu satırı kopyalayıp initializeApp'in sonuna yapıştırın
// initializeThemeSwitcher(); 
// Ancak daha kolayı, mevcut document.addEventListener'ı güncellemek:

document.addEventListener('DOMContentLoaded', () => {
    initializeApp(); // Sitenin mevcut fonksiyonlarını çalıştırır
    initializeThemeSwitcher(); // Koyu mod fonksiyonlarını çalıştırır
});