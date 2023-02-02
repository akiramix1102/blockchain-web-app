import WalletConnectProvider from '@walletconnect/web3-provider'
import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export interface INft {
  nftItem: Record<string, any>
  info: Record<string, any>
  listAssetNetwork: Array<Record<string, any>>
  listNftAsset: Array<Record<string, any>>
  linkShare: string
  isEditOffer: boolean
  typeAction: 'bid' | 'buy'
  isDesktop: boolean
  typePopup: 'bid' | 'offer'
  listAccount: Array<Record<string, any>>
  isBtnOffer: boolean
  item: Record<string, any>
  balancePay: number
  currency: string
  typeOfAction: string
  statusApproveAccount: string
  statusApproveItem: string
  isAlreadyApprove: boolean
  listCategoryFilter: Array<Record<string, any>>
  transactionCodeItem: string
  transactionCodeAccount: string
  listTransactionNft: Array<Record<string, any>>
  listExchangeRate: Array<Record<string, any>>
  listCurrencies: Array<Record<string, any>>
  currencySelectBuy: string
  listAcceptCurrency: Array<Record<string, any>>
  listAcceptCurrencyBuy: Array<Record<string, any>>
  tokenNeedGetBalance: string
  shareType: 'NFT' | 'ACCOUNT' | 'COLLECTION'
  //wallet connect
  providerWc: WalletConnectProvider | null
}

const state: INft = {
  nftItem: {},
  info: {},
  listAssetNetwork: [],
  listNftAsset: [],
  typeAction: 'buy',
  linkShare: '',
  isEditOffer: false,
  isDesktop: true,
  typePopup: 'bid',
  listAccount: [],
  isBtnOffer: false,
  item: {},
  balancePay: 0,
  currency: 'LYNK',
  typeOfAction: '',
  statusApproveAccount: 'NONE',
  listCategoryFilter: [],
  statusApproveItem: 'NONE',
  transactionCodeItem: '',
  transactionCodeAccount: '',
  isAlreadyApprove: false,
  listTransactionNft: [],
  listExchangeRate: [],
  listCurrencies: [],
  currencySelectBuy: '',
  listAcceptCurrency: [],
  listAcceptCurrencyBuy: [],
  tokenNeedGetBalance: '',
  shareType: 'NFT',
  providerWc: null
}

const bcNft: Module<INft, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default bcNft
