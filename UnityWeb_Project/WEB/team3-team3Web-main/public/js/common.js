
var currentUrl = window.location.href;
var levelLinks = document.querySelectorAll('.levels_btns_container a');

levelLinks.forEach(function(link) {
  
  if (link.href === currentUrl) {
    link.style.border = '0.3rem solid var(--light_blue)'
  }
});

