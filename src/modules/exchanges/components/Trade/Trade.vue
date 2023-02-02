<template>
  <div class="trade">
    <trade-tab :arrayTab="tabs" :isShowUnderline="true" type="text">
      <div class="tab-append" slot="append">
        <span class="tab-right text-xs text-regular cursor">Fee Level</span>
        <!-- <el-popover placement="bottom" trigger="click" >
          <div slot="reference">
            <base-icon icon="icon-3dot-trade" class="icon-3dot cursor"> </base-icon>
          </div>
        </el-popover> -->
        <el-popover placement="bottom-end" trigger="click" class="popover" popperClass="exchange-trade-options">
          <div slot="reference">
            <base-icon icon="icon-3dot-trade" class="icon-3dot cursor"> </base-icon>
          </div>
          <template>
            <p class="content">Spot Tutorial</p>
            <p class="content">FAQ</p>
          </template>
        </el-popover>
      </div>
    </trade-tab>
    <!--    <TradeLimit v-if="tabActive === 0" />-->
    <!--    <TradeMarket v-else />-->
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import TradeLimit from './TradeLimit.vue'
  import TradeTab from '@/modules/exchanges/components/base/TradeTab.vue'
  import TradeMarket from './TradeMarket.vue'

  @Component({ components: { TradeLimit, TradeMarket, TradeTab } })
  export default class Trade extends Vue {
    visible = ''
    tabs: Array<Record<string, any>> = [
      {
        id: 0,
        tabName: 'Limit',
        counter: 0,
        component: 'TradeLimit',
        value: 'TAB_LIMIT',
        ref: 'trade-ref'
      },
      {
        id: 1,
        tabName: 'Market',
        counter: 0,
        component: 'TradeMarket',
        value: 'TAB_MARKET'
      }
    ]
  }
</script>
<style lang="scss" scoped>
  .tab-append {
    display: flex;
    align-items: center;
    .tab-right {
      color: var(--color-text-secondary);
      margin-right: 16px;
      text-decoration: underline;
    }
    .icon-3dot {
      margin-right: 20px;
    }
  }

  .el-popper {
    .content {
      color: var(--color-text-primary);
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      width: 100%;
      height: 42px;
      padding: 10px 16px 8px 16px;
      &:hover {
        background: var(--color-background-filter);
        cursor: pointer;
      }
    }
  }
</style>
<style lang="scss">
  .exchange-trade-options {
    background: var(--color-background-element);
    padding: 0;
    min-width: 124px;
    border: 0.5px solid var(--color-border-primary) !important;
  }
</style>
