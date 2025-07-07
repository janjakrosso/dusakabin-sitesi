/**
 * main.js - TAMAMEN DİNAMİK SİTE - DÜZELTİLMİŞ SÜRÜM
 * Bu dosya, sitenin TÜM JavaScript mantığını eksiksiz ve hatasız olarak içerir.
 */
document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // === BÖLÜM 1: GENEL DEĞİŞKENLER VE ANA FONKSİYONLAR
    // =======================================================

    let allProducts = []; // Tüm ürünleri saklamak için boş bir dizi

    /**
     * products.json dosyasından ürün verilerini çeker ve allProducts dizisine atar.
     */
    async function fetchProducts() {
        if (allProducts.length > 0) return allProducts; // Ürünler zaten yüklendiyse tekrar çekme
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
            allProducts = await response.json();
            return allProducts;
        } catch (error) {
            console.error("Ürünler yüklenirken bir hata oluştu:", error);
            return []; // Hata durumunda boş dizi döndür
        }
    }

    /**
     * Verilen ürünleri belirtilen container içinde HTML olarak render eder.
     * @param {Array} products - Gösterilecek ürünlerin dizisi.
     * @param {string} containerId - Ürünlerin ekleneceği elementin ID'si.
     */
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

    /**
     * Kategori filtresi dropdown'ını, ürün verisindeki benzersiz kategorilerle doldurur.
     */
    function populateCategoryFilter() {
        const categorySelect = document.getElementById('category-select');
        if (!categorySelect) return;
        const categories = [...new Set(allProducts.map(product => product.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category; 
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    /**
     * Ürünler sayfasındaki arama, kategori ve sıralama filtrelerini ayarlar.
     */
    function setupProductFilters() {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-select');
        const sortSelect = document.getElementById('sort-by');
        if (!searchInput || !categorySelect || !sortSelect) return;

        const applyFilters = () => {
            let filtered = [...allProducts];

            // Arama kutusuna göre filtrele
            const term = searchInput.value.toLowerCase();
            if (term) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.shortDescription.toLowerCase().includes(term));
            }

            // Kategoriye göre filtrele
            const category = categorySelect.value;
            if (category !== 'all') {
                filtered = filtered.filter(p => p.category === category);
            }

            // Sıralama seçeneğine göre sırala
            const sort = sortSelect.value;
            if (sort === 'name-asc') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sort === 'name-desc') {
                filtered.sort((a, b) => b.name.localeCompare(a.name));
            }
            renderProductGrid(filtered, 'product-grid-container');
        };

        [searchInput, categorySelect, sortSelect].forEach(el => {
            el.addEventListener('change', applyFilters);
        });
        searchInput.addEventListener('input', applyFilters);
    }
    
    /**
     * URL'den ürün ID'sini alarak ürün detay sayfasını doldurur.
     */
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

        document.title = `${product.name} - Berka Kabin`;
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

        const careText = document.getElementById('careText');
        if (careText) careText.innerHTML = product.careInfo;

        const relatedProducts = products.filter(p => p.category === product.category && p.id !== productId).slice(0, 5);
        renderProductGrid(relatedProducts.length > 0 ? relatedProducts : products.filter(p => p.id !== productId).slice(0,5), 'related-products-wrapper');
        
        // Bu fonksiyonlar en sonda çağrılacak
        setupImageZoomAndGallery();
        initializeRelatedProductsSlider();
    }
    
    /**
     * Ürün detay sayfasındaki küçük resimlere tıklama ve tam ekran galeri işlevlerini ayarlar.
     */
    function setupImageZoomAndGallery() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
        const fullscreenOverlay = document.getElementById('fullscreen-overlay');
        const fullscreenImage = document.getElementById('fullscreen-image');
        const closeFullscreenButton = document.querySelector('.close-fullscreen');
        const prevFullscreenButton = document.querySelector('.prev-fullscreen');
        const nextFullscreenButton = document.querySelector('.next-fullscreen');
        const openFullscreenLink = document.getElementById('openFullscreen');
        
        if (!mainImage || !fullscreenOverlay) return;

        let currentImageIndex = 0;
        let productThumbnails = Array.from(thumbnails).map(t => t.src);

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                currentImageIndex = index;
            });
        });

        if (openFullscreenLink) {
            openFullscreenLink.addEventListener('click', (e) => {
                e.preventDefault();
                if(productThumbnails.length > 0) {
                    fullscreenImage.src = productThumbnails[currentImageIndex];
                    fullscreenOverlay.classList.add('open');
                }
            });
        }
        
        const closeGallery = () => fullscreenOverlay.classList.remove('open');
        const navigateGallery = (direction) => {
            if (!productThumbnails || productThumbnails.length === 0) return;
            currentImageIndex = (currentImageIndex + direction + productThumbnails.length) % productThumbnails.length;
            fullscreenImage.src = productThumbnails[currentImageIndex];
        };

        if(closeFullscreenButton) closeFullscreenButton.addEventListener('click', closeGallery);
        if(prevFullscreenButton) prevFullscreenButton.addEventListener('click', () => navigateGallery(-1));
        if(nextFullscreenButton) nextFullscreenButton.addEventListener('click', () => navigateGallery(1));
        fullscreenOverlay.addEventListener('click', (e) => {
            if (e.target === fullscreenOverlay) closeGallery();
        });
        document.addEventListener('keydown', (e) => {
            if (fullscreenOverlay.classList.contains('open')) {
                if (e.key === 'ArrowLeft') navigateGallery(-1);
                else if (e.key === 'ArrowRight') navigateGallery(1);
                else if (e.key === 'Escape') closeGallery();
            }
        });
    }

    /**
     * Ürün kartlarındaki küçük resim galerisini (ileri/geri butonları) çalıştırır.
     */
    function setupProductCardGallery(containerSelector) {
        const productsContainer = document.querySelector(containerSelector);
        if (!productsContainer) return;

        productsContainer.addEventListener('click', (e) => {
            const navButton = e.target.closest('.card-nav-btn');
            if (navButton) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = navButton.closest('.product-card-final');
                const imageElement = card.querySelector('.product-card-image');
                const paginationDots = card.querySelectorAll('.card-pagination-dot');
                const images = JSON.parse(card.dataset.images);
                let currentIndex = parseInt(card.dataset.currentIndex, 10);
                
                if (navButton.classList.contains('next')) {
                    currentIndex = (currentIndex + 1) % images.length;
                } else {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }
                
                card.dataset.currentIndex = currentIndex;
                imageElement.src = images[currentIndex];
                paginationDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        });
    }

    /**
     * Benzer ürünler slider'ını başlatır.
     */
    function initializeRelatedProductsSlider() {
        if (document.querySelector('#related-products-slider')) {
            new Swiper('#related-products-slider', {
                loop: false,
                spaceBetween: 20,
                slidesPerView: 1,
                breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
                pagination: { el: '#related-products-slider .swiper-pagination', clickable: true },
            });
        }
    }


    // =======================================================
    // === BÖLÜM 2: SİTE GENELİ KÜÇÜK İŞLEVLER
    // =======================================================
    
    // Header'ın scroll olunca gölge eklemesi
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobil menüyü aç/kapat
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('is-open');
        });
    }

    // Yukarı çık butonu
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animasyonla gelen bölümler
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });
        fadeInSections.forEach(section => observer.observe(section));
    }
    
    // Ürün detay sayfasındaki sekmeler (tabs)
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

    // =======================================================
    // === BÖLÜM 3: SAYFA YÖNETİCİSİ (Hangi sayfada hangi kod çalışacak?)
    // =======================================================

    const page = document.body.dataset.page;
    const bodyId = document.body.id;

    if (bodyId === 'home-page') {
        fetchProducts().then(() => {
            // Öne çıkan ürünleri slider içinde göster
            renderProductGrid(allProducts, 'featured-products-wrapper');
            if (document.querySelector('.featured-products .product-slider')) {
                new Swiper('.featured-products .product-slider', {
                    loop: true,
                    spaceBetween: 20,
                    slidesPerView: 1,
                    breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
                    pagination: { el: '.swiper-pagination', clickable: true },
                });
            }
            setupProductCardGallery('.featured-products');
        });
    }

    // DEĞİŞTİRİLECEK OLAN if (page === 'urunler') BLOĞU

if (page === 'urunler') {
    fetchProducts().then(() => {
        // 1. Önce kategori filtresini doldur, böylece URL'den gelen değeri seçebiliriz.
        populateCategoryFilter();

        // 2. URL'den 'category' parametresini al.
        const params = new URLSearchParams(window.location.search);
        const categoryFromURL = params.get('category');
        
        // 3. Eğer URL'de bir kategori varsa, filtre dropdown'ını o değere ayarla.
        if (categoryFromURL) {
            const categorySelect = document.getElementById('category-select');
            if(categorySelect) {
                // Gelen kategori adının seçenekler arasında olup olmadığını kontrol et
                const optionExists = Array.from(categorySelect.options).some(opt => opt.value === categoryFromURL);
                if (optionExists) {
                    categorySelect.value = categoryFromURL;
                }
            }
        }
        
        // 4. Filtreleri ayarla. Bu fonksiyon artık sayfa yüklendiğindeki durumu (URL'den gelen filtre dahil)
        //    otomatik olarak uygulayacak şekilde çalışacak.
        setupProductFilters();

        // 5. İlk ürün listesini ekrana çizmek için filtre fonksiyonunu manuel olarak tetikle.
        // `setupProductFilters` içindeki `applyFilters` fonksiyonunu bir değişkene atamamız gerekmedi,
        // direkt `change` eventi ile tetiklenmesi yeterli. 
        // Sayfa ilk yüklendiğinde doğru ürünlerin gösterilmesi için, en temizi bir 'change' olayını simüle etmektir.
        document.getElementById('category-select').dispatchEvent(new Event('change'));

        // 6. Ürün kartlarındaki resim galerilerini aktif et.
        setupProductCardGallery('.product-gallery');
    });
}
});