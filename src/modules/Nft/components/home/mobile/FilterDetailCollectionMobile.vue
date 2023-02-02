<template>
  <div class="filter-mobile be-flex jc-space-between">
    <el-form class="be-flex form-filter">
      <el-form-item class="mr-16 select-status">
        <el-select v-if="tabActive === 0" v-model="filter.saleStatus" @change="handleChangeStatus" :placeholder="$t('placeholder.sale-status')" clearable>
          <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
        </el-select>
        <el-select v-if="tabActive === 1" v-model="filter.transactionType" @change="handleChangeTransactionType" :placeholder="$t('placeholder.all-event')" clearable>
          <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="cursor button" @click="handleSetOpenDrawer">
      <base-icon icon="icon-filter" class="d-iflex" />
    </div>
    <base-drawer :reset="handleResetFilter" class="drawer" name="filter-collection" title="Filter" size="100%">
      <div v-if="tabActive === 1" class="blockchain">
        <span class="text-semibold nft-body-base-small">Event</span>
        <el-form>
          <el-form-item>
            <el-select v-if="tabActive === 1" v-model="filter.transactionType" @change="handleChangeTransactionType" :placeholder="$t('placeholder.all-event')">
              <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="tabActive === 1" class="category">
        <span class="text-semibold nft-body-base-small">Time</span>
        <el-form>
          <el-form-item>
            <el-select v-model="filter.time" :placeholder="$t('placeholder.all-time')" @change="handleChangeTime">
              <el-option v-for="item in arrTime" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="sale-status" v-if="tabActive === 0">
        <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.sale-status') }}</span>
        <div class="status-item be-flex mt-8">
          <el-button @click="handleSaleStatus(item.value)" :value="item.value" v-for="item in getArrFilterSaleStatus" :key="item.id" plain class="nft-body-base status status-bid">
            {{ item.title }}</el-button
          >
        </div>
      </div>
      <div class="price">
        <div class="price-form">
          <span class="text-semibold text-base1">{{ $t('nft.filter.mobile.price') }}</span>
          <el-form class="be-flex">
            <el-form-item class="mr-16">
              <!-- :placeholder="$t('placeholder.from')" -->
              <!-- @input="handleChangeFromPrice" -->
              <el-input v-model="getFromPrice" :placeholder="'$0 '" disabled clearable @keypress.native="onlyNumber($event, 'fromPrice')" @keyup.native="numberFormat($event)" />
              <!-- <el-input
                v-else
                v-model="fromPrice"
                :placeholder="'0 CLM'"
                disabled
                clearable
                @keypress.native="onlyNumber($event, 'fromPrice')"
                @keyup.native="numberFormat($event)"
              /> -->
            </el-form-item>
            <el-form-item>
              <!-- :placeholder="$t('placeholder.to')" -->
              <!-- @input="handleChangeToPrice" -->
              <el-input
                class="price-to"
                :placeholder="'$5,000,000+ '"
                v-model="getToPrice"
                disabled
                clearable
                @keypress.native="onlyNumber($event, 'toPrice')"
                @keyup.native="numberFormat($event)"
              />
              <!-- <el-input
                class="price-to"
                :placeholder="'5,000,000 CLM'"
                v-model="toPrice"
                disabled
                clearable
                @keypress.native="onlyNumber($event, 'toPrice')"
                @keyup.native="numberFormat($event)"
                v-else
              /> -->
            </el-form-item>
            <div v-if="isErrorFrom" class="error-amount">
              <p>{{ $t('nft.error-from') }}</p>
            </div>
          </el-form>
          <el-slider v-model="valueRange" range :max="maxPrice" :format-tooltip="formatTooltip" tooltip-class="tooltip-price" @change="changeSlider" ref="rangeSlider"> </el-slider>
          <div class="be-flex jc-space-between info-price">
            <!-- <div class="nft-body-caption text-desc">0</div>
            <div class="nft-body-caption text-desc">5,000,000+</div> -->
          </div>
        </div>
      </div>
      <!-- <div v-if="tabActive === 0" class="property">
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
        <span class="text-semibold nft-body-base-small">Sort by</span>
        <el-form>
          <el-form-item>
            <el-select v-model="filter.orderBy" popper-class="text-base-nft popper-explore-select-category " placeholder="Sort" @change="handleChangeFilter">
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
  import { debounce, includes, trim } from 'lodash'
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
    @Prop({ required: true, type: Number, default: 0 }) tabActive!: number
    @bcNft.State('isDesktop') isDesktop!: boolean

    @bcAuth.State('featureConfig') featureConfig!: Record<string, boolean>
    // @beBase.State('coinMain') coinMain!: string
    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @bcAuth.Getter('isOffer') isOffer!: boolean
    drawer = false
    direction = 'ltr'
    handleSetOpenDrawer(): void {
      this.setOpenDrawer({
        drawerName: 'filter-collection',
        isOpen: true
      })
    }
    isActive = false
    numOfProperties = 0
    statusArrow = false
    sortActive = 0
    handleActive(): void {
      this.isActive = !this.isActive
    }
    filter: IFilter = {
      saleStatus: '',
      orderBy: 'CREATED_AT_DESC',
      transactionType: '',
      // sort: 'Lastest',
      fromPrice: 0,
      toPrice: 0,
      time: 7
    }
    query: Record<string, any> = {
      page: 1,
      limit: 12,
      lastTime: 'LAST_24_HOURS',
      collectionType: 'TOP',
      orderBy: 'CREATED_AT_DESC'
    }
    time = ''
    selectProperties: any = ''

    viewType = 'grid'
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
    handleSaleStatus(item): void {
      this.filter.saleStatus = item
    }
    @Watch('tabActive') watchTabActive(): void {
      this.filter.saleStatus = ''
    }
    get getFromPrice(): string {
      return this.fromPrice === '' ? '$ 0' : '$ ' + this.fromPrice
    }
    get getToPrice(): string {
      return this.toPrice === '' ? '$5,000,000+' : '$ ' + this.toPrice
    }
    get getArrFilterSaleStatus(): Array<Record<string, any>> {
      const arr = [...this.arrStatus]
      if (this.tabActive === 0) {
        if (this.featureConfig?.offer) {
          arr.push({
            id: 1,
            title: this.$t('nft.filter.has-offer'),
            value: 'HAS_OFFER'
          })
        }
        if (this.featureConfig?.bid) {
          arr.push({
            id: 0,
            title: this.$t('nft.filter.on-auction'),
            value: 'ON_AUCTION'
          })
        }
        return arr
      } else {
        if (!this.isBid && !this.isOffer) {
          return [
            {
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 3,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        } else if (!this.isBid) {
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
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
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
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        } else {
          return [
            {
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
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
      }
    }
    handleResetFilter(): void {
      this.filter = {
        search: '',
        categoryId: '',
        orderBy: 'CREATED_AT_DESC',
        saleType: '',
        saleStatus: '',
        verified: '',
        transactionType: ''
      }
      this.price = ''
      this.fromPrice = ''
      this.toPrice = ''
      ;(this.valueRange = [0, 0]), (this.time = '')
      this.$emit('filter', this.filter)
    }
    async created(): Promise<void> {
      if (this.$route.name === 'DetailCategory') {
        if (this.$route.params.id !== 'all') {
          this.filter.categoryId = +this.$route.params.id
        }
      }
      this.filter = {
        ...this.filter,
        ...this.$route.query
      }
      const arrFalse = ['null', 'undefined', '0', undefined]
      const queryFromPrice = this.$route.query.fromPrice as string | undefined
      const queryToPrice = this.$route.query.toPrice as string | undefined

      // this.fromPrice = !includes(arrFalse, queryFromPrice as string | undefined) ? this.$options.filters?.numberWithCommas(queryFromPrice) : '0'
      // this.toPrice = !includes(arrFalse, queryToPrice as string | undefined) ? this.$options.filters?.numberWithCommas(queryToPrice) : '5,000,000'
      const fromPrice = +this.fromPrice.replaceAll(',', '')
      const toPrice = +this.toPrice.replaceAll(',', '')

      this.$set(this.valueRange, 1, toPrice)
      this.$set(this.valueRange, 0, fromPrice)
      //@ts-ignore
      // this.$refs.rangeSlider.setValues()

      if (!includes(arrFalse, queryFromPrice) && !includes(arrFalse, queryToPrice)) {
        this.price = this.$options.filters?.numberWithCommas(this.fromPrice.replaceAll(',', '')) + ' - ' + this.$options.filters?.numberWithCommas(this.toPrice.replaceAll(',', ''))
      } else if (!includes(arrFalse, queryFromPrice) && includes(arrFalse, queryToPrice)) {
        this.price = '> ' + this.$options.filters?.numberWithCommas(this.fromPrice.replaceAll(',', ''))
      } else if (includes(arrFalse, queryFromPrice) && !includes(arrFalse, queryToPrice)) {
        this.price = '< ' + this.$options.filters?.numberWithCommas(this.toPrice.replaceAll(',', ''))
      } else {
        this.price = ''
      }
      // EventBus.$on('emitCurrency', this.handleSelectWallet)

      this.$emit('filter', this.filter)
    }
    destroy(): void {
      EventBus.$off('emitDate')
    }
    handleChangeFilter(): void {
      console.log('abc')

      // this.$emit('filter', this.filter)
    }

    handleChange(item: number, event: any): void {
      console.log(item, event)
    }

    handleChangeStatus(value: any): void {
      // EventBus.$emit('emitFilterCollection', value)
      this.$emit('filter', this.filter)
    }
    handleChangeTransactionType(value: any): void {
      // EventBus.$emit('emitFilterCollection', value)
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
    handleChangeTime(time: string | number): void {
      let fromDate
      let toDate
      if (time === 'all' || time === '') {
        fromDate = null
        toDate = null
      } else {
        fromDate = this.checkTime(+time)
        toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      }
      EventBus.$emit('emitDate', { fromDate, toDate })
    }

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
          border-radius: 6px;
          outline: none;
          cursor: pointer;
          background: var(--bc-theme-primary-gradient);
          color: var(--bc-color-white);
        }
        .el-button {
          width: 335px;
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
        margin-top: 16px;
        .el-form {
          height: 24px;
          margin-bottom: 24px;
        }
        .el-input__inner {
          border: none;
          background-color: #fff;
          padding: 0;
          color: #5b616e;
          &::placeholder {
            font-size: 16px;
            line-height: 24px;
          }
        }
        .price-to {
          .el-input__inner {
            text-align: right;
          }
        }
        .el-slider {
          color: red;
          .el-slider__bar {
            // background-color: #9d3ef2;
            background: var(--bc-theme-primary-gradient);
          }
          .el-slider__button-wrapper {
            .el-tooltip {
              border: var(--bc-theme-primary-gradient);
              background: var(--bc-theme-primary-gradient);
              z-index: 1111;
            }
          }
        }
        ::placeholder {
          color: #5b616e;
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
          flex-wrap: wrap;
          // row-gap: 14px;
          justify-content: space-between;
          .status {
            margin: 0;
            // width: 161px;
            width: calc(1 / 2 * 100% - (1 - 1 / 2) * 20px);
            height: 48px;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            line-height: 24px;
            color: #5b616e !important;
            margin-bottom: 16px;
            &:focus {
              border: 1px solid;
              border-color: #9d3ef2;
              color: #0a0b0d !important;
              outline: none !important;
              box-shadow: none;
            }
          }
        }
      }
    }
    padding-top: 20px;
    .button {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
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
