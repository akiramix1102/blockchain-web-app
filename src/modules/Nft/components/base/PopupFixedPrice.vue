<template>
  <base-popup name="popup-fixed-price" class="popup-fixed-price" width="600px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('put-on-sale.title-popup') }}</p>
    </div>
    <div class="content">
      <el-form :model="form" :rules="rules" ref="ruleForm" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <div class="mb-24 description">
          <p class="text-desc nft-body-base">
            {{ $t('put-on-sale.des') }}
          </p>
        </div>

        <el-form-item class="price" :label="$t('put-on-sale.price')" prop="price">
          <el-input
            :placeholder="$t('placeholder.price')"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.price"
            @keypress.native="onlyNumber($event, 'price')"
            @keyup.native="numberFormat($event)"
          />
          <!-- <div class="nft-body-small text-desc exchange">{{ nftItem.currency }}</div> -->
          <div class="nft-body-small text-desc exchange">~${{ priceExchangeRate | convertAmountDecimal('USD') }}</div>
          <div v-if="errorPrice" class="error">{{ $t('put-on-sale.error-price') }} {{ minPrice }} {{ nftItem.currency }}</div>
        </el-form-item>
        <el-form-item prop="address" style="color: red" class="label-send-invite">
          <el-select v-model="valuePaymentOption" multiple placeholder="">
            <el-option class="payment-dropdown__item" v-for="(item, index) in listCurrencies" :key="index" :label="item.currencyName" :value="item.currency">
              <template>
                <div class="be-flex align-center h-100">
                  <div class="icon-circle" v-if="item.currency === 'LYNK' || item.currency === 'CLM'">
                    <base-icon :icon="getIcon(item.currency)" size="24" />
                  </div>
                  <base-icon v-else :icon="getIcon(item.currency)" size="24" />
                  <div class="be-flex-column ml-1">
                    <span class="d-ib text-base">{{ `${item.currencyName} (${item.currency})` }} </span>
                    <div class="d-ib text-xs" v-if="getRootDiscountOfCurrency(item.currency)">
                      <p class="d-ib text-error">
                        {{ getRootDiscountOfCurrency(item.currency) }}
                      </p>
                      <p class="d-ib text-xs text-desc ml-1">{{ getDiscountOfCurrency(item.currency) }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </el-option>
          </el-select>
          <div class="be-flex align-center jc-space-between w-100 label" slot="label">
            <div class="payment-option-label left">{{ $t('acceppt-payment-option') }}</div>
            <div class="advanced-setting-label be-flex jc-flex-end right cursor">
              <p class="text-hyperlink text-overflow-1" @click="handleAdvancedSetting">
                {{ $t('label_advanced-setting') }}
              </p>
            </div>
          </div>
        </el-form-item>

        <el-form-item class="fee">
          <el-input disabled :value="royaltiesFee | convertAmountDecimal(nftItem.currency, false, true)" />
          <div class="nft-body-small text-desc exchange">~${{ royaltiesFeeUsd | convertAmountDecimal('USD') }}</div>
          <div class="be-flex align-center jc-space-between w-100 label" slot="label">
            <div class="left">{{ $t('put-on-sale.roy-fees') }} ({{ nftItem.creatorFee | convertAmountDecimal('PERCENT') }}%)</div>
            <div class="be-flex jc-flex-end right">
              <p class="text-overflow-1">
                <span class="text-desc">{{ $t('put-on-sale.to') }}</span> {{ info.creatorName }}
              </p>
            </div>
          </div>
        </el-form-item>

        <el-form-item class="fee" :label="`${$t('put-on-sale.fees')} (${$options.filters.convertAmountDecimal(serviceFeePercent, 'PERCENT')}%)`">
          <el-input disabled :value="serviceFee | convertAmountDecimal(nftItem.currency, false, true)" />
          <div class="nft-body-small text-desc exchange">~${{ serviceFeeUsd | convertAmountDecimal('USD') }}</div>
        </el-form-item>

        <el-form-item v-if="nftItem.totalSupply > 1" class="copies">
          <el-input
            v-model="form.quantity"
            :placeholder="$t('placeholder.quantity')"
            autocomplete="new-password"
            :readonly="false"
            @keypress.native="onlyNumber($event, 'price')"
            @keyup.native="numberFormat($event)"
          />
          <div class="be-flex align-center jc-space-between w-100 label" slot="label">
            <div class="left">{{ $t('put-on-sale.copies') }}</div>
            <div class="right">
              {{ $t('put-on-sale.available') }}: <span class="text-bg">{{ nftItem.myQuantity | formatNumber }} {{ $t('put-on-sale.editions') }}</span>
            </div>
          </div>
          <div v-if="errorQuantity" class="error">{{ $t('put-on-sale.error-copies') }} {{ nftItem.myQuantity | formatNumber }}</div>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <div class="be-flex jc-space-between align-center nft-header6 text-semibold mb-24 pay">
          <span>{{ $t('put-on-sale.will-pay') }}</span>
          <span class="editon">
            {{ balancePay | convertAmountDecimal(nftItem.currency) }} {{ nftItem.currency }}
            <span v-if="nftItem.totalSupply > 1"> / {{ $t('put-on-sale.edition') }}</span>
          </span>
        </div>
      </div>
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
    </div>

    <div slot="footer" class="footer">
      <button class="cancel-btn btn-default mr-15 text-regular btn-h40" @click="handleCancel">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button
        :loading="isLoading"
        :class="getDisableSubmit ? 'btn--disabled' : null"
        class="btn-confirm is-none-border cursor btn-h40 btn-default-bg btn-theme"
        @click="debounceConfirm"
        >{{ $t('button.confirm') }}</el-button
      >
    </div>
    <popup-setup-discount
      :arrCurrency="listCurrenciesAvailable"
      @getAdvancedSettingsData="getAdvancedSettingsData"
      @removeValuePaymentOption="removeValuePaymentOption"
      :currencyAcceptListPreset="currencyAcceptList"
    />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import firebase from '@/utils/firebase'

  import PopupSetupDiscount from './PopupSetupDiscount.vue'

  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import filter from 'lodash/filter'
  import includes from 'lodash/includes'
  import { forEach } from 'lodash'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import { debounce } from 'lodash'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepositoryV3 from '@/services/repositories/nftv3'
  import EventBus from '@/utils/eventBus'

  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')

  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const apiNftV3: NftRepositoryV3 = getRepository('nftv3')

  @Component({ components: { PopupSetupDiscount } })
  export default class PopupFixedPrice extends Mixins(PopupMixin, OnChainMixin) {
    @bcNft.State('nftItem') nftItem!: Record<string, any>

    @bcNft.State('listNftAsset') listNftAsset!: Array<Record<string, any>>

    // @bcAuth.State('user') user!: Record<string, any>
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Record<string, boolean>
    @bcNft.State('listCurrencies') listCurrencies!: Array<Record<string, any>>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    isLoading = false
    form: Record<string, any> = {
      quantity: '1',
      price: ''
    }
    info: Record<string, any> = {}
    myProfileNft: Record<string, any> = {}
    errorQuantity = false
    errorPrice = false
    minPrice = 0

    exchangeRateRef: any = null
    timing: any = null

    valuePaymentOption: Array<string> = []
    currencyAcceptList: Array<Record<string, any>> = []

    rules: Record<string, any> = {
      quantity: [
        {
          required: true,
          message: this.$t('validate.quantity-not-empty'),
          trigger: 'blur'
        }
      ]
    }

    getRootDiscountOfCurrency(currency: string): string {
      let token = this.currencyAcceptList.filter(el => el.currency === currency)[0]
      let labelDiscount = this.$t('label_discount')
      let discount = token?.discount
      let discountType = token?.discountType
      if (discountType === 'PERCENT' && discount > 0) {
        return `${labelDiscount} ${discount}%`
      } else if (discountType === 'AMOUNT' && discount > 0) {
        return `${labelDiscount} ${this.$options.filters?.convertAmountDecimal(discount, this.nftItem.currency)} ${this.nftItem.currency}`
      }
      return ''
    }
    getDiscountOfCurrency(currency: string): string {
      let token = this.currencyAcceptList.filter(el => el.currency === currency)[0]
      let discount = token?.discount
      let discountType = token?.discountType
      if ((discountType === 'PERCENT' && discount > 0) || currency === this.nftItem.currency) {
        return ''
      } else if (discountType === 'AMOUNT' && discount > 0) {
        let exchangeRateOfToken = 0
        if (this.listExchangeRate.length) {
          const coin = filter(this.listExchangeRate, elm => elm.currency === currency)[0]
          exchangeRateOfToken = coin.exchangeRate
        }
        let discountAmountValue = (discount * this.exchangeRate) / exchangeRateOfToken
        return `(~${this.$options.filters?.convertAmountDecimal(discountAmountValue, currency)} ${currency})`
      }
      return ''
    }
    getIcon(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : ''
    }

    @Watch('form.quantity') watchQuantity(): void {
      //@ts-ignore
      // this.$refs['ruleForm']?.clearValidate()
      if (this.form.quantity === '') {
        this.errorQuantity = false
      } else {
        this.errorQuantity = Number(this.form.quantity.replaceAll(',', '')) > this.nftItem.myQuantity
      }
    }

    @Watch('valuePaymentOption') watchValuePaymentOption(): void {
      // let currencyAcceptListUpdate: Array<Record<string, any>> = []
      // add payment method
      forEach(this.valuePaymentOption, payment => {
        let rs = !this.currencyAcceptList.find(objElm => objElm.currency === payment)
        rs
          ? this.currencyAcceptList.push({
              currency: payment,
              discount: 0,
              discountType: 'PERCENT'
            })
          : false
      })
      let currencyAcceptListUpdate = this.currencyAcceptList.filter(elm => includes(this.valuePaymentOption, elm.currency))
      this.currencyAcceptList = [...currencyAcceptListUpdate]
    }

    get getDisableSubmit(): boolean {
      if (this.nftItem.totalSupply > 1) {
        return (
          this.form.price === '' ||
          this.form.quantity === '' ||
          this.form.quantity === '0' ||
          this.errorQuantity ||
          this.valuePaymentOption.length === 0 ||
          (this.isShowCheckboxAccept && !this.checkedAccept)
        )
      }
      return this.form.price === '' || this.valuePaymentOption.length === 0 || (this.isShowCheckboxAccept && !this.checkedAccept)
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }
    get priceExchangeRate(): number {
      return Number(this.form.price.replaceAll(',', '')) * this.exchangeRate
    }

    get royaltiesFee(): number {
      return (Number(this.form.price.replaceAll(',', '')) * this.nftItem.creatorFee) / 100
    }

    get royaltiesFeeUsd(): number {
      return this.royaltiesFee * this.exchangeRate
    }

    get serviceFeePercent(): number {
      if (this.info?.serviceFeePercent) {
        return this.info?.serviceFeePercent
      }
      return 0
    }
    get serviceFee(): number {
      return (Number(this.form.price.replaceAll(',', '')) * this.serviceFeePercent) / 100
    }
    get serviceFeeUsd(): number {
      return this.serviceFee * this.exchangeRate
    }

    get balancePay(): number {
      if (this.nftItem.creatorId === this.myProfileNft.id) {
        return Number(this.form.price.replaceAll(',', '')) - this.serviceFee
      } else {
        return Number(this.form.price.replaceAll(',', '')) - (Number(this.form.price.replaceAll(',', '')) * (this.serviceFeePercent + this.nftItem.creatorFee)) / 100
      }
    }

    get spenderWallet(): string {
      if (this.nftItem.contractAddress && !this.isLogin) {
        const spender = filter(this.listNftAsset, elm => elm.type === 'NFT').filter(elm => elm.contractAddress === this.nftItem.contractAddress)[0]
        return spender.spenderWalletAddress
      }
      return ''
    }

    get listCurrenciesAvailable(): Array<Record<string, any>> {
      let arrCurrency: Array<Record<string, any>> = []
      arrCurrency = this.listCurrencies.filter(elm => {
        return this.valuePaymentOption.includes(elm.currency)
      })
      return arrCurrency
    }

    @Watch('statusApproveAccount') async handleWatchStatusApproveAccount(status: string): Promise<void> {
      console.log('watch statusApproveAccount', status)

      try {
        if (status === 'SUCCESS' && this.isOpenPopup && this.isClickConfirm) {
          const quantity = this.nftItem.totalSupply > 1 ? Number(this.form.quantity.replaceAll(',', '')) : 1
          const data = {
            itemId: this.nftItem.id,
            newPrice: Number(this.form.price.replaceAll(',', '')),
            quantity,
            saleType: 'BUY',
            fromDate: null,
            toDate: null,
            // receiveCurrencies: this.valuePaymentOption.join(','),
            currencyAcceptList: this.currencyAcceptList
          }
          await apiNftV3.fixedPrice(data)
          this.isLoading = false
          this.setOpenPopup({
            popupName: 'popup-fixed-price',
            isOpen: false
          })
          this.$emit('success', 'put-fixed')
          return
        }
        if (status === 'FAILED' && this.isOpenPopup && this.isClickConfirm) {
          this.isLoading = false
          this.isClickConfirm = false
          this.offFirebase()
          this.setStatusApproveAccount('NONE')
          const message = this.$t('notify.status-approve-failed') as string
          this.$message.error({ message, duration: 5000 })
        }
      } catch (error: any) {
        this.offFirebase()
        this.setStatusApproveAccount('NONE')
        this.isLoading = false
        const { data, status } = error.response.data
        if (status === 'LESS_MIN_PRICE') {
          this.errorPrice = true
          this.minPrice = data.minPrice
        }
      }
    }

    async handleOpen(): Promise<void> {
      forEach(this.listCurrencies, elm => {
        if (elm) {
          this.valuePaymentOption.push(elm?.currency)
        }
      })
      this.currencyAcceptList.length = 0
      this.valuePaymentOption.map(payment => {
        this.currencyAcceptList.push({
          currency: payment,
          discount: 0,
          discountType: 'PERCENT'
        })
      })
      this.isOpenPopup = true
      this.form.price = ''

      this.info = await apiNft.getLynkeyInfo(this.nftItem.currency, { itemId: this.nftItem.id })
      this.myProfileNft = await apiNft.getMyProfileNft()
      this.errorQuantity = Number(this.form.quantity.replaceAll(',', '')) > this.nftItem.myQuantity
    }

    handleClose(): void {
      this.offFirebase()
      this.setStatusApproveAccount('NONE')
      this.checkedAccept = false
      this.isClickConfirm = false
      this.isOpenPopup = false
      this.valuePaymentOption = []

      this.form.quantity = '1'
      this.form.price = ''
      this.errorPrice = false
      this.errorQuantity = false
      this.isLoading = false
      clearTimeout(this.timing)
    }
    debounceConfirm = debounce(() => {
      this.handleConfirm()
    }, 500)

    async handleConfirm(): Promise<void> {
      try {
        this.isLoading = true
        this.errorPrice = false
        const quantity = this.nftItem.totalSupply > 1 ? Number(this.form.quantity.replaceAll(',', '')) : 1
        const data = {
          itemId: this.nftItem.id,
          newPrice: Number(this.form.price.replaceAll(',', '')),
          quantity,
          saleType: 'BUY',
          fromDate: null,
          toDate: null,
          // receiveCurrencies: this.valuePaymentOption.join(','),
          currencyAcceptList: this.currencyAcceptList
        }
        if (this.isLogin || (!this.isLogin && !this.nftItem.contractAddress)) {
          await apiNftV3.fixedPrice(data)
          this.isLoading = false
          this.setOpenPopup({
            popupName: 'popup-fixed-price',
            isOpen: false
          })
          this.$emit('success', 'put-fixed')
        } else {
          this.isClickConfirm = true
          await this.validateCurrentUser()
          await this.switchNetwork(this.nftItem.baseCurrency)
          if (await this.checkApprovedForAll(this.nftItem.contractAddress, this.spenderWallet, this.nftItem.currency)) {
            await apiNft.validateApprove({}, { itemId: this.nftItem.id })
            this.handleGetApproveAccount()
          } else {
            await this.putOnSaleOnChain(data, this.nftItem.contractAddress, this.spenderWallet, 'popup-fixed-price', this.nftItem.currency)
          }
        }
        EventBus.$emit('reload-list-owner')
      } catch (error: any) {
        this.isLoading = false
        console.log(error.response.data)

        this.offFirebase()
        this.setStatusApproveAccount('NONE')
        const { data, status } = error.response.data
        if (status === 'LESS_MIN_PRICE') {
          this.errorPrice = true
          this.minPrice = data.minPrice
        }
        if (status === 'INVALID_DISCOUNT') {
          const message = this.$t('notify.invalid-discount') as string
          this.$message.error({ message, duration: 5000 })
        }
      }
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-fixed-price',
        isOpen: false
      })
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form[type], '.')) {
        event.preventDefault()
      }
    }

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }

    handleAdvancedSetting(): void {
      this.setOpenPopup({
        popupName: 'popup-setting-discount',
        isOpen: true
      })
    }

    getAdvancedSettingsData(currencyAcceptListWithoutId: Array<Record<string, any>>): void {
      // update new data
      if (currencyAcceptListWithoutId.length > this.valuePaymentOption.length) {
        this.valuePaymentOption = currencyAcceptListWithoutId.map(elm => elm.currency)
      }
      this.currencyAcceptList.length = 0
      this.currencyAcceptList = [...currencyAcceptListWithoutId]

      this.valuePaymentOption.forEach(payment => {
        if (!this.currencyAcceptList.find(el => el.currency === payment)) {
          this.currencyAcceptList.push({
            currency: payment,
            discount: '0',
            discountType: 'PERCENT'
          })
        }
      })
    }

    removeValuePaymentOption(currency: string): void {
      this.valuePaymentOption = this.valuePaymentOption.filter(elm => elm !== currency)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-fixed-price {
    .copies {
      .right {
        color: #605e5c;
      }
    }
    .footer {
      .btn-confirm {
        font-size: 16px;
        font-weight: 600;
        padding: 8px 20px !important;
        line-height: 16px !important;
        font-weight: 600;
        border-radius: 6px;
        outline: none;
        cursor: pointer;
        background: var(--bc-theme-primary-gradient);
        color: var(--bc-color-white);
        &:hover {
          color: var(--bc-color-white);
          background: var(--bc-theme-primary-gradient-hover);
        }
        &:focus {
          color: var(--bc-color-white);
          background: var(--bc-theme-primary-gradient);
        }
      }
      .cancel-btn {
        p {
          font-size: 16px;
          font-weight: 600;
          color: #5b616e;
        }
      }
    }
    .el-dialog {
      &__body {
        color: var(--bc-text-market-primary-nft);

        .popup-content {
          .content {
            .el-form {
              .description {
                word-break: break-word;
              }
              &-item.fee,
              &-item.price {
                .el-form-item__content {
                  .el-input__inner {
                    color: var(--bc-text-market-primary-nft);
                  }
                  .exchange {
                    position: absolute;
                    top: 40px;
                    right: 8px;
                  }
                }
              }
              &-item.fee {
                .left {
                  width: 50%;
                }
                .right {
                  flex: 1;
                  text-align: right;
                }
              }
              .label-send-invite {
                .right {
                  position: relative;
                  z-index: 2;
                }
              }
              .error {
                position: absolute;
                position: absolute;
                color: var(--bc-required);
                font-size: 12px;
                margin-top: -10px;
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
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-fixed-price {
      .el-dialog {
        width: 335px !important;
        &__body {
          .payment-option-label {
            font-size: 14px;
            line-height: 20px;
          }
          .advanced-setting-label {
            font-size: 12px;
            line-height: 16px;
          }
        }
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
          .el-tag--small {
            line-height: 20px !important;
          }
          .el-tag {
            font-size: 14px !important;
          }
        }
        .form-footer {
          .pay {
            display: inline !important;
            margin-bottom: 16px !important;
          }
          .editon {
            display: flex;
            justify-content: flex-end;
            align-items: center;
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
          .cancel-btn {
            p {
              font-size: 14px;
              line-height: 20px;
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
