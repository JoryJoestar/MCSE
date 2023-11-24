import { createRouter, createWebHistory } from 'vue-router';

import virtualRoutes from 'virtual:generated-pages';

import NProgress from 'nprogress'


// unplugin-pages 自动引入方式
virtualRoutes.push({ path: '/:path(.*)', redirect: '/404' })

const router = createRouter({
  history: createWebHistory(`${import.meta.env.VITE_BASE_URL}`),
  routes: virtualRoutes
});

router.beforeEach((to, from, next) => {
  NProgress.start()
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 如果不支持
  if (!isAppearanceTransition || !event) {
    next()
    return
  }

  if (from.path === '/blog') {
    // @ts-expect-error experimental API
    const transition = document.startViewTransition(() => {
      next()
    })
  } else {

    next()
  }

})

router.afterEach(async (to, from) => {
  await new Promise(resolve => setTimeout(resolve, 100)) // 等待 100 毫秒
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  NProgress.done()
})

// 监听浏览器的后退事件
window.onpopstate = async (event) => {
  if (event.state) {
    await nextTick()
    setTimeout(() => {
      window.scrollTo({
        top: event.state.scroll.top,
        behavior: 'smooth',
      })
    }, 600)
  }

}

export default router 
