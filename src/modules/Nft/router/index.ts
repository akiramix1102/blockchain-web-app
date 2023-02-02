import LayoutMarketplace from '@/components/layout/nft/Layout.vue'
import { RouteConfig } from 'vue-router'
import RedirectDownloadApp from '@/modules/marketplace/home/components/RedirectDownloadApp.vue'

const marketplaceRouters: RouteConfig[] = [
  {
    path: '/metamart',
    component: LayoutMarketplace,
    children: [
      {
        path: '/',
        name: 'MarketMain',
        redirect: { name: 'MarketPlace' },
        component: () => import('../view/Home.vue'),
        children: [
          {
            path: '/',
            name: 'MarketPlace',
            component: () => import('../view/MarketPlaceNft.vue')
          },
          {
            path: '/homeCLM',
            name: 'homeCLM',
            component: () => import('../view/MarketPlaceNftCLM.vue')
          },
          // {
          //   path: 'top-collection',
          //   name: 'TopCollection',
          //   component: () => import('../view/TopCollection.vue')
          // },
          {
            // path: 'real-estate/detail/:type/:id',
            path: 'nft/:id',
            name: 'DetailNftItem',
            component: () => import('../view/DetailProjectNFT.vue')
          },
          // {
          //   path: 'category/:id',
          //   name: 'DetailCategory',
          //   component: () => import('../view/DetailCategory.vue')
          // },
          {
            path: 'explore-metamart/:id',
            name: 'DetailCategory',
            component: () => import('../view/ExploreMarketplace.vue')
          },
          {
            path: 'collection/:id',
            name: 'DetailCollection',
            component: () => import('../view/CollectionDetail.vue')
          },
          // {
          //   path: 'download-app',
          //   name: 'Download-app',
          //   component: () => import('../landing/Download-app.vue')
          // },
          {
            path: 'my-profile',
            name: 'MyProfileNft',
            component: () => import('../view/ProfileNft.vue')
          },
          {
            path: 'account/:id',
            name: 'UserProfile',
            component: () => import('../view/ProfileNft.vue')
          }
        ]
      },

      {
        path: '*',
        redirect: '/metamart'
      }
    ]
  },
  {
    path: '/mobile-app/download',
    component: RedirectDownloadApp,
    name: 'download-app'
  }
]

export default marketplaceRouters
