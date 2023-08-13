$(document).ready(function() {
    const signUpButton = $('#signUp');
    const signInButton = $('#signIn');
    const container = $('#container');
  
    signUpButton.click(function() {
      container.addClass("right-panel-active");
    });
  
    signInButton.click(function() {
      container.removeClass("right-panel-active");
    });

    var menuicn = $(".menuicn");
    var nav = $(".navcontainer");
  
    menuicn.click(function() {
      nav.toggleClass("navclose");
    });

    $('#logoutButton').on('click', function() {
      localStorage.removeItem('accessToken');
      
      window.location.href = 'index.html';
  });
  });

  
  