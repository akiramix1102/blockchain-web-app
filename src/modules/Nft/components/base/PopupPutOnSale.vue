<template>
  <!-- width="400px" -->
  <base-popup width="400px" height="228px" name="popup-put-on-sale" class="popup-put-on-sale" :open="handleOpen" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('text-nft.put-on-sale') }}</p>
    <div class="content">
      <div class="sale-type">
        <div class="sale-type-item" @click="fixedPrice">
          <base-icon class="icon" icon="tag" size="22" />
          <p class="fixed">Fixed price</p>
        </div>
        <div :class="nftItem.totalSupply > 1 ? 'disable-option' : null" class="sale-type-item" @click="openForBids">
          <base-icon v-if="nftItem.totalSupply === 1" class="icon infinity" icon="infinity" size="26" />
          <base-icon v-else class="icon infinity" icon="icon-infinity-disabled" size="26" />
          <p class="open">
            Open for <br />
            bids
          </p>
        </div>
        <div :class="nftItem.totalSupply > 1 ? 'disable-option' : null" class="sale-type-item" @click="timedAuction">
          <base-icon v-if="nftItem.totalSupply === 1" class="icon" icon="timer" size="24" />
          <base-icon v-else class="icon" icon="icon-timer-disabled" size="24" />
          <p class="timed">Timed auction</p>
        </div>
      </div>
      <div class="cancel-button" @click="handleClose">Cancel</div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  // import PopupFixedPrice from './PopupFixedPrice.vue'
  import getRepository from '@/services/index'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  const apiNftv2: NftRepositoryV2 = getRepository('nftv2')
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  // import getRepository from '@/services/index'
  // import NftRepository from '@/services/repositories/nft'
  // const apiNft: NftRepository = getRepository('nft')
  @Component({
    components: {}
  })
  export default class PopupPutOnSale extends Mixins(PopupMixin) {
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.Action('setlistCurrencies') setlistCurrencies!: (list) => void

    isShowButton = false
    dataPopupRoyalties: any = {}
    listCurrencies = []

    async handleOpen(): Promise<void> {
      this.setOpenPopup({
        popupName: 'putOnSale',
        isOpen: true
      })
    }
    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-put-on-sale',
        isOpen: false
      })
    }
    async fixedPrice(): Promise<void> {
      this.isShowButton = false
      const params = {
        itemId: this.nftItem.id
      }
      this.listCurrencies = await apiNftv2.getListAcceptPayment(params)

      if (!this.listCurrencies.length) {
        const message = this.$t('notify_empty-list-accept-currency') as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject()
      }

      this.setlistCurrencies(this.listCurrencies)
      this.setOpenPopup({
        popupName: 'popup-fixed-price',
        isOpen: true
      })
    }
    async openForBids(): Promise<void> {
      this.isShowButton = false
      const params = {
        itemId: this.nftItem.id,
        notCurrency: true
      }
      this.listCurrencies = await apiNftv2.getListAcceptPayment(params)

      if (!this.listCurrencies.length) {
        const message = this.$t('notify_empty-list-accept-currency') as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject()
      }

      this.setlistCurrencies(this.listCurrencies)
      this.setOpenPopup({
        popupName: 'popup-open-for-bids',
        isOpen: true
      })
    }
    async timedAuction(): Promise<void> {
      this.isShowButton = false
      const params = {
        itemId: this.nftItem.id,
        notCurrency: true
      }
      this.listCurrencies = await apiNftv2.getListAcceptPayment(params)

      if (!this.listCurrencies.length) {
        const message = this.$t('notify_empty-list-accept-currency') as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject()
      }

      this.setlistCurrencies(this.listCurrencies)
      this.setOpenPopup({
        popupName: 'popup-timed-auction',
        isOpen: true
      })
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-put-on-sale',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.popup-put-on-sale {
    .el-dialog {
      // width: 400px !important;
    }
    .el-dialog__footer {
      display: none;
    }
  }
  .popup-put-on-sale {
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      .cancel-button {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        height: 48px;
        margin-bottom: 24px;
        color: #5b616e;
        // text-align: center;
        width: 342px;
        border: 1px #cccccc solid;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          border-color: var(--bc-btn-default-border-hover);
          -webkit-background-clip: text;
          -webkit-text-fill-color: var(--bc-btn-default-border-hover);
          border-color: var(--bc-btn-default-border-hover);
          text-shadow: 0px 0px #00000000;
        }
      }
      .sale-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
        width: 97.5%;
        .sale-type-item {
          height: 112px;
          cursor: pointer;
          &:hover {
            border-color: var(--bc-btn-default-border-hover);
            -webkit-background-clip: text;
            -webkit-text-fill-color: var(--bc-btn-default-border-hover);
            border-color: var(--bc-btn-default-border-hover);
            text-shadow: 0px 0px #00000000;
          }
          width: 30%;
          display: flex;
          flex-direction: column;
          //   justify-content: center;
          align-items: center;
          border: 1px #cccccc solid;
          border-radius: 5px;
          //   height: 112px;
          .icon {
            padding-top: 10px;
            padding-bottom: 5px;
          }
          .infinity {
            padding-bottom: 2px;
          }
          p {
            font-weight: 600;
            color: #5b616e;
            font-size: 16px;
            line-height: 24px;
            text-align: center;
            padding-bottom: 10px;
          }
          .fixed {
            width: 50px;
          }
          .open {
            width: 69px;
            padding-bottom: 8px;
          }
          .timed {
            width: 59px;
          }
        }
        .disable-option {
          background: #dbdbdb;
          border: none;
          pointer-events: none;
          &:hover {
            border-color: unset;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            border-color: unset;
            text-shadow: unset;
            border: unset;
          }
          p {
            color: var(--bc-text-disabled);
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-put-on-sale {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
      }
    }
    .popup-put-on-sale {
      .content {
        .cancel-button {
          width: 280px;
          font-size: 14px;
          line-height: 20px;
        }
        .sale-type-item {
          height: 104px !important;
          .icon {
            padding-bottom: 8px !important;
          }
          .icon:last-child {
            padding-bottom: 0px !important;
          }
          .fixed {
            font-size: 14px !important;
            line-height: 20px !important;
            word-break: break-word;
          }
          .open {
            font-size: 14px !important;
            line-height: 20px !important;
          }
          .timed {
            font-size: 14px !important;
            line-height: 20px !important;
            word-break: break-word;
          }
        }
      }
    }
  }
</style>
