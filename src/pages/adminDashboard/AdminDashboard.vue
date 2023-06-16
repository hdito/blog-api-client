<script setup lang="ts">
import UserRow from './UserRow.vue'
import { useUsersQuery } from './useUsersQuery'

const { users, usersLoadingStatus } = useUsersQuery()
</script>

<template>
  <LoadingSpinner v-if="usersLoadingStatus === 'loading'" class="m-auto text-2xl" />
  <ErrorWrapper v-else-if="usersLoadingStatus === 'error'">
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
