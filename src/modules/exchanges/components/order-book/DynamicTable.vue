<template>
  <div class="dynamic-table" :class="tableTheme" ref="dynamic-table">
    <dynamic-header-table v-if="isShowHeader" :headerArr="['Price (USDT)', 'Amount (LYNK)', 'Total']" />
    <div class="dynamic-table__content" :class="!isScrollable && 'dynamic-table__content--hidden-scroll'" @mouseleave="resetAnalystic" @mousemove="getOverlayPostition">
      <recycle-scroller
        :items="tableData"
        key-field="_id"
        :item-size="rowHeight"
        v-if="isScrollable"
        v-slot="{ item, index, active }"
        ref="dynamic-table-scroller"
        class="h-100 dynamic-table-scroller scroll-custom-exchange"
      >
        <!-- <template > -->
        <div class="dynamic-row" @mouseenter="e => analysisRange(e, item, index)" v-if="active">
          <span class="dynamic-col--analystics" :style="getAnalysticStyle(index)" v-show="isShowItem(index)" v-if="isEnableAnalys"> </span>
          <span class="dynamic-col--owner"> <div class="dot" v-if="item.isOwner"></div></span>
          <span class="dynamic-col--bar" :style="{ width: `calc(${item.remain}% - 16px)` }" v-show="item.remain > 0"></span>
          <span class="dynamic-col" v-for="(value, index) in item.dataset" :key="index" :class="index == 0 && 'dynamic-col--first-item'">{{ value }}</span>
        </div>
        <!-- </template> -->
      </recycle-scroller>
      <div class="dynamic-row" v-else v-for="(item, index) in staticTableData" :key="item._id" @mouseenter="e => analysisRange(e, item, index)">
        <span class="dynamic-col--analystics" :style="getAnalysticStyle(index)" v-show="isShowItem(index)" v-if="isEnableAnalys"> </span>
        <span class="dynamic-col--owner"> <div class="dot" v-if="item.isOwner"></div></span>
        <span class="dynamic-col--bar" :style="{ width: `calc(${item.remain}% - 16px)` }" v-show="item.remain > 0"></span>
        <span class="dynamic-col" v-for="(value, index) in item.dataset" :key="index" :class="index == 0 && 'dynamic-col--first-item'">{{ value }}</span>
      </div>
    </div>
    <div class="dynamic-table__overlay" :style="{ top: overlayTopPosition }" v-show="isShowOverlay" v-if="isEnableAnalys">
      <div class="overlay-item">
        <span>Avg.Price:</span>
        <span>≈ {{ analysticData.avgPrice | formatNumber }}</span>
      </div>
      <div class="overlay-item">
        <span>Sum LYNK:</span>
        <span> {{ analysticData.totalToken | formatNumber }}</span>
      </div>
      <div class="overlay-item">
        <span>Sum USDT:</span>
        <span> {{ analysticData.totalTokenExchange | formatNumber }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  import { RecycleScroller } from 'vue-virtual-scroller'
  import DynamicHeaderTable from './DynamicHeaderTable.vue'

  import { nextTick } from 'process'

  @Component({ components: { RecycleScroller, DynamicHeaderTable } })
  export default class DynamicTable extends Vue {
    @Prop({ required: false, type: Boolean, default: true }) isEnableAnalys!: boolean
    @Prop({ required: false, type: Boolean, default: true }) isShowHeader!: boolean
    @Prop({ required: false, type: Boolean, default: true }) isScrollable!: boolean
    @Prop({ required: false, type: String, default: 'NONE' }) tradingType!: string
    @Prop({ required: false, type: Number, default: 10 }) maxRowSize!: number

    rowHeight = 24 // row height
    overlayTopPosition = '0px'
    isShowOverlay = false
    analysticTargetIndex = 0
    // analysticData: Record<string, any> = {
    //   avgPrice: 0,
    //   totalToken: 0,
    //   totalTokenExchange: 0
    // }

    tableData: Array<Record<string, any>> = [
      {
        _id: `00`,
        dataset: [(20128.82 + Math.random() * 10).toFixed(2), (0.157858 + Math.random() * 1).toFixed(5), (3182.23 + Math.random() * 10).toFixed(5)],
        remain: Math.round(Math.random() * 100),
        isOwner: Math.random() < 0.5 ? true : false
      }
    ]

    // tradingType: 'SELL' | 'BUY' | 'NONE' = 'SELL'
    timer: any = null

    created(): void {
      // console.log('dynamic table')
      for (let i = 0; i < 500; i++) {
        this.tableData.push({
          _id: `${i}`,
          dataset: [(20128.82 + Math.random() * 10).toFixed(2), (0.157858 + Math.random() * 1).toFixed(5), (3182.23 + Math.random() * 10).toFixed(5)],
          remain: Math.round(Math.random() * 100),
          isOwner: Math.random() < 0.5 ? true : false
        })
      }
      this.timer = setInterval(() => {
        if (this.tradingType === 'SELL') {
          this.tableData.push({
            _id: `${Date.now()}`,
            dataset: [(20128.82 + Math.random() * 10).toFixed(2), (0.157858 + Math.random() * 1).toFixed(5), (3182.23 + Math.random() * 10).toFixed(5)],
            remain: Math.round(Math.random() * 100),
            isOwner: Math.random() < 0.5 ? true : false
          })
          this.tableData.shift()
        } else {
          this.tableData.unshift({
            _id: `${Date.now()}`,
            dataset: [(20128.82 + Math.random() * 10).toFixed(2), (0.157858 + Math.random() * 1).toFixed(5), (3182.23 + Math.random() * 10).toFixed(5)],
            remain: Math.round(Math.random() * 100),
            isOwner: Math.random() < 0.5 ? true : false
          })
          this.tableData.pop()
        }
      }, 1000)
    }
    destroy(): void {
      clearInterval(this.timer)
    }

    analysisRange(e: any, item: Record<string, any>, index: number): void {
      this.isShowOverlay = true
      this.analysticTargetIndex = index
      // console.log(index)
    }

    resetAnalystic(): void {
      this.analysticTargetIndex = 0
      this.isShowOverlay = false
    }

    getOverlayPostition(e: any): void {
      const tableContent = this.$refs['dynamic-table'] as HTMLDivElement
      const rect = tableContent.getBoundingClientRect()
      this.overlayTopPosition = Math.floor((e.pageY - rect.top) / this.rowHeight) * this.rowHeight + 'px'
    }

    scrollToBottom(): void {
      nextTick(() => {
        // @ts-ignore
        const dynamicTable = this.$refs['dynamic-table-scroller'].$el as HTMLDivElement
        dynamicTable.scrollTop = dynamicTable.scrollHeight
        console.log(dynamicTable.scrollTop, dynamicTable.scrollHeight)
      })
    }

    get tableTheme(): string {
      if (this.tradingType === 'BUY') {
        return 'table-buy'
      } else if (this.tradingType === 'SELL') {
        return 'table-sell'
      } else {
        return ''
      }
    }

    get staticTableData(): Array<Record<string, any>> {
      return this.tableData.slice(0, this.maxRowSize)
    }

    getAnalysticStyle(index: number): Record<string, any> {
      if (this.tradingType === 'BUY') {
        return {
          height: `${this.rowHeight}px`,
          borderBottom: this.analysticTargetIndex === index ? '1px dashed #ccc' : 'none'
        }
      } else if (this.tradingType === 'SELL') {
        return {
          height: `${this.rowHeight}px`,
          borderTop: this.analysticTargetIndex === index ? '1px dashed #ccc' : 'none'
        }
      } else {
        return { display: 'none' }
      }
    }

    get analysticTargetRange(): Record<string, any> {
      if (this.tradingType === 'BUY') {
        return {
          from: 0,
          to: this.analysticTargetIndex
        }
      } else if (this.tradingType === 'SELL') {
        return {
          from: this.analysticTargetIndex,
          to: this.isScrollable ? this.tableData.length : this.maxRowSize
        }
      } else {
        return {
          from: this.analysticTargetIndex,
          to: this.analysticTargetIndex
        }
      }
    }

    get analysticData(): Record<string, any> {
      let avgPrice = 20200,
        totalToken = 0,
        totalTokenExchange = 0

      let tableRangeAnalystic = this.tableData.slice(this.analysticTargetRange.from, this.analysticTargetRange.to)
      tableRangeAnalystic.forEach(record => {
        totalToken += parseFloat(record.dataset[1])
        totalTokenExchange += parseFloat(record.dataset[2])
      })
      avgPrice = totalTokenExchange / totalToken
      return {
        avgPrice: avgPrice.toFixed(2),
        totalToken: totalToken.toFixed(2),
        totalTokenExchange: totalTokenExchange.toFixed(2)
      }
    }

    isShowItem(index: number): boolean {
      return this.analysticTargetRange.from <= index && this.analysticTargetRange.to >= index && this.isShowOverlay
    }
  }
</script>

<style lang="scss">
  .dynamic-table {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .dynamic-table__header {
      padding-right: 14px;
      .dynamic-row {
        margin-top: 0;
        margin-bottom: 0;
        height: 16px;
      }
    }
    .dynamic-table__content {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: auto;
      &--hidden-scroll {
        overflow: hidden !important;
      }
      .dynamic-table-scroller {
        padding-right: 10px;
      }
    }
    .dynamic-table__overlay {
      position: absolute;
      left: -6px;
      top: 0;
      width: 196px;
      // height: 80px;
      transform: translate(-100%, -50%);
      background: #5e6673;
      border-radius: 6px;
      padding: 8px;
      z-index: 100;
      transition: all 0.1s ease;
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        width: 0;
        height: 0;
        transform: translate(100%, -50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 6px solid #5e6673;
      }
      .overlay-item {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        color: var(--color-text-primary);
        font-size: 14px;
        line-height: 16px;
        font-weight: 400;
      }
    }

    // ==================
    .dynamic-row {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 20px;
      margin-top: 4px;

      &:first-child {
        margin-top: 0;
      }

      &--header {
        .dynamic-col {
          color: var(--color-text-secondary) !important;
        }
      }

      &:hover {
        cursor: pointer;
      }

      .dynamic-col {
        position: relative;
        width: calc((100% - 16px) / 3);
        color: var(--color-text-primary);
        text-align: right;
        font-size: 12px;
        line-height: 16px;
        font-weight: 400;
        &--first-item {
          text-align: left;
        }
      }
      .dynamic-col--owner {
        position: relative;
        height: 100%;
        width: 16px;
        .dot {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .dynamic-col--bar {
        position: absolute;
        display: none;
        right: 0;
        top: 0;
        height: 100%;
        width: 100%;
      }
      .dynamic-col--analystics {
        position: absolute;
        width: 100%;
        background: #2b31399e;
      }
    }
  }
  .table-sell {
    .dynamic-row {
    }
    .dynamic-col {
      &--first-item {
        color: var(--color-sell-primary) !important;
      }
    }
    .dynamic-col--owner {
      .dot {
        background: var(--color-sell-primary);
      }
    }
    .dynamic-col--bar {
      display: block !important;
      background: var(--color-order-book-sell);
    }
  }
  .table-buy {
    .dynamic-row {
    }
    .dynamic-col {
      &--first-item {
        color: var(--color-buy-primary) !important;
      }
    }
    .dynamic-col--owner {
      .dot {
        background: var(--color-buy-primary);
      }
    }
    .dynamic-col--bar {
      display: block !important;
      background: var(--color-order-book-buy);
    }
  }
</style>
