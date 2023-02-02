<template>
  <div class="profile-nft">
    <div v-if="!isDesktop">
      <MobileHeaderMyProfile :dataMyprofile="profile" @follow="handleFollow" @reload="reloadDetail" />
      <div class="be-flex tab">
        <div style="display: flex">
          <div
            v-for="(item, index) in getArrayTab"
            :key="index"
            class="text-desc cursor nft-body-base-small tab-item"
            :class="item.value === tabActive ? 'tab-active' : null"
            @click="handleClickTab(item.value)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>

      <MobileFilterProfileNft class="container-nft" :tabActive="tabActive" ref="filter" :query="query" :listCategory="listCategory" @filter="handleApplyFilter" />
      <div class="content-tab" v-if="listData.length">
        <MobileActivitiesMyProfile v-if="tabActive === 'ACTIVITIES'" :listActivity="listData" @loadmore="handleLoadMore" :query="query" />
        <!-- <MobileListNftMyprofile v-if="tabActive !== 'ACTIVITIES' && query.listType === 'NFT'" :querynolimit="querynolimit" :listNft="listData" @favorite="handleFavorite" />
        <MobileListCollectionMyprofile v-if="tabActive !== 'ACTIVITIES' && query.listType === 'Collections'" :querynolimit="querynolimit" :listNft="listData" /> -->
      </div>
    </div>

    <div class="container-nft">
      <header-profile-nft-detail v-if="isDesktop" :dataMyprofile="profile" @follow="handleFollow" @reload="reloadDetail" />
      <div v-if="isDesktop" class="be-flex jc-space-center tab">
        <div
          v-for="(item, index) in getArrayTab"
          :key="index"
          class="text-desc cursor nft-header6 tab-item"
          :class="item.value === tabActive ? 'tab-active' : null"
          @click="handleClickTab(item.value)"
        >
          {{ item.title }}
        </div>
      </div>

      <filter-profile-nft v-if="isDesktop" :tabActive="tabActive" ref="filter" :listCategory="listCategory" @filter="handleFilter" />

      <div class="content-tab" v-if="listData.length">
        <list-nft
          v-if="tabActive !== 'ACTIVITIES' && query.listType === 'NFT'"
          :otherType="otherType"
          :tabUsed="tabUsed"
          :query="query"
          :listNft="listData"
          @loadmore="handleLoadMore"
          @favorite="handleFavorite"
        />
        <list-collection v-if="tabActive !== 'ACTIVITIES' && query.listType === 'Collections'" :query="query" :listNft="listData" @loadmore="handleLoadMore" />
        <table-activities v-if="tabActive === 'ACTIVITIES' && isDesktop" :listActivity="listData" :query="query" />
      </div>

      <empty-block v-else :show="true" class="empty" />

      <base-pagination
        v-if="isDesktop"
        :sizeChangeCustom="sizeChangeCustom"
        :table="query"
        :info="paginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      />
      <!-- <div v-if="!isDesktop" :table="query">
        <button class="load_more cursor" @click="loadMore">Load more</button>
      </div> -->
    </div>
    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import HeaderProfileNftDetail from '../components/myprofile/HeaderMyProfileDetail.vue'
  import MobileHeaderMyProfile from '../components/myprofile/mobileMyprofile/MobileHeaderMyProfile.vue'
  import FooterMarket from '../components/Footer.vue'
  import FilterProfileNft from '../components/myprofile/FilterProfileNft.vue'
  import ListNft from '../components/category/ListNft.vue'
  import ListCollection from '../components/category/ListCollection.vue'

  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import TableActivities from '../components/myprofile/TableActivities.vue'
  import MobileFilterProfileNft from '../components/myprofile/mobileMyprofile/MobileFilterProfileNft.vue'
  import MobileActivitiesMyProfile from '../components/myprofile/mobileMyprofile/MobileActivitiesMyProfile.vue'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import includes from 'lodash/includes'
  import filter from 'lodash/filter'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'

  const apiNft: NftRepository = getRepository('nft')
  const bcNft = namespace('bcNft')
  const beBase = namespace('beBase')

  @Component({
    components: {
      MobileHeaderMyProfile,
      HeaderProfileNftDetail,
      FooterMarket,
      FilterProfileNft,
      ListNft,
      ListCollection,
      EmptyBlock,
      TableActivities,
      MobileFilterProfileNft,
      MobileActivitiesMyProfile
    }
  })
  export default class ProfileNft extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean
    @beBase.State('coinMain') coinMain!: string
    profile: Record<string, any> = {}

    tabActive: string | (string | null)[] = 'ON_SALE'

    listData: Array<Record<string, any>> = []
    listCategory: Array<Record<string, any>> = []
    commentsToShow = 5
    totalComments = 0

    query: Record<string, any> = {
      page: 1,
      limit: 12,
      listType: 'NFT',
      orderBy: 'CREATED_AT_DESC',
      total: 0,
      listItemType: 'ON_SALE'
    }

    get getArrayTab(): Array<Record<string, any>> {
      if (this.$route.name === 'MyProfileNft' || this.profile.isMine === 'YES') {
        return [
          { id: 0, title: this.$t('view.my-profile.on-sale'), value: 'ON_SALE' },
          { id: 1, title: this.$t('view.my-profile.created'), value: 'CREATED' },
          { id: 2, title: this.$t('view.my-profile.owned'), value: 'OWNED' },
          { id: 3, title: this.$t('view.my-profile.used'), value: 'USED' },
          { id: 4, title: this.$t('view.my-profile.favorites'), value: 'FAVOURITE' },
          { id: 5, title: this.$t('view.my-profile.activities'), value: 'ACTIVITIES' }
        ]
      } else {
        return [
          { id: 0, title: this.$t('view.my-profile.on-sale'), value: 'ON_SALE' },
          { id: 1, title: this.$t('view.my-profile.created'), value: 'CREATED' },
          { id: 2, title: this.$t('view.my-profile.owned'), value: 'OWNED' },
          { id: 3, title: this.$t('view.my-profile.favorites'), value: 'FAVOURITE' },
          { id: 4, title: this.$t('view.my-profile.activities'), value: 'ACTIVITIES' }
        ]
      }
    }

    get paginationInfo(): string {
      if (this.tabActive !== 'ACTIVITIES' && this.query.listType === 'NFT') {
        return this.$t('paging.item') as string
      }
      if (this.tabActive !== 'ACTIVITIES' && this.query.listType === 'Collections') {
        return this.$t('paging.collection') as string
      }
      return this.$t('paging.activities') as string
    }

    get otherType(): boolean {
      const arrTab = ['ON_SALE', 'CREATED', 'OWNED']
      return includes(arrTab, this.tabActive) && this.$route.name === 'UserProfile'
    }

    get tabUsed(): boolean {
      return this.tabActive === 'USED'
    }

    get sizeChangeCustom(): boolean {
      return this.tabActive !== 'ACTIVITIES'
    }

    @Watch('$route.name') watchRouteName(): void {
      this.getDateChangeRoute()
    }
    @Watch('$route.params.id') watchRouteId(): void {
      this.getDateChangeRoute()
    }

    async created(): Promise<void> {
      EventBus.$on('reload-nft-profile', this.init)
      const routeName = this.$route.name
      this.profile = routeName === 'MyProfileNft' ? await apiNft.getMyProfileNft() : await apiNft.getUserprofile(this.$route.params.id)
      this.listCategory = await apiNft.getListCategoryFilter()
      this.listCategory.unshift({
        id: null,
        categoryName: this.$i18n.t('update-category.all'),
        levelDepth: 0
      })
      this.query = {
        ...this.query,
        ...this.$route.query
        //...this.$route.params
      }
      this.tabActive = this.$route.query.tabActive ? this.$route.query.tabActive : 'ON_SALE'

      this.init()
      console.log('trang', this.listCategory)
    }

    destroyed(): void {
      EventBus.$off('reload-nft-profile')
    }

    moreExist = false

    async init(): Promise<void> {
      await this.getListData()
    }

    async getListData(): Promise<void> {
      try {
        if (this.tabActive !== 'ACTIVITIES') {
          const listType = this.tabActive === 'ON_SALE' || this.tabActive === 'OWNED' ? null : this.query.listType
          const result = await apiNft.getListDataProfileNft(this.profile.id, { ...this.query, listItemType: this.tabActive, listType })
          this.listData = result.content || []
          this.query.total = result.totalElements

          // this.querynolimit.limit = result.totalElements
        } else {
          const result = await apiNft.getListActivityProfileNft(this.profile.id, { ...this.query, listItemType: null, listType: null })
          this.listData = result.content || []
          this.query.total = result.totalElements

          //this.querynolimit.limit = result.totalElements
        }
        console.log('listData', this.listData)
      } catch (error) {
        this.listData = []
        console.log(error)
      }
    }

    async getDateChangeRoute(): Promise<void> {
      this.resetQuery()
      //@ts-ignore
      this.$refs['filter']?.resetFilter()
      this.tabActive = 'ON_SALE'

      const routeName = this.$route.name
      this.profile = routeName === 'MyProfileNft' ? await apiNft.getMyProfileNft() : await apiNft.getUserprofile(this.$route.params.id)
      this.init()
    }

    handleClickTab(value: string): void {
      if (this.tabActive === value) {
        return
      }
      this.tabActive = value

      this.resetQuery()
      if (this.tabActive === 'ACTIVITIES') {
        this.query.page = 1
        this.query.limit = 10
      }
      //@ts-ignore
      this.$refs['filter']?.resetFilter()
      this.init()
    }

    handleFilter(filter: Record<string, any>): void {
      console.log('251...', filter)
      const { categoryId, orderBy, fromPrice, toPrice, saleType, isVerified, listType, transactionType, fromDate, toDate, id, listItemType, total, tabActive, network } = filter
      let url = ''
      this.query.page = 1
      this.query.limit = 12

      if (this.tabActive === 'ACTIVITIES') {
        this.query.page = 1
        this.query.limit = 10
      }

      const path = this.coinMain === 'LYNK' ? 'metamart' : 'marketplace'

      if (this.$route.name === 'MyProfileNft') {
        if (this.tabActive) {
          if (this.query.listType === 'Collections') {
            url = `/${path}/my-profile?orderBy=${orderBy}&isVerified=${isVerified}&categoryId=${categoryId}&fromPrice=${fromPrice}&toPrice=${toPrice}&listType=${listType}&tabActive=${this.tabActive}`
          }
          if (this.tabActive === 'ACTIVITIES') {
            url = `/${path}/my-profile?orderBy=${orderBy}&transactionType=${transactionType}&fromPrice=${fromPrice}&toPrice=${toPrice}&fromDate=${fromDate}&toDate=${toDate}&tabActive=${this.tabActive}`
          } else {
            url = `/${path}/my-profile?orderBy=${orderBy}&saleType=${saleType}&categoryId=${categoryId}&fromPrice=${fromPrice}&toPrice=${toPrice}&tabActive=${this.tabActive}&network=${network}`
          }
        } else {
          url = `/${path}/my-profile?orderBy=${orderBy}&saleType=${saleType}&categoryId=${categoryId}&fromPrice=${fromPrice}&toPrice=${toPrice}`
        }
        history.pushState(null, '', url)
      } else if (this.$route.name === 'UserProfile') {
        if (this.tabActive) {
          if (this.query.listType === 'Collections') {
            url = `/${path}/account/${this.$route.params.id}?orderBy=${orderBy}&isVerified=${isVerified}&categoryId=${categoryId}&fromPrice=${fromPrice}&toPrice=${toPrice}&listType=${listType}&tabActive=${this.tabActive}`
          }
          if (this.tabActive === 'ACTIVITIES') {
            url = `/${path}/account/${this.$route.params.id}?orderBy=${orderBy}&transactionType=${transactionType}&fromPrice=${fromPrice}&toPrice=${toPrice}&fromDate=${fromDate}&toDate=${toDate}&tabActive=${this.tabActive}`
          } else {
            url = `/${path}/account/${this.$route.params.id}?orderBy=${orderBy}&saleType=${saleType}&categoryId=${categoryId}&fromPrice=${fromPrice}&toPrice=${toPrice}&tabActive=${this.tabActive}&network=${network}`
          }
        } else {
          url = `/${path}/account/${this.$route.params.id}?orderBy=${orderBy}&saleType=${saleType}&categoryId=${categoryId}&fromPrice=${fromPrice}&toPrice=${toPrice}`
        }
        history.pushState(null, '', url)
      }
      // this.$route.params = filter.id

      this.query = { ...this.query, ...filter }

      if (this.query.listType === 'Collections') {
        this.query.network = ''
      }

      //this.filter = {id: filter.id }
      this.init()
    }

    handleApplyFilter(filter: Record<string, any>): void {
      this.handleFilter(filter)
    }
    mounted() {
      console.log('test life cycle', '')
    }
    resetQuery(): void {
      this.query = {
        page: 1,
        limit: 12,
        listType: 'NFT',
        orderBy: 'CREATED_AT_DESC',
        total: 0
      }
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit

      this.init()
    }
    loadmore = true
    handleLoadMore(): void {
      this.query.limit += 12
      if (this.tabActive === 'ACTIVITIES') {
        this.query.limit -= 2
      }

      this.init()
    }

    handleCurrentChange(page: number): void {
      this.query.page = page

      this.init()
    }

    async handleFollow(data: Record<string, any>): Promise<void> {
      try {
        await apiNft.actionFollow(data)
        this.profile.isFollower = this.profile.isFollower === 'YES' ? 'NO' : 'YES'
        this.profile.numOfFollowers = this.profile.isFollower === 'YES' ? this.profile.numOfFollowers + 1 : this.profile.numOfFollowers - 1
      } catch (error) {
        console.log(error)
      }
    }

    handleFavorite(id: number): void {
      if (this.tabActive === 'FAVOURITE' && this.$route.name === 'MyProfileNft') {
        this.listData = filter(this.listData, elm => elm.id !== id)
        this.query.total -= 1
      }
    }

    async reloadDetail(): Promise<void> {
      try {
        const routeName = this.$route.name
        this.profile = routeName === 'MyProfileNft' ? await apiNft.getMyProfileNft() : await apiNft.getUserprofile(this.$route.params.id)
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.profile-nft {
    margin-top: 80px;
    padding-top: 16px;
    position: relative;
    @media (max-width: 767px) {
      margin-top: 54px;
    }
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
    @media (max-width: 767px) {
      .tab {
        overflow: auto;
        /* width: 500px; */
        //padding: 0 20px;
        margin-bottom: 20px;
        scrollbar-width: none;
        overflow-style: none;
        .tab-item {
          width: max-content;
          color: #89909e;
        }
        .tab-item:first-child {
          margin-left: 20px;
        }
      }
      .tab::-webkit-scrollbar {
        width: 0 !important;
        display: none;
      }
    }

    .empty-block.empty {
      padding: 40px 0 !important ;
      text-align: center;
      .span-icon {
        font-size: 150px !important;
      }
      .empty-text {
        color: #8f8f8f;
      }
    }
    .base-pagination {
      border: none;
      padding: 20px 0 10px;
      margin-bottom: 40px;
    }
    .load_more {
      width: 100%;
      /* border: none; */
      height: 48px;
      background: #fff;
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      //margin-top: 24px;
      // margin-bottom: 40px;
      color: #5b616e;
      line-height: 24px;
      font-weight: 600;
      font-size: 16px;
      margin: 0px 0px 40px 0px;
    }
  }
</style>
