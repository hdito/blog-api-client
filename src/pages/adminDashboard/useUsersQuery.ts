import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { UserSchema } from '@/schemas/userSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryUsersKey } from '@/utils/queryUsersKey'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'

export const useUsersQuery = () => {
  const userStore = useUserStore()
  const { data: users, status: usersLoadingStatus } = useQuery({
    queryFn: () =>
      blogApi
        .auth(`Bearer ${userStore.userToken}`)
        .get('/users')
        .json((data) => {
          return successResponseWrapper(z.object({ users: z.array(UserSchema) })).parse(data).data
            .users
        }),
    queryKey: queryUsersKey.all
  })

  return { users, usersLoadingStatus }
}
