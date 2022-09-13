const job_list = document.querySelector('.job-list');
const info = document.querySelector('#info');
const page_msg = document.querySelector('#page-msg');
const page_content = document.querySelector('#page-content');
const add_btn = document.querySelector('#add-btn');
const company_txb = document.querySelector('#company');
const position_txb = document.querySelector('#position');
const token = localStorage.getItem('token');
let isPostBack = false;

const showError = (err) => {
  if (err.message.includes('unauthorized')) {
    page_msg.className = 'visible';
    page_content.className = 'hidden';
    page_msg.innerHTML = err;
  } else {
    page_msg.className = 'hidden';
    page_content.className = 'visible';
    info.innerHTML = err;
    info.className = 'err-msg';
  }
};
const getJobList = async () => {
  try {
    const {
      data: { jobs },
    } = await axios.get('/api/v1/jobs/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (jobs.length === 0) {
      job_list.innerHTML = `<p class="info-msg info">Your job list is still empty</p>`;
    } else {
      for (var job in jobs) {
        console.log(job);
      }
    }
  } catch (err) {
    showError(err);
  }
};

window.addEventListener('load', async (e) => {
  try {
    if (!token)
      throw new Error(
        `You are unauthorized to access this page. Please 
            <a style="text-decoration: underline;" href='/users/login.html'>login</a> first.`
      );
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
    console.log('I am going to add a new job');
    const { data: job } = await axios.post('/api/v1/jobs/', {
      company: company_txb.value,
      position: position_txb.value,
    });
    console.log('I came after insertion');
    getJobList();
  } catch (err) {
    info.innerHTML = err;
    info.className = 'err-msg';
  }
});
