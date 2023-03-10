<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Mixins } from 'vue-property-decorator'
  import getRepository from '@/services'
  import ParamsRepository from '@/services/repositories/params'
  import { namespace } from 'vuex-class'

  import Moralis from 'moralis'
  import Cookies from 'js-cookie'

  import OnChainMixin from '@/mixins/onchain'

  const serverUrl = process.env.VUE_APP_KEY_SERVER_URL_MORALIS || ''
  const appId = process.env.VUE_APP_KEY_APPID_MORALIS || ''

  const apiParams: ParamsRepository = getRepository('params')
  const beBase = namespace('beBase')
  const bcAuth = namespace('beAuth')

  @Component({
    components: {}
  })
  export default class App extends Mixins(OnChainMixin) {
    @beBase.Action('setSystemParams') setSystemParams!: (data: Record<string, any>) => void
    @beBase.Action('setConfigModule') setConfigModule!: (data: Record<string, any>) => void
    @bcAuth.Action('logout') logout!: (status?: boolean) => Promise<any>
    @bcAuth.Mutation('SET_INFO') setInfo!: (info: Record<string, any>) => Promise<any>

    async created(): Promise<void> {
      Moralis.start({ serverUrl, appId })

      // check xem đang dùng ví gì
      const walletType = Cookies.get('type_login')
      const isLogin = Cookies.get('access_token')

      if (walletType && isLogin) {
        if (walletType === 'METAMASK' || walletType === 'TRUST') {
          const user = Moralis.User.current()
          if (user) {
            this.setWalletAddress(user.get('ethAddress'))
            // check user thay đổi tài khoản
            window.ethereum.on('accountsChanged', async () => {
              console.log('accountsChanges')
              await Moralis.User.logOut()
              await this.logout(false)
              this.setWalletAddress('')
              this.setInfo({})
              this.$router.push({ name: 'MarketMain' }).catch()

              if (window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', () => {
                  console.log('remove')
                })
              }
              location.reload()
            })
          } else {
            this.setWalletAddress('')
          }
        }

        if (walletType === 'BINANCE') {
          const user = await window.BinanceChain.enable()
          if (user[0]) {
            this.setWalletAddress(user[0])
            window.BinanceChain.on('accountsChanged', async () => {
              await this.logout(true)
              this.setWalletAddress('')
              this.setInfo({})
              this.$router.push({ name: 'MarketMain' }).catch()
              if (window.BinanceChain.removeListener) {
                window.BinanceChain.removeListener('accountsChanged', () => {
                  console.log('remove')
                })
              }
              location.reload()
            })
          } else {
            this.setWalletAddress('')
          }
        }
      }

      apiParams.getPramsHeader().then(res => {
        this.setSystemParams(res)
      })

      const language = window.localStorage.getItem('bc-lang')
      if (!language) {
        window.localStorage.setItem('bc-lang', 'en')
      }
      // if (language === 'vi') {
      //   window.localStorage.setItem('bc-lang', 'en')
      //   location.reload()
      // }
      // window.localStorage.setItem('bc-lang', 'en')
    }
  }
</script>

<style lang="scss">
  // @import url('./accets/styles/index.scss');
</style>
