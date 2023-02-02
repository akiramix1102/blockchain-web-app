<template>
  <div>
    <div class="list-category">
      <div class="container-nft wrap">
        <div class="header-5 text-semibold title-page">{{ $t('nft.explore-market') }}</div>
        <div class="be-flex tab mb-24">
          <div
            v-for="(item, index) in arrTab"
            :key="index"
            class="text-desc cursor .nft-body-base-small tab-item"
            :class="item.tab === tabActive ? 'tab-active' : null"
            @click="handleClickTab(item.tab)"
          >
            {{ item.title }}s
          </div>
        </div>
        <filter-explore-mobile ref="filter" :tabActive="tabActive" :isNft="true" :isShowSearch="true" @filter="handleFilter" />
        <div class="content-tab" v-if="listData.length">
          <list-nft v-if="tabActive === 'NFT'" :query="query" :listNft="listData" @loadmore="handleLoadMore" />
          <list-collection v-if="tabActive === 'Collection'" :query="query" :listNft="listData" />
        </div>
        <empty-block v-else :show="true" class="empty" />
        <!-- <div class="load-more">
          <button @click="handleLoadMore" class="btn-loadmore mb-32 mt-24 nft-header6 text-semibold">{{ $t('nft.load-more') }}</button>
        </div> -->
        <!-- <base-pagination
          :sizeChangeCustom="true"
          :arrPageSize="[16, 32, 64, 96]"
          :table="query"
          :info="paginationInfo"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  // import FilterExploreNft from '../components/home/FilterExploreNft.vue'
  import ListNft from '../../category/ListNft.vue'
  import ListCollection from '../../category/ListCollection.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import FilterExploreMobile from '../mobile/FilterExploreMobile.vue'
  // const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')
  import { namespace } from 'vuex-class'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'

  import filter from 'lodash/filter'

  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { ListNft, ListCollection, EmptyBlock, FilterExploreMobile } })
  export default class ExploreMarketplace extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean

    arrTab: Array<Record<string, any>> = [
      { id: 1, title: this.$t('nft.tab.nft'), tab: 'NFT' },
      { id: 2, title: this.$t('nft.tab.collection'), tab: 'Collection' }
      // { id: 3, title: this.$t('nft.tab.users'), tab: 'User' }
    ]
    tabActive = 'NFT'

    listData: Array<Record<string, any>> = []
    isLoading = false

    query: Record<string, any> = {
      page: 1,
      limit: 16,
      categoryIds: null,
      total: 0,
      orderBy: 'CREATED_AT_DESC'
      // adress: 'BTC'
    }

    get paginationInfo(): string {
      if (this.tabActive === 'NFT') {
        return this.$t('paging.item') as string
      }
      return this.$t('paging.collection') as string
    }

    @Watch('$route.params.id') changeRouteId(id: number): void {
      this.query = {
        page: 1,
        limit: 16,
        categoryIds: id,
        total: 0,
        orderBy: 'CREATED_AT_DESC'
      }
      this.getListData()

      //@ts-ignore
      this.$refs['filter']?.resetFilter()
    }

    created(): void {
      if (this.$route.query.tabActive) {
        this.tabActive = this.$route.query.tabActive as string
      } else {
        this.tabActive = 'NFT'
      }
      this.query.categoryIds = this.$route.params.id !== 'all' ? this.$route.params.id : null
      this.query = {
        ...this.query,
        ...this.$route.query
      }
      this.getListData()
      EventBus.$on('reload-nft-explore', this.getListData)
    }

    destroyed(): void {
      EventBus.$off('reload-nft-explore')
    }
    async getListData(): Promise<void> {
      try {
        this.query.categoryIds = this.$route.params.id !== 'all' ? this.$route.params.id : null
        const result = this.tabActive === 'NFT' ? await apiNft.getListItemInCollection(this.query) : await apiNft.getListDetailCategory(this.query)
        this.listData = result.content
        this.query.total = result.totalElements
      } catch (error) {
        console.log(error)
      }
    }
    rs = ''
    handleClickTab(tab: string): void {
      if (this.tabActive === tab) return
      this.tabActive = tab
      console.log('tab', tab)
      //@ts-ignore
      this.$refs['filter']?.resetFilter()
      this.query = {
        page: 1,
        limit: 16,
        categoryIds: this.$route.params.id,
        total: 0,
        orderBy: 'CREATED_AT_DESC'
      }
      this.getListData()
    }

    // async handleLoadMore(page: number): Promise<void> {
    //   //   this.getListData()
    //   // this.query.page = page
    //   // this.getListData()
    //   // console.log('data', page)
    //   console.log('listdata', this.getListData)
    // }

    handleFilter(filter: Record<string, any>): void {
      console.log('test', filter)
      const { categoryId, orderBy, fromPrice, toPrice, search, saleType } = filter
      let url = ''
      if (filter.categoryId) {
        this.$route.params.id = filter.categoryId
        if (this.tabActive === 'NFT') {
          url = `/metamart/explore-metamart/${categoryId}?search=${search}&saleType=${saleType}&orderBy=${orderBy}&fromPrice=${fromPrice}&toPrice=${toPrice}`
        } else {
          url = `/metamart/explore-metamart/${categoryId}`
        }
        history.pushState(null, '', url)
      } else {
        this.$route.params.id = 'all'
        if (this.tabActive === 'NFT') {
          url = `/metamart/explore-metamart/all?search=${search}&saleType=${saleType}&orderBy=${orderBy}&fromPrice=${fromPrice}&toPrice=${toPrice}`
        } else {
          url = `/metamart/explore-metamart/all`
        }

        history.pushState(null, '', url)
      }

      this.query = { ...this.query, ...filter, page: 1, limit: 16, categoryId: null, categoryIds: filter.categoryId }
      this.getListData()
    }

    handleSizeChange(size: number): void {
      this.query.limit = size
      this.getListData()
    }

    handleCurrentChange(page: number): void {
      this.query.page = page
      this.getListData()
    }

    loadmore = true
    handleLoadMore(): void {
      this.query.limit += 12
      this.getListData()
      // if (this.query.limit <= 12 || this.query.limit >= this.query.total) {
      //   this.loadmore = false
      // }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.list-category {
    margin-top: 70px;
    padding-top: 16px;
    .text-desc {
      color: #89909e;
    }
    .wrap {
      padding-bottom: 40px;
      .titlepage {
        margin-bottom: 28px;
      }
      .tab {
        margin-top: 4px;
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

      .content-tab {
        padding-top: 0;
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
        margin-top: 28px;
        border-top: none;
      }
    }
    .btn-loadmore {
      background-color: #fff !important;
      border: 1px solid #dbdbdb;
      // max-width: 335px;
      width: 100%;
      height: 48px;
      border-radius: 8px;
      color: #5b616e;
      cursor: pointer;
    }
  }

  @media (width: 375px) {
    .list-category {
      .btn-loadmore {
        width: 335px;
      }
    }
  }
</style>
