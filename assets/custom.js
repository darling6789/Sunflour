document.querySelector(".pro-var-select").addEventListener('change',function(){
  var pvtext = this.options[this.selectedIndex].text;
  var pvprice = pvtext.substring(pvtext.indexOf(" -") + 2, pvtext.length).trim();
  
  $(".price-item.price-current").text(pvprice);
  
  var cmprice = $(".comparedd span:nth-child(" + (this.selectedIndex + 1) + ")").text();
  $(".price-item.price-compare").text(cmprice);
});

// Fix location page header text inconsistencies
(function() {
  'use strict';
  
  function fixLocationHeaders() {
    const h1 = document.querySelector('.location-header h1');
    if (!h1) return;
    
    const currentText = h1.textContent || '';
    
    // Fix NoDa: "Bakery in NoDa | Charlotte" -> "Bakery in Charlotte, NC | NoDa"
    if (currentText.includes('Bakery in NoDa') || currentText.includes('Bakery in NoDa | Charlotte')) {
      h1.textContent = 'Bakery in Charlotte, NC | NoDa';
    }
    
    // Fix Harrisburg: ensure it reads "Bakery in Charlotte, NC | Harrisburg"
    if (currentText.includes('Harrisburg') && !currentText.includes('Bakery in Charlotte, NC | Harrisburg')) {
      // Check if it's the Harrisburg page and fix accordingly
      if (window.location.pathname.includes('harrisburg')) {
        h1.textContent = 'Bakery in Charlotte, NC | Harrisburg';
      }
    }
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLocationHeaders);
  } else {
    fixLocationHeaders();
  }
  
  // Also run after a short delay to catch dynamically loaded content
  setTimeout(fixLocationHeaders, 100);
  setTimeout(fixLocationHeaders, 500);
})();


