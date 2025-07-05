/**
 * main.js - TAMAMEN ESNEK DİNAMİK SİSTEM
 * Bu versiyon, her ürünün kendine özgü detaylara sahip olmasını sağlar.
 * products.json dosyasındaki esnek "specs" yapısını doğru bir şekilde okur.
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
        gridContainer.innerHTML = '<p class="no-results">Arama kriterlerinize uygun ürün bulunamadı.</p>';
        return;
    }
    
    const isSlider = gridContainer.classList.contains('swiper-wrapper');
    const productCardsHTML = products.map(product => {
        // Her kartın kendi navigasyon noktalarını oluştur
        const paginationDots = product.thumbnails.map((thumb, index) => 
            `<span class="card-pagination-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
        ).join('');

        const cardHTML = `
            <div class="product-card-final" data-images='${JSON.stringify(product.thumbnails)}' data-current-index="0">
                <a href="urun-detay.html?id=${product.id}" class="product-image-link">
                    <img src="${product.mainImage}" alt="${product.name}" class="product-card-image">
                    
                    <button class="card-nav-btn prev" aria-label="Önceki Resim"><i class="fas fa-chevron-left"></i></button>
                    <button class="card-nav-btn next" aria-label="Sonraki Resim"><i class="fas fa-chevron-right"></i></button>

                    <div class="card-pagination">${paginationDots}</div>

                    <div class="product-actions-overlay">
                        <span class="action-btn" title="Detayları Gör"><i class="fas fa-search-plus"></i></span>
                    </div>
                </a>
                <div class="product-content">
                    <div class="product-info">
                        <h3 class="product-title"><a href="urun-detay.html?id=${product.id}">${product.name}</a></h3>
                        <p class="product-description">${product.shortDescription}</p>
                    </div>
                    <a href="${product.whatsappLink}" target="_blank" class="btn-cta-card">
                        <i class="fab fa-whatsapp"></i> Fiyat Teklifi Al
                    </a>
                </div>
            </div>`;
        return isSlider ? `<div class="swiper-slide">${cardHTML}</div>` : cardHTML;
    }).join('');

    gridContainer.innerHTML = productCardsHTML;
}

    async function populateProductDetails() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        if (!productId) {
            document.querySelector('main').innerHTML = '<h1>Geçersiz ürün. Lütfen ürünler sayfasından bir ürün seçin.</h1>';
            return;
        }
        
        const products = await fetchProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.querySelector('main').innerHTML = '<h1>Ürün bulunamadı.</h1>';
            return;
        }

        document.title = `${product.name} - Firma Adı`;

        const breadcrumb = document.querySelector('.breadcrumb');
        if(breadcrumb) {
             breadcrumb.innerHTML = `
                <li class="breadcrumb-item"><a href="index.html">Ana Sayfa</a></li>
                <li class="breadcrumb-item"><a href="urunler.html">Ürünler</a></li>
                <li class="breadcrumb-item active" aria-current="page">${product.name}</li>
            `;
        }
       
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productLongDescription').textContent = product.longDescription;
        document.getElementById('mainProductImage').src = product.mainImage;
        document.getElementById('mainProductImage').alt = product.name;
        document.getElementById('whatsappLink').href = product.whatsappLink;

        const thumbnailContainer = document.getElementById('thumbnail-gallery-container');
        if (thumbnailContainer && Array.isArray(product.thumbnails)) {
            thumbnailContainer.innerHTML = product.thumbnails.map((thumb, index) => 
                `<img class="thumbnail ${index === 0 ? 'active' : ''}" src="${thumb}" alt="${product.name} - Görünüm ${index + 1}">`
            ).join('');
        }

        const featuresList = document.getElementById('featuresList');
        if (featuresList && Array.isArray(product.features)) {
            featuresList.innerHTML = product.features.map(feature => 
                `<li><i class="fas ${feature.icon}"></i> <span>${feature.text}</span></li>`
            ).join('');
        }
        
        // === ÖNEMLİ DÜZELTME BURADA ===
        // Teknik Özellikler Sekmesi artık 'products.json' dosyasındaki esnek yapıyı okuyor.
        const specsList = document.getElementById('specsList');
        if(specsList && Array.isArray(product.specs)){
            specsList.innerHTML = product.specs.map(spec => 
                `<li><strong>${spec.label}:</strong> ${spec.value}</li>`
            ).join('');
        }
        
        const warrantyText = document.getElementById('warrantyText');
        if(warrantyText) warrantyText.innerHTML = product.warrantyInfo;
        
        const careText = document.getElementById('careText');
        if(careText) careText.innerHTML = product.careInfo;
        
        const relatedProducts = products.filter(p => p.id !== productId);
        renderProductGrid(relatedProducts, 'related-products-wrapper');
        initializeRelatedProductsSlider();

        setupThumbnailClickEvents();
    }
    function setupProductCardGallery() {
        // Tüm ürün kartlarının olduğu ana kapsayıcıyı dinle (event delegation)
        const productsContainer = document.querySelector('.product-gallery .container');
        if (!productsContainer) return;

        productsContainer.addEventListener('click', (e) => {
            // Tıklanan eleman bir kart navigasyon butonu mu?
            const navButton = e.target.closest('.card-nav-btn');
            if (navButton) {
                e.preventDefault(); // Kartın ana linkine gitmeyi engelle
                e.stopPropagation(); // Olayın daha fazla yayılmasını durdur

                const card = navButton.closest('.product-card-final');
                const imageElement = card.querySelector('.product-card-image');
                const paginationDots = card.querySelectorAll('.card-pagination-dot');
                
                // Resim listesini kartın data-attributes'ından al
                const images = JSON.parse(card.dataset.images);
                let currentIndex = parseInt(card.dataset.currentIndex, 10);

                // Hangi butona basıldığını kontrol et ve yeni indeksi hesapla
                if (navButton.classList.contains('next')) {
                    currentIndex = (currentIndex + 1) % images.length;
                } else if (navButton.classList.contains('prev')) {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }

                // Kartın mevcut indeksini güncelle
                card.dataset.currentIndex = currentIndex;

                // Resmin src'sini yeni resimle değiştir
                imageElement.src = images[currentIndex];

                // Pagination noktalarını güncelle
                paginationDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        });
    }
    function setupProductFilters() {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-select');
        const sortSelect = document.getElementById('sort-by');
        if (!searchInput) return;

        const applyFiltersAndSort = () => {
            let filteredProducts = [...allProducts];
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm) || p.shortDescription.toLowerCase().includes(searchTerm));
            }
            const selectedCategory = categorySelect.value;
            if (selectedCategory !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
            }
            const sortBy = sortSelect.value;
            if (sortBy === 'name-asc') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'name-desc') {
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            }
            renderProductGrid(filteredProducts, 'product-grid-container');
        };

        searchInput.addEventListener('input', applyFiltersAndSort);
        categorySelect.addEventListener('change', applyFiltersAndSort);
        sortSelect.addEventListener('change', applyFiltersAndSort);
    }
    
    // =======================================================
    // === BÖLÜM 2: SAYFAYA ÖZGÜ KODLARI ÇALIŞTIRMA
    // =======================================================
    const page = document.body.dataset.page;
    if (page === 'urunler') {
        fetchProducts().then(() => {
            renderProductGrid(allProducts, 'product-grid-container');
            setupProductFilters();
            setupProductCardGallery(); // YENİ EKLENEN SATIR
        });
    } else if (page === 'urun-detay') {
        populateProductDetails();
    }

    // =======================================================
    // === BÖLÜM 3: SİTE GENELİ FONKSİYONLAR
    // =======================================================
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
    navLinksList.forEach(li => {
        const link = li.querySelector('a');
        if (link && link.getAttribute('href') === currentPageFile) li.classList.add('active-page');
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('is-open');
        });
        navLinksContainer.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navLinksContainer.classList.remove('is-open');
            });
        });
    }
 
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                const currentDropdown = toggle.parentElement;
                const isAlreadyOpen = currentDropdown.classList.contains('open');
                document.querySelectorAll('.nav-links .dropdown.open').forEach(d => d.classList.remove('open'));
                if (!isAlreadyOpen) currentDropdown.classList.add('open');
            }
        });
    });

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => scrollToTopBtn.classList.toggle('show', window.scrollY > 300));
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
        }, { threshold: 0.1 });
        fadeInSections.forEach(section => observer.observe(section));
    }
    
    if (document.querySelector('.featured-products .product-slider')) {
        new Swiper('.featured-products .product-slider', { loop: true, spaceBetween: 20, slidesPerView: 1, breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }, pagination: { el: '.swiper-pagination', clickable: true, }, });
    }
    
    function initializeRelatedProductsSlider() {
        const sliderEl = document.querySelector('#related-products-slider');
        if (sliderEl && sliderEl.swiper) {
            sliderEl.swiper.destroy(true, true);
        }
        if (sliderEl) {
            new Swiper(sliderEl, { loop: false, spaceBetween: 20, slidesPerView: 1, breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }, pagination: { el: '#related-products-slider .swiper-pagination', clickable: true, }, });
        }
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                const targetTab = document.getElementById(button.dataset.tab);
                if (targetTab) targetTab.classList.add('active');
            });
        });
    }
});