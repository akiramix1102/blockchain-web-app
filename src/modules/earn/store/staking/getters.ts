import trim from 'lodash/trim'
import { IStakingStore } from './index'
import { GetterTree } from 'vuex'

const getters: GetterTree<IStakingStore, any> = {
  isLogin: (state, getters, rootState, rootGetters) => {
    return rootGetters['beAuth/isLogin'] && !rootState.beAuth.walletAddress
  }
}
export default getters
