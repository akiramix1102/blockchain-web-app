<template>
  <base-popup name="popup-payment-method" class="popup-payment-method" width="400px" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.popup-payment.payment-method') }}</p>
    <div class="content text-desc">
      <div class="text-content">
        <span
          ><p>
            {{ $t('detail-nft.popup-payment.choose-payment') }}
          </p></span
        >
      </div>
      <button class="btn-payment" @click="handleLoginInternal">
        <img v-if="coinMain === 'LYNK'" src="../../../../assets/images/nft/icon-lynkey.png" alt="" />
        <img v-else src="../../../../assets/images/nft/payment-clm.png" alt="" style="width: 32px; height: 32px" />
        <div v-if="coinMain === 'LYNK'" class="name-coin body-base text-semibold text-desc">LynKey</div>
        <div v-else class="name-coin body-base text-semibold text-desc">CleverMe</div>
      </button>
      <button :class="paymentActive === 'METAMASK' ? 'active' : null" class="btn-payment" @click="connectWallet('METAMASK')">
        <base-icon v-if="paymentActive === 'METAMASK'" icon="icon-circle-loading" size="36" class="icon-loading" />
        <img v-else src="../../../../assets/images/nft/icon-meta.png" alt="" />
        <div class="name-coin body-base text-semibold text-desc">MetaMask</div>
      </button>
      <button v-if="isDesktop" :class="paymentActive === 'BINANCE' ? 'active' : null" class="btn-payment" @click="connectBinanceWallet">
        <base-icon v-if="paymentActive === 'BINANCE'" icon="icon-circle-loading" size="36" class="icon-loading" />
        <img v-else src="../../../../assets/images/nft/logo-bnb-wallet.png" alt="" style="width: 28px" />
        <div class="name-coin body-base text-semibold text-desc">Binance Wallet</div>
      </button>

      <button :class="paymentActive === 'TRUST' ? 'active' : null" class="btn-payment" @click="connectWallet('TRUST')" v-if="!isDesktop">
        <base-icon v-if="paymentActive === 'TRUST'" icon="icon-circle-loading" size="36" class="icon-loading" />
        <img v-else src="../../../../assets/images/nft/trust-icon.png" alt="" style="width: 28px" />
        <div class="name-coin body-base text-semibold text-desc">Trust Wallet</div>
      </button>
      <!-- <button class="btn-payment" @click="connectWc">
        <img src="../../../../assets/images/nft/icon-trust.png" alt="" />
        <div class="name-coin body-base text-semibold text-desc">Wallet Connect</div>
      </button> -->

      <!-- <button class="btn-payment" @click="handleLogout">
        <div class="name-coin body-base text-semibold text-desc" style="padding-left: 28px">Logout</div>
      </button>
      <button class="btn-payment" @click="handleBuy">
        <div class="name-coin body-base text-semibold text-desc" style="padding-left: 28px">Buy</div>
      </button>
      <button class="btn-payment" @click="getBalance">
        <div class="name-coin body-base text-semibold text-desc" style="padding-left: 28px">Get blance</div>
      </button>
      <button class="btn-payment" @click="addToken">
        <div class="name-coin body-base text-semibold text-desc" style="padding-left: 28px">Add Token LYNK</div>
      </button> -->
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import { namespace } from 'vuex-class'

  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  const apiAuth: AuthRepository = getRepository('auth')

  import Moralis from 'moralis'

  import Web3 from 'web3'

  import filter from 'lodash/filter'
  import { AuthRepository } from '@/services/repositories/auth'

  import WalletConnectProvider from '@walletconnect/web3-provider'

  @Component({
    components: {}
  })
  export default class PopupPaymentMethod extends Mixins(PopupMixin, OnChainMixin) {
    @bcAuth.Action('logout') logout!: (status?: boolean) => Promise<any>
    @bcAuth.Mutation('SET_INFO') setInfo!: (info: Record<string, any>) => Promise<any>
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('typeAction') typeAction!: string
    address = ''
    web3Provider: any = null
    paymentActive = ''

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.nftItem.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    async created(): Promise<void> {
      // Moralis.start({ serverUrl, appId })
      // const user = Moralis.User.current()
      // if (user) {
      //   this.setWalletAddress(user.get('ethAddress'))
      // }
      //@ts-ignore
      if (window && window.ethereum) {
        //@ts-ignore
        // window.ethereum.on('accountsChanged', () => {
        //   if (this.walletAddress) {
        //     this.setWalletAddress('')
        //     Moralis.User.logOut()
        //     this.logout(false)
        //   } else {
        //     window.location.reload()
        //   }
        // })
      }
      // const unsubscribe = Moralis.onAccountChanged(chain => {
      //   console.log(chain)
      // })
      // unsubscribe()
    }
    // async handleOpen(): Promise<void> {
    //   Moralis.start({ serverUrl, appId })
    //   this.user = Moralis.User.current()
    // }
    async addToken(): Promise<void> {
      try {
        await Moralis.enableWeb3()
        //@ts-ignore
        if (window.ethereum) {
          //@ts-ignore
          await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: '0xa1b3eDF096F8A1e2345a6B121Cb100A8fB3e54a2', // The address that the token is at.
                symbol: 'LYNK1', // A ticker symbol or shorthand, up to 5 chars.
                decimals: 8, // The number of decimals in the token
                image: '' // A string url of the token logo
              }
            }
          })
          // await this.getBalance()
        }
        return Promise.resolve()
      } catch (error) {
        return Promise.reject()
      }
    }

    async connectWallet(type: 'METAMASK' | 'TRUST'): Promise<void> {
      try {
        //@ts-ignore
        if (!this.isDesktop && !window.ethereum) {
          const a = document.createElement('a')
          if (this.nftItem?.id) {
            a.style.display = 'none'
            const path = `/metamart/nft/${this.nftItem.id}`
            if (type === 'METAMASK') {
              a.href = `https://metamask.app.link/dapp/${location.host}${path}`
            } else {
              a.href = `https://link.trustwallet.com/open_url?coin_id=60&url=${location.origin}${path}`
            }
          } else {
            if (type === 'METAMASK') {
              a.href = `https://metamask.app.link/dapp/${location.host}/metamart`
            } else {
              a.href = `https://link.trustwallet.com/open_url?coin_id=60&url=${location.origin}/metamart`
            }
          }
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          return
        }
        this.paymentActive = type

        await Moralis.enableWeb3()
        //@ts-ignore
        let user: any = Moralis.User.current()

        if (!user) {
          user = await Moralis.authenticate({
            signingMessage: 'Log in Metamask'
          }).then(async user => {
            this.address = user.get('ethAddress')
            console.log('login metamask')
            const nonce = await apiAuth.getNonce({ address: this.address })
            await this.handleLoginExternal(nonce.nonce, type)
          })
        } else {
          await Moralis.User.logOut()
          this.connectWallet(type)
        }
      } catch (error: any) {
        this.paymentActive = ''
        if (error.message === 'Non ethereum enabled browser') {
          let message = this.$t('notify.install-metamask') as string
          this.$message.error({ message, duration: 5000 })
        }
      }
    }

    async connectBinanceWallet(): Promise<void> {
      try {
        if (!window.BinanceChain) {
          let message = this.$t('notify.install-binance') as string
          this.$message.error({ message, duration: 5000 })
          return
        }

        this.paymentActive = 'BINANCE'
        const BinanceChain = window.BinanceChain

        // const account: Array<Record<string, any>> = await BinanceChain.requestAccounts()
        // console.log('account', account)

        const account = await BinanceChain.enable()
        this.address = account[0]

        const nonce = await apiAuth.getNonce({ address: this.address })
        await this.handleLoginExternal(nonce.nonce, 'BINANCE')
      } catch (error) {
        this.paymentActive = ''
        return Promise.reject(error)
      }
    }

    async handleLoginExternal(nonce: string, walletType: 'METAMASK' | 'TRUST' | 'BINANCE'): Promise<void> {
      try {
        // const KEY = '_beEdU@@secretKEY_2022'
        // const credential = this.$options.filters?.encryptPassword(md5(this.address + KEY))

        //@ts-ignore
        const web3 = walletType === 'METAMASK' || walletType === 'TRUST' ? new Web3(window.ethereum) : new Web3(window.BinanceChain)

        const signature = await web3!.eth.personal.sign(`Login External Wallet ${nonce}`, this.address, '')
        const body = {
          address: this.address,
          signature,
          walletType
        }
        const result = await apiAuth.loginExternalWallet(body)
        this.setWalletAddress(this.address)
        if (this.isDesktop) {
          this.setTokenExternalLogin({ ...result, type: walletType })
        } else {
          this.setTokenExternalLoginMobile({ ...result, type: walletType })
        }
        window.localStorage.setItem('isOpenBannerAds', 'YES')
        location.reload()
        // const info = await apiNft.getInfoExternalUser()
        // this.setInfo(info.data)
        return Promise.resolve()
      } catch (error) {
        this.paymentActive = ''
        if (nonce && (walletType === 'METAMASK' || walletType === 'TRUST')) {
          Moralis.User.logOut()
        }
        return Promise.reject()
      }
    }

    async handleLogout(): Promise<void> {
      await Moralis.User.logOut()
    }

    handleClose(): void {
      this.paymentActive = ''
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-payment-method',
        isOpen: false
      })
    }
    handleLoginInternal(): void {
      if (this.nftItem?.id) {
        const detail = {
          isBack: 'nft',
          id: this.nftItem.id! as string,
          name: 'DetailNftItem'
        }
        this.$router.push({
          name: 'login',
          query: { ...detail }
        })
      } else {
        this.$router.push({
          name: 'login'
        })
      }

      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
    }

    provider!: WalletConnectProvider

    // kết nối ở mobile
    async connectWc(): Promise<void> {
      try {
        console.log('connectWc')

        //  Create WalletConnect Provider
        this.provider = await this.enableWeb3Provider()

        //  Enable session (triggers QR Code modal)
        const result = await this.provider.enable()
        const address = result[0]
        console.log('address', result[0])

        const nonce = await apiAuth.getNonce({ address })
        console.log('nonce', nonce.nonce)

        //@ts-ignore
        const web3 = new Web3(this.provider)

        const signature = await web3!.eth.personal.sign(`Login External Wallet ${nonce.nonce}`, address, '')
        const body = {
          address,
          signature,
          walletType: 'METAMASK'
        }
        const rs = await apiAuth.loginExternalWallet(body)
        console.log('lay token')

        this.setTokenExternalLogin(rs)
        window.localStorage.setItem('isOpenBannerAds', 'YES')
        location.reload()
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    .text-content {
      padding-bottom: 24px;
      p {
        font-size: 16px;
        line-height: 24px;
        word-break: break-word;
      }
    }
  }
  //   .btn-payment {
  //     background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%) !important;
  //     .name-coin {
  //       color: #fff !important;
  //     }
  //   }

  .btn-payment {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dbdbdb;
    outline: none;
    border-radius: 6px;
    padding-left: 12px;
    padding-right: 12px;
    background: #ffffff;
    margin-bottom: 12px;
    position: relative;
    cursor: pointer;
    .name-coin {
      margin: 0 auto;
    }
    &:hover {
      background: var(--bc-theme-primary-gradient-hover) !important;
      .name-coin {
        color: #fff !important;
      }
    }
    &:last-child {
      margin-bottom: 24px;
    }
    img,
    .icon-loading {
      position: absolute;
      left: 1rem;
    }
  }
  .active {
    .icon-loading {
      display: inline-flex;
      -webkit-animation: spin 2s linear infinite; /* Safari */
      animation: spin 2s linear infinite;
    }
    @-webkit-keyframes spin {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-payment-method {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
        }
        .text-content {
          padding-bottom: 16px;
          p {
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
          }
        }
      }
    }
  }
</style>
