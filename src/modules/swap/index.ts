import { ModuleInterface } from '@/interface/module'
import swapRoute from './router'
import swapStores from './store'

const swapModule: ModuleInterface = {
  router: swapRoute,
  stores: swapStores
}

export default swapModule
