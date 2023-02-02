import trim from 'lodash/trim'
import { IExchange } from './index'
import { GetterTree } from 'vuex'

const getters: GetterTree<IExchange, any> = {
  isLogin: (state, getters, rootState, rootGetters) => {
    return rootGetters['beAuth/isLogin'] && !rootState.beAuth.walletAddress
  }
}
export default getters
