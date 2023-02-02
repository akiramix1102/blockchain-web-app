<template>
  <div>
    <div v-if="isDesktop" class="list-category">
      <div class="container-nft wrap">
        <div class="nft-header2 text-semibold title-page">{{ $t('nft.explore-market') }}</div>
        <div class="be-flex tab mb-24">
          <div
            v-for="(item, index) in arrTab"
            :key="index"
            class="text-desc cursor nft-header6 tab-item"
            :class="item.tab === tabActive ? 'tab-active' : null"
            @click="handleClickTab(item.tab)"
          >
            {{ item.title }}s
          </div>
        </div>
        <filter-explore-nft ref="filter" :tabActive="tabActive" :isNft="true" :isShowSearch="true" @filter="handleFilter" />
        <div class="content-tab" v-if="listData.length">
          <list-nft v-if="tabActive === 'NFT'" :listNft="listData" />
          <list-collection v-if="tabActive === 'Collection'" :listNft="listData" />
          <list-user v-if="tabActive === 'User'" :listNft="listData" />
        </div>
        <empty-block v-else :show="true" class="empty" />
        <base-pagination
          :sizeChangeCustom="true"
          :arrPageSize="[16, 32, 64, 96]"
          :table="query"
          :info="paginationInfo"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        />
      </div>
    </div>
    <ExploreMarketMobile v-else />
    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import FilterExploreNft from '../components/home/FilterExploreNft.vue'
  import ListNft from '../components/category/ListNft.vue'
  import ListCollection from '../components/category/ListCollection.vue'
  import ListUser from '../components/category/ListUser.vue'
  import FooterMarket from '../components/Footer.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import ExploreMarketMobile from '../components/home/mobile/ExploreMarketMobile.vue'
  // const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')
  import { namespace } from 'vuex-class'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import EventBus from '@/utils/eventBus'

  import filter from 'lodash/filter'

  const apiNft: NftRepository = getRepository('nft')
  const apiNft2: NftRepositoryV2 = getRepository('nftv2')
  @Component({ components: { FilterExploreNft, ListNft, ListCollection, FooterMarket, EmptyBlock, ExploreMarketMobile, ListUser } })
  export default class ExploreMarketplace extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean

    arrTab: Array<Record<string, any>> = [
      { id: 1, title: this.$t('nft.tab.nft'), tab: 'NFT' },
      { id: 2, title: this.$t('nft.tab.collection'), tab: 'Collection' }
      // { id: 3, title: this.$t('nft-tab-user'), tab: 'User' }
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
    }

    get paginationInfo(): string {
      if (this.tabActive === 'NFT') {
        return this.$t('paging.item') as string
      }
      if (this.tabActive === 'Collection') {
        return this.$t('paging.collection') as string
      } else {
        return this.$t('paging-users') as string
      }
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
      // this.$refs['filter']?.resetFilter()
    }
    timeOut: any = null
    created(): void {
      EventBus.$on('emitTab', data => {
        this.tabActive = data
        this.timeOut = setTimeout(() => {
          this.getListData()
        }, 500)
      })

      this.query.categoryIds = this.$route.params.id !== 'all' ? this.$route.params.id : null
      this.query = {
        ...this.query,
        ...this.$route.query
      }
      // this.getListData()

      EventBus.$on('reload-nft-explore', this.getListData)
      console.log(this.tabActive, 'tab')
    }

    mounted() {
      if (this.$route.query.tabActive === 'Collection') {
        this.tabActive = this.$route.query.tabActive as string
        this.getListData()
      } else {
        this.tabActive = 'NFT'
        this.getListData()
      }
    }

    destroyed(): void {
      clearTimeout(this.timeOut)
      EventBus.$off('emitTab')
      EventBus.$off('reload-nft-explore')
    }

    async getListData(): Promise<void> {
      try {
        this.query.categoryIds = this.$route.params.id !== 'all' && this.tabActive !== 'User' ? this.$route.params.id : null
        const result =
          this.tabActive === 'NFT'
            ? await apiNft.getListItemInCollection(this.query)
            : this.tabActive === 'Collection'
            ? await apiNft.getListDetailCategory(this.query)
            : await apiNft2.getListAccount(this.query)
        this.listData = result.content
        this.query.total = result.totalElements
      } catch (error) {
        console.log(error)
      }
    }

    handleClickTab(tab: string): void {
      if (this.tabActive === tab) return
      this.tabActive = tab
      //@ts-ignore
      this.$refs['filter']?.resetFilter()
      this.query = {
        page: 1,
        limit: 16,
        categoryIds: this.$route.params.id,
        total: 0,
        orderBy: 'CREATED_AT_DESC'
      }
      this.$router.replace({ query: undefined }).catch(error => {
        if (error.name != 'NavigationDuplicated') throw error
      })
      this.getListData()
    }

    handleFilter(filter: Record<string, any>): void {
      const { categoryId, orderBy, fromPrice, toPrice, search, saleType, saleStatus, network } = filter
      let url = ''
      if (filter.categoryId) {
        this.$route.params.id = filter.categoryId
        if (this.tabActive === 'NFT') {
          url = `/metamart/explore-metamart/${categoryId}?search=${search}&saleType=${saleType}&orderBy=${orderBy}&fromPrice=${fromPrice}&toPrice=${toPrice}&saleStatus=${saleStatus}&network=${network}`
        } else {
          url = `/metamart/explore-metamart/${categoryId}`
        }
        history.pushState(null, '', url)
      } else {
        this.$route.params.id = 'all'
        if (this.tabActive === 'NFT') {
          url = `/metamart/explore-metamart/all?search=${search}&saleType=${saleType}&orderBy=${orderBy}&fromPrice=${fromPrice}&toPrice=${toPrice}&saleStatus=${saleStatus}&network=${network}`
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
  }
</script>

<style scoped lang="scss">
  ::v-deep.list-category {
    margin-top: 70px;
    padding-top: 40px;

    .wrap {
      padding-bottom: 40px;
      .titlepage {
        margin-bottom: 28px;
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

      .content-tab {
        padding-top: 40px;
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
  }
</style>
