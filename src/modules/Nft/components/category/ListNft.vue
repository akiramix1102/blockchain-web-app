<template>
  <div>
    <div v-if="isDesktop" class="be-flex list-nft">
      <div v-for="item in listNft" :key="item.id" class="item">
        <nft-item :otherType="otherType" :tabUsed="tabUsed" :itemNft="item" @favourite="handleClickFavourite" @remove-collection="handleRemove" @bid-explore="handleBid" />
      </div>
    </div>
    <div v-else class="be-flex list-nft1">
      <div class="mb-24" style="width: 100%">
        <div v-for="item in listNft" :key="item.id" class="item">
          <nft-item :otherType="otherType" :tabUsed="tabUsed" :itemNft="item" @favourite="handleClickFavourite" @remove-collection="handleRemove" @bid-explore="handleBid" />
        </div>
      </div>
      <div style="width: 100%">
        <button v-if="this.listNft.length < this.query.total" @click="handleLoadMore" class="load_more cursor">Load more</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins } from 'vue-property-decorator'
  import NftItem from '../base/NftItem.vue'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'

  const apiNft: NftRepository = getRepository('nft')
  @Component({
    components: {
      NftItem
    }
  })
  export default class ListNft extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: () => [] }) listNft!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @Prop({ required: false, type: Boolean, default: false }) otherType!: boolean
    @Prop({ required: false, type: Boolean, default: false }) tabUsed!: boolean
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @bcNft.State('isDesktop') isDesktop!: boolean
    itemNft = {}
    //  title = ''
    // titlePrice = ''
    // isShowBtn = false
    handleRemove(itemNft): void {
      this.itemNft = itemNft

      this.setOpenPopup({
        popupName: 'popup-remove',
        isOpen: true
      })
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
      console.log('explore', itemNft)
      this.setOpenPopup({
        popupName: 'popup-bid-explore',
        isOpen: true
      })
    }

    loadmore = true
    // beforeMount() {
    //   console.log('beforemounted', this.listNft.length)
    //   console.log('total ', this.query.total)
    //   this.loadmore = true
    // }
    // destroyed() {
    //   console.log('destroy length')
    //   console.log('total ', this.query.total)
    //   this.loadmore = true
    // }
    // created() {
    //   console.log('created length')
    //   console.log('total ', this.query.total)
    //   this.loadmore = true
    // }

    handleLoadMore(val: number): void {
      // if (this.query.total > this.query.limit) {
      //   this.loadmore = true
      // }
      if (this.listNft.length >= this.query.total) {
        this.loadmore = false
      }

      this.$emit('loadmore', val)
    }

    async handleClickFavourite(data: Record<string, any>): Promise<void> {
      try {
        await apiNft.favouriteItem(data)
        this.$emit('favorite', data.objectId)
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  .list-nft {
    flex-wrap: wrap;
    .item {
      width: calc(1 / 4 * 100% - (1 - 1 / 4) * 20px);
      margin: 28px 20px 0 0;
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
  ::v-deep.list-nft1 {
    flex-wrap: wrap;
    .avatar {
      // max-width: 335px;
      width: 100%;
      height: 335px;
    }
    .item {
      width: calc(1 / 1 * 100% - (1 - 1 / 1) * 20px);
      margin: 28px 20px 0 0;
    }
    .item:nth-child(1n) {
      margin-right: 0;
    }
    .item:nth-child(-n + 1) {
      margin-top: 0;
    }

    .load_more {
      width: 100%;
      /* border: none; */
      height: 48px;
      background: #fff;
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      margin-top: 24px;
      margin-bottom: 40px;
      color: #5b616e;
      line-height: 24px;
      font-weight: 600;
      font-size: 16px;
    }
  }
</style>
