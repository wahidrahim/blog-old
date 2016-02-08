var projects = document.querySelector('.portfolio');
var packery = new Packery(projects, {
  itemSelector: '.project',
  gutter: 10
});

$('#contact-form').submit(function(event) {
  event.preventDefault();

  $name = $('#name')
  $email = $('#email')
  $message = $('#message')
  $notice = $('<div></div>');

  if ($name.val() === '' || $email.val() === '' || $message.val() === '') {
    $notice.attr('class', 'alert alert-info alert-dismissible');
    $notice.append('<strong>Oops!</strong> Please include your name and email along with your message :)');
  }
  else {
    $notice.removeClass()
    $.post('/contact', {
      name: $name.val(),
      email: $email.val(),
      message: $message.val()
    }, function(success) {
      if (success === true) {
        $notice.attr('class', 'alert alert-success alert-dismissible');
        $notice.append('<strong>Success!</strong> message successfully sent');

        $name.val('');
        $email.val('');
        $message.val('');
      }
      else {
        $notice.attr('class', 'alert alert-warning');
        $notice.append('<strong>Error:</strong> unable to send mail');
      }
    })
  }
  $('#contact-form').before($notice)
});
