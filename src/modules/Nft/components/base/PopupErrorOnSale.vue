<template>
  <base-popup name="popup-error-on-sale" class="popup-error-on-sale" width="400px" :open="handleCommand" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('error-popup.action-failure') }}</p>
    </div>
    <div class="content">
      <img class="img-error" src="../../../../assets/images/nft/fail.png" alt="" />
      <div class="title-succes text-base color-primary text-semibold">
        <p>{{ $t('error-popup.title-action-failure') }}</p>
        <p>{{ $t('error-popup.title-action-failure2') }}</p>
      </div>
      <button class="btn btn-continue" @click="handleContinue">
        <div class="text-continue">{{ $t('button.continue') }}</div>
      </button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  // import EventBus from '@/utils/eventBus'
  @Component
  export default class PopupPlaceSuccess extends Mixins(PopupMixin) {
    async handleCommand(): Promise<void> {
      this.setOpenPopup({
        popupName: 'popup-error-on-sale',
        isOpen: true
      })
    }
    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-error-on-sale',
        isOpen: false
      })
    }
    // created(): void {
    //   EventBus.$on('price', this.showPriceBid)
    //   // console.log('bus-price', this.price)
    // }
    // showPriceBid(value: number): void {
    //   // console.log('price', value)
    //   // this.price = value
    // }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-error-on-sale',
        isOpen: false
      })
    }
    handleContinue(): void {
      this.setOpenPopup({
        popupName: 'popup-error-on-sale',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-cancel-bid-offer',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    padding: unset;
  }
  .title-succes {
    margin-top: 12px;
    margin-bottom: 24px;
    word-break: break-word;
  }
  .content {
    text-align: center;
    .content-success {
      color: #0a0b0d;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .content-price {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      background: var(--bc-theme-primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 24px;
    }
    .btn-continue {
      max-width: 352px;
      width: 100%;
      background: var(--bc-theme-primary-gradient);
      border-radius: 6px;
      border: none;
      margin-bottom: 24px;
      cursor: pointer;
    }
    .text-continue {
      color: #fff;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      padding: 12px 0;
    }
  }
  ::v-deep.popup-bid-success {
    .el-dialog__footer {
      display: none;
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-error-on-sale {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .content {
          .img-error {
            width: 60px;
            height: 60px;
          }
          .title-succes {
            font-size: 14px;
            line-height: 20px;
          }
          .text-continue {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
