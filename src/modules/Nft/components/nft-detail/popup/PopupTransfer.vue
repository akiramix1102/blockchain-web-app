<template>
  <base-popup name="popup-transfer-nft" class="popup-transfer-nft" width="600px" :open="handleOpen" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.pop-transfer.title') }}</p>
    <div class="content">
      <div class="text-content mb-24">
        <span
          ><p>{{ $t('detail-nft.pop-transfer.content') }}</p></span
        >
      </div>
      <el-form ref="ruleForm" :model="form" :rules="rules" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <el-form-item v-if="nftItem.myRemainQuantity > 1" :label="$t('buy-nft.quantity')" prop="quantity" :class="errorQuantity ? 'is-error' : null">
          <el-input
            :placeholder="$t('detail-nft.pop-transfer.quantity')"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.quantity"
            clearable
            @keypress.native="onlyNumber($event)"
            @keyup.native="numberFormat($event)"
          />
          <div v-if="errorQuantity" class="error">{{ $t('buy-nft.error-quantity') }} {{ nftItem.myRemainQuantity }}</div>
        </el-form-item>
        <el-form-item class="transfer-address" prop="recipientAddress">
          <el-input
            :placeholder="$t('label_type-address-transfer', { currency: nftItem.baseCurrency })"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.recipientAddress"
          />
          <div class="prefix prefix--camera cursor" @click="handleScanAddress">
            <base-icon icon="icon-scan" size="24" />
          </div>
          <div class="address-label" slot="label">
            <span class="symbol">{{ $t('withdraw.address') }}</span>
          </div>
          <div class="prefix prefix--icon">
            <base-icon :icon="getIcon" size="24" />
          </div>
        </el-form-item>
        <el-form-item class="fee" :label="$t('buy-nft.fees')">
          <el-input disabled :value="serviceFee | convertAmountDecimal(nftItem.currency, false, true)" />
          <div class="nft-body-small exchange">~${{ fee | convertAmountDecimal('USD') }}</div>
        </el-form-item>
        <el-form-item v-if="info.pinEnable === 1" :label="$t('detail-nft.pop-transfer.pin')" class="pin-code" prop="pin">
          <el-input v-model="form.pin" class="input pin-input" maxlength="4" autocomplete="new-password" :type="showPass == true ? 'text' : 'password'" />
          <div class="icon-show-pass" @click="showPass = !showPass">
            <base-icon class="show-pass" :icon="showPass == true ? 'icon-eye-off' : 'icon-eye'" size="22" />
          </div>
        </el-form-item>
        <!-- 
        <div class="notification-warning" v-if="false">
          <div class="flex">
            <img src="../../../../assets/images/nft/icon-warning.png" alt="" />
            <span class="title-error text-base text-semibold">{{ $t('detail-nft.popup-checkout.went-wrong') }}</span>
          </div>
          <div class="content-error text-body-small text-regular text-desc">
            <span> {{ $t('detail-nft.popup-checkout.error-surplus') }}</span>
          </div>
          <router-link :to="{ name: 'Wallet' }" class="router_center router_setting" style="text-decoration: none">
            <div class="text-semibold text-base text-hyperlink cursor">
              {{ $t('buy-nft.add-funds-now') }} <img src="../../../../assets/images/nft/arrow-right.png" style="margin-left: 7px" alt="" />
            </div>
          </router-link>
        </div> -->
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <button class="btn-default mr-15 text-semibold btn-h40" @click="closePopup">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button
        :class="getDisableSubmit ? 'btn--disabled' : null"
        :loading="isLoading"
        class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme"
        @click="handleConfirm"
        >{{ $t('button.confirm') }}</el-button
      >
    </div>
    <popup-scan-address v-if="isScan" @scan="handleCompleteScanAddress" @close="isScan = false" />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import PopupScanAddress from '@/modules/home/components/popup/PopupScanAddress.vue'

  import firebase from '@/utils/firebase'
  import filter from 'lodash/filter'
  import debounce from 'lodash/debounce'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'

  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  import Moralis from 'moralis'
  import Web3 from 'web3'

  import NftRepositoryV2 from '@/services/repositories/nftv2'

  @Component({ components: { PopupScanAddress } })
  export default class PopupTransfer extends Mixins(PopupMixin, OnChainMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>

    @bcNft.State('listNftAsset') listNftAsset!: Array<Record<string, any>>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    showPass = false
    form = {
      quantity: '',
      recipientAddress: '',
      pin: ''
    }
    fee = 0
    isScan = false
    errorQuantity = false
    isLoading = false
    isWrongAddress = false
    info: Record<string, any> = {}

    timing: any = null

    rules: Record<string, any> = {
      recipientAddress: [
        {
          required: true,
          message: this.$t('validate.receive-address-not-empty'),
          trigger: 'blur'
        }
      ],
      pin: [
        {
          required: true,
          message: this.$t('validate.pin-code-not-empty'),
          trigger: 'blur'
        }
      ]
    }

    get getIcon(): string {
      return this.nftItem?.baseCurrency ? `icon-${this.nftItem.baseCurrency.toLowerCase()}` : ''
    }

    get getDisableSubmit(): boolean {
      if (!this.isWrongAddress) {
        if (this.info.pinEnable) {
          if (this.nftItem.myRemainQuantity > 1) {
            return !(this.form.quantity && this.form.recipientAddress && this.form.pin && !this.errorQuantity)
          } else {
            console.log('test', !(this.form.recipientAddress && this.form.pin && !this.errorQuantity))
            return !(this.form.recipientAddress && this.form.pin && !this.errorQuantity)
          }
        } else {
          if (this.nftItem.myRemainQuantity > 1) {
            return !(this.form.quantity && this.form.recipientAddress && !this.errorQuantity)
          } else {
            return !(this.form.recipientAddress && !this.errorQuantity)
          }
        }
      } else {
        return this.isWrongAddress
      }
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get serviceFee(): number {
      return this.fee / this.exchangeRate
    }

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.nftItem.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    get spenderWallet(): string {
      if (this.nftItem.contractAddress && !this.isLogin) {
        const spender = filter(this.listNftAsset, elm => elm.type === 'NFT').filter(elm => elm.contractAddress === this.nftItem.contractAddress)[0]
        return spender.spenderWalletAddress
      }
      return ''
    }

    @Watch('form.quantity') watchQuantity(): void {
      //@ts-ignore
      this.$refs['ruleForm']?.fields.find(f => f.prop == 'quantity').clearValidate()
      if (this.form.quantity === '') {
        this.errorQuantity = false
      } else {
        this.errorQuantity = Number(this.form.quantity.replaceAll(',', '')) > this.nftItem.myRemainQuantity
      }
    }
    @Watch('form.pin') watchPin(): void {
      //@ts-ignore
      this.$refs['ruleForm']?.fields.find(f => f.prop == 'pin').clearValidate()
    }
    @Watch('form.recipientAddress') watchAddress(value: string): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      this.handleFillAddress(_this, value)
      //@ts-ignore
      this.$refs['ruleForm']?.fields.find(f => f.prop == 'recipientAddress').clearValidate()
    }

    @Watch('statusApproveAccount') async handleWatchStatusApproveAccount(status: string): Promise<void> {
      try {
        if (status === 'SUCCESS' && this.isOpenPopup && this.isClickConfirm) {
          this.buyOnChain()
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
      } catch (error) {
        console.log('loi', error)

        this.isLoading = false
        this.offFirebase()
        this.setStatusApproveAccount('NONE')
      }
    }

    handleOpen(): void {
      this.isOpenPopup = true
      this.getDetailInfo()
    }

    handleClose(): void {
      this.offFirebase()
      this.setStatusApproveAccount('NONE')
      this.isClickConfirm = false
      this.isOpenPopup = false
      //@ts-ignore
      this.$refs['ruleForm']?.clearValidate()
      this.errorQuantity = false
      this.form = {
        quantity: '',
        recipientAddress: '',
        pin: ''
      }
      this.fee = 0
      this.isLoading = false
      clearTimeout(this.timing)
    }

    closePopup(): void {
      this.setOpenPopup({
        popupName: 'popup-transfer-nft',
        isOpen: false
      })
    }

    async getDetailInfo(): Promise<void> {
      try {
        this.info = await apiNft.getLynkeyInfo(this.nftItem.currency)
      } catch (error) {
        console.log(error)
      }
    }

    handleFillAddress = debounce(async (_this: any, value: string) => {
      console.log('258')
      if (value) {
        try {
          const result = await apiNft.validateAddress({ address: value, currency: _this.nftItem.currency })
          this.isWrongAddress = false
          _this.fee = +result.value
          this.handleWrongAdd(false)
        } catch (error) {
          console.log('abc')
          this.handleWrongAdd(true)
        }
      } else {
        _this.fee = 0
      }
    }, 500)

    async buyOffChain(): Promise<void> {
      //@ts-ignore
      this.$refs['ruleForm']?.validate(async valid => {
        if (valid) {
          try {
            this.isLoading = true
            const quantity = this.nftItem.myRemainQuantity === 1 ? 1 : Number(this.form.quantity.replaceAll(',', ''))
            const pin = this.info.pinEnable ? this.$options.filters?.encryptPassword(this.form.pin) : null
            const data = {
              itemId: this.nftItem.id,
              receiverAddress: this.form.recipientAddress,
              quantity,
              pin,
              usdExchangeRate: this.exchangeRate
            }
            await apiNftV2.transferNft(data)
            this.isLoading = false
            this.setTypeOfAction('transfer-nft')
            this.setOpenPopup({
              popupName: 'popup-notify-success',
              isOpen: true
            })
          } catch (error: any) {
            this.isLoading = false
            const { data } = error.response
            let message = ''
            switch (data.status) {
              case 'LESS_THAN_ZERO':
                message = this.$t('notify.quantity-less-than-zero') as string
                break
              case 'BALANCE_NOT_ENOUGH':
                message = this.$t('notify.transfer-nft-balance-not-enough') as string
                break
              case 'RECEIVER_NOT_EXIST':
                message = this.$t('notify.transfer-nft-receiver-not-exist') as string
                break
              case 'MORE_OWN_QUANTITY':
                message = this.$t('notify.transfer-nft-more-own-quantity') as string
                break
              case 'NOT_OWN_ITEM':
                message = this.$t('notify.transfer-nft-not-own-item') as string
                break
              case 'INVALID_PIN':
                message = this.$t('notify.errorCheckPinCode') as string
                break
              case 'WRONG_RECEIVE_ADDRESS':
                message = this.$t('notify.wrong-receive-address') as string
                break
              case 'INVALID_USD_EXCHANGE_RATE':
                message = this.$t('notify_invalid-service-fee') as string
                break
              default:
                message = this.$t('notify.transfer-nft-not-enough-quantity') as string
                break
            }
            this.$message.error({ message, duration: 5000 })
          }
        }
      })
    }

    async buyOnChain(): Promise<void> {
      try {
        this.isLoading = true
        await this.switchNetwork(this.nftItem.baseCurrency)

        // const balance = await this.getBalance(this.nftItem.currency)

        const receiver = this.contractAddressExchange
        // const pay = this.serviceFee
        const contractAddress = this.contractAddress
        const decimal = this.$options.filters?.getDecimalsToken(this.nftItem.currency)

        const quantity = this.nftItem.myRemainQuantity === 1 ? 1 : Number(this.form.quantity.replaceAll(',', ''))
        const pin = this.info.pinEnable ? this.$options.filters?.encryptPassword(this.form.pin) : null
        const data = {
          itemId: this.nftItem.id,
          receiverAddress: this.form.recipientAddress,
          quantity,
          pin,
          usdExchangeRate: this.exchangeRate
        }
        const initTransfer = await apiNftV2.transferNft(data)

        if (this.nftItem.currency === 'ETH' || this.nftItem.currency === 'BNB') {
          await this.sendCoin(initTransfer.totalHex, receiver, initTransfer, decimal)
        } else {
          //@ts-ignore
          const web3 = new Web3(this.typeLogin === 'BINANCE' ? window.BinanceChain : window.ethereum)

          const abi = await this.getAbiCode(this.nftItem.currency)

          const gasPrice = await web3.eth.getGasPrice()

          const NameContract = new web3.eth.Contract(abi, contractAddress, {
            from: this.walletAddress,
            gasPrice
          })
          // const _pay = Math.ceil((pay * Math.pow(10, decimal + 1)) / 10)

          const payHex = '0x' + initTransfer.totalHex

          const gasLimit = await NameContract.methods.transfer(receiver, payHex).estimateGas({ from: this.walletAddress })

          const transaction = await NameContract.methods.transfer(receiver, payHex).send({
            from: this.walletAddress,
            gas: gasLimit,
            gasPrice: gasPrice
          })

          const data = {
            id: initTransfer.id,
            transactionCode: transaction.transactionHash,
            transactionType: initTransfer.transactionType
          }

          await apiNftV2.confirmTransaction(data)
        }

        this.isLoading = false
        this.setTypeOfAction('transfer-nft')
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
      } catch (error: any) {
        console.log('aa', error?.stack)

        this.isLoading = false
        this.offFirebase()
        this.setStatusApproveAccount('NONE')

        if (error?.stack) {
          let open = error?.stack.indexOf('{')
          if (open !== -1) {
            let close = error?.stack.lastIndexOf('}')
            let j_s = error?.stack.substring(open, close + 1)
            let err = JSON.parse(j_s)
            if (err.originalError.message === 'execution reverted: not enough enough fund to transfer') {
              const message = this.$t('notify.not-enough-balance') as string
              this.$message.error({ message, duration: 5000 })
              return Promise.reject()
            }
          }
        }

        if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
          const message = this.$t('notify.not-enough-balance') as string
          this.$message.error({ message, duration: 5000 })
        }
        const { data } = error.response
        let message = ''
        if (data.status) {
          switch (data.status) {
            case 'LESS_THAN_ZERO':
              message = this.$t('notify.quantity-less-than-zero') as string
              break
            case 'BALANCE_NOT_ENOUGH':
              message = this.$t('notify.transfer-nft-balance-not-enough') as string
              break
            case 'RECEIVER_NOT_EXIST':
              message = this.$t('notify.transfer-nft-receiver-not-exist') as string
              break
            case 'MORE_OWN_QUANTITY':
              message = this.$t('notify.transfer-nft-more-own-quantity') as string
              break
            case 'NOT_OWN_ITEM':
              message = this.$t('notify.transfer-nft-not-own-item') as string
              break
            case 'INVALID_PIN':
              message = this.$t('notify.errorCheckPinCode') as string
              break
            case 'WRONG_RECEIVE_ADDRESS':
              message = this.$t('notify.wrong-receive-address') as string
              break
            case 'INVALID_USD_EXCHANGE_RATE':
              message = this.$t('notify_invalid-service-fee') as string
              break
            default:
              message = this.$t('notify.transfer-nft-not-enough-quantity') as string
              break
          }
        }

        if (message) {
          this.$message.error({ message, duration: 5000 })
        }
      }
    }

    async sendCoin(pay: string, receiver: string, initTransfer: Record<string, any>, decimal: number): Promise<void> {
      try {
        const provider = this.typeLogin === 'BINANCE' ? window.BinanceChain : window.ethereum
        // pay = Math.ceil((pay * Math.pow(10, decimal + 1)) / 10)
        const payHex = '0x' + pay
        const params = [
          {
            from: this.walletAddress,
            to: receiver,
            value: payHex
          }
        ]
        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params
        })

        const _data = {
          id: initTransfer.id,
          transactionCode: hash,
          transactionType: initTransfer.transactionType
        }

        await apiNftV2.confirmTransaction(_data)

        return Promise.resolve()
      } catch (error: any) {
        const data: Record<string, any> = error?.response?.data
        let message = ''
        if (data?.status === 'EXPIRED_CONFIRM_TRANSACTION') {
          message = this.$t('notify_expired-confirm-transaction') as string
        } else {
          message = this.$t('notify_transfer-nft-failed') as string
        }
        this.$message.error({ message, duration: 5000 })
        return Promise.reject(error)
      }
    }

    async handleConfirm(): Promise<void> {
      try {
        this.isLoading = true
        this.isClickConfirm = true
        if (this.isLogin || (!this.isLogin && !this.nftItem.contractAddress)) {
          if (this.isLogin) {
            this.buyOffChain()
          } else {
            this.buyOnChain()
          }
        } else {
          await this.validateCurrentUser()
          await this.switchNetwork(this.nftItem.baseCurrency)
          if (await this.checkApprovedForAll(this.nftItem.contractAddress, this.spenderWallet, this.nftItem.currency)) {
            await apiNft.validateApprove({}, { itemId: this.nftItem.id })
            this.handleGetApproveAccount()
          } else {
            this.putOnSaleOnChain({ itemId: this.nftItem.id }, this.nftItem.contractAddress, this.spenderWallet, '', this.nftItem.currency)
          }
        }
      } catch (error) {
        // console.log(error)

        this.offFirebase()
        this.setStatusApproveAccount('NONE')
        clearTimeout(this.timing)
        this.isLoading = false
      }
    }

    handleScanAddress(): void {
      this.isScan = true
      this.setOpenPopup({
        popupName: 'popup-scan-address',
        isOpen: true
      })
    }
    stringScan = ''
    handleCompleteScanAddress(result: string): void {
      this.form.recipientAddress = result
      this.isScan = false
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
    handleWrongAdd(rsAssigned: boolean): void {
      this.isWrongAddress = rsAssigned
    }

    // test():void {
    //     this.$message.error({ 'test' })
    // }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.popup-transfer-nft {
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
    .content {
      .text-content {
        word-break: break-word;
        p {
          font-size: 16px;
          line-height: 24px;
          color: #5b616e;
        }
      }
      .el-form {
        &-item.fee {
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
        .icon-show-pass {
          cursor: pointer;
          position: absolute;
          top: 30px;
          right: 8px;
          font-size: 24px;
        }
      }
      .prefix--camera {
        right: 6px;
        top: 41%;
        position: absolute;
        z-index: 10;
      }
      .prefix--icon {
        left: 12px;
        top: 41%;
        position: absolute;
        z-index: 10;
      }
      .address-label {
        .symbol {
          padding-right: 10px;
          position: relative;
          &::after {
            position: absolute;
            content: '*';
            color: #f56c6c;
            right: 1px;
          }
        }
      }
      .transfer-address {
        .el-input__inner {
          padding-left: 44px;
        }
        .el-form-item__label::after {
          display: none;
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
  @media (max-width: 768px) {
    ::v-deep.popup-transfer-nft {
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
            color: #0a0b0d !important;
            padding-right: 36px;
          }
          .text-desc {
            font-size: 14px;
            line-height: 20px;
          }
          .input-bid {
            margin-top: 16px;
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
      }
    }
  }
</style>
