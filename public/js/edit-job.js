const save_btn = document.querySelector('#save-btn');
const token = localStorage.getItem('token');
const info = document.querySelector('#info');
const page_msg = document.querySelector('#page-msg');
const page_content = document.querySelector('#page-content');
const status_select = document.querySelector('#status');
const company_txb = document.querySelector('#company');
const position_txb = document.querySelector('#position');
const isPostBack = false;
const qs = window.location.search.slice(1);
let params = new URLSearchParams(`${qs}`);
const jobId = params.get('id');
const headerOptions = {
  headers: { Authorization: `Bearer ${token}` },
};

const clearFields = () => {
  company_txb.value = '';
  position_txb.value = '';
  info.innerHTML = '';
  info.className = '';
};

const showError = (err) => {
  const err_msg = err.response
    ? err.response.data.msg.toLowerCase()
    : err.message.toLowerCase();
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

window.addEventListener('load', async (e) => {
  try {
    if (!token) {
      throw new Error(`You are unauthorized to access this page. Please 
            <a style="text-decoration: underline;" href='/users/login.html'>login</a> first.`);
    }
    const {
      data: { job },
    } = await axios.get(`/api/v1/jobs/${jobId}`, headerOptions);
    company_txb.value = job.company;
    position_txb.value = job.position;
    status_select.value = job.status;
  } catch (err) {
    showError(err);
  }
});

save_btn.addEventListener('click', async (e) => {
  try {
    e.preventDefault();
    const job = await axios.patch(
      `/api/v1/jobs/${jobId}`,
      {
        company: company_txb.value,
        position: position_txb.value,
        status: status_select.value,
      },
      headerOptions
    );
    showMsg(`You job has been successfully updated`);
  } catch (err) {
    showError(err);
  }
});
