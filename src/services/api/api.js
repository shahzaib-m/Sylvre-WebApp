import axios from 'axios';

export default axios.create({
    baseURL: process.env.VUE_APP_SYLVRE_API_URL,
    withCredentials: true,
    timeout: 2500
});