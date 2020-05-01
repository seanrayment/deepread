import axios from 'axios'
import process from 'process'

const host = process.env.NODE_ENV === 'production' ? 'https://deepread-backend.herokuapp.com' : 'localhost:8000';
console.log(process.env.NODE_ENV);

const axiosInstance = axios.create({
    baseURL: `${host}/api/`,
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;  
        if (error.response.status === 401 && error.response.statusText === "Unauthorized" && error.response.data.code === "token_not_valid") {
            const refresh_token = localStorage.getItem('refresh_token');

            // make request from a new instance 
            const newInstance = axios.create({
                baseURL: 'http://127.0.0.1:8000/api/',
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            })

            return newInstance
                .post('/token/refresh/', {refresh: refresh_token})
                .then((response) => {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
  
                    axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                    originalRequest.headers['Authorization'] = "JWT " + response.data.access;
  
                    return axiosInstance(originalRequest);                
                })
                .catch(err => {
                  console.log(err)
                  return Promise.reject(error);
                });
            }
            return Promise.reject(error);
    }
);

export default axiosInstance;