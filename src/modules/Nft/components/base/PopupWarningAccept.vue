<template>
  <base-popup name="popup-warning" class="popup-warning" width="400px" :open="handleCommand" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('popup-warning') }}</p>
    </div>
    <div class="content">
      <img class="img-error" src="../../../../assets/images/nft/warning.png" alt="" />
      <div class="content-desc">
        <p v-if="typePopup === 'offer'" class="title-succes text-base text-regular">{{ $t('des-warning-offer') }}</p>
        <p v-else class="title-succes text-base text-regular">{{ $t('des-warning-bid') }}</p>
        <p class="text-base text-regular">
          <span class="color-primary text-semibold">William Serena </span><span>{{ $t('with') }}</span
          ><span class="color-primary text-semibold"> 12000 LYNK</span><span> ?</span>
        </p>
      </div>
      <button class="btn btn-continue" @click="handleContinue">
        <div class="text-continue">{{ $t('accept-bid.deny') }}</div>
      </button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  // import EventBus from '@/utils/eventBus'
  @Component
  export default class PopupWarningAccept extends Mixins(PopupMixin) {
    @Prop() titleSuccess: any
    @Prop({ required: false, type: Number, default: 0 }) pay!: number
    @Prop({ required: false, type: String, default: 'LYNK' }) currency!: string

    @bcNft.State('typePopup') typePopup!: string
    @bcNft.State('listAccount') listAccount!: Array<Record<string, any>>

    getYouPay = 0
    // async handleCommand(): Promise<void> {
    //   this.getYouPay = this.pay
    //   this.setOpenPopup({
    //     popupName: 'popup-warning',
    //     isOpen: true
    //   })
    // }
    handleCommand(): void {
      this.getYouPay = this.pay
      this.setOpenPopup({
        popupName: 'popup-warning',
        isOpen: true
      })
    }
    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-warning',
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
        popupName: 'popup-warning',
        isOpen: false
      })
    }
    handleContinue(): void {
      this.setOpenPopup({
        popupName: 'popup-warning',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-list-bid-offer',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    padding: 0;
  }
  .content-desc {
    color: var(--bc-text-color-tab-item);
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
  ::v-deep.popup-warning {
    .el-dialog__footer {
      display: none;
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-warning {
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
