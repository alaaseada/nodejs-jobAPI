const job_list = document.querySelector('.job-list');
const add_btn = document.querySelector('#add-btn');
const company_txb = document.querySelector('#company');
const position_txb = document.querySelector('#position');
const token = localStorage.getItem('token');
const info = document.querySelector('#info');
const page_msg = document.querySelector('#page-msg');
const page_content = document.querySelector('#page-content');
let isPostBack = false;
const headerOptions = {
  headers: { Authorization: `Bearer ${token}` },
};
const months = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

const clearFields = () => {
  company_txb.value = '';
  position_txb.value = '';
  info.innerHTML = '';
  info.className = '';
};

const showError = (err) => {
  const err_msg = err.response ? err.response.data.msg : err.message;
  const status_code = err.response ? err.response.status : err.code;
  if (err_msg.includes('unauthorized') || err_msg.includes('expired')) {
    page_msg.className = 'visible';
    page_content.className = 'hidden';
    page_msg.innerHTML = err_msg;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    user_board.classList.remove('visible');
    user_board.classList.add('hidden');
  } else {
    user_board.classList.remove('hidden');
    user_board.classList.add('visible');
    page_msg.className = 'hidden';
    page_content.className = 'visible';
    info.innerHTML = err_msg;
    info.className = 'err-msg';
  }
  setTimeout(clearFields, 3000);
};

const showMsg = (msg) => {
  page_msg.className = 'hidden';
  page_content.className = 'visible';
  info.innerHTML = msg;
  info.className = 'info-msg';
  setTimeout(clearFields, 3000);
};

const getJobList = async () => {
  try {
    const {
      data: { jobs },
    } = await axios.get('/api/v1/jobs/', headerOptions);
    if (jobs.length === 0) {
      job_list.innerHTML = `<p class="info-msg info">Your job list is still empty</p>`;
    } else {
      job_list.innerHTML = '';
      jobs.forEach((job) => {
        let date = new Date(job.lastModified);
        date =
          months[date.getMonth()] +
          ' ' +
          date.getDay() +
          ' ' +
          date.getFullYear();
        job_list.innerHTML += `<div class='job-card'>
        <p class="date">${date}</p>
        <p class="position">${job.position}</p>
        <p class="company">${job.company}</p>
        <a href="edit.html?id=${job._id}" class='edit-btn'>Edit</a>
        <a href="#" class='del-btn' data-id=${job._id}>Delete</a>
        <p class="status">${job.status.toUpperCase()}</p>
        </div>`;
      });
    }
  } catch (err) {
    showError(err);
  }
};

window.addEventListener('load', async (e) => {
  try {
    if (!token) {
      throw new Error(`You are unauthorized to access this page. Please 
            <a style="text-decoration: underline;" href='/users/login.html'>login</a> first.`);
    }
    if (!isPostBack) {
      getJobList();
      isPostBack = true;
    }
  } catch (err) {
    showError(err);
  }
});

add_btn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const { data: job } = await axios.post(
      '/api/v1/jobs/',
      {
        company: company_txb.value,
        position: position_txb.value,
      },
      headerOptions
    );
    showMsg('The job has been successfully added.');
    getJobList();
  } catch (err) {
    showError(err);
  }
});

job_list.addEventListener('click', async (e) => {
  try {
    if (e.target.className === 'del-btn') {
      e.preventDefault();
      const id = e.target.dataset.id;
      const {
        data: { job },
      } = await axios.delete(`/api/v1/jobs/${id}`, headerOptions);
      getJobList();
    }
  } catch (err) {
    showError(err);
  }
});
