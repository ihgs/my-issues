import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'issue-page',
      component: require('@/components/IssuePage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
