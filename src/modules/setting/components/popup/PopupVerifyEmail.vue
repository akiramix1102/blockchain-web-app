<template>
  <base-popup name="popup-verify-email" class="popup-verify" width="480px" :open="handleOpen" :close="handleClose" :isShowFooter="false">
    <div slot="title">
      <span>{{ $t('popup.title.verification') }}</span>
    </div>
    <div v-if="type === 'EMAIL'">
      <div class="content">
        <h3 class="text-2xl text-center text-semibold title-form">{{ $t('verified.titleContent3') }}</h3>
        <div class="be-flex verify-code">
          <div v-if="isDesktop"><base-icon icon="verify-email" size="80"></base-icon></div>
          <div class="ml-1 w-100 input-code">
            <el-form :model="form" :rules="rules" ref="form-verify" @submit.prevent.native="handleSubmit">
              <el-form-item prop="verificationCode" :label="`${$t('verify.label')}`" class="no-require-label">
                <el-input type="text" v-model.trim="form.verificationCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button :loading="isLoading" class="btn w-100 is-none-border cursor btn-submit btn-theme" :disabled="getDisableBtn" @click="handleSubmit"
          >{{ $t('verify.submit') }}
        </el-button>
        <div class="text-base be-flex jc-space-center mt-24 mb-24 text-grey-130 text-discript">
          {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="resendCode"> {{ $t('verify.re-send') }} </span>
        </div>
      </div>
    </div>
    <div v-if="type === 'SMS'">
      <div class="content">
        <h3 class="text-2xl text-center text-semibold title-form">{{ $t('verified.titleContent2') }}</h3>
        <div class="be-flex verify-code">
          <div v-if="isDesktop"><base-icon icon="verify-phone" size="80"></base-icon></div>
          <div class="ml-1 w-100 input-code">
            <el-form :model="form" :rules="rules" ref="form-verify" @submit.prevent.native="handleSubmit">
              <el-form-item prop="verificationCode" :label="`${$t('verify.label')}`" class="no-require-label">
                <el-input type="text" v-model.trim="form.verificationCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button :loading="isLoading" class="btn w-100 is-none-border cursor btn-submit btn-theme" :disabled="getDisableBtn" @click="handleSubmit"
          >{{ $t('verify.submit') }}
        </el-button>
        <div class="text-base be-flex jc-space-center mt-24 mb-24 text-grey-130 text-discript">
          {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="resendCode"> {{ $t('verify.re-send') }} </span>
        </div>
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
  //   import { SettingRepository } from '@/services/repositories/setting'
  import { AuthRepository } from '@/services/repositories/auth'
  import NftRepository from '@/services/repositories/nft'
  import { namespace } from 'vuex-class'

  //   const apiSetting: SettingRepository = getRepository('setting')
  const apiAuth: AuthRepository = getRepository('auth')
  const apiNft: NftRepository = getRepository('nft')

  const bcNft = namespace('bcNft')

  @Component
  export default class PopupVerifyEmail extends Mixins(PopupMixin) {
    @bcNft.State('isDesktop') isDesktop!: boolean
    // @Prop({ required: true, type: Object, default: () => ({}) }) data!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) info!: Record<string, any>
    @Prop({ required: true, type: String, default: '' }) type!: string
    @Prop({ required: true, type: String, default: '' }) quantity!: string
    @Prop({ required: true, type: String, default: '' }) note!: string
    form: Record<string, any> = {
      verificationCode: ''
    }
    result: Record<string, any> = {}
    pushNotifi = false
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
        this.handleResendCode()
      }
      if (nameAction == 'handleSubmit') {
        this.submit()
      }
    }, 400)
    handleResendCode(): void {
      this.debounceFilter('handleResendCode')
    }
    // async resendCode(): Promise<void> {
    //   let message: any = ''
    //   apiSetting
    //     .changePhone(this.type, { resendCode: 'new' })
    //     .then(() => {
    //       message = this.$t('notify.send-code')
    //       this.$message.success({ message, duration: 5000 })
    //     })
    //     .catch(error => {
    //       let message: any = ''
    //       const { config, data } = error.response

    //       if (data.status === 'USER_BLOCKED' && includes(config.url, 'resendCode')) {
    //         message = this.$t('notify.user-blocked-resend-code')
    //         this.$message.error({ message, duration: 5000 })
    //       }
    //       if (data.status === 'USER_LOCKED' && includes(config.url, 'resendCode')) {
    //         message = this.$t('notify.user-locked-resend-code')
    //         this.$message.error({ message, duration: 5000 })
    //       }
    //     })
    // }
    handleReset(): void {
      this.form = {
        verificationCode: ''
      }
      this.success = 0
    }
    handleClose(): void {
      this.isLoading = false
      //@ts-ignore
      this.$refs['form-verify'].clearValidate()
      this.handleReset()
    }

    handleOpen(): void {
      console.log('open')
      this.handleSendCode()
    }
    handleSubmit(): void {
      this.isLoading = true
      this.debounceFilter('handleSubmit')
    }

    async handleSendCode(): Promise<void> {
      try {
        const data = {
          email: this.info.email,
          type: this.type
        }
        await apiAuth.resendCode(data).then(() => {
          let message: any = ''
          message = this.$t('notify.send-code')
          this.$message.success({ message, duration: 5000 })
        })
      } catch (error: any) {
        let message: any = ''
        const { config, data } = error.response
        if (data.status === 'USER_BLOCKED' && includes(config.url, 'resendCode')) {
          message = this.$t('notify.user-blocked-resend-code')
          this.$message.error({ message, duration: 5000 })
        }
      }
    }

    async resendCode(): Promise<void> {
      try {
        const data = {
          email: this.info.email,
          type: this.type
        }
        await apiAuth.resendCode(data).then(() => {
          let message: any = ''
          message = this.$t('notify.send-code')
          this.$message.success({ message, duration: 5000 })
        })
      } catch (error: any) {
        let message: any = ''
        const { config, data } = error.response
        if (data.status === 'USER_BLOCKED' && includes(config.url, 'resendCode')) {
          message = this.$t('notify.user-blocked-resend-code')
          this.$message.error({ message, duration: 5000 })
        }
      }
    }
    async submit(): Promise<void> {
      //@ts-ignore
      this.$refs['form-verify']?.validate(async valid => {
        if (valid) {
          const data = {
            itemId: this.nftItem.id,
            quantity: this.quantity,
            note: this.note,
            verificationCode: this.form.verificationCode
          }
          const result = await apiNft.useNFT(data)
          if (result.status === 'SUCCESS') {
            this.setOpenPopup({
              popupName: 'popup-verify-email',
              isOpen: false
            })
            this.$emit('status', result)
          } else {
            this.form.verificationCode = ''
            this.isLoading = false
          }
        }
      })
    }
  }

  //@ts-ignore
</script>

<style scoped lang="scss">
  .btn {
    padding: 12px 0 !important;
    font-size: 16px !important;
    line-height: 24px !important;
  }
  .title-form {
    color: #0a0b0d;
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
  //   @media screen and (max-width: 768px) {
  //     ::v-deep.popup-verify {
  //       .el-dialog {
  //         width: 335px !important;
  //         &__header {
  //           .title {
  //             font-weight: 600;
  //             font-size: 16px;
  //             line-height: 24px;
  //           }
  //         }
  //       }
  //     }

  //     .title-form {
  //       font-weight: 600;
  //       font-size: 20px;
  //       line-height: 24px;
  //     }
  //   }

  ::v-deep.input-code {
    .el-form {
      .el-form-item__label {
        font-weight: 600;
        font-size: 16px;
        color: #5b616e;
      }
    }
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
                .hide-mobile {
                  display: none;
                }
                .input-code {
                  margin-left: 0 !important;
                  .el-form {
                    .el-form-item__label {
                      font-weight: 600;
                      font-size: 16px;
                      line-height: 150%;
                      color: #5b616e;
                    }
                  }
                }
              }
              .text-discript {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
              }
            }
          }
        }
      }
    }
  }
</style>
