import axios from 'axios';

const axiosBase = axios.create({
  baseURL: 'http://localhost:5036', // process.env.VUE_APP_API_URL,
  // needed so API serves 401 instead of attempting to redirect to login page
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  // including cookie for auth status
  withCredentials: true
});

export default axiosBase;
