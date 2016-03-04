/*
 * BOOTSTRAP SCROLLSPY
 */
$('body').scrollspy({target: '.navbar', offset: 200});

/*
 * MASONRY
 */
$(window).resize(function() {
  var strWidth = $('.item').css('width');
  var width = Number(strWidth.substring(0, 3));

  $('#portfolio').imagesLoaded(function() {
    $('#portfolio').masonry({
      itemSelector: '.item',
      columnWidth: width,
      gutter: 20,
      fitWidth: true
    });
  });
});
$(window).resize();

/*
 * PLAY VIDEO ON MOUSE HOVER
 */
$('.item').hover(function(e) {
  if ($('video', this).get(0))
    $('video', this).get(0).play();
}, function(e) {
  if ($('video', this).get(0))
    $('video', this).get(0).pause();
});

/*
 * ANIMATED SCROLL
 */
$('.nav a').click(function(){  
  $('html, body').stop().animate({
    scrollTop: $( $(this).attr('href') ).offset().top
  });
  return false;
});
$('.scrollTop a').scrollTop();

/*
 * SCROLL ANIMATIONS
 */
$(window).scroll(function(e) {
  // shrink and grow navbar
  if (!$('nav').hasClass('shrunk') &&
      $(window).scrollTop() > ($('body').height() / 7)) {

    shrinkNav();
    $('nav').addClass('shrunk')
  }
  else if ($('nav').hasClass('shrunk') &&
      $(window).scrollTop() < ($('body').height() / 7)) {

    growNav();
    $('nav').removeClass('shrunk');
  }
 
  // skills progress bar animation
  $('.progress').each(function(i) {
    var bar = $(this).find('.progress-bar');

    if ($(this).visible(true) && !$(this).hasClass('seen')) {
      var p = bar.attr('aria-valuenow');

      bar.css({'width': String(p + '%')});
      $(this).addClass('seen');
    }
    else if (!$(this).hasClass('seen')) {
      bar.css({'width': '0%'});
    }
  })
});
$(window).scroll();

function shrinkNav() {
  $('body').animate({'padding-top': '50px'}, {'queue': false});
  $('nav').animate({'height': '50px'}, {'queue': false});
  $('.navbar-header .navbar-brand, .nav.navbar-nav li a').animate({
    'height': '50px',
    'line-height': '50px'
  }, {'queue': false});
  $('.navbar-brand').animate({'font-size': '2em'}, {'queue': false, 'complete': function() {
    $(this).slideUp(200, function() {
      $(this).text('WR');
      $(this).slideDown(200);
    });
  }});
}

function growNav() {
  $('body').animate({'padding-top': '75px'}, {'queue': false});
  $('nav').animate({'height': '75px'}, {'queue': false});
  $('.navbar-header .navbar-brand, .nav.navbar-nav li a').animate({
    'height': '75px',
    'line-height': '75px'
  }, {'queue': false});
  $('.navbar-brand').animate({'font-size': '3em'}, {'queue': false, 'complete': function() {
    $(this).slideUp(200, function() {
      $(this).text('Wahid Rahim');
      $(this).slideDown(200);
    });
  }});
}
