<template>
  <div class="base-input">
    <el-input
      type="text"
      class="input"
      :value="value"
      @input="emitValue"
      :readonly="isReadOnly"
      :class="[isReadOnly ? 'read-only' : '', isShowSelect ? 'is-select' : '']"
      @keyup.native="numberFormat"
      @keypress.native="onlyNumber"
    >
      <template slot="prefix">{{ textPrefix }}</template>
      <template slot="suffix"><span v-html="textSuffix"></span></template>
      <template slot="prepend" v-if="isShowSelect">
        <div class="input-filter cursor">
          <el-dropdown trigger="click" @command="selectStep" placement="bottom">
            <span class="text-trade-primary">
              {{ stepFilter }}
              <span class="text-desc"><i class="el-icon-caret-bottom"></i></span>
            </span>
            <el-dropdown-menu slot="dropdown" :popper-append-to-body="false" class="step-filter-dropdown">
              <el-dropdown-item v-for="step in stepFilterArr" :key="step" :command="step" :class="step === stepFilter ? 'step-select--active' : ''">
                <span>{{ step }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </el-input>
  </div>
</template>
<script lang="ts">
  import { includes } from 'lodash'
  import { Vue, Component, Prop } from 'vue-property-decorator'
  @Component({ components: {} })
  export default class BaseInput extends Vue {
    @Prop({ required: false, type: String, default: '' }) textPrefix!: string
    @Prop({ required: false, type: String, default: '' }) value!: string
    @Prop({ required: false, type: String, default: 'USDT' }) textSuffix!: string
    @Prop({ required: false, type: Boolean, default: false }) isReadOnly!: boolean
    @Prop({ required: false, type: Boolean, default: false }) isShowSelect!: boolean
    // @Prop({ required: true, type: String, default: 'right' }) alignText!: string
    price = ''
    select = ''
    stepFilterArr: Array<string> = ['Total', 'Amount']
    stepFilter = 'Total'

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      console.log('>>> / file: BaseInput.vue / line 50 / fnumber', fnumber)
      if ((_event.keyCode > 47 && _event.keyCode < 58) || (_event.keyCode > 95 && _event.keyCode < 106)) {
        console.log('abc')
        if (fnumber.length > 0) {
          fnumber = fnumber.replaceAll(',', '')
          fnumber = this.$options.filters?.numberWithCommas(fnumber)
          _event.target.value = fnumber
        }
      }
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.price, '.')) {
        event.preventDefault()
      }
    }

    handleChangeSelect(value: any): void {
      //
      this.$emit('select', value)
    }

    emitValue(value: any): void {
      this.$emit('input', value)
    }
    selectStep(selectStep: string): void {
      this.stepFilter = selectStep
      this.$emit('type', selectStep)
    }
  }
</script>
<style lang="scss" scoped>
  .base-input {
    .input {
      margin-bottom: 16px;
    }
  }
  ::v-deep.base-input {
    height: 40px;
    margin-bottom: 16px;
    .el-input {
      position: relative;
      box-sizing: border-box;
      .el-input__inner {
        background: var(--color-background);
        border: 1px solid var(--color-border-primary);
        text-align: right;
        padding-right: 56px;
        padding-left: 80px;
        font-size: 14px;
        // line-height: 24px;
        font-weight: 400;

        color: var(--color-text-primary);
        display: flex;
        align-items: center;
      }
      .el-input__suffix {
        align-items: center;
        margin-right: 8px;
        display: flex;
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        color: var(--color-text-primary);
      }
      .el-input__prefix {
        align-items: center;
        margin-left: 8px;
        display: flex;
        color: var(--color-text-secondary);
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
      }

      .el-input-group__prepend {
        background: var(--color-background);
        border: 1px solid var(--color-border-primary);
        border-right: 0;
      }

      &::before {
        content: '';
        position: absolute;
      }

      &:hover {
        background-image: var(--color-active-primary);
        padding: 1px;
        width: 100%;
        border-radius: 4px;

        & .el-input__inner {
          border-width: 0px;
          height: 38px;
        }

        & .el-input-group__prepend {
          height: 38px;
          border: none;
        }
      }
    }
  }
  .read-only {
    ::v-deep.el-input__inner {
      background: var(--color-border-primary) !important;
    }
    &:hover {
      background-image: none !important;
      padding: 0 !important;

      & ::v-deep.el-input__inner {
        border-width: 0px !important;
        height: 40px !important;
      }
    }
  }

  .is-select {
    ::v-deep.el-input-group__prepend {
      padding: 0 0px 0 12px;

      .input-filter {
        border-right: 1px solid var(--color-border-primary);
        padding-right: 10px;

        .text-desc {
          margin-left: 4px;
        }

        .text-trade-primary {
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
        }
      }
    }

    ::v-deep.el-input__inner {
      border-left: none !important;
      padding-left: 12px !important;
      position: relative;
    }
  }

  .step-filter-dropdown {
    background: var(--color-background-element);
    border: 0.5px solid var(--color-border-primary);
    .step-select--active {
      & > span {
        background: var(--color-active-primary) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }
      font-size: 14px;
    }
    .el-dropdown-menu__item {
      font-weight: 400;
    }
  }
</style>
