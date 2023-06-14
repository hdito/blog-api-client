<script setup lang="ts">
import UserRow from '@/components/UserRow.vue'
import { successResponseWrapper } from '@/schemas/successResponseWrapper'
import { UserSchema } from '@/schemas/userSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { queryUsersKey } from '@/utils/queryUsersKey'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'

const userStore = useUserStore()

const { data: users, status } = useQuery({
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
</script>

<template>
  <LoadingSpinner v-if="status === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="status === 'error'">
    Error has occured on loading users. Try again later.
  </ErrorWrapper>
  <table v-else class="border-separate border-spacing-2 border-spacing-y-4 md:border-spacing-x-8">
    <thead>
      <tr class="text-left">
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <UserRow v-for="user in users" :key="user._id" :user="user" />
    </tbody>
  </table>
</template>
