<template>
  <base-popup name="popup-place-bid" class="popup-place-bid" width="600px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <!-- {{title}} -->
      <p v-if="isEditOffer">{{ $t('detail-nft.popup-bid.header-edit-bid') }}</p>
      <p v-else>{{ $t('text-nft.place-a-bid') }}</p>
    </div>
    <div class="content" v-loading="loading">
      <el-form :model="form" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <div class="text-content">
          <p>
            <span v-if="isEditOffer"> {{ $t('edit-bid-offer.title-edit-bid') }}</span>
            <span v-else> {{ $t('detail-nft.popup-bid.title1') }}</span>
            <span class="text-bold" style="color: #0a0b0d"> {{ nftItem.itemName }} </span> {{ $t('detail-nft.popup-bid.title2') }}
            <span class="text-bold" style="color: #0a0b0d"> {{ nftItem.collectionName }} </span> {{ $t('detail-nft.popup-bid.title3') }}
          </p>
        </div>
        <el-form-item v-if="!isEditOffer" :label="$t('label_payment-by')" prop="payment">
          <el-select v-model="form.token" class="w-100 select-token-payment" @change="handleSelectTokenPayment">
            <el-option v-for="token in listAcceptCurrency" :key="token.id" :value="token.currency" :label="token.currencyName">
              <template>
                <div class="be-flex wallet-item">
                  <div class="icon-circle" v-if="token.currency === 'LYNK' || token.currency === 'CLM'">
                    <base-icon :icon="getIcon(token.currency)" size="24" />
                  </div>
                  <base-icon v-else :icon="getIcon(token.currency)" size="24" />
                  <span class="d-ib text-cap" style="margin-left: 10px">{{ token.currencyName }}</span>
                </div>
              </template>
            </el-option>
            <div class="suffix" slot="prefix">
              <base-icon class="d-iflex" :icon="getIcon(form.token)" size="24" />
            </div>
          </el-select>
        </el-form-item>

        <el-form-item class="input-bid" prop="yourBid" :label="$t('detail-nft.popup-bid.bid')" :class="errorBid ? 'is-error' : null">
          <!-- {{ titlePrice }} -->
          <!-- <p class="title-bid">{{ $t('detail-nft.popup-bid.bid') }}</p> -->
          <el-input
            autocomplete="new-password"
            :readonly="false"
            id="bidFocus"
            v-model="form.yourBid"
            :placeholder="`${$t('detail-nft.popup-bid.placeholder')}`"
            @keypress.native="onlyNumber($event, 'amount')"
            @keyup.native="numberFormat($event)"
          />
          <div v-if="!isEditOffer" class="text-bid">
            <p>~${{ balanceUsdOfPriceNft | convertAmountDecimal('USD') }}</p>
          </div>
          <div v-if="isEditOffer" class="text-edit-bid">
            <p>~${{ balanceUsdOfPriceNft | convertAmountDecimal('USD') }}</p>
          </div>
          <div v-if="errorBid" class="error">{{ $t('detail-nft.popup-bid.error3') }} {{ getMinimumBid }} {{ form.token }}</div>

          <div class="be-flex jc-space-between w-100 text-lable" slot="label">
            <span>
              <span class="text-yourbid">{{ $t('label_your-bid') }} </span>
              <span v-if="!isEditOffer">({{ $t('label_minimum-bid') }}: </span>
              <span v-if="!isEditOffer" :class="'amount-' + form.token">{{ getMinimumBid }} {{ form.token }}</span>
              <span v-if="!isEditOffer">)</span>
            </span>
            <span v-if="isEditOffer"
              ><span>{{ $t('label_available') }}:</span> <span :class="'amount-' + form.token">{{ info.available | convertAmountDecimal(form.token) }} {{ form.token }}</span></span
            >
            <span v-if="!isEditOffer" class="text-available">
              <span class="text-avai">{{ `${$t('label_available')}: ` }}</span>
              <span :class="'amount-' + form.token">{{ info.available | convertAmountDecimal(form.token) }} {{ form.token }}</span></span
            >
          </div>
        </el-form-item>
        <el-form-item class="input-bid" :label="`${$t('detail-nft.popup-bid.lynk')} (${$options.filters.convertAmountDecimal(serviceFeePercent, 'PERCENT')}%)`">
          <el-input disabled type="text" class="disabled-input" :value="serviceFee | convertAmountDecimal(form.token, false, true)" />
          <!-- v-if="this.form.yourBid" -->
          <!-- <el-input disabled type="text" class="disabled-input" v-else :value="`0.00 ${nftItem.currency}`" /> -->
          <div class="appropriate-text">
            <p>~${{ serviceFeeUsd | convertAmountDecimal('USD') }}</p>
          </div>
        </el-form-item>
      </el-form>
      <div class="sumMoney">
        <div class="sumMonney-two">
          <div class="sumMonney-two-title">{{ $t('detail-nft.popup-bid.you-will-pay') }}</div>
          <div class="sumMonney-two-price">
            <p>{{ getYouPay | convertAmountDecimal(form.token) }} {{ form.token }}</p>
            <p class="nft-body-small text-desc text-regular text-right">~${{ (getYouPay * exchangeRateOfInputPayment) | convertAmountDecimal('USD') }}</p>
          </div>
        </div>
      </div>

      <div class="el-form chk-accept" v-if="isShowCheckboxAccept">
        <el-checkbox v-model="checkedAccept">
          <div class="terms text-left" style="font-size: 14px; line-height: 24px; color: var(--bc-text-discript)">
            {{ $t('text-tern.click-confirm') }}
            <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
              {{ $t('text-tern.term') }}</a
            >
          </div></el-checkbox
        >
      </div>
      <div v-else class="terms text-left" style="font-size: 14px; line-height: 24px; color: var(--bc-text-discript)">
        {{ $t('text-tern.click-confirm') }}
        <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none"> {{ $t('text-tern.term') }}</a>
      </div>
      <div class="add-funds" v-if="checkValidate">
        <div class="exclamation">
          <div class="exclamation-img">
            <base-icon icon="alert" size="20" />
          </div>
          <span class="title-add-funds">{{ $t('detail-nft.popup-bid.error1') }}</span>
        </div>
        <div class="funds-now">
          <p class="add-funds-desc">{{ $t('detail-nft.popup-bid.desc-funds') }}</p>
          <router-link :to="{ name: 'Wallet' }" class="router_center router_setting" style="text-decoration: none">
            <div class="text-semibold text-base text-hyperlink cursor be-flex align-center">
              <span> {{ $t('buy-nft.add-funds-now') }}</span>
              <base-icon v-if="coinMain === 'LYNK'" icon="icon-arrow-right" class="d-iflex" size="24" style="padding-left: 2px" />
              <base-icon v-else icon="icon-arrow-right-clm" class="d-iflex" size="24" style="padding-left: 2px" />
            </div>
          </router-link>
        </div>
      </div>

      <div class="add-funds" v-if="errorBid">
        <div class="exclamation">
          <div class="exclamation-img">
            <base-icon icon="alert" size="20" />
          </div>
          <span class="title-add-funds">{{ $t('detail-nft.popup-bid.error1') }}</span>
        </div>
        <p class="error-desc">{{ $t('detail-nft.popup-bid.error2') }}</p>
      </div>
    </div>

    <div slot="footer" class="popup-footer">
      <button class="btn-default mr-16 text-regular btn-h40 button-cancel" @click="handleClose">
        <p class="text-cancel">{{ $t('button.cancel') }}</p>
      </button>
      <el-button
        :loading="isLoading"
        :class="getDisableBtn ? 'btn--disabled' : null"
        class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme"
        @click="handleDebounceConfirm"
      >
        <p>{{ $t('button.confirm') }}</p></el-button
      >
    </div>
    <popup-error-edit-offer />
  </base-popup>
  <!-- make offer -->
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'
  import PopupErrorEditOffer from '../nft-detail/popup/PopupErrorEditOffer.vue'
  import includes from 'lodash/includes'
  import getRepository from '@/services/index'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepositoryV3 from '@/services/repositories/nftv3'
  import WalletRepository from '@/services/repositories/wallet'

  import filter from 'lodash/filter'
  import { namespace } from 'vuex-class'
  import debounce from 'lodash/debounce'
  import { Decimal } from 'decimal.js'
  import NftRepository from '@/services/repositories/nft'

  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const apiNftV3: NftRepositoryV3 = getRepository('nftv3')
  const apiWallet: WalletRepository = getRepository('wallet')
  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('beAuth')

  const bcNft = namespace('bcNft')

  @Component({
    components: {
      PopupErrorEditOffer
    }
  })
  export default class PopupBidNft extends Mixins(PopupMixin, OnChainMixin) {
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('info') info!: Record<string, any>
    @bcNft.State('isEditOffer') isEditOffer!: boolean
    @bcNft.Mutation('SET_VALUE_BALANCE_AND_CURRENCY') setBalanceCurrency!: (data: Record<string, any>) => void
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Record<string, boolean>
    @bcNft.State('listNftAsset') listNftAsset!: Array<Record<string, any>>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>
    // bidInfo: any = {}
    form: Record<string, any> = {
      yourBid: '',
      token: ''
    }
    ischeckEditOffer = false
    tabActive: any = null
    loading: any = false
    listener: any = null
    isLoading = false
    // priceAvailable = 0
    numberRate = 0
    disableBtn = false
    checkValidate = false
    checkErrorValidate = false
    // availableBalance = 0
    titleSuccess = ''
    // yourBid = ''
    // error = false
    checkDisableBtn = true
    errorBid = false
    exchangeRateRef: any = null
    isCheckFocus = false

    oldYourBid = 0

    handleOpen(): void {
      // this.updateYourBid()
      if (this.isEditOffer) {
        this.form.token = this.nftItem.myLastOfferCurrency
        this.oldYourBid = this.nftItem.myLastOfferPrice
        this.form.yourBid = this.$options.filters?.convertAmountDecimal(this.nftItem.myLastOfferPrice, this.nftItem.myLastOfferCurrency)
      } else {
        this.form.token = this.listAcceptCurrency[0].currency
        this.form.yourBid = ''
      }
      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
      this.$nextTick(() => {
        ;(document.getElementById('bidFocus') as HTMLElement).focus()
      })

      // this.$refs.yourBidFocus.focus()
      console.log('info', this.info)
      console.log('systemParamsPublic', this.systemParamsPublic)
    }

    async getBidOffChain(): Promise<void> {
      const params = {
        yourBid: Number(this.form.yourBid.replace(/,/g, '')),
        listingId: +this.nftItem.minListingId,
        currency: this.form.token,
        usdExchangeRate: this.exchangeRateOfInputPayment
      }
      // const pay = this.$options.filters?.convertAmountDecimal(this.getYouPay, this.nftItem.currency) as string
      await apiNftV3.placeABid(params)
    }
    async handleBidOnChain(): Promise<void> {
      try {
        this.isLoading = true
        await this.validateCurrentUser()
        await this.switchNetwork(this.nftItem.baseCurrency)

        const type = this.isEditOffer ? 'bid-edit' : 'bid-add'
        const amount = Number(this.getYouPay)
        const amountBidIncludeFee = this.oldYourBid + (this.nftItem.myLastOfferPrice * this.info.serviceFeePercent) / 100
        const hash = await this.approveExchangeSpendTokenOfUser(this.form.token, amountBidIncludeFee, amount, type)
        const params = {
          yourBid: this.form.yourBid.replaceAll(',', ''),
          listingId: +this.nftItem.minListingId,
          transactionCode: hash,
          currency: this.form.token,
          usdExchangeRate: this.exchangeRateOfInputPayment
        }
        await apiNftV3.placeABid(params)
        this.isLoading = false
        // this.setStatusApproveItem('PENDING')
        return Promise.resolve()
      } catch (error) {
        console.log(error)

        this.isLoading = false
        return Promise.reject(error)
      }
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        // console.log('coin', coin)
        return coin.exchangeRate
      }
      return 0
    }
    get serviceFee(): number {
      return (this.info.serviceFeePercent / 100) * Number(this.form.yourBid.replace(/,/g, ''))
    }
    get serviceFeeUsd(): number {
      return this.serviceFee * this.exchangeRateOfInputPayment
    }
    get serviceFeePercent(): number {
      if (this.info?.serviceFeePercent) {
        return this.info?.serviceFeePercent
      }
      return 0
    }
    get getYouPay(): number {
      // this.yourBid =
      return Number(this.form.yourBid.replace(/,/g, '')) + this.serviceFee
    }

    get getDisableBtn(): boolean {
      if (this.isEditOffer) {
        return this.form.yourBid == '' || this.checkValidate || this.errorBid || !this.isCheckFocus || (this.isShowCheckboxAccept && !this.checkedAccept)
      } else {
        return this.form.yourBid == '' || this.checkValidate || this.errorBid || (this.isShowCheckboxAccept && !this.checkedAccept)
      }
    }

    get spenderAddressExchange(): any {
      if (!this.isLogin) {
        const contract = filter(this.listNftAssetOnChain, elm => elm.type === 'EXCHANGE' && elm.isSystem && elm.baseCurrency === this.nftItem.baseCurrency)
        return contract.length ? contract[0].spenderWalletAddress : ''
      }
      return ''
    }
    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.nftItem.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    get exchangeRateOfInputPayment(): number {
      if (this.form.token && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.form.token)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get getMinimumBid(): string {
      if (this.nftItem.minListingPriceWei) {
        const decimal = this.$options.filters?.getDecimalsToken(this.nftItem.currency)
        const minListingPriceWei = new Decimal(this.nftItem.minListingPriceWei)
        const minListingPrice = minListingPriceWei.div(Math.pow(10, decimal))
        const minimumBid = minListingPrice.mul(this.exchangeRate).div(this.exchangeRateOfInputPayment)
        return this.$options.filters?.roundUpNumberCurrency(minimumBid.toNumber(), this.form.token)
      }
      return '0'

      // return (this.nftItem.minListingPrice * this.exchangeRate) / this.exchangeRateOfInputPayment
    }

    get balanceUsdOfPriceNft(): number {
      return Number(this.form.yourBid.replaceAll(',', '')) * this.exchangeRateOfInputPayment
    }

    status: any = [
      {
        label: 'PLace a bid'
      },
      {
        label: 'Make offer'
      }
    ]
    handleDebounceConfirm() {
      this.handleConfirmBid(this)
    }
    handleConfirmBid = debounce(async _this => {
      try {
        if (_this.isLogin) {
          await _this.getBidOffChain()
        } else {
          await _this.handleBidOnChain()
        }
        if (_this.isEditOffer) {
          _this.ischeckEditOffer = false
          _this.setTypeOfAction('bid-edit')
          _this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
        } else {
          _this.setTypeOfAction('bid-add')
          _this.setBalanceCurrency({ balancePay: _this.getYouPay, currency: _this.form.token })
          _this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
        }
      } catch (error: any) {
        const { data } = error.response
        let message = ''
        switch (data.status) {
          case 'TRANSACTION_PENDING':
            message = (_this.nftItem.itemName + ' ' + _this.$t('notify.transaction-is-pending')) as string
            break
        }
        if (message) {
          _this.$message.error({ message, duration: 5000 })
        }
        if (_this.isEditOffer) {
          _this.ischeckEditOffer = false
          _this.setOpenPopup({
            popupName: 'popup-error-edit-offer',
            isOpen: true
          })
        }
      }
    }, 500)
    // async handleConfirmBid(): Promise<void> {
    //   try {
    //     if (this.isLogin) {
    //       await this.getBidOffChain()
    //     } else {
    //       await this.handleBidOnChain()
    //     }
    //     if (this.isEditOffer) {
    //       this.ischeckEditOffer = false
    //       this.setOpenPopup({
    //         popupName: 'popup-success-edit-offer',
    //         isOpen: true
    //       })
    //     } else {
    //       this.setOpenPopup({
    //         popupName: 'popup-bid-success',
    //         isOpen: true
    //       })
    //     }
    //   } catch (error) {
    //     if (this.isEditOffer) {
    //       this.ischeckEditOffer = false
    //       this.setOpenPopup({
    //         popupName: 'popup-error-edit-offer',
    //         isOpen: true
    //       })
    //     }
    //     console.log(error)
    //   }
    // }

    handleClose(): void {
      this.checkedAccept = false
      this.setOpenPopup({
        popupName: 'popup-place-bid',
        isOpen: false
      })
      this.loading = false
      this.form.yourBid = ''
      this.errorBid = false

      this.checkValidate = false
      this.tabActive = null
    }

    @Watch('form.yourBid') watchYourBid(value: string): void {
      //@ts-ignore
      this.$refs['ruleForm']?.clearValidate()
      this.debounceValidateBid(value, this)
    }

    debounceValidateBid = debounce((value: string, _this: any) => {
      const minimumBid = Number(_this.getMinimumBid.replaceAll(',', ''))
      if (Number(value.replaceAll(',', '')) < minimumBid) {
        _this.errorBid = true
      }
      if (value === '' || Number(value.replaceAll(',', '')) >= minimumBid) {
        _this.errorBid = false
      }

      if (_this.isEditOffer) {
        if (value == _this.$options.filters?.convertAmountDecimal(_this.nftItem.myLastOfferPrice, _this.nftItem.currency)) {
          _this.isCheckFocus = false
        } else {
          _this.isCheckFocus = true
        }
      }
    }, 500)

    // destroyed(): void {
    //   // EventBus.$off('price')
    //   EventBus.$off('infoBid1')
    // }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form.yourBid[type], '.')) {
        event.preventDefault()
      }
    }
    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        // this.tabActive = null
        _event.target.value = fnumber
      }
      if (Number(this.getYouPay) > this.info.available) {
        if (this.errorBid) {
          this.checkValidate = true
        }
        if (!this.errorBid) {
          this.checkValidate = true
          // this.checkDisableBtn = true
        }
      } else {
        this.checkValidate = false
        // this.checkDisableBtn = false
      }
    }
    // numberFormat(event: FocusEvent): void {
    //   const _event: any = event
    //   let fnumber = _event.target.value
    //   if (fnumber.length > 0) {
    //     fnumber = fnumber.replaceAll(',', '')
    //     fnumber = this.$options.filters?.numberWithCommas(fnumber)
    //     this.tabActive = null
    //     _event.target.value = fnumber
    //   }
    // }
    // get getDisableSubmit(): boolean {
    //   if (this.withdraw.yourbid.value != null) {
    //     return !(!this.errorAmount && this.withdraw.yourbid && this.withdraw.quantity)
    //   } else {
    //     return !(!this.errorAmount && this.withdraw.yourbid)
    //   }
    // }
    destroyed() {
      this.setOpenPopup({
        popupName: 'popup-place-bid',
        isOpen: false
      })
    }

    async handleSelectTokenPayment(token: string): Promise<void> {
      this.form.yourBid = ''
      let available = 0
      let info: Record<string, any> = {}
      const params = {
        listingId: this.nftItem.minListingId
      }
      if (this.isLogin) {
        const result = await apiWallet.getMyWallet({ currency: token })
        available = result[0].assetBalances.availableBalance
        info = await apiNft.getLynkeyInfo(token, params)
      } else {
        let contractOfToken = ''
        if (this.listAssetNetwork.length) {
          const tokenLynk = filter(this.listAssetNetwork, elm => elm.currency === token)[0]
          contractOfToken = tokenLynk?.contractAddress || ''
        }

        available = await this.getBalance(token)
        info = await apiNft.getLynkeyInfo(token, params)
      }
      this.setInfoActivity({ ...info, available })
    }

    getIcon(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : ''
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.popup-place-bid {
    .content {
      width: 100%;
      padding-bottom: 24px;
      .text-content {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
        word-break: break-word;
        margin-bottom: 24px;
        .text-bold {
          font-weight: 600;
        }
      }
      .input-bid {
        margin-top: 24px;
        input[type='number'] {
          position: relative;
          max-width: 432px;
          width: 100%;
          font-size: 16px;
          color: #0a0b0d;
          // ::placeholder{
          //   color: #5B616E;
          // }
        }
        .title-bid {
          font-size: 14px;
          line-height: 20px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #0a0b0d;
        }
        .text-bid {
          position: absolute;
          right: 12px;
          line-height: 24px;
          color: #5b616e;
          top: 40px;
        }
        .appropriate-text {
          position: absolute;
          top: 40px;
          right: 12px;
          line-height: 24px;
          color: #5b616e;
        }
        .is-error,
        .error {
          color: var(--bc-required);
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          margin-top: 8px;
        }
        .text-edit-bid {
          position: absolute;
          top: 40px;
          right: 12px;
          line-height: 24px;
          color: #5b616e;
        }
      }
      .sumMoney {
        margin: 24px 0 2px 0;
        .sumMonney-one {
          display: flex;
          font-size: 14px;
          justify-content: space-between;
          margin-bottom: 2px;

          .sumMonney-one-price {
            color: #5b616e;
          }
          .sumMonney-one-title {
            line-height: 24px;
            color: #5b616e;
          }
        }
        .sumMonney-two {
          display: flex;
          font-size: 16px;
          justify-content: space-between;
          margin-bottom: 24px;
          color: #0a0b0d;
          font-weight: 600;
          line-height: 24px;
        }
      }

      .select-token-payment {
        .el-input__inner {
          padding-left: 45px;
          text-transform: capitalize;
        }
        .el-input__prefix {
          margin: 0 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          .suffix {
            display: flex;
          }
        }
      }
    }
    .disable-addfunds {
      display: none;
    }
    .add-funds {
      background-color: #fbedee;
      border-radius: 6px;
      padding: 12px 0;
      margin: 24px 0 0;
      .exclamation {
        display: flex;
        align-items: center;
        padding-left: 12px;
        margin-bottom: 6px;
        .title-add-funds {
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          color: #cf202f;
          margin-left: 9.66px;
        }
      }
      .error-desc {
        padding-left: 12px;
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        color: #5b616e;
      }
      .funds-now {
        padding: 0 12px;
        .add-funds-desc {
          padding-bottom: 8px;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          color: #5b616e;
          word-break: break-word;
        }
        div {
          display: flex;
          align-items: center;
          .add-fund-now {
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
            color: #0151fc;
            text-decoration: none;
            padding-right: 6.87px;
          }
        }
      }
    }
    // Footer
    .popup-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      button {
        min-width: 100px;
        font-size: 16px !important;
        line-height: 24px !important;
      }
      .btn-theme {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .text-cancel {
        font-size: 16px;
        line-height: 24px;
        color: #5b616e;
        font-weight: 600;
      }
      .disabled-continue {
        background: #f3f2f1;
        color: #89909e;
        cursor: no-drop;
      }
      .active-continue {
        // background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
        color: #fff;
        cursor: pointer;
      }
      .btn {
        padding: 0 !important;
      }
      .active-make-offer {
        max-width: 120px !important;
        width: 100%;
        background: var(--bc-theme-primary-gradient);
        color: #fff;
        cursor: pointer;
      }
      .disabled-make-offer {
        max-width: 120px !important;
        width: 100%;
        background: #f3f2f1;
        color: #89909e;
        cursor: no-drop;
      }
      .text-continue {
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
      }
      .error-validation {
        display: none;
      }
    }
  }

  @media (max-width: 768px) {
    ::v-deep.popup-place-bid {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .popup-content {
          .text-content {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 16px !important;
          }
          .el-form-item {
            margin-bottom: 16px;
          }
          .el-input__inner {
            font-size: 16px;
            line-height: 24px;
            font-weight: 400;
            border-color: #dbdbdb;
            color: #0a0b0d;
          }
          .text-desc {
            font-size: 14px;
            line-height: 20px;
          }
          .input-bid {
            margin-top: 16px;
            .el-form-item__label {
              .text-lable {
                word-break: break-word;
                .text-available {
                  display: none;

                  .text-avai {
                    text-align: right;
                  }
                }
                .text-yourbid {
                  // display: block;
                }
              }
            }
            .text-bid {
              // top: unset !important;
              // bottom: 12px !important;
            }
            .text-edit-bid {
              position: absolute;
              top: 40px;
              right: 12px;
              line-height: 24px;
              color: #5b616e;
            }
          }
          .add-funds {
            // margin: 0px 0 24px;
            .error-desc {
              word-break: break-word;
            }
          }
          .sumMoney {
            margin: 16px 0;
            .sumMonney-two {
              margin-bottom: 0;
            }
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
          }
          .text-cancel {
            font-size: 14px !important;
            line-height: 20px !important;
          }
        }
        .terms {
          font-size: 12px !important;
          line-height: 16px !important;
          word-break: break-word;
        }
      }
    }
    .hide-mobile {
      display: none;
    }
  }
</style>
