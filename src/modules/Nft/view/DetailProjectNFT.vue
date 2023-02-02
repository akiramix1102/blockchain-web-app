<template>
  <div class="detail-nft">
    <div class="container-nft">
      <HeaderDetailNFT
        ref="header-nft"
        v-if="detailNft && detailNft.nftItem"
        :nftItem="detailNft.nftItem"
        :metaData="detailNft.metaDatas"
        :metaType="detailNft.metaTypes"
        :creator="detailNft.creator"
        :owners="detailNft.owners"
        :medias="detailNft.medias"
        :policies="detailNft.policies"
        @favourite="handleClickFavourite"
        @dataPopupBid="handleBid"
        @reload="init"
      />
      <div class="be-flex tab">
        <div
          v-for="(item, index) in getArrTab"
          :key="index"
          class="text-desc cursor nft-body-base tab-item"
          :class="item.tab === tabActive ? 'tab-active' : null"
          @click="handleClickTab(item.tab)"
        >
          {{ item.title }}
        </div>
      </div>
      <ContentDetailNFT
        v-if="tabActive === 'ACTIVITY'"
        :query="query"
        :listActivity="listActivity"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        @filter="handleFilter"
        :changeTabAcitve="tabActive"
        :nftItem="detailNft.nftItem"
      />
      <owner-nft v-if="tabActive === 'OWNER'" :nftItem="detailNft.nftItem" />
      <ContentDetailNFT
        v-if="tabActive === 'BID'"
        :query="queryBid"
        :listActivity="listActivity"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        @filter="handleFilterBid"
        :changeTabAcitve="tabActive"
        :nftItem="detailNft.nftItem"
      />
      <staking-chart v-if="tabActive === 'CHART'" />
      <list-property v-if="!isLoading && tabActive === 'PROPERTY'" :data="propertyDetail" />
      <SlideDetail v-if="itemRelated" :itemRelated="itemRelated" @favourite="handleClickFavourite" />
    </div>
    <Footer />
    <!-- <PopupPlaceABid :title="title" :titlePrice="titlePrice" :isShowBtn="isShowBtn" :nftItem="itemNft" /> -->
  </div>
</template>

<script lang="ts">
  import { Component, Watch, Mixins } from 'vue-property-decorator'
  import HeaderDetailNFT from '../components/nft-detail/HeaderDetailNFT.vue'
  import ContentDetailNFT from '../components/nft-detail/ContentDetailNFT.vue'
  import SlideDetail from '../components/nft-detail/SlideDetailNFT.vue'
  import ListProperty from '../components/nft-detail/ListProperty.vue'
  import OwnerNft from '../components/nft-detail/OwnerNft.vue'
  import StakingChart from '../components/nft-detail/StakingChart.vue'
  // import DetailContent from '../components/detail-project/DetailContent.vue'
  import Footer from '../components/Footer.vue'
  import EventBus from '@/utils/eventBus'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')

  import { namespace } from 'vuex-class'

  import includes from 'lodash/includes'
  import filter from 'lodash/filter'
  import firebase from '@/utils/firebase'

  const beBase = namespace('beBase')
  const beAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')
  const bcMarketHome = namespace('bcMarketPrimaryHome')

  import PopupMixin from '@/mixins/popup'
  import { cloneDeep, forEach } from 'lodash'

  interface IDetailNft {
    creator?: Record<string, any>
    nftItem?: Record<string, any>
    nftStat?: Record<string, any>
    owners?: Array<Record<string, any>>
    metaDatas: Array<Record<string, any>>
    metaTypes: Array<Record<string, any>>
    medias?: Array<Record<string, any>>
    policies?: Array<Record<string, any>>
  }

  @Component({ components: { Footer, HeaderDetailNFT, SlideDetail, ContentDetailNFT, ListProperty, OwnerNft, StakingChart } })
  export default class DetailProject extends Mixins(PopupMixin) {
    @beBase.State('coinMain') coinMain!: string
    @bcMarketHome.Action('setMetaData') setMetaData!: (list: Array<Array<Record<string, any>>>) => void
    @beAuth.Getter('isBid') isBid!: boolean
    @beAuth.State('user') user!: Record<string, any>
    @beAuth.State('userNft') userNft!: Record<string, any>
    @beAuth.Getter('isLogin') isLogin!: boolean
    @bcNft.Mutation('SET_STATUS_APPROVE_ITEM') setStatusApproveItem!: (status: string) => void
    @bcNft.Mutation('SET_TRANSACTION_CODE_ITEM') setTransactionCodeItem!: (code: string) => void
    @bcNft.Mutation('SET_LIST_TRANS_BUY_NFT') setListTransNft!: (list: Array<Record<string, any>>) => void
    @bcNft.Mutation('SET_STATUS_APPROVE_ACCOUNT') setStatusApproveAccount!: (status: string) => void
    @bcNft.State('statusApproveItem') statusApproveItem!: string
    @bcNft.State('listTransactionNft') listTransactionNft!: string

    detailNft: IDetailNft = {
      metaDatas: [],
      metaTypes: []
    }
    itemRelated: Array<Record<string, any>> = []
    listActivity: Array<Record<string, any>> = []
    isShowStakingChart = false
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0,
      orderBy: 'CREATED_AT_DESC'
    }
    queryBid: Record<string, any> = {
      page: 1,
      limit: 10,
      activityTab: 'BIDS',
      total: 0
    }
    itemNft = ''
    // itemBid = ''
    title = ''
    titlePrice = ''
    isShowBtn = false
    lynkeyInfo: any = {}
    bidInfo: any = {}
    // changeTabAcitve = ''
    isLoading = false
    propertyDetail: Record<string, any> = {}

    refApproveItem: any = null
    refTransBuyNft: any = null
    refApproveAccount: any = null

    arrTab: Array<Record<string, any>> = [
      {
        tab: 'OWNER',
        title: this.$i18n.t('update-owner-tab.tab')
      },
      {
        tab: 'ACTIVITY',
        title: this.$t('detail-nft.tab.activi')
      },
      {
        tab: 'BID',
        title: this.$t('detail-nft.tab.bids')
      }

      // {
      //   tab: 'STATS',
      //   title: this.$t('detail-nft.tab.stats')
      // }
    ]

    tabActive = 'OWNER'

    get getArrTab(): Array<Record<string, any>> {
      let arrTab: Array<Record<string, any>> = []
      if (this.coinMain === 'LYNK') {
        if (!this.isBid || this.detailNft?.nftItem?.totalSupply > 1) {
          if (this.detailNft?.nftItem?.dispStatus === 'USED') {
            arrTab = [
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              }
            ]
          } else {
            arrTab = [
              {
                tab: 'OWNER',
                title: this.$i18n.t('update-owner-tab.tab')
              },
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              }
            ]
          }
        } else {
          if (this.detailNft?.nftItem?.dispStatus === 'USED') {
            arrTab = [
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              },
              {
                tab: 'BID',
                title: this.$t('detail-nft.tab.bids')
              }
            ]
          } else {
            arrTab = [...this.arrTab]
          }
        }
      }
      if (this.coinMain === 'CLM') {
        if (!this.isBid || this.detailNft?.nftItem?.totalSupply > 1) {
          if (this.detailNft?.nftItem?.dispStatus === 'USED') {
            arrTab = [
              {
                tab: 'PROPERTY',
                title: this.$t('detail-nft.tab.property')
              },
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              }
            ]
          } else {
            arrTab = [
              {
                tab: 'OWNER',
                title: this.$i18n.t('update-owner-tab.tab')
              },
              {
                tab: 'PROPERTY',
                title: this.$t('detail-nft.tab.property')
              },
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              }
            ]
          }
        } else {
          if (this.detailNft?.nftItem?.dispStatus === 'USED') {
            arrTab = [
              {
                tab: 'PROPERTY',
                title: this.$t('detail-nft.tab.property')
              },
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              }
            ]
          } else {
            arrTab = [
              {
                tab: 'OWNER',
                title: this.$i18n.t('update-owner-tab.tab')
              },
              {
                tab: 'PROPERTY',
                title: this.$t('detail-nft.tab.property')
              },
              {
                tab: 'ACTIVITY',
                title: this.$t('detail-nft.tab.activi')
              }
            ]
          }
        }
      }
      if (this.isShowStakingChart) {
        arrTab.push({
          tab: 'CHART',
          title: 'Chart'
        })
      }
      return arrTab
    }

    @Watch('$route.params.id') watchRouteId(_id: string): void {
      if (_id) {
        this.init()
      }
    }
    // @Watch('tabActive') watchTabActive(valueNew): void {
    //   this.changeTabAcitve = valueNew
    // }

    @Watch('statusApproveItem') handleWatchStatusApproveItem(newStatus: string, oldStatus: string): void {
      if (oldStatus !== 'NONE' && oldStatus !== 'FAILED' && newStatus === 'SUCCESS') {
        this.init()
      }
    }
    @Watch('listTransactionNft') handleWatchListTransactionNft(_new: Array<Record<string, any>>, old: Array<Record<string, any>>): void {
      if ((!_new.length && !old.length) || (_new.length && !old.length)) {
        return
      }
      this.init()
      EventBus.$emit('reload-list-owner')
    }

    async created(): Promise<void> {
      this.getStakingChart()
      await this.init()
      if (this.coinMain === 'CLM') {
        this.$route.params.type = 'product'
        await this.getMetaData()
        // this.tabActive = 'PROPERTY'
        // this.tabActive = 'OWNER'
        if (this.$route.query.tab === 'ACTIVITY') {
          this.tabActive = 'ACTIVITY'
          await this.$router.replace({ query: undefined }).catch(error => {
            if (error.name != 'NavigationDuplicated') throw error
          })
        }
      } else {
        if (this.$route.query.tab === 'ACTIVITY') {
          this.tabActive = 'ACTIVITY'
          await this.$router.replace({ query: undefined }).catch(error => {
            if (error.name != 'NavigationDuplicated') throw error
          })
        } else {
          if (this.detailNft?.nftItem?.dispStatus === 'USED') {
            this.tabActive = 'ACTIVITY'
          } else {
            this.tabActive = 'OWNER'
          }
        }
      }

      if (!this.isLogin) {
        this.handleGetApproveItem()
      }
      this.handleGetListTransBuyNft()
      EventBus.$on('reload-detail-nft', this.init)
      // EventBus.$on('reload-remove', this.init)
    }

    handleGetApproveItem(): void {
      const refApproveAccount = firebase.database().ref(`nft_approved_items/${this.user.id}_${this.$route.params.id}`)
      this.refApproveItem = refApproveAccount.on('value', snapshot => {
        if (snapshot.val()) {
          this.setStatusApproveItem(snapshot.val().status)
          this.setTransactionCodeItem(snapshot.val().transaction_code)
        } else {
          this.setStatusApproveItem('NONE')
        }
      })
    }

    offListenerFirebase(): void {
      this.setStatusApproveItem('NONE')
      this.setStatusApproveAccount('NONE')
      this.setListTransNft([])
      const refApproveItem = firebase.database().ref(`nft_approved_items/${this.user.id}_${this.$route.params.id}`)
      refApproveItem.off('value', this.refApproveItem)
      const refTransBuyNft = firebase.database().ref(`nft_transactions/${this.$route.params.id}`)
      refTransBuyNft.off('value', this.refTransBuyNft)
    }

    handleGetListTransBuyNft(): void {
      const refTransBuyNft = firebase.database().ref(`nft_transactions/${this.$route.params.id}`)
      this.refTransBuyNft = refTransBuyNft.on('value', snapshot => {
        if (snapshot.val()) {
          const arrayTrans: Array<Record<string, any>> = Object.values(snapshot.val())
          const listPending = filter(arrayTrans, transaction => transaction.status !== 'FAILED' && transaction.status !== 'SUCCESS')
          const listPendingOfUserTypeSale = filter(
            listPending,
            item => (Number(item.from_id) === this.userNft.id || Number(item.to_id) === this.userNft.id) && item.transaction_type === 'SALE'
          )
          const listPendingOfUserTypeTransfer = filter(listPending, item => Number(item.from_id) === this.userNft.id && item.transaction_type === 'TRANSFER')
          this.setListTransNft([...listPendingOfUserTypeSale, ...listPendingOfUserTypeTransfer])
        } else {
          this.setListTransNft([])
        }
      })
    }

    handleClickTab(tab: string): void {
      this.tabActive = tab
      if (tab === 'ACTIVITY') {
        this.getListActivity()
      }
      if (tab === 'BID') {
        this.getListActivity()
      }
      if (tab === 'PROPERTY') {
        this.propertyDetail = apiNft.getDetailProperty('product', this.detailNft?.nftItem?.productCode).then(res => {
          this.propertyDetail = res
        })
      }
    }

    handleBuy(itemNft): void {
      this.itemNft = itemNft

      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-buy-nft',
        isOpen: true
      })
      this.setOpenPopup({
        popupName: 'popup-success',
        isOpen: false
      })
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
      this.title = 'place a bid'
      this.titlePrice = 'Your bid'
      this.isShowBtn = false
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-place-bid',
        isOpen: true
      })
      this.setOpenPopup({
        popupName: 'popup-bid-success',
        isOpen: false
      })
    }
    handleOffer(itemNft): void {
      this.itemNft = itemNft
      this.title = 'make offer'
      this.titlePrice = 'Price'
      this.isShowBtn = true
      // this.setOpenPopup({
      //   // command: 'a',
      //   popupName: 'popup-place-bid',
      //   isOpen: true
      // })
      // this.setOpenPopup({
      //   popupName: 'popup-bid-success',
      //   isOpen: false
      // })
    }
    destroyed(): void {
      this.offListenerFirebase()
      // EventBus.$off('reload-remove')
    }
    async init(): Promise<void> {
      try {
        this.isLoading = true
        this.detailNft = await apiNft.getDetailNftItem(this.$route.params.id)
        this.toggleReadmoreButton()

        for (let i = this.detailNft.metaTypes.length - 1; i >= 0; i--) {
          let check = false
          if (this.detailNft.metaDatas.length > 0) {
            for (let j = 0; j < this.detailNft.metaDatas.length; j++) {
              if (this.detailNft.metaTypes[i].metaType == this.detailNft.metaDatas[j].metaType) {
                check = true
              }
            }
          }
          if (this.detailNft.metaTypes[i].metaType == 'INFO' || this.detailNft.metaTypes[i].metaType == 'PERFORMANCE') {
            check = true
          }
          if (!check) {
            this.detailNft.metaTypes.splice(i, 1)
          }
          check = false
        }
        this.itemRelated = await apiNft.getItemRelated(this.$route.params.id)
        if (this.coinMain === 'LYNK') {
          await this.getListActivity()
        } else {
          if (this.tabActive === 'ACTIVITY') {
            this.getListActivity()
          }
          this.propertyDetail = await apiNft.getDetailProperty('product', this.detailNft?.nftItem?.productCode)
        }
        this.isLoading = false
      } catch (error: any) {
        console.log(error)

        this.isLoading = false
        const { data, config } = error.response
        if (data.statusCode === 400 && !includes(config.url, 'product/detail')) {
          // this.$router.push({ name: 'notFound', params: { urlString } })
        }
      }
    }

    async getStakingChart(): Promise<void> {
      try {
        const params = {
          itemId: this.$route.params.id,
          fromDate: this.formatTimestamp()
        }
        const result = await apiNft.getStakingChart(params)
        this.isShowStakingChart = result.length ? true : false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    formatTimestamp(): string {
      const DAY = 30
      const time = new Date(Date.now() - DAY * 24 * 60 * 60 * 1000).getTime()

      if (!time) {
        return ''
      }
      const gmt = new Date().getTimezoneOffset() / -60
      const ago = time - gmt * 60 * 60 * 1000
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

    toggleReadmoreButton(): void {
      setTimeout(function () {
        const divDesc = document.getElementById('text-description')

        const scrollHeight = divDesc ? divDesc.scrollHeight : 0
        const offsetHeight = divDesc ? divDesc.offsetHeight : 0
        const readMore = document.getElementById('read-more')

        readMore ? readMore.removeAttribute('style') : null

        if (scrollHeight == offsetHeight && offsetHeight != 0) {
          if (divDesc) {
            readMore ? readMore.setAttribute('style', 'display: none') : null
          }
        }
      }, 200)
    }

    async getMetaData(): Promise<void> {
      try {
        const api1 = apiNft.getSystemparam({ type: 'BLOCK_META_DATA' })
        const api2 = apiNft.getSystemparam({ type: 'PRODUCT_META_DATA' })
        const api3 = apiNft.getSystemparam({ type: 'PROJECT_META_DATA' })
        const api4 = apiNft.getSystemparam({ type: 'FEATURE' })
        const result = await Promise.all([api1, api2, api3, api4])
        this.setMetaData(result)
      } catch (error) {
        console.log(error)
      }
    }

    async getListActivity(): Promise<void> {
      try {
        if (this.tabActive === 'ACTIVITY') {
          const result = await apiNft.getListActivity({ ...this.query, itemId: this.$route.params.id })
          this.listActivity = result.content || []
          this.query.total = result.totalElements
        }
        if (this.tabActive === 'BID') {
          const result = await apiNft.getListActivity({ ...this.queryBid, itemId: this.$route.params.id })
          this.listActivity = result.content || []
          this.queryBid.total = result.totalElements
        }

        // console.log('listActivity', this.listActivity)
      } catch (error) {
        console.log(error)
      }
    }

    async handleClickFavourite(data: Record<string, any>): Promise<void> {
      try {
        await apiNft.favouriteItem(data)
      } catch (error) {
        console.log(error)
      }
    }

    handleSizeChange(size: number): void {
      if (this.tabActive === 'BID') {
        this.queryBid.limit = size
        this.getListActivity()
      } else {
        this.query.limit = size
        this.getListActivity()
      }
    }
    handleCurrentChange(page: number): void {
      if (this.tabActive === 'BID') {
        this.queryBid.page = page
        this.getListActivity()
      } else {
        this.query.page = page
        this.getListActivity()
      }
    }
    // handleSizeChange(size: number): void {
    //   this.queryBid.limit = size
    //   this.getListActivity()
    // }
    // handleCurrentChange(page: number): void {
    //   this.queryBid.page = page
    //   this.getListActivity()
    // }

    handleFilter(filter: Record<string, any>): void {
      this.query.page = 1
      this.query.limit = 10
      this.query = {
        ...this.query,
        ...filter,
        fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null
      }
      this.getListActivity()
    }
    handleFilterBid(filter: Record<string, any>): void {
      this.queryBid.page = 1
      this.queryBid.limit = 10
      this.queryBid = {
        ...this.queryBid,
        ...filter,
        fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null
      }
      this.getListActivity()
    }

    mounted() {
      this.setOpenPopup({
        popupName: 'popup-list-bid-offer',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
  .detail-nft {
    padding-top: 120px;
    .tab {
      margin-top: 32px;
      border-bottom: 1px solid #dbdbdb;
      .tab-item {
        @media (max-width: 375px) {
          padding: 16px 10px !important;
        }
        padding: 16px 12px;
        position: relative;
        &:hover {
          background: var(--bc-menu-active);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .tab-active {
        background: var(--bc-menu-active);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background: var(--bc-theme-primary-gradient);
        }
      }
    }
    @media (max-width: 767px) {
      padding-top: 70px;
    }
  }
</style>
