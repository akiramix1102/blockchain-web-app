<template>
  <div>
    <base-tab :arrayTab="tabs" :isShowUnderline="false" @change-tab="handleChangeTab" mode="if"></base-tab>
    <!--    <HistoryTrade :isShowHeader="true"></HistoryTrade>-->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import BaseTab from '@/modules/exchanges/components/base/TradeTab.vue'
  import HistoryTrade from './HistoryTrade.vue'

  @Component({ components: { BaseTab, HistoryTrade } })
  export default class TabOderHistory extends Vue {
    tabHistory: Array<Record<string, any>> = [
      {
        id: 0,
        tabName: 'Open Orders',
        counter: 60,
        type: 'Orders',
        component: 'HistoryTrade',
        value: 'TAB_ORDER'
      },
      {
        id: 1,
        tabName: 'Order History',
        counter: 0,
        type: 'History',
        component: 'HistoryTrade',
        value: 'TAB_HISTORY'
      },
      {
        id: 2,
        tabName: 'Trade History',
        counter: 0,
        type: 'Trade',
        component: 'HistoryTrade',
        value: 'TAB_TRADE'
      }
    ]
    tabActive = {}
    // @ts-ignore
    get tabs(): Array<Record<string, any>> {
      return this.tabHistory.map(tab => {
        if (tab.type === 'Orders') {
          return {
            ...tab,
            props: {
              isShowFilter: false,
              type: 'Orders'
            }
          }
        }
        if (tab.type === 'History') {
          return {
            ...tab,
            props: {
              isShowFilter: true,
              type: 'History'
            }
          }
        } else {
          return {
            ...tab,
            props: {
              isShowFilter: true,
              type: 'Trade'
            }
          }
        }
      })
    }

    handleChangeTab(tabActive: Record<string, any>): void {
      console.log(tabActive)
    }
  }
</script>

<style scoped lang="scss">
  .tab-right {
    color: var(--color-text-secondary);
  }
</style>
