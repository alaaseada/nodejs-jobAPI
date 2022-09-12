const user_board = document.querySelector('.user-board');
const welcome = document.querySelector('.welcome');
const login_logout_btn = document.querySelector('#login-logout-btn');

window.addEventListener('load', (e) => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (token && username) {
    welcome.textContent = `Welcome, ${username}!`;
    user_board.classList.add('visible');
    user_board.classList.remove('hidden');
  } else {
    user_board.classList.remove('visible');
    user_board.classList.add('hidden');
  }
});

login_logout_btn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    document.location.href = '/';
  } catch (err) {
    console.log(err);
  }
});
