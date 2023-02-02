<template>
  <base-popup name="popup-accept-bid" class="popup-accept-bid" width="500px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p v-if="typePopup === 'offer'">{{ $t('detail-nft.popup-accept.accept-offer') }}</p>
      <p v-else>{{ $t('detail-nft.popup-accept.accept-bid') }}</p>
    </div>
    <el-form autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
      <div class="content">
        <div class="text-content">
          <span
            ><p class="text-base text-regular text-desc">
              <span v-if="typePopup === 'offer'">{{ $t('detail-nft.popup-accept.you-want-offer') }}</span> <span v-else> {{ $t('detail-nft.popup-accept.you-want') }}</span>
              <span class="text-bold" style="color: #1a1a1c"> {{ item.itemName }} </span>
              {{ $t('detail-nft.popup-accept.from') }}
              <span class="text-bold" style="color: #1a1a1c"> {{ item.fromName }}</span
              ><span>{{ $t('edit-bid-offer.collection') }} </span>
            </p>
          </span>
        </div>
      </div>
      <!-- <el-form-item :label="$t('detail-nft.popup-checkout.enter-quantity')" class="enter-quantity">
        <el-input v-model="quantity" @keypress.native="onlyNumber($event, 'quantity')" @keyup.native="numberFormat($event)" />
        <div v-if="error" class="error">{{ $t('detail-nft.popup-checkout.error1') }} {{ listingQuantity }}</div>
      </el-form-item> -->

      <el-form-item class="price" :label="`${$t('detail-nft.popup-accept.price')} `">
        <el-input disabled :value="getPrice | convertAmountDecimal(item.currency, false, true)" />
        <div class="nearly text-desc nft-body-small text-regular">~${{ balanceExchangeRate | convertAmountDecimal('USD') }}</div>
      </el-form-item>
      <el-form-item
        :label="`${$t('detail-nft.popup-accept.soyalties-fee')} (${$options.filters.convertAmountDecimal(getRoyaltiesCreatorFee, 'PERCENT')}%) `"
        v-if="getRoyaltiesCreatorFee"
      >
        <el-input disabled :value="getRoyalties | convertAmountDecimal(item.currency, false, true)" />
        <div class="nearly text-desc nft-body-small text-regular">~${{ royaltiesExchangeRate | convertAmountDecimal('USD') }}</div>
        <div class="to-you">
          {{ $t('accept-bid.to') }}
          <span v-if="item.sellerIsCreator === 'YES'" class="color-primary">{{ $t('accept-bid.you') }}</span>
          <span v-else class="color-primary">{{ item.creatorName }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="`${$t('detail-nft.popup-accept.service-fee')} (${$options.filters.convertAmountDecimal(serviceFeePercent, 'PERCENT')}%)`">
        <el-input disabled :value="valueserviceFeePercent | convertAmountDecimal(item.currency, false, true)" />
        <div class="nearly text-desc nft-body-small text-regular">~${{ dolaserviceFeePercent | convertAmountDecimal('USD') }}</div>
      </el-form-item>

      <div class="sumMonney">
        <div class="sumMonney-one sumMonney-two nft-header6 text-semibold">
          <div class="sumMonney-two-title">{{ $t('detail-nft.popup-accept.you-will-receive') }}</div>
          <div class="wrap-pay">
            <div class="sumMonney-two-price">{{ receive | convertAmountDecimal(item.currency) }} {{ item.currency }}</div>
            <p class="nft-body-small text-desc text-regular text-right">~${{ (receive * exchangeRate) | convertAmountDecimal('USD') }}</p>
          </div>
        </div>
      </div>
      <!-- <div class="notification-warning">
        <div class="flex">
          <img src="../../../../assets/images/nft/icon-warning.png" alt="" />
          <span class="title-error text-base text-semibold">{{ $t('detail-nft.popup-checkout.went-wrong') }}</span>
        </div>
        <div class="content-error text-body-small text-regular text-desc">
          <span> {{ $t('detail-nft.popup-checkout.error-form') }}</span>
        </div>
      </div>
      <div class="notification-warning">
        <div class="flex">
          <img src="../../../../assets/images/nft/icon-warning.png" alt="" />
          <span class="title-error text-base text-semibold">{{ $t('detail-nft.popup-checkout.went-wrong') }}</span>
        </div>
        <div class="content-error text-body-small text-regular text-desc">
          <span> {{ $t('detail-nft.popup-checkout.error-surplus') }}</span>
        </div>
        <router-link :to="{ name: 'Wallet' }" class="router_center router_setting" style="text-decoration: none">
          <div class="text-semibold text-base text-hyperlink cursor">Add funds now <img src="../../../../assets/images/nft/arrow-right.png" style="margin-left: 7px" alt="" /></div>
        </router-link>
      </div> -->
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
      <!-- <button class="btn-cancel">
        <p class="text-cancel" @click="handleClose">{{ $t('detail-nft.popup-checkout.cancel') }}</p>
      </button> -->
      <button class="btn-default mr-15 text-semibold nft-body-base btn-h40" @click="handleClose">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <!-- <button class="btn-save" @click="hanlleConfirm">
        <p class="text-save">{{ $t('detail-nft.button.accept') }}</p>
      </button> -->
      <el-button
        :loading="isLoading"
        :class="getDisableButton ? 'btn--disabled' : null"
        class="btn is-none-border cursor btn-h40 btn-default-bg text-semibold btn-theme"
        @click="debounceConfirm"
      >
        <p class="nft-body-base btn-accept">{{ $t('detail-nft.button.accept') }}</p>
      </el-button>
    </div>
    <PopupFail />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import filter from 'lodash/filter'
  import firebase from '@/utils/firebase'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepositoryV3 from '@/services/repositories/nftv3'
  import PopupFail from './PopupErrorAccept.vue'
  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const apiNftV3: NftRepositoryV3 = getRepository('nftv3')

  import { namespace } from 'vuex-class'
  import { debounce } from 'lodash'
  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')

  @Component({
    components: { PopupFail }
  })
  export default class PopupAcceptBid extends Mixins(PopupMixin, OnChainMixin) {
    @bcNft.State('listNftAsset') listNftAsset!: Array<Record<string, any>>
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('typePopup') typePopup!: string
    @bcNft.State('item') item!: Record<string, any>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>
    // @bcNft.Mutation('SET_TYPE_OF_ACTION') setTypeOfAction!: (type: string) => void
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Record<string, boolean>

    OffChain: Array<Record<string, any>> = []
    lynkeyInfo: any = {}
    serviceFee = 750.0
    serviceFeePercentCalc = 'LYNK'
    exchangeRateRef: any = null

    // dolaSeviceFee = 0
    isLoading = false
    isvisibleAccept = false
    timing: any = null

    handleOpen(): void {
      this.isOpenPopup = true
    }
    get getPrice(): number {
      return this.item.price
    }

    get exchangeRate(): number {
      if (this.item?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.item?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }
    get balanceExchangeRate(): number {
      return this.getPrice * this.exchangeRate
    }

    get getRoyaltiesCreatorFee(): number {
      return this.item.creatorFee
    }
    get getRoyalties(): number {
      return (this.getPrice * this.item.creatorFee) / 100
    }
    get royaltiesExchangeRate(): number {
      return this.getRoyalties * this.exchangeRate
    }
    get serviceFeePercent(): number {
      return this.item.serviceFeePercent
    }
    get valueserviceFeePercent(): number {
      return (this.serviceFeePercent / 100) * this.getPrice
    }
    get dolaserviceFeePercent(): number {
      return this.valueserviceFeePercent * this.exchangeRate
    }
    get receive(): number {
      if (this.item.sellerIsCreator === 'YES') {
        return this.getPrice - this.valueserviceFeePercent
      }
      return this.getPrice - this.getRoyalties - this.valueserviceFeePercent
    }

    get spenderWallet(): string {
      if (this.nftItem.contractAddress && !this.isLogin) {
        const spender = filter(this.listNftAsset, elm => elm.type === 'NFT').filter(elm => elm.contractAddress === this.nftItem.contractAddress)[0]
        return spender.spenderWalletAddress
      }
      return ''
    }

    @Watch('statusApproveAccount') async handleWatchStatusApproveAccount(status: string): Promise<void> {
      try {
        if (status === 'SUCCESS' && this.isOpenPopup && this.isClickConfirm) {
          const params = {
            offerId: this.item.id
          }
          await apiNftV3.postAcceptOffer(params)
          this.isLoading = false
          this.setTypeOfAction('offer-accept')
          this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
          return
        }
        if (status === 'FAILED' && this.isOpenPopup && this.isClickConfirm) {
          this.isLoading = false
          const message = this.$t('notify.status-approve-failed') as string
          this.$message.error({ message, duration: 5000 })
        }
      } catch (error) {
        this.isLoading = false
        this.offFirebase()
        this.setStatusApproveAccount('NONE')
      }
    }

    async postAcceptBid(): Promise<void> {
      try {
        const params = {
          activityBidId: this.item.activityId,
          listingId: this.item.listingId
        }
        await apiNftV3.postAcceptBid(params)
        this.setTypeOfAction('bid-accept')
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
      } catch (error: any) {
        const { data } = error.response
        let message = ''
        if (data.status === 'SALE_PENDING') {
          message = (this.item.itemName + ' ' + this.$t('notify.sale-pending')) as string
          this.$message.error({ message, duration: 5000 })
        }
        if (data.status === 'BALANCE_NOT_ENOUGH') {
          this.setOpenPopup({
            popupName: 'popup-bid-fail',
            isOpen: true
          })
        }
      }
      // this.isLoading = true

      // this.isLoading = false
      // let message = this.$t('notify.buy-nft-success') as string
      // this.$message.success({ message, duration: 5000 })
      // this.closePopup()
    }
    async postAcceptOffer(): Promise<void> {
      try {
        this.isLoading = true
        this.isClickConfirm = true
        const params = {
          offerId: this.item.id
        }
        if (this.isLogin || (!this.isLogin && !this.nftItem.contractAddress)) {
          await apiNftV3.postAcceptOffer(params)
          this.setTypeOfAction('offer-accept')
          this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
        } else {
          await this.switchNetwork(this.nftItem.baseCurrency)
          if (await this.checkApprovedForAll(this.nftItem.contractAddress, this.spenderWallet, this.nftItem.currency)) {
            await apiNft.validateApprove({}, { itemId: this.nftItem.id })
            this.handleGetApproveAccount()
          } else {
            this.putOnSaleOnChain({ itemId: this.nftItem.id }, this.nftItem.contractAddress, this.spenderWallet, 'popup-accept-bid', this.nftItem.currency)
          }
          // this.acceptOfferOnchain(params, this.nftItem.contractAddress, this.spenderWallet, 'popup-accept-bid', this.nftItem.currency, this.nftItem.id)
        }
      } catch (error: any) {
        this.isLoading = false
        this.offFirebase()
        this.setStatusApproveAccount('NONE')
        const { data } = error.response
        let message = ''
        if (data.status === 'SALE_PENDING') {
          message = (this.item.itemName + ' ' + this.$t('notify.sale-pending')) as string
        }
        if (data.status === 'DONT_ACCEPT_CURRENCY') {
          message = (this.item.itemName + ' ' + this.$t('notify_not-support-accept-token')) as string
        }
        if (message) {
          this.$message.error({ message, duration: 5000 })
        }
        if (data.status === 'BALANCE_NOT_ENOUGH') {
          this.setOpenPopup({
            popupName: 'popup-bid-fail',
            isOpen: true
          })
        }
      }
      // this.isLoading = true

      // this.isLoading = false
      // let message = this.$t('notify.buy-nft-success') as string
      // this.$message.success({ message, duration: 5000 })
      // this.closePopup()
    }

    // created(): void {}

    // @Watch('quantity') checkAmount(value: any): void {
    //   if (value > this.listingQuantity) {
    //     this.error = true
    //   } else {
    //     this.error = false
    //   }
    // }

    get getDisableButton(): boolean {
      return !this.checkedAccept && this.isShowCheckboxAccept
    }

    // created() {}

    handleClose(): void {
      this.offFirebase()
      this.setStatusApproveAccount('NONE')
      this.checkedAccept = false
      this.isClickConfirm = false
      this.isOpenPopup = false
      this.isLoading = false
      clearTimeout(this.timing)
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-accept-bid',
        isOpen: false
      })
    }

    debounceConfirm(): void {
      this.handleConfirm(this)
    }
    handleConfirm = debounce(async _this => {
      if (_this.typePopup === 'offer') {
        await _this.postAcceptOffer()
      } else {
        await _this.postAcceptBid()
      }
    }, 500)
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
    max-width: 452px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .btn-save {
      background: var(--bc-theme-primary-gradient);
      margin-left: 16px;
    }
    .btn-theme {
      display: flex;
      align-items: center;
      justify-content: center;
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
    ::v-deep.popup-accept-bid {
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
