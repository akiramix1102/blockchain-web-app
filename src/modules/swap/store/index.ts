import { Module } from 'vuex'
import bcSwap from './crowdsale'

const swapStores: Record<string, Module<any, any>> = {
  bcSwap
}

export default swapStores
