$('#portfolio').imagesLoaded(function() {
  $('#portfolio').masonry({
    itemSelector: '.item',
    columnWidth: 360,
    gutter: 20,
    fitWidth: true
  });
});
