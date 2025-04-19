import axios from 'axios';

/*
  This axios is configured to logout user when it receives 401 http status code and redirect to login page.
  Code for setting it up is in UserContext, as navigate() needs to be used inside react component.
*/

const axiosWithLogout = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default axiosWithLogout;
