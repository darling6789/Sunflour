document.querySelector(".pro-var-select").addEventListener('change',function(){
  var pvtext = this.options[this.selectedIndex].text;
  var pvprice = pvtext.substring(pvtext.indexOf(" -") + 2, pvtext.length).trim();
  
  $(".price-item.price-current").text(pvprice);
  
  var cmprice = $(".comparedd span:nth-child(" + (this.selectedIndex + 1) + ")").text();
  $(".price-item.price-compare").text(cmprice);
});

