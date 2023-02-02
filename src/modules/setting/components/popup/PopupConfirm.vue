<template>
  <base-popup name="popup-confirm-activity" class="popup-confirm-activity" width="480px">
    <div slot="title">
      <span>{{ $t('setting.activity.delete') }}</span>
    </div>
    <div class="content">
      <h3 class="text-2xl text-bold text-center" style="margin-bottom: 8px; color: #0a0b0d">{{ $t('setting.activity.question-delete') }}</h3>
      <h4 class="text-base text-center" style="color: #5b616e">{{ $t('setting.activity.warning') }}</h4>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-default mr-15 text-regular btn-h40 btn-reset" @click="hanldeReset">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <button class="btn-default-bg text-regular btn-h40 bg-delete bth-theme" @click="handleConfirm">{{ $t('button.delete') }}</button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins } from 'vue-property-decorator'

  @Component
  export default class PopupConfirm extends Mixins(PopupMixin) {
    hanldeReset(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-activity',
        isOpen: false
      })
    }
    handleConfirm(): void {
      this.$emit('confirm')
      this.hanldeReset()
    }
  }
</script>

<style scoped lang="scss">
  .content {
    padding-bottom: 24px;
  }
  .btn-reset {
    &:hover {
      p {
        border-color: var(--bc-btn-default-border-hover);
        background: var(--bc-btn-default-text-hover);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .bg-delete {
    background: var(--bc-theme-primary-gradient);
    &:hover {
      background: var(--bc-theme-primary-gradient-hover) !important;
    }
  }
  @media screen and (max-width: 768px) {
    ::v-deep.popup-confirm-activity {
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
              h3 {
                font-weight: 600;
                font-size: 20px;
                line-height: 24px;
                word-break: break-word;
              }
              h4 {
                word-break: break-word;
              }
            }
          }
        }
        &__footer {
          .popup-footer {
            .btn-reset,
            .bg-delete {
              font-weight: 600;
              font-size: 14px;
              line-height: 20px;
              width: 100px;
            }
            .bg-delete {
              background: #cf202f;
            }
          }
        }
      }
    }
  }
</style>
