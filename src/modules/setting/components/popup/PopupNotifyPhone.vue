<template>
  <base-popup name="popup-notify-phone" class="popup-change-number-phone" width="480px">
    <div slot="title">
      <span>{{ $t('popupChangeNumberPhone.title-notify') }}</span>
    </div>
    <div class="content">
      <p>{{ $t('popupChangeNumberPhone.content') }}</p>
    </div>
    <div slot="footer" class="footer">
      <div @click="handleClose" class="btn-action btn-close">{{ $t('popupChangeNumberPhone.cancel') }}</div>
      <div @click="handleSubmit" class="btn-action btn-submit">{{ $t('popupChangeNumberPhone.verify') }}</div>
    </div>
  </base-popup>
</template>
<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  @Component({ components: {} })
  export default class PopupNotifyPhone extends Mixins(PopupMixin) {
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-notify-phone',
        isOpen: false
      })
    }

    handleSubmit(): void {
      this.setOpenPopup({
        popupName: 'popup-notify-phone',
        isOpen: false
      })
      this.$emit('submit')
    }
  }
</script>
<style scoped lang="scss">
  .popup-change-number-phone {
    .content {
      padding-bottom: 24px;
      .label {
        margin-top: 24px;
        color: var(--bc-text-primary);
        .required {
          color: var(--bc-required);
        }
      }
      .el-select {
        width: 100%;
      }
      .input-new-phone {
        display: flex;
        margin-top: 8px;
        .mini-box {
          width: 48px;
          height: 48px;
          background: var(--bc-color-grey20);
          text-align: center;
          line-height: 48px;
          font-weight: 400;
          font-size: 14px;
          color: var(--bc-text-discript);
          display: inline-block;
          border: 1px solid var(--bc-color-grey50);
          border-radius: 4px 0 0 4px;
          border-right: none;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .btn-action {
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        border-radius: 6px;
        &:hover {
          color: var(--bc-btn-default-text-hover);
          border: 1px solid var(--bc-btn-default-border-hover);
        }
      }
      .btn-close {
        font-size: 14px;
        background: var(--bc-color-white);
        border: 1px solid var(--bc-color-grey50);
        color: var(--bc-color-grey150);
        margin-right: 16px;
        &:hover {
          border-color: var(--bc-btn-default-border-hover);
          background: var(--bc-btn-default-text-hover);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .btn-submit {
        min-width: 100px;
        width: auto;
        padding: 0 10px;
        font-size: 14px;
        border: none;
        color: var(--bc-color-white);
        background: var(--bc-theme-primary-gradient);
        &:hover {
          border: none;
          color: var(--bc-color-white);
          background: var(--bc-theme-primary-gradient-hover) !important;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    ::v-deep.popup-change-number-phone {
      .el-dialog {
        width: 335px !important;
        &__header {
          .title {
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
          }
        }
      }
    }
  }
</style>
