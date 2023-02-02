import LayoutMarketplace from '@/components/layout/nft/Layout.vue'
import StakingView from '../view/StakingView.vue'
import { RouteConfig } from 'vue-router'

const earnRouters: RouteConfig[] = [
  {
    path: '/earn',
    component: LayoutMarketplace,
    children: [
      {
        path: '/',
        name: 'Earn',
        redirect: { name: 'Staking' }
      },
      {
        path: 'staking',
        // name: 'Staking',
        component: StakingView,
        children: [
          {
            path: '/',
            name: 'Staking',
            component: () => import('../components/staking/StakingHome.vue')
          },
          {
            path: ':stakingId',
            name: 'StakingDetail',
            component: () => import('../components/staking/StakingDetail.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/earn'
      }
    ]
  }
]

export default earnRouters
