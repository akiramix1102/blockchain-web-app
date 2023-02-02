import { ModuleInterface } from '@/interface/module'
import homeModule from './home'
import authModule from './auth'
import settingModule from './setting'
import affiliateModule from './affiliate'
import crowdsaleModule from './crowdsale'
import marketplaceModuleNft from './Nft'
import marketplaceModule from './marketplace/home'
import exchangeModule from './exchanges'
import swapModule from './swap'
import earnModule from './earn/index'

const listModules: Record<string, ModuleInterface> = {
  homeModule,
  authModule,
  settingModule,
  affiliateModule,
  crowdsaleModule,
  marketplaceModule,
  marketplaceModuleNft,
  exchangeModule,
  earnModule,
  swapModule
}

export default listModules
