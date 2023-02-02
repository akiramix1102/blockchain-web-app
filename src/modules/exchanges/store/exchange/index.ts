import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const TYPE_EXCHANGE = {
  SPOT: 'spot'
}

export interface IExchange {
  typeExchanges: Record<string, any>
}

const state: IExchange = {
  typeExchanges: TYPE_EXCHANGE
}

const bcExchange: Module<IExchange, unknown> = {
  namespaced: true,
  getters,
  state,
  actions,
  mutations
}

export default bcExchange
