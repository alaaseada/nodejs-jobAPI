const job_list = document.querySelector('.job-list');
const info = document.querySelector('#info');

window.addEventListener('load', async (e) => {
  try {
    const token = localStorage.getItem('token');
    if (!token)
      throw new Error(
        'You are unauthorized to access this page. Please login first.'
      );
    const {
      data: { jobs },
    } = await axios.get('/api/v1/jobs/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (jobs.length === 0) {
      job_list.innerHTML = `<p class="info-msg info">Your job list is still empty</p>`;
    }
  } catch (err) {
    info.textContent = err;
    info.className = 'err-msg';
  }
});
