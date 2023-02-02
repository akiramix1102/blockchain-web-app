import { Module } from 'vuex'
import bcNft from './nft'

const marketHomeStores: Record<string, Module<any, any>> = {
  bcNft
}

export default marketHomeStores
