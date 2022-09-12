window.addEventListener('load', () => {
  if (localStorage.getItem('token') && localStorage.getItem('username')) {
    window.location.href = '/jobs/dashboard.html';
  }
});
