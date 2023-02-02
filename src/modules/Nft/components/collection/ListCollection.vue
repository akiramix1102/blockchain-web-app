<template>
  <div>
    <div class="list-collection">
      <div class="row-nft">
        <div v-for="item in arrItems" :key="item.id" class="item">
          <nft-item :itemNft="item" @favourite="handleClickFavourite" @share="handleShare" @remove-collection="handleRemove" @bid-collection="handleBid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import NftItem from '../base/NftItem.vue'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'

  const bcNft = namespace('bcNft')
  const beBase = namespace('beBase')

  @Component({ components: { NftItem } })
  export default class ListNft extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array, default: [] }) arrItems!: Array<Record<string, any>>
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @bcNft.Action('setLinkShare') setLinkShare!: (link: string) => void
    @beBase.State('coinMain') coinMain!: string
    @bcNft.State('isDesktop') isDesktop!: boolean
    itemToShow = 9
    idNft = 0
    infoLynkey = ''
    itemNft = {}
    url = ''
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
    created() {
      console.log('length', this.arrItems.length)
    }
    // handleLoadMore(): void {
    //   this.itemToShow += 5
    // }
    // created() {
    //   console.log("length", this.arrItems.length);

    // }
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
        // margin: 0 20px;
      }
    }
    // margin-top: 24px;
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
  ::v-deep.list-collection {
    margin-top: 40px;
    .row-nft {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: calc(1 / 4 * 100% - (1 - 1 / 4) * 20px);
        margin: 20px 20px 0 0;
        transition: all 0.2s ease;
        &:hover {
          transform: translateY(-5px);
        }

        // &:hover {
        //   transform: translateY(-2px);
        //   .collection-item {
        //     box-shadow: rgba(4, 17, 29, 0.25) 0px 0px 8px 0px;
        //     transition: all 0.1s ease 0s;
        //   }
        // }
      }
      .item:nth-child(4n) {
        margin-right: 0;
      }
      .item:nth-child(-n + 4) {
        margin-top: 0;
      }
    }
  }
</style>
