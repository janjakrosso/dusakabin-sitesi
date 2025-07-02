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
            if (window.innerWidth <= 767) {
                e.preventDefault(); // Linkin varsayılan davranışını engelle
                
                const currentDropdown = toggle.parentElement;
                const wasOpen = currentDropdown.classList.contains('open');

                // Önce açık olan diğer tüm dropdown'ları kapat
                document.querySelectorAll('.nav-links .dropdown.open').forEach(openDropdown => {
                    openDropdown.classList.remove('open');
                });

                // Eğer tıkladığımız menü daha önce açık değilse, onu aç.
                // Açıksa, yukarıdaki kod zaten kapattığı için kapalı kalacaktır.
                if (!wasOpen) {
                    currentDropdown.classList.add('open');
                }
            }
        });
    });

    // --- Active Navigation Link Logic ---
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const currentURL = window.location.href;

    allNavLinks.forEach(link => {
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