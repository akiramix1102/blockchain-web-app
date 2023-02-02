import { ModuleInterface } from '@/interface/module'
import exchangeRoute from './router'
import exchangeStores from './store'

const exchangeModule: ModuleInterface = {
  router: exchangeRoute,
  stores: exchangeStores
}

export default exchangeModule
