import { RouteConfig } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'

const swapRoute: RouteConfig[] = [
  {
    path: '/swap',
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: '/',
            name: 'Swap',
            component: () => import('../view/Swap.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/swap'
      }
    ]
  }
]
export default swapRoute
