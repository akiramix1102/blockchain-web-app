<template>
  <base-popup name="popup-verify-phone" class="popup-verify" width="480px" :open="handleOpen" :close="handleClose" :isShowFooter="false">
    <div slot="title">
      <span>{{ $t('popup.title.verification') }}</span>
    </div>
    <div class="content">
      <h3 class="text-2xl text-center text-semibold title-form">{{ $t('verified.titleContent2') }}</h3>
      <div class="be-flex verify-code">
        <base-icon icon="verify-phone" size="80"></base-icon>
        <div class="ml-1 w-100 input-code">
          <el-form :model="form" :rules="rules" ref="form-verify" @submit.prevent.native="handleSubmit">
            <el-form-item prop="verificationCode" :label="`${$t('verify.label')}`" class="no-require-label">
              <el-input type="text" v-model.trim="form.verificationCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-button :loading="isLoading" class="btn w-100 is-none-border cursor btn-submit btn-theme" @click="handleSubmit">{{ $t('verify.submit') }} </el-button>
      <div class="text-base be-flex jc-space-center mt-24 mb-24 text-grey-130 text-discript">
        {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCode"> {{ $t('verify.re-send') }} </span>
      </div>
      <div style="padding-bottom: 24px" class="text-base be-flex jc-space-center mt-12 text-grey-130 note-style use-voice-call">
        <span class="text-hyperlink text-semibold cursor" @click="handleCallSendCode"> {{ $t('verify.voice-call') }}</span>
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
  import { AuthRepository } from '@/services/repositories/auth'
  const apiAuth: AuthRepository = getRepository('auth')

  const apiSetting: SettingRepository = getRepository('setting')

  @Component
  export default class PopupVerifyPhone extends Mixins(PopupMixin) {
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

    get getIcon(): string {
      const name = this.$route.name
      if (name === 'verify-phone') {
        return 'verify-phone'
      }
      if (name === 'verify-email') {
        return 'verify-email'
      }
      return 'verify-app'
    }

    @Watch('form.verificationCode') watchCode(code: string): void {
      if (code) {
        //@ts-ignore
        this.$refs['form-verify']?.clearValidate()
      }
    }

    // get getTittle(): string | any {
    //   const name = this.$route.name
    //   if (name === 'verify-phone') {
    //     return this.$t('verify.title-phone')
    //   }
    //   if (name === 'verify-email') {
    //     return this.$t('verify.title-email')
    //   }
    //   return this.$t('verify.title-app')
    // }
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
      apiSetting
        .changePhone(this.data, { resendCode: 'new' })
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
          this.isLoading = true
          const data = {
            ...this.data,
            verificationCodeOldPhone: null,
            verificationCodeNewPhone: this.form.verificationCode
          }
          apiSetting
            .changePhoneVerification(data)
            .then(() => {
              let message: any = ''
              message = this.$t('notify.verify-success')
              this.$message.success({ message, duration: 5000 })
              this.setOpenPopup({
                popupName: 'popup-verify-phone',
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
    async handleCallSendCode(): Promise<void> {
      //
      const rs = await apiAuth.voiceVerify()
      if (rs) {
        let message = this.$t('notify.send-code-voice') as string
        this.$message.success({ message, duration: 5000 })
      }
    }
  }
</script>

<style scoped lang="scss">
  .btn {
    padding: 12px 0 !important;
    font-size: 16px !important;
    line-height: 24px !important;
  }
  .title-form {
    color: #201f1e;
    margin-bottom: 3px;
    word-break: break-word;
  }
  .input-code {
    margin-top: 17px;
  }
  .btn-submit {
    margin-bottom: 24px;
  }
  .text-discript {
    margin-top: 0px !important;
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
      }
    }
  }
</style>
