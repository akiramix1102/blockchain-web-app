import { Module } from 'vuex'
import stakingStore from './staking'

const earnStore: Record<string, Module<any, any>> = {
  stakingStore
}

export default earnStore
