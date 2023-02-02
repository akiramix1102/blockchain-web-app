<template>
  <div class="">
    <span class="header-filter" v-if="isShowFilter === true">
      <div v-for="item in listTab" class="time-filter" :key="item.key">{{ item.title }}</div>

      <div class="time-picker">
        <span>Time</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="To"
          start-placeholder="YYYY-MM-DD"
          end-placeholder="YYYY-MM-DD"
          :picker-options="{ disabledDate: time => disabledEndDate(time) }"
        >
        </el-date-picker>
      </div>
      <div class="btn-item">
        <div class="item mr-2"><el-button class="btn-exchange"> Search </el-button></div>
        <div class="item"><el-button class="btn-exchange"> Reset </el-button></div>
      </div>
    </span>

    <el-table :data="tableData" class="history-table">
      <div slot="empty" v-if="tableData.length === '0'" class="text-empty">You have no open orders</div>
      <el-table-column prop="pair" label="Pair" width="180"> </el-table-column>
      <el-table-column prop="date" label="Date" align="left" width="300"> </el-table-column>
      <el-table-column prop="odertype" label="Oder Type" v-if="type !== 'Trade'"> </el-table-column>
      <el-table-column
        prop="side"
        label="Side"
        :filters="[
          { text: 'Sell', value: 'Sell' },
          { text: 'Buy', value: 'Buy' }
        ]"
        :filter-method="filterTag"
        filter-placement="bottom"
        :filter-multiple="false"
      >
        <template slot-scope="scope" class="filter-custom">
          <div :class="scope.row.side == 'Sell' ? 'red' : 'green'">{{ scope.row.side }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="avgPrice" label="Avg.Price" align="right" v-if="type === 'History'"> </el-table-column>
      <el-table-column prop="price" label="Price" align="right"> </el-table-column>
      <el-table-column prop="amount" label="Amount" align="right" v-if="type !== 'Trade'"> </el-table-column>
      <el-table-column prop="filled" label="Filled" align="right" v-if="type !== 'Trade'"> </el-table-column>

      <el-table-column prop="executed" label="Executed" align="right" v-if="type === 'Trade'"> </el-table-column>
      <el-table-column prop="fee" label="Fee" align="right" v-if="type === 'Trade'"> </el-table-column>
      <el-table-column prop="total" label="Total" align="right"> </el-table-column>
      <el-table-column prop="cancle" align="right" v-if="type === 'Orders'">
        <template slot="header">
          <div class="exchange-text-active" @click="handelCanel">Cancel all</div>
        </template>
        <template slot-scope="scope">
          <div size="mini" type="danger" class="exchange-text-cancel-blue" @click="handleDelete(scope.$index, scope.row)">Cancel</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type === 'History'"
        align="right"
        prop="status"
        label="Status"
        :filters="[
          { text: 'Filled', value: 'Filled' },
          { text: 'Partially Filled', value: 'Partially Filled' },
          { text: 'Canceled', value: 'Canceled' },
          { text: 'Expried', value: 'Expried' }
        ]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        :filter-multiple="false"
      >
        <template slot-scope="scope" class="filter-custom">
          <div :class="scope.row.status == 'Canceled' ? 'canceled' : ''">{{ scope.row.status }}</div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination :table="query" :info="getPaginationInfo" class="pangination-trade mr-24 ml-16 mt-22" popperClass="custom-panigationTrade" />
    <PopupCancelAll></PopupCancelAll>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupCancelAll from './PopupCancelAll.vue'
  // import getRepository from '@/services'
  // import TradeRepository from '@/services/repositories/trade'

  // const apiTrade: TradeRepository = getRepository('trade')

  @Component({ components: { PopupCancelAll } })
  export default class HistoryTrade extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Boolean, default: false }) isShowFilter!: boolean
    @Prop({ required: false, type: String, default: 'Orders' }) type!: string
    value1 = ''
    query: Record<string, any> = {
      page: 1,
      page_size: 20
    }

    tableData = [
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Filled'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Filled'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Buy',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Filled'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Buy',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Partially Filled '
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Canceled'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Partially Filled'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Partially Filled'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Expried'
      }
    ]
    listTab = [
      {
        key: '1D',
        title: '1 Day'
      },
      {
        key: '7D',
        title: '1 Week'
      },
      {
        key: '1M',
        title: '1 Month'
      },
      {
        key: '3M',
        title: '3 Month'
      }
    ]

    // async created(): Promise<void> {
    //   this.getOpenOders()
    // }
    // async getOpenOders(): Promise<any> {
    //   const rs = await apiTrade.getOderSearch({
    //     page: 0,
    //     page_size: 20
    //   })
    //   console.log(rs)
    // }
    handelCanel() {
      this.setOpenPopup({
        popupName: 'popup-cancel-all',
        isOpen: true
      })
      console.log('sá')
    }
    disabledEndDate(date) {
      // If departureDate then return valid dates after departureDate
      // if (departureDate) {
      //   return date.getTime() < departureDate
      // } else {
      // If !departureDate then return valid dates after today
      return date.getTime() > Date.now()
      // }
    }
    get getPaginationInfo(): string {
      return this.$t('paging.orders') as string
    }

    filterTag(value: any, row: any): boolean {
      return row.side === value
    }
    filterStatus(value: any, row: any): boolean {
      return row.status === value
    }
    handleDelete(index: any, row: any): void {
      console.log(index)
      // apiTrade.cancelOrder({
      //   id: 1
      // })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.base-pagination {
    border: none !important;
    // margin-top: -90px;
    /* border-top: 1px solid #dbdbdb; */
  }
  .header-filter {
    background-color: transparent;
    margin-left: 16px;
    display: flex;
    margin-bottom: 24px;
  }
  .el-button {
    width: 80px;
    color: var(--color-text-primary);
    background-color: var(--color-background-element);
    border: 1px solid var(--color-border-primary);
  }
  .item :hover {
    // border: 1px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(to right bottom, #6a5af9, #f62682);
  }
  .red {
    color: var(--color-sell-primary);
  }
  .green {
    color: var(--color-buy-primary);
  }
  .canceled {
    color: var(--color-icon-sort);
  }
  .time-filter {
    text-align: center;
    align-items: center;
    cursor: pointer;
    width: 80px;
    height: 32px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: var(--color-text-secondary);
    margin-top: 5px;
    padding-top: 3px;
    &:hover {
      color: var(--color-text-primary);
      background-color: var(--color-background-element);
      border: 1px solid var(--color-background-filter);
    }
  }
  .time-picker {
    margin-left: 24px;
    span {
      color: var(--color-text-secondary);
    }
  }

  ::v-deep.time-picker {
    .el-range-input::placeholder {
      color: var(--color-border-primary) !important;
    }
  }

  // .el-table-filter__list-item.is-active {
  //   background-color: transparent;
  //   background: linear-gradient(90deg, #b32df0 9.85%, #204cfe 65.37%, #1660fe 80.9%, #2e89ff 100%);
  //   -webkit-background-clip: text;
  //   -webkit-text-fill-color: transparent;
  //   font-weight: 600;
  // }

  .text-empty {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: var(--color-icon-sort);
    height: 150px;
    margin-top: 1 5%;
  }
  // .el-input__inner {
  //   background: transparent;
  // }
</style>
<style lang="scss" scoped>
  .history-table {
    .cell {
      line-height: 16px;
    }
    margin-top: -12px;
    margin-left: 16px;
    // width: 98%;
    margin-right: 16px;
    width: auto;

    th.el-table__cell.is-leaf {
      border-bottom: 1px solid var(--color-background-filter);
    }

    tr th {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: var(--color-text-secondary);
    }
    th.el-table__cell {
      background-color: transparent;
    }
    color: var(--color-text-primary);
    background-color: transparent;
    &::before {
      background-color: var(--color-background-filter);
    }
    background: transparent;
    tr {
      background: transparent;
    }
    th {
      background: transparent;
      // &:hover {
      //   background-color: var(--color-background);
      // }
      // td {
      //   &:hover {
      //     background-color: var(--color-background);
      //   }
      // }
    }

    .el-table__body-wrapper {
      overflow-y: auto;
      .el-table__row {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
        &:hover td {
          background-color: rgba($color: var(--color-border-primary), $alpha: 0.4) !important;
        }
      }
      .el-table__cell {
        border-bottom: 1px solid var(--color-background-filter);
        font-size: 12px;
        padding: 11px 0px !important;
      }
    }
  }
  .pangination-trade .custom-pagination .el-input__inner {
    color: var(--color-text-primary);
    background: var(--color-background-element);
    border: 1px solid var(--color-background-filter);
  }
  .pangination-trade .custom-pagination .el-input__inner:hover {
    background: var(--bc-tab-active);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -o-border-image: var(--bc-paging-boder);
    border-image: var(--bc-paging-boder);
  }

  .pangination-trade .custom-pagination .btn-prev {
    background: var(--color-background-element);
    border: 1px solid var(--color-background-filter);
  }
  .pangination-trade .custom-pagination .btn-next {
    background: var(--color-background-element);
    border: 1px solid var(--color-background-filter);
  }
  .el-pagination .btn-prev .el-icon {
    color: var(--color-custom-scroll);
  }
  .el-pagination .btn-next .el-icon {
    color: var(--color-custom-scroll);
  }
  .el-table-filter__list-item {
    color: var(--color-text-primary);
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 12px;
    width: 120px;
    font-size: 12px;
    line-height: 16px;
  }
  .el-icon-arrow-down:before {
    content: url('/img/icons/Arrow down.svg');
  }
  .el-table__column-filter-trigger {
    line-height: 0px;
    position: absolute;
    top: 1px;
  }
  .el-table-filter__list {
    padding: 0px;
  }
  .el-table-filter__list-item.is-active {
    background-color: transparent;
    background: linear-gradient(90deg, #b32df0 9.85%, #204cfe 65.37%, #1660fe 80.9%, #2e89ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  }
  .el-table-filter__list-item:hover {
    background-color: var(--color-background-filter);
    color: var(--color-text-primary);
  }
  .el-table-filter {
    color: var(--color-text-primary);
    background-color: var(--color-background-element);
    border: 1px solid var(--color-border-primary);
    // left: 440px !important;
  }
  .el-popper {
    // background: #21242a;
    border: none;
  }
  // .el-date-table td.today {
  //   border: none;
  //   border-image-slice: 1;
  //   border-image-source: linear-gradient(to right bottom, #6a5af9, #f62682);
  // }
  .el-picker-panel__body-wrapper {
    background: var(--color-background-element);
    // border: none;
  }
  .el-picker-panel {
    color: var(--color-text-primary);
  }
  .el-date-range-picker__content.is-left {
    border: none;
  }
  .el-range-editor.el-input__inner {
    border: none;
    background: transparent;
    ::v-deep.el-range-input {
      background: transparent !important;
    }
    ::v-deep.el-range-separator {
      color: var(--color-text-secondary);
    }
  }
  // .el-input__inner::-webkit-input-placeholder {
  //   color: red;
  //   font-size: 16px;
  // }
  .el-date-table th {
    border: none;
  }
  ::v-deep.el-table__empty-block {
    .el-table__empty-text {
      display: none;
    }
  }
  .el-range-input {
    background-color: transparent;
  }
  // .el-date-table td.start-date span {
  //   // background: var(--color-tab-active-primary);
  //   // color: white !important;
  // }
  // // .el-date-table td.end-date span {
  // //   background: var(--color-tab-active-primary);
  // // }
  .el-date-table td.disabled div {
    background: transparent !important;
    span {
      color: var(--color-custom-scroll);
    }
  }
  .el-date-table td.prev-month {
    color: var(--color-icon-sort);
  }
  .el-date-table td.in-range div {
    background: rgba(39, 117, 219, 0.1);
  }
  .el-table th.el-table__cell > .cell.highlight {
    color: var(--color-text-secondary);
  }

  .el-date-table td.in-range div:hover {
    background-color: transparent;
  }
  .btn-item {
    display: flex;
  }
  // .item {
  //   margin-right: ;
  // }
  .custom-panigationTrade {
    background: var(--color-border-primary);
  }
  .el-select-dropdown .el-scrollbar .el-select-dropdown__list .el-select-dropdown__item {
    color: var(--color-text-primary);
  }
  .el-select .is-focus .el-input__inner {
    border-color: var(--color-border-primary) !important;
  }
  .pangination-trade .custom-pagination .el-input__inner:focus {
    border-color: var(--color-border-primary) !important;
  }
</style>
