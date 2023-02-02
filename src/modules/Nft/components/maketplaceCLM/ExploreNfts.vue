<template>
  <div class="explore-nft">
    <div class="title-filter">
      <div class="nft-header3 text-semibold be-flex align-center jc-space-center mb-40 explore-header">
        <span> {{ itemCategory.categoryName }} <span>NFTs</span> </span>
      </div>
      <filter-clm-nft :isNft="true" @filter="handleFilter" />
    </div>
    <!-- <div v-if="listNft.length"> -->
    <div class="isPc">
      <div class="be-flex list-nft" v-if="listNft.length">
        <div v-for="(item, index) in listNft" :key="index" class="item">
          <nft-item :itemNft="item" @favourite="handleClickFavourite" @bid-explore="handleBid" />
        </div>
      </div>
      <empty-block v-else :show="true" class="empty" />
    </div>
    <div class="isMobile">
      <div v-if="listNft.length" class="be-flex list-nft">
        <div v-for="(item, index) in listNft" :key="index" class="item">
          <nft-item v-for="(itemnft, index) in item.children" :key="index" :itemNft="itemnft" @favourite="handleClickFavourite" @bid-explore="handleBid" class="explore-nft-item" />
        </div>
      </div>
      <div v-if="listNft2.length" class="be-flex list-nft">
        <div v-for="(item, index) in listNft2" :key="index" class="item">
          <nft-item
            v-for="(itemnft, index) in item.children2"
            :key="index"
            :itemNft="itemnft"
            @favourite="handleClickFavourite"
            @bid-explore="handleBid"
            class="explore-nft-item"
          />
        </div>
      </div>
    </div>
    <!-- </div> -->
    <!-- <empty-block v-else :show="true" class="empty" /> -->
    <button v-if="listNft.length" type="button" class="nft-header6 text-semibold text-desc cursor btn-more" @click="handleClickExplore(itemCategory.id)">
      <p>{{ $t('button.explore-more') }}</p>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import FilterClmNft from './FilterClmNft.vue'
  import NftItem from '../base/NftItem.vue'
  import PopupMixin from '@/mixins/popup'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  import filter from 'lodash/filter'
  import forEach from 'lodash/forEach'
  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { FilterClmNft, NftItem, EmptyBlock } })
  export default class ExploreNft extends Mixins(PopupMixin) {
    listNft: Array<Record<string, any>> = []
    listNft2: Array<Record<string, any>> = []
    @Prop({ required: true, type: Object, default: () => ({}) }) itemCategory!: Record<string, any>
    itemNft = {}
    categoryResidential = {}
    query: Record<string, any> = {
      page: 1,
      limit: 8
    }

    async created() {
      await this.getListNft()
      EventBus.$on('reload-nft-home', this.getListNft)
      // EventBus.$on('reload-remove', this.getListNft)
    }

    destroyed(): void {
      EventBus.$off('reload-nft-home')
    }

    async getListNft(): Promise<void> {
      this.query = { ...this.query, categoryIds: this.itemCategory?.id }
      if (window.innerWidth < 1200) {
        const result = await apiNft.getListItemInCollection(this.query)
        forEach(result.content, () => {
          if (result.content.length) {
            const children = result.content.splice(0, 4)
            const children2 = result.content.splice(0, 4)
            this.listNft.push({ children })
            this.listNft2.push({ children2 })
          }
        })
      } else {
        const result = await apiNft.getListItemInCollection(this.query)
        this.listNft = result.content
      }
    }
    handleClickExplore(item): void {
      // console.log('abc', item)
      this.$router.push({ name: 'DetailCategory', params: { id: item } })
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter, categoryIds: filter.categoryId, categoryId: null }
      this.getListNft()
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
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

    // @Watch("itemResidential",changeAddress(valueNew) {
    //   console.log("vlaue",valueNew)
    // })
    // @Watch('itemResidential') handleResidential(valueNew): void {
    //   this.categoryResidential = this.itemResidential
    //   console.log('categoryResidential', this.categoryResidential)
    // }
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
        // font-size: 150px !important;
      }
      .empty-text {
        color: #8f8f8f;
      }
    }
    .btn-more {
      width: 242px;
      margin: 28px auto 0;
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
    .isPc {
      display: block;
    }
    .isMobile {
      display: none;
    }
    .explore-header {
      flex-direction: column;
    }
    @media (max-width: 1200px) {
      .isMobile {
        display: block;
      }
      .isPc {
        display: none;
      }
      .list-nft {
        overflow: auto;
        margin-top: 24px;
        .item {
          display: flex;
          width: unset;
          margin: 40px 0px 0 0;
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .explore-nft-item {
        width: 310px;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
        .avatar {
          width: 100%;
          height: 285px;
        }
      }
    }
    @media (max-width: 767px) {
      margin-top: 40px;
      .explore-header {
        flex-direction: column;
        font-size: 24px;
        line-height: 32px;
      }
      .title-filter {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mb-40 {
        margin-bottom: 0 !important;
      }
    }
  }
</style>
