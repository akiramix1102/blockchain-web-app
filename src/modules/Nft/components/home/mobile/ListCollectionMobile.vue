<template>
  <div class="mobile">
    <div class="row-nft">
      <div v-for="item in arrItems" :key="item.id" class="item">
        <nft-item :itemNft="item" @favourite="handleClickFavourite" @share="handleShare" @remove-collection="handleRemove" @bid-collection="handleBid" />
      </div>
    </div>
    <div class="btn-more">
      <el-button
        v-if="this.arrItems.length < this.query.total"
        @click="handleLoadMore"
        class="el-button nft-header6 text-semibold text-center bid el-button-custom el-button--default"
        >Load more</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import NftItem from '../../base/NftItem.vue'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'

  const bcNft = namespace('bcNft')
  const beBase = namespace('beBase')

  @Component({ components: { NftItem } })
  export default class ListCollectionMobile extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array, default: [] }) arrItems!: Array<Record<string, any>>
    // @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @bcNft.Action('setLinkShare') setLinkShare!: (link: string) => void
    @beBase.State('coinMain') coinMain!: string
    @bcNft.State('isDesktop') isDesktop!: boolean
    idNft = 0
    infoLynkey = ''
    itemNft = {}
    url = ''
    // loadmore = true
    get getLink(): string {
      const origin = process.env.VUE_APP_URL
      if (this.coinMain == 'LYNK') {
        this.url = 'metamart/nft/' + this.idNft
      }
      if (this.coinMain == 'CLM') {
        this.url = 'marketplace/nft/' + this.idNft
      }
      return origin + this.url
    }
    handleLoadMore(val: number): void {
      this.$emit('loadmore', val)
      console.log('valColection', val)
    }
    handleClickFavourite(data: Record<string, any>): void {
      this.$emit('favourite', data)
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
      console.log('bid-collection', itemNft)
      this.setOpenPopup({
        popupName: 'popup-place-bid',
        isOpen: true
      })
    }
    handleRemove(itemNft): void {
      this.itemNft = itemNft
      console.log('alo', itemNft)
      this.setOpenPopup({
        popupName: 'popup-remove',
        isOpen: true
      })
    }
    handleShare(id: number): void {
      this.idNft = id
      this.setLinkShare(this.getLink)
      this.setOpenPopup({
        popupName: 'popup-share',
        isOpen: true
      })
      this.setOpenPopup({
        popupName: 'popup-share',
        isOpen: true
      })
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.mobile {
    .btn-more {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      margin-bottom: 40px;
      .el-button {
        width: 89% !important;
        height: 48px;
      }
    }
    .avatar {
      width: 100%;
    }
    .row-nft {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      .item {
        max-width: 335px;
        width: 100%;
        margin-bottom: 24px;
      }
    }
  }
</style>
