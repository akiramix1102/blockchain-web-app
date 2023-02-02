<template>
  <base-popup name="popup-cancel-all" class="popup-cancel" width="600px" :close="handleClose" :isShowFooter="true">
    <div slot="title">
      <span class="title-cancel">CANCEL ALL ORDERS</span>
    </div>
    <div class="content">
      <div class="overlay">Are you sure you want to cancel all orders ?</div>
    </div>
    <div class="footer" slot="footer">
      <button class="btn-default text-semibold btn-h40 btn-cancel-popup mr-16" @click="closePopup">
        <p class="">{{ $t('button.cancel') }}</p>
      </button>
      <button class="btn-default mr-4 text-semibold btn-h40 btn-cancel-popup">{{ $t('button.confirm') }}</button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'

  @Component({ components: {} })
  export default class PopupCancelAll extends Mixins(PopupMixin) {
    isLoading = true
    // onDecode(result: string | any): void {
    //   this.$emit('scan', result.split('ethereum:').join(''))
    // }

    // async onInit(promise: any): Promise<any> {
    //   try {
    //     await promise
    //     this.isLoading = false
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    handleClose(): void {
      this.isLoading = true
      this.$emit('close')
    }
    closePopup(): void {
      this.setOpenPopup({
        popupName: 'popup-cancel-all',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .btn-cancel-popup {
    background: #21242a;
    border: 1px solid #31353e;
    color: var(--color-text-primary);
  }
  .popup-cancel .el-dialog {
    background: #21242a;
  }
  .popup-cancel .el-dialog__header {
    border-bottom: 1px solid var(--color-background-filter);
  }
  .popup-cancel .el-dialog__footer {
    border-top: 1px solid var(--color-background-filter);
  }
  .base-popup .el-dialog__body {
    margin-bottom: 24px;
    .content {
      color: var(--color-text-primary);
    }
  }
  .title-cancel {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: var(--color-text-primary);
  }
</style>
