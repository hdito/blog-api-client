<script setup lang="ts">
import PostCommentsForm from './PostCommentsForm.vue'
import PostCommentsList from './PostCommentsList.vue'
</script>

<template>
  <div class="mt-8 flex flex-col gap-4">
    <h3 class="text-2xl font-bold">Comments</h3>
    <PostCommentsForm />
    <PostCommentsList />
  </div>
</template>
