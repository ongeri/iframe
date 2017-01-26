$('.card').on('click', function() {
  $('.card').removeClass('active');
  $(this).addClass('active');
  $('.form').stop().slideUp();
  $('.form').delay(300).slideDown();
});