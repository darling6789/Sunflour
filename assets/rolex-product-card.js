// Product Card Navigation & Button Handlers
(function () {
  const productCards = document.querySelectorAll('.rolex-product-card-wrapper .product-card-link');

  productCards.forEach((card) => {
    // Get filter button reference (for data attributes only)
    // Note: Filter button click is handled by quick view modal's event delegation
    const filterBtn = card.querySelector('[data-quick-view-trigger]');

    // Handle "Buy Now" button - add to cart instead of navigating
    const buyNowBtn = card.querySelector('.btn-buy-now');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const productHandle = filterBtn?.getAttribute('data-product-handle');

        if (!productHandle) {
          alert('Unable to add product to cart.');
          return;
        }

        try {
          buyNowBtn.disabled = true;
          buyNowBtn.querySelector('.btn-text').textContent = 'Adding...';

          // Fetch product data to get variant ID
          const response = await fetch(`/products/${productHandle}.js`);
          if (!response.ok) throw new Error('Failed to fetch product');

          const productData = await response.json();
          const variantId = productData.variants?.[0]?.id;

          if (!variantId) throw new Error('No variant found');

          // Add to cart using theme's cart API
          const config = fetchConfig('javascript');
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          delete config.headers['Content-Type'];

          const formData = new FormData();
          formData.append('id', variantId);
          formData.append('quantity', 1);
          config.body = formData;

          console.log('Adding to cart with variant ID:', variantId);
          const cartResponse = await fetch(window.routes.cart_add_url, config);

          if (!cartResponse.ok) {
            const errorData = await cartResponse.text();
            console.error('Cart API error response:', errorData);

            // Try to parse JSON error response
            try {
              const errorJson = JSON.parse(errorData);
              const errorMessage =
                errorJson.message || errorJson.description || `Failed to add to cart (Error ${cartResponse.status})`;
              throw new Error(errorMessage);
            } catch (e) {
              if (e instanceof SyntaxError) {
                throw new Error(`Failed to add to cart (Error ${cartResponse.status})`);
              }
              throw e;
            }
          }

          const cartData = await cartResponse.json();

          // Remove the 'is-empty' class from cart if it was previously empty
          // This ensures proper display when transitioning from empty to full cart
          const cartNotification =
            document.querySelector('cart-notification') || document.querySelector('cart-drawer');
          if (cartNotification && cartNotification.classList.contains('is-empty')) {
            cartNotification.classList.remove('is-empty');
          }

          // Redirect to cart page
          window.location.href = window.routes.cart_url;
        } catch (error) {
          console.error('Error adding to cart:', error);
          buyNowBtn.disabled = false;
          buyNowBtn.querySelector('.btn-text').textContent = 'Buy Now';
          alert(error.message || 'Failed to add product to cart. Please try again.');
        }
      });
    }
  });
})();

