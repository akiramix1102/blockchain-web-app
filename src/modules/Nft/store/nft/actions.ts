import { ActionTree } from 'vuex'
import { INft } from '.'

const actions: ActionTree<INft, unknown> = {
  setInfoNft({ commit }, nft: Record<string, any>) {
    commit('SET_INFO_NFT', nft)
  },
  setInfoActivity({ commit }, info: Record<string, any>) {
    commit('SET_INFO_ACTIVITY', info)
  },
  async setListAssetNetwork({ commit }, data) {
    commit('SET_LIST_ASSET_NETWORK', data)
  },
  async setListNftAsset({ commit }, data) {
    commit('SET_LIST_NFT_ASSET', data)
  },
  setLinkShare({ commit }, link: Record<string, any>) {
    commit('SET_LINK_SHARE', link)
  },
  setEditOffer({ commit }, payload: any) {
    commit('SET_EDIT_OFFER', payload)
    console.log('payload', payload)
  },
  async setCategoryFilter(context, payload) {
    context.commit('SET_CATEGORY_FILTER', payload)
  },
  setlistCurrencies({ commit }, payload) {
    commit('SET_LIST_CURRENCIES', payload)
  },
  setListCurrenciesBuy({ commit }, payload) {
    commit('SET_LIST_ACCEPT_CURRENCY_ACTION_BUY', payload)
  },
  setShareType({ commit }, payload) {
    commit('SET_SHARE_TYPE', payload)
  }
}

export default actions
