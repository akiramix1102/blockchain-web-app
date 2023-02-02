<template>
  <base-popup name="popup-open-maketplace" class="popup-open-maketplace" width="400px" :closePressEscape="false">
    <div slot="title" class="header-popup">
      <p>{{ $t('title-verify-code') }}</p>
    </div>
    <div class="content">
      <el-form autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" @submit.prevent.native="handleConfirm">
        <el-form-item :label="$t('label-password-maket')" class="break-word">
          <el-input :placeholder="$t('placeholder-enter-password-maket')" autocomplete="new-password" :readonly="false" v-model="passMarket" type="password" />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="footer">
      <el-button class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import Cookies from 'js-cookie'
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  @Component({ components: {} })
  export default class PopupBuyNft extends Mixins(PopupMixin) {
    passMarket = ''

    handleConfirm(): void {
      let message = ''
      if (this.passMarket) {
        if (this.passMarket == '2988') {
          Cookies.set('hasPassMarket', this.passMarket, { expires: 1 })
          this.setOpenPopup({
            popupName: 'popup-open-maketplace',
            isOpen: false
          })
        } else {
          message = this.$t('notify_wrong-code') as string
        }
      } else {
        message = this.$t('please-enter-pass') as string
      }
      if (message) {
        this.$message.error({ message, duration: 5000 })
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-open-maketplace {
    @media screen and (max-width: 400px) {
      .el-dialog {
        width: calc(100% - 30px) !important;
      }
    }
  }
</style>
