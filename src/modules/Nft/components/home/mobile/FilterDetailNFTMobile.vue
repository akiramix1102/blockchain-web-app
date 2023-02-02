<template>
  <div class="filter-mobile be-flex jc-space-between">
    <el-form class="be-flex form-filter">
      <el-form-item class="mr-16 select-status">
        <el-select v-model="filter.transactionType" @change="handleChangeTransactionType" :placeholder="$t('placeholder.all-event')" clearable>
          <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="cursor button" @click="handleSetOpenDrawer">
      <base-icon icon="icon-filter" class="d-iflex" />
    </div>
    <base-drawer class="drawer" name="filter-collection" title="Filter" size="100%" :reset="reset">
      <div class="blockchain">
        <span class="text-semibold nft-body-base-small">{{ $t('filter-detail-nft-event') }}</span>
        <el-form>
          <el-form-item>
            <el-select v-model="filter.transactionType" @change="handleChangeTransactionType" :placeholder="$t('placeholder.all-event')" clearable>
              <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="category">
        <span class="text-semibold nft-body-base-small">Time</span>
        <el-form>
          <el-form-item>
            <el-select :placeholder="$t('placeholder.all-time')" clearable v-model="time" @change="handleChangeTime">
              <el-option v-for="item in arrTime" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="sale-status" v-if="changeTabAcitve === 'BID'">
        <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.sale-status') }}</span>
        <div class="status-item be-flex mt-8">
          <div v-for="item in getArrFilterSaleStatus" :key="item.id" plain class="nft-body-base status">{{ item.title }}</div>
        </div>
      </div> -->
      <div class="price">
        <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.price') }}</span>
        <div class="wrap-inside">
          <div class="wrap-form">
            <el-form class="be-flex jc-space-between">
              <el-form-item class="slide-price mr-16">
                <el-input
                  class="left"
                  disabled
                  v-model="getFromPrice"
                  :placeholder="$t('placeholder.from')"
                  clearable
                  @input="handleChangeFromPrice"
                  @keypress.native="onlyNumber($event, 'fromPrice')"
                  @keyup.native="numberFormat($event)"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  class="right"
                  disabled
                  v-model="getToPrice"
                  :placeholder="$t('placeholder.to')"
                  clearable
                  @input="handleChangeToPrice"
                  @keypress.native="onlyNumber($event, 'toPrice')"
                  @keyup.native="numberFormat($event)"
                />
              </el-form-item>
              <div v-if="isErrorFrom" class="error-amount">
                <p>{{ $t('nft.error-from') }}</p>
              </div>
            </el-form>
            <el-slider v-model="valueRange" range :max="maxPrice" :format-tooltip="formatTooltip" tooltip-class="tooltip-price" @change="changeSlider" ref="rangeSlider">
            </el-slider>
          </div>
        </div>
      </div>
      <!-- <div v-if="changeTabAcitve === 'BID'" class="property">
        <span class="text-semibold nft-body-base-small">Property</span>
        <el-form>
          <el-form-item>
            <el-select value="Option 1"> </el-select>
          </el-form-item>
          <el-form-item>
            <el-select value="Option 2"> </el-select>
          </el-form-item>
          <el-form-item>
            <el-select value="Option 3"> </el-select>
          </el-form-item>
          <el-form-item>
            <el-select value="Option 4"> </el-select>
          </el-form-item>
        </el-form>
      </div> -->
      <div class="sort">
        <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.sort') }}</span>
        <el-form>
          <el-form-item>
            <el-select v-model="filter.sort" popper-class="text-base-nft popper-explore-select-category " placeholder="Sort" clearable>
              <el-option v-for="item in sorts" :key="item.index" :label="item.label" :value="item.command" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="apply-btn">
        <el-button class="el-button nft-header6 text-semibold text-center bid el-button-custom el-button--default btn-apply" @click="handleApplyFilter">{{
          $t('button.apply')
        }}</el-button>
      </div>
    </base-drawer>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'

  import DrawerMixin from '@/mixins/drawer'
  import { namespace } from 'vuex-class'
  import FilterPriceNft from '@/mixins/filterPriceNft'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  interface IFilter {
    roundId?: number
    status?: number
    price?: number
    orderBy?: string
    toPrice?: number | null
    fromPrice?: number | null
    [x: string]: any
  }
  @Component({ components: {} })
  export default class FilterCollectionDetailMobile extends Mixins(DrawerMixin, FilterPriceNft) {
    // @Prop({ required: true, type: Number, default: 0 }) tabActive!: number
    @Prop({ required: true, type: String, default: 'ACTIVITY' }) changeTabAcitve!: string
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @bcNft.State('isDesktop') isDesktop!: boolean

    @bcAuth.State('featureConfig') featureConfig!: Record<string, boolean>
    @beBase.State('coinMain') coinMain!: string
    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @bcAuth.Getter('isOffer') isOffer!: boolean
    drawer = false
    direction = 'ltr'

    get getFromPrice(): string {
      return this.fromPrice === '' ? 'From' : '$ ' + this.fromPrice
    }
    get getToPrice(): string {
      return this.toPrice === '' ? 'To' : '$ ' + this.toPrice
    }

    handleSetOpenDrawer(): void {
      this.setOpenDrawer({
        drawerName: 'filter-collection',
        isOpen: true
      })
    }
    statusArrow = false
    sortActive = 0
    valueRange = [0, 0]
    filter: IFilter = {
      saleStatus: '',
      orderBy: 'CREATED_AT_DESC',
      transactionType: '',
      sort: 'Lastest  '
    }

    time = ''

    arrTime: Array<Record<string, any>> = [
      {
        id: 1,
        title: this.$t('nft.filter.last-7day'),
        value: 7
      },
      {
        id: 2,
        title: this.$t('nft.filter.last-14day'),
        value: 14
      },
      {
        id: 3,
        title: this.$t('nft.filter.last-30day'),
        value: 30
      },
      {
        id: 4,
        title: this.$t('nft.filter.last-60day'),
        value: 60
      },
      {
        id: 5,
        title: this.$t('nft.filter.last-90day'),
        value: 90
      },
      {
        id: 6,
        title: this.$t('nft.filter.last-year'),
        value: 365
      }
    ]
    arrType: Array<Record<string, any>> = [
      {
        id: 0,
        title: 'Blockchain',
        value: 'blockchain'
      }
    ]
    arrStatus: Array<Record<string, any>> = [
      {
        id: 2,
        title: this.$t('nft.filter.on-sale'),
        value: 'ON_SALE'
      },
      {
        id: 3,
        title: this.$t('nft.filter.not-for-sale'),
        value: 'NOT_FOR_SALE'
      }
    ]
    arrIsVerified: Array<Record<string, any>> = [
      {
        id: 1,
        title: this.$t('nft.filter.verified'),
        value: 'YES'
      },
      {
        id: 2,
        title: this.$t('nft.filter.un-verified'),
        value: 'NO'
      }
    ]

    sorts: Array<Record<string, any>> = [
      {
        command: 'CREATED_AT_DESC',
        label: this.$t('nft.sort.latest')
      },
      {
        command: 'CREATED_AT_ASC',
        label: this.$t('nft.sort.oldest')
      },
      {
        command: 'PRICE_DESC',
        label: this.$t('nft.sort.price-high')
      },
      {
        command: 'PRICE_ASC',
        label: this.$t('nft.sort.price-low')
      }
    ]
    // @Watch('changeTabAcitve') watchTabActive(): void {
    //   this.filter.saleStatus = ''
    //   console.log('changeTabAcitve0', this.changeTabAcitve)
    // }
    @Watch('changeTabAcitve') watchTabActive(valueNew): void {
      if (valueNew === 'ACTIVITY') {
        this.filter = {
          saleStatus: '',
          orderBy: 'CREATED_AT_DESC',
          transactionType: '',
          sort: 'Lastest  '
        }
        ;(this.toPrice = ''), (this.fromPrice = '')
        this.valueRange = [0, 0]
        this.time = ''
        this.$emit('filter', this.filter)
      }
      if (valueNew === 'BID') {
        this.filter = {
          saleStatus: '',
          orderBy: 'CREATED_AT_DESC',
          transactionType: '',
          sort: 'Lastest  '
        }
        ;(this.toPrice = ''), (this.fromPrice = '')
        this.valueRange = [0, 0]
        this.time = ''
        this.$emit('filter', this.filter)
      }
    }
    reset() {
      this.filter = {
        saleStatus: '',
        orderBy: 'CREATED_AT_DESC',
        transactionType: '',
        sort: 'Lastest  '
      }
      ;(this.toPrice = ''), (this.fromPrice = '')
      this.valueRange = [0, 0]
      this.time = ''
    }
    mounted() {
      console.log('changeTabAcitve', this.changeTabAcitve)
    }
    get getArrFilterSaleStatus(): Array<Record<string, any>> {
      if (this.changeTabAcitve === 'BID') {
        return [
          {
            id: 1,
            title: this.$t('nft.filter.bid'),
            value: 'BID'
          },
          {
            id: 2,
            title: this.$t('nft.filter.cancel-bid'),
            value: 'CANCEL_BID'
          }
        ]
      } else if (!this.isBid || this.nftItem?.totalSupply > 1) {
        if (!this.isOffer) {
          return [
            {
              id: 2,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 0,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 1,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 5,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        }
        return [
          {
            id: 2,
            title: this.$t('nft.filter.list'),
            value: 'LIST,UNLIST'
          },
          {
            id: 0,
            title: this.$t('nft.filter.sale'),
            value: 'SALE'
          },
          {
            id: 1,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT'
          },
          {
            id: 4,
            title: this.$t('nft.filter.offer'),
            value: 'OFFER'
          },
          {
            id: 5,
            title: this.$t('nft.filter.used'),
            value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
          }
        ]
      } else if (!this.isOffer) {
        return [
          {
            id: 2,
            title: this.$t('nft.filter.list'),
            value: 'LIST,UNLIST'
          },
          {
            id: 0,
            title: this.$t('nft.filter.sale'),
            value: 'SALE'
          },
          {
            id: 1,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT'
          },
          {
            id: 3,
            title: this.$t('nft.filter.bid'),
            value: 'BID'
          },
          {
            id: 5,
            title: this.$t('nft.filter.used'),
            value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
          }
        ]
      }
      return [
        {
          id: 2,
          title: this.$t('nft.filter.list'),
          value: 'LIST,UNLIST'
        },
        {
          id: 0,
          title: this.$t('nft.filter.sale'),
          value: 'SALE'
        },
        {
          id: 1,
          title: this.$t('nft.filter.transfer'),
          value: 'TRANSFER,MINT'
        },
        {
          id: 3,
          title: this.$t('nft.filter.bid'),
          value: 'BID'
        },
        {
          id: 4,
          title: this.$t('nft.filter.offer'),
          value: 'OFFER'
        },
        {
          id: 5,
          title: this.$t('nft.filter.used'),
          value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
        }
      ]
    }

    async created(): Promise<void> {
      this.$emit('filter', this.filter)
    }

    // handleChange(item: number, event: any): void {
    //   console.log(item, event)
    // }
    handleChangeTime(time: string | number): void {
      if (time === 'all' || time === '') {
        this.filter.fromDate = null
        this.filter.toDate = null
      } else {
        console.log('time', time)
        this.filter.fromDate = this.checkTime(+time)
        this.filter.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      }
      this.$emit('filter', this.filter)
    }
    checkTime(day: number): string {
      const time = new Date(Date.now() - day * 24 * 60 * 60 * 1000).setHours(0, 0, 0)
      return this.formatTimestamp(time)
    }

    formatTimestamp(value: number): string {
      if (!value) {
        return ''
      }
      const gmt = new Date().getTimezoneOffset() / -60
      const ago = value - gmt * 60 * 60 * 1000
      const date = new Date(ago)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    }
    handleChangeStatus(): void {
      // EventBus.$emit('emitFilterCollection', value)
      this.$emit('filter', this.filter)
    }
    handleChangeTransactionType(): void {
      // this.$emit('filter', value)
      this.$emit('filter', this.filter)
    }
    // destroyed(): void {
    //   EventBus.$off('filter')
    // }
    handleChangeVerified(): void {
      this.$emit('filter', this.filter)
    }
    handleApplyFilter(): void {
      this.handleApply()
      this.setOpenDrawer({
        drawerName: 'filter-collection',
        isOpen: false
      })
    }
    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-mobile {
    .active {
      background: var(--bc-theme-primary-gradient);
      color: var(--bc-color-white);
    }
    .select-status {
      .el-select {
        .el-input {
          width: 72vw;
          .el-input__inner {
            width: 72vw;
          }
        }
      }
    }
    .drawer {
      z-index: 999;
      .blockchain {
        margin-bottom: 32px;
      }
      .apply-btn {
        position: static;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 32px;

        .btn-apply {
          font-size: 16px;
          line-height: 24px;
          padding: 8px 20px !important;
          font-weight: 600;
          border-radius: 8px !important;
          outline: none;
          cursor: pointer;
          background: var(--bc-theme-primary-gradient);
          color: var(--bc-color-white);
        }
        .el-button {
          width: 100% !important;
          height: 48px !important;
        }
      }
      .el-form-item {
        margin-top: 8px;
        margin-bottom: 12px;
        ::placeholder {
          font-weight: 400;
          color: #5b616e;
        }
      }
      .el-select {
        .el-input {
          .el-input__inner {
            width: 335px;
          }
        }
      }
      .sort {
        margin-top: 32px;
        margin-bottom: 32px;
      }
      .property {
        margin-top: 32px;
      }
      .price {
        .wrap-inside {
          margin-top: -12px;
        }
        .el-input__inner {
          color: #5b616e;
        }
        .el-slider__bar {
          background: linear-gradient(#9d3ef2 100%, #3036f4 100%);
        }
        .el-form {
          height: 53px;
        }
        .left {
          .el-input__inner {
            padding: 0;
            text-align: left;
          }
        }
        .right {
          .el-input__inner {
            padding: 0;
            text-align: right;
          }
        }
        .el-input__inner {
          border: none;
          background-color: white;
        }
        margin-top: 32px;
        span {
          margin-bottom: 8px;
        }
      }
      .sale-type {
        .type {
          max-width: 161px;
          width: 100%;
          height: 48px;
          border: 1px solid #dbdbdb;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #5b616e !important;
          &:active {
            border: 1px solid;
            border-color: #9d3ef2;
            color: #0a0b0d !important;
            font-weight: 600;
          }
        }
      }
      .sale-status {
        .status-item {
          margin-top: 8px;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: space-between;
          .status {
            flex: 34%;
            // width: 161px;
            height: 48px;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #5b616e !important;
            &:active {
              border: 1px solid;
              border-color: #9d3ef2;
              color: #0a0b0d !important;
            }
          }
        }
      }
    }
    padding-top: 20px;
    .button {
      width: 48px;
      height: 48px;
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #dbdbdb;
      .span-icon {
        line-height: 1rem;
        .svg-icon {
          vertical-align: 0 !important;
        }
      }
    }
  }
</style>
