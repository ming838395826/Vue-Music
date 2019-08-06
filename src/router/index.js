import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Rank from 'components/rank/Rank'
import Recommend from 'components/Recommend/recommend'
import Search from 'components/Search/search'
import Singer from 'components/Singer/singer'
import SingerDetail from 'components/Singer-detail/Singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
		{
		  path: '/',
		  redirect: '/recommend'
		},
    {
      path: '/rank',
      component: Rank
    },
		{
		  path: '/recommend',
		  component: Recommend
		},
		{
		  path: '/search',
		  component: Search
		},
		{
		  path: '/singer',
		  component: Singer,
      children:[
          {
            path:":id",
            component: SingerDetail
          }
      ]

		}
  ]
})
