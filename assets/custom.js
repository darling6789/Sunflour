document.querySelector(".pro-var-select").addEventListener('change',function(){
  var pvtext = this.options[this.selectedIndex].text;
  var pvprice = pvtext.substring(pvtext.indexOf(" -") + 2, pvtext.length).trim();
  
  $(".price-item.price-current").text(pvprice);
  
  var cmprice = $(".comparedd span:nth-child(" + (this.selectedIndex + 1) + ")").text();
  $(".price-item.price-compare").text(cmprice);
});

// Change "Buy Online & Ship Sunflour Nationwide" to "Ship Sunflour Nationwide" on Nationwide Shipping page
(function() {
  'use strict';
  
  function updateNationwideShippingText() {
    // Find all headings and text elements that contain the text
    const elements = document.querySelectorAll('h1, h2, .main-page-title, .page-title, .s-all-products-header h1');
    elements.forEach(function(element) {
      if (element.textContent && element.textContent.includes('Buy Online & Ship Sunflour Nationwide')) {
        element.textContent = element.textContent.replace('Buy Online & Ship Sunflour Nationwide', 'Ship Sunflour Nationwide');
      }
      // Also check for variations
      if (element.textContent && element.textContent.includes('Buy Online &amp; Ship Sunflour Nationwide')) {
        element.textContent = element.textContent.replace('Buy Online &amp; Ship Sunflour Nationwide', 'Ship Sunflour Nationwide');
      }
    });
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNationwideShippingText);
  } else {
    updateNationwideShippingText();
  }
  
  // Also run after a short delay to catch dynamically loaded content
  setTimeout(updateNationwideShippingText, 100);
  setTimeout(updateNationwideShippingText, 500);
  setTimeout(updateNationwideShippingText, 1000);
})();


