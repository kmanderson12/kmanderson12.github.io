$(document).ready(function() {
    $(".circle").hide();
  //smooth scroll to target learned from Chris Coyier http://codepen.io/chriscoyier/pen/dpBMVP
    smoothScroll();
    scrollAppear();

    if (Modernizr.touch) {
        $("#overlay").click(function(){
            $(this).toggleClass("touch");
        })
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      $(window).scroll(function(){
        if ($(this).scrollTop() > 300) {
          $(".overlay").addClass('touch');
        }
        else {
          $(".overlay").removeClass('touch');
        }
     }



});

var smoothScroll = function() {
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

}

var scrollAppear = function() {
    $(window).scroll(function(){
    if ($(this).scrollTop() > 300) {
      $(".circle").fadeIn(1000);
    }
    else {
      $(".circle").fadeOut(500);
    }
  });
}

const nav = document.querySelector('#nav');
const topOfNav = nav.offsetTop;

function fixNav() {

  if (window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.style.paddingTop = 0;
    document.body.classList.remove('fixed-nav');
  }
  console.log(topOfNav);

}


window.addEventListener('scroll', fixNav);