<script setup lang="ts">
import { SupportedRoleSchema, type SupportedRole } from '@/schemas/supportedRoleSchema'
import type { User } from '@/schemas/userSchema'
import { blogApi } from '@/utils/blogApi'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field } from 'vee-validate'
import { toRefs } from 'vue'
import { z } from 'zod'
import LoadingSpinner from './LoadingSpinner.vue'
import { useUserStore } from '@/userStore'
import { queryUsersKey } from '@/utils/queryUsersKey'

const props = defineProps<{ user: User }>()
const { user } = toRefs(props)

const userStore = useUserStore()
const queryClient = useQueryClient()

const {
  handleSubmit,
  handleReset: onCancel,
  values
} = useForm({
  validationSchema: toTypedSchema(z.object({ role: SupportedRoleSchema })),
  initialValues: { role: user.value.role }
})

const onSubmit = handleSubmit((values) => {
  updateRole(values.role)
})

const { mutate: updateRole, status } = useMutation({
  mutationFn: (role: SupportedRole) =>
    blogApi
      .auth(`Bearer ${userStore.userToken}`)
      .url(`/users/${user.value._id}`)
      .patch({ role })
      .res(),
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryUsersKey.all })
  }
})
</script>

<template>
  <tr>
    <td :class="user._id === userStore.user?.id ? 'font-bold' : ''">
      {{ user.displayName }}
    </td>
    <td :class="user._id === userStore.user?.id ? 'font-bold' : ''">
      {{ user.email }}
    </td>
    <td>
      <span v-if="user._id === userStore.user?.id" class="font-bold">
        {{ user.role }}
      </span>
      <form
        v-else
        action=""
        method="post"
        class="relative flex flex-col items-center gap-4 md:flex-row"
        @submit.prevent="onSubmit"
      >
        <div>
          <div>
            <Field type="radio" name="role" :id="`user-${user._id}`" value="user" class="mr-2" />
            <label :for="`user-${user._id}`">User</label>
          </div>
          <div>
            <Field
              type="radio"
              name="role"
              :id="`author-${user._id}`"
              value="author"
              class="mr-2"
            />
            <label :for="`author-${user._id}`">Author</label>
          </div>
          <div>
            <Field type="radio" name="role" :id="`admin-${user._id}`" value="admin" class="mr-2" />
            <label :for="`admin-${user._id}`">Admin</label>
          </div>
        </div>
        <div
          v-if="values.role !== user.role"
          class="flex flex-col items-center gap-2 md:absolute md:translate-x-full md:flex-row"
        >
          <button
            type="submit"
            class="block w-16 max-w-fit rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
          >
            <LoadingSpinner v-if="status === 'loading'" />
            <template v-else>Save</template>
          </button>
          <button
            type="button"
            @click="onCancel"
            class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </td>
  </tr>
</template>
