<template>
  <base-popup name="popup-success-put-on-sale" class="popup-success" width="400px" :open="handleOpen" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.popup-success.title') }}</p>
    <div class="content">
      <img src="../../../../assets/images/nft/icon-success.png" alt="" />
      <div v-if="type === 'FIXED'" class="title-succes text-base color-primary text-semibold text-desc break-word">{{ $t('put-on-sale.success') }}</div>
      <div v-if="type === 'OPEN-BID'" class="title-succes text-base color-primary text-semibold text-desc break-word">{{ $t('put-on-sale.success-open-bid') }}</div>
      <div v-if="type === 'TIMED-AUCTION'" class="title-succes text-base color-primary text-semibold text-desc break-word">{{ $t('put-on-sale.success-timed-auction') }}</div>
      <div class="router_center router_setting" @click="handleContinue">
        <el-button class="btn is-none-border cursor btn-default-bg nft-header6 btn-theme">{{ $t('button.continue') }}</el-button>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import EventBus from '@/utils/eventBus'

  @Component
  export default class PopupSuccessPutOnSale extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: 'FIXED' }) type!: string

    async handleOpen(): Promise<void> {
      if (this.$route.name === 'DetailNftItem') {
        EventBus.$emit('reload-detail-nft')
      }
      if (this.$route.name === 'MarketPlace') {
        //thay info nft các màn
        EventBus.$emit('reload-nft-home')
      }
      if (this.$route.name === 'DetailCategory') {
        EventBus.$emit('reload-nft-explore')
      }
      if (this.$route.name === 'DetailCollection') {
        EventBus.$emit('reload-nft-collection')
      }
      if (this.$route.name === 'MyProfileNft' || this.$route.name === 'UserProfile') {
        EventBus.$emit('reload-nft-profile')
      }
      this.setOpenPopup({
        popupName: 'popup-list-owner',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-put-on-sale',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-fixed-price',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-open-for-bids',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-timed-auction',
        isOpen: false
      })
    }

    handleClose(): void {
      //   this.setOpenPopup({
      //     popupName: 'popup-buy-nft',
      //     isOpen: false
      //   })
      this.setOpenPopup({
        popupName: 'popup-put-on-sale',
        isOpen: false
      })
    }

    handleContinue(): void {
      // this.setOpenPopup({
      //   popupName: 'popup-buy-nft',
      //   isOpen: false
      // })
      this.setOpenPopup({
        popupName: 'popup-put-on-sale',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-success-put-on-sale',
        isOpen: false
      })
      // this.$router.push({ name: 'MyProfileNft' })
    }
  }
</script>
-

<style lang="scss" scoped>
  .content {
    color: black;
    text-align: center;
  }

  .title-succes {
    max-width: 300px;
    margin: 12px auto 24px;
    word-break: break-word;
  }
  .monney-transaction {
    margin-top: 4px;
    margin-bottom: 24px;
    background: var(--bc-menu-active);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .btn-payment {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dbdbdb;
    outline: none;
    border-radius: 6px;
    padding-left: 12px;
    padding-right: 12px;
    background: var(--bc-theme-primary-gradient);
    margin-bottom: 12px;
    cursor: pointer;
    .name-coin {
      margin: 0 auto;
      color: #fff !important;
    }
    &:last-child {
      margin-bottom: 24px;
    }
  }
  .btn-theme {
    height: 48px;
    width: 100%;
    font-size: 16px !important;
    line-height: 24px !important;
    margin-bottom: 24px;
  }
</style>
