import Vue from 'vue'
declare module 'vue/types/vue' {}

import { ElMessage } from 'element-ui/types/message'
declare global {
  interface Window {
    ethereum: any
    BinanceChain: any
    [x: string]: any
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $mes: ElMessage
  }
}
