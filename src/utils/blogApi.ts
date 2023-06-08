import type { Post } from '@/schemas/postSchema'
import wretch from 'wretch'

export const blogApi = wretch(import.meta.env.VITE_API_URL, { mode: 'cors' })

export const fetchPost = (postId: string): Promise<{ post: Post }> =>
  blogApi.get(`/posts/${postId}`).json()
