import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Config';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
});

// Request Interceptor for logging and auth header injection
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && token !== 'demo-token') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[API Logger] Error reading token from storage:', err);
    }

    console.log('================ [API REQUEST LOG] ================');
    console.log(`[Endpoint]: ${config.baseURL}${config.url}`);
    console.log(`[Method]: ${config.method?.toUpperCase()}`);
    if (config.data) {
      if (config.data.query) {
        console.log(`[Search Query]: "${config.data.query}"`);
      }
      console.log(`[Request Body]:`, JSON.stringify(config.data, null, 2));
    }
    console.log(`[Headers]:`, JSON.stringify(config.headers, null, 2));
    console.log('==================================================');

    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor for logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('================ [API RESPONSE LOG] ================');
    console.log(`[Endpoint]: ${response.config.baseURL}${response.config.url}`);
    console.log(`[Response Status]: ${response.status} ${response.statusText}`);
    console.log(`[Response Data Summary]:`, {
      success: response.data?.success,
      hotelsCount: Array.isArray(response.data?.hotels) ? response.data.hotels.length : undefined,
      message: response.data?.message,
    });
    console.log(`[Response Data Full]:`, JSON.stringify(response.data, null, 2));
    console.log('===================================================');
    return response;
  },
  (error) => {
    console.error('================ [API ERROR LOG] ================');
    console.error(`[Endpoint]: ${error.config?.baseURL}${error.config?.url}`);
    console.error(`[Response Status]: ${error.response?.status || 'NETWORK_ERROR'}`);
    console.error(`[Response Data]:`, JSON.stringify(error.response?.data || error.message, null, 2));
    console.error('=================================================');
    return Promise.reject(error);
  }
);

export default apiClient;
