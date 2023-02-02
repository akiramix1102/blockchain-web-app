<template>
  <base-popup name="popup-open-for-bids" class="popup-open-for-bid" width="480px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('put-on-sale.open-for-bid') }}</p>
    </div>
    <div class="content">
      <el-form :model="form" ref="ruleForm" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <el-form-item class="bid" :label="$t('put-on-sale.minium-bid')" prop="bid">
          <el-input
            :placeholder="$t('placeholder.minium-bid')"
            autocomplete="new-password"
            :readonly="false"
            v-model="form.price"
            @keypress.native="onlyNumber($event, 'bid')"
            @keyup.native="numberFormat($event)"
          />
          <!-- <div class="nft-body-small text-desc exchange">{{ nftItem.currency }}</div> -->
          <div class="nft-body-small text-desc exchange">~${{ priceExchangeRate | convertAmountDecimal('USD') }}</div>

          <div v-if="errorPrice" class="error">{{ $t('put-on-sale.error-price') }} {{ minPrice }} {{ nftItem.currency }}</div>
        </el-form-item>
        <el-form-item :label="`${$t('acceppt-payment-option')}`" prop="address" style="color: red" class="label-send-invite">
          <el-select v-model="valuePaymentOption" multiple placeholder="">
            <el-option v-for="(item, index) in listCurrencyWithoutUsdt" :key="index" :label="item.currencyName" :value="item.currency"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
    <div slot="footer" class="footer">
      <button class="cancel-btn btn-default mr-15 text-regular btn-h40" @click="handleCancel">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button
        :loading="isLoading"
        :class="getDisableSubmit ? 'btn--disabled' : null"
        class="confirm-btn is-none-border cursor btn-h40 btn-default-bg btn-theme"
        @click="debounceConfirm"
        >{{ $t('button.confirm') }}</el-button
      >
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'

  import includes from 'lodash/includes'
  import filter from 'lodash/filter'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import { debounce } from 'lodash'
  import { forEach } from 'lodash'
  import firebase from '@/utils/firebase'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import NftRepositoryV3 from '@/services/repositories/nftv3'
  import EventBus from '@/utils/eventBus'

  const bcNft = namespace('bcNft')

  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const apiNftV3: NftRepositoryV3 = getRepository('nftv3')
  const bcAuth = namespace('beAuth')

  @Component({ components: {} })
  export default class PopupOpenForBid extends Mixins(PopupMixin, OnChainMixin) {
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    // @bcAuth.State('user') user!: Record<string, any>

    @bcNft.State('listNftAsset') listNftAsset!: Array<Record<string, any>>
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Record<string, boolean>
    @bcNft.State('listCurrencies') listCurrencies!: Array<Record<string, any>>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    errorPrice = false
    minPrice = 0
    form: Record<string, any> = {
      price: ''
    }
    exchangeRateRef: any = null

    timing: any = null
    valuePaymentOption: Array<Record<string, any>> = []
    currencyAcceptList: Array<Record<string, any>> = []

    @Watch('valuePaymentOption') updateCurrencyAcceptList(): void {
      this.currencyAcceptList.length = 0
      this.valuePaymentOption.map(payment => {
        this.currencyAcceptList.push({
          currency: payment,
          discount: 0,
          discountType: 'PERCENT'
        })
      })
    }

    get getDisableSubmit(): boolean {
      return this.form.price === '' || this.valuePaymentOption.length === 0 || (this.isShowCheckboxAccept && !this.checkedAccept)
    }
    get spenderWallet(): string {
      if (this.nftItem.contractAddress && !this.isLogin) {
        const spender = filter(this.listNftAsset, elm => elm.type === 'NFT').filter(elm => elm.contractAddress === this.nftItem.contractAddress)[0]
        return spender.spenderWalletAddress
      }
      return ''
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

    get listCurrencyWithoutUsdt(): Array<Record<string, any>> {
      return this.listCurrencies
    }

    @Watch('statusApproveAccount') async handleWatchStatusApproveAccount(status: string): Promise<void> {
      try {
        if (status === 'SUCCESS' && this.isOpenPopup && this.isClickConfirm) {
          const data = {
            itemId: this.nftItem.id,
            newPrice: Number(this.form.price.replaceAll(',', '')),
            quantity: 1,
            saleType: 'BID',
            fromDate: null,
            toDate: null,
            receiveCurrencies: this.valuePaymentOption.join(','),
            currencyAcceptList: this.currencyAcceptList
          }
          await apiNftV3.fixedPrice(data)
          this.isLoading = false
          this.setOpenPopup({
            popupName: 'popup-open-for-bids',
            isOpen: false
          })
          this.$emit('success', 'put-open')
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
        this.isLoading = false
        this.offFirebase()
        this.setStatusApproveAccount('NONE')
        const { data, status } = error.response.data
        if (status === 'LESS_MIN_PRICE') {
          this.errorPrice = true
          this.minPrice = data.minPrice
        }
      }
    }

    async handleOpen(): Promise<void> {
      forEach(this.listCurrencyWithoutUsdt, elm => {
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
    }

    handleClose(): void {
      this.offFirebase()
      this.setStatusApproveAccount('NONE')
      this.checkedAccept = false
      this.valuePaymentOption = []
      this.isClickConfirm = false
      this.isOpenPopup = false
      clearTimeout(this.timing)
      this.form.price = ''
      this.errorPrice = false
      this.isLoading = false
    }
    debounceConfirm = debounce(() => {
      this.handleConfirm()
    }, 500)
    async handleConfirm(): Promise<void> {
      try {
        this.isLoading = true
        this.errorPrice = false
        const data = {
          itemId: this.nftItem.id,
          newPrice: Number(this.form.price.replaceAll(',', '')),
          quantity: 1,
          saleType: 'BID',
          fromDate: null,
          toDate: null,
          receiveCurrencies: this.valuePaymentOption.join(','),
          currencyAcceptList: this.currencyAcceptList
        }
        if (this.isLogin || (!this.isLogin && !this.nftItem.contractAddress)) {
          await apiNftV3.fixedPrice(data)
          this.isLoading = false
          this.setOpenPopup({
            popupName: 'popup-open-for-bids',
            isOpen: false
          })
          this.$emit('success', 'put-open')
        } else {
          this.isClickConfirm = true
          await this.validateCurrentUser()
          await this.switchNetwork(this.nftItem.baseCurrency)
          if (await this.checkApprovedForAll(this.nftItem.contractAddress, this.spenderWallet, this.nftItem.currency)) {
            await apiNft.validateApprove({}, { itemId: this.nftItem.id })
            this.handleGetApproveAccount()
          } else {
            await this.putOnSaleOnChain(data, this.nftItem.contractAddress, this.spenderWallet, 'popup-open-for-bids', this.nftItem.currency)
          }
        }
        EventBus.$emit('reload-list-owner')
      } catch (error: any) {
        this.isLoading = false
        this.offFirebase()
        this.setStatusApproveAccount('NONE')
        const { data, status } = error.response.data
        if (status === 'LESS_MIN_PRICE') {
          this.errorPrice = true
          this.minPrice = data.minPrice
        }
      }
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-open-for-bids',
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
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-open-for-bid {
    .footer {
      .cancel-btn {
        p {
          font-size: 16px;
          font-weight: 600;
          color: #5b616e;
        }
      }
      .confirm-btn {
        padding: 8px 20px !important;
        font-size: 16px !important;
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

              &-item.bid {
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
    ::v-deep.popup-open-for-bid {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .el-form-item {
          margin-bottom: 16px;
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
