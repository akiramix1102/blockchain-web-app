<template>
  <base-popup name="popup-cancel-bid-offer" class="popup-center-bid-offer" width="500px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p v-if="isCenterOffer">{{ $t('center-bid-offer.title-center-offer') }}</p>
      <p v-else>{{ $t('center-bid-offer.title-center-bid') }}</p>
      <!-- <p v-else>{{ $t('detail-nft.popup-accept.accept-bid') }}</p> -->
    </div>
    <el-form autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
      <div class="content">
        <div class="text-content">
          <span
            ><p class="text-base text-regular text-desc">
              <span v-if="isCenterOffer">{{ $t('center-bid-offer.you-want-centel-offer') }}</span>
              <span v-else> {{ $t('center-bid-offer.you-want-centel-bid') }} </span>
              <span class="text-bold" style="color: #1a1a1c"> {{ nftItem.itemName }} </span>
              {{ $t('center-bid-offer.from') }}
              <span class="text-bold" style="color: #1a1a1c"> {{ nftItem.collectionName }} </span>{{ $t('center-bid-offer.collection') }}
            </p>
          </span>
        </div>
      </div>
      <el-form-item style="margin-top: 24px" v-if="isCenterOffer" :label="`${$t('center-bid-offer.your-offer')} `">
        <el-input disabled :value="nftItem.myLastOfferPrice | convertAmountDecimal(nftItem.myLastOfferCurrency, false, true)" />
        <div class="nearly text-desc nft-body-caption text-regular">~${{ (nftItem.myLastOfferPrice * exchangeRate) | convertAmountDecimal('USD') }}</div>
      </el-form-item>
      <el-form-item style="margin-top: 24px" v-else :label="`${$t('center-bid-offer.your-bid')} `">
        <el-input disabled :value="nftItem.myLastOfferPrice | convertAmountDecimal(nftItem.myLastOfferCurrency, false, true)" />
        <div class="nearly text-desc nft-body-caption text-regular">~${{ (nftItem.myLastOfferPrice * exchangeRate) | convertAmountDecimal('USD') }}</div>
      </el-form-item>
    </el-form>
    <div class="el-form chk-accept" v-if="isShowCheckboxAccept">
      <el-checkbox v-model="checkedAccept">
        <div class="terms text-left" style="font-size: 14px; line-height: 24px; margin-bottom: 24px; color: var(--bc-text-discript)">
          {{ $t('text-tern.click-confirm') }}
          <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
            {{ $t('text-tern.term') }}</a
          >
        </div></el-checkbox
      >
    </div>
    <div v-else class="terms text-left" style="font-size: 14px; line-height: 24px; margin-bottom: 24px; color: var(--bc-text-discript)">
      {{ $t('text-tern.click-confirm') }}
      <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none"> {{ $t('text-tern.term') }}</a>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-default mr-15 text-semibold nft-body-base btn-h40 text-desc" @click="handleClose">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button
        :loading="isLoading"
        :class="getDisableSubmit ? 'btn--disabled' : null"
        class="btn is-none-border cursor btn-h40 btn-default-bg text-semibold btn-theme"
        @click="hanlleConfirm"
      >
        <p class="nft-body-base">{{ $t('center-bid-offer.confirm') }}</p>
      </el-button>
    </div>
    <PopupFail />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import filter from 'lodash/filter'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import PopupFail from './PopupErrorCencelEdit.vue'
  const apiNft: NftRepository = getRepository('nft')

  import { namespace } from 'vuex-class'

  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')

  @Component({
    components: { PopupFail }
  })
  export default class PopupCancelBidOffer extends Mixins(PopupMixin, OnChainMixin) {
    @Prop() nftItem: any
    @Prop() isCenterOffer: any

    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Record<string, boolean>
    @bcNft.State('info') info!: Record<string, any>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    isLoading = false

    get spenderAddressExchange(): any {
      if (!this.isLogin) {
        const contract = filter(this.listNftAssetOnChain, elm => elm.type === 'EXCHANGE' && elm.isSystem && elm.baseCurrency === this.nftItem.baseCurrency)
        return contract.length ? contract[0].spenderWalletAddress : ''
      }
      return ''
    }

    get exchangeRate(): number {
      if (this.nftItem?.myLastOfferCurrency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.myLastOfferCurrency)[0]
        // console.log('coin', coin)
        return coin.exchangeRate
      }
      return 0
    }

    get getDisableSubmit(): boolean {
      return !this.checkedAccept && this.isShowCheckboxAccept
    }

    handleOpen(): void {
      this.setOpenPopup({
        popupName: 'popup-cancel-bid-offer',
        isOpen: true
      })
    }
    async handleCancelBid(): Promise<void> {
      try {
        this.isLoading = true
        let params: Record<string, any> = {}
        if (this.isLogin) {
          params = {
            bidId: this.nftItem.myOfferId
          }
        } else {
          await this.validateCurrentUser()
          const type = 'bid-cancel'
          const amount = Number(this.nftItem.myLastOfferPrice) + (this.nftItem.myLastOfferPrice * this.info.serviceFeePercent) / 100

          const hash = await this.approveExchangeSpendTokenOfUser(this.nftItem.myLastOfferCurrency, 0, amount, type)
          params = {
            bidId: this.nftItem.myOfferId,
            transactionCode: hash
          }
        }

        await apiNft.handleCancelBid(params)
        this.isLoading = false
        // this.setStatusApproveItem('PENDING')
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
      } catch (error: any) {
        console.log(error)

        this.isLoading = false
        const { data } = error.response
        if (data.status == 'SALE_PENDING') {
          let message = ''
          switch (data.status) {
            case 'SALE_PENDING':
              message = (this.nftItem.itemName + ' ' + this.$t('notify.sale-pending')) as string
              break
          }
          if (message) {
            this.$message.error({ message, duration: 5000 })
          }
        } else {
          this.setOpenPopup({
            popupName: 'popup-error-cancel-bid',
            isOpen: true
          })
        }
      }
    }
    async handleCancelOffer(): Promise<void> {
      try {
        this.isLoading = true
        let params: Record<string, any> = {}
        if (this.isLogin) {
          params = {
            offerId: this.nftItem.myOfferId
          }
        } else {
          await this.validateCurrentUser()
          const type = 'bid-cancel'
          const amount = Number(this.nftItem.myLastOfferPrice) + (this.nftItem.myLastOfferPrice * this.info.serviceFeePercent) / 100
          const hash = await this.approveExchangeSpendTokenOfUser(this.nftItem.myLastOfferCurrency, 0, amount, type)
          params = {
            offerId: this.nftItem.myOfferId,
            transactionCode: hash
          }
        }
        await apiNft.handleCancelOffer(params)
        this.isLoading = false
        // this.setStatusApproveItem('PENDING')
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
      } catch (error: any) {
        this.isLoading = false
        const { data } = error.response
        if (data.status == 'SALE_PENDING') {
          let message = ''
          switch (data.status) {
            case 'SALE_PENDING':
              message = (this.nftItem.itemName + ' ' + this.$t('notify.sale-pending')) as string
              break
          }
          if (message) {
            this.$message.error({ message, duration: 5000 })
          }
        } else {
          this.setOpenPopup({
            popupName: 'popup-error-cancel-bid',
            isOpen: true
          })
        }
      }
    }
    handleClose(): void {
      this.checkedAccept = false
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-cancel-bid-offer',
        isOpen: false
      })
    }

    async hanlleConfirm() {
      if (this.isCenterOffer) {
        this.setTypeOfAction('offer-cancel')
        await this.handleCancelOffer()
      } else {
        this.setTypeOfAction('bid-cancel')
        await this.handleCancelBid()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn--disabled {
    padding: unset !important;
    pointer-events: none;
    .text-save {
      color: unset !important;
    }
  }

  .error {
    color: var(--bc-required);
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    margin-top: 8px;
  }
  .price {
    margin-top: 24px;
  }
  .nearly {
    color: #5b616e;
    position: absolute;
    bottom: 13px;
    right: 8px;
    pointer-events: none;
  }
  .code {
    position: absolute;
    top: 0;
    right: 0;
  }
  .content {
    .text-content {
      word-break: break-word;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
    .new-price {
      margin-top: 24px;
      position: relative;
      color: var(--bc-text-primary);
      input[type='text'] {
        max-width: 452px;
        width: 100%;
        height: 48px;
        margin-top: 10px;
        border: 1px solid rgba(219, 219, 219, 1);
        border-radius: 5px;
        padding-left: 12px;
        font-size: 16px;
        ::placeholder {
        }
      }
      .text-place {
        position: absolute;
        top: 44px;
        right: 20px;
      }
    }
  }
  .footer {
    display: flex;
    align-content: center;
    justify-content: flex-end;
    max-width: 452px;
    width: 100%;
    .btn-save {
      background: var(--bc-theme-primary-gradient);
      margin-left: 16px;
    }
    button {
      min-width: 100px;
      // width: 100%;
      // height: 40px;
      // border: 1px solid rgba(219, 219, 219, 1);
      // border-radius: 6px;
      // background: #fff;
      // cursor: pointer;
      .text-cancel {
        font-size: 16px;
        line-height: 24px;
        color: #5b616e;
        font-weight: 600;
      }
      .text-save {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: white;
      }
    }
    .btn-theme {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .sumMonney {
    margin-bottom: 24px;
    .sumMonney-one {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .sumMonney-two-title,
      .sumMonney-two-price {
        color: var(--bc-text-primary);
      }
    }
    .sumMonney-two {
      margin-top: 4px;
    }
  }
  .char-code {
    color: var(--bc-text-primary);
  }
  .notification-warning {
    padding: 12px;
    background: var(--bc-bg-error);
    border-radius: 6px;
    width: 100%;
    margin-bottom: 24px;
    .title-error {
      color: var(--bc-status-error);
      margin-left: 10px;
    }
    .content-error {
      margin-top: 6px;
      margin-bottom: 8px;
      word-break: break-word;
    }
  }
  .to-you {
    position: absolute;
    top: -3px;
    right: 0;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    color: var(--bc-text-discript);
  }
  @media (max-width: 768px) {
    ::v-deep.popup-center-bid-offer {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .popup-content {
          .description {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 16px !important;
          }
          .el-form-item {
            margin: 16px 0 16px;
          }
          .el-input__inner {
            font-size: 16px;
            line-height: 24px;
            font-weight: 400;
            border-color: #dbdbdb;
          }
          .text-desc {
            font-size: 14px;
            line-height: 20px;
          }
          .input-bid {
            margin-top: 16px;
          }
          .sumMonney {
            margin-bottom: 16px;
          }
        }
        .form-footer {
          .pay {
            margin-bottom: 16px !important;
            font-size: 16px;
          }
        }
        .footer,
        .popup-footer {
          button {
            max-width: 100px;
            width: 100%;
            font-size: 14px !important;
            line-height: 20px !important;
            .btn-accept {
              font-size: 14px !important;
              line-height: 20px !important;
            }
          }
        }
        .terms {
          font-size: 12px !important;
          line-height: 16px !important;
          word-break: break-word;
        }
      }
    }
  }
</style>
