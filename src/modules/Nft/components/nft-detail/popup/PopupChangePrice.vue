<template>
  <base-popup name="popup-change-price" class="popup-change-price" width="480px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('detail-nft.changePrice.header-change') }}</p>
    </div>
    <div class="content">
      <!-- <div class="text-content">
        <span
          ><p>{{ $t('detail-nft.changePrice.content-change') }}</p>
        </span>
      </div> -->
      <el-form ref="changeprice" :model="changeprice" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <el-form-item class="new-price" :label="$t('detail-nft.changePrice.price')">
          <!-- <p>{{ $t('detail-nft.changePrice.price') }}</p> -->
          <el-input v-model="change.newPricee" @keypress.native="onlyNumber($event, 'amount')" @keyup.native="numberFormat($event)" class="price-input" />
          <!-- <div class="text-place">
            <p>
              {{ dataPopup.currencyName }}
            </p>
          </div> -->
          <div class="text-place">
            <p>~${{ priceExchangeRate | convertAmountDecimal('USD') }}</p>
          </div>
        </el-form-item>
        <el-form-item class="will-receive">
          <div class="text-receive">
            <div class="text-left">
              <p>{{ $t('detail-nft.changePrice.receive') }}</p>
            </div>
            <div class="text-right">
              <p>
                {{ $t('detail-nft.changePrice.fee') }} ({{ dataPopup.serviceFeePercent }}%) :
                <span class="text-bg">{{ serviceFee | convertAmountDecimal(nftItem.currency, false, true) }} </span>
              </p>
            </div>
          </div>
          <div class="input-receive">
            <!-- <el-input :value="receive | convertAmountDecimal(nftItem.currency)" v-model="change.receive" class="recei-input" disabled /> -->
            <el-input :value="receive | convertAmountDecimal(nftItem.currency, false, true)" class="recei-input" disabled />
          </div>
          <div class="text-place">
            <p>~${{ balanceExchangeRate | convertAmountDecimal('USD') }}</p>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="footer">
      <!-- <button class="btn-cancel">
        <p class="text-cancel" @click="handleReset">{{ $t('detail-nft.changePrice.cancel') }}</p>
      </button>
      <button @click="handleSaveChangePrice" class="btn-save btn">
        <p class="text-save">{{ $t('detail-nft.changePrice.save') }}</p>
      </button> -->
      <button class="cancel-btn btn-default mr-15 text-regular btn-h40" @click="handleReset">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button class="save-btn btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="debounceConfirm">{{ $t('button.save') }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import includes from 'lodash/includes'
  import getRepository from '@/services/index'
  import firebase from '@/utils/firebase'
  import filter from 'lodash/filter'
  import debounce from 'lodash/debounce'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepository from '@/services/repositories/nft'
  import { namespace } from 'vuex-class'

  // import ActivityRepository from '@/services/repositories/activity'
  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')

  const bcNft = namespace('bcNft')

  @Component
  export default class PopupChangePrice extends Mixins(PopupMixin) {
    // @Prop() currency: any
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    tabActive: any = null
    changeprice: any = null
    dataPopup: any = {}
    // itemID = 0
    price = 0
    newPricee = ''
    // exchangeRate: Array<Record<string, any>> = []
    listener: any = null

    exchangeRateRef: any = null

    query: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0
    }

    change: any = {
      receive: '',
      newPricee: '',
      fees: 0
    }

    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-change-price',
        isOpen: false
      })
    }

    // get currentExchangeRate(): number {
    //   const currentExchange = filter(this.exchangeRate, elm => elm.currency === this.tabActive)[0]
    //   return +currentExchange?.exchangeRate || 0
    // }
    rate = ''

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }
    get priceExchangeRate(): number {
      return Number(this.change.newPricee.replaceAll(',', '')) * this.exchangeRate
    }

    get serviceFeePercent(): number {
      if (this.dataPopup?.serviceFeePercent) {
        return this.dataPopup?.serviceFeePercent
      }
      return 0
    }

    get serviceFee() {
      return (Number(this.change.newPricee.replaceAll(',', '')) * this.dataPopup.serviceFeePercent) / 100
    }

    get receive(): number {
      return Number(this.change.newPricee.replaceAll(',', '') - this.serviceFee)
    }

    get balanceExchangeRate() {
      return this.receive * this.nftItem.exchangeRate
    }

    async handleOpen(): Promise<void> {
      // console.log('this.nftItem', this.nftItem)
      // const exchangeRateRef = firebase.database().ref('exchange_rates')
      // this.listener = exchangeRateRef.on('value', snapshot => {
      //   this.exchangeRate = snapshot.val()

      //   this.rate = this.exchangeRate[6].exchangeRate
      //   console.log('1', this.rate)
      //   console.log('test', this.exchangeRate)

      // console.log('test', this.exchangeRate[6].exchangeRate)
      // })
      console.log('rate', this.nftItem.exchangeRate)

      this.setOpenPopup({
        popupName: 'popup-change-price',
        isOpen: true
      })
      this.change = {
        newPricee: ''
      }

      // const params = {
      //   itemId: this.nftItem.id
      // }
      const result = await apiNft.getChangePrice(this.nftItem.currency, this.nftItem.id)
      this.dataPopup = result
      this.dataPopup.currencyName = this.nftItem.currency
      this.change.receive = this.nftItem.currency
    }
    debounceConfirm(): void {
      this.handleSaveChangePrice(this)
    }
    handleSaveChangePrice = debounce(async _this => {
      // console.log('nguvkl', this.nftItem.minListingId)

      // exchange_rate
      // const exchangeRateRef = firebase.database().ref('exchange_rates')
      // this.listener = exchangeRateRef.on('value', snapshot => {
      //   this.exchangeRate = snapshot.val()
      //   console.log('rate', this.exchangeRate)
      // })
      try {
        const params = {
          lastListingId: _this.nftItem.myListingId,
          newPrice: _this.change.newPricee.replaceAll(',', '')
          // idItem: this.nftItem.id
        }

        const saveChange = await apiNftV2.saveChangePrice(_this.nftItem.id, params)
        let message = _this.$t('notify.change-price-success') as string
        _this.$message.success({ message, duration: 5000 })
        _this.dataPopup = saveChange
        _this.handleClose()
        _this.$emit('reload')
      } catch (error: any) {
        const { data } = error.response
        let message = ''
        if (data.status == 'SALE_PENDING') {
          switch (data.status) {
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

    // @Watch('change.newPricee') watchChangePrice(value: any): void {
    //   console.log('2', this.rate)

    //   const a = value.toString().replaceAll(',', '')
    //   this.price = a * 1
    //   this.change.fees = a * 1
    //   // const exchangeRate = filter(this.exchangeRate, elm => elm.currency === 'LYNK')[0]
    //   // this.price = a * 1 + a * 0.025
    //   // if (parseFloat(this.price.toString()) > parseFloat(this.availableBalance.toString())) {
    //   //   this.checkValidate = true
    //   // } else {
    //   //   this.checkValidate = false
    //   // }
    //   // this.checkDisableBtn = value ? false : true
    //   // if (this.checkValidate) {
    //   //   this.checkDisableBtn = true
    //   // }
    //   // EventBus.$emit('price', this.price)
    //   if (value > 0) {
    //     this.change.fees = (value.toString().replaceAll(',', '') / 100) * 2.5
    //     this.change.receive = this.price - this.change.fees + ' ' + this.dataPopup.currencyName
    //     this.dataPopup.serviceFee = this.change.fees.toFixed(2)
    //     const a = parseFloat(this.change.receive) * parseFloat(this.rate)
    //     this.dataPopup.approciate = a.toFixed(2)
    //   }

    //   //   this.checkDisableBtn = true
    //   // }
    // }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.change[type], '.')) {
        event.preventDefault()
      }
    }

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        this.tabActive = null
        _event.target.value = fnumber
      }
    }

    handleClose(): void {
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-change-price',
        isOpen: false
      })
      // this.change = {
      //   // newPrice: this.price,
      //   receive: 'LYNK'
      // }
      this.change = {
        newPricee: '',
        receive: this.nftItem.currency
      }
    }

    handleReset(): void {
      this.setOpenPopup({
        popupName: 'popup-change-price',
        isOpen: false
      })
      this.change = {
        newPricee: '',
        receive: this.nftItem.currency
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
  }
  .content {
    .text-content {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      word-break: break-word;
      color: #5b616e;
    }
    .new-price {
      // margin-top: 24px;
      position: relative;
      color: #0a0b0d;
      .price-input {
        max-width: 452px;
        width: 100%;
        font-size: 16px;
        color: #0a0b0d;
        ::placeholder {
        }
      }
      .text-place {
        position: absolute;
        top: 33px;
        color: #5b616e;
        right: 20px;
      }
    }
    .will-receive {
      .text-place {
        position: absolute;
        top: 44px;
        color: #5b616e;
        right: 20px;
      }
      margin: 24px 0;
      .text-receive {
        max-width: 452px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .text-left {
          color: #0a0b0d;
          display: flex;
          align-items: center;
          p {
            font-size: 14px;
            line-height: 20px;
          }
        }
        .text-right {
          color: #605e5c;
          font-size: 14px;
        }
      }
      .input-receive {
        color: #0a0b0d;
        // input[type='text'] {
        //   max-width: 452px;
        //   width: 100%;
        //   height: 48px;
        //   // margin-top: 10px;
        //   border: 1px solid rgba(219, 219, 219, 1);
        //   background: rgba(243, 242, 241, 1);
        //   border-radius: 5px;
        //   padding-left: 12px;
        //   font-size: 16px;
        //   line-height: 24px;
        //   color: #0a0b0d;
        //   cursor: no-drop;
        // }
      }
    }
  }
  .footer {
    max-width: 452px;
    width: 100%;
    .cancel-btn {
      font-size: 16px;
      font-weight: 600;
      color: #5b616e;
    }
    .save-btn {
      font-size: 16px !important;
      font-weight: 600;
    }
    // .btn-save {
    //   background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
    //   margin-left: 16px;
    // }
    // .btn {
    //   padding: 0 !important;
    // }
    // button {
    //   max-width: 100px;
    //   width: 100%;
    //   height: 40px;
    //   border: 1px solid rgba(219, 219, 219, 1);
    //   border-radius: 6px;
    //   background: #fff;
    //   cursor: pointer;
    //   .text-cancel {
    //     font-size: 16px;
    //     line-height: 24px;
    //     color: #5b616e;
    //     font-weight: 600;
    //   }
    //   .text-save {
    //     font-size: 16px;
    //     font-weight: 600;
    //     line-height: 24px;
    //     color: white;
    //   }
    // }
    // .btn-cancel {
    //   &:hover {
    //     border-color: var(--bc-btn-default-border-hover);
    //     -webkit-background-clip: text;
    //     -webkit-text-fill-color: var(--bc-btn-default-border-hover);
    //     border-color: var(--bc-btn-default-border-hover);
    //     text-shadow: 0px 0px #00000000;
    //   }
    // }
  }

  ::v-deep.popup-change-price {
    .el-input__inner {
      height: 48px !important;
      color: #0a0b0d;
      // margin-top: 10px;
    }
    .recei-input {
      ::placeholder {
        color: #0a0b0d;
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-change-price {
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
          }
          .el-form-item {
            margin: 0;
          }
          .el-form-item:last-child {
            margin-bottom: 24px;
            margin-top: 16px;
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
