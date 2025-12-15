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
  
  // Helper function to hide all tooltips - call this frequently
  function hideAllTooltips() {
    // Find all elements that might be tooltips
    const allElements = document.querySelectorAll('*');
    allElements.forEach(function(element) {
      // Skip links, buttons, and text nodes
      if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.closest('a') || element.closest('button')) {
        return;
      }
      
      // Check if it's a tooltip by content or class
      const text = element.textContent || '';
      const classList = element.classList.toString() || '';
      const id = element.id || '';
      
      // Hide if it contains "How subscriptions work" or is clearly a tooltip
      // But NOT if it's part of the link text itself
      const isTooltipContent = text.includes('How subscriptions work') || 
                               text.includes('You can modify or cancel') ||
                               text.includes('Subscriptions are renewed') ||
                               text.includes('Learn more about subscriptions');
      const isTooltipElement = classList.includes('sls-tooltip') ||
                               classList.includes('sls-flyout') ||
                               id.includes('sls-tooltip') ||
                               id.includes('sls-flyout') ||
                               element.getAttribute('role') === 'tooltip';
      
      // Only hide if it's a tooltip AND not part of a link
      if ((isTooltipContent || isTooltipElement) &&
          element.tagName !== 'A' && 
          element.tagName !== 'BUTTON' &&
          !element.closest('a') &&
          !element.closest('button') &&
          // Don't hide if it's just the link text (check if it's a small text element)
          !(element.tagName === 'SPAN' && !isTooltipContent && element.closest('[class*="subscription-details"]'))) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.zIndex = '-9999';
        element.style.height = '0';
        element.style.width = '0';
        element.style.overflow = 'hidden';
        element.style.maxHeight = '0';
        element.style.maxWidth = '0';
        // Remove any classes that might trigger display
        element.classList.remove('show', 'visible', 'active', 'open', 'display', 'block');
      }
    });
  }
  
  function suppressSubscriptionTooltip() {
    // Hide any subscription details tooltips/flyouts (but not the link itself)
    hideAllTooltips();
    
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
      // Aggressively prevent hover from showing tooltips - stop propagation and prevent default
      link.addEventListener('mouseenter', function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        hideAllTooltips();
      }, { capture: true });
      
      link.addEventListener('mouseover', function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
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
    
    // Continuously monitor and hide tooltips - run very frequently
    setInterval(function() {
      hideAllTooltips();
    }, 50);
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

