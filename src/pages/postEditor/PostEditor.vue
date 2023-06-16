<script setup lang="ts">
import CustomFormField from '@/components/CustomFormField.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { EditorPostSchema } from '@/schemas/formSchemas/editorPostSchema'
import type { Post } from '@/schemas/postSchema'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useSavePostMutation } from './useSavePostMutation'

const props = defineProps<{ post?: Post }>()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(EditorPostSchema),
  initialValues: {
    title: props.post?.title ? props.post.title : '',
    description: props.post?.description ? props.post.description : '',
    content: props.post?.content ? props.post.content : ''
  }
})

const { savePost, savePostStatus } = useSavePostMutation(props.post?._id)

const onSubmit = handleSubmit((values) => {
  savePost(values)
})
</script>

<template>
  <form class="flex flex-1 flex-col gap-4" action="" @submit.prevent="onSubmit">
    <CustomFormField input-type="text" label="Title" name="title" :allow-growth="true" />
    <CustomFormField
      input-type="text"
      label="Description"
      name="description"
      :allow-growth="true"
    />
    <CustomFormField input-type="textarea" label="Content" name="content" :allow-growth="true" />
    <div class="flex items-center gap-4">
      <button
        class="flex h-8 w-16 items-center justify-center rounded-md bg-sky-900 px-4 py-1 text-white hover:shadow-md"
      >
        <LoadingSpinner v-if="savePostStatus === 'loading'" />
        <span v-else>Save</span>
      </button>
      <RouterLink class="rounded-md border border-sky-900 px-2 py-1 hover:shadow-md" to="/my-posts"
        >Cancel</RouterLink
      >
    </div>
  </form>
</template>
