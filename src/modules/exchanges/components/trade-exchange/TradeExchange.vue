<template>
  <div class="container">
    <trade-tab class="base-tab" :arrayTab="tabsCoin" :isShowUnderline="false"></trade-tab>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import TradeTab from '@/modules/exchanges/components/base/TradeTab.vue'
  import SortHeader from '../base/SortHeader.vue'

  @Component({ components: { TradeTab, SortHeader } })
  export default class TradeExchange extends Vue {
    tabsCoin = [
      {
        id: 0,
        tabName: 'Market Trades',
        component: 'MarketTrades'
      },
      {
        id: 1,
        tabName: 'My Trades',
        component: ''
      }
    ]
  }
</script>
<style lang="scss" scoped>
  ::v-deep::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  /* Track */
  ::v-deep::-webkit-scrollbar-track {
    background: var(--color-background);
  }

  /* Handle */
  ::v-deep::-webkit-scrollbar-thumb {
    background: rgb(94, 102, 115);
    border-radius: 3px;
    height: 90px;
  }

  .container {
    width: 100%;
    height: 100%;

    ::v-deep.base-tab {
      .carousel-wrapper {
        margin: 0;
      }
    }
  }

  @media screen and (max-width: 768px) {
  }
</style>
