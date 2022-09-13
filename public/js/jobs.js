const job_list = document.querySelector('.job-list')
const info = document.querySelector('#info')
const page_msg = document.querySelector('#page-msg')
const page_content = document.querySelector('#page-content')
const add_btn = document.querySelector('#add-btn')
const company_txb = document.querySelector('#company')
const position_txb = document.querySelector('#position')
const token = localStorage.getItem('token')
let isPostBack = false
const headerOptions = {
  headers: { Authorization: `Bearer ${token}` },
}

const showError = (err) => {
  const err_msg = err.response ? err.response.data.msg : err.message
  const status_code = err.response ? err.response.status : err.code
  if (err_msg.includes('unauthorized') || err_msg.includes('expired')) {
    page_msg.className = 'visible'
    page_content.className = 'hidden'
    page_msg.innerHTML = err_msg
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  } else {
    page_msg.className = 'hidden'
    page_content.className = 'visible'
    info.innerHTML = err_msg
    info.className = 'err-msg'
  }
}
const getJobList = async () => {
  try {
    const {
      data: { jobs },
    } = await axios.get('/api/v1/jobs/', headerOptions)
    if (jobs.length === 0) {
      job_list.innerHTML = `<p class="info-msg info">Your job list is still empty</p>`
    } else {
      job_list.innerHTML = ''
      jobs.forEach((job) => {
        job_list.innerHTML += `<div class='job-card'>
        <p class="date">${job.createdAt}</p>
        <p class="position">${job.position}</p>
        <p class="company">${job.company}</p>
        <p class="status">${job.status}</p>
        <a href="#">Edit</a>
        <a href="#">Delete</a>
        </div>`
      })
    }
  } catch (err) {
    showError(err)
  }
}

window.addEventListener('load', async (e) => {
  try {
    if (!token) {
      throw new Error(`You are unauthorized to access this page. Please 
            <a style="text-decoration: underline;" href='/users/login.html'>login</a> first.`)
    }
    if (!isPostBack) {
      getJobList()
      isPostBack = true
    }
  } catch (err) {
    showError(err)
  }
})

add_btn.addEventListener('click', async (e) => {
  e.preventDefault()
  try {
    const { data: job } = await axios.post(
      '/api/v1/jobs/',
      {
        company: company_txb.value,
        position: position_txb.value,
      },
      headerOptions,
    )
    getJobList()
  } catch (err) {
    info.innerHTML = err.response.data.msg
    info.className = 'err-msg'
  }
})
