<template>
  <base-popup :open="handleOpen" :close="handleClose" name="popup-edit-fee" class="popup-edit-fee" width="480px">
    <div slot="title">
      <span>{{ $t('withdraw.title-popup-fee') }}</span>
    </div>
    <div class="content" v-loading="loading">
      <el-form :model="form" :rules="rules" ref="edit-fee" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <div class="nft-body-base text-desc mb-24 break-word">{{ $t('withdraw.title-edit-fee') }}</div>
        <div class="be-flex jc-space-between mb-24 tab-amount">
          <div
            class="text-base cursor amount-item"
            v-for="(tab, index) in tabAmount"
            :key="index"
            :class="tab.key === tabActive ? 'active' : null"
            @click="handleSelectTab(tab.key)"
          >
            <span>{{ $t(`withdraw.${tab.title}`) }}</span>
          </div>
        </div>
        <el-form-item :label="$t('withdraw.gas-price')" prop="gasPrice">
          <el-input
            :placeholder="$t('placeholder.gas-price')"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.gasPrice"
            @keypress.native="onlyNumber($event, 'gasPrice')"
            @keyup.native="numberFormat($event)"
          />
        </el-form-item>
        <el-form-item :label="$t('withdraw.gas-limit')" prop="gasLimit">
          <el-input
            :placeholder="$t('placeholder.gas-limit')"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.gasLimit"
            @keypress.native="onlyNumber($event, 'gasLimit')"
            @keyup.native="numberFormat($event)"
          />
        </el-form-item>

        <div class="be-flex jc-space-between total-fee">
          <div class="text-base text-semibold title">{{ $t('withdraw.fee') }}</div>
          <div class="text-right total">
            <div class="text-base text-semibold">{{ getTransactionFee }} {{ baseCurrency }}</div>
            <span class="body-small text-desc">~${{ exchangeRate }}</span>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-default mr-15 text-regular btn-h40" @click="handleCancel">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button :class="getDisableSubmit ? 'btn--disabled' : null" class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="handleSubmit">{{
        $t('button.save')
      }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import includes from 'lodash/includes'
  import filter from 'lodash/filter'
  @Component
  export default class PopupEditFee extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Number, default: 0 }) baseCurrencyExchangeRate!: number
    @Prop({ required: false, type: Number, default: 0 }) currentExchangeRate!: number
    @Prop({ required: false, type: Array, default: () => [] }) listGasTracker!: Array<Record<string, any>>
    @Prop({ required: false, type: Array, default: () => [] }) listAssetNetwork!: Array<Record<string, any>>
    @Prop({ required: false, type: String, default: () => '' }) currency!: string
    tabActive = 'proposeGasPrice'
    tabActiveOld = 'proposeGasPrice'
    tabAmount: Array<Record<string, any>> = [
      { id: 0, title: 'low', key: 'safeGasPrice' },
      { id: 1, title: 'medium', key: 'proposeGasPrice' },
      { id: 2, title: 'high', key: 'fastGasPrice' }
    ]
    loading = false
    isSubmit = false
    form: Record<string, any> = {
      gasPrice: '',
      gasLimit: ''
    }
    formOld: Record<string, any> = {
      gasPrice: '',
      gasLimit: ''
    }

    rules: Record<string, any> = {
      gasPrice: [
        {
          required: true,
          message: this.$t('validate.gas-price-required'),
          trigger: 'blur'
        }
      ],
      gasLimit: [
        {
          required: true,
          message: this.$t('validate.gas-limit-required'),
          trigger: 'blur'
        }
      ]
    }

    get getDisableSubmit(): boolean {
      return !(this.form.gasPrice && this.form.gasLimit)
    }

    get baseCurrency(): string {
      return includes(['ETH', 'LYNK', 'CLM', 'USDT', 'USDC'], this.currency) ? 'ETH' : 'BNB'
    }

    get getTransactionFee(): string {
      const gasPrice = +this.form.gasPrice.replaceAll(',', '')
      const gasLimit = +this.form.gasLimit.replaceAll(',', '')
      return this.$options.filters?.convertAmountDecimal((gasPrice * gasLimit) / Math.pow(10, 9), this.baseCurrency)
    }

    get exchangeRate(): string {
      const fee = +this.getTransactionFee.replaceAll(',', '')
      return this.$options.filters?.convertAmountDecimal(this.baseCurrencyExchangeRate * fee, 'USD')
    }

    @Watch('listGasTracker', {
      immediate: true,
      deep: true
    })
    handleWatchGasTracker(): void {
      this.handleFillGas()
    }

    @Watch('listAssetNetwork', {
      immediate: true,
      deep: true
    })
    handleWatchAssetNetWork(): void {
      this.handleFillGas()
    }

    @Watch('form.gasPrice') watchGasPrice(amount: string): void {
      if (amount === '') {
        this.tabActive = ''
      }
    }
    @Watch('form.gasLimit') watchGasLimit(amount: string): void {
      if (amount === '') {
        this.tabActive = ''
      }
    }

    handleOpen(): void {
      this.formOld = { ...this.form }
      this.tabActiveOld = this.tabActive
      // this.tabActive = 'proposeGasPrice'
      this.handleFillGas()
    }

    handleReset(): void {
      this.tabActive = 'proposeGasPrice'
      this.isSubmit = false
    }

    handleClose(): void {
      if (this.isSubmit) {
        this.form = { ...this.formOld }
        this.tabActive = this.tabActiveOld
      } else {
        this.tabActive = 'proposeGasPrice'
      }
      //@ts-ignore
      this.$refs['edit-fee'].clearValidate()
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-edit-fee',
        isOpen: false
      })
    }

    handleFillGas(): void {
      if (this.tabActive === '') return
      const coinType = includes(['ETH', 'LYNK', 'CLM', 'USDT', 'USDC'], this.currency) ? 'ETH' : 'BSC'
      if (this.listGasTracker.length && this.currency !== 'BTC') {
        const gasPrice = filter(this.listGasTracker, elm => elm.network === coinType)[0][this.tabActive]
        this.form.gasPrice = this.$options.filters?.formatNumber(gasPrice)
      }
      if (this.listAssetNetwork.length) {
        const gasLimit = filter(this.listAssetNetwork, elm => elm.currency === this.currency)[0].gasLimit
        this.form.gasLimit = this.$options.filters?.formatNumber(gasLimit)
      }
    }

    handleSelectTab(key: string): void {
      //@ts-ignore
      this.$refs['edit-fee'].clearValidate()
      if (this.tabActive === key) {
        this.tabActive = ''
        this.form.gasPrice = ''
        this.form.gasLimit = ''
      } else {
        this.tabActive = key
        this.handleFillGas()
      }
    }

    handleSubmit(): void {
      this.tabActiveOld = this.tabActive
      this.formOld = { ...this.form }
      this.isSubmit = true
      this.$emit('editFee', this.form)
      this.setOpenPopup({
        popupName: 'popup-edit-fee',
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
        this.tabActive = ''
        _event.target.value = fnumber
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-edit-fee {
    .el-form {
      .tab-amount {
        .amount-item {
          padding: 4px 0;
          flex: 1;
          text-align: center;
          margin-right: 8px;
          background: #f3f2f1;
          border-radius: 4px;
          border: 1px solid transparent;
          &:last-child {
            margin-right: 0;
          }
          &:hover {
            border: 1px solid var(--bc-tab-buy-border);
            // color: var(--bc-text-tab-buy);
            background: var(--bc-text-tab-buy);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .active {
          background: var(--bc-tab-active);
          color: #fff;
          &:hover {
            color: #fff !important;
            background: var(--bc-tab-active);
            -webkit-text-fill-color: initial;
          }
        }
      }

      .total-fee {
        padding-bottom: 24px;
        color: var(--bc-text-primary);
      }
    }
    .btn-theme {
      background: var(--bc-tab-active);
    }
  }
  @media screen and (max-width: 768px) {
    ::v-deep.popup-edit-fee {
      .el-dialog {
        width: 335px !important;

        &__header {
          .title {
            font-weight: 600 !important;
            font-size: 16px;
            line-height: 24px;
          }
        }

        &__body {
          .popup-content {
            padding: 24px 20px 0 20px;
          }
        }
      }
    }
  }
</style>
