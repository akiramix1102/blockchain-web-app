import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export interface IStakingPack {
  id: number
  planName: string
  currency: string
  currencyName: string
  minQuantity: number
  aprPercent: number
  durationType: string
  durations: number
  interestType: string
  unstakeDay: number
  description?: string | null
  totalStakedAmount: number
  totalInvestor: number
  lastTransaction?: string | null
  dispStatus: string
  createdAt: string
  updatedAt?: string | null
  feeAmount: number
  minAmount: number
  userAmount: number
  limitAmount: number
  maxQuantity: number
}

export interface IStakingStore {
  stakingPack: IStakingPack | Record<string, any>
  allStakingPack: IStakingPack[]
}

const state: IStakingStore = {
  allStakingPack: [],
  stakingPack: {}
}

const stakingStore: Module<IStakingStore, unknown> = {
  namespaced: true,
  getters,
  state,
  actions,
  mutations
}

export default stakingStore
