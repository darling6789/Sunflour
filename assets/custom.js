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
      // Aggressively prevent hover from showing tooltips - stop propagation
      link.addEventListener('mouseenter', function(e) {
        e.stopPropagation();
        // Immediately hide any tooltips that might appear
        hideAllTooltips();
      }, { capture: true });
      
      link.addEventListener('mouseover', function(e) {
        e.stopPropagation();
        hideAllTooltips();
      }, { capture: true });
      
      // Also hide on mouseleave
      link.addEventListener('mouseleave', function(e) {
        hideAllTooltips();
      }, { capture: true });
      
      // Ensure click navigates normally - don't interfere with link clicks
      link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');
        // If it's a real link, allow normal navigation
        if (href && href !== '#' && href !== 'javascript:void(0)' && !href.startsWith('#')) {
          // Let the link navigate normally - don't prevent default
          hideAllTooltips();
        }
      }, { passive: true });
    });
    
    // Helper function to hide all tooltips
    function hideAllTooltips() {
      const relatedTooltips = document.querySelectorAll(
        '[class*="sls-tooltip"]:not(a):not(button), ' +
        '[class*="sls-flyout"]:not(a):not(button), ' +
        '[id*="sls-tooltip"]:not(a):not(button), ' +
        '[id*="sls-flyout"]:not(a):not(button), ' +
        '[role="tooltip"]:not(a):not(button), ' +
        'div[class*="sls-tooltip"], ' +
        'div[class*="sls-flyout"], ' +
        '[class*="subscription-details"]:not(a):not(button):not([class*="link"])'
      );
      relatedTooltips.forEach(function(tooltip) {
        tooltip.style.display = 'none';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.position = 'absolute';
        tooltip.style.left = '-9999px';
        tooltip.style.top = '-9999px';
        tooltip.style.zIndex = '-9999';
        tooltip.style.height = '0';
        tooltip.style.width = '0';
        tooltip.style.overflow = 'hidden';
      });
    }
    
    // Continuously monitor and hide tooltips
    setInterval(function() {
      hideAllTooltips();
    }, 100);
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

