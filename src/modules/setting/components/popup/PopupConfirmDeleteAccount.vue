<template>
  <base-popup name="popup-confirm-delete-account" class="popup-confirm-activity" width="480px">
    <div slot="title">
      <span>{{ $t('popup_delete-account-title') }}</span>
    </div>
    <div class="content">
      <p class="body-small text-desc">{{ $t('popup_delete-account-des') }}</p>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-default mr-15 text-regular btn-h40 btn-reset" @click="handleReset">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <button class="btn-default-bg text-regular btn-h40 bg-delete bth-theme" @click="handleConfirm">{{ $t('button.delete') }}</button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { SettingRepository } from '@/services/repositories/setting'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import getRepository from '@/services'
  const apiSetting: SettingRepository = getRepository('setting')
  import { namespace } from 'vuex-class'

  const bcAuth = namespace('beAuth')
  @Component
  export default class PopupConfirmDeleteAccount extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: '' }) type2Fa!: string | null
    @bcAuth.State('user')
    user!: Record<string, any>

    handleReset(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-delete-account',
        isOpen: false
      })
    }
    handleConfirm(): void {
      console.log('confirm delete account')
      this.$emit('delete')

      //   const data = {
      //     type: 'EMAIL',
      //     reason: ''
      //   }
      //   apiSetting.genCode(data).then(() => {
      //     console.log('a')
      //   })
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
