$("#circle").hide(0);

$(document).ready(function() {
  //smooth scroll to target learned from Chris Coyier http://codepen.io/chriscoyier/pen/dpBMVP
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
  
  $(window).scroll(function(){
    if ($(this).scrollTop() > 300) {
      $("#circle").fadeIn(1000);
    }
    else {
      $("#circle").fadeOut(500);
    }
  })

});
