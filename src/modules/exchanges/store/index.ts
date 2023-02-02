import { Module } from 'vuex'
import bcExchange from './exchange'

const exchangeStores: Record<string, Module<any, any>> = {
  bcExchange
}

export default exchangeStores
