<template>
  <div class="list-category">
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
          {{ item.title }}
        </div>
      </div>
      <filter-explore-nft ref="filter" :isNft="true" :isShowSearch="true" @filter="handleFilter" />
      <div class="content-tab" v-if="listNft.length">
        <list-nft v-if="tabActive === 'NFT'" :listNft="listNft" />
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

    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import FilterExploreNft from '../components/home/FilterExploreNft.vue'
  import ListNft from '../components/category/ListNft.vue'
  import FooterMarket from '../components/Footer.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'

  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { FilterExploreNft, ListNft, FooterMarket, EmptyBlock } })
  export default class ListCategory extends Vue {
    arrTab: Array<Record<string, any>> = [
      { id: 1, title: this.$t('nft.tab.nft'), tab: 'NFT' },
      { id: 2, title: this.$t('nft.tab.collection'), tab: 'Collection' },
      { id: 3, title: this.$t('nft.tab.users'), tab: 'User' }
    ]
    tabActive = 'NFT'

    listNft: Array<Record<string, any>> = []
    isLoading = false

    query: Record<string, any> = {
      page: 1,
      limit: 16,
      categoryIds: null,
      total: 0
    }

    get paginationInfo(): string {
      return this.$t('paging.item') as string
    }

    @Watch('$route.params.id') changeRouteId(id: number): void {
      this.query = {
        page: 1,
        limit: 16,
        categoryIds: id,
        total: 0
      }
      this.getListNft()
      //@ts-ignore
      this.$refs['filter']?.resetFilter()
    }

    created(): void {
      this.query.categoryIds = this.$route.params.id !== 'all' ? this.$route.params.id : null
      this.getListNft()
    }

    async getListNft(): Promise<void> {
      try {
        // this.query.categoryIds = this.$route.params.id !== 'all' ? this.$route.params.id : null
        const result = await apiNft.getListItemInCollection(this.query)
        this.listNft = result.content
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
      if (this.tabActive === 'NFT') {
        this.query = {
          page: 1,
          limit: 16,
          categoryIds: this.$route.params.id,
          total: 0
        }
        this.getListNft()
      }
    }

    handleFilter(filter: Record<string, any>): void {
      // ở đây dùng categoryIds, ở comp filter dùng categoryId
      let categoryIds = ''
      if (filter.categoryId && filter.categoryId !== +this.$route.params.id && this.$route.params.id !== 'all') {
        categoryIds = `${this.$route.params.id},${filter.categoryId}`
      } else {
        categoryIds = filter.categoryId
      }
      this.query = { ...this.query, ...filter, categoryId: null, categoryIds }
      this.getListNft()
    }

    handleSizeChange(size: number): void {
      this.query.limit = size
      this.getListNft()
    }

    handleCurrentChange(page: number): void {
      this.query.page = page
      this.getListNft()
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
