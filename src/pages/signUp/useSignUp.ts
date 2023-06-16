import { failResponseWrapper } from '@/schemas/failResponseWrapper'
import { blogApi } from '@/utils/blogApi'
import { useMutation } from '@tanstack/vue-query'
import { computed } from 'vue'
import { z } from 'zod'

export const useSignUp = () => {
  const {
    mutate: signUp,
    status: signUpStatus,
    error: signUpError
  } = useMutation({
    mutationFn: (values: {
      username: string
      email: string
      password: string
      password2: string
    }) => blogApi.url('/sign-up').post(values).res()
  })

  const formServerError = computed(() => {
    if (!signUpError.value) return null
    try {
      return z
        .object({ json: failResponseWrapper(z.array(z.object({ message: z.string() }))) })
        .parse(signUpError.value)
        .json.data.map((error) => error.message)
    } catch {
      return 'Unknown error on sign up. Try again later'
    }
  })

  return { signUp, signUpStatus, formServerError }
}
