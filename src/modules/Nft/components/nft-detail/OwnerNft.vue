<template>
  <div class="owner-nft">
    <div class="filters">
      <el-form>
        <el-form-item class="mr-16" style="width: 100%">
          <el-select
            v-model="filters.saleTypes.value"
            :placeholder="$t('update-owner-tab.type')"
            @change="handleFilterSaleType"
            style="width: 100%"
            class="sale-status"
            :class="{ russian: selectLanguage() === 'ru', japanese: selectLanguage() === 'jp', vietnam: selectLanguage() === 'vi' }"
            clearable
          >
            <el-option v-for="(option, index) in filters.saleTypes.options" :key="index" :label="option.title" :value="option.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isDesktop">
          <el-select
            v-model="filters.status.value"
            :placeholder="$t('update-owner-tab.verify-status')"
            :class="{ russian: selectLanguage() === 'ru', japanese: selectLanguage() === 'jp', vietnam: selectLanguage() === 'vi' }"
            @change="handleFilterVerify"
            clearable
          >
            <el-option v-for="(option, index) in filters.status.options" :key="index" :label="option.title" :value="option.value"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-dropdown trigger="click" @command="handleSortPrice" class="mr-16 wrap-sort" v-if="isDesktop">
        <span class="be-flex align-center cursor">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="24" class="d-iflex" />
          <span class="nft-body-base" style="color: #0a0b0d">{{ $t('nft.sort.title') }}</span></span
        >
        <el-dropdown-menu class="dropdown-sort-nft" :class="{ russian: selectLanguage() === 'ru' }" slot="dropdown">
          <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="query.orderBy === value.command ? 'active' : null" :command="value.command">
            <div class="be-flex">
              <p class="be-flex-item label" :class="query.orderBy === value.command ? 'label-active' : null">
                {{ value.label }}
              </p>
              <base-icon v-if="query.orderBy === value.command && coinMain === 'LYNK'" icon="icon-tick-dropdown" size="16" />
              <base-icon v-if="query.orderBy === value.command && coinMain === 'CLM'" icon="icon-tick-dropdown-clm" size="16" />
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="cursor filters-button" v-else @click="handleSetOpenDrawer">
        <base-icon icon="icon-filter" size="16" />
      </div>
    </div>
    <div class="owner-content" v-if="list.length > 0">
      <div class="list-owner">
        <div class="list-owner-item" v-for="(item, index) in listLeft" :key="index">
          <span class="list-owner-item__index" v-if="isDesktop">{{ index + 1 + (query.page - 1) * query.limit }}</span>
          <div class="list-owner-item__img" :class="{ 'mr-16 ml-7px': isDesktop, 'mr-12': !isDesktop }">
            <img
              :src="item.ownerAvatar"
              v-if="item.ownerAvatar"
              alt=""
              :width="isDesktop ? '48px' : '40px'"
              :height="isDesktop ? '48px' : '40px'"
              class="cursor"
              @click="handleViewOwner(item.ownerId)"
            />
            <base-icon v-else icon="default-avatar" size="48" class="cursor" @click.native="handleViewOwner(item.ownerId)"></base-icon>
            <base-icon icon="icon-verified" size="14" class="icon-verified" v-if="item.ownerIsVerified === 'YES'"></base-icon>
          </div>
          <div class="list-owner-item__text" v-if="isDesktop">
            <p class="name cursor" @click="handleViewOwner(item.ownerId)">
              {{ item.isOwner === 'YES' ? $t('you') : isDesktop ? item.ownerName : compact(item.ownerName, 8) }}
              <span class="description">
                {{ isDesktop ? getDescription(item) : compact(getDescription(item), 10) }}
              </span>
            </p>
            <p class="description">{{ isDesktop ? dolaExchange(item) : compact(dolaExchange(item)) }}</p>
          </div>
          <div class="list-owner-item__text" v-else>
            <p class="name cursor" @click="handleViewOwner(item.ownerId)">
              {{ item.isOwner === 'YES' ? $t('you') : item.ownerName }}
            </p>
            <p class="description">
              {{ getDescription(item) }}
              <span class="dot text-sm text-desc" v-if="getListingPrice(item)"> &#8226; </span>
              {{ compact(getListingPrice(item)) }}
            </p>
          </div>
          <div class="button-buy cursor" v-if="showBtnBuyNow(item)" @click="handleBuy(item)">
            {{ isDesktop ? $t('update-owner-tab.buy-now') : $t('update-owner-tab.buy') }}
          </div>
          <div v-if="showBtnRemove(item)" class="button-buy cursor" @click="handleRemoveFromSale">
            {{ isDesktop ? $t('update-owner-tab.remove-from-sale') : $t('update-owner-tab.remove') }}
          </div>
          <div v-if="showBtnPutOnSale(item)" class="button-buy cursor" :class="{ russian: selectLanguage() === 'ru' }" @click="handlePutOnsale(item)">
            {{ isDesktop ? $t('update-owner-tab.list-for-sale') : $t('update-owner-tab.list') }}
          </div>
        </div>
      </div>
      <div class="list-owner" v-if="isDesktop">
        <div class="list-owner-item" v-for="(item, index) in listRight" :key="index">
          <span class="list-owner-item__index">{{ index + query.limit / 2 + 1 }}</span>
          <div class="list-owner-item__img ml-7px mr-16">
            <img :src="item.ownerAvatar" v-if="item.ownerAvatar" alt="" width="48px" height="48px" class="cursor" @click="handleViewOwner(item.ownerId)" />
            <base-icon v-else icon="default-avatar" size="48" class="cursor" @click.native="handleViewOwner(item.ownerId)"></base-icon>
            <base-icon icon="icon-verified" size="14" class="icon-verified" v-if="item.ownerIsVerified === 'YES'"></base-icon>
          </div>
          <div class="list-owner-item__text">
            <p class="name cursor" @click="handleViewOwner(item.ownerId)">
              {{ item.isOwner === 'YES' ? $t('you') : item.ownerName }}
              <span class="description">
                {{ getDescription(item) }}
              </span>
            </p>
            <p class="description">{{ dolaExchange(item) }}</p>
          </div>
          <div class="button-buy cursor" v-if="showBtnBuyNow(item)" @click="handleBuy(item)">
            {{ $t('update-owner-tab.buy-now') }}
          </div>
          <div v-if="showBtnRemove(item)" class="button-buy cursor" @click="handleRemoveFromSale">
            {{ $t('update-owner-tab.remove-from-sale') }}
          </div>
          <div v-if="showBtnPutOnSale(item)" class="button-buy cursor" :class="{ russian: selectLanguage() === 'ru' }" @click="handlePutOnsale(item)">
            {{ $t('update-owner-tab.list-for-sale') }}
          </div>
        </div>
      </div>
    </div>
    <div class="owner-content" v-else style="display: flex; justify-content: center; align-items: center">
      <empty-block :emptyText="$t('update-owner-tab.empty-text')"></empty-block>
    </div>
    <div class="owner-pagination" v-if="isDesktop">
      <base-pagination :table="dataPagination" :info="paginationInfo" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"> </base-pagination>
    </div>
    <div class="owners-load-more" v-if="!isDesktop && totalElements > 5 && !isLoadFull">
      <button class="btn-more cursor" @click="handleLoadMore">{{ $t('update-owner-tab.load-more') }}</button>
    </div>
    <base-drawer :reset="handleResetFilter" name="filter-owners" title="Filter" size="100%" class="drawer-filter">
      <el-form>
        <el-form-item :label="$t('update-owner-tab.verify-status')">
          <el-select v-model="filtersMobile.isVerified" :placeholder="$t('update-owner-tab.verify-status')" clearable>
            <el-option v-for="(option, index) in filters.status.options" :key="index" :label="option.title" :value="option.value"> </el-option>
          </el-select>
        </el-form-item>
        <div class="verified">
          <p class="verified-label">
            {{ $t('nft.sort.title') }}
          </p>
          <div class="wrap-button">
            <button
              type="button"
              v-for="(item, index) in sorts"
              :key="index"
              :class="item.command === filtersMobile.orderBy ? 'active' : 'not-active'"
              @click.stop="handleClickOrder(item)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </el-form>
      <div class="drawer-footer">
        <button class="cursor" @click="handleApplyFilterOwnersMobile">{{ $t('button.apply') }}</button>
      </div>
    </base-drawer>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Mixins, Watch } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import BasePagination from '@/components/base/pagination/BasePagination.vue'
  import { namespace } from 'vuex-class'
  import filter from 'lodash/filter'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'
  import DrawerMixin from '@/mixins/drawer'
  import ActionNftMixin from '@/mixins/actionNft'
  import BaseDrawer from '@/components/base/drawer/BaseDrawer.vue'
  import EventBus from '@/utils/eventBus'
  const bcAuth = namespace('beAuth')
  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')

  const bcNft = namespace('bcNft')

  @Component({ components: { BaseDrawer, EmptyBlock, BasePagination } })
  export default class OwnerNft extends Mixins(PopupMixin, OnChainMixin, DrawerMixin, ActionNftMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    // @bcAuth.Getter('isBuy') isBuy!: boolean
    // @bcAuth.Getter('isBid') isBid!: boolean
    // @bcAuth.Getter('isExternalWallet') isExternalWallet!: boolean

    // @bcNft.Action('setInfoNft') setInfoNft!: (nft: Record<string, any>) => void
    // @bcNft.Mutation('SET_TYPE_ACTION') setTypeAction!: (type: string) => void
    @bcNft.Mutation('SET_LIST_ACCEPT_CURRENCY') setListAcceptCurrency!: (list: Array<Record<string, any>>) => void
    // @bcNft.Mutation('SET_CURRENCY_SELECT_BUY') setCurrencySelectBuy!: (currency: string) => void
    // @bcNft.State('isDesktop') isDesktop!: boolean

    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      orderBy: 'PRICE_ASC'
    }
    limit = 10
    totalElements = 0
    filters = {
      saleTypes: {
        options: [
          {
            title: this.$i18n.t('update-owner-tab.on-sale'),
            value: 'YES'
          },
          {
            title: this.$i18n.t('update-owner-tab.off-market'),
            value: 'NO'
          }
        ],
        value: ''
      },
      status: {
        options: [
          {
            title: this.$i18n.t('update-owner-tab.verified'),
            value: 'YES'
          },
          {
            title: this.$i18n.t('update-owner-tab.unverified'),
            value: 'NO'
          }
        ],
        value: ''
      }
    }
    filtersMobile = {
      isVerified: null,
      orderBy: null
    }
    sorts: Array<Record<string, any>> = [
      {
        command: 'PRICE_ASC',
        label: this.$t('nft.sort.price-low')
      },
      {
        command: 'PRICE_DESC',
        label: this.$t('nft.sort.price-high')
      }
    ]
    list: any = []
    get isLoadFull(): boolean {
      return this.query.limit === this.totalElements
    }
    get dataPagination(): any {
      return {
        page: this.query.page,
        total: this.totalElements,
        limit: this.query.limit
      }
    }
    get paginationInfo(): string {
      return (this.selectLanguage() !== 'en' ? this.$i18n.t('update-owner-tab.pagination-detail') : this.totalElements <= 1 ? 'owner' : 'owners') as string
    }
    get listLeft(): any[] {
      if (this.isDesktop) {
        if (this.list.length > this.query.limit / 2) {
          return this.list.slice(0, this.query.limit / 2)
        } else {
          return this.list
        }
      }
      return this.list
    }
    get listRight(): any[] {
      return this.list.length > this.query.limit / 2 ? this.list.slice(this.query.limit / 2, this.list.length) : []
    }
    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }
    @Watch('$route.params.id') async handleChangeRoute(): Promise<void> {
      this.isDesktop = window.innerWidth > 1200 ? true : false
      this.query.limit = this.isDesktop ? 10 : 5
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
    async handleFilterSaleType(): Promise<any> {
      const saleType = this.filters.saleTypes.value
      this.query = {
        ...this.query,
        isOnSale: saleType,
        page: 1
      }
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
    async handleSortPrice(command: string): Promise<void> {
      this.query = {
        ...this.query,
        orderBy: command,
        page: 1
      }
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }

    async handleFilterVerify(): Promise<void> {
      this.query = {
        ...this.query,
        isVerified: this.filters.status.value,
        page: 1
      }
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
    async created(): Promise<void> {
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
      EventBus.$on('reload-list-owner', this.handleReloadList)
    }
    destroyed(): void {
      EventBus.$off('reload-list-owner')
    }
    showBtnBuyNow(item: Record<string, any>): boolean {
      if (this.isBuy) {
        // this.isShowBtn = true
        return item.isOnSale === 'YES' && item.isOwner === 'NO' && this.nftItem.saleType === 'BUY'
      }
      return false
    }
    showBtnRemove(item: Record<string, any>): boolean {
      if (this.isBuy) {
        return item.isOnSale === 'YES' && item.isOwner === 'YES'
      }
      return false
    }
    showBtnPutOnSale(item: Record<string, any>): boolean {
      if (this.isBuy) {
        return item.isOnSale === 'NO' && item.isOwner === 'YES'
      }
      return false
    }
    showBtnPlaceABid(item: Record<string, any>): boolean {
      return this.nftItem.saleType === 'BID' && this.nftItem.saleStatus === 'ON_AUCTION'
    }
    getDescription(item: Record<string, any>): string {
      const listingQuantity = this.$options.filters?.formatNumber(item.listingQuantity)

      const originQuantity = this.$options.filters?.formatNumber(item.originQuantity)
      const listingPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice, item.currency)

      if ((this.showBtnBuyNow(item) || this.showBtnRemove(item)) && this.nftItem.saleType === 'BUY') {
        return `${listingQuantity}/${originQuantity} ${this.isDesktop ? this.$t('for-sale') : ''}`
        //  + `, ${listingPrice} ${item.currency}/` + this.$t('detail-nft.popup-owner.each')
      } else if ((this.showBtnBuyNow(item) || this.showBtnRemove(item)) && this.nftItem.saleType === 'BID') {
        return `${listingQuantity}/${originQuantity} ${this.isDesktop ? this.$t('text-nft.on-auction') : ''}`
      }
      // else if (listingQuantity <= 1 && (this.showBtnBuyNow(item) || this.showBtnRemove(item))) {
      //   return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-sale-for')
      // }
      if (this.showBtnPutOnSale(item)) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-sale-for')
      }
      if ((this.isBuy && item.isOnSale === 'NO' && item.isOwner === 'NO') || !this.isBuy) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-sale-for')
      }
      if (this.nftItem.saleType === 'BID' && this.nftItem.saleStatus === 'ON_AUCTION' && listingQuantity >= 1) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-auction')
      }
      return ''
    }
    getListingPrice(item: Record<string, any>): string {
      const listingPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice, item.currency)
      return listingPrice > 0 ? listingPrice + ' ' + item.currency + ' ' + this.$t('detail-nft.popup-owner.each') : ''
    }
    dolaExchange(item: Record<string, any>): any {
      const listingQuantity = this.$options.filters?.formatNumber(item.listingQuantity)
      const listingPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice, item.currency)
      const dolarPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice * this.exchangeRate, 'USD')
      if (this.showBtnBuyNow(item) || this.showBtnRemove(item)) {
        return `${listingPrice}` + ` ` + item.currency + ` ` + this.$t('detail-nft.popup-owner.each') + ` ~ $` + `${dolarPrice}`
      }
      if (this.showBtnPutOnSale(item)) {
        return this.$t('text-nft.not-for-sale')
      }
      if ((this.isBuy && item.isOnSale === 'NO' && item.isOwner === 'NO') || !this.isBuy) {
        return this.$t('text-nft.not-for-sale')
      }
      if (this.showBtnPlaceABid(item)) {
        return `${listingPrice}` + ` ` + item.currency + ` ` + ` ~ $` + `${dolarPrice}`
      }
    }
    compact(input: string, len: any = 25): string {
      let textContent = input
      if (textContent.length >= len) {
        if (window.innerWidth < 450) {
          const whiteSpace = textContent.lastIndexOf(' ', len)
          return textContent.slice(0, whiteSpace) + '...'
        }
      }
      return textContent
    }
    handleViewOwner(id: string): void {
      let id2 = id
      this.$router.push({ name: 'UserProfile', params: { id: id2 } })
    }
    async handleBuy(item: Record<string, any>): Promise<void> {
      this.itemOwer = {
        creatorFee: item.creatorFee,
        id: item.itemId,
        ownerIdMinPrice: item.ownerId,
        minListingId: item.listingId,
        minListingPrice: item.listingPrice,
        minListingPriceWei: item.listingPriceWei,
        itemName: item.itemName,
        currency: item.currency
      }
      const result = await this.getListTokenAccept(item)
      this.setCurrencySelectBuy(result[0].currency)
      this.setInfoNft({ ...this.nftItem, ...this.itemOwer })
      if (!this.isLogin) {
        if (this.isExternalWallet) {
          if (this.walletAddress) {
            this.setTypeAction('buy')
            this.actionWhenLogged({ ...this.nftItem, ...this.itemOwer }, this.contractAddress, 'buy')
          } else {
            if ((this.isExternalWalletMobile && !this.isDesktop) || this.isDesktop) {
              this.setOpenPopup({
                popupName: 'popup-payment-method',
                isOpen: true
              })
            } else {
              this.redirectLogin(this.nftItem)
            }
          }
        } else {
          this.redirectLogin(this.nftItem)
        }
      } else {
        await this.getLynkeyInfo(item)
      }
    }
    redirectLogin(nftItem: Record<string, any>): void {
      const message: any = this.$t('notify.must-login')
      this.$message.error({ message, duration: 5000 })
      const detail = {
        isBack: 'nft',
        id: nftItem.id! as string,
        name: 'DetailNftItem'
      }
      setTimeout(() => {
        this.$router.push({ name: 'login', query: { ...detail } })
      }, 1000)
    }
    async getListTokenAccept(item: Record<string, any>): Promise<any> {
      try {
        const params = { listingId: item.listingId, itemId: item.itemId }

        const result = await apiNftV2.getListAcceptPayment(params)

        if (!result.length) {
          const message = this.$t('notify_empty-list-accept-currency') as string
          this.$message.error({ message, duration: 5000 })
          return Promise.reject()
        }

        // const tokenWithoutUSDT = filter(result, elm => elm.currency !== 'USDT')
        // this.setListAcceptCurrency(tokenWithoutUSDT)
        this.setListCurrenciesBuy(result)
        return Promise.resolve(result)
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    }
    async getLynkeyInfo(nftItem): Promise<void> {
      try {
        const params = {
          listingId: nftItem?.listingId
        }
        const result = await apiNft.getLynkeyInfo(this.currencySelectBuy, params)
        this.infoLynkey = result || []
        this.setInfoActivity(result)
        this.setOpenPopup({
          popupName: 'popup-buy-nft',
          isOpen: true
        })
      } catch (error) {
        let message = this.$t('notify.error-info') as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject()
      }
    }
    async handleSizeChange(newsize: number): Promise<void> {
      this.query = {
        ...this.query,
        limit: newsize,
        page: 1
      }
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
    async handleCurrentChange(newPage: number): Promise<void> {
      this.query.page = newPage
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
    handleSetOpenDrawer(filter: Record<string, any>): void {
      this.setOpenDrawer({
        drawerName: 'filter-owners',
        isOpen: true
      })
      console.log('tabActive', this.tabActive)
    }
    async handleApplyFilterOwnersMobile(): Promise<void> {
      this.query = {
        ...this.query,
        ...this.filtersMobile
      }
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
      this.setOpenDrawer({
        drawerName: 'filter-owners',
        isOpen: false
      })
    }
    handleResetFilter(): void {
      this.filtersMobile = {
        isVerified: null,
        orderBy: null
      }
    }
    handleClickOrder(item: any): void {
      this.filtersMobile.orderBy = item.command
      console.log(this.filtersMobile.orderBy)
    }
    async handleLoadMore(): Promise<void> {
      if (this.totalElements >= this.query.limit + 5) {
        this.query.limit += 5
      } else {
        this.query.limit = this.totalElements
      }
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
    handlePutOnsale(item: Record<string, any>): void {
      const nftItem = {
        ...this.nftItem,
        ...item,
        creatorFee: item.creatorFee,
        id: item.itemId,
        ownerIdMinPrice: item.ownerId,
        minListingId: item.listingId,
        minListingPrice: item.listingPrice,
        minListingPriceWei: item.listingPriceWei,
        itemName: item.itemName,
        currency: this.nftItem.currency
      }
      this.putOnSale(nftItem)
    }
    handleRemoveFromSale(): void {
      this.removeSale(this.nftItem)
    }
    // async handleRemove(item: Record<string, any>): Promise<void> {
    //   if (!this.isLogin) {
    //     if (this.isExternalWallet) {
    //       this.setOpenPopup({
    //         popupName: 'popup-payment-method',
    //         isOpen: true
    //       })
    //     } else {
    //       this.redirectLogin(this.nftItem)
    //     }
    //   } else {
    //     this.setOpenPopup({
    //       popupName: 'popup-remove',
    //       isOpen: true
    //     })
    //     // this.getRemove(item)
    //   }
    // }
    // async getRemove(nftItem): Promise<void> {
    //   try {
    //     const params = {
    //       listingId: nftItem?.listingId
    //     }
    //     const result = await apiNft.getListOwners(nftItem.listingId, params)
    //     // const result = await apiNft.getLynkeyInfo(nftItem.listingId, params)
    //     // console.log('ngu', result);
    //     this.infoLynkey = result || []
    //     this.setInfoActivity(result)
    //     // item.isOnSale === 'NO' && item.isOwner === 'YES'
    //     // this.listOwner[nftItem.id]
    //     this.setOpenPopup({
    //       popupName: 'popup-remove',
    //       isOpen: true
    //     })
    //   } catch (error) {
    //     let message = this.$t('notify.error-info') as string
    //     this.$message.error({ message, duration: 5000 })
    //     return Promise.reject()
    //   }
    // }
    async handleReloadList(): Promise<void> {
      const result = await apiNft.getListOwners(this.$route.params.id, this.query, true)
      this.list = result.content
      this.totalElements = result.totalElements
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.owner-nft {
    .wrap-sort {
      &:hover {
        .span-icon {
          color: var(--bc-theme-primary-gradient-hover) !important;
        }
        .nft-body-base {
          background: var(--bc-menu-active);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    @media (max-width: 1200px) {
      max-width: 630px;
      margin: 0 auto;
      .filters {
        width: 100%;
        .el-form {
          width: 287px;
          .el-input__inner {
            // width: 275px !important;
          }
        }
      }
    }
    .filters {
      width: 100%;
      margin: 24px 0 40px 0;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-form {
        width: 336px;
        height: 72px;
        display: flex;
        align-items: center;
        .el-form-item {
          margin-bottom: 0 !important;
          .el-select {
            .el-input__inner {
              height: 48px;
            }
            &.russian {
              .el-input__inner {
                width: 240px;
              }
            }
            &.vietnam {
              .el-input__inner {
                width: 200px;
              }
            }
            &.japanese {
              .el-input__inner {
                width: 194px;
              }
            }
            &.sale-status.russian {
              .el-input__inner {
                width: 170px;
              }
            }
          }
        }

        @media screen and (max-width: 375px) {
          width: 100%;

          &-item {
            width: 100%;
            &__content {
              width: 100%;
              .el-select {
                width: 100%;
              }
            }
          }
        }
      }
      &-button {
        width: 3rem;
        height: 3rem;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--bc-table-border);
        border-radius: 4px;
        .span-icon {
          line-height: 16px;
        }
      }
    }
    @media (max-width: 768px) {
      .filters {
        margin: 20px 0 24px 0;
      }
    }

    .owner-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      @media (max-width: 768px) {
        display: block;
        .list-owner {
          width: 100% !important;
        }
      }
      .list-owner {
        width: 590px;
        &-item {
          width: 100%;
          height: 48px;
          display: flex;
          justify-content: left;
          align-items: center;
          margin-bottom: 24px;
          position: relative;
          @media (max-width: 768px) {
            padding-bottom: 16px;
            height: auto;
            &:not(:last-child) {
              border-bottom: 1px solid var(--bc-table-border);
            }
          }
          &:last-child {
            margin-bottom: 18px;
          }
          &__index {
            font-size: 16px;
            line-height: 48px;
            font-weight: 600;
            color: var(--bc-text-discript2);
            width: 19.5px;
          }
          &__img {
            position: relative;
            img {
              border-radius: 50%;
            }
            .icon-verified {
              position: absolute;
              bottom: 0;
              right: 0;
            }
          }
          &__text {
            .name {
              font-size: 16px;
              font-weight: 600;
              color: var(--bc-text-primary);
            }
            .description {
              font-weight: 400;
              font-size: 14px;
              color: var(--bc-text-color-tab-item);
            }
          }
          .button-buy {
            width: 160px;
            height: 48px;
            margin-right: 16px;
            font-size: 16px;
            line-height: 48px;
            font-weight: 600;
            color: var(--bc-text-color-tab-item);
            text-align: center;
            border: 1px solid var(--bc-table-border);
            border-radius: 6px;
            position: absolute;
            right: 0;
            &:hover {
              background: var(--bc-theme-primary-gradient);
              color: #fff;
            }
            @media (max-width: 768px) {
              width: 75px;
              font-size: 14px;
              line-height: 30px;
              height: 32px;
              margin-right: 0px;
            }
            &.russian {
              width: auto;
              display: inline-block;
              padding: 0 16px;
            }
          }
        }
      }
    }
    .owner-pagination {
      width: 100%;
      height: auto;
      .base-pagination {
        border-top: none;
      }
    }
    .mr-16 {
      margin-right: 1rem;
    }
    .mr-12 {
      margin-right: 12px;
    }
    .ml-7px {
      margin-left: 7px;
    }
  }
  ::v-deep.dropdown-sort-nft {
    &.russian {
      width: auto;
      li {
        width: 280px;
      }
    }
  }
  ::v-deep.drawer-filter {
    .el-form-item {
      &__label {
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
      }
      .el-select {
        width: 100%;
        .el-input__inner {
          width: 100%;
        }
      }
    }
    .verified {
      &-label {
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .wrap-button {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        button {
          text-align: center;
          font-size: 16px;
          line-height: 24px;
          width: calc(50% - 10px);
          height: 48px;
          background-color: transparent;
          border: 1px solid var(--bc-table-border);
          border-radius: 4px;
          font-weight: 600;
          color: #5b616e;
          &.active {
            border-color: var(--bc-text-footer-about);
            color: #0a0b0d;
          }
        }
      }
    }
    .drawer-footer {
      width: 100%;
      height: auto;
      position: absolute;
      padding: 0 20px;
      bottom: 0;
      left: 0;
      margin-bottom: 32px;
      button {
        width: 100%;
        height: 48px;
        text-align: center;
        border: 1px solid var(--bc-table-border);
        border-radius: 4px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        background: var(--bc-theme-primary-gradient);
        color: var(--bc-color-white);
      }
    }
  }
  ::v-deep.owners-load-more {
    width: 100%;
    height: auto;
    padding: 0 20px;
    .btn-more {
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      padding: 15px 0;
      border: 1px solid var(--bc-table-border);
      border-radius: 4px;
      background-color: transparent;
      &:hover {
        border-color: #c6e2ff;
        color: #409eff;
        background-color: #ecf5ff;
      }
    }
  }
</style>
