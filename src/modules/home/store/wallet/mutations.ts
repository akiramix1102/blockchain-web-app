import { MutationTree } from 'vuex'
import { IAuth } from '.'

const mutations: MutationTree<IAuth> = {
  SET_TAB_ACTIVE: (state, tab) => {
    state.tabActive = tab
  },
  SET_STATUS_SCREEN: (state, payload) => {
    state.isDesktop = payload
  }
}
export default mutations
