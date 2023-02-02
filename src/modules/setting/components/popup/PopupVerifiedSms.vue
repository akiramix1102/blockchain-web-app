<template>
  <base-popup name="popup-verified-sms" class="popup-verify" width="480px" :open="handleOpen" :close="handleClose" :isShowFooter="false">
    <div slot="title">
      <span>{{ $t('popup.title.verification') }} </span>
    </div>
    <div class="content">
      <h3 class="text-2xl text-center text-semibold title-form">{{ $t('verified.titleContent2') }}</h3>
      <div class="be-flex verify-code">
        <base-icon icon="verify-phone" size="80"></base-icon>
        <div class="ml-1 w-100 input-code">
          <el-form :model="form" :rules="rules" ref="form-verify" @submit.prevent.native="handleSubmit">
            <el-form-item prop="code" :label="`${$t('verify.label')}`" class="no-require-label">
              <el-input type="text" v-model.trim="form.code" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-button :loading="isLoading" class="btn w-100 is-none-border cursor btn-submit btn-theme" @click="handleSubmit">{{ $t('verify.submit') }} </el-button>
      <div class="text-base be-flex jc-space-center mt-24 mb-24 text-grey-130 text-discript">
        {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCode"> {{ $t('verify.re-send') }} </span>
      </div>
      <!-- <div style="padding-bottom: 24px" class="text-base be-flex jc-space-center mt-12 text-grey-130 note-style use-voice-call">
        <span class="text-hyperlink text-semibold cursor" @click="handleCallSendCode"> {{ $t('verify.voice-call') }}</span>
      </div> -->
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import getRepository from '@/services'
  import WalletRepository from '@/services/repositories/wallet'
  import { SettingRepository } from '@/services/repositories/setting'
  import { AuthRepository } from '@/services/repositories/auth'
  import debounce from 'lodash/debounce'
  import { namespace } from 'vuex-class'
  import { IUser } from '@/interface'
  import includes from 'lodash/includes'
  const bcAuth = namespace('beAuth')
  const apiAuth: AuthRepository = getRepository('auth')
  const api: SettingRepository = getRepository('setting')
  @Component
  export default class PopupVerifySms extends Mixins(PopupMixin) {
    @bcAuth.State('user') user!: IUser
    @Prop({ required: true, type: Object, default: () => ({}) }) info!: Record<string, any>

    form: Record<string, any> = {
      code: ''
    }
    isLoading = false
    success: any = 0
    rules: Record<string, any> = {
      code: [
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
      return this.form.code.length !== 6
    }

    @Watch('form.code') watchCode(code: string): void {
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
    pushNotifi = false
    async resendCode(): Promise<void> {
      this.pushNotifi = true
      this.handleSendCode()
    }
    handleCallSendCode(): void {
      api.getProfile().then((res: any) => {
        const data = {
          country: res.data.country,
          phone: this.info.phone,
          countryCode: res.data.countryCode,
          email: this.info.email,
          phoneCall: true
        }
        let message: any = ''
        apiAuth.verifyPhone(data).then(() => {
          message = this.$t('notify.send-code-voice')
          this.$message.success({ message, duration: 5000 })
        })
      })
    }
    handleReset(): void {
      //@ts-ignore
      this.$refs['form-verify']?.clearValidate()
      this.form = {
        code: ''
      }
    }
    handleClose(): void {
      this.handleReset()
    }

    async handleSendCode(): Promise<void> {
      try {
        const data = {
          email: this.info.email,
          type: 'SMS',
          reason: ''
        }
        await apiAuth.resendCode(data).then(() => {
          if (this.pushNotifi) {
            let message: any = ''
            message = this.$t('notify.send-code')
            this.$message.success({ message, duration: 5000 })
          }
        })
      } catch (error: any) {
        let message: any = ''
        const { config, data } = error.response
        if (data.status === 'USER_BLOCKED' && includes(config.url, 'resendCode')) {
          message = this.$t('notify.user-blocked-resend-code')
          this.$message.error({ message, duration: 5000 })
        }
      }
      this.pushNotifi = false
    }

    handleOpen(): void {
      this.handleSendCode()
    }

    handleSubmit(): void {
      //@ts-ignore
      this.$refs['form-verify']?.validate(valid => {
        if (valid) {
          this.debounceFilter('handleSubmit')
        }
      })
    }
    async submit(): Promise<void> {
      try {
        this.isLoading = true
        const data = {
          email: this.info.email,
          verificationCode: this.form.code,
          type: 'SMS'
        }
        apiAuth
          .verifyCode('CODE', { ...data })
          .then(() => {
            this.setOpenPopup({
              popupName: 'popup-verified-sms',
              isOpen: false
            })
            this.isLoading = false
            this.$emit('follow2fa')
          })
          .catch(err => {
            this.isLoading = false
          })
      } catch (error) {
        this.isLoading = false
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
    &:focus {
      color: var(--bc-color-white);
    }
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
