import axios from "axios";
import { useRole } from "../context/RoleContext";


const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers:{"Content-Type":'application/json'}
})

api.interceptors.request.use((req) => {
  const accessToken = sessionStorage.getItem('access_token');
  if (accessToken) {
    req.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return req
}

)
api.interceptors.response.use(
  response => response,
  async (error) => {
    const { role } = useRole()
    const originalRequest = error.config
    const url = role === 'patient' ? 'http://localhost:5000/api/patient/refreshtoken' :'http://localhost:5000/api/doctor/refreshtoken'

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const response = await axios.post(url, {
        token: sessionStorage.getItem('refreshtoken')
        
      })
      if (response.status === 200) {
        const { accessToken } = response.data
        sessionStorage.setItem('access_token', accessToken)
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)

export default api