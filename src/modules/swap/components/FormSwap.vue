<template>
  <div class="content">
    <h3 class="mb-24 text-2xl text-bold uppercase">Buy {{ coinMain === 'LYNK' ? 'LYNK' : 'CLM' }}</h3>
    <el-form :model="form" class="form-buy-lyn">
      <el-form-item class="list-wallet" :label="$t('label.buy-from')">
        <el-select v-model="form.currency" class="w-100" @change="handleSelectWallet">
          <el-option v-for="wallet in listWallet" :key="wallet.id" :value="wallet.symbol" :label="wallet.name">
            <template>
              <div class="be-flex wallet-item">
                <base-icon :icon="wallet.icon" size="24" />
                <span class="d-ib" style="margin-left: 10px">{{ wallet.name }}</span>
              </div>
            </template>
          </el-option>
          <div class="suffix" slot="prefix">
            <base-icon :icon="getIcon" size="24" />
          </div>
        </el-select>
      </el-form-item>
      <el-form-item class="mb-1">
        <el-input
          :placeholder="$t('placeholder.amount')"
          v-model="amount"
          @keypress.native="onlyNumber($event, 'amount')"
          @keyup.native="numberFormat($event)"
          @input="handleEnterAmount"
        />
        <div class="prefix prefix--amount">
          <span>{{ form.currency }}</span>
        </div>
        <div class="be-flex jc-space-between w-100" slot="label">
          <span>{{ $t('label.pay-amount') }}</span>
          <span
            >{{ $t('withdraw.available') }}: <span :class="'amount-' + form.currency">{{ available | convertAmountDecimal(form.currency) }} {{ form.currency }}</span></span
          >
        </div>
      </el-form-item>
      <div class="be-flex jc-space-between mb-24 tab-amount">
        <div class="text-base cursor amount-item" v-for="tab in tabAmount" :key="tab" :class="tab === tabActive ? 'active' : null" @click="handleSelectTab(tab)">
          <span>{{ tab }}%</span>
        </div>
      </div>
      <el-form-item>
        <el-input placeholder="Receive..." v-model="receive" @keypress.native="onlyNumber($event, 'receive')" @keyup.native="numberFormat($event)" @input="handleEnterReceive" />
        <div class="prefix prefix--amount">
          <span style="color: #5b616e">{{ coinMain === 'LYNK' ? 'LYNK' : 'CLM' }}</span>
        </div>
        <div class="be-flex jc-space-between w-100" slot="label">
          <span>{{ $t('label.receive') }}</span>
          <span style="color: #605e5c">1 {{ form.currency }} = {{ convertCurrencyToCoinMain | convertAmountDecimal(this.coinMain) }} {{ coinMain }} </span>
        </div>
      </el-form-item>
      <el-button
        :loading="isLoading"
        :class="getDisableBtn ? 'btn--disabled btn-default-bg text-bold btn-h48 w-100 btn' : 'btn-default-bg text-bold btn-h48 w-100 btn'"
        class="is-none-border"
        style="font-size: 16px"
        type="button"
        @click="handleConfirm"
      >
        Buy {{ coinMain === 'LYNK' ? 'LYNK' : 'CLM' }}
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'

  import filter from 'lodash/filter'
  import includes from 'lodash/includes'
  import getRepository from '@/services'
  import WalletRepository from '@/services/repositories/wallet'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  import Decimal from 'decimal.js'
  const beBase = namespace('beBase')
  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')

  const apiWallet: WalletRepository = getRepository('wallet')

  interface IFormSwap {
    currency: string
    amount: string
    receive: string | number
    [x: string]: any
  }

  @Component
  export default class FormSwap extends Vue {
    @beBase.State('coinMain') coinMain!: string

    @bcAuth.State('user') user!: Record<string, any>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    tabAmount: number[] = [25, 50, 75, 100]
    tabActive: any = null

    form: IFormSwap = {
      currency: 'BTC',
      amount: '',
      receive: ''
    }

    amount = ''
    receive = ''
    originAmount = ''
    originReceive = ''
    available = 0
    isLoading = false
    walletDetailLYN: any = {}

    listWallet: Array<Record<string, any>> = [
      {
        id: 0,
        name: 'Bitcoin Wallet',
        symbol: 'BTC',
        icon: 'icon-btc'
      },
      {
        id: 1,
        name: 'Ethereum Wallet',
        symbol: 'ETH',
        icon: 'icon-eth'
      },
      {
        id: 2,
        name: 'Tether Wallet',
        symbol: 'USDT',
        icon: 'icon-usdt',
        disabled: true
      },
      {
        id: 3,
        name: 'USDC Wallet',
        symbol: 'USDC',
        icon: 'icon-usdc',
        disabled: true
      },
      {
        id: 4,
        name: 'BNB Wallet',
        symbol: 'BNB',
        icon: 'icon-bnb',
        disabled: true
      },
      {
        id: 5,
        name: 'BUSD Wallet',
        symbol: 'BUSD',
        icon: 'icon-busd',
        disabled: true
      }
    ]

    get getIcon(): string {
      const rs = filter(this.listWallet, (elm: Record<string, any>) => elm.symbol === this.form.currency)[0]
      return rs?.icon
    }

    get exchangeRateCoinMain(): number {
      if (this.listExchangeRate.length) {
        const token = filter(this.listExchangeRate, elm => elm.currency === this.coinMain)
        return token.length ? token[0].exchangeRate : 0
      }
      return 0
    }

    get exchangeRateCurrencySelect(): number {
      if (this.listExchangeRate.length) {
        const token = filter(this.listExchangeRate, elm => elm.currency === this.form.currency)
        return token.length ? token[0].exchangeRate : 0
      }
      return 0
    }

    get convertCurrencyToCoinMain(): string {
      if (this.exchangeRateCoinMain) {
        return new Decimal(this.exchangeRateCurrencySelect).div(this.exchangeRateCoinMain).toString()
      }
      return '0'
    }
    get convertCoinMainToCurrency(): string {
      if (this.exchangeRateCurrencySelect) {
        return new Decimal(this.exchangeRateCoinMain).div(this.exchangeRateCurrencySelect).toString()
      }
      return '0'
    }

    get getDisableBtn(): boolean {
      return !Number(this.originReceive) || !Number(this.originAmount) || !this.available
    }

    @Watch('exchangeRateCoinMain') watchExchangeRateCoinMain(): void {
      if (this.originAmount && this.originReceive) {
        const decimalAmount = new Decimal(this.originReceive).mul(this.convertCoinMainToCurrency).toString()
        this.amount = this.$options.filters?.convertAmountDecimal(decimalAmount, this.form.currency)
        this.originAmount = decimalAmount
      }
    }
    @Watch('exchangeRateCurrencySelect') watchExchangeRateCurrencySelect(): void {
      if (this.originAmount && this.originReceive) {
        const decimalAmount = new Decimal(this.originAmount).mul(this.convertCurrencyToCoinMain).toString()
        this.receive = this.$options.filters?.convertAmountDecimal(decimalAmount, this.coinMain)
        this.originReceive = decimalAmount
      }
    }

    async created(): Promise<void> {
      this.walletDetailLYN = await apiWallet.getMyWallet({ currency: this.coinMain })
      this.handleSelectWallet('BTC')
    }

    async handleSelectWallet(source: string): Promise<void> {
      try {
        const availableCurrency = await apiWallet.getMyWallet({ currency: source })
        this.tabActive = null
        this.available = availableCurrency[0].assetBalances.availableBalance
      } catch (error) {
        console.log(error)
      }
    }

    async handleConfirm(): Promise<void> {
      try {
        this.isLoading = true
        const body = {
          tokenCurrency: this.coinMain,
          tokenAmount: this.originReceive,
          tokenUsdExchangeRate: this.exchangeRateCoinMain,
          paidCurrency: this.form.currency,
          paidAmount: this.originAmount,
          paidUsdExchangeRate: this.exchangeRateCurrencySelect
        }
        await apiWallet?.swapToken(body)
        const message: any = this.$t('buy-lyn.success')
        this.$message.success({ message, duration: 5000 })
        this.handleSelectWallet(this.form.currency)
        this.tabActive = null
        this.amount = ''
        this.receive = ''
        this.originReceive = '0'
        this.originAmount = '0'
        this.isLoading = false
        this.$forceUpdate()
        this.$emit('success')
      } catch (error) {
        this.isLoading = false
      }
    }

    handleEnterAmount(value: string): void {
      this.tabActive = null
      const _amount = Number(value.replaceAll(',', ''))
      if (parseFloat(value) > 0) {
        const decimalAmount = new Decimal(_amount).mul(this.convertCurrencyToCoinMain).toString()
        this.receive = this.$options.filters?.convertAmountDecimal(decimalAmount, this.coinMain)
        this.originReceive = decimalAmount
        this.originAmount = _amount.toString()
      } else {
        this.receive = '0'
        this.originAmount = '0'
        this.originReceive = '0'
      }
    }

    handleEnterReceive(value: string): void {
      this.tabActive = null
      const _amount = Number(value.replaceAll(',', ''))
      if (_amount > 0) {
        const decimalAmount = new Decimal(_amount).mul(this.convertCoinMainToCurrency).toString()
        this.amount = this.$options.filters?.convertAmountDecimal(decimalAmount, this.form.currency)
        this.originAmount = decimalAmount
        this.originReceive = _amount.toString()
      } else {
        this.amount = '0'
        this.originAmount = '0'
        this.originReceive = '0'
      }
    }

    handleSelectTab(tab: number): void {
      if (this.tabActive === tab) {
        this.tabActive = null
        this.amount = ''
        this.receive = ''
        this.originReceive = '0'
        this.originAmount = '0'
      } else {
        this.tabActive = tab
        //calc amount
        const amount = new Decimal(tab).mul(this.available).div(100).toString()
        this.amount = this.$options.filters?.convertAmountDecimal(amount, this.form.currency)
        this.originAmount = amount
        // calc receive
        const receive = new Decimal(amount).mul(this.convertCurrencyToCoinMain).toString()
        this.receive = this.$options.filters?.convertAmountDecimal(receive, this.coinMain)
        this.originReceive = receive
      }
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
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
  }
</script>

<style scoped lang="scss">
  .content {
    flex: 1;
    // margin-right: 24px;
    background: #fff;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    padding: 24px;
    border-radius: 4px;

    .prefix {
      position: absolute;
      z-index: 10;
    }
    .prefix--camera,
    .prefix--amount {
      right: 13px;
      top: 41%;
    }

    .tab-amount {
      .amount-item {
        padding: 4px 0;
        flex: 1;
        text-align: center;
        margin-right: 8px;
        background-color: #f3f2f1;
        border-radius: 4px;
        border: 1px solid transparent;
        color: #605e5c;
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
    .btn-h48 {
      height: 48px;
    }
    .btn {
      font-size: 16px !important;
    }
  }
</style>
