import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'
import pinia from 'src/stores'
import { useAuthStore } from 'src/stores/auth'

const api = axios.create({ baseURL: process.env.API_BASE_URL })

export default boot(({ app }) => {
  app.use(pinia)
  const authStore = useAuthStore()

  api.interceptors.request.use(
    (config) => {
      const token = authStore.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        authStore.logout()
        Notify.create({
          type: 'negative',
          message: 'Session expired. Please log in again.',
          actions: [
            { label: 'To Login', color: 'white', handler: () => { window.location.reload('/') } }
          ]
        })
      }
      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
