<template>
  <base-popup name="popup-remove-related" class="popup-remove-related" width="480px" :open="handleCommand" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.pop-remove.title') }}</p>
    <div class="content">
      <div class="text-content">
        <span
          ><p>
            {{ $t('detail-nft.pop-remove.content') }}
          </p></span
        >
      </div>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-cancel">
        <p class="text-cancel" @click="handleClose">{{ $t('detail-nft.pop-remove.cancel') }}</p>
      </button>
      <button @click="removeItem" class="btn-remove el-button btn">
        <p class="text-remove">{{ $t('detail-nft.pop-remove.remove') }}</p>
      </button>
    </div>
    <PopupTransferSuccess />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  import PopupTransferSuccess from './PopupRemoveSuccess.vue'
  import { filter } from 'vue/types/umd'

  const apiNft: NftRepository = getRepository('nft')

  @Component({ components: { PopupTransferSuccess } })
  export default class PopupRemove extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    handleCommand(): void {
      // this.setOpenPopup({
      //   popupName: 'popup-remove-related',
      //   isOpen: true
      // })
    }

    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-remove-related',
        isOpen: false
      })
    }

    // nftItem:{
    //   myListingId = this.datadetail.id
    // }
    async removeItem(): Promise<void> {
      try {
        const params = {
          lastListingId: this.nftItem.myListingId
        }

        await apiNft.removeFromSale(params)
        this.setOpenPopup({
          popupName: 'popup-remove-success',
          isOpen: true
        })
        // this.setOpenPopup({
        //   popupName: 'popup-list-owner',
        //   isOpen: false
        // })
        // this.setOpenPopup({
        //   popupName: 'popup-remove-related',
        //   isOpen: false
        // })
        if (this.$route.name === 'MarketPlace') {
          //thay info nft các màn
          EventBus.$emit('reload-nft-home')
        }
        if (this.$route.name === 'DetailNftItem') {
          EventBus.$emit('reload-detail-nft')
        }
        if (this.$route.name === 'DetailCollection') {
          EventBus.$emit('reload-nft-collection')
        }
        if (this.$route.name === 'DetailCategory') {
          EventBus.$emit('reload-nft-explore')
        }
        if (this.$route.name === 'MyProfileNft' || this.$route.name === 'UserProfile') {
          EventBus.$emit('reload-nft-profile')
          this.setOpenPopup({
            popupName: 'popup-remove-success',
            isOpen: false
          })
          this.handleClose()
        }
      } catch (error) {
        let message = this.$t('notify.500') as string
        this.$message.error({ message, duration: 5000 })
      }

      // this.handleClose()
    }

    handleClose(): void {
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-remove-related',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    color: black;
    .text-content {
      padding-bottom: 24px;
      p {
        font-size: 16px;
        line-height: 24px;
        word-break: break-word;
        color: #0a0b0d;
      }
    }
  }
  .footer {
    max-width: 452px;
    width: 100%;
    .btn-remove {
      background: var(--bc-theme-primary-gradient);
      margin-left: 16px;
    }
    button {
      max-width: 100px;
      width: 100%;
      height: 40px;
      border: 1px solid rgba(219, 219, 219, 1);
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      .text-cancel {
        font-size: 16px;
        line-height: 24px;
        color: #5b616e;
        font-weight: 600;
      }
      .text-remove {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: white;
      }
    }
    .btn-cancel {
      &:hover {
        border-color: var(--bc-btn-default-border-hover);
        -webkit-background-clip: text;
        -webkit-text-fill-color: var(--bc-btn-default-border-hover);
        border-color: var(--bc-btn-default-border-hover);
        text-shadow: 0px 0px #00000000;
      }
    }
  }
</style>
