$('#portfolio').imagesLoaded(function() {
  $('#portfolio').masonry({
    itemSelector: '.item',
    columnWidth: 420,
    gutter: 20,
    fitWidth: true
  });
});

$('.item').hover(function(e) {
  if ($('video', this).get(0))
    $('video', this).get(0).play();
}, function(e) {
  if ($('video', this).get(0))
    $('video', this).get(0).pause();
});

$('.nav a').click(function(){  
  $('html, body').stop().animate({
    scrollTop: $( $(this).attr('href') ).offset().top
  }, 333);
  return false;
});
$('.scrollTop a').scrollTop();

$('#contact-form').validator().on('submit', function(e) {
  var $name = $('#contact-form #name');
  var $email = $('#contact-form #email');
  var $message = $('#contact-form #message');
  var $notice = $('<div id="mail-success" class="alert"></div>');

  $('#mail-success').remove();

  // invalid form
  if (e.isDefaultPrevented()) {
      $notice.append('<strong>Error:</strong> invalid form');
      $notice.toggleClass('alert-danger').insertBefore('#contact-form');
  }
  // valid
  else {
    e.preventDefault();

    $.post('/contact',  {
      name: $name.val(),
      email: $email.val(),
      message: $message.val()
    }, function(err) {
      if (err) {
        $notice.append('<strong>Oops!</strong> something went wrong');
        $notice.toggleClass('alert-danger').insertBefore('#contact-form');
      }
      else {
        $notice.append('<strong>Success!</strong> your message has been receieved');
        $notice.toggleClass('alert-success').insertBefore('#contact-form');
      }

      $name.val('');
      $email.val('');
      $message.val('');
    });
  }
});

$(window).scroll(function(e) {
  $('.progress').each(function(i) {
    var bar = $(this).find('.progress-bar');

    if ($(this).visible(true) && !$(this).hasClass('seen')) {
      $(this).addClass('seen');

      var p = bar.attr('aria-valuenow');
      bar.css({'width': String(p + '%')});
    }
    else if (!$(this).hasClass('seen')) {
      bar.css({'width': '0%'});
    }
  })
});
$(window).scroll();
