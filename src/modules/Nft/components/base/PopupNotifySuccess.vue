<template>
  <base-popup name="popup-notify-success" class="popup-success" width="400px" :open="handleOpen" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.popup-success.title') }}</p>
    <div class="content">
      <img class="img-success" src="../../../../assets/images/nft/icon-success.png" alt="" />
      <div class="title-succes text-base color-primary text-semibold">
        <span>{{ description }}</span>
      </div>
      <div v-if="isShowPay" class="monney-transaction text-base text-semibold">{{ payBalance | convertAmountDecimal(currency) }} {{ currency }}</div>
      <div class="router_center router_setting mt-24" @click="handleContinue">
        <el-button class="btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success">{{ $t('button.continue') }}</el-button>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import EventBus from '@/utils/eventBus'

  import { namespace } from 'vuex-class'
  import { forEach } from 'lodash'
  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')
  @Component
  export default class PopupNotifySuccess extends Mixins(PopupMixin) {
    @bcAuth.Getter('isLogin') isLogin!: boolean
    @bcNft.State('balancePay') balancePay!: number
    @bcNft.State('currency') currency!: string
    @bcNft.State('typeOfAction') typeOfAction!:
      | 'put-fixed'
      | 'put-time'
      | 'put-open'
      | 'put-remove'
      | 'bid-add'
      | 'bid-edit'
      | 'bid-cancel'
      | 'bid-accept'
      | 'offer-make'
      | 'offer-edit'
      | 'offer-cancel'
      | 'offer-accept'
      | 'buy'
      | 'transfer-nft'
      | 'use-nft'

    payBalance = 0

    get description(): string {
      return this.$t(`nft.notify.${this.typeOfAction}`) as string
    }
    get isShowPay(): boolean {
      return this.typeOfAction === 'buy' || this.typeOfAction === 'bid-add' || this.typeOfAction === 'offer-make'
    }

    async handleOpen(): Promise<void> {
      this.payBalance = this.balancePay

      this.setOpenPopup({
        popupName: 'popup-list-owner',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-buy-nft',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
    }

    handleClose(): void {
      if (this.$route.name === 'DetailNftItem') {
        if (this.isLogin) {
          EventBus.$emit('reload-detail-nft')
        } else {
          if (
            this.typeOfAction === 'put-fixed' ||
            this.typeOfAction === 'put-open' ||
            this.typeOfAction === 'put-time' ||
            this.typeOfAction === 'transfer-nft' ||
            this.typeOfAction === 'offer-accept' ||
            this.typeOfAction === 'buy' ||
            this.typeOfAction === 'put-remove' ||
            this.typeOfAction === 'bid-accept'
          ) {
            EventBus.$emit('reload-detail-nft')
          }
        }
      }
      if (this.$route.name === 'MarketPlace') {
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

      const popupName = [
        'popup-make-offer',
        'popup-buy-nft',
        'popup-payment-method',
        'popup-cancel-bid-offer',
        'popup-place-bid',
        'popup-list-bid-offer',
        'popup-accept-bid',
        'popup-fixed-price',
        'popup-timed-auction',
        'popup-remove',
        'popup-put-on-sale',
        'popup-open-for-bids',
        'popup-transfer-nft'
      ]
      forEach(popupName, name => {
        this.setOpenPopup({
          popupName: name,
          isOpen: false
        })
      })
    }

    handleContinue(): void {
      this.setOpenPopup({
        popupName: 'popup-notify-success',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    color: black;
    text-align: center;
  }

  .title-succes {
    margin-top: 12px;
    word-break: break-word;
  }
  .monney-transaction {
    margin-top: 4px;

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
  @media (max-width: 768px) {
    ::v-deep.popup-success {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .content {
          .img-success {
            width: 60px;
            height: 60px;
          }
          .title-succes {
            font-size: 14px;
            line-height: 20px;
          }
          .monney-transaction {
            font-size: 14px;
            line-height: 20px;
          }
          .btn-success {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
