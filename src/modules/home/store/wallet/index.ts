import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export interface IAuth {
  tabActive: string
  isDesktop: boolean
}

const state: IAuth = {
  tabActive: 'LYN',
  isDesktop: true
}

const bcWallet: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default bcWallet
