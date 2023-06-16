import { failResponseWrapper } from '@/schemas/failResponseWrapper'
import { signInResponseSchema } from '@/schemas/signInResponseSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useMutation } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { z } from 'zod'

export const useSignIn = () => {
  const router = useRouter()
  const { setUser } = useUserStore()

  const toast = useToast()

  const {
    mutate: signIn,
    status: signInStatus,
    error: signInError
  } = useMutation({
    mutationFn: (
      values:
        | {
            username: string
            password: string
          }
        | {
            email: string
            passwod: string
          }
    ) =>
      blogApi
        .url('/sign-in')
        .post(values)
        .json((response) => {
          const token = signInResponseSchema.parse(response).data.token
          try {
            setUser(token)
            router.push('/')
          } catch {
            toast.error('Unknown error on signing in. Try again later')
          }
        })
  })

  const formServerError = computed(() => {
    if (!signInError.value) return null
    try {
      return z
        .object({ json: failResponseWrapper(z.array(z.object({ message: z.string() }))) })
        .parse(signInError.value)
        .json.data.map((error) => error.message)
    } catch {
      return 'Unknown error on sign in. Try again later'
    }
  })

  return { signIn, signInStatus, formServerError }
}
