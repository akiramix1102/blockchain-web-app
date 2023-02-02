<template>
  <div class="collection-detail">
    <div :class="isDesktop ? 'container-nft' : null">
      <header-collection-detail
        v-if="detailCollection && detailCollection.collection && isDesktop"
        :collectionStat="detailCollection.collectionStat"
        :collection="detailCollection.collection"
        :collectionMedias="detailCollection.medias"
        :isFavourite="detailCollection.isFavourite"
        :creator="detailCollection.creator"
        @favourite="handleClickFavouriteHeader"
      />
      <mobile-header-collection-detail
        v-if="detailCollection && detailCollection.collection && !isDesktop"
        :collectionStat="detailCollection.collectionStat"
        :collection="detailCollection.collection"
        :collectionMedias="detailCollection.medias"
        :isFavourite="detailCollection.isFavourite"
        :creator="detailCollection.creator"
        @favourite="handleClickFavouriteHeader"
      />
      <div class="be-flex jc-space-center tab">
        <div
          v-for="(item, index) in arrTab"
          :key="index"
          class="text-desc cursor nft-header6 tab-item"
          :class="index === tabActive ? 'tab-active' : null"
          @click="handleClickTab(index)"
        >
          {{ item.title }}
        </div>
      </div>
      <div>
        <filter-collection-detail v-if="isDesktop" :dataFilter="dataFilter" :tabActive="tabActive" @filter="handleFilter" />
        <filter-collection-detail-mobile v-else :dataFilter="dataFilter" :tabActive="tabActive" @filter="handleFilterMobile" class="container-nft" />
      </div>
      <div v-if="tabActive === 1">
        <ActivitiesCollection :query="query" :filter="filter" :dataActivities="dataActivities" v-if="isDesktop" />
        <collection-activity-mobile :query="query" v-if="dataActivities.length && !isDesktop" :filter="filter" :dataActivities="dataActivities" @loadmore="handleLoadMore" />
        <empty-block v-if="!dataActivities.length" :show="true" class="empty" />
      </div>

      <div v-if="tabActive === 0">
        <list-nft name="listcollection" v-if="arrItems.length && isDesktop" :arrItems="arrItems" @favourite="handleClickFavourite" />
        <list-collection-mobile :query="query" v-if="arrItems.length && !isDesktop" :arrItems="arrItems" @loadmore="handleLoadMore" @favourite="handleClickFavourite" />
        <empty-block v-if="!arrItems.length" :show="true" class="empty" />
      </div>
      <base-pagination
        :class="isDesktop ? null : 'hide'"
        v-if="this.tabActive === 0"
        :table="query"
        :info="paginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      />
    </div>
    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  // import DrawerMixin from '@/mixins/drawer'
  import HeaderCollectionDetail from '../components/collection/HeaderCollectionDetail.vue'
  import MobileHeaderCollectionDetail from '../components/home/mobile/MobileHeaderCollectionDetail.vue'
  import FilterCollectionDetail from '../components/collection/FilterCollectionDetail.vue'
  import FilterCollectionDetailMobile from '../components/home/mobile/FilterDetailCollectionMobile.vue'
  import CollectionActivityMobile from '../components/home/mobile/CollectionActivityMobile.vue'
  import ListCollectionMobile from '../components/home/mobile/ListCollectionMobile.vue'
  import filter from 'lodash/filter'

  import ListNft from '../components/collection/ListCollection.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import EventBus from '@/utils/eventBus'
  import FooterMarket from '../components/Footer.vue'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  import ActivitiesCollection from '../components/collection/ActivitieCollection.vue'
  const apiNft: NftRepository = getRepository('nft')

  interface IDetailCollection {
    collection: Record<string, any>
    collectionStat: Record<string, any>
    creator: Record<string, any>
    isFavourite: string
  }
  @Component({
    components: {
      HeaderCollectionDetail,
      FilterCollectionDetail,
      FilterCollectionDetailMobile,
      ListNft,
      FooterMarket,
      EmptyBlock,
      ActivitiesCollection,
      CollectionActivityMobile,
      MobileHeaderCollectionDetail,
      ListCollectionMobile
    }
  })
  export default class CollectionDetail extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean

    arrTab: Array<Record<string, any>> = [
      { id: 1, title: this.$t('nft.tab.item') },
      { id: 2, title: this.$t('nft.tab.active') }
      // { id: 3, title: this.$t('nft.tab.stats') }
    ]
    filter: Record<string, any> = {
      collectionId: this.$route.params.id,
      fromDate: '',
      toDate: ''
      // lastTime: 'LAST_24_HOURS'
    }
    query: Record<string, any> = {
      page: 1,
      limit: 20,
      total: 0
    }

    // listData: Array<Record<string, any>> = []

    detailCollection: IDetailCollection = {
      collection: {},
      collectionStat: {},
      creator: {},
      isFavourite: ''
    }

    arrItems: Array<Record<string, any>> = []
    dataActivities: Array<Record<string, any>> = []
    tabActive = 0

    get paginationInfo(): string {
      return this.$t('paging.item') as string
    }

    popstateEventAction() {
      EventBus.$emit('emitTab', 'Collection')
      this.$router.push({ query: { tabActive: 'Collection' } })
      this.removePopstateEventAction()
    }
    removePopstateEventAction() {
      window.removeEventListener('popstate', this.popstateEventAction)
    }

    async created(): Promise<void> {
      EventBus.$on('emitDate', this.handleChangeTime)
      try {
        const id = this.$route.params.id!
        this.detailCollection = await apiNft.getDetailCollection(id)

        // update lại info nft khi mua
        EventBus.$on('reload-nft-collection', async () => {
          this.detailCollection = await apiNft.getDetailCollection(id)
          await this.getListItemInCollection()
        })
      } catch (error: any) {
        const { data } = error.response
        if (data.statusCode === 400) {
          const urlString = this.$route.path
          this.$router.push({ name: 'notFound', params: { urlString } })
        }
      }
      window.addEventListener('popstate', this.popstateEventAction)
    }

    async getListItemInCollection(): Promise<void> {
      if (this.tabActive === 0) {
        try {
          const collectionId = this.$route.params.id
          const result = await apiNft.getListItemInCollection({ ...this.query, collectionId, total: null })
          this.arrItems = result.content || []
          this.query.total = result.totalElements
        } catch (error) {
          console.log(error)
        }
      }
    }

    async getListActivity(): Promise<void> {
      const params = {
        ...this.query,
        ...this.filter,
        page: 1
        // limit: 10 ????
      }
      console.log('params', this.query, params)
      this.query = params
      const result = await apiNft.getListActivity(params)
      this.dataActivities = result.content
      this.query.total = result.totalElements
      console.log('dataActivities', this.dataActivities)
    }

    async init(): Promise<void> {
      if (this.tabActive === 0) {
        console.log('1')
        await this.getListItemInCollection()
      } else {
        console.log('2')
        await this.getListActivity()
      }
    }
    async loadActivity(): Promise<void> {
      await this.getListActivity()
    }
    handleLoadMore(): void {
      console.log('vao')
      this.query.limit += 10
      this.init()
    }
    handleChangeTime({ fromDate, toDate }: Record<string, any>): void {
      this.filter.fromDate = fromDate
      this.filter.toDate = toDate
    }
    resetQuery(): void {
      this.query = {
        page: 1,
        limit: 10,
        listType: 'NFT',
        orderBy: 'CREATED_AT_DESC',
        total: 0
      }
    }
    handleClickTab(index: number): void {
      this.tabActive = index
      console.log('active', this.tabActive)
      this.resetQuery()
      // if (this.tabActive === 1) {
      //   // console.log('1')
      //   // this.getListActivity()
      // } else {
      //   console.log('6')
      if (this.tabActive === 0) {
        this.getListItemInCollection()
      }
      if (this.tabActive === 1) {
        this.getListActivity()
      }
      //this.getListItemInCollection()
    }

    handleSizeChange(size: number): void {
      console.log('1')

      this.query.limit = size
      this.getListItemInCollection()
      // console.log("size", size);
    }
    handleCurrentChange(page: number): void {
      console.log('2')

      this.query.page = page
      this.getListItemInCollection()
    }
    dataFilter: any = {}
    handleFilter(filter: Record<string, any>): void {
      if (this.tabActive === 0) {
        if (this.isDesktop) {
          this.dataFilter = { ...filter }
          EventBus.$emit('emitFilterPrice', filter)
          this.query = { ...this.query, ...filter, page: 1, limit: 20, fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null }
          this.getListItemInCollection()
          // this.getListActivity()
        } else {
          this.dataFilter = { ...filter }
          EventBus.$emit('emitFilterPrice', filter)
          this.query = { ...this.query, ...filter, page: 1, limit: 10, fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null }
          //this.getListItemInCollection()
          // this.getListActivity()
        }
      }
      if (this.tabActive === 1) {
        //this.dataFilter = { ...filter }
        EventBus.$emit('emitFilterPrice', filter)
        this.query = { ...this.query, ...filter, page: 1, limit: 10, fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null }
        // this.getListItemInCollection()
        // this.getListActivity()
      }
    }
    handleFilterMobile(filter: Record<string, any>): void {
      if (!this.isDesktop) {
        if (this.tabActive === 0) {
          this.dataFilter = { ...filter }
          EventBus.$emit('emitFilterPrice', filter)
          this.query = { ...this.query, ...filter, page: 1, limit: 20, fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null }
          this.getListItemInCollection()
          // this.getListActivity()
        }
        if (this.tabActive === 1) {
          this.dataFilter = { ...filter }
          EventBus.$emit('emitFilterPrice', filter)
          this.query = { ...this.query, ...filter, page: 1, limit: 10, fromPrice: filter.fromPrice !== '0' && filter.fromPrice ? filter.fromPrice : null }
          // this.getListItemInCollection()
          this.getListActivity()
        }
      }
    }

    destroyed(): void {
      EventBus.$off('emitFilterPrice')
      EventBus.$off('reload-nft-collection')
    }

    async handleClickFavourite(data: Record<string, any>): Promise<void> {
      try {
        await apiNft.favouriteItem(data)
      } catch (error) {
        console.log(error)
      }
    }
    async handleClickFavouriteHeader(data: Record<string, any>): Promise<void> {
      try {
        const result = await apiNft.favouriteItem(data)
        this.detailCollection.collectionStat.numOfFavourites = result.numOfFavourites

        if (data.actionType === 'UN_FAVOURITE') {
          this.detailCollection.isFavourite = 'NO'
        } else {
          this.detailCollection.isFavourite = 'YES'
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  .hide {
    display: none;
  }
  ::v-deep.collection-detail {
    margin-top: 70px;
    .tab {
      margin-top: 16px;
      border-bottom: 1px solid #dbdbdb;
      .tab-item {
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
    .base-pagination {
      border-top: none;
      margin-bottom: 40px;
      padding-top: 20px;
    }
    .empty-block.empty {
      text-align: center;
      padding-bottom: 22px;
      .span-icon {
        font-size: 150px !important;
      }
      .empty-text {
        color: #8f8f8f;
      }
    }
  }
</style>
