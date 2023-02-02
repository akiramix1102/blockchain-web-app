<template>
  <div class="exchange">
    <div class="container-exchange" v-if="screen == 'DESKTOP'">
      <div class="main">
        <div class="fixed-left">
          <div class="header">
            <exchange-header />
          </div>
          <div class="content">
            <div class="content-left">
              <div class="both-exchange">
                <both-exchange></both-exchange>
              </div>
              <div class="trade-exchange">
                <trade-exchange></trade-exchange>
              </div>
            </div>
            <div class="content-right">
              <div class="chart">
                <chart></chart>
              </div>
              <div class="trade">
                <trade />
              </div>
            </div>
          </div>
        </div>
        <div class="order-book">
          <order-book />
        </div>
      </div>
      <div class="history-user-trade">
        <tab-oder-history></tab-oder-history>
      </div>
    </div>
    <div class="container-exchange-mobile" v-else>
      <div>
        <div class="header">
          <header-mobile @visible="visibleBothExchange = true"></header-mobile>
        </div>
        <div class="main">
          <main-mobile></main-mobile>
        </div>
        <div class="footer-exchange">
          <footer-mobile></footer-mobile>
        </div>
        <group-button-footer> </group-button-footer>
      </div>
      <trade-drawer v-model="visibleBothExchange" title="Market" height="70%">
        <both-exchange></both-exchange>
      </trade-drawer>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import OrderBook from '../components/order-book/OrderBook.vue'
  import Trade from '../components/Trade/Trade.vue'
  import BothExchange from '../components/both-exchange/BothExchange.vue'
  import Chart from '../components/chart/Chart.vue'
  import TabOderHistory from '../components/history-trade/TabOderHistory.vue'
  import ExchangeHeader from '../components/header/ExchangeHeader.vue'
  import TradeExchange from '../components/trade-exchange/TradeExchange.vue'
  import GroupButtonFooter from '@/modules/exchanges/view/GroupButtonFooter.vue'
  import FooterMobile from '@/modules/exchanges/view/mobile/Footer.vue'
  import MainMobile from '@/modules/exchanges/view/mobile/Main.vue'
  import HeaderMobile from '@/modules/exchanges/view/mobile/Header.vue'
  import TradeDrawer from '@/modules/exchanges/components/base/TradeDrawer.vue'

  @Component({
    components: { TradeDrawer, BothExchange, ExchangeHeader, OrderBook, Chart, Trade, TabOderHistory, TradeExchange, GroupButtonFooter, FooterMobile, MainMobile, HeaderMobile }
  })
  export default class Exchange extends Vue {
    @Prop({ required: false, type: String, default: 'dark' }) theme!: string
    @Prop({ required: false, type: String, default: 'spot' }) type!: string
    screen = ''
    visibleBothExchange = false
    checkSize() {
      if (window.innerWidth <= 768) {
        this.screen = 'MOBILE'
      } else if (window.innerWidth <= 1024) {
        this.screen = 'TABLET'
      } else {
        this.screen = 'DESKTOP'
      }
    }

    created(): void {
      window.addEventListener('resize', this.checkSize)
      this.checkSize()
    }
  }
</script>

<style scoped lang="scss">
  .exchange {
    background-color: var(--color-background);
    display: flex;
    justify-content: center;
    .container-exchange {
      max-width: var(--width-default);
      width: 100%;
      border-left: 1px solid var(--color-border-primary);
      border-right: 1px solid var(--color-border-primary);
      .main {
        display: flex;
        height: 925px;
        .fixed-left {
          flex: 1;
          .header {
            height: 74px;
            border-bottom: 1px solid var(--color-border-primary);
            width: 100%;
          }
          .content {
            display: flex;
            border-bottom: 1px solid var(--color-border-primary);
            height: calc(100% - 74px);
            .content-left {
              width: var(--width-table-order-primary);
              border-right: 1px solid var(--color-border-primary);
              height: 100%;
              .both-exchange {
                height: 450px;
                border-bottom: 1px solid var(--color-border-primary);
              }
            }
            .content-right {
              flex: 1;
              .chart {
                height: 455px;
                width: 100%;
                border-bottom: 1px solid var(--color-border-primary);
              }
            }
          }
        }
        .order-book {
          width: var(--width-table-order-primary);
          border: 1px solid var(--color-border-primary);
          border-right: 0;
          border-top: 0;
        }
      }
      .history-user-trade {
        height: 650px;
        width: 100%;
      }
    }
  }
  .container-exchange-mobile {
    margin-top: 8px;
    position: relative;
    background-color: var(--color-background-mobile);
    > div:first-child > div:not(:last-child) {
      padding: 20px;
      backdrop-filter: blur(24px);
      background-color: var(--color-background);
    }
    color: var(--color-text-primary);
    .header {
      height: 164px;
    }
    .main {
      margin-top: 8px;
      min-height: 454px;
    }
    .footer-exchange {
      margin-top: 8px;
      margin-bottom: 112px;
      min-height: 454px;
    }
    ::v-deep.footer .footer-content {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  @media screen and (max-width: 768px) {
    .exchange {
      margin-top: 8px;
      display: block;
    }
  }
</style>
