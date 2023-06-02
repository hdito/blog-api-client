import { PostSchema } from '@/schemas/postSchema'
import { useUserStore } from '@/userStore'
import { blogApi } from '@/utils/blogApi'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { z } from 'zod'
import { successResponseWrapper } from '../schemas/successResponseWrapper'

export const useMyPosts = () => {
  const userStore = useUserStore()

  const { data: posts, status } = useQuery({
    queryKey: ['my-posts'],
    queryFn: () =>
      blogApi
        .auth(`Bearer ${userStore.userToken}`)
        .get('/posts?type=own')
        .json((data) => {
          const parsedData = successResponseWrapper(z.object({ posts: z.array(PostSchema) })).parse(
            data
          )
          return parsedData.data.posts
        })
  })

  const unpublishedPosts = computed(() => {
    if (!posts.value) return []
    return posts.value.filter((post) => !post.isPublished)
  })
  const publishedPosts = computed(() => {
    if (!posts.value) return []
    return posts.value.filter((post) => post.isPublished)
  })

  return { publishedPosts, unpublishedPosts, status }
}
