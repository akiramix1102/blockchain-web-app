<template>
  <div class="explore-nft">
    <div class="nft-header3 text-semibold be-flex align-center jc-space-center mb-40">
      <span> {{ $t('nft.home.explore-nft') }} </span>
    </div>
    <filter-explore-nft :isNft="true" @filter="handleFilter" />
    <div v-if="listNft.length" class="be-flex list-nft">
      <div v-for="(item, index) in listNft" :key="index" class="item">
        <nft-item :itemNft="item" @favourite="handleClickFavourite" @bid-explore="handleBid" />
      </div>
    </div>
    <empty-block v-else :show="true" class="empty" />
    <button
      v-if="listNft.length"
      type="button"
      class="nft-header6 text-semibold text-desc cursor btn-more"
      @click="handleClickExplore"
      :class="{ korean: selectLanguage() === 'kr' }"
    >
      <p>{{ $t('button.explore-more') }}</p>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import FilterExploreNft from './FilterExploreNft.vue'
  import NftItem from '../base/NftItem.vue'
  import PopupMixin from '@/mixins/popup'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  import filter from 'lodash/filter'
  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { FilterExploreNft, NftItem, EmptyBlock } })
  export default class ExploreNft extends Mixins(PopupMixin) {
    listNft: Array<Record<string, any>> = []
    itemNft = {}
    query: Record<string, any> = {
      page: 1,
      limit: 16
    }

    created(): void {
      this.getListNft()
      EventBus.$on('reload-nft-home', this.getListNft)
      // EventBus.$on('reload-remove', this.getListNft)
    }

    destroyed(): void {
      EventBus.$off('reload-nft-home')
    }

    async getListNft(): Promise<void> {
      const result = await apiNft.getListItemInCollection(this.query)
      this.listNft = result.content
    }
    handleClickExplore(): void {
      const id = this.query.categoryIds ? this.query.categoryIds : 'all'
      const { orderBy, fromPrice, toPrice, saleType } = this.query
      this.$router.push({ name: 'DetailCategory', params: { id }, query: { saleType, fromPrice, toPrice, orderBy } })
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter, categoryIds: filter.categoryId, categoryId: null }
      this.getListNft()
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
      console.log('explore', itemNft)
      this.setOpenPopup({
        popupName: 'popup-bid-explore',
        isOpen: true
      })
    }

    async handleClickFavourite(data: Record<string, any>): Promise<void> {
      try {
        await apiNft.favouriteItem(data)
      } catch (error) {
        console.log(error)
      }
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.explore-nft {
    margin-top: 80px;
    display: flex;
    flex-direction: column;

    .list-nft {
      flex-wrap: wrap;
      margin-top: 40px;
      .item {
        width: calc(1 / 4 * 100% - (1 - 1 / 4) * 20px);
        margin: 40px 20px 0 0;

        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-5px);
        }
      }
      .item:nth-child(4n) {
        margin-right: 0;
      }
      .item:nth-child(-n + 4) {
        margin-top: 0;
      }
    }
    .empty {
      text-align: center;
      padding-top: 0 !important;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .span-icon {
        font-size: 150px !important;
      }
      .empty-text {
        color: #8f8f8f;
      }
    }
    .btn-more {
      width: 242px;
      margin: 29px auto 0;
      padding: 11px 0;
      text-align: center;
      border-radius: 6px;
      background: transparent;
      border: 1px solid #dbdbdb;
      &:hover {
        border-color: var(--bc-btn-default-border-hover);
        p {
          background: var(--bc-btn-default-text-hover);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 transparent;
        }
      }
      &.korean {
        padding: 11px 56px;
      }
    }
  }
</style>
