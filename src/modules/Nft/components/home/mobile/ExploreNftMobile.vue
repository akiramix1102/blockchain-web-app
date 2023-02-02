<template>
  <div class="explore-nft-mobile">
    <div class="text-1xl text-semibold be-flex align-center jc-space-between">
      <span> {{ $t('nft.home.explore-nft') }}</span>
      <!-- <filter-explore-nft :isNft="true" @filter="handleFilter" /> -->
      <filter-explore-mobile :isNft="true" @filter="handleFilter" :tabActive="'NFT'" />
    </div>
    <div v-if="listNft.length" class="be-flex list-nft">
      <div v-for="(item, index) in listNft" :key="index" class="item">
        <nft-item v-for="(itemnft, index) in item.children" :key="index" :itemNft="itemnft" @favourite="handleClickFavourite" @bid-explore="handleBid" class="explore-nft-item" />
      </div>
    </div>
    <div v-if="listNft2.length" class="be-flex list-nft">
      <div v-for="(item, index) in listNft2" :key="index" class="item">
        <nft-item v-for="(itemnft, index) in item.children2" :key="index" :itemNft="itemnft" @favourite="handleClickFavourite" @bid-explore="handleBid" class="explore-nft-item" />
      </div>
    </div>
    <div v-if="listNft3.length" class="be-flex list-nft">
      <div v-for="(item, index) in listNft3" :key="index" class="item">
        <nft-item :itemNft="itemnft" v-for="(itemnft, index) in item.children3" :key="index" @favourite="handleClickFavourite" @bid-explore="handleBid" class="explore-nft-item" />
      </div>
    </div>
    <div v-if="listNft4.length" class="be-flex list-nft">
      <div v-for="(item, index) in listNft4" :key="index" class="item">
        <nft-item :itemNft="itemnft" v-for="(itemnft, index) in item.children4" :key="index" @favourite="handleClickFavourite" @bid-explore="handleBid" class="explore-nft-item" />
      </div>
    </div>
    <empty-block v-else :show="true" class="empty" />
    <button v-if="listNft4.length" type="button" class="nft-header6 text-semibold text-desc cursor btn-more" @click="handleClickExplore">
      <p>{{ $t('button.explore-more') }}</p>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import FilterExploreNft from '../FilterExploreNft.vue'
  import NftItem from '../../base/NftItem.vue'
  import PopupMixin from '@/mixins/popup'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import FilterExploreMobile from '../mobile/FilterExploreMobile.vue'
  import EventBus from '@/utils/eventBus'
  import filter from 'lodash/filter'
  import forEach from 'lodash/forEach'
  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { FilterExploreNft, NftItem, EmptyBlock, FilterExploreMobile } })
  export default class ExploreNftMobile extends Mixins(PopupMixin) {
    listNft: Array<Record<string, any>> = []
    listNft2: Array<Record<string, any>> = []
    listNft3: Array<Record<string, any>> = []
    listNft4: Array<Record<string, any>> = []
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
      ;(this.listNft = []), (this.listNft2 = []), (this.listNft3 = []), (this.listNft4 = [])
      const result = await apiNft.getListItemInCollection(this.query)
      forEach(result.content, () => {
        if (result.content.length) {
          const children = result.content.splice(0, 4)
          const children2 = result.content.splice(0, 4)
          const children3 = result.content.splice(0, 4)
          const children4 = result.content.splice(0, 4)
          this.listNft.push({ children })
          this.listNft2.push({ children2 })
          this.listNft3.push({ children3 })
          this.listNft4.push({ children4 })
        }
      })
    }
    handleClickExplore(): void {
      this.$router.push({ name: 'DetailCategory', params: { id: 'all' } })
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
  }
</script>

<style scoped lang="scss">
  ::v-deep.explore-nft-mobile {
    margin-top: 40px;
    display: flex;
    flex-direction: column;

    .list-nft {
      flex-wrap: wrap;
      margin-top: 24px;
      overflow-x: auto;
      .item {
        display: flex;
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
      width: 100%;
      margin: 24px auto 0;
      padding: 11px 68px;
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
    }
  }
</style>
