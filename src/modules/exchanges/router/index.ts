import { RouteConfig } from 'vue-router'
import LayoutExchange from '@/components/layout/exchange/LayoutExchange.vue'
import Exchange from '@/modules/exchanges/view/Exchange.vue'

// @ts-ignore
const exchangeRoute: RouteConfig[] = [
  {
    path: '/trade/:exchange',
    component: LayoutExchange,
    children: [
      {
        path: '/',
        name: 'Exchange',
        components: {
          default: () => import('../view/Exchange.vue')
        },
        props: route => ({ query: route.query.q })
      },
      {
        path: '*',
        redirect: '/trade/BITCOIN_USDT?theme=dark&type=spot'
      }
    ]
  }
]
export default exchangeRoute
