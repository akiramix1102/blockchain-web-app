<template>
  <base-popup name="popup-setting-discount" class="popup-setting-discount" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('put-on-sale.setting-discount') }}</p>
    </div>
    <div class="content">
      <el-form ref="ruleForm" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <discount-item
          ref="item"
          v-for="item in currencyAcceptList"
          :key="item.id"
          :currencyData="item"
          :arrCurrency="arrCurrency"
          :currencyAcceptList="currencyAcceptList"
          :paymentCurrency="nftItem.currency"
          @choose="handleChoose(item.id, ...arguments)"
          @remove="handleRemoveItem(item.id)"
        />
      </el-form>

      <div v-if="listCurrencies.length > currencyAcceptList.length" class="body-base btn-add" @click="handleAdd">{{ $t('btn_add-new') }}</div>
    </div>

    <div slot="footer" class="footer">
      <el-button class="cancel-btn btn-default btn-h40" @click="handleCancel">
        <p>{{ $t('button.cancel') }}</p>
      </el-button>
      <el-button
        :loading="isLoading"
        :class="getDisableSubmit ? 'btn--disabled' : null"
        class="btn-confirm is-none-border cursor btn-h40 btn-default-bg btn-theme"
        @click="debounceConfirm"
        >{{ $t('button.confirm') }}</el-button
      >
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import PopupMixin from '@/mixins/popup'
  import DiscountItem from './DiscountItem.vue'
  import filter from 'lodash/filter'
  import uniqueId from 'lodash/uniqueId'
  import findIndex from 'lodash/findIndex'
  import { forEach, toString } from 'lodash'
  import { empty } from 'dom7'
  const bcNft = namespace('bcNft')

  @Component({ components: { DiscountItem } })
  export default class PopupSetupDiscount extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: () => [] }) arrCurrency!: Array<Record<string, any>>
    @Prop({ required: false, type: Array, default: () => [] }) currencyAcceptListPreset!: Array<Record<string, any>>
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('listCurrencies') listCurrencies!: Array<Record<string, any>>
    isLoading = false

    currencyAcceptList: Array<Record<string, any>> = [
      // {
      //   id: uniqueId(),
      //   currency: '',
      //   discount: 0,
      //   discountType: 'PERCENT'
      // }
    ]

    get getDisableSubmit(): boolean {
      return false
    }

    handleOpen(): void {
      this.currencyAcceptList = []
      forEach(this.currencyAcceptListPreset, item => {
        this.currencyAcceptList = [...this.currencyAcceptList, { id: uniqueId(), discount: toString(item.discount), ...item }]
      })
      return
    }

    handleClose(): void {
      this.currencyAcceptList = []
      this.setOpenPopup({
        popupName: 'popup-setting-discount',
        isOpen: false
      })
    }
    handleCancel(): void {
      this.currencyAcceptList = []
      this.setOpenPopup({
        popupName: 'popup-setting-discount',
        isOpen: false
      })
    }
    debounceConfirm(): void {
      let duplicatedCurrencyArr: Array<Record<string, any>> = []
      let emptyFieldsExist = false

      this.currencyAcceptList.map(item => {
        let compareList = this.currencyAcceptList.filter(elm => elm.id !== item.id)
        let duplicateItem: Record<string, any> | undefined = compareList.find(elm => elm.currency === item.currency && elm.currency !== '')
        duplicateItem ? duplicatedCurrencyArr.push(duplicateItem) : false
      })
      this.currencyAcceptList.forEach(elm => {
        if (!elm.currency || !elm.discountType) {
          emptyFieldsExist = true
          return
        }
      })
      if (!duplicatedCurrencyArr.length && !emptyFieldsExist) {
        // replace property[id]
        let currencyAcceptListReplaceId: Array<Record<string, any>> = []
        forEach(this.currencyAcceptList, currencyItem => {
          let { id, ...value } = currencyItem
          value = { ...value, discount: parseFloat(value.discount) }
          currencyAcceptListReplaceId.push(value)
        })
        this.$emit('getAdvancedSettingsData', currencyAcceptListReplaceId)
        this.setOpenPopup({
          popupName: 'popup-setting-discount',
          isOpen: false
        })
      } else if (emptyFieldsExist) {
        const message = this.$t('notify.empty-payment-method') as string
        this.$message.error({ message, duration: 5000 })
      } else if (duplicatedCurrencyArr.length) {
        const message = this.$t('notify.duplicate-currency') as string
        this.$message.error({ message, duration: 5000 })
      }
      return
    }

    handleChoose(id: number, value: Record<string, any>): void {
      // validate when discount type = PERCENT
      if (value.discountType === 'PERCENT' && +value.discount > 100) {
        value = { ...value, discount: '100' }
      } else {
        value = { ...value, discount: typeof value.discount === 'string' ? +value.discount.replaceAll(',', '') : value.discount }
      }
      const index = findIndex(this.currencyAcceptList, elm => elm.id === id)
      this.currencyAcceptList[index] = {
        ...this.currencyAcceptList[index],
        ...value
      }
      // emit event
      // forEach(this.currencyAcceptList, (value, index) => {
      //   //@ts-ignore
      //   this.$refs.item[index].getValue()
      // })
    }

    handleAdd(): void {
      this.currencyAcceptList.push({
        id: uniqueId(),
        currency: '',
        discount: '',
        discountType: ''
      })
    }

    handleRemoveItem(id: number): void {
      this.$emit('removeValuePaymentOption', filter(this.currencyAcceptList, elm => elm.id === id)[0]?.currency)
      this.currencyAcceptList = filter(this.currencyAcceptList, elm => elm.id !== id)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-setting-discount {
    .el-dialog {
      width: 640px !important;
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
            .btn-add {
              cursor: pointer;
              padding: 12px;
              width: 100%;
              text-align: center;
              border: 1px dashed #9d3ef2;
              margin-bottom: 24px;
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-setting-discount {
      .el-dialog {
        width: 335px !important;
        &__body {
          color: var(--bc-text-market-primary-nft);

          .popup-content {
            .content {
              .btn-add {
                cursor: pointer;
                padding: 12px;
                width: 100%;
                text-align: center;
                border: 1px dashed #9d3ef2;
                margin-bottom: 24px;
              }
            }
          }
        }
      }
    }
    .footer {
      .btn-confirm {
        width: 100px;
        font-size: 16px;
        font-weight: 600;
        padding: 8px 20px !important;
        line-height: 16px !important;
        font-weight: 600;
        border-radius: 6px;
        margin-left: 12px;
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
  }
</style>
