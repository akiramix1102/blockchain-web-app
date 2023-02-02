<template>
  <div class="container">
    <trade-tab :arrayTab="tabs" :isShowUnderline="false" @change-tab="handleChangeTab" mode="if"></trade-tab>
  </div>
</template>

<script lang="ts">
  import TradeTab from '@/modules/exchanges/components/base/TradeTab.vue'
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

  @Component({ components: { TradeTab } })
  export default class Footer extends Vue {
    tabHistory: Array<Record<string, any>> = [
      {
        id: 0,
        tabName: 'Open Orders',
        counter: 60,
        type: 'Orders',
        component: 'HistoryTradeMobile',
        value: 'TAB_ORDER'
      },
      {
        id: 1,
        tabName: 'Order History',
        counter: 0,
        type: 'History',
        component: 'HistoryTradeMobile',
        value: 'TAB_HISTORY'
      },
      {
        id: 2,
        tabName: 'Trade History',
        counter: 0,
        type: 'Trade',
        component: 'HistoryTradeMobile',
        value: 'TAB_TRADE'
      }
    ]
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

<style scoped lang="scss"></style>
