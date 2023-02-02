<template>
  <base-popup name="popup-make-offer" class="popup-make-offer" width="600px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p v-if="isEditOffer">{{ $t('edit-bid-offer.header-edit-offer') }}</p>
      <p v-else>{{ $t('detail-nft.popup-bid.header-make') }}</p>
    </div>
    <div class="content" v-loading="loading">
      <el-form :model="form" :rules="rules" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <div class="text-content">
          <p>
            <span v-if="isEditOffer">{{ $t('edit-bid-offer.title-edit-offer') }} </span> <span v-else>{{ $t('detail-nft.popup-bid.title-make') }}</span>
            <span class="text-bold" style="color: #0a0b0d"> {{ nftItem.itemName }} </span> {{ $t('detail-nft.popup-bid.title2') }}
            <span class="text-bold" style="color: #0a0b0d"> {{ nftItem.collectionName }} </span><span>{{ $t('edit-bid-offer.collection') }} </span>

            <!-- {{ $t('detail-nft.popup-bid.title-make') }} <span class="text-bold" style="color: #0a0b0d">{{ nftItem.itemName }}</span> {{ $t('detail-nft.popup-bid.title2') }}
            {{ $t('detail-nft.popup-bid.title3') }} <span class="text-bold" style="color: #0a0b0d">{{ nftItem.collectionName }}</span> -->
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
                  <span class="d-ib" style="margin-left: 10px">{{ token.currencyName }}</span>
                </div>
              </template>
            </el-option>
            <div class="suffix" slot="prefix">
              <base-icon class="d-iflex" :icon="getIcon(form.token)" size="24" />
            </div>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="nftItem.totalSupply > 1 && nftItem.numOfOwners >= 1"
          class="input-bid"
          prop="quantity"
          :label="$t('buy-nft.quantity')"
          :class="errorQuanti ? 'is-error' : null"
        >
          <!-- {{ titlePrice }} -->
          <!-- <p class="title-bid">{{ $t('detail-nft.popup-bid.bid') }}</p> -->
          <el-input
            autocomplete="new-password"
            :readonly="false"
            v-model="form.quantity"
            :placeholder="$t('placeholder.quantity')"
            @keypress.native="onlyNumber($event, 'amount')"
            @keyup.native="numberFormat($event)"
          />
          <div v-if="errorQuanti" class="error">{{ $t('buy-nft.error-quantity') }} {{ nftItem.totalSupply }}</div>
        </el-form-item>
        <el-form-item class="input-bid" prop="yourOffer">
          <!-- {{ titlePrice }} -->
          <!-- <p class="title-bid">{{ $t('detail-nft.popup-bid.bid') }}</p> -->
          <el-input
            autocomplete="new-password"
            :readonly="false"
            v-model="form.yourOffer"
            :placeholder="`${$t('placeholder-offer')}`"
            @keypress.native="onlyNumber($event, 'amount')"
            @keyup.native="numberFormat($event)"
          />
          <div class="appropriate-text">
            <p>~${{ balanceUsdOfPriceNft | convertAmountDecimal('USD') }}</p>
          </div>
          <div class="be-flex jc-space-between w-100" slot="label">
            <span>
              <span>{{ $t('edit-bid-offer.your-offer') }} </span>
            </span>
            <span
              >{{ $t('label_available') }}: <span :class="'amount-' + form.token">{{ info.available | convertAmountDecimal(form.token) }} {{ form.token }}</span></span
            >
          </div>
        </el-form-item>
        <el-form-item class="input-bid" :label="`${$t('detail-nft.popup-bid.lynk')} (${$options.filters.convertAmountDecimal(serviceFeePercent, 'PERCENT')}%)`">
          <el-input disabled type="text" class="disabled-input" :value="serviceFee | convertAmountDecimal(form.token, false, true)" />
          <div class="appropriate-text">
            <p>~${{ dolaSeviceFee | convertAmountDecimal('USD') }}</p>
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

      <div v-if="isEditOffer">
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
          <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
            {{ $t('text-tern.term') }}</a
          >
        </div>
      </div>
      <div v-else>
        <div class="el-form chk-accept" v-if="isShowCheckboxAccept">
          <el-checkbox v-model="checkedAccept">
            <div class="terms text-left" style="font-size: 14px; line-height: 24px; color: var(--bc-text-discript)">
              {{ $t('text-tern.click-make-offer') }}
              <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
                {{ $t('text-tern.term') }}</a
              >
            </div></el-checkbox
          >
        </div>
        <div v-else class="terms text-left" style="font-size: 14px; line-height: 24px; color: var(--bc-text-discript)">
          {{ $t('text-tern.click-make-offer') }}
          <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
            {{ $t('text-tern.term') }}</a
          >
        </div>
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

      <div class="add-funds" v-if="errorQuanti">
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
      <el-button :loading="isLoading" :class="getDisableBtn ? 'btn--disabled' : null" class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="debounceConfirm">
        <p v-if="isEditOffer">{{ $t('edit-bid-offer.confirm') }}</p>
        <p v-else>{{ $t('edit-bid-offer.make-offer') }}</p>
      </el-button>
    </div>
  </base-popup>
  <!-- make offer -->
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import includes from 'lodash/includes'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepositoryV3 from '@/services/repositories/nftv3'
  import WalletRepository from '@/services/repositories/wallet'

  import firebase from '@/utils/firebase'
  import filter from 'lodash/filter'
  import { namespace } from 'vuex-class'
  import { debounce } from 'lodash'

  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const apiNftV3: NftRepositoryV3 = getRepository('nftv3')
  const apiWallet: WalletRepository = getRepository('wallet')

  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')

  @Component({
    components: {}
  })
  export default class PopupMakeOffer extends Mixins(PopupMixin, OnChainMixin) {
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('info') info!: Record<string, any>
    @bcNft.State('isEditOffer') isEditOffer!: boolean
    @bcNft.Mutation('SET_VALUE_BALANCE_AND_CURRENCY') setBalanceCurrency!: (data: Record<string, any>) => void
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Record<string, boolean>

    form: Record<string, any> = {
      yourOffer: '',
      quantity: '1',
      token: ''
    }
    tabActive: any = null
    loading: any = false
    listener: any = null
    isLoading = false
    numberRate = 0
    disableBtn = false
    checkValidate = false
    checkErrorValidate = false
    titleSuccess = ''
    checkDisableBtn = true
    errorBid = false
    errorQuanti = false
    exchangeRateRef: any = null

    ischeckEditOffer = false
    isCheckFocus = false
    rules: Record<string, any> = {
      yourOffer: [
        {
          required: false,
          message: this.$t('validate.price-not-empty'),
          trigger: 'blur'
        }
      ],
      quantity: [
        {
          required: false,
          message: this.$t('validate.quantity-not-empty'),
          trigger: 'blur'
        }
      ]
    }
    oldYourOffer = 0
    handleOpen(): void {
      // this.getProxyContract()

      if (this.isEditOffer) {
        this.form.token = this.nftItem.myLastOfferCurrency
        this.oldYourOffer = this.nftItem.myLastOfferPrice
        this.form.yourOffer = this.$options.filters?.convertAmountDecimal(this.nftItem.myLastOfferPrice, this.nftItem.myLastOfferCurrency)
      } else {
        this.form.token = this.listAcceptCurrency[0].currency
      }
    }

    async getMakeOfferOnChain(): Promise<void> {
      try {
        this.isLoading = true
        await this.validateCurrentUser()
        await this.switchNetwork(this.nftItem.baseCurrency)

        const type = this.isEditOffer ? 'offer-edit' : 'offer-make'
        const amount = Number(this.getYouPay)
        const amountOfferIncludeFee = this.oldYourOffer + (this.nftItem.myLastOfferPrice * this.info.serviceFeePercent) / 100
        const hash = await this.approveExchangeSpendTokenOfUser(this.form.token, amountOfferIncludeFee, amount, type)

        const params = {
          yourOffer: Number(this.form.yourOffer.replace(/,/g, '')),
          quantity: Number(this.form.quantity),
          itemId: this.nftItem.id,
          ownerId: this.nftItem.idOwnerOffer,
          transactionCode: hash,
          currency: this.form.token
        }
        await apiNftV3.getMakeOffer(params)
        this.isLoading = false
        // this.setStatusApproveItem('PENDING')
      } catch (error: any) {
        console.log(error)

        this.isLoading = false
        const { data } = error.response
        if (data.status === 'DONT_ACCEPT_CURRENCY') {
          let message = ''
          if (this.isEditOffer) {
            message = `${this.nftItem.itemName} ${this.$t('notify_not-support-token-full')}`
          } else {
            message = `${this.nftItem.itemName} ${this.$t('notify_not-support-token-part')}`
          }
          this.$message.error({ message, duration: 5000 })
        }
        return Promise.reject(error)
      }
    }
    async getMakeOfferOffChain(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          yourOffer: Number(this.form.yourOffer.replace(/,/g, '')),
          quantity: Number(this.form.quantity),
          itemId: this.nftItem.id,
          ownerId: this.nftItem.idOwnerOffer,
          currency: this.form.token
        }
        await apiNftV3.getMakeOffer(params)
        this.isLoading = false
      } catch (error: any) {
        this.isLoading = false
        const { data } = error.response
        if (data.status === 'DONT_ACCEPT_CURRENCY') {
          let message = ''
          if (this.isEditOffer) {
            message = `${this.nftItem.itemName} ${this.$t('notify_not-support-token-full')}`
          } else {
            message = `${this.nftItem.itemName} ${this.$t('notify_not-support-token-part')}`
          }
          this.$message.error({ message, duration: 5000 })
        }
        return Promise.reject(error)
      }
    }

    get spenderAddressExchange(): any {
      if (!this.isLogin) {
        const contract = filter(this.listNftAssetOnChain, elm => elm.type === 'EXCHANGE' && elm.isSystem && elm.baseCurrency === this.nftItem.baseCurrency)
        return contract.length ? contract[0].spenderWalletAddress : ''
      }
      return ''
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        // console.log('coin', coin)
        return coin.exchangeRate
      }
      return 0
    }
    get serviceFee() {
      return (this.info.serviceFeePercent / 100) * Number(this.form.yourOffer.replace(/,/g, ''))
    }
    get dolaSeviceFee(): number {
      return this.serviceFee * this.exchangeRateOfInputPayment
    }
    get serviceFeePercent(): number {
      if (this.info?.serviceFeePercent) {
        return this.info?.serviceFeePercent
      }
      return 0
    }
    get getYouPay() {
      // this.yourOffer =
      return Number(this.form.yourOffer.replace(/,/g, '')) * Number(this.form.quantity.replace(/,/g, '')) + this.serviceFee
    }

    get getDisableBtn(): boolean {
      // return  this.quantity == ' '
      if (this.isEditOffer) {
        return this.form.yourOffer == '' || this.checkValidate || this.errorQuanti || !this.isCheckFocus || (this.isShowCheckboxAccept && !this.checkedAccept)
      }
      return this.form.yourOffer == '' || this.checkValidate || this.errorQuanti || (this.isShowCheckboxAccept && !this.checkedAccept)
      // return this.sh
    }

    get exchangeRateOfInputPayment(): number {
      if (this.form.token && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.form.token)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get balanceUsdOfPriceNft(): number {
      return Number(this.form.yourOffer.replaceAll(',', '')) * this.exchangeRateOfInputPayment
    }

    // status: any = [
    //   {
    //     label: 'PLace a bid'
    //   },
    //   {
    //     label: 'Make offer'
    //   }
    // ]
    debounceConfirm(): void {
      this.handleConfirm(this)
    }
    handleConfirm = debounce(async _this => {
      try {
        if (_this.isLogin) {
          await _this.getMakeOfferOffChain()
        } else {
          await _this.getMakeOfferOnChain()
        }

        if (_this.isEditOffer) {
          _this.setTypeOfAction('offer-edit')
          _this.ischeckEditOffer = true
          _this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
        } else {
          _this.setTypeOfAction('offer-make')
          _this.setBalanceCurrency({ balancePay: _this.getYouPay, currency: _this.form.token })
          _this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
        }
      } catch (error: any) {
        console.log(error)

        const { data } = error.response
        let message = ''

        if (_this.isEditOffer) {
          _this.ischeckEditOffer = true
          if (data.status == 'TRANSACTION_PENDING' || data.status == 'SALE_PENDING') {
            switch (data.status) {
              case 'TRANSACTION_PENDING':
                message = (_this.nftItem.itemName + ' ' + _this.$t('notify.transaction-is-pending')) as string
                break
              case 'SALE_PENDING':
                message = (_this.nftItem.itemName + ' ' + _this.$t('notify.sale-pending')) as string
                break
            }
            if (message) {
              _this.$message.error({ message, duration: 5000 })
            }
          } else {
            _this.setOpenPopup({
              popupName: 'popup-error-edit-offer',
              isOpen: true
            })
          }
        } else {
          switch (data.status) {
            case 'TRANSACTION_PENDING':
              message = (_this.nftItem.itemName + ' ' + _this.$t('notify.transaction-is-pending')) as string
              break
            case 'SALE_PENDING':
              message = (_this.nftItem.itemName + ' ' + _this.$t('notify.sale-pending')) as string
              break
          }
          if (message) {
            _this.$message.error({ message, duration: 5000 })
          }
        }
      }
    }, 500)

    handleClose(): void {
      this.checkedAccept = false
      this.setOpenPopup({
        popupName: 'popup-make-offer',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
      this.isLoading = false
      this.form.yourOffer = ''
      this.form.quantity = '1'

      this.errorQuanti = false

      this.checkValidate = false
      this.tabActive = null
    }
    @Watch('form.yourOffer') watchyourOffer(value): void {
      //@ts-ignore
      this.$refs['ruleForm']?.clearValidate()

      if (this.isEditOffer) {
        if (value == this.$options.filters?.convertAmountDecimal(this.nftItem.myLastOfferPrice, this.nftItem.currency)) {
          this.isCheckFocus = false
        } else {
          this.isCheckFocus = true
        }
      }
    }
    @Watch('form.quantity') watchQuantity(value): void {
      //@ts-ignore
      this.$refs['ruleForm']?.clearValidate()
      if (value > this.nftItem.totalSupply) {
        this.errorQuanti = true
      }
      if (this.form.quantity === '' || value < this.nftItem.totalSupply) {
        this.errorQuanti = false
      }
      // console.log('quantity', value)
      // console.log('totalSupply', this.nftItem.totalSupply)
    }

    destroyed(): void {
      this.setOpenPopup({
        popupName: 'popup-make-offer',
        isOpen: false
      })
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form.yourOffer[type], '.')) {
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
        if (this.errorQuanti) {
          this.checkValidate = false
        }
        if (!this.errorQuanti) {
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
    //   if (this.withdraw.yourOffer.value != null) {
    //     return !(!this.errorAmount && this.withdraw.yourOffer && this.withdraw.quantity)
    //   } else {
    //     return !(!this.errorAmount && this.withdraw.yourOffer)
    //   }
    // }
    getIcon(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : ''
    }
    async handleSelectTokenPayment(token: string): Promise<void> {
      this.form.yourBid = ''
      let available = 0

      let info: Record<string, any> = {}
      const params = {
        listingId: this.nftItem?.minListingId,
        itemId: this.nftItem.id,
        ownerId: this.nftItem.ownerId
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
  }
</script>

<style lang="scss" scoped>
  ::v-deep.popup-make-offer {
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
          top: 40px;
          right: 12px;
          line-height: 24px;
          color: #5b616e;
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
    justify-content: flex-end;
    button {
      max-width: 100px;
      font-size: 16px !important;
      line-height: 24px !important;
    }
    .btn {
      max-width: 120px;
      width: 100%;
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
      background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
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
  @media (max-width: 768px) {
    ::v-deep.popup-make-offer {
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
          }
          .add-funds {
            margin: 0px 0 24px;
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
  }
</style>
