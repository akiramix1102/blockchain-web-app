<template>
  <div class="container">
    <trade-tab :arrayTab="tab"></trade-tab>
  </div>
</template>

<script lang="ts">
  import TradeTab from '@/modules/exchanges/components/base/TradeTab.vue'
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

  @Component({ components: { TradeTab } })
  export default class Main extends Vue {
    tab: Array<Record<string, any>> = [
      {
        id: 0,
        tabName: 'Chart',
        type: 'Chart',
        component: 'ChartMobile',
        value: 'CHART'
      },
      {
        id: 1,
        tabName: 'Order Book',
        type: 'History',
        component: 'Header',
        value: 'ORDER_BOOK'
      },
      {
        id: 2,
        tabName: 'Market Trades',
        type: 'Trade',
        component: 'MarketTrades',
        value: 'MARKET_TRADE'
      }
    ]
  }
</script>

<style scoped lang="scss"></style>
