document.querySelector(".pro-var-select").addEventListener('change',function(){
  var pvtext = this.options[this.selectedIndex].text;
  var pvprice = pvtext.substring(pvtext.indexOf(" -") + 2, pvtext.length).trim();
  
  $(".price-item.price-current").text(pvprice);
  
  var cmprice = $(".comparedd span:nth-child(" + (this.selectedIndex + 1) + ")").text();
  $(".price-item.price-compare").text(cmprice);
});

// Suppress subscription details flyout while keeping link functional
(function() {
  'use strict';
  
  function suppressSubscriptionFlyout() {
    // Hide any subscription details flyouts/tooltips
    const flyouts = document.querySelectorAll(
      '[class*="subscription-details"]:not(a):not(button), ' +
      '[class*="sls-details"]:not(a):not(button), ' +
      '[class*="sls-tooltip"], ' +
      '[class*="sls-flyout"], ' +
      '[id*="subscription-details"]:not(a):not(button), ' +
      '[id*="sls-details"]:not(a):not(button), ' +
      '[id*="sls-tooltip"], ' +
      '[id*="sls-flyout"], ' +
      '[role="tooltip"][class*="subscription"], ' +
      '[role="tooltip"][class*="sls"]'
    );
    
    flyouts.forEach(function(flyout) {
      // Only hide if it's not the link/button itself
      if (flyout.tagName !== 'A' && flyout.tagName !== 'BUTTON') {
        flyout.style.display = 'none';
        flyout.style.visibility = 'hidden';
        flyout.style.opacity = '0';
        flyout.style.pointerEvents = 'none';
        flyout.style.position = 'absolute';
        flyout.style.left = '-9999px';
        flyout.style.zIndex = '-1';
      }
    });
    
    // Prevent hover events from showing flyouts
    const subscriptionLinks = document.querySelectorAll(
      'a[href*="subscription"], ' +
      'a[class*="subscription-details"], ' +
      'a[class*="sls-details"], ' +
      'button[class*="subscription-details"], ' +
      'button[class*="sls-details"]'
    );
    
    subscriptionLinks.forEach(function(link) {
      // Remove hover event listeners that might trigger flyouts
      link.addEventListener('mouseenter', function(e) {
        // Find and hide any related flyouts
        const relatedFlyouts = document.querySelectorAll(
          '[class*="subscription-details"]:not(a):not(button), ' +
          '[class*="sls-details"]:not(a):not(button), ' +
          '[class*="sls-tooltip"], ' +
          '[class*="sls-flyout"]'
        );
        relatedFlyouts.forEach(function(flyout) {
          flyout.style.display = 'none';
          flyout.style.visibility = 'hidden';
          flyout.style.opacity = '0';
        });
      }, { passive: true });
    });
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suppressSubscriptionFlyout);
  } else {
    suppressSubscriptionFlyout();
  }
  
  // Run after delays to catch dynamically loaded content (like from SealSubs app)
  setTimeout(suppressSubscriptionFlyout, 500);
  setTimeout(suppressSubscriptionFlyout, 1000);
  setTimeout(suppressSubscriptionFlyout, 2000);
  setTimeout(suppressSubscriptionFlyout, 3000);
  
  // Use MutationObserver to catch dynamically added flyouts
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldSuppress = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            const classList = node.classList || [];
            const id = node.id || '';
            if (classList.toString().includes('subscription-details') ||
                classList.toString().includes('sls-details') ||
                classList.toString().includes('sls-tooltip') ||
                classList.toString().includes('sls-flyout') ||
                id.includes('subscription-details') ||
                id.includes('sls-details') ||
                id.includes('sls-tooltip') ||
                id.includes('sls-flyout')) {
              shouldSuppress = true;
            }
          }
        });
      });
      if (shouldSuppress) {
        suppressSubscriptionFlyout();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id']
    });
  }
})();

