<template>
  <div class="filter-mobile be-flex">
    <el-form class="be-flex form-filter" @submit.prevent.native="handleSubmit">
      <el-form-item class="mr-16 input-search" v-if="isShowSearch">
        <el-input v-model="filter.search" :placeholder="$t('placeholder.search')" @input="handleSearch"> </el-input>
        <div class="icon">
          <base-icon icon="icon-search-gray" size="16" class="d-iflex"></base-icon>
        </div>
      </el-form-item>
    </el-form>
    <div class="cursor button" @click="handleSetOpenDrawer">
      <base-icon icon="icon-filter" class="d-iflex" />
    </div>
    <!-- <el-drawer title="I am the title" :visible.sync="drawer" :direction="direction" size="100%">
      <span>Hi, there!</span>
    </el-drawer> -->

    <base-drawer :reset="handleResetFilter" name="filter-explore" title="Filter" size="100%">
      <!-- <div class="blockchain mb-8" v-if="tabActive === 'NFT' || tabActive === 'Collection'">
        <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.blockchain') }}</span>
        <el-form>
          <el-form-item>
            <el-select v-model="filter.address" class="w-100">
              <el-option @change="handleSelectWallet(wallet.symbol)" v-for="wallet in listWallet" :key="wallet.id" :icon="wallet.icon" :value="wallet.symbol" :label="wallet.name">
                <template>
                  <div class="be-flex wallet-item">
                    <base-icon :icon="wallet.icon" size="24" />
                    <span class="d-ib" style="margin-left: 10px">{{ wallet.name }}</span>
                  </div>
                </template>
              </el-option>
              <div class="suffix" slot="prefix">
                <base-icon :icon="getIcon" size="24" />
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div> -->
      <div class="wrap-content">
        <div class="category mb-32">
          <span class="text-semibold nft-body-base-small">Blockchain</span>
          <el-form>
            <el-form-item>
              <el-select v-model="filter.network" popper-class="text-base-nft popper-explore-select-category" placeholder="blockchain">
                <el-option label="Ethereum" value="ERC20" />
                <el-option label="BSC" value="BEP20" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="category mb-32">
          <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.category') }}</span>
          <el-form>
            <el-form-item>
              <el-select v-model="filter.categoryId" popper-class="text-base-nft popper-explore-select-category" :placeholder="$t('nft.place-holder.category')">
                <el-option v-for="item in listSelectCategory" :key="item.id" :label="item.categoryName" :value="item.id" :class="item.levelDepth ? 'item-child' : 'item-parent'" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="verified" v-if="tabActive === 'Collection'">
          <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.verified') }}</span>
          <div class="be-flex jc-space-between mt-8 mb-32">
            <el-button
              :class="idClassVerified === item.id ? 'active1' : 'null'"
              v-for="(item, index) in arrVerified"
              :key="index"
              @click="handleSelectVerified(item)"
              plain
              class="nft-body-base type type-buy"
            >
              {{ item.title }}</el-button
            >
          </div>
        </div>
        <div class="sale-type" v-if="(tabActive === 'NFT' || tabActive === 'default') && isBid && isBuy">
          <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.sale-type') }}</span>
          <div class="be-flex jc-space-between mt-8 mb-32">
            <el-button
              :class="idClassBuy === item.id ? 'active1' : 'null'"
              plain
              v-for="item in getArrFilterSaleStatus"
              :key="item.id"
              class="nft-body-base type type-bid"
              :value="item.value"
              @click="handleSelectSaleType(item)"
              >{{ item.title }}</el-button
            >
            <!-- <el-button plain class="nft-body-base type type-buy" v-model="filter.saleType">{{ $t('nft.filter.buy') }}</el-button>
          <el-button plain class="nft-body-base type type-bid" v-model="filter.saleType">{{ $t('nft.filter.bid') }}</el-button> -->
          </div>
        </div>
        <div class="sale-status" v-if="tabActive === 'NFT'">
          <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.sale-status') }}</span>
          <div class="status-item be-flex mt-8">
            <el-button
              :class="idClass === item.id ? 'active' : 'null'"
              :value="item.value"
              v-for="item in getArrTabs"
              :key="item.id"
              plain
              class="nft-body-base status status-bid"
              @click="handleSaleStatus(item)"
            >
              {{ item.title }}</el-button
            >
          </div>
        </div>
        <div class="price" v-if="tabActive === 'NFT' || tabActive === 'default'">
          <div class="price-form">
            <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.price') }}</span>
            <el-form class="be-flex">
              <el-form-item class="mr-16">
                <!-- :placeholder="$t('placeholder.from')" -->
                <!-- @input="handleChangeFromPrice" -->
                <el-input
                  v-model="getFromPrice"
                  :placeholder="'$0 '"
                  disabled
                  clearable
                  @keypress.native="onlyNumber($event, 'fromPrice')"
                  @keyup.native="numberFormat($event)"
                  class="price-inputs"
                />
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
            <el-slider
              class="slide-price"
              v-model="valueRange"
              range
              :max="maxPrice"
              :format-tooltip="formatTooltip"
              tooltip-class="tooltip-price"
              @change="changeSlider"
              ref="rangeSlider"
            >
            </el-slider>
            <div class="be-flex jc-space-between info-price">
              <!-- <div class="nft-body-caption text-desc">0</div>
            <div class="nft-body-caption text-desc">5,000,000+</div> -->
            </div>
          </div>
        </div>
        <div class="sort mt-32">
          <span class="text-semibold nft-body-base-small">{{ $t('nft.filter.mobile.sort') }}</span>
          <el-form>
            <el-form-item>
              <el-select v-model="filter.orderBy" popper-class="text-base-nft popper-explore-select-category " placeholder="Sort">
                <!-- <el-option
                v-for="(value, index) in arrSorts"
                :key="index"
                :label="value.label"
                :class="filter.orderBy === value.command ? 'active' : null"
                :command="value.command"
              /> -->
                <el-option v-for="(value, index) in arrSorts" :key="index" :label="value.label" :value="value.command"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button
          :value="isVisible"
          @show="handleShowPopper"
          @hide="isVisible = false"
          @click="handleApplyFilter"
          @change="changeSlider"
          class="btn-default-bg mb-32 mt-8 nft-header6 text-semibold btn is-none-border"
        >
          {{ $t('button.apply') }}
        </button>
      </div>
    </base-drawer>

    <div class="be-flex align-center jc-space-between filter-collection">
      <div class="filter-collection__left">
        <el-form class="be-flex form-filter" @submit.prevent.native="handleSubmit"> </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import { debounce, includes, trim } from 'lodash'
  import FilterPriceNft from '@/mixins/filterPriceNft'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  import DrawerMixin from '@/mixins/drawer'
  import filter from 'lodash/filter'
  import WalletRepository from '@/services/repositories/wallet'
  import { namespace } from 'vuex-class'

  const apiWallet: WalletRepository = getRepository('wallet')

  interface IFilter {
    // search: string
    [x: string]: any
    fromPrice?: number | null | string
    address?: string | number
  }

  const beBase = namespace('beBase')
  const bcAuth = namespace('beAuth')

  @Component
  export default class FilterExploreMobile extends Mixins(DrawerMixin, FilterPriceNft) {
    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @bcAuth.Getter('isOffer') isOffer!: boolean
    @Prop({ required: false, type: Boolean, default: false }) isShowSearch!: boolean
    @Prop({ required: false, type: String, default: 'default' }) tabActive!: string
    @Prop({
      required: false,
      type: Function,
      default: () => {
        console.log('reset')
      }
    })
    reset!: () => void

    filter: IFilter = {
      search: '',
      categoryId: '',
      orderBy: 'CREATED_AT_DESC',
      saleType: '',

      isVerified: ''
      // address: 'BTC'
    }

    drawer = false
    direction = 'ltr'
    idClass = ''
    idClassBuy = ''
    idClassVerified = ''

    listSelectCategory: Record<string, any> = []

    arrTab: Array<Record<string, any>> = [
      { id: 4, title: this.$t('nft.filter.mobile.on-sale'), value: 'ON_SALE' },
      { id: 5, title: this.$t('text-nft.not-for-sale'), value: 'NOT_FOR_SALE' },
      { id: 6, title: this.$t('nft.filter.mobile.has-offer'), value: 'HAS_OFFER' },
      { id: 7, title: this.$t('nft.filter.mobile.on-auction'), value: 'ON_AUCTION' }
    ]

    arrVerified: Array<Record<string, any>> = [
      { id: 0, title: this.$t('nft.filter.mobile.verified-all'), value: null },
      { id: 1, title: this.$t('nft.filter.mobile.verified'), value: 'YES' },
      { id: 2, title: this.$t('nft.filter.mobile.unverified'), value: 'NO' }
    ]

    listWallet: Array<Record<string, any>> = [
      {
        id: 0,
        name: 'Bitcoin Wallet',
        symbol: 'BTC',
        icon: 'icon-btc'
      },
      {
        id: 1,
        name: 'Ethereum Wallet',
        symbol: 'ETH',
        icon: 'icon-eth'
      },
      {
        id: 2,
        name: 'Tether Wallet',
        symbol: 'USDT',
        icon: 'icon-usdt',
        disabled: true
      },
      {
        id: 3,
        name: 'USDC Wallet',
        symbol: 'USDC',
        icon: 'icon-usdc',
        disabled: true
      },
      {
        id: 4,
        name: 'BNB Wallet',
        symbol: 'BNB',
        icon: 'icon-bnb',
        disabled: true
      },
      {
        id: 5,
        name: 'BUSD Wallet',
        symbol: 'BUSD',
        icon: 'icon-busd',
        disabled: true
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
    get getFromPrice(): string {
      return this.fromPrice === '' ? '$ 0' : '$ ' + this.fromPrice
    }
    get getToPrice(): string {
      return this.toPrice === '' ? '$5,000,000+' : '$ ' + this.toPrice
    }
    get getArrTabs(): any {
      let rs = [this.arrTab[0], this.arrTab[1]]
      if (this.isBid) {
        rs.push(this.arrTab[2])
      }
      if (this.isOffer) {
        rs.push(this.arrTab[3])
      }
      return rs
    }
    get arrSorts(): Array<Record<string, any>> {
      if (this.tabActive === 'NFT') {
        return this.sorts
      }
      return [
        {
          command: 'CREATED_AT_DESC',
          label: this.$t('nft.sort.latest')
        },
        {
          command: 'CREATED_AT_ASC',
          label: this.$t('nft.sort.oldest')
        }
      ]
    }

    get getArrFilterSaleStatus(): Array<Record<string, any>> {
      if (this.isBid) {
        return [
          {
            id: 4,
            title: this.$t('nft.filter.buy'),
            value: 'BUY'
          },
          {
            id: 5,
            title: this.$t('nft.filter.bid'),
            value: 'BID'
          }
        ]
      } else {
        return [
          {
            id: 4,
            title: this.$t('nft.filter.buy'),
            value: 'BUY'
          }
        ]
      }
    }

    @Watch('filter.address') changeAddress(symbol: string): void {
      console.log('value', symbol)
      this.filter.address = symbol
      // this.amount = ''
      // this.receive = ''
      // const aa = value.toString()
      // this.handleSelectWallet(value)

      // this.handleSelectWallet()
      // this.filter.address = value
    }
    async created(): Promise<void> {
      console.log('BID', this.isBid, 'BUY', this.isBuy)
      this.listSelectCategory = await apiNft.getListCategoryFilter()
      this.listSelectCategory.unshift({
        id: null,
        levelDepth: 0,
        categoryName: this.$i18n.t('update-category.all')
      })
      if (this.$route.name === 'DetailCategory') {
        if (this.$route.params.id !== 'all') {
          this.filter.categoryId = +this.$route.params.id
        }
      }
      this.filter = {
        ...this.filter,
        ...this.$route.query
      }

      if (this.$route.query.network === 'undefined') {
        this.filter.network = ''
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
      // @ts-ignore
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
    }

    handleResetFilter(): void {
      this.filter = {
        search: '',
        categoryId: '',
        orderBy: 'CREATED_AT_DESC',
        saleType: '',
        saleStatus: '',
        verified: '',
        address: 'BTC'
      }
      this.price = ''
      this.fromPrice = ''
      this.toPrice = ''
      this.idClass = ''
      this.idClassBuy = ''
      this.idClassVerified = ''
      this.$emit('filter', this.filter)
    }

    resetFilter(): void {
      console.log('hi')
    }

    handleSort(command: string): void {
      this.filter.orderBy = command
      // this.$emit('filter', this.filter)
    }

    // get getIcon(): string {
    //   const rs = filter(this.listWallet, (elm: Record<string, any>) => elm.symbol === this.filter.address)[0]
    //   return rs?.icon
    // }

    // handleChangeStatus(): void {
    //   this.$emit('filter', this.filter)
    // }

    handleSelectWallet(symbol: string): void {
      this.filter.address = symbol
      this.$emit('filter', this.filter)
      console.log('hello', symbol)
      // this.filter.address = this.collectionItem.currency
    }

    handleApplyFilter(): void {
      // this.$emit('filter', this.filter)
      this.handleApply()
      this.setOpenDrawer({
        drawerName: 'filter-explore',
        isOpen: false
      })
      // console.log('gaf', this.collectionItem.currency)
    }

    // handleChangeSort(command: string): void {
    //   this.filter.orderBy = command
    //   this.$emit('filter', this.filter)
    //   // this.$emit('filter', this.filter)
    //   // console.log('asdjsadhjsak')
    // }

    handleSetOpenDrawer(filter: Record<string, any>): void {
      this.setOpenDrawer({
        drawerName: 'filter-explore',
        isOpen: true
      })
      console.log('tabActive', this.tabActive)
    }

    handleSelectVerified(item): void {
      this.filter.isVerified = item.value
      this.idClassVerified = item.id
    }

    handleSelectSaleType(item): void {
      this.filter.saleType = item.value
      this.idClassBuy = item.id
      // this.tabActive = item
    }

    handleSaleStatus(item): void {
      this.filter.saleStatus = item.value
      this.idClass = item.id
    }
    // handleVerified(item): void {
    //   this.filter.isVerified = item
    // }

    handleSearch(value: string): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      this.debounceSearch(value, _this)
    }

    debounceSearch = debounce((value: string, _this: any) => {
      _this.filter.search = trim(value)
      _this.$emit('filter', _this.filter)
    }, 500)
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-mobile {
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
    .content {
      height: 100%;
    }
    .wrap-content {
      height: calc(100% - 67px);
      overflow-y: auto;
      margin: 0 -20px;
      padding: 0 20px;
    }

    // .slide-price {
    //   .el-slider__runway {
    //     height: 4px !important;
    //     margin: 8px 0 !important;
    //     border-radius: 2px !important;
    //   }
    //   .el-slider__button {
    //     height: 20px !important;
    //     width: 20px !important;
    //   }
    // }
    .input-search {
      // width: 320px;
      position: relative;

      .el-input {
        .el-input__inner {
          width: 72vw;
          height: 48px;
          padding-right: 36px;
        }
      }
      .icon {
        position: absolute;
        top: 16px;
        right: 16px;
        display: inline-flex;
      }
    }
    .blockchain {
      display: grid;
      .el-input__inner {
        padding-left: 45px;
      }
      .el-input__prefix {
        left: 15px;
      }
    }

    .el-form {
      .el-form-item {
        .el-form-item__content {
          .el-select {
            width: 100%;
            // max-width: 335px;
            margin-top: 8px;
          }
        }
      }
      .el-icon-arrow-up {
        color: #5b616e;
      }
    }
    .verified {
      .type {
        // max-width: 104px;
        // width: 100%;
        width: calc(1 / 3 * 100% - (1 - 1 / 3) * 20px);
        // margin: 28px 20px 0 0;
        height: 48px;
        font-size: 16px;
        line-height: 24px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #5b616e !important;
        &:focus {
          border: 1px solid;
          border-color: #9d3ef2;
          color: #0a0b0d !important;
        }
      }
      .active1 {
        border: 1px solid;
        border-color: var(--bc-text-footer-about);
        color: #0a0b0d !important;
        background-color: #fff;
      }
    }
    .sale-type {
      .type {
        margin: 0;
        font-size: 16px;
        line-height: 24px;
        // max-width: 161px;
        // width: 100%;
        width: calc(1 / 2 * 100% - (1 - 1 / 2) * 20px);
        height: 48px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #5b616e !important;
        &:focus {
          border: 1px solid;
          border-color: #9d3ef2;
          color: #0a0b0d !important;
        }
      }
      .active1 {
        border: 1px solid;
        border-color: var(--bc-text-footer-about);
        color: #0a0b0d !important;
        background-color: #fff;
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
        .active {
          border: 1px solid;
          border-color: var(--bc-text-footer-about);
          color: #0a0b0d !important;
          background-color: #fff;
        }
      }
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
        color: #5b616e !important;
        &::placeholder {
          color: #5b616e !important;
          font-size: 16px;
          line-height: 24px;
        }
      }
      .price-to {
        .el-input__inner {
          text-align: right;
          &::before {
            content: '$';
          }
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
            background: var(--bc-theme-primary-gradient);
            z-index: 1111;
          }
        }
      }
      ::placeholder {
        font-weight: 400;
        color: #5b616e;
      }
    }
    .footer {
      .btn-default-bg {
        // max-width: 335px !important;
        width: 100%;
        height: 48px;
      }
    }
    .prefix {
      position: absolute;
      z-index: 10;
    }
    .prefix--camera,
    .prefix--amount {
      right: 13px;
      top: 41%;
    }
    .el-input__prefix {
      display: flex;
      align-items: center;
    }
  }

  ::v-deep.el-tooltip__popper {
    color: red;
    display: none;
  }

  @media (width: 375px) {
    .filter-mobile {
      .input-search {
        width: 275px;
      }
      .el-form {
        .el-select {
          width: 100%;
          max-width: 335px;
          margin-top: 8px;
        }
      }
      .footer {
        .btn-default-bg {
          max-width: 335px !important;
        }
      }
    }
  }
</style>
