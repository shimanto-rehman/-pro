document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var username = document.getElementById('username');
      var password = document.getElementById('password');
      if (username && password && username.value.trim() && password.value.trim()) {
        window.location.href = 'index.html';
      }
    });
  }

  var forgot = document.getElementById('forgotPassword');
  if (forgot) {
    forgot.addEventListener('click', function (e) {
      e.preventDefault();
      window.alert('Forgot Password functionality would be implemented here!');
    });
  }

  var accessForm = document.getElementById('accessRequestForm');
  if (accessForm) {
    accessForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.alert('Access request submitted. (Demo only)');
    });
  }
});
