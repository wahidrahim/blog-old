$('#portfolio').imagesLoaded(function() {
  $('#portfolio').masonry({
    itemSelector: '.item',
    columnWidth: 360,
    gutter: 20,
    fitWidth: true
  });
});

$('#contact-form').validator().on('submit', function(e) {
  var $name = $('#contact-form #name');
  var $email = $('#contact-form #email');
  var $message = $('#contact-form #message');
  var $notice = $('<div id="mail-success" class="alert"></div>');

  // invalid form
  if (e.isDefaultPrevented()) {
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
        $notice.append('<strong>OOPS!</strong> something went wrong');
        $notice.toggleClass('alert-danger').insertBefore('#contact-form');
      }
      else {
        $notice.append('<strong>SUCCESS!</strong> your message has been receieved');
        $notice.toggleClass('alert-success').insertBefore('#contact-form');
      }

      $name.val('');
      $email.val('');
      $message.val('');
    });
  }
});
