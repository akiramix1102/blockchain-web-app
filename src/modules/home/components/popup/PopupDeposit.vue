<template>
  <base-popup name="popup-deposit" class="popup-deposit popup-deposit--responsive" width="620px" :open="handleOpen" :close="handleClose" :isShowFooter="false">
    <div slot="title">
      <span>{{ getTitlePopup }}</span>
    </div>
    <div class="content">
      <el-form :model="deposit">
        <el-form-item v-if="this.type !== 'BTC'">
          <el-select v-model="deposit.network" class="w-100">
            <el-option v-for="network in listNetwork" :key="network.id" :value="network.id" :label="`${network.networkName} (${network.network})`">
              <template>
                <span class="d-ib text-base">{{ `${network.networkName} (${network.network})` }}</span>
              </template>
            </el-option>
          </el-select>
          <div class="be-flex jc-space-between w-100" slot="label">
            <span>{{ $t('withdraw.network') }}</span>
          </div>
        </el-form-item>
        <div style="text-align: center" class="content-qr">
          <qrcode-vue :value="addressWallet" size="200" level="H"></qrcode-vue>
          <!-- <img v-if="getIcon == 'icon-clm'" src="../../../../assets/images/icon-clevemer.jpg" style="width: 55px" alt="" class="content-qr-img" /> -->
          <!-- <img v-else-if="getIcon == 'icon-btc'" src="../../../../assets/images/Bitcoin-BTC-icon.png" style="width: 55px" alt="" class="content-qr-img" /> -->
          <!-- <base-icon v-if="getIcon == 'icon-clm'" :icon="getIcon" class="content-qr-img" size="55" :class="getIcon == 'icon-clm' ? 'backgroundBtc' : 'nobackground'" /> -->
          <!-- <base-icon v-else :icon="getIcon" class="content-qr-img" size="55" :class="getIcon == 'icon-btc' ? 'backgroundBtc' : 'nobackground'" /> -->
        </div>
        <div class="text-base be-flex jc-space-center" style="color: #605e5c; font-size: 14px">
          {{ $t('forgot.deposit11') }}
        </div>
        <div class="text-base be-flex jc-space-center text-qr">{{ this.$t('forgot.text11') }} {{ getTypeCoin }}</div>
        <el-form-item class="form-deposit">
          <el-input placeholder="Địa chỉ ví" disabled v-model="addressWallet" v-on:focus="$event.target.select()" ref="clone">
            <template style="cursor: pointer" slot="append">
              <span class="hide-on-mobile" @click="copyToClipboard"><base-icon icon="icon-copy" size="24" /></span>
              <span class="show-on-mobile" @click="copyToClipboard"><base-icon icon="icon-copy-black" size="24" /></span>
            </template>
          </el-input>
        </el-form-item>
        <span class="text-sm d-block" style="margin-bottom: 24px; word-break: break-word; line-height: 20px"
          >{{ $t('deposit.min') }}: <span class="text-bold">{{ getMinimum }} {{ getTypeCoin }}</span
          >. {{ $t('deposit.less-than') }} <span class="text-bold">{{ getMinimum }} {{ getTypeCoin }}</span> {{ $t('deposit.not-refund') }}</span
        >
      </el-form>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { mainRepository } from '@/services/repositories/main'
  import QrcodeVue from 'qrcode.vue'
  import PopupMixin from '@/mixins/popup'
  import filter from 'lodash/filter'

  import WalletRepository from '@/services/repositories/wallet'
  const apiWallet: WalletRepository = getRepository('wallet')

  @Component({ components: { QrcodeVue } })
  export default class PopupDeposit extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Number, default: 0 }) currentExchangeRate!: number
    api?: mainRepository
    @Prop({ required: false, type: String, default: '' }) type!: string
    tabAmount: number[] = [25, 50, 75, 100]
    tabActive: any = null
    addressWallet = ''
    deposit: Record<string, any> = {
      network: ''
    }
    qrCls = 'qrcode'
    levelL = 'H'
    qrText = 'Thành test tạo qr code'
    depositMinUSD = 0

    listNetwork: Array<Record<string, any>> = []
    transFeeNetwork = ''

    get getTypeCoin(): any {
      switch (this.type) {
        case 'BTC':
          return 'BTC'
        case 'ETH':
          return 'ETH'
        case 'LYNK':
          return 'LYNK'
        case 'CLM':
          return 'CLM'
        case 'BNB':
          return 'BNB'
        case 'USDT':
          return 'USDT'
        case 'BUSD':
          return 'BUSD'
        default:
          return 'USDC'
        // default:
        //   return this.$t('forgot.text13')
      }
    }
    get getIcon(): string {
      switch (this.type) {
        case 'LYNK':
          return 'icon-lin'
        case 'BTC':
          return 'icon-btc'
        case 'ETH':
          return 'icon-eth'
        case 'BNB':
          return 'icon-bnb'
        case 'USDT':
          return 'icon-usdt'
        case 'USDC':
          return 'icon-usdc'
        case 'BUSD':
          return 'icon-busd'
        default:
          return 'icon-clm'
      }
    }
    get getTitlePopup(): any {
      switch (this.type) {
        case 'BTC':
          return this.$t('deposit.bitcoin')
        case 'ETH':
          return this.$t('deposit.ethereum')
        case 'BNB':
          return this.$t('deposit.bnb')
        case 'USDC':
          return this.$t('deposit.usdc')
        case 'USDT':
          return this.$t('deposit.usdt')
        case 'CLM':
          return this.$t('deposit.clm')
        case 'BUSD':
          return this.$t('deposit.busd')
        default:
          return this.$t('deposit.lynkey')
      }
    }

    get getMinimum(): string {
      const objConvert = {
        LYNK: 2,
        CLM: 2,
        USD: 2,
        USDC: 2,
        USDT: 2,
        BNB: 5,
        ETH: 8,
        BTC: 8,
        BUSD: 2
      }

      const minimum = this.depositMinUSD / this.currentExchangeRate
      if (minimum % 1 !== 0) {
        return (Math.ceil(minimum * Math.pow(10, objConvert[this.type])) / Math.pow(10, objConvert[this.type])).toFixed(objConvert[this.type])
      } else {
        return this.$options.filters?.convertAmountDecimal(minimum, this.type)
      }
    }
    copyToClipboard(): void {
      // this.$refs.clone.focus()
      // document.execCommand('copy')
      const el = document.createElement('input')
      el.value = this.addressWallet
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      let message: any = ''
      message = this.$t('notify.copy')
      this.$message.success({ message, duration: 5000 })
    }
    get getUnit(): string {
      switch (this.type) {
        case 'BTC':
          return 'BTC'
        case 'ETH':
          return 'ETH'
        default:
          return 'LYNK'
      }
    }
    handleClose(): void {
      this.depositMinUSD = 0
      this.addressWallet = ''
      this.deposit.network = ''
      this.listNetwork = []
      console.log('sd')
    }
    typeDeposit = ''
    async handleOpen(): Promise<void> {
      this.getWalletAddress()
      this.getNetwork()
      // if (this.type === 'USDT') {
      //   const result = await apiWallet.getListNetWorkUSDT()
      //   this.listNetwork = filter(result, elm => elm.currency === this.type)
      //   this.transFeeNetwork = this.$options.filters?.convertAmountDecimal(this.listNetwork[0].transferFee, this.getUnit)
      //   this.deposit.network = this.listNetwork[0].id
      // }
    }

    typeCoin = ''
    listNetworkEdit: any = []
    async getNetwork(): Promise<void> {
      this.api
        ?.getNetwork()
        .then(res => {
          this.listNetwork = filter(res, elm => elm.currency === this.type)
          if (this.listNetwork.length == 1) {
            this.deposit.network = this.listNetwork[0].id
          }
          console.log('list', this.listNetwork)
        })
        .catch(err => {
          console.log(err)
        })
    }
    getWalletAddress(): void {
      const param = {
        currency: this.type
      }
      this.api
        ?.getAddressWallet(param)
        .then((res: any) => {
          console.log('res', res)
          // this.dataInput = {
          //   ...this.dataInput,
          //   ...res
          // }
          // this.query.total = res.data
          // this.checkStatusKyc()
          // const list: any = []

          // for (let i = 0; i < res.data.length; i++) {
          //   if (res.data[i].currencyName == this.type.toUpperCase()) {
          //     list.push(res.data[i])
          //   }
          // }
          this.addressWallet = res[0].address ? res[0].address : 'khong co dia chi'
          this.depositMinUSD = res[0].depositMinUSD || 0
        })
        .catch(e => {
          console.log(e)
        })
    }
    created(): void {
      this.api = getRepository('main')
    }
    CoppyValue(): void {
      alert('ok')
    }
    handleSelectTab(tab: number): void {
      this.tabActive = tab
    }
  }
</script>

<style scoped lang="scss">
  .popup-deposit {
    .content {
      .prefix {
        position: absolute;
        z-index: 10;
      }
      .prefix--camera,
      .prefix--amount {
        right: 13px;
        top: 38%;
      }
      .amount-unit {
        color: var(--bc-amount-btc);
      }
      .tab-amount {
        .amount-item {
          padding: 4px 0;
          flex: 1;
          text-align: center;
          margin-right: 8px;
          background-color: #f3f2f1;
          border-radius: 4px;
          &:last-child {
            margin-right: 0;
          }
          &:hover {
            background-color: #0078d4;
            color: #fff;
          }
        }
        .active {
          background-color: #0078d4;
          color: #fff;
        }
      }
    }
    .footer {
      .btn-h40 {
        height: 40px;
      }
    }
    .content-qr {
      position: relative;
      margin-bottom: 16px;
    }
    .text-qr {
      font-size: 14px;
      margin-bottom: 20px;
    }
    .form-deposit {
      margin-top: 8px;
      cursor: pointer;
    }
    .show-on-mobile {
      display: none;
    }
    .backgroundBtc {
      background-color: #fff;
      height: 65px;
    }
    .content-qr-img {
      position: absolute;
      left: 50%;
      top: 50%;
      // width: 55px;
      // height: 55px;
      transform: translate(-50%, -50%);
    }
  }

  .popup-deposit--responsive {
    ::v-deep .popup-content {
      @media screen and (max-height: 900px) {
        max-height: 85vh;
      }
    }
  }
  @media screen and (max-width: 768px) {
    ::v-deep.popup-deposit--responsive {
      .el-dialog {
        width: 335px !important;
        &__header {
          .title {
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
          }
        }
        &__body {
          .popup-content {
            .content {
              .el-form {
                .content-qr {
                  margin-bottom: 12px;
                }
                .text-qr {
                  margin-bottom: 24px;
                }
                .content-qr > div > canvas {
                  width: 160px !important;
                  height: 160px !important;
                }
                .form-deposit {
                  margin-bottom: 16px;
                  .el-form-item__content {
                    .is-disabled .el-input__inner {
                      -webkit-appearance: none;
                      background-color: #fff;
                      border-right: none;
                      // border: 1px solid #DBDBDB;
                      border-top: 1px solid #dbdbdb;
                      border-left: 1px solid #dbdbdb;
                      border-bottom: 1px solid #dbdbdb;
                      // border-top: 1px solid #DBDBDB;

                      -webkit-text-fill-color: #0a0b0d;
                      text-overflow: ellipsis;
                      /* Needed to make it work */
                      overflow: hidden;
                      white-space: nowrap;
                    }
                    .el-input-group__append {
                      background-color: #fff;
                      border: 1px solid #dbdbdb;
                      border-left: none;
                      .hide-on-mobile {
                        display: none;
                      }
                      .show-on-mobile {
                        display: block;
                      }
                    }
                  }
                }
              }
              .el-form .el-form-item .el-select .el-input input {
                border-color: #dbdbdb;
              }
            }
          }
        }
      }
    }
  }
</style>
