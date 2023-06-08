export const queryPostsKey = {
  all: ['posts'] as const,
  my: ['my-posts'] as const,
  post: (id: string) => [...queryPostsKey.all, id] as const,
  postComments: (id: string) => [...queryPostsKey.all, id, 'comments'] as const
}
