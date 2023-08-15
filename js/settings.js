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
    window.location.href = 'index.html';
  });

  function toggleMode() {
    const isDarkMode = $('body').hasClass('dark-mode');
    $('body').toggleClass('dark-mode', !isDarkMode);
    $('.header').toggleClass('dark-mode', !isDarkMode);
  }
  $('#toggleMode').on('click', toggleMode);

  // var storedUserName = localStorage.getItem("userName");
  // var uNameElement = $("#uName");
  // if (uNameElement.length) {
  //   uNameElement.text(storedUserName);
  // } else {
  //   console.error("#uName element not found.");
  // }
});



