import { createRouter, createWebHistory } from 'vue-router'
import PostsList from './routes/PostsList.vue'
import PostView from './routes/PostView.vue'
import SignInForm from './routes/SignInForm.vue'
import SignUpForm from './routes/SignUpForm.vue'
import MyPosts from './routes/MyPosts.vue'
import PostEditor from './routes/PostEditor.vue'
import PostEditorQueryWrapper from './routes/PostEditorQueryWrapper.vue'
import AdminDashboard from './routes/AdminDashboard.vue'
import { useUserStore } from './userStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PostsList },
    {
      path: '/posts/:postId',
      component: PostView
    },
    { path: '/sign-in', component: SignInForm },
    { path: '/sign-up', component: SignUpForm },
    { path: '/my-posts', component: MyPosts, meta: { requiresAuth: true } },
    { path: '/new-post', component: PostEditor, meta: { requiresAuth: true } },
    { path: '/dashboard', component: AdminDashboard, meta: { requiresAdmin: true } },
    {
      path: '/edit/:postId',
      component: PostEditorQueryWrapper,
      name: 'edit',
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.user) return { path: '/' }
  if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') return { path: '/' }
})

export default router
