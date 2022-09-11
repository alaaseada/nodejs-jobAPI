const _email = document.querySelector('#email')
const submit_btn = document.querySelector('#submit-btn')
const info = document.querySelector('#info')
const reset_btn = document.querySelector('#reset-btn')
const new_pass = document.querySelector('#new-password')
const confirm_pass = document.querySelector('#confirm-password')

const clearFields = () => {
  if (_email) _email.value = ''
  info.textContent = ''
  info.classList = []
}

if (submit_btn) {
  submit_btn.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
      const email = _email.value
      const {
        data: { user, token },
      } = await axios.post('/api/v1/users/send-email', { email })
      localStorage.setItem('token', token)
      info.textContent = `Hello, ${user.name}. An email has been sent to ${user.email}.`
      info.className = 'info-msg'
      setTimeout(clearFields, 3000)
    } catch (err) {
      info.textContent = err
      info.className = 'err-msg'
      setTimeout(clearFields, 3000)
    }
  })
}

if (reset_btn) {
  reset_btn.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
      if (new_pass.value !== confirm_pass.value)
        throw new Error('Passwords do not match.')
      const stored_token = localStorage.getItem('token')
      const params = new URLSearchParams(window.location.search)
      const params_token = params.get('token')
      const {
        data: { user },
      } = await axios.patch('/api/v1/users/reset-password', {
        stored_token,
        params_token,
        password: new_pass.value,
      })
      info.textContent = `Welcome, ${user.name}. Your password has been successfuly reset.`
      info.className = 'info-msg'
      setTimeout(clearFields, 3000)
    } catch (err) {
      info.textContent = err
      info.className = 'err-msg'
      setTimeout(clearFields, 3000)
    }
  })
}
