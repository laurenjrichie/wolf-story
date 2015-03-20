$(document).ready(function() {
  titleScroll();
});

function titleScroll() {
  var lastScrollTop = 0;
  $(window).on('scroll', function() {
    var scrollTop = $(this).scrollTop();
    if (scrollTop > lastScrollTop) {
      var currentTitleOpacity = $('#main-title').css('opacity');
      var newTitleOpacity = currentTitleOpacity - 0.03;
      $('#main-title').css('opacity', newTitleOpacity)
      // var currentSubtitleOpacity = $('#main-subtitle').css('opacity');
      // var newSubtitleOpacity = currentSubtitleOpacity + 0.5;
      // $('#main-subtitle').css('opacity', newSubtitleOpacity)
    } 
    
    if (scrollTop < lastScrollTop) {
      var currentTitleOpacity = parseFloat($('#main-title').css('opacity'));
      var newTitleOpacity = (currentTitleOpacity + 0.03);
      console.log(currentTitleOpacity);
      console.log(newTitleOpacity);
      $('#main-title').css('opacity', newTitleOpacity)
    }
    lastScrollTop = scrollTop;
    
  });
}