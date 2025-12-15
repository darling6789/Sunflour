document.querySelector(".pro-var-select").addEventListener('change',function(){
  var pvtext = this.options[this.selectedIndex].text;
  var pvprice = pvtext.substring(pvtext.indexOf(" -") + 2, pvtext.length).trim();
  
  $(".price-item.price-current").text(pvprice);
  
  var cmprice = $(".comparedd span:nth-child(" + (this.selectedIndex + 1) + ")").text();
  $(".price-item.price-compare").text(cmprice);
});

// Suppress subscription details tooltip/flyout while keeping link functional
(function() {
  'use strict';
  
  function suppressSubscriptionTooltip() {
    // Hide any subscription details tooltips/flyouts (but not the link itself)
    const tooltips = document.querySelectorAll(
      '[class*="sls-tooltip"]:not(a):not(button), ' +
      '[class*="sls-flyout"]:not(a):not(button), ' +
      '[id*="sls-tooltip"]:not(a):not(button), ' +
      '[id*="sls-flyout"]:not(a):not(button), ' +
      '[role="tooltip"][class*="subscription"]:not(a):not(button), ' +
      '[role="tooltip"][class*="sls"]:not(a):not(button), ' +
      '[class*="subscription-details"]:not(a):not(button):not([class*="link"]), ' +
      '[id*="subscription-details"]:not(a):not(button)'
    );
    
    tooltips.forEach(function(tooltip) {
      // Hide tooltip elements but keep links/buttons visible
      if (tooltip.tagName !== 'A' && tooltip.tagName !== 'BUTTON' && !tooltip.closest('a') && !tooltip.closest('button')) {
        tooltip.style.display = 'none';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.position = 'absolute';
        tooltip.style.left = '-9999px';
        tooltip.style.zIndex = '-1';
      }
    });
    
    // Find subscription details links and remove hover tooltip behavior
    const subscriptionLinks = document.querySelectorAll(
      'a[href*="subscription"], ' +
      'a[class*="subscription-details"], ' +
      'a[class*="sls-details"], ' +
      'a[class*="sls-link"], ' +
      'button[class*="subscription-details"], ' +
      'button[class*="sls-details"]'
    );
    
    subscriptionLinks.forEach(function(link) {
      // Remove any existing hover event listeners by cloning the element
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Ensure click navigates to the link (don't prevent default)
      newLink.addEventListener('click', function(e) {
        // Allow normal link navigation - don't prevent default
        // Only stop if it's trying to show a tooltip
        const href = newLink.getAttribute('href');
        if (href && href !== '#' && href !== 'javascript:void(0)') {
          // Normal navigation - let it proceed
          return true;
        }
      });
      
      // Prevent hover from showing tooltips
      newLink.addEventListener('mouseenter', function(e) {
        // Hide any tooltips that might appear
        const relatedTooltips = document.querySelectorAll(
          '[class*="sls-tooltip"]:not(a):not(button), ' +
          '[class*="sls-flyout"]:not(a):not(button), ' +
          '[id*="sls-tooltip"]:not(a):not(button), ' +
          '[id*="sls-flyout"]:not(a):not(button), ' +
          '[role="tooltip"]:not(a):not(button)'
        );
        relatedTooltips.forEach(function(tooltip) {
          tooltip.style.display = 'none';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      }, { passive: true });
      
      // Also hide on mouseleave
      newLink.addEventListener('mouseleave', function(e) {
        const relatedTooltips = document.querySelectorAll(
          '[class*="sls-tooltip"]:not(a):not(button), ' +
          '[class*="sls-flyout"]:not(a):not(button), ' +
          '[role="tooltip"]:not(a):not(button)'
        );
        relatedTooltips.forEach(function(tooltip) {
          tooltip.style.display = 'none';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      }, { passive: true });
    });
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suppressSubscriptionTooltip);
  } else {
    suppressSubscriptionTooltip();
  }
  
  // Run after delays to catch dynamically loaded content (like from SealSubs app)
  setTimeout(suppressSubscriptionTooltip, 500);
  setTimeout(suppressSubscriptionTooltip, 1000);
  setTimeout(suppressSubscriptionTooltip, 2000);
  setTimeout(suppressSubscriptionTooltip, 3000);
  
  // Use MutationObserver to catch dynamically added tooltips
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldSuppress = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            const classList = node.classList || [];
            const id = node.id || '';
            if (classList.toString().includes('sls-tooltip') ||
                classList.toString().includes('sls-flyout') ||
                id.includes('sls-tooltip') ||
                id.includes('sls-flyout')) {
              shouldSuppress = true;
            }
          }
        });
      });
      if (shouldSuppress) {
        suppressSubscriptionTooltip();
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

