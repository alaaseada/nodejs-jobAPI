const name_label = document.querySelector('#name-label');
const name_txb = document.querySelector('#name');
const h1 = document.querySelector('#title');
const login_signup_a = document.querySelector('#login-signup-a');
const submit_btn = document.querySelector('#submit-btn');
const form = document.querySelector('#register-login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const name_holder = document.querySelector('#name-holder');
const info = document.querySelector('#info');

const clearFields = () => {
  email.value = password.value = '';
  info.textContent = '';
  info.classList = [];
  const name_txb = document.querySelector('#name');
  if (name_txb) name_txb.value = '';
};

login_signup_a.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.textContent === 'Login') {
    name_holder.innerHTML = '';
    h1.textContent = 'Login';
    submit_btn.textContent = 'Login';
    login_signup_a.textContent = 'Register';
  } else if (e.target.textContent === 'Register') {
    name_holder.innerHTML = `<label id="name-label" for="name">Name: </label>
   <input type="text" name="name" id="name" placeholder="Name" />`;
    h1.textContent = 'Register';
    submit_btn.textContent = 'Register';
    login_signup_a.textContent = 'Login';
  }
  clearFields();
});

submit_btn.addEventListener('click', async (e) => {
  e.preventDefault();
  let url;
  let userObj = {};
  try {
    if (e.target.textContent === 'Login') {
      url = '/api/v1/users/login';
      userObj = {
        email: email.value,
        password: password.value,
      };
    } else if (e.target.textContent === 'Register') {
      url = 'api/v1/users/register';
      userObj = {
        name: document.querySelector('#name').value,
        email: email.value,
        password: password.value,
      };
      console.log(userObj);
    }
    const {
      data: { user, token },
    } = await axios.post(url, userObj);
    info.textContent = `Welcome, ${user.name}!`;
    info.className = 'info-msg';
    setTimeout(clearFields, 3000);
    localStorage.setItem('token', token);
  } catch (err) {
    localStorage.removeItem('token');
    if (err.response) {
      console.log(err.response.data);
      info.textContent = `Error: ${err.response.data.msg}`;
      info.className = 'err-msg';
    } else {
      console.log(err);
    }
    setTimeout(clearFields, 3000);
  }
});
