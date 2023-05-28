import type { Post } from '@/types/post'
import wretch from 'wretch'

export const blogApi = wretch('http://localhost:3000/api', { mode: 'cors' })

export const fetchPost = (postId: string): Promise<{ post: Post }> =>
  blogApi.get(`/posts/${postId}`).json()
