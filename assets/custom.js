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
    // Find all h1 elements that contain the text
    const headings = document.querySelectorAll('h1, .main-page-title, .page-title');
    headings.forEach(function(heading) {
      if (heading.textContent && heading.textContent.includes('Buy Online & Ship Sunflour Nationwide')) {
        heading.textContent = heading.textContent.replace('Buy Online & Ship Sunflour Nationwide', 'Ship Sunflour Nationwide');
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
})();


