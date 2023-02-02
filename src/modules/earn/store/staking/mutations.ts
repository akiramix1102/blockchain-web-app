import { MutationTree } from 'vuex'

import { IStakingStore, IStakingPack } from '.'

const mutations: MutationTree<IStakingStore> = {
  SET_LIST_STAKING_PACK(state, listStakingPack: IStakingPack[]) {
    state.allStakingPack = listStakingPack
  },
  SET_STAKING_PACK_BY_ID(state, stakingId: number) {
    state.stakingPack = state.allStakingPack.find(el => el.id === stakingId) || {}
  },
  SET_STAKING_PACK_DATA(state, payload: IStakingPack) {
    state.stakingPack = payload
  }
}
export default mutations
