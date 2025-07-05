/**
 * main.js - TAMAMEN DİNAMİK SİTE - FİNAL SÜRÜM
 * Bu dosya, sitenin TÜM JavaScript mantığını eksiksiz olarak içerir.
 * - Ana Sayfa, Ürünler ve Ürün Detay sayfalarını dinamik olarak yönetir.
 * - Tüm arayüz ve etkileşim fonksiyonlarını barındırır.
 */
document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // === BÖLÜM 1: DİNAMİK ÜRÜN SİSTEMİ MANTIĞI
    // =======================================================
    let allProducts = [];

    async function fetchProducts() {
        if (allProducts.length > 0) return allProducts;
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allProducts = await response.json();
            return allProducts;
        } catch (error) {
            console.error("Ürünler yüklenirken bir hata oluştu:", error);
            return [];
        }
    }

    function renderProductGrid(products, containerId) {
        const gridContainer = document.getElementById(containerId);
        if (!gridContainer) return;
        if (products.length === 0) {
            gridContainer.innerHTML = '<p class="no-results">Gösterilecek ürün bulunamadı.</p>';
            return;
        }
        
        const isSlider = gridContainer.classList.contains('swiper-wrapper');
        gridContainer.innerHTML = products.map(product => {
            const paginationDots = product.thumbnails.map((thumb, index) => `<span class="card-pagination-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`).join('');
            const cardHTML = `
                <div class="product-card-final" data-images='${JSON.stringify(product.thumbnails)}' data-current-index="0">
                    <a href="urun-detay.html?id=${product.id}" class="product-image-link">
                        <img src="${product.mainImage}" alt="${product.name}" class="product-card-image">
                        <button class="card-nav-btn prev" aria-label="Önceki Resim"><i class="fas fa-chevron-left"></i></button>
                        <button class="card-nav-btn next" aria-label="Sonraki Resim"><i class="fas fa-chevron-right"></i></button>
                        <div class="card-pagination">${paginationDots}</div>
                        <div class="product-actions-overlay"><span class="action-btn" title="Detayları Gör"><i class="fas fa-search-plus"></i></span></div>
                    </a>
                    <div class="product-content">
                        <div class="product-info">
                            <h3 class="product-title"><a href="urun-detay.html?id=${product.id}">${product.name}</a></h3>
                            <p class="product-description">${product.shortDescription}</p>
                        </div>
                        <a href="${product.whatsappLink}" target="_blank" class="btn-cta-card"><i class="fab fa-whatsapp"></i> Fiyat Teklifi Al</a>
                    </div>
                </div>`;
            return isSlider ? `<div class="swiper-slide">${cardHTML}</div>` : cardHTML;
        }).join('');
    }
// EKLENECEK YENİ FONKSİYON
function setupImageZoomAndGallery() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const closeFullscreenButton = document.querySelector('.close-fullscreen');
    const prevFullscreenButton = document.querySelector('.prev-fullscreen');
    const nextFullscreenButton = document.querySelector('.next-fullscreen');
    const openFullscreenLink = document.getElementById('openFullscreen');
    let currentImageIndex = 0;
    let productThumbnails = [];

    if (!mainImage || !fullscreenOverlay) return;

    // Küçük resimlere tıklanınca ana resmi değiştir
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            currentImageIndex = index;
        });
    });

    // Ana görsele tıklayınca tam ekran galeriyi aç
    if (openFullscreenLink) {
        openFullscreenLink.addEventListener('click', (e) => {
            e.preventDefault();
            productThumbnails = Array.from(thumbnails).map(t => t.src);
            currentImageIndex = Array.from(thumbnails).findIndex(t => t.classList.contains('active'));
            if(productThumbnails.length > 0) {
                fullscreenImage.src = productThumbnails[currentImageIndex];
                fullscreenOverlay.classList.add('open');
            }
        });
    }

    // Galeriyi kapat
    if(closeFullscreenButton) {
        closeFullscreenButton.addEventListener('click', () => fullscreenOverlay.classList.remove('open'));
    }
    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            fullscreenOverlay.classList.remove('open');
        }
    });

    // Galeri içinde ileri/geri gitme
    const navigateGallery = (direction) => {
        if (!productThumbnails || productThumbnails.length === 0) return;
        currentImageIndex = (currentImageIndex + direction + productThumbnails.length) % productThumbnails.length;
        fullscreenImage.src = productThumbnails[currentImageIndex];
    };
    
    if(prevFullscreenButton) prevFullscreenButton.addEventListener('click', () => navigateGallery(-1));
    if(nextFullscreenButton) nextFullscreenButton.addEventListener('click', () => navigateGallery(1));

    // Klavye tuşlarıyla kontrol
    document.addEventListener('keydown', (e) => {
        if (fullscreenOverlay.classList.contains('open')) {
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            else if (e.key === 'ArrowRight') navigateGallery(1);
            else if (e.key === 'Escape') closeFullscreenButton.click();
        }
    });
}
    async function populateProductDetails() {
        // ... Bu fonksiyon öncekiyle aynı, değişiklik yok ...
    }

    function setupProductFilters() {
        // ... Bu fonksiyon öncekiyle aynı, değişiklik yok ...
    }
    
    function setupProductCardGallery(containerSelector) {
        const productsContainer = document.querySelector(containerSelector);
        if (!productsContainer) return;
        productsContainer.addEventListener('click', (e) => {
            const navButton = e.target.closest('.card-nav-btn');
            if (navButton) {
                e.preventDefault(); e.stopPropagation();
                const card = navButton.closest('.product-card-final');
                const imageElement = card.querySelector('.product-card-image');
                const paginationDots = card.querySelectorAll('.card-pagination-dot');
                const images = JSON.parse(card.dataset.images);
                let currentIndex = parseInt(card.dataset.currentIndex, 10);
                currentIndex = navButton.classList.contains('next') ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length;
                card.dataset.currentIndex = currentIndex;
                imageElement.src = images[currentIndex];
                paginationDots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
            }
        });
    }

    // =======================================================
    // === BÖLÜM 2: SAYFAYA ÖZGÜ KODLARI ÇALIŞTIRMA
    // =======================================================
    const page = document.body.dataset.page;
    const bodyId = document.body.id;

    // ANA SAYFA İÇİN YENİ MANTIK
    if (bodyId === 'home-page') {
        fetchProducts().then(() => {
            renderProductGrid(allProducts, 'featured-products-wrapper');
            // Ana sayfa slider'ını, içi dolduktan sonra başlat
            if (document.querySelector('.featured-products .product-slider')) {
                new Swiper('.featured-products .product-slider', { loop: true, spaceBetween: 20, slidesPerView: 1, breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }, pagination: { el: '.swiper-pagination', clickable: true, }, });
            }
            setupProductCardGallery('.featured-products');
        });
    }

    if (page === 'urunler') {
        fetchProducts().then(() => {
            renderProductGrid(allProducts, 'product-grid-container');
            setupProductFilters();
            setupProductCardGallery('.product-gallery');
        });
    } else if (page === 'urun-detay') {
        populateProductDetails();
    }
    
    // =======================================================
    // === BÖLÜM 3: SİTE GENELİ FONKSİYONLAR
    // =======================================================
    // ... Geri kalan tüm genel fonksiyonlar (menü, scroll, slider'lar vb.) burada yer alacak.
    // Önceki yanıtlardaki tam kodları buraya kopyalamanız yeterli.
    // Size kolaylık olması için bu fonksiyonların tam ve doğru halini aşağıya ekliyorum.

    async function populateProductDetails() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        if (!productId) { document.querySelector('main').innerHTML = '<h1>Geçersiz ürün. Lütfen ürünler sayfasından bir ürün seçin.</h1>'; return; }
        const products = await fetchProducts();
        const product = products.find(p => p.id === productId);
        if (!product) { document.querySelector('main').innerHTML = '<h1>Ürün bulunamadı.</h1>'; return; }
        document.title = `${product.name} - Firma Adı`;
        const breadcrumb = document.getElementById('breadcrumb-container');
        if (breadcrumb) breadcrumb.innerHTML = `<li class="breadcrumb-item"><a href="index.html">Ana Sayfa</a></li><li class="breadcrumb-item"><a href="urunler.html">Ürünler</a></li><li class="breadcrumb-item active" aria-current="page">${product.name}</li>`;
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productLongDescription').textContent = product.longDescription;
        document.getElementById('mainProductImage').src = product.mainImage;
        document.getElementById('mainProductImage').alt = product.name;
        document.getElementById('whatsappLink').href = product.whatsappLink;
        const thumbnailContainer = document.getElementById('thumbnail-gallery-container');
        if (thumbnailContainer) thumbnailContainer.innerHTML = product.thumbnails.map((thumb, index) => `<img class="thumbnail ${index === 0 ? 'active' : ''}" src="${thumb}" alt="${product.name} - Görünüm ${index + 1}">`).join('');
        const featuresList = document.getElementById('featuresList');
        if (featuresList) featuresList.innerHTML = product.features.map(feature => `<li><i class="fas ${feature.icon}"></i> <span>${feature.text}</span></li>`).join('');
        const specsList = document.getElementById('specsList');
        if (specsList) specsList.innerHTML = product.specs.map(spec => `<li><strong>${spec.label}:</strong> ${spec.value}</li>`).join('');
        const warrantyText = document.getElementById('warrantyText');
        if (warrantyText) warrantyText.innerHTML = product.warrantyInfo;
        const careText = document.getElementById('careText');
        if (careText) careText.innerHTML = product.careInfo;
        const relatedProducts = products.filter(p => p.id !== productId);
        renderProductGrid(relatedProducts, 'related-products-wrapper');
        initializeRelatedProductsSlider();
        setupImageZoomAndGallery();
        setupThumbnailClickEvents();
    }
    
    function setupProductFilters() {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-select');
        const sortSelect = document.getElementById('sort-by');
        if (!searchInput) return;
        const applyFilters = () => {
            let filtered = [...allProducts];
            const term = searchInput.value.toLowerCase();
            if (term) filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
            const category = categorySelect.value;
            if (category !== 'all') filtered = filtered.filter(p => p.category === category);
            const sort = sortSelect.value;
            if (sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
            if (sort === 'name-desc') filtered.sort((a,b) => b.name.localeCompare(a.name));
            renderProductGrid(filtered, 'product-grid-container');
        };
        [searchInput, categorySelect, sortSelect].forEach(el => el.addEventListener('change', applyFilters));
        searchInput.addEventListener('input', applyFilters);
    }
    
    function setupThumbnailClickEvents() {
        const mainImage = document.getElementById('mainProductImage');
        if (!mainImage) return;
        const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) window.addEventListener('scroll', () => siteHeader.classList.toggle('scrolled', window.scrollY > 50));
    const navLinksList = document.querySelectorAll('.nav-links > li');
    const currentPageFile = window.location.pathname.split('/').pop() || 'index.html';
    navLinksList.forEach(li => { const link = li.querySelector('a'); if (link && link.getAttribute('href') === currentPageFile) li.classList.add('active-page'); });
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => { menuToggle.classList.toggle('is-active'); navLinksContainer.classList.toggle('is-open'); });
        navLinksContainer.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => { link.addEventListener('click', () => { menuToggle.classList.remove('is-active'); navLinksContainer.classList.remove('is-open'); }); });
    }
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 767) { e.preventDefault(); const currentDropdown = toggle.parentElement; const isOpen = currentDropdown.classList.contains('open'); document.querySelectorAll('.nav-links .dropdown.open').forEach(d => d.classList.remove('open')); if (!isOpen) currentDropdown.classList.add('open'); }
        });
    });
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) { window.addEventListener('scroll', () => scrollToTopBtn.classList.toggle('show', window.scrollY > 300)); scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); }
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) { const observer = new IntersectionObserver((e) => e.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: 0.1 }); fadeInSections.forEach(s => observer.observe(s)); }
    function initializeRelatedProductsSlider() {
        const sliderEl = document.querySelector('#related-products-slider');
        if (sliderEl && sliderEl.swiper) sliderEl.swiper.destroy(true, true);
        if (sliderEl) new Swiper(sliderEl, { loop: false, spaceBetween: 20, slidesPerView: 1, breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }, pagination: { el: '#related-products-slider .swiper-pagination', clickable: true, }, });
    }
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                const targetTab = document.getElementById(button.dataset.tab);
                if (targetTab) targetTab.classList.add('active');
            });
        });
    }
});

function setupImageZoomAndGallery() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
        const fullscreenOverlay = document.getElementById('fullscreen-overlay');
        const fullscreenImage = document.getElementById('fullscreen-image');
        const closeFullscreenButton = document.querySelector('.close-fullscreen');
        const prevFullscreenButton = document.querySelector('.prev-fullscreen');
        const nextFullscreenButton = document.querySelector('.next-fullscreen');
        const openFullscreenLink = document.getElementById('openFullscreen');
        let currentImageIndex = 0;
        let productThumbnails = [];

        if (!mainImage || !fullscreenOverlay) return;

        // Küçük resimlere tıklama eventi
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                currentImageIndex = index;
            });
        });

        // Ana görsele tıklama (tam ekran açma)
        if (openFullscreenLink) {
            openFullscreenLink.addEventListener('click', (e) => {
                e.preventDefault();
                fullscreenImage.src = mainImage.src;
                fullscreenOverlay.classList.add('open');
                productThumbnails = Array.from(thumbnails).map(t => t.src);
                currentImageIndex = Array.from(thumbnails).findIndex(t => t.classList.contains('active'));
                updateFullscreenNavigation();
            });
        }

        // Tam ekranı kapatma
        if (closeFullscreenButton) {
            closeFullscreenButton.addEventListener('click', () => {
                fullscreenOverlay.classList.remove('open');
            });
        }

        // Önceki resim (tam ekran)
        if (prevFullscreenButton) {
            prevFullscreenButton.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + productThumbnails.length) % productThumbnails.length;
                fullscreenImage.src = productThumbnails ? productThumbnails[(currentImageIndex - 1 + productThumbnails.length) % productThumbnails.length] : '';
                updateFullscreenNavigation();
            });
        }

        // Sonraki resim (tam ekran)
        if (nextFullscreenButton) {
            nextFullscreenButton.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % productThumbnails.length;
                fullscreenImage.src = productThumbnails ? productThumbnails[(currentImageIndex + 1) % productThumbnails.length] : '';
                updateFullscreenNavigation();
            });
        }

        function updateFullscreenNavigation() {
            if (productThumbnails.length <= 1) {
                if (prevFullscreenButton) prevFullscreenButton.style.display = 'none';
                if (nextFullscreenButton) nextFullscreenButton.style.display = 'none';
            } else {
                if (prevFullscreenButton) prevFullscreenButton.style.display = 'block';
                if (nextFullscreenButton) nextFullscreenButton.style.display = 'block';
            }
        }

        // Klavyeyle geçiş (isteğe bağlı)
        document.addEventListener('keydown', (e) => {
            if (fullscreenOverlay.classList.contains('open')) {
                if (e.key === 'ArrowLeft') {
                    prevFullscreenButton.click();
                } else if (e.key === 'ArrowRight') {
                    nextFullscreenButton.click();
                } else if (e.key === 'Escape') {
                    closeFullscreenButton.click();
                }
            }
        });
    }

    // setupImageZoomAndGallery fonksiyonunu populateProductDetails içinde çağırın
    const page = document.body.dataset.page;
    if (page === 'urun-detay') {
        populateProductDetails().then(setupImageZoomAndGallery);
    }