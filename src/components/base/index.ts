import Vue from 'vue'
import { VueConstructor } from 'vue'
import BaseIcon from './icon/BaseIcon.vue'
import BasePopup from './popup/BasePopup.vue'
import BaseDrawer from './drawer/BaseDrawer.vue'
import BaseTable from './table/BaseTable.vue'
import BaseTreeTable from './table/BaseTreeTable.vue'
import BasePagination from './pagination/BasePagination.vue'
import BcMedia from './media/BcMedia.vue'
import BaseInput from './input/BaseInput.vue'
import TradeTab from '@/modules/exchanges/components/base/TradeTab.vue'
const components: Record<string, VueConstructor<Vue>> = {
  BaseIcon,
  BaseTable,
  BaseTreeTable,
  BasePagination,
  BasePopup,
  BcMedia,
  BaseDrawer,
  BaseInput,
  TradeTab
}

export default components
