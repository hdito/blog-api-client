import decode from 'jwt-decode'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserDataSchema, type UserData } from '@/schemas/userDataSchema'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserData | null>(null)
  const userToken = ref<string | null>(null)

  function extractUserFromLocalStorage() {
    const tokenString = localStorage.getItem('token')
    if (!tokenString) {
      user.value = null
      return
    }
    try {
      const decodedToken = decode(tokenString)
      const parsedToken = UserDataSchema.parse(decodedToken)
      user.value = parsedToken
      userToken.value = tokenString
      return
    } catch {
      user.value = null
      userToken.value = null
      return
    }
  }

  function logOut() {
    localStorage.removeItem('token')
    user.value = null
    userToken.value = null
  }

  async function setUser(token: string) {
    try {
      const decodedToken = decode(token)
      const parsedToken = UserDataSchema.parse(decodedToken)
      user.value = parsedToken
      userToken.value = token
      localStorage.setItem('token', token)
    } catch (error) {
      user.value = null
      userToken.value = null
      localStorage.removeItem('token')
      throw new Error('Invalid token')
    }
  }

  return { user, userToken, extractUserFromLocalStorage, logOut, setUser }
})
