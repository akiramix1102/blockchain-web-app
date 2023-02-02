<template>
  <div class="tab-base">
    <div v-if="type === 'scroll'" class="tab-list-scroll">
      <div class="tab-header">
        <tab-carousel height="24px" width="274px">
          <div
            v-for="(tab, index) in arrayTab"
            :key="index"
            :class="[{ 'tab-active': tabActive.id === tab.id }]"
            class="tab-item cursor"
            v-bind="$attrs"
            @click="handleClickTabActive(tab)"
          >
            <span class="text-base1 cursor">
              {{ tab.tabName }}
            </span>
          </div>
        </tab-carousel>
      </div>
    </div>

    <div v-else :class="isShowUnderline ? 'underline-border' : null" class="tab-list">
      <div class="tab-header">
        <div
          v-for="(tab, index) in arrayTab"
          :key="index"
          :class="[
            { 'tab-active': tabActive.id === tab.id },
            { 'tab-normal': tabActive.id !== tab.id && isShowUnderline },
            { 'tab-underline': tabActive.id === tab.id && isShowUnderline },
            { 'tab-icon': tabActive.id !== tab.id && type === 'icon' }
          ]"
          class="tab-item cursor"
          v-bind="$attrs"
          @click="handleClickTabActive(tab)"
        >
          <span v-if="type === 'text'" :style="{ fontSize: isShowUnderline ? '16px' : '', fontWeight: isShowUnderline ? '600' : '' }" class="text-base1 cursor">
            {{ tab.tabName }}
            <span v-if="tabCounter[index] != null"> ({{ tabCounter[index] }})</span>
          </span>
          <span v-if="type === 'icon'" class="cursor">
            <base-icon :icon="tab.iconName" size="24" />
          </span>
        </div>
      </div>
      <div slot="append" class="tab-slot">
        <slot name="append"></slot>
      </div>
    </div>
    <template v-if="mode === 'show'">
      <div v-for="(tab, index) in arrayTab" :key="`show + ${index}`" class="tab-content">
        <component :is="tab.component" v-show="tab.value === tabActive.value" :ref="tab.ref" v-bind="tab.props" />
      </div>
    </template>
    <template v-if="mode === 'if'">
      <div v-for="(tab, index) in arrayTab" :key="`if + ${index}`" class="tab-content">
        <component
          :is="tab.component"
          v-if="tab.value === tabActive.value"
          :ref="tab.ref"
          v-bind="tab.props"
          @counter="
            number => {
              tabCounter[index] = number
            }
          "
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import TabCarousel from '@/components/base/tab/TabCarousel.vue'
  import ChartMobile from '@/modules/exchanges/components/chart/ChartMobile.vue'
  import Header from '@/modules/exchanges/view/mobile/Header.vue'
  import HistoryTrade from '@/modules/exchanges/components/history-trade/HistoryTrade.vue'
  import TradeLimit from '@/modules/exchanges/components/Trade/TradeLimit.vue'
  import TradeMarket from '@/modules/exchanges/components/Trade/TradeMarket.vue'
  import DynamicTable from '@/modules/exchanges/components/order-book/DynamicTable.vue'
  import MarketTrades from '@/modules/exchanges/components/trade-exchange/MarketTrades.vue'

  interface ITab {
    id: number
    tabName: string
    type?: string | null
    component?: string | null
    value?: string | null
    [x: string]: any
  }

  @Component({
    components: { TabCarousel, HistoryTrade, TradeLimit, TradeMarket, DynamicTable, MarketTrades, ChartMobile, Header }
  })
  export default class TradeTab extends Vue {
    @Prop({ required: true, type: Array, default: () => [] }) arrayTab!: Array<ITab>
    @Prop({ required: false, type: Boolean, default: false }) isShowUnderline!: boolean
    @Prop({ required: false, type: String, default: 'text' }) type!: string
    @Prop({ required: false, type: String, default: 'show' }) mode!: string
    tabActive: Record<string, any> = {}
    tabCounter: any[] = []

    get currentProps() {
      console.log(this.tabActive.component.toLowerCase())
      return this.tabActive.component.toLowerCase()
    }

    @Watch('arrayTab', { deep: true, immediate: true }) changeArrayTab() {
      this.tabCounter = this.arrayTab.map(item => {
        return null
      })
    }

    created(): void {
      this.tabActive = this.arrayTab[0]
    }

    handleClickTabActive(tab: Record<string, any>): void {
      this.tabActive = tab
      console.log(this.tabActive)
      this.$emit('changeTab', this.tabActive)
    }
  }
</script>

<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }

  .tab-base {
    display: flex;
    flex-direction: column;
    //flex-direction: row;
    //justify-content: space-between;
    //align-items: center;
    .tab-list,
    .tab-list-scroll {
      @include text(14px, 24px, 400, var(--color-text-secondary));
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .tab-header {
        display: flex;

        .tab-item {
          padding: 16px;
          //padding-right: 11px;
          position: relative;
          //color: var(--bc-text-color-tab-item);
          &:hover {
            background: var(--color-tab-active-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .tab-icon {
          opacity: 0.5;
          //padding: 11px;
        }

        .tab-active {
          background: var(--color-tab-active-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 400;
        }

        .tab-normal {
          padding: 14px 41px;
        }

        .tab-underline {
          padding: 14px 41px;

          &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: 0;
            left: 0;
            background: var(--color-tab-active-primary);
          }
        }
      }
    }

    .tab-list-scroll {
      .tab-header {
        .tab-item {
          padding: 0 12px 0 0;
        }
      }
    }
  }

  .underline-border {
    border-bottom: 1px solid var(--color-border-primary);
  }

  @media screen and (max-width: 768px) {
    .tab-base {
      .tab-list,
      .tab-list-scroll {
        @include text(14px, 20px, 400, var(--color-text-secondary));

        .tab-header {
          .tab-item {
            padding: 0;
            margin-right: 16px;
            cursor: pointer;
            white-space: nowrap;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>
