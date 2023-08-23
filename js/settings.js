$(document).ready(function () {
  const signUpButton = $('#signUp');
  const signInButton = $('#signIn');
  const container = $('#container');

  signUpButton.click(function () {
    container.addClass("right-panel-active");
  });

  signInButton.click(function () {
    container.removeClass("right-panel-active");
  });

  var menuicn = $(".menuicn");
  var nav = $(".navcontainer");

  menuicn.click(function () {
    nav.toggleClass("navclose");
  });

  $('#logoutButton').on('click', function () {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.setItem('isLogged', 0);
    window.location.href = '/tieuluanltm';
  });

  function toggleMode() {
    const isDarkMode = $('body').hasClass('dark-mode');
    $('body').toggleClass('dark-mode', !isDarkMode);
    $('#header').toggleClass('dark-mode', !isDarkMode);
  }
  $('#toggleMode').on('click', toggleMode);

  const passwordField = $('#password');
  const showPasswordCheckbox = $('#showPasswordCheckbox');

  showPasswordCheckbox.change(function () {
      if (showPasswordCheckbox.is(':checked')) {
          passwordField.attr('type', 'text');
      } else {
          passwordField.attr('type', 'password');
      }
  });
});



