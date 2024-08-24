import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stapi.simplifiedtrade.com/app/v2',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export default api;
