<template>
  <base-popup name="popup-verify-mail-external" class="popup-verify" width="480px" :open="handleOpen" :close="handleClose" :isShowFooter="false">
    <div slot="title">
      <span>{{ $t('popup.title.verification') }}</span>
    </div>
    <div class="content">
      <h3 class="text-2xl text-center text-medium title-form">{{ $t('verified.titleContent3') }}</h3>
      <div class="be-flex verify-code">
        <base-icon icon="verify-email" class="hide-on-mobile" size="80"></base-icon>
        <div class="ml-1 w-100 input-code">
          <el-form :model="form" :rules="rules" ref="form-verify" @submit.prevent.native="handleSubmit">
            <el-form-item prop="verificationCode" :label="`${$t('verify.label')}`" class="no-require-label">
              <el-input type="text" v-model.trim="form.verificationCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--      <base-button-linear @click.native="handleSubmit">{{ $t('verify.submit') }}</base-button-linear>-->
      <el-button class="btn w-100 is-none-border cursor btn-theme" :disabled="getDisableBtn" @click="handleSubmit">
        {{ $t('verify.submit') }}
      </el-button>
      <div class="text-base be-flex jc-space-center mt-24 mb-24 text-grey-130 text-discript">
        {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="resendCode"> {{ $t('verify.re-send') }} </span>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import getRepository from '@/services'

  import debounce from 'lodash/debounce'
  import includes from 'lodash/includes'
  import { SettingRepository } from '@/services/repositories/setting'

  const apiSetting: SettingRepository = getRepository('setting')

  @Component
  export default class PopupVerifyMailExternal extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) data!: Record<string, any>
    form: Record<string, any> = {
      verificationCode: ''
    }
    isLoading = false
    success: any = 0
    rules: Record<string, any> = {
      verificationCode: [
        {
          required: true,
          message: this.$t('verify.wrong-code'),
          trigger: 'blur'
        },
        {
          len: 6,
          message: this.$t('changePassword.errorLengthVerificationCode'),
          trigger: 'blur'
        }
      ]
    }

    get getDisableBtn(): boolean {
      return this.form.verificationCode.length !== 6
    }

    @Watch('form.verificationCode') watchCode(code: string): void {
      if (code) {
        //@ts-ignore
        this.$refs['form-verify']?.clearValidate()
      }
    }

    // debounce chan doble click
    debounceFilter = debounce((nameAction: any) => {
      if (nameAction == 'handleResendCode') {
        this.resendCode()
      }
      if (nameAction == 'handleSubmit') {
        this.submit()
      }
    }, 400)

    handleResendCode(): void {
      this.debounceFilter('handleResendCode')
    }

    async resendCode(): Promise<void> {
      let message: any = ''
      let payload = {
        type: 'EMAIL',
        email: this.data.email
      }
      apiSetting
        .securityCode(payload)
        .then(() => {
          message = this.$t('notify.send-code')
          this.$message.success({ message, duration: 5000 })
        })
        .catch(error => {
          let message: any = ''
          const { config, data } = error.response

          if (data.status === 'USER_BLOCKED' && includes(config.url, 'resendCode')) {
            message = this.$t('notify.user-blocked-resend-code')
            this.$message.error({ message, duration: 5000 })
          }
          if (data.status === 'USER_LOCKED' && includes(config.url, 'resendCode')) {
            message = this.$t('notify.user-locked-resend-code')
            this.$message.error({ message, duration: 5000 })
          }
        })
    }

    handleReset(): void {
      this.form = {
        verificationCode: ''
      }
      this.success = 0
    }

    handleClose(): void {
      //@ts-ignore
      this.$refs['form-verify'].clearValidate()
      this.handleReset()
    }

    handleOpen(): void {
      console.log('open')
    }

    handleSubmit(): void {
      this.debounceFilter('handleSubmit')
    }

    async submit(): Promise<void> {
      //@ts-ignore
      this.$refs['form-verify']?.validate(async valid => {
        if (valid) {
          console.log(this.data)
          this.isLoading = true
          const data = {
            email: this.data.email,
            displayName: this.data.displayName,
            verificationCode: this.form.verificationCode
          }
          apiSetting
            .updateProfileExternalWallet(data)
            .then(() => {
              let message: any = ''
              message = this.$t('notify.verify-success')
              this.$message.success({ message, duration: 5000 })
              this.setOpenPopup({
                popupName: 'popup-verify-mail-external',
                isOpen: false
              })
              this.$emit('reload')
            })
            .catch(() => {
              this.isLoading = false
            })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.btn-send {
    .custom-button {
      .f-button {
        padding: 0 !important;
      }
    }
  }

  ::v-deep.base-popup .el-dialog__body {
    border-radius: 8px;
  }

  .btn {
    padding: 12px 0 !important;
    font-size: 16px !important;
    line-height: 24px !important;
  }

  .title-form {
    color: var(--bc-text-primary);
    margin-bottom: 3px;
    word-break: break-word;
    font-weight: 600;
  }

  .verify-code {
    align-items: center;
  }

  .hide-on-mobile {
    display: inline-flex;
  }

  .input-code {
    margin-top: 18px;

    ::v-deep.el-form {
      .el-form-item__label {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: var(--bc-text-discript);
      }

      .el-form-item__content {
        .el-input {
          input::placeholder {
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #cccfd6;
          }
        }
      }
    }
  }

  .btn-submit {
    margin-bottom: 24px;
  }

  .text-discript {
    font-weight: 400;
    line-height: 24px;
  }

  .btn-theme {
    background: var(--bc-tab-active);
    color: #fff;
  }

  .btn-theme:hover {
    border: none;
    color: var(--bc-color-white);
    background: var(--bc-theme-primary-gradient-hover);
  }

  @media screen and (max-width: 768px) {
    ::v-deep.popup-verify {
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
              .title-form {
                font-weight: 600;
                font-size: 20px;
                line-height: 24px;
                color: #0a0b0d;
              }

              .verify-code {
                .hide-on-mobile {
                  display: none;
                }

                .input-code {
                  margin-left: 0 !important;

                  .el-form-item__label {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 24px;
                    color: var(--bc-text-discript);
                  }

                  .el-form-item__content {
                    .el-input {
                      input::placeholder {
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 24px;
                        color: #cccfd6;
                      }
                    }
                  }
                }
              }

              .text-discript {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                font-weight: 400;
                font-size: 14px;
                line-height: 24px;
                color: var(--color-secondary);

                span {
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 24px;
                  color: var(--bc-text-hyperlink);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
