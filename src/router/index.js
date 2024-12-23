import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserProfile from '../views/UserProfile.vue'
import StorePage from '../views/StorePage.vue'
import SearchPage from '../views/SearchPage.vue'
import Login from '../components/Login.vue'
import MyArticle from '../views/MyArticle.vue'
import ArticleList from '../views/ArticleList.vue'
import {useAuth} from '@/stores/authStore'
import { inject } from 'vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/store',
    name: 'store',
    component: StorePage,
  },
  {
    path: '/user',
    name: 'user',
    component: UserProfile,
    meta: { requiresAuth: false },
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/myarticle',
    name: 'myArticle',
    component: MyArticle,
    meta: { requiresAuth: true },
  },
  {
    path: '/articlelist',
    name: 'articlelist',
    component: ArticleList,
  },
]


const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  router.beforeEach((to, from, next) => {
    const user = useAuth()
    const Swal = inject('$swal');
  
    
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!user.userData || Object.keys(user.userData).length === 0) {
        Swal.fire({
          title: "請先登入！" ,
          icon: "error",
        });
        next({ name: 'home' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
  

export default router
