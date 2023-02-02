<template>
  <div class="">
    <div class="header-filter-mobile">
      <div class="left-filter-mobile"></div>
      <div class="right-filter-mobile">
        <div>
          <el-button>Cancel all</el-button>
        </div>
      </div>
    </div>
    <div class="container-content-trade scroll-custom-exchange">
      <div class="content-trade-mobile" v-for="item in data" :key="item.id">
        <div class="header-content-trade">
          <div class="title-header">LINK/USDT</div>
          <div class="date-header">2022-12-15 18:55:22</div>
        </div>
        <div class="footer-content-trade">
          <div class="left-footer-content-trade">
            <div class="filled">
              <div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style="--value: 30"></div>
            </div>
            <div class="mt-8">
              <div class="title-footer" v-if="type !== 'Trade'">Oder type</div>
              <div class="title-footer">Side</div>
              <div class="title-footer" v-if="type === 'History'">Avg.price</div>
              <div class="title-footer">Price</div>
              <div class="title-footer" v-if="type !== 'Trade'">Amount</div>
              <div class="title-footer" v-if="type === 'Trade'">Executed</div>
              <div class="title-footer" v-if="type === 'Trade'">Fee</div>
              <div class="title-footer">Total</div>
              <div class="title-footer" v-if="type === 'History'">Status</div>
            </div>
          </div>
          <div class="right-footer-content-trade">
            <div class="mt-8">
              <div class="trade-footer" v-if="type !== 'Trade'">{{ item.odertype }}</div>
              <div class="trade-footer" :class="item.side == 'Sell' ? 'exchange-text-sell' : 'exchange-text-buy'">{{ item.side }}</div>
              <div class="trade-footer" v-if="type === 'History'">{{ item.avgPrice }}</div>
              <div class="trade-footer">{{ item.price }}</div>
              <div class="trade-footer" v-if="type !== 'Trade'">{{ item.amount }}</div>
              <div class="trade-footer" v-if="type === 'Trade'">{{ item.executed }}</div>
              <div class="trade-footer" v-if="type === 'Trade'">{{ item.fee }}</div>
              <div class="trade-footer">{{ item.total }}</div>
              <div class="trade-footer" v-if="type === 'History'">{{ item.status }}</div>
            </div>
            <div class="btn-cancel"><el-button>Cancel</el-button></div>
          </div>
        </div>
      </div>
    </div>
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

    data = [
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        avgPrice: '1.0900',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Filled',
        executed: '914.231 LYNK',
        fee: '0.07 USDT'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Sell',
        avgPrice: '1.0900',
        price: '1.0800',
        amount: '2,758,9225',
        filled: '10%',
        total: '315.22 USDT',
        date: '2022-12-15 18:55:22',
        status: 'Filled',
        executed: '914.231 LYNK',
        fee: '0.07 USDT'
      },
      {
        pair: 'LINK/USDT',
        odertype: 'Market',
        side: 'Buy',
        price: '1.0800',
        avgPrice: '1.0900',
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
        avgPrice: '1.0900',
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
        avgPrice: '1.0900',
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
  ::v-deep.el-button {
    color: white;
    background-color: var(--color-background-filter);
    border: none;

    border-radius: 4px;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    // margin-right: 0px;
  }
  .header-filter-mobile {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;

    // ::v-deep.el-button {
    //   color: white;
    //   background-color: var(--color-background-filter);
    //   border: none;

    //   border-radius: 4px;
    //   font-weight: 400;
    //   font-size: 12px;
    //   line-height: 16px;
    //   // margin-right: 0px;
    // }
  }
  .container-content-trade {
    overflow-y: auto;
    height: 460px;
    .content-trade-mobile {
      margin-top: 16px;
      border-top: 1px solid #31353e;

      .header-content-trade {
        margin-top: 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .title-header {
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          /* identical to box height, or 143% */

          color: #ffffff;
        }
        .date-header {
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          /* identical to box height, or 133% */

          /* Dark color/Text description */

          color: #999999;
        }
      }
      .footer-content-trade {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .left-footer-content-trade {
          display: flex;
          flex-direction: row;
          .filled {
            margin-top: 16px;
            margin-right: 24px;
          }
          .title-footer {
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            /* identical to box height, or 133% */

            /* Text/Disabled */
            margin-top: 8px;
            color: #89909e;
          }
        }
        .right-footer-content-trade {
          display: flex;
          flex-direction: row;
          // .trade-footer-container {
          //   display: flex;
          //   align-items: flex-end;
          // }
          .trade-footer {
            text-align: right;
            margin-top: 8px;
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            /* identical to box height, or 133% */

            /* Dark color/Text content */

            color: #ececec;
          }
          .btn-cancel {
            margin-left: 36px;
            margin-bottom: 20px;
            display: flex;
            align-items: flex-end;
          }
        }
      }
    }
  }
</style>
