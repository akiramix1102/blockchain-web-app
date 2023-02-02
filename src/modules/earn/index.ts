import { ModuleInterface } from '@/interface/module'
import earnRouters from './router'
import earnStore from './store'
const earnModule: ModuleInterface = {
  router: earnRouters,
  stores: earnStore
}

export default earnModule
