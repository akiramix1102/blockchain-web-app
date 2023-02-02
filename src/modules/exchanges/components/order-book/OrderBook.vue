<template>
  <div class="order-book-wrapper">
    <div class="header">
      <div class="header__tabs">
        <div class="header__tabs-item" :class="tab.id === tabActive.id && 'header__tabs-item--active'" v-for="tab in orderBookTabs" :key="tab.id" @click="selectTab(tab)">
          <base-icon :icon="tab.icon" :size="'24'"></base-icon>
        </div>
      </div>
      <div class="header__options">
        <div class="step-filter">
          <el-dropdown trigger="click" @command="selectStep">
            <span class="text-trade-primary text-bold">
              {{ stepFilter }}
              <span class="text-desc"><i class="el-icon-caret-bottom"></i></span>
            </span>
            <el-dropdown-menu slot="dropdown" :popper-append-to-body="false" class="step-filter-dropdown">
              <el-dropdown-item v-for="step in stepFilterArr" :key="step" :command="step" :class="step === stepFilter ? 'step-select--active' : ''">{{ step }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="body">
      <dynamic-header-table :headerArr="['Price (USDT)', 'Amount (LYNK)', 'Total']" :class="tabActive.value === 'TAB_SELL' && 'mb-16'" />
      <div class="order-book__seller" v-show="tabActive.value !== 'TAB_BUY'" :style="{}">
        <dynamic-table :tradingType="'SELL'" :isShowHeader="false" :isScrollable="tabActive.value === 'TAB_SELL'" :maxRowSize="16" ref="table-sell" />
      </div>
      <div class="order-book__matched">
        <div class="matched__price">
          <div class="current-price">
            <span :class="matchedValue.state === 'down' ? 'text-trade-sell' : matchedValue.state === 'up' ? 'text-trade-buy' : ''">{{ matchedValue.currentPrice }}</span>
            <base-icon :icon="'icon-trade-arrow-' + matchedValue.state" :size="'24'"></base-icon>
            <!-- <base-icon :icon="'icon-trade-arrow-down'" size="24"></base-icon> -->
          </div>
          <span class="usd-price text-trade-desc">${{ matchedValue.usdPrice }}</span>
        </div>
        <div class="matched__options text-xs text-regular text-blue">More</div>
      </div>
      <div class="order-book__buyer" v-show="tabActive.value !== 'TAB_SELL'" :style="{}">
        <dynamic-table :tradingType="'BUY'" :isShowHeader="false" :maxRowSize="17" :isScrollable="tabActive.value === 'TAB_BUY'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import DynamicTable from './DynamicTable.vue'
  import DynamicHeaderTable from './DynamicHeaderTable.vue'
  import EventBus from '@/utils/eventBus'

  @Component({ components: { DynamicTable, DynamicHeaderTable } })
  export default class OrderBook extends Vue {
    timer: any = null

    matchedValue: Record<string, any> = {
      currentPrice: 20954.22,
      currency: 'LYNK',
      exchangeCurrency: 'USDT',
      usdPrice: 20.162736,
      state: 'up'
    }

    orderBookTabs: Array<Record<string, any>> = [
      {
        id: 1,
        icon: 'icon-trade-tab-orderbook-default',
        value: 'TAB_DEFAULT'
      },
      {
        id: 2,
        icon: 'icon-trade-tab-orderbook-buy',
        value: 'TAB_BUY'
      },
      {
        id: 3,
        icon: 'icon-trade-tab-orderbook-sell',
        value: 'TAB_SELL'
      }
    ]
    tabActive: Record<string, any> = {}

    stepFilterArr: Array<number> = [0.01, 0.1, 1, 10]
    stepFilter = 0.01

    created(): void {
      console.log('order book')
      this.timer = setInterval(() => {
        this.matchedValue = {
          currentPrice: (20954.22 + Math.random() * 100).toFixed(2),
          usdPrice: ((20954.22 + Math.random() * 100) / 1000.1).toFixed(5),
          currency: 'LYNK',
          exchangeCurrency: 'USDT',
          state: Math.random() < 0.3 ? 'down' : Math.random() < 0.7 ? 'up' : 'default'
        }
        EventBus.$emit('matchedValue', this.matchedValue)
      }, 500)
      this.tabActive = this.orderBookTabs[0]
    }
    destroy(): void {
      clearInterval(this.timer)
    }
    selectTab(tab: Record<string, any>): void {
      //
      this.tabActive = tab
      if (this.tabActive.value === 'TAB_SELL') {
        // @ts-ignore
        this.$refs['table-sell'].scrollToBottom()
      }
    }

    selectStep(selectStep: number): void {
      this.stepFilter = selectStep
    }
    handleShowFilter(): void {
      //
    }
  }
</script>

<style scoped lang="scss">
  .order-book-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 56px;
      padding: 16px;
      background: var(--color-background);
      .header__tabs {
        display: flex;
        height: 100%;
        .header__tabs-item {
          display: flex;
          align-items: center;
          margin-right: 8px;
          opacity: 0.6;
          transition: all 0.2s ease;
          &:last-child {
            margin-right: 0;
          }
          &:hover {
            cursor: pointer;
            opacity: 1;
          }
          &--active {
            opacity: 1;
          }
        }
      }
      .header__options {
        display: flex;
        align-items: center;
        .step-filter {
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .body {
      position: relative;
      width: 100%;
      height: calc(100% - 56px);
      padding: 0px 6px 16px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .order-book__seller {
        position: relative;
        width: 100%;
        height: calc((100% - 44px - 16px));
      }
      .order-book__matched {
        width: 100%;
        height: 44px;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        .matched__price {
          display: flex;
          align-items: center;
          .current-price {
            display: flex;
            align-items: center;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            margin-right: 8px;
          }
          .usd-price {
          }
        }
        .matched__options {
        }
      }
      .order-book__buyer {
        position: relative;
        width: 100%;
        height: calc((100% - 44px - 16px));
      }
    }
  }
</style>
<style lang="scss">
  .step-filter-dropdown {
    padding: 2px 0 !important;
    background: var(--color-background-element);
    border-color: var(--color-border-primary);
    .el-dropdown-menu__item {
      height: 40px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      &:hover {
        background: var(--color-border-primary) !important;
        color: var(--color-text-primary) !important;
        background-clip: unset !important;
        -webkit-text-fill-color: unset !important;
      }
    }
    .step-select--active {
      background: var(--color-active-primary);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      font-size: 15px;
    }
  }
</style>
