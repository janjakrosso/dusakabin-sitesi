/**
 * Tüm sayfa içi JavaScript etkileşimlerini başlatan ana fonksiyon.
 */
function initializeApp() {

    // --- Hamburger Menu & Mobile Dropdown Logic ---
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
            // Sadece mobil ekranlarda çalışacak dropdown mantığı
            // window.innerWidth değeri, CSS'deki @media (max-width: 767px) ile uyumlu olmalı.
            if (window.innerWidth <= 767) { 
                e.preventDefault(); // Linkin varsayılan davranışını engelle

                const currentDropdown = toggle.parentElement; // Tıklanan dropdown'ın <li> parent'ı

                // Tıklanan menü dışındaki tüm açık menüleri kapat
                document.querySelectorAll('.nav-links .dropdown.open').forEach(openDropdown => {
                    if (openDropdown !== currentDropdown) {
                        openDropdown.classList.remove('open');
                    }
                });

                // Tıklanan menünün durumunu değiştir (açıksa kapat, kapalıysa aç)
                currentDropdown.classList.toggle('open');
            }
        });
    });

    // Sayfanın herhangi bir yerine tıklandığında açık olan mobil dropdown menüleri kapat
    document.addEventListener('click', (e) => {
        // Eğer tıklanan eleman ne menü toggle butonu ne de bir dropdown menü içinde değilse
        if (window.innerWidth <= 767 && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            // Açık olan tüm dropdown'ları kapat
            document.querySelectorAll('.nav-links .dropdown.open').forEach(openDropdown => {
                openDropdown.classList.remove('open');
            });
            // Ana mobil menüyü de kapat
            navLinks.classList.remove('is-open');
            menuToggle.classList.remove('is-active');
        }
    });

    // --- Active Navigation Link Logic ---
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const currentURL = window.location.href;

    allNavLinks.forEach(link => {
        // 'Hizmetlerimiz' gibi '#' ile biten linkleri aktif işaretlememek için kontrol
        if (link.href === currentURL && !link.href.endsWith('#')) {
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
            mainProductImage.src = selectedThumbnail.src; // Veri yerine doğrudan src kullanıyoruz
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
        // Bu butonlar urun-detay-pleksi.html'de yok, bu yüzden kontrol edelim
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

    // 'urunler.html'deki ürün kartlarını .product-card-final sınıfı ile yakala
    // ve bunlara 'data-name' ve 'data-category' ekle (manuel veya dinamik olarak)
    if (productGrid && (sortSelect || searchInput || categorySelect)) {
        const allProductsData = Array.from(productGrid.querySelectorAll('.product-card-final')).map(productEl => ({
            // Burada name ve category bilgilerini HTML'den çekmeliyiz
            // Örneğin: <div class="product-card-final" data-name="Pleksi Duşakabin" data-category="pleksi-dusakabin">
            name: productEl.querySelector('.product-title a')?.textContent || '',
            // Kategori bilgisini doğrudan HTML'den çekiyoruz, eğer orada bir veri yoksa 'all' olarak ayarlanabilir
            category: productEl.dataset.category || 'all', 
            element: productEl
        }));

        function renderProducts() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const sortBy = sortSelect ? sortSelect.value : 'default';
            const selectedCategory = categorySelect ? categorySelect.value : 'all';

            let filteredProducts = allProductsData.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
                return matchesSearch && matchesCategory;
            });

            if (sortBy === 'name-asc') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            } else if (sortBy === 'name-desc') {
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
            }
            
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

        // Sayfa yüklendiğinde ilk render'ı çağır
        renderProducts();
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
/* ===       ÜRÜN DETAY SAYFASI FONKSİYONLARI            === */
/* ======================================================= */

function initializeProductDetailPage() {
    // --- Küçük Resim Galerisi (Thumbnail) Logic ---
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        
        // **SORUNU ÇÖZEN ADIM:** Sayfa yüklendiğinde ana resmi ayarla.
        // Aktif olan ilk küçük resmin kaynağını al ve ana resme ata.
        const activeThumbnail = document.querySelector('.thumbnail-gallery .thumbnail.active');
        if (activeThumbnail) {
            mainImage.src = activeThumbnail.src;
        }

        // Küçük resimlere tıklama olayını ekle
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // --- Sekmeli Bilgi (Tabs) Logic ---
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
}

// initializeProductDetailPage fonksiyonunu sadece ürün detay sayfalarında çağırın
// Bu kontrolü HTML dosyalarınıza veya ayrı bir script'e ekleyebilirsiniz.
// Şimdilik, her sayfa yüklendiğinde çağrılması sorun teşkil etmez.
document.addEventListener('DOMContentLoaded', () => {
    initializeApp(); 
    // urun-detay-pleksi.html gibi dosyalarda çalışacak fonksiyon
    if (document.getElementById('mainProductImage')) { // Ana resim elementi varsa
        initializeProductDetailPage();
    }
});