<template>
  <base-popup name="popup-buy-nft" class="popup-buy-nft payment-more-token" width="600px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('buy-nft.title-popup') }}</p>
    </div>
    <div class="content">
      <el-form :model="form" :rules="rules" ref="ruleForm" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <div class="nft-header6 mb-24 description">
          <p>
            {{ $t('buy-nft.you-want') }} <span style="color: #0a0b0d" class="text-semibold">{{ nftItem.itemName }}</span> {{ $t('buy-nft.from') }}
            <span style="color: #0a0b0d" class="text-semibold">{{ info.sellerName }}</span>
          </p>
        </div>

        <el-form-item :label="$t('label_payment-by')" prop="payment">
          <el-select v-model="form.token" class="w-100 select-token-payment" :class="listAcceptCurrencyBuy.length == 1 ? 'hidden-suffix' : ''" @change="handleSelectTokenPayment">
            <el-option class="wallet-option" v-for="token in listAcceptCurrencyBuy" :key="token.id" :value="token.currency" :label="token.currencyName">
              <template>
                <div class="be-flex h-100 wallet-item">
                  <div class="icon-circle" v-if="token.currency === 'LYNK' || token.currency === 'CLM'">
                    <base-icon :icon="getIcon(token.currency)" size="24" />
                  </div>
                  <base-icon v-else :icon="getIcon(token.currency)" size="24" />
                  <div class="be-flex wallet-item__detail">
                    <span class="d-ib wallet-item__detail-currency">{{ shortStringMobile(getFullnameCurrency(token.currency), 17) }}</span>
                    <span class="d-ib wallet-item__detail-discount text-error" v-if="(token.discountType === 'PERCENT' && token.discountPercent) || token.discountAmount">
                      {{ getDiscount(token) }}
                    </span>
                  </div>
                </div>
              </template>
            </el-option>
            <div class="suffix" slot="prefix">
              <base-icon class="d-iflex" :icon="getIcon(form.token)" size="24" />
            </div>
            <div class="discount-detail" slot="prefix">
              <span class="text-base text-regular">{{ shortStringMobile(getFullnameCurrency(form.token), 23) }}</span>
              <span class="text-error text-xs" v-if="getDiscountValue(form.token)">{{ `${getDiscountValue(form.token)}` }}</span>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('buy-nft.quantity')" prop="quantity" :class="errorQuantity ? 'is-error' : null">
          <el-input
            :placeholder="$t('placeholder.quantity')"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.quantity"
            @keypress.native="onlyNumber($event)"
            @keyup.native="numberFormat($event)"
          />
          <div v-if="errorQuantity" class="error">{{ $t('buy-nft.error-quantity') }} {{ info.listingQuantity }}</div>
        </el-form-item>

        <el-form-item class="price">
          <el-input :class="getDiscountValue(form.token) ? 'discount-avai' : ''" disabled :value="getPriceNftWithDiscount | convertAmountDecimal(form.token, false, true)" />
          <div class="nft-body-small all-price" :class="getDiscountValue(form.token) ? 'discount-avai' : ''">
            <span class="text-desc text-regular text-line-through" v-if="getDiscountValue(form.token)">{{ getPriceNft | convertAmountDecimal(form.token) }} {{ form.token }}</span>
            <span class="text-base text-regular price-with-discount">{{ getPriceNftWithDiscount | convertAmountDecimal(form.token) }} {{ form.token }}</span>
          </div>
          <div class="nft-body-small exchange" :class="getDiscountValue(form.token) ? 'discount-avai' : ''">~${{ balanceUsdOfPriceNft | convertAmountDecimal('USD') }}</div>
          <div class="be-flex jc-space-between w-100" slot="label">
            <span>{{ $t('label_price-of-nft') }}</span>
            <span
              >{{ $t('label_available') }}: <span :class="'amount-' + form.token">{{ info.available | convertAmountDecimal(form.token) }} {{ form.token }}</span></span
            >
          </div>
        </el-form-item>

        <el-form-item class="fee" :label="`${$t('buy-nft.fees')} (${$options.filters.convertAmountDecimal(serviceFeePercent, 'PERCENT')}%)`">
          <el-input disabled :value="serviceFeeWithDiscount | convertAmountDecimal(form.token, false, true)" />
          <div class="nft-body-small exchange">~${{ balanceExchangeRate | convertAmountDecimal('USD') }}</div>
        </el-form-item>

        <div class="notification-warning" v-if="balancePayWithDiscount > info.available && !errorQuantity">
          <div class="flex">
            <img src="../../../../assets/images/nft/icon-warning.png" alt="" />
            <span class="title-error text-base text-semibold">{{ $t('detail-nft.popup-checkout.went-wrong') }}</span>
          </div>
          <div class="content-error text-body-small text-regular text-desc">
            <span> {{ $t('detail-nft.popup-checkout.error-surplus') }}</span>
          </div>
          <router-link :to="{ name: 'Wallet' }" class="router_center router_setting" style="text-decoration: none">
            <div class="text-semibold text-base text-hyperlink cursor be-flex align-center">
              <span> {{ $t('buy-nft.add-funds-now') }}</span>
              <base-icon v-if="coinMain === 'LYNK'" icon="icon-arrow-right" class="d-iflex" size="24" style="padding-left: 2px" />
              <base-icon v-else icon="icon-arrow-right-clm" class="d-iflex" size="24" style="padding-left: 2px" />
            </div>
          </router-link>
        </div>
      </el-form>
      <div class="form-footer">
        <!-- <div class="be-flex jc-flex-end" v-if="getDiscountValue(form.token)">
          <p class="text-desc text-regular text-line-through">{{ balancePay | convertAmountDecimal(form.token) }} {{ form.token }}</p>
          <p class="ml-1 text-error">{{ ` (${getDiscountValue(form.token)})` }}</p>
        </div> -->
        <div class="be-flex jc-space-between nft-header6 text-semibold mb-24 pay">
          <p>{{ $t('buy-nft.will-pay') }}</p>
          <div class="pay-right">
            <p>{{ balancePayWithDiscount | convertAmountDecimal(form.token) }} {{ form.token }}</p>
            <p class="nft-body-small text-desc text-regular" style="float: right">~${{ (balancePayWithDiscount * exchangeRateOfInputPayment) | convertAmountDecimal('USD') }}</p>
          </div>
        </div>
      </div>

      <el-form>
        <el-form-item :label="$t('buy-nft.ref-code')" prop="refUserCode">
          <el-input :placeholder="$t('placeholder.ref-code')" autocomplete="new-password" :readonly="false" v-model="form.refUserCode" />
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
    </div>

    <div slot="footer" class="footer">
      <div class="wrap-button">
        <button class="btn-default mr-15 text-regular btn-h40" @click="handleCancel">
          <p>{{ $t('button.cancel') }}</p>
        </button>
        <el-button
          :loading="isLoading"
          :class="getDisableSubmit ? 'btn--disabled' : null"
          class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme"
          @click="debounceConfirm"
          >{{ $t('button.confirm') }}</el-button
        >
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import Moralis from 'moralis'
  import filter from 'lodash/filter'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import WalletRepository from '@/services/repositories/wallet'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepositoryV3 from '@/services/repositories/nftv3'

  import { debounce } from 'lodash'

  import eventBus from '@/utils/eventBus'

  import Web3 from 'web3'

  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')

  const apiNft: NftRepository = getRepository('nft')
  const apiWallet: WalletRepository = getRepository('wallet')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const apiNftV3: NftRepositoryV3 = getRepository('nftv3')

  @Component({ components: {} })
  export default class PopupBuyNft extends Mixins(PopupMixin, OnChainMixin) {
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('info') info!: Record<string, any>
    @bcNft.State('listExchangeRate') listExchangeRate!: Record<string, any>

    @bcNft.Mutation('SET_VALUE_BALANCE_AND_CURRENCY') setBalanceCurrency!: (data: Record<string, any>) => void

    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Array<Record<string, any>>

    isLoading = false
    form: Record<string, any> = {
      quantity: '0',
      token: '',
      refUserCode: ''
    }
    errorQuantity = false

    rules: Record<string, any> = {
      quantity: [
        {
          required: true,
          message: this.$t('validate.quantity-not-empty'),
          trigger: 'blur'
        }
      ]
      // refUserCode: [
      //   {
      //     required: true,
      //     message: this.$t('validate.ref-code-not-empty'),
      //     trigger: 'blur'
      //   }
      // ]
    }
    @Watch('form.quantity') watchQuantity(): void {
      //@ts-ignore
      this.$refs['ruleForm']?.clearValidate()
      if (this.form.quantity === '') {
        this.errorQuantity = false
      } else {
        this.errorQuantity = Number(this.form.quantity.replaceAll(',', '')) > this.info.listingQuantity
      }
    }

    get listAssetNetworkBaseEth(): Array<Record<string, any>> {
      return filter(this.listAssetNetwork, elm => elm.currency !== 'BNB' && elm.currency !== 'BUSD' && elm.currency !== 'BTC')
    }

    get getDisableSubmit(): boolean {
      return this.errorQuantity || this.balancePayWithDiscount > this.info.available || this.form.quantity === '0' || (this.isShowCheckboxAccept && !this.checkedAccept)
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get serviceFeePercent(): number {
      return this.info?.serviceFeePercent || 0
    }

    get serviceFee(): number {
      return (this.getPriceNft * this.serviceFeePercent) / 100
    }
    get serviceFeeWithDiscount(): number {
      return (this.getPriceNftWithDiscount * this.serviceFeePercent) / 100
    }
    get serviceFeeWei(): number {
      return (this.getPriceNftWei * this.serviceFeePercent) / 100
    }

    get balanceExchangeRate(): number {
      return this.serviceFeeWithDiscount * this.exchangeRateOfInputPayment
    }

    get balancePay(): number {
      return this.getPriceNft + this.serviceFee
    }
    get balancePayWei(): number {
      const decimal = this.$options.filters?.getDecimalsToken(this.form.token)
      const pay = Number((this.getPriceNftWei + this.serviceFeeWei) * Math.pow(10, decimal))
      return Number(pay.toFixed())
    }

    get balancePayWithDiscountWei(): number {
      const decimal = this.$options.filters?.getDecimalsToken(this.form.token)
      const pay = this.balancePayWithDiscount * Math.pow(10, decimal)
      return Number(pay.toFixed())
    }

    get exchangeRateOfInputPayment(): number {
      if (this.form.token && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.form.token)[0]
        return coin.exchangeRate
      }
      return 0
    }
    get getPriceNft(): number {
      return ((this.nftItem.minListingPrice * this.exchangeRate) / this.exchangeRateOfInputPayment) * Number(this.form.quantity.replaceAll(',', ''))
    }
    get getPriceNftWithDiscount(): number {
      let value = 0
      this.listAcceptCurrencyBuy.forEach(elm => {
        if (elm.currency === this.form.token) {
          let { discountPercent, discountAmount, discountType } = elm
          if (discountType === 'PERCENT' && discountPercent > 0) {
            value =
              ((this.nftItem.minListingPrice * this.exchangeRate * ((100 - discountPercent) / 100)) / this.exchangeRateOfInputPayment) *
              Number(this.form.quantity.replaceAll(',', ''))
          } else if (discountType === 'AMOUNT') {
            value =
              (((this.nftItem.minListingPrice - this.getDiscountAmount(discountAmount, this.nftItem.currency)) * this.exchangeRate) / this.exchangeRateOfInputPayment) *
              Number(this.form.quantity.replaceAll(',', ''))
          } else {
            value = this.getPriceNft
          }
        }
      })
      return value
    }

    get getPriceNftWei(): number {
      const decimal = this.$options.filters?.getDecimalsToken(this.nftItem.currency)
      const minListingPriceWei = this.nftItem.minListingPriceWei / Math.pow(10, decimal)
      return ((minListingPriceWei * this.exchangeRate) / this.exchangeRateOfInputPayment) * Number(this.form.quantity.replaceAll(',', ''))
    }

    get balanceUsdOfPriceNft(): number {
      return this.getPriceNftWithDiscount * this.exchangeRateOfInputPayment
    }

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.nftItem?.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    get contractAddressExchange(): any {
      if (!this.isLogin) {
        const contract = filter(this.listNftAssetOnChain, elm => elm.type === 'EXCHANGE' && elm.isSystem && elm.baseCurrency === this.nftItem.baseCurrency)
        return contract.length ? contract[0].contractAddress : ''
      }
      return ''
    }
    get hotWalletExchange(): any {
      if (!this.isLogin) {
        const contract = filter(this.listNftAssetOnChain, elm => elm.type === 'EXCHANGE' && elm.isSystem && elm.baseCurrency === this.nftItem.baseCurrency)
        return contract.length ? contract[0].hotWalletAddress : ''
      }
      return ''
    }

    get getTerm(): string {
      if (this.systemParamsPublic.length) {
        const param = filter(this.systemParamsPublic, param => param.key === 'system.marketplace.terms.and.conditions')
        return (param[0] && param[0].value) || ''
      }
      return ''
    }

    getDiscountValue(payment: string): string {
      let token = { ...this.listAcceptCurrencyBuy.filter(elm => elm.currency === payment)[0] }
      let labelDiscount = this.$t('label_discount')
      let { discountPercent, discountAmount, discountType, currency } = token
      if (discountType === 'PERCENT' && discountPercent > 0) {
        return `${labelDiscount} ${discountPercent}%`
      } else if (discountType === 'AMOUNT') {
        let exchangeRateOfToken = 0
        if (this.listExchangeRate.length) {
          const coin = filter(this.listExchangeRate, elm => elm.currency === currency)[0]
          exchangeRateOfToken = coin.exchangeRate
        }
        let discountAmountValue = (this.getDiscountAmount(discountAmount, this.nftItem.currency) * this.exchangeRate) / exchangeRateOfToken
        return `${labelDiscount} ${this.$options.filters?.convertAmountDecimal(discountAmountValue, currency)} ${currency}`
      }
      return ''
    }

    get balancePayWithDiscount(): number {
      let price = this.getPriceNftWithDiscount + this.serviceFeeWithDiscount
      return price
    }

    getDiscount(token: Record<string, any>): string {
      let labelDiscount = this.$t('label_discount')
      let { discountPercent, discountAmount, discountType, currency } = token
      if (discountType === 'PERCENT' && discountPercent > 0) {
        return `${labelDiscount} ${discountPercent}%`
      } else if (discountType === 'AMOUNT') {
        let exchangeRateOfToken = 0
        if (this.listExchangeRate.length) {
          const coin = filter(this.listExchangeRate, elm => elm.currency === currency)[0]
          exchangeRateOfToken = coin.exchangeRate
        }
        let discountAmountValue = (this.getDiscountAmount(discountAmount, this.nftItem.currency) * this.exchangeRate) / exchangeRateOfToken
        return `${labelDiscount} ${this.$options.filters?.convertAmountDecimal(discountAmountValue, currency)} ${currency}`
      }
      return ''
    }

    getDiscountAmount(discountAmountWei: number, currency: string): number {
      let weiNumber = this.$options.filters?.getDecimalsToken(currency)
      return discountAmountWei / Math.pow(10, weiNumber)
    }

    handleOpen(): void {
      this.form.token = this.currencySelectBuy
      this.form.quantity = '1'
    }
    handleClose(): void {
      //@ts-ignore
      this.$refs['ruleForm']?.clearValidate()

      this.checkedAccept = false
      this.form.quantity = '0'!
      this.form.refUserCode = ''
      this.errorQuantity = false
      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
    }

    debounceConfirm(): void {
      this.handleConfirm(this)
    }

    handleConfirm = debounce(_this => {
      if (_this.isLogin) {
        _this.buyOffChain()
      } else {
        _this.buyOnChain()
      }
      eventBus.$emit('reload-list-owner')
    }, 500)
    // handleConfirm() {
    //   console.log('this', this)
    //   // console.log('_this2', _this)
    //   if (this.isLogin) {
    //     this.buyOffChain()
    //   } else {
    //     this.buyOnChain()
    //   }
    // }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-buy-nft',
        isOpen: false
      })
    }

    async buyOffChain(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          serviceFee: this.serviceFee,
          percentRoyaltiesFee: this.nftItem.creatorFee,
          usdExchangeRate: this.exchangeRateOfInputPayment,
          itemId: this.nftItem.id,
          ownerId: this.nftItem.ownerIdMinPrice,
          quantity: Number(this.form.quantity.replaceAll(',', '')),
          listingId: this.nftItem.minListingId,
          currency: this.form.token,
          refUserCode: this.form.refUserCode
        }
        await apiNftV3.buyNft(params)
        this.isLoading = false
        this.setTypeOfAction('buy')
        this.setBalanceCurrency({ balancePay: this.balancePayWithDiscount, currency: this.form.token })
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
        // let message = this.$t('notify.buy-nft-success') as string
        // this.$message.success({ message, duration: 5000 })
        // this.closePopup()
      } catch (error) {
        console.log('>>> / file: PopupBuyNft.vue / line 430 / error', error)
        this.isLoading = false
      }
    }
    async buyOnChain(): Promise<void> {
      try {
        this.isLoading = true
        await this.validateCurrentUser()
        await this.switchNetwork(this.nftItem.baseCurrency)

        const infoActivity = await apiNft.getLynkeyInfo(this.nftItem.currency, { listingId: this.nftItem?.minListingId })
        if (infoActivity.listingQuantity < Number(this.form.quantity.replaceAll(',', ''))) {
          let message = this.$t('notify.quantity-not-enough') as string
          this.$message.error({ message, duration: 5000 })
          this.setInfoActivity({ ...this.info, listingQuantity: infoActivity.listingQuantity })
          return
        }
        const data = {
          listingId: this.nftItem.minListingId,
          quantity: Number(this.form.quantity.replaceAll(',', '')),
          currency: this.form.token,
          usdExchangeRate: this.exchangeRateOfInputPayment,
          refUserCode: this.form.refUserCode
        }
        const initBuy = await apiNftV3.buyNft(data)
        // await Moralis.enableWeb3()
        const receiver = this.contractAddressExchange
        // const pay = this.$options.filters?.convertAmountDecimal(this.balancePay, this.form.token) as string
        // const _pay = Number(pay.replaceAll(',', ''))
        const contractAddress = this.getContractAddressOfCurrency(this.form.token)
        const decimal = this.$options.filters?.getDecimalsToken(this.form.token)

        if (this.typeLogin === 'BINANCE') {
          await this.buyOnchainBinance(this.balancePayWithDiscountWei, decimal, receiver, contractAddress, initBuy)
        } else {
          await this.buyOnChainInterNal(this.balancePayWithDiscountWei, decimal, receiver, contractAddress, initBuy)
        }

        this.isLoading = false

        this.setTypeOfAction('buy')
        this.setBalanceCurrency({ balancePay: this.balancePayWithDiscount, currency: this.form.token })
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
        // let message = this.$t('notify.buy-nft-success') as string
        // this.$message.success({ message, duration: 5000 })
        // this.closePopup()
      } catch (error: any) {
        this.isLoading = false
        if (error.code === 'NETWORK_ERROR') {
          this.buyOnChain()
        }
      }
    }

    async buyOnchainBinance(pay: number, decimal: number, receiver: string, contractAddress: string, initBuy: Record<string, any>): Promise<void> {
      try {
        const BinanceChain = window.BinanceChain

        const web3 = new Web3(BinanceChain)

        // const originPay: string = initBuy.totalPaid

        const payHex = '0x' + initBuy.totalHex

        if (this.form.token === 'BNB' || this.form.token === 'ETH') {
          const params = [
            {
              from: this.walletAddress,
              to: receiver,
              gasPrice: '0x45D964B800',
              value: payHex
            }
          ]
          console.log(params)

          const hash = await BinanceChain.request({
            method: 'eth_sendTransaction',
            params
          })

          const data = {
            id: initBuy.id,
            transactionCode: hash,
            transactionType: initBuy.transactionType
          }
          await apiNftV2.confirmTransaction(data)

          return Promise.resolve()
        } else {
          const contractAddress = this.getContractAddressOfCurrency(this.form.token)

          const abi = await this.getAbiCode(this.form.token)

          const NameContract = new web3.eth.Contract(abi, contractAddress)

          const transaction = await NameContract.methods.transfer(receiver, payHex).send({
            from: this.walletAddress
          })

          const data = {
            id: initBuy.id,
            transactionCode: transaction.transactionHash,
            transactionType: initBuy.transactionType
          }
          await apiNftV2.confirmTransaction(data)
          return Promise.resolve()
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }

    async buyOnChainInterNal(pay: number, decimal: number, receiver: string, contractAddress: string, initBuy: Record<string, any>): Promise<void> {
      try {
        /*
         * method Moralis.transfer không dùng được với token ERC-20 trên mobile nên sẽ dùng web3
         */

        const originPay: string = initBuy.totalPaid

        if (this.form.token === 'BNB' || this.form.token === 'ETH') {
          const options: Record<string, any> = {
            type: this.form.token === 'ETH' || this.form.token === 'BNB' ? 'native' : 'erc20',
            amount: originPay,
            receiver
          }

          if (this.form.token !== 'ETH' && this.form.token !== 'BNB') {
            options.contractAddress = contractAddress
          }
          //@ts-ignore
          let transaction = await Moralis.transfer(options)
          const data = {
            id: initBuy.id,
            transactionCode: transaction.hash,
            transactionType: initBuy.transactionType
          }
          await apiNftV2.confirmTransaction(data)
        } else {
          //@ts-ignore
          const web3 = new Web3(window.ethereum)

          const abi = await this.getAbiCode(this.form.token)

          const gasPrice = await web3.eth.getGasPrice()

          const NameContract = new web3.eth.Contract(abi, contractAddress, {
            from: this.walletAddress,
            gasPrice
          })

          // const payHex = web3.utils.numberToHex(originPay)

          const payHex = '0x' + initBuy.totalHex

          const gasLimit = await NameContract.methods.transfer(receiver, payHex).estimateGas({ from: this.walletAddress })

          const transaction = await NameContract.methods.transfer(receiver, payHex).send({
            from: this.walletAddress,
            gas: gasLimit,
            gasPrice: gasPrice
          })

          const data = {
            id: initBuy.id,
            transactionCode: transaction.transactionHash,
            transactionType: initBuy.transactionType
          }
          await apiNftV2.confirmTransaction(data)
        }

        return Promise.resolve()
      } catch (error) {
        console.log(error)

        return Promise.reject(error)
      }
    }

    closePopup(): void {
      this.setOpenPopup({
        popupName: 'popup-buy-nft',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-payment-method',
        isOpen: false
      })
    }

    onlyNumber(event: KeyboardEvent): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if (keyCode < 48 || keyCode > 57 || keyCode === 46) {
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
    destroyed(): void {
      this.setOpenPopup({
        popupName: 'popup-buy-nft',
        isOpen: false
      })
    }

    getIcon(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : ''
    }

    getFullnameCurrency(currency: string): string {
      let token = filter(this.listAcceptCurrencyBuy, el => {
        return el.currency === currency
      })[0]
      return `${token?.currencyName} (${token?.currency})`
    }
    shortStringMobile(str: string, length: number): string {
      if (!this.isDesktop && str.length > length) return `${str.substring(0, length)}...`
      return str
    }

    async handleSelectTokenPayment(token: string): Promise<void> {
      let available = 0
      let result: Record<string, any> = {}
      const params = {
        listingId: this.nftItem.minListingId
      }
      if (this.isLogin) {
        result = await apiNft.getLynkeyInfo(token, params)
        available = result.available
        // const result = await apiWallet.getMyWallet({ currency: token })
        // available = result[0].assetBalances.availableBalance
      } else {
        let contractOfToken = ''
        if (this.listAssetNetwork.length) {
          const tokenLynk = filter(this.listAssetNetwork, elm => elm.currency === token)[0]
          contractOfToken = tokenLynk?.contractAddress || ''
        }

        available = await this.getBalance(token)
        result = await apiNft.getLynkeyInfo(token, params)
      }
      this.setInfoActivity({ ...result, available })
    }
  }
</script>

<style scoped lang="scss">
  // ::v-deep.hidden-suffix {
  //   .el-input__suffix {
  //     visibility: hidden;
  //   }
  // }
  ::v-deep.popup-buy-nft {
    .footer {
      .btn {
        font-size: 16px !important;
        font-weight: 600;
      }
      .btn-default {
        font-size: 16px !important;
        font-weight: 600;
        color: #5b616e;
      }
    }
    .el-dialog {
      &__body {
        color: var(--bc-text-market-primary-nft);

        .popup-content {
          .content {
            .el-form {
              .description {
                color: #5b616e;
                word-break: break-word;
              }
              &-item.fee {
                .el-form-item__content {
                  .el-input__inner {
                    color: var(--bc-text-market-primary-nft);
                  }
                  .exchange {
                    color: #5b616e;
                    position: absolute;
                    top: 40px;
                    right: 8px;
                  }
                }
              }
              &-item.price {
                .el-form-item__content {
                  .el-input__inner {
                    color: transparent !important;
                  }
                  .all-price {
                    position: absolute;
                    top: 40px;
                    left: 8px;
                    .price-with-discount {
                      margin-left: 10px;
                    }
                  }
                  .exchange {
                    color: #5b616e;
                    position: absolute;
                    top: 40px;
                    right: 8px;
                  }
                }
              }
              .error {
                color: var(--bc-required);
                font-size: 12px;
                line-height: 16px;
                font-weight: 400;
                margin-top: 8px;
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
              .select-token-payment {
                .el-input__inner {
                  padding-left: 45px;
                  text-transform: capitalize;
                  color: transparent !important;
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

                .discount-detail {
                  position: absolute;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: center;
                  color: var(--bc-form-input);
                  height: 100%;
                  width: 280px;
                  left: 33px;
                  word-break: break-word;
                  @media (max-width: 768px) {
                    width: 210px !important;
                  }
                }
              }
              .select-token-payment.hidden-suffix {
                .el-input__suffix {
                  visibility: hidden;
                }
              }

              .form-footer {
                .balance {
                  margin-bottom: 12px;
                }
              }
            }
          }
        }
      }
      &__footer {
        padding: 0 24px 12px;
        border-top: none;
        .popup-footer {
          .footer {
            .wrap-button {
              padding: 12px 24px 0;
              border-top: 1px solid #dbdbdb;
              margin: 0 -24px;
            }
          }
        }
      }
    }
  }
  .el-select-dropdown__item.wallet-option {
    min-height: 66px;
    &.hover {
      background-clip: content-box !important;
    }
    .span-icon {
      margin-left: 0px;
    }
    &.selected::after {
      top: 12px !important;
      right: 20px !important;
    }
    &:last-child .wallet-item {
      border-bottom: none !important;
    }
    .wallet-item {
      display: flex;
      border-bottom: 1px solid #dbdbdb;
      align-items: center;
      .wallet-item__detail {
        flex-direction: column;
        margin-left: 12px;

        .wallet-item__detail-currency {
          font-size: 16px;
          line-height: 24px;
        }
        .wallet-item__detail-discount {
          font-size: 12px;
          line-height: 16px;
          background: none !important;
          -webkit-text-fill-color: unset !important;
        }
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-buy-nft {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .popup-content {
          .el-form {
            &-item.price {
              .el-form-item__content {
                .el-input__inner {
                  color: transparent !important;
                }
                .all-price {
                  position: absolute;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  top: auto !important;
                  bottom: 0;
                  left: 15px !important;
                  margin-left: 0 !important;
                  height: 48px;
                  .price-with-discount {
                    margin-left: 0 !important;
                  }
                }
                .exchange {
                  position: absolute;
                  display: flex;
                  align-items: center;
                  height: 48px;
                  color: #5b616e;
                  top: auto !important;
                  bottom: 0;
                  right: 8px;
                }

                .discount-avai {
                  .el-input__inner {
                    height: 60px;
                  }
                }

                .discount-avai.all-price {
                  height: 60px;
                }
                .discount-avai.exchange {
                  height: unset !important;
                  margin-bottom: 8px;
                }
              }
            }
          }
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
            color: #0a0b0d !important;
          }
          .text-desc {
            font-size: 14px;
            line-height: 20px;
          }
          .input-bid {
            margin-top: 16px;
          }
        }
        .form-footer {
          .balance {
            margin-bottom: 12px;
          }
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
