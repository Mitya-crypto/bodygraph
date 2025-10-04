// Safe Axios wrapper to handle network errors gracefully
import axios, { AxiosError } from 'axios'

// Create axios instance with default config
const safeAxios = axios.create({
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor
safeAxios.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`)
    return config
  },
  (error) => {
    console.warn('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor
safeAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      console.warn('Network error, using fallback data:', error.message)
      // Don't throw error, return a mock response instead
      return Promise.resolve({
        data: { data: [], metadata: { currentOffset: 0, totalCount: 0 } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      })
    }
    
    console.warn('API error:', error.message)
    return Promise.reject(error)
  }
)

export default safeAxios

