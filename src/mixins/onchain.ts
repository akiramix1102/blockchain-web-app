import { Component, Mixins } from 'vue-property-decorator'
import PopupMixin from '@/mixins/popup'

import { namespace } from 'vuex-class'

const bcAuth = namespace('beAuth')
const bcNft = namespace('bcNft')
const beBase = namespace('beBase')

import getRepository from '@/services/index'
import NftRepository from '@/services/repositories/nft'
import NftRepositoryV2 from '@/services/repositories/nftv2'
import NftRepositoryV3 from '@/services/repositories/nftv3'
const apiNft: NftRepository = getRepository('nft')
const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
const apiNftV3: NftRepositoryV3 = getRepository('nftv3')

import Moralis from 'moralis'
import firebase from '@/utils/firebase'

import md5 from 'md5'
import Cookies from 'js-cookie'
import filter from 'lodash/filter'

import includes from 'lodash/includes'

import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
import Decimal from 'decimal.js'

import BUSD_ABI from '@/utils/abi/BusdAbi.js'
import CLM_ABI from '@/utils/abi/ClmAbi.js'
import LYNK_ABI from '@/utils/abi/LynkAbi.js'
import USDC_ABI from '@/utils/abi/UsdcAbi.js'
import USDT_ABI from '@/utils/abi/UsdtAbi.js'
import NFT_ETH_ABI from '@/utils/abi/NftEthAbi.js'
import NFT_BNB_ABI from '@/utils/abi/NftBnbAbi.js'

@Component({
  components: {}
})
export default class OnChainMixin extends Mixins(PopupMixin) {
  [x: string]: any
  @bcAuth.Action('setTokenExternalLogin') setTokenExternalLogin!: (data: Record<string, any>) => void
  @bcAuth.Action('setTokenExternalLoginMobile') setTokenExternalLoginMobile!: (data: Record<string, any>) => void
  @bcAuth.Action('logout') logout!: (status?: boolean) => Promise<any>
  @bcAuth.Getter('isLogin') isLogin!: boolean
  @bcAuth.Mutation('SET_WALLET_ADDRESS') setWalletAddress!: (address: string) => void
  @bcAuth.State('typeLogin') typeLogin!: string

  @bcNft.Action('setInfoActivity') setInfoActivity!: (info: Record<string, any>) => void
  @bcAuth.State('walletAddress') walletAddress!: string
  @bcAuth.State('user') user!: Record<string, any>
  @bcNft.State('listNftAsset') listNftAssetOnChain!: Array<Record<string, any>>
  @bcNft.State('statusApproveAccount') statusApproveAccount!: string
  @bcNft.Mutation('SET_TYPE_OF_ACTION') setTypeOfAction!: (type: string) => void
  @bcNft.State('listAssetNetwork') listAssetNetwork!: Array<Record<string, any>>
  @bcNft.State('currencySelectBuy') currencySelectBuy!: string

  @bcNft.Mutation('SET_IS_ALREADY_APPROVE') setStatusAlreadyApprove!: (status: boolean) => void
  @bcNft.Mutation('SET_STATUS_APPROVE_ITEM') setStatusApproveItem!: (status: string) => void
  @bcNft.Mutation('SET_TRANSACTION_CODE_ITEM') setTransactionCodeItem!: (code: string) => void
  @bcNft.State('listAcceptCurrency') listAcceptCurrency!: Array<Record<string, any>>
  @bcNft.State('listAcceptCurrencyBuy') listAcceptCurrencyBuy!: Array<Record<string, any>>
  @bcNft.State('tokenNeedGetBalance') tokenNeedGetBalance!: string
  @bcNft.State('isDesktop') isDesktop!: boolean
  @bcNft.State('providerWc') providerWc!: WalletConnectProvider
  @bcNft.Mutation('SET_PROVIDER_WALLET_CONNECT') setProviderWalletConnect!: (provider: WalletConnectProvider) => void
  @bcNft.Mutation('SET_STATUS_APPROVE_ACCOUNT') setStatusApproveAccount!: (status: string) => void

  // khi lần đầu approve, sẽ watch thay đổi status + check thêm dkien isAlreadyApprove
  @bcNft.State('isAlreadyApprove') isAlreadyApprove!: boolean

  @beBase.State('coinMain') coinMain!: string
  @bcAuth.Getter('isShowCheckboxAccept') isShowCheckboxAccept!: boolean

  address = ''
  refApproveAccount: any = null

  isLoading = false
  isOpenPopup = false
  isClickConfirm = false

  chaiId = ''

  checkedAccept = false

  //term cac popup
  get getTerm(): string {
    if (this.systemParamsPublic.length) {
      const param = filter(this.systemParamsPublic, param => param.key === 'system.marketplace.terms.and.conditions')
      return (param[0] && param[0].value) || ''
    }
    return ''
  }

  get contractAddressExchange(): string {
    if (!this.isLogin) {
      const contract = filter(this.listNftAssetOnChain, elm => elm.type === 'EXCHANGE' && elm.isSystem && elm.baseCurrency === this.nftItem.baseCurrency)
      return contract.length ? contract[0].contractAddress : ''
    }
    return ''
  }

  async validateCurrentUser(): Promise<void> {
    try {
      const provider = this.typeLogin === 'BINANCE' ? window.BinanceChain : window.ethereum
      const currentWallet = (await provider.request({ method: 'eth_accounts' })) as string[]
      const isValid = this.walletAddress.toLowerCase() === currentWallet[0].toLowerCase()
      if (isValid) {
        return Promise.resolve()
      } else {
        const message = this.$t('notify_incorrect-wallet-address') as string
        this.$message.error({ message, duration: 5000 })
        setTimeout(async () => {
          if (this.typeLogin === 'METAMASK' || this.typeLogin === 'TRUST') {
            await Moralis.User.logOut()
          }
          await this.logout(true)
          this.$router.push({ name: 'MarketPlace' }).catch()
          location.reload()
        }, 2000)
        return Promise.reject()
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getAbiCode(currency: string): Promise<any> {
    try {
      const objAbi = {
        USDC: USDC_ABI,
        USDT: USDT_ABI,
        CLM: CLM_ABI,
        LYNK: LYNK_ABI,
        BUSD: BUSD_ABI
      }
      return Promise.resolve(objAbi[currency])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getAbiCodeNft(currency: string): Promise<any> {
    try {
      const abi = includes(['USDC', 'USDT', 'CLM', 'LYNK', 'ETH'], currency) ? NFT_ETH_ABI : NFT_BNB_ABI
      return Promise.resolve(abi)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getBalanceBinanceWallet(currency: string): Promise<number> {
    try {
      const baseCurrency = includes(['USDC', 'CLM', 'LYNK', 'ETH'], currency) ? 'ETH' : 'BNB'

      await this.switchNetwork(baseCurrency)
      const BinanceChain = window.BinanceChain

      if (currency === 'BNB' || currency === 'ETH') {
        const params = [this.walletAddress]
        const balance = await BinanceChain.request({
          method: 'eth_getBalance',
          params
        })
        return Promise.resolve(Number(balance) / Math.pow(10, 18))
      } else {
        const web3 = new Web3(BinanceChain)

        const contractAddress = this.getContractAddressOfCurrency(currency)

        const abi = await this.getAbiCode(currency)

        const NameContract = new web3.eth.Contract(abi, contractAddress)
        console.log('NameContract', NameContract)

        const balance = await NameContract.methods.balanceOf(this.walletAddress).call()
        console.log('balance', balance)

        return Promise.resolve(Number(balance) / Math.pow(10, 18))
      }
    } catch (error) {
      console.log('a', error)

      return Promise.reject(error)
    }
  }

  async getBalance(currency: string): Promise<number> {
    try {
      const baseCurrency = includes(['BNB', 'BUSD', 'USDT'], currency) ? 'BNB' : 'ETH'
      await this.switchNetwork(baseCurrency)

      if (currency === 'BNB' || currency === 'ETH') {
        const provider = this.typeLogin === 'BINANCE' ? window.BinanceChain : window.ethereum
        const params = [this.walletAddress, 'latest']
        const balance = await provider.request({
          method: 'eth_getBalance',
          params
        })
        return Promise.resolve(Number(balance) / Math.pow(10, 18))
      } else {
        const web3 = this.typeLogin === 'BINANCE' ? new Web3(window.BinanceChain) : new Web3(window.ethereum)

        const contractAddress = this.getContractAddressOfCurrency(currency)

        const abi = await this.getAbiCode(currency)

        const NameContract = new web3.eth.Contract(abi, contractAddress)

        const balance = await NameContract.methods.balanceOf(this.walletAddress).call()
        console.log('balance', balance)

        const decimal = this.$options.filters?.getDecimalsToken(currency)

        return Promise.resolve(Number(balance) / Math.pow(10, decimal))
      }

      // if (this.typeLogin === 'BINANCE') {
      //   return await this.getBalanceBinanceWallet(currency)
      // } else {
      //   const networkName = includes(['USDC', 'USDT', 'CLM', 'LYNK', 'ETH'], currency) ? process.env.VUE_APP_NETWORK_NAME_ETH : process.env.VUE_APP_NETWORK_NAME_BNB
      //   await Moralis.enableWeb3()
      //   if (currency === 'ETH' || currency === 'BNB') {
      //     const options = {
      //       chain: networkName,
      //       address: this.walletAddress
      //     }
      //     //@ts-ignore
      //     const balance = await Moralis.Web3API.account.getNativeBalance(options)
      //     return Promise.resolve(Number(Moralis.Units.FromWei(balance.balance)))
      //   }

      //   const options = {
      //     chain: networkName,
      //     address: this.walletAddress
      //   }
      //   //@ts-ignore
      //   const resultAll = await Moralis.Web3API.account.getTokenBalances(options)

      //   const token = filter(resultAll, elm => elm.token_address === contractAddress.toLowerCase())

      //   if (token.length) {
      //     return Promise.resolve(Number(token[0].balance) / Math.pow(10, Number(token[0].decimals)))
      //   }
      //   return Promise.resolve(0)
      // }

      // if (currency === 'ETH' || currency === 'BNB') {
      //   const options = {
      //     chain: 'ropsten',
      //     address: this.walletAddress
      //   }
      //   //@ts-ignore
      //   const balance = await Moralis.Web3API.account.getNativeBalance(options)
      //   return Number(Moralis.Units.FromWei(balance.balance))
      // } else {
      //   const abi = await this.getAbiCode(contractAddress, currency)

      //   const functionBalanceOf = filter(abi, elm => elm.name === 'balanceOf')[0]
      //   const nameParamsBalanceOf = functionBalanceOf.inputs[0].name

      //   const params = { [nameParamsBalanceOf]: this.walletAddress }
      //   const readOptions = {
      //     contractAddress,
      //     functionName: 'balanceOf',
      //     abi,
      //     params
      //   }
      //   console.log('readOptions', readOptions)

      //   const balances = await Moralis.executeFunction(readOptions)

      //   const decimal = this.$options.filters?.getDecimalsToken(currency)
      //   console.log('balances', (balances['_hex'], 16) / Math.pow(10, decimal))
      //   return parseInt(balances['_hex'], 16) / Math.pow(10, decimal)
      // }
    } catch (error: any) {
      if (error.message === 'Non ethereum enabled browser') {
        const message = this.$t('notify.install-metamask') as string
        this.$message.error({ message, duration: 5000 })
      }
      return Promise.reject(error)
    }
  }

  async actionWhenLogged(itemNft: Record<string, any>, contractAddress: string, type: 'bid' | 'buy' | 'offer', ownerId?: number): Promise<void> {
    const isExitsToken = Cookies.get('access_token') || ''
    //mạng ropsten
    // if (!isExitsToken) {
    //   await this.handleLoginExternal()
    // }
    let balance = 0

    if (type === 'buy') {
      balance = await this.getBalance(this.currencySelectBuy)
    } else {
      balance = await this.getBalance(this.tokenNeedGetBalance)
    }

    const params = {
      listingId: itemNft?.minListingId,
      itemId: type === 'offer' ? itemNft.id : null,
      ownerId: type === 'offer' ? ownerId : null
    }
    const infoActivity = await apiNft.getLynkeyInfo(itemNft.currency, params)

    if (
      type !== 'buy' &&
      this.$route.name !== 'DetailNftItem' &&
      infoActivity.myOfferStatus !== 'SUCCESS' &&
      infoActivity.myOfferStatus !== 'FAILED' &&
      infoActivity.myOfferStatus !== null
    ) {
      const message = itemNft.itemName + ' ' + this.$t('notify.transaction-is-pending')
      this.$message.error({ message, duration: 5000 })
      return
    }
    await this.setInfoActivity({ ...infoActivity, available: balance })
    if (type === 'buy') {
      this.setOpenPopup({
        popupName: 'popup-buy-nft',
        isOpen: true
      })
    }
    if (type === 'bid') {
      this.setOpenPopup({
        popupName: 'popup-place-bid',
        isOpen: true
      })
    }
    if (type === 'offer') {
      this.setOpenPopup({
        popupName: 'popup-make-offer',
        isOpen: true
      })
    }
  }

  // async handleLoginExternal(): Promise<void> {
  //   try {
  //     const KEY = process.env.VUE_APP_KEY_EXTERNAL
  //     const credential = this.$options.filters?.encryptPassword(md5(this.address + KEY))

  //     const result = await apiNft.externalLogin({
  //       walletType: 'METAMASK',
  //       address: this.address,
  //       credential
  //     })
  //     this.setTokenExternalLogin(result)
  //     return Promise.resolve()
  //   } catch (error) {
  //     return Promise.reject()
  //   }
  // }

  getContractAddressToGetAbiCode(currency: string): string {
    if (this.listAssetNetwork.length) {
      const token = filter(this.listAssetNetwork, token => token.currency === currency)[0]
      if (Object.prototype.hasOwnProperty.call(token, 'implementAddress')) {
        return token.implementAddress
      }
      return token?.contractAddress || ''
    }
    return ''
  }

  getContractAddressOfCurrency(currency: string): string {
    if (this.listAssetNetwork.length) {
      const token = filter(this.listAssetNetwork, token => token.currency === currency)[0]
      return token?.contractAddress || ''
    }
    return ''
  }

  async getAllowanceWeb3(currency: string, spenderWallet: string): Promise<number> {
    try {
      const web3 = new Web3(this.typeLogin === 'BINANCE' ? window.BinanceChain : window.ethereum)
      const contractAddress = this.getContractAddressOfCurrency(currency)
      const abi = await this.getAbiCode(currency)
      const providerContract = new web3.eth.Contract(abi, contractAddress)
      const allowance = await providerContract.methods.allowance(this.walletAddress, spenderWallet).call()
      return Promise.resolve(+allowance)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getAllowance(ownerAddress: string, currency: string): Promise<Record<string, any>> {
    try {
      await Moralis.enableWeb3()
      const contractAddress = this.getContractAddressOfCurrency(currency)

      let abi: Array<Record<string, any>> = []

      abi = await this.getAbiCode(currency)

      const functionAllowance = filter(abi, elm => elm.name === 'allowance')[0]
      const nameParamsOwner = functionAllowance.inputs[0].name
      const nameParamsSpender = functionAllowance.inputs[1].name

      const params = {
        [nameParamsOwner]: ownerAddress,
        [nameParamsSpender]: this.contractAddressExchange
      }

      const readOptions = {
        contractAddress,
        functionName: 'allowance',
        abi,
        params
      }
      const allowance = await Moralis.executeFunction(readOptions)
      const decimal = this.$options.filters?.getDecimalsToken(currency)
      const data = {
        allowance: parseInt(allowance['_hex'], 16) / Math.pow(10, decimal),
        abi
      }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // async setApprovalForAll(contractAddress: string, spenderWallet: string, currency: string): Promise<any> {
  //   try {
  //     await Moralis.enableWeb3()
  //     console.log('setApprovalForAll')

  //     const abi = await this.getAbiCode(currency, contractAddress)
  //     console.log(abi)

  //     const params = {
  //       operators: [spenderWallet, this.contractAddressExchange],
  //       approved: true
  //     }
  //     const readOptions = {
  //       contractAddress,
  //       functionName: 'setBatchApprovalForAll',
  //       abi,
  //       params
  //     }
  //     console.log(readOptions)

  //     const transaction = await Moralis.executeFunction(readOptions)
  //     this.isClickConfirm = true
  //     this.setStatusAlreadyApprove(true)
  //     return Promise.resolve(transaction)
  //   } catch (error) {
  //     this.isLoading = false
  //     console.log(error)
  //   }
  // }

  async acceptOfferOnchain(body: Record<string, any>, contractAddress: string, spenderWallet: string, popupName: string, currency: string, itemId?: number): Promise<void> {
    try {
      if (this.statusApproveAccount === 'NONE' || this.statusApproveAccount === 'FAILED') {
        const transaction = await this.setApprovalForAll(contractAddress, spenderWallet, currency)
        await apiNft.validateApprove({}, { hash: transaction.hash, itemId })
      }
      // if (this.statusApproveAccount === 'SUCCESS') {
      //   await apiNftV3.postAcceptOffer(body)
      //   this.isLoading = false
      //   this.setOpenPopup({
      //     popupName,
      //     isOpen: false
      //   })
      //   this.setTypeOfAction('offer-accept')
      //   this.setOpenPopup({
      //     popupName: 'popup-notify-success',
      //     isOpen: true
      //   })
      // }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async setAllowanceWeb3(currency: string, spenderWallet: string, amount: number): Promise<any> {
    try {
      const web3 = new Web3(this.typeLogin === 'BINANCE' ? window.BinanceChain : window.ethereum)
      const contractAddress = this.getContractAddressOfCurrency(currency)
      const abi = await this.getAbiCode(currency)
      const providerContract = new web3.eth.Contract(abi, contractAddress)
      const transaction = await providerContract.methods.approve(spenderWallet, amount.toString()).send({
        from: this.walletAddress
      })
      return Promise.resolve(transaction)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async approveExchangeSpendTokenOfUser(
    currency: string,
    oldAmount: number,
    amount: number,
    type: 'bid-add' | 'bid-edit' | 'bid-cancel' | 'offer-make' | 'offer-edit' | 'offer-cancel'
  ): Promise<any> {
    try {
      let allowance = await this.getAllowanceWeb3(currency, this.contractAddressExchange)
      const decimal = this.$options.filters?.getDecimalsToken(currency)
      allowance = new Decimal(allowance).div(10 ** decimal).toNumber()

      if (type === 'bid-add' || type === 'offer-make') {
        allowance += amount
      }
      if (type === 'bid-edit' || type === 'offer-edit') {
        allowance = allowance - oldAmount + amount
      }
      if (type === 'bid-cancel' || type === 'offer-cancel') {
        allowance -= amount
      }
      console.log('before', allowance)

      allowance = Number(
        new Decimal(allowance)
          .mul(10 ** decimal)
          .toNumber()
          .toFixed()
      )

      const transaction = await this.setAllowanceWeb3(currency, this.contractAddressExchange, allowance)
      this.setTransactionCodeItem(transaction.transactionHash)
      return Promise.resolve(transaction.transactionHash)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async switchNetwork(baseCurrency: string): Promise<void> {
    try {
      const chainIdNetWork = await this.getChainId()
      if (baseCurrency === 'ETH' && chainIdNetWork !== process.env.VUE_APP_CHAIN_ETH) {
        const networkName = process.env.VUE_APP_SWITCH_NETWORK_NAME_ETH
        const message = this.$t('notify_switch-network', { network: networkName }) as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject({ code: 5888 })
      }
      if (baseCurrency === 'BNB' && chainIdNetWork !== process.env.VUE_APP_CHAIN_BNB) {
        const networkName = process.env.VUE_APP_SWITCH_NETWORK_NAME_BNB
        const message = this.$t('notify_switch-network', { network: networkName }) as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject({ code: 5888 })
      }
      return Promise.resolve()
    } catch (error: any) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getChainId(): Promise<string> {
    try {
      let chainId = ''

      if (this.typeLogin === 'METAMASK' || this.typeLogin === 'TRUST') {
        await Moralis.enableWeb3()
        chainId = Number(window.ethereum.chainId).toString()
      } else {
        const BinanceChain = window.BinanceChain
        const web3 = new Web3(BinanceChain)

        chainId = await (await web3.eth.getChainId()).toString()
      }

      return Promise.resolve(chainId)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  //put on sale

  async checkApprovedForAll(contractAddress: string, spenderWallet: string, currency: string): Promise<boolean> {
    try {
      // await this.switchNetwork('BNB')
      const web3 = this.typeLogin === 'BINANCE' ? new Web3(window.BinanceChain) : new Web3(window.ethereum)

      const abi = await this.getAbiCodeNft(currency)

      console.log(abi)

      const NameContract = new web3.eth.Contract(abi, contractAddress)

      const isApproved = await NameContract.methods.isApprovedForAll(this.walletAddress, spenderWallet).call()

      return Promise.resolve(isApproved)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async setApprovalForAll(contractAddress: string, spenderWallet: string, currency: string): Promise<any> {
    try {
      await Moralis.enableWeb3()

      const abi = await this.getAbiCodeNft(currency)

      const params = {
        operators: [spenderWallet, this.contractAddressExchange],
        approved: true
      }
      const readOptions = {
        contractAddress,
        functionName: 'setBatchApprovalForAll',
        abi,
        params
      }
      const transaction = await Moralis.executeFunction(readOptions)
      this.isClickConfirm = true
      this.setStatusAlreadyApprove(true)
      return Promise.resolve(transaction)
    } catch (error) {
      this.isLoading = false
      console.log(error)
    }
  }

  async approveForAllBinance(currency: string, spenderWallet: string, contractAddress: string): Promise<any> {
    try {
      const web3 = new Web3(window.BinanceChain)
      // await window.BinanceChain.enable()
      const abi = await this.getAbiCodeNft(currency)
      console.log(abi)

      const NameContract = new web3.eth.Contract(abi, contractAddress)

      const transaction = await NameContract.methods.setBatchApprovalForAll([spenderWallet, this.contractAddressExchange], true).send({
        from: this.walletAddress
      })
      return Promise.resolve(transaction)
    } catch (error) {
      console.log(error)

      return Promise.reject(error)
    }
  }

  async putOnSaleOnChain(body: Record<string, any>, contractAddress: string, spenderWallet: string, popupName: string, currency: string): Promise<any> {
    try {
      if (this.statusApproveAccount === 'NONE' || this.statusApproveAccount === 'FAILED') {
        if (this.typeLogin === 'BINANCE') {
          const transaction = await this.approveForAllBinance(currency, spenderWallet, contractAddress)
          await apiNft.validateApprove({}, { hash: transaction.transactionHash, itemId: body.itemId })
          this.handleGetApproveAccount()
        } else {
          const transaction = await this.setApprovalForAll(contractAddress, spenderWallet, currency)
          await apiNft.validateApprove({}, { hash: transaction.hash, itemId: body.itemId })
          this.handleGetApproveAccount()
        }
        return Promise.resolve()
      }
      // if (this.statusApproveAccount === 'SUCCESS') {
      //   await apiNftV3.fixedPrice(body)
      //   this.isLoading = false
      //   this.setOpenPopup({
      //     popupName,
      //     isOpen: false
      //   })
      //   const emitValue = popupName === 'popup-fixed-price' ? 'put-fixed' : popupName === 'popup-open-for-bids' ? 'put-open' : 'put-time'
      //   this.$emit('success', emitValue)
      //   return Promise.resolve()
      // }
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  offFirebase(): void {
    const refApproveAccount = firebase.database().ref(`nft_approved_accounts/${this.user.id}/${this.nftItem?.contractAddress}`)
    refApproveAccount.off('value', this.refApproveAccount)
  }

  handleGetApproveAccount(): void {
    const refApproveAccount = firebase.database().ref(`nft_approved_accounts/${this.user.id}/${this.nftItem?.contractAddress}`)
    this.refApproveAccount = refApproveAccount.on('value', snapshot => {
      if (snapshot.val()) {
        this.setStatusApproveAccount(snapshot.val().status)
      }
    })
  }
}
