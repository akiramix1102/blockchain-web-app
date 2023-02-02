<template>
  <div class="be-flex align-center item">
    <el-form-item :label="$t('label_payment-by')" class="payment-by" :class="!form.currency ? 'no-currency' : null">
      <el-select v-model="form.currency" clearable @change="$emit('choose', form)" :placeholder="$t('placeholder_choose-payment')" @focus="lookFocusCurrency()">
        <el-option v-for="token in arrCurrencyAvailable" :key="token.id" :value="token.currency" :label="`${token.currencyName} (${token.currency})`">
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
        <div slot="prefix" :class="form.currency ? 'suffix' : ''">
          <base-icon class="d-iflex" :icon="getIcon(form.currency)" size="24" />
        </div>
      </el-select>
    </el-form-item>
    <div class="discount-wrapper">
      <el-form-item :label="$t('label_discount')" class="discount">
        <el-select v-model="form.discountType" clearable @change="handleChangeDiscountType(form)">
          <el-option v-for="type in arrType" :key="type" :value="type" :label="`${type === 'PERCENT' ? $t(type) : paymentCurrency}`"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="a" class="hide-label discount-value">
        <el-input v-model="form.discount" @keypress.native="onlyNumber($event)" @keyup.native="numberFormat($event)" clearable @input="$emit('choose', form)"> </el-input>
      </el-form-item>
    </div>

    <div class="item-remove" @click="removeItem"><base-icon icon="icon-x-black" size="20" class="d-iflex cursor" /><span class="item-remove__text">Delete</span></div>
  </div>
</template>

<script lang="ts">
  import { filter, forEach, includes, findIndex } from 'lodash'
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component
  export default class DiscountItem extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) arrCurrency!: Array<Record<string, any>>
    @Prop({ required: false, type: Array, default: () => [] }) currencyAcceptList!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => [] }) currencyData!: Record<string, any>
    @Prop({ required: false, type: String, default: () => [] }) paymentCurrency!: string
    @bcNft.State('listCurrencies') listCurrencies!: Array<Record<string, any>>
    form: Record<string, any> = {
      id: '',
      currency: '',
      discount: '0',
      discountType: 'PERCENT'
    }

    listCurrency: Array<Record<string, any>> = []
    arrCurrencyAvailable: Array<Record<string, any>> = []

    arrType: string[] = ['PERCENT', 'AMOUNT']
    created(): void {
      this.form.id = this.currencyData?.id
      this.form.currency = this.currencyData?.currency
      this.form.discount = this.$options.filters?.numberWithCommas((this.currencyData?.discount).toString() || '0')
      this.form.discountType = this.currencyData?.discountType || 'PERCENT'
    }
    lookFocusCurrency(): void {
      let availableValue: Array<Record<string, any>> = []
      this.listCurrencies.forEach((item: Record<string, any>) => {
        let currencyExist = false
        this.currencyAcceptList.forEach(acpEl => {
          if (item.currency === acpEl.currency && item.currency !== this.form.currency && item.currency !== '') {
            currencyExist = true
            return
          }
        })
        currencyExist ? false : availableValue.push(item)
      })
      this.arrCurrencyAvailable = [...availableValue]
    }

    getIcon(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : ''
    }

    removeItem(): void {
      this.$emit('remove')
    }

    onlyNumber(event: KeyboardEvent): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      console.log('>>> / file: DiscountItem.vue / line 89 / keyCode', keyCode)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
    }
    handleChangeDiscountType(_form: Record<string, any>): void {
      let discount = typeof _form.discount === 'string' ? _form.discount.replaceAll(',', '') : _form.discount
      if (_form.discountType === 'PERCENT' && discount > 100) {
        _form.discount = '100'
      }
      this.$emit('choose', _form)
    }

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (this.form.discountType === 'PERCENT' && fnumber.replaceAll(',', '') > 100) {
        const message = this.$t('notify.invalid-discount-percent') as string
        this.$message.error({ message, duration: 5000 })
        _event.target.value = '100'
        return
      }
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }

    getValue(isAddAll = false): void {
      if (isAddAll) {
        this.listCurrency = [...this.arrCurrency]
      } else {
        if (this.currencyAcceptList) {
          const arr = filter(this.currencyAcceptList, elm => elm.currency)

          const arrName: string[] = []

          forEach(arr, elm => arrName.push(elm.currency))
          const rs = filter(this.arrCurrency, elm => !includes(arrName, elm.currency))

          if (this.form.currency) {
            const choose = filter(this.arrCurrency, elm => elm.currency === this.form.currency)
            const index = findIndex(this.arrCurrency, elm => elm.currency === this.form.currency)
            rs.splice(index, 0, choose)
          } else {
            this.listCurrency = rs
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.item {
    .payment-by {
      .el-input__inner {
        width: 284px;
        padding-left: 45px;
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
    .no-currency {
      .el-input__inner {
        padding-left: 15px;
      }
    }
    .discount-wrapper {
      display: flex;
      .discount {
        .el-input__inner {
          width: 120px;
        }
      }
      .discount-value {
        .el-input__inner {
          width: 120px;
          padding: 0 10px 0 15px;
        }
      }
    }

    .el-form-item {
      margin-right: 16px;
    }
    .item-remove {
      position: relative;
      top: 4px !important;
      &__text {
        display: none;
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      border-bottom: 1px solid #dbdbdb;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    ::v-deep.item:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
    .payment-by {
      margin-right: 0 !important;
      margin-bottom: 0 !important;
      .el-input__inner {
        width: 284px;
        padding-left: 45px;
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
    .discount-wrapper {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 8px;
      .discount,
      .discount-value {
        margin-right: 0 !important;
        margin-bottom: 0 !important;
        ::v-deep.el-input__inner {
          width: 136px !important;
        }
      }
    }

    .no-currency {
      .el-input__inner {
        padding-left: 15px;
      }
    }

    .el-form-item {
      margin-right: 16px;
    }
    .item-remove {
      position: absolute !important;
      top: 0 !important;
      right: 8px !important;
      &__text {
        display: inline-block !important;
        cursor: pointer;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .span-icon {
        display: none !important;
      }
    }
  }
</style>
