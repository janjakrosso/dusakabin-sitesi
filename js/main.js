/**
 * Tüm sayfa içi JavaScript etkileşimlerini başlatan ana fonksiyon.
 */
function initializeApp() {
 
    
// --- Hamburger Menu Logic ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            // Menüye 'active' sınıfını ekleyip kaldırır
            navMenu.classList.toggle('active');
            // Hamburger ikonuna 'active' sınıfını ekleyip kaldırır (animasyon için)
            hamburgerButton.classList.toggle('active');
        });
    }

    // --- Active Navigation Link Logic ---
    // Hangi sayfada olduğumuzu belirtmek için menüdeki linki aktif hale getirir.
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
    const inPagePrevBtn = document.getElementById('prevImageBtn'); // Tanımlandı
    const inPageNextBtn = document.getElementById('nextImageBtn'); // Tanımlandı

    // Lightbox elements (already defined in HTML, just need to get references)
    const productLightbox = document.getElementById('productLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox .close-btn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');

    // --- Product Sorting Logic ---
    const productGrid = document.querySelector('.product-grid');
    const sortSelect = document.getElementById('sort-by');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select'); // Yeni: Kategori seçimi

    let allProductsData = []; // Ürün verilerini saklamak için

    if (mainProductImage && thumbnails.length > 0) {
        let currentImageIndex = 0; // Keep track of the currently displayed image
    
        // Function to update the main product image and active thumbnail
        function updateMainImage(index) {
            if (thumbnails.length === 0) return; // No images to display
    
            // Ensure index is within bounds
            currentImageIndex = (index + thumbnails.length) % thumbnails.length;
    
            const selectedThumbnail = thumbnails[currentImageIndex];
            mainProductImage.src = selectedThumbnail.dataset.fullSrc; // Düzeltildi: full-src -> fullSrc
            mainProductImage.alt = selectedThumbnail.alt;
    
            // Update active class for thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            selectedThumbnail.classList.add('active');
        }
    
        // Function to open the lightbox
        function openLightbox() {
            if (mainProductImage && productLightbox && lightboxImage) {
                productLightbox.style.display = 'block';
                lightboxImage.src = mainProductImage.src; // Set lightbox image to current main image
                lightboxImage.alt = mainProductImage.alt;
            }
        }
    
        // Function to close the lightbox
        function closeLightbox() {
            if (productLightbox) {
                productLightbox.style.display = 'none';
            }
        }
    
        // Event Listeners for Product Gallery
        // Initialize the first image as active
        updateMainImage(0); // Set initial image and active thumbnail
    
        // Thumbnail click handler
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                const clickedIndex = Array.from(thumbnails).indexOf(e.target);
                updateMainImage(clickedIndex); // Update main image based on clicked thumbnail
            
            });
        });
        // In-page navigation buttons
        if (inPagePrevBtn) {
            inPagePrevBtn.addEventListener('click', () => updateMainImage(currentImageIndex - 1));
        }
        if (inPageNextBtn) {
            inPageNextBtn.addEventListener('click', () => updateMainImage(currentImageIndex + 1));
        }
    
        // Click main image to open lightbox
        mainProductImage.addEventListener('click', openLightbox);
    
        // Lightbox close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
    
        // Click outside image to close lightbox
        if (productLightbox) {
            productLightbox.addEventListener('click', (e) => {
                if (e.target === productLightbox) {
                    closeLightbox();
                }
            });
        }
    
        // Keyboard escape to close lightbox
        document.addEventListener('keydown', (e) => {
            // productLightbox'ın varlığını kontrol etmeden özelliklerine erişmemek için eklendi
            if (productLightbox && e.key === 'Escape' && productLightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    
        // Lightbox navigation buttons
        if (lightboxPrevBtn) {
            lightboxPrevBtn.addEventListener('click', () => {
                updateMainImage(currentImageIndex - 1);
                lightboxImage.src = mainProductImage.src; // Update lightbox image
                lightboxImage.alt = mainProductImage.alt;
            });
        }
        if (lightboxNextBtn) {
            lightboxNextBtn.addEventListener('click', () => {
                updateMainImage(currentImageIndex + 1);
                lightboxImage.src = mainProductImage.src; // Update lightbox image
                lightboxImage.alt = mainProductImage.alt;
            });
        }
    }

    // --- Product Filtering and Sorting Logic ---
    if (productGrid && (sortSelect || searchInput || categorySelect)) { // categorySelect'i de kontrol et
        allProductsData = []; // Her başlangıçta diziyi sıfırla
        // Capture initial product data
        const productElements = productGrid.querySelectorAll('.product-link-wrapper');
        productElements.forEach(productEl => {
            const name = productEl.querySelector('h3') ? productEl.querySelector('h3').textContent : '';
            const priceTextElement = productEl.querySelector('.product-price');
            const priceText = priceTextElement ? priceTextElement.textContent : '0 TL'; // Default to '0 TL' if price not found
            // Fiyat ayrıştırma: Türk Lirası formatını (örn. 2.500 TL) doğru işlemek için
            const parsedPrice = parseFloat(priceText.replace(/\./g, '').replace(',', '.').replace(' TL', ''));
            // Kategori bilgisini data-category özniteliğinden al
            const category = productEl.dataset.category || 'uncategorized'; 
            const html = productEl.outerHTML;
            allProductsData.push({
                name: name,
                parsedPrice: parsedPrice,
                category: category, // Yeni: Kategori bilgisini ekle
                html: html
            });
        });

        function renderProducts() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const sortBy = sortSelect ? sortSelect.value : 'default';
            const selectedCategory = categorySelect ? categorySelect.value : 'all'; // Yeni: Seçilen kategori

            // 1. Filter by search term
            let filteredProducts = allProductsData.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );

            // 2. Filter by category (Yeni adım)
            if (selectedCategory !== 'all') {
                filteredProducts = filteredProducts.filter(product => 
                    product.category === selectedCategory
                );
            }

            // 3. Sort the filtered results
            let finalProducts = [...filteredProducts];
            switch (sortBy) {
                case 'price-asc':
                    finalProducts.sort((a, b) => a.parsedPrice - b.parsedPrice);
                    break;
                case 'price-desc':
                    finalProducts.sort((a, b) => b.parsedPrice - a.parsedPrice); // Düzeltildi: b.parsedPrice - a.parsedPrice olmalıydı
                    break;
                case 'name-asc':
                    finalProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }));
                    break;
                case 'name-desc':
                    finalProducts.sort((a, b) => b.name.localeCompare(a.name, 'tr', { sensitivity: 'base' }));
                    break;
                case 'default':
                    // Varsayılan sıralama için, sadece filtrelenmiş ürünleri orijinal sırasıyla kullan
                    finalProducts = [...filteredProducts]; 
                    break;
            }

            // 4. Render the final list
            productGrid.innerHTML = '';
            if (finalProducts.length === 0) {
                productGrid.innerHTML = '<p class="no-results">Aramanızla veya seçtiğiniz kategoriyle eşleşen ürün bulunamadı.</p>';
            } else {
                finalProducts.forEach(product => {
                    productGrid.insertAdjacentHTML('beforeend', product.html);
                });
            }
        }

        // Add event listeners
        if (searchInput) searchInput.addEventListener('input', renderProducts);
        if (sortSelect) sortSelect.addEventListener('change', renderProducts);
        if (categorySelect) categorySelect.addEventListener('change', renderProducts); // Yeni: Kategori seçimi için olay dinleyici
    }

    // --- Scroll to Top Button Logic ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        // Sayfa kaydırıldığında butonu göster/gizle
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // 300px kaydırıldıktan sonra göster
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Tıklandığında yukarı kaydır
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Kaydırma ile Gelen Animasyonlar için JavaScript ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const observerOptions = {
            root: null, // viewport'u referans al
            rootMargin: '0px',
            threshold: 0.1 // Elementin %10'u göründüğünde tetikle
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    }

    // --- Mobil menü dropdown işlevselliği ---
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                // Sadece mobil görünümde (767px ve altı) çalışsın
                if (window.innerWidth < 768) {
                    e.preventDefault(); // Ana linkin çalışmasını engelle
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // --- Swiper Slider for Featured Products ---
    const productSlider = document.querySelector('.product-slider');
    if (productSlider) {
        const swiper = new Swiper(productSlider, {
            // Optional parameters
            loop: true,
            spaceBetween: 30,
            
            // Responsive breakpoints
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // when window width is >= 992px
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
    
            // Pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
}

/**
 * Sayfa yüklendiğinde çalışacak ana olay dinleyici.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp(); // Tüm JavaScript etkileşimlerini başlat
});
