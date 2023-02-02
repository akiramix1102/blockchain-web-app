import Cookies from 'js-cookie'
import filter from 'lodash/filter'
import { MutationTree } from 'vuex'
import { INft } from '.'

const mutations: MutationTree<INft> = {
  SET_TYPE_ACTION(state, type: 'bid' | 'buy') {
    state.typeAction = type
  },
  SET_INFO_NFT(state, nft: Record<string, any>) {
    state.nftItem = nft
  },
  SET_INFO_ACTIVITY(state, info: Record<string, any>) {
    state.info = info
  },
  SET_LIST_ASSET_NETWORK: (state, list: Array<Record<string, any>>) => {
    state.listAssetNetwork = list
  },
  SET_LIST_NFT_ASSET: (state, list: Array<Record<string, any>>) => {
    state.listNftAsset = list
  },
  SET_LINK_SHARE: (state, link: string) => {
    state.linkShare = link
  },
  SET_EDIT_OFFER: (state, payload) => {
    state.isEditOffer = payload
  },
  SET_STATUS_SCREEN: (state, payload) => {
    state.isDesktop = payload
  },
  SET_TYPE_POPUP: (state, payload) => {
    state.typePopup = payload
  },
  SET_LIST_ACCOUNT: (state, payload) => {
    state.listAccount = payload
  },
  SET_IS_BTN_OFFER: (state, payload) => {
    state.isBtnOffer = payload
  },
  SET_ITEM_OFFER_OR_BID: (state, payload) => {
    state.item = payload
  },
  SET_TYPE_OF_ACTION: (state, payload) => {
    state.typeOfAction = payload
  },
  SET_VALUE_BALANCE_AND_CURRENCY: (state, payload: Record<string, any>) => {
    state.balancePay = payload.balancePay
    state.currency = payload.currency
  },
  SET_STATUS_APPROVE_ACCOUNT: (state, payload) => {
    state.statusApproveAccount = payload
  },
  SET_STATUS_APPROVE_ITEM: (state, payload) => {
    state.statusApproveItem = payload
  },
  SET_TRANSACTION_CODE_ITEM: (state, payload) => {
    state.transactionCodeItem = payload
  },
  SET_TRANSACTION_CODE_ACCOUNT: (state, payload) => {
    state.transactionCodeAccount = payload
  },
  SET_IS_ALREADY_APPROVE: (state, payload) => {
    state.isAlreadyApprove = payload
  },
  SET_CATEGORY_FILTER: (state, payload) => {
    state.listCategoryFilter = payload
  },

  SET_LIST_TRANS_BUY_NFT: (state, payload) => {
    state.listTransactionNft = payload
  },

  SET_LIST_EXCHANGE_RATE: (state, payload) => {
    state.listExchangeRate = payload
  },
  SET_LIST_CURRENCIES: (state, payload) => {
    // const arrCurrencyWithoutUSDT = filter(payload, elm => elm.currency !== 'USDT')
    state.listCurrencies = payload
  },
  SET_CURRENCY_SELECT_BUY: (state, payload) => {
    state.currencySelectBuy = payload
  },
  SET_LIST_ACCEPT_CURRENCY: (state, payload) => {
    const walletType = Cookies.get('type_login')
    if (walletType === 'WEB') {
      state.listAcceptCurrency = payload
    } else {
      const arrCurrencyWithoutUSDT = filter(payload, elm => elm.currency !== 'USDT')
      state.listAcceptCurrency = arrCurrencyWithoutUSDT
    }
  },
  SET_LIST_ACCEPT_CURRENCY_ACTION_BUY: (state, payload) => {
    state.listAcceptCurrencyBuy = payload
  },
  SET_TOKEN_NEED_GET_BALANCE: (state, payload) => {
    state.tokenNeedGetBalance = payload
  },
  SET_SHARE_TYPE: (state, payload) => {
    state.shareType = payload
  },

  //wallet connect
  SET_PROVIDER_WALLET_CONNECT: (state, provider) => {
    state.providerWc = provider
  }
}
export default mutations
