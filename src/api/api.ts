import axios, { Method } from 'axios';

interface ApiOptions {
  data?: any;
  requestType?: Method;
  endpoint: string;
  token?: string; 
}

export const callApi = async ({ data, requestType = 'GET', endpoint, token }: ApiOptions) => {
  try {
    const API_BASE_URL = 'https://mbms-backend.onrender.com/api';

    let response;
    if (!token) {
      response = await axios({
        method: requestType,
        url: `${API_BASE_URL}${endpoint}`,
        data: requestType !== 'GET' ? data : null,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } else {
      response = await axios({
        method: requestType,
        url: `${API_BASE_URL}${endpoint}`,
        data: requestType !== 'GET' ? data : null,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    }
    return response.data;
  } catch (error) {
    console.error(`Error Calling API endpoint: ${endpoint} eith Error: `, error);
    throw error;
  }
};
