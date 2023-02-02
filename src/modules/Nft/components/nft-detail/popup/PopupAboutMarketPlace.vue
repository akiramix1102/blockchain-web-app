<template>
  <base-popup name="popup-about-marketplace" class="popup-about-marketplace" width="480px" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p>{{ $t('detail-nft.popupAboutMarketplace.header-about') }}</p>
    </div>
    <div class="content">
      <el-form ref="contact" :model="contact" :rules="rules" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        <el-form-item :label="$t('detail-nft.popupAboutMarketplace.content-name')" class="text-title" prop="name">
          <el-input class="message-input" v-model="contact.name" :placeholder="$t('detail-nft.popupAboutMarketplace.place-name')" />
        </el-form-item>
        <el-form-item :label="$t('detail-nft.popupAboutMarketplace.content-email')" class="text-title" prop="email">
          <el-input class="message-input" type="email" pattern=".+@globex\.com" v-model="contact.email" :placeholder="$t('detail-nft.popupAboutMarketplace.place-email')" />
        </el-form-item>
        <el-form-item :label="$t('detail-nft.popupAboutMarketplace.content-phone')" class="text-title" prop="phone">
          <el-input class="message-input" maxlength="10" type="number" v-model="contact.phone" :placeholder="$t('detail-nft.popupAboutMarketplace.place-phone')" />
        </el-form-item>
        <el-form-item :label="$t('detail-nft.popupAboutMarketplace.content-message')" class="text-title message">
          <el-input
            class="message-input"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="contact.message"
            type="textarea"
            :placeholder="$t('detail-nft.popupAboutMarketplace.place-message')"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-default mr-15 text-regular btn-h40" @click="handleCancel">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" :class="getDisableSubmit ? 'btn--disabled' : null" @click="handleConfirm('contact')">{{
        $t('detail-nft.popupAboutMarketplace.footer-send')
      }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import PopupMixin from '@/mixins/popup'

  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class PopupAboutMarketplace extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    name = ''
    contact: any = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
    isCheckEmail = false

    rules: Record<string, any> = {
      email: [
        {
          required: true,
          message: this.$t('login.wrong-email'),
          trigger: 'blur'
        },
        { type: 'email', message: this.$t('login.wrong-email-type'), trigger: ['blur', 'change'] }
      ],
      name: [
        {
          required: true,
          message: this.$t('login.wrong-name'),
          trigger: 'blur'
        }
        // { type: 'email', message: this.$t('login.wrong-name-type'), trigger: 'blur' }
      ],
      phone: [
        {
          required: true,
          message: this.$t('login.wrong-phone'),
          trigger: 'blur'
        }
        // { type: 'email', message: this.$t('login.wrong-name-type'), trigger: 'blur' }
      ]
    }
    //     ValidateEmail() {
    //           if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.contact.email))
    //   {
    //          return this.isCheckEmail =true
    //   }
    //     return this.isCheckEmail =false
    // }

    // validateEmail = email => {
    //   return String(email)
    //     .toLowerCase()
    //     .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    // }

    // validate = () => {
    //   const $result = $('#result')
    //   const email = $('#email').val()
    //   $result.text('')

    //   if (validateEmail(email)) {
    //     $result.text(email + ' is valid :)')
    //     $result.css('color', 'green')
    //   } else {
    //     $result.text(email + ' is not valid :(')
    //     $result.css('color', 'red')
    //   }
    //   return false
    // }

    // $('#email').on('input', validate);

    get getDisableSubmit(): boolean {
      return !(this.contact.name && this.contact.email && this.contact.phone)
    }

    handleOpen(): void {
      this.setOpenPopup({
        popupName: 'popup-about-marketplace',
        isOpen: true
      })
    }
    handleClose(): void {
      //@ts-ignore
      this.$refs['contact']?.clearValidate()
      this.setOpenPopup({
        popupName: 'popup-about-marketplace',
        isOpen: false
      })
      this.contact = {
        name: '',
        email: '',
        phone: '',
        message: ''
      }
    }
    handleCancel() {
      this.setOpenPopup({
        popupName: 'popup-about-marketplace',
        isOpen: false
      })
      this.contact = {
        name: '',
        email: '',
        phone: '',
        message: ''
      }
    }
    //
    //  submitForm(formName) {
    //     this.$refs[formName].validate((valid) => {
    //       if (valid) {
    //         alert('submit!');
    //       } else {
    //         console.log('error submit!!');
    //         return false;
    //       }
    //     });
    //   },

    handleConfirm(contact): void {
      //@ts-ignore
      this.$refs['contact'].validate(valid => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.postContact()
    }

    async postContact(): Promise<void> {
      const params = {
        phone: this.contact.phone,
        fromEmail: this.contact.email,
        content: this.contact.message,
        name: this.contact.name
      }
      await apiNft.postContactMarketplace(params)
      let message = this.$t('notify.popup-contact-success') as string
      this.$message.success({ message, duration: 5000 })
      this.setOpenPopup({
        popupName: 'popup-about-marketplace',
        isOpen: false
      })
      if (this.contact.checkPass !== '') {
        // this.$refs.contact.validateField('checkPass')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-about-marketplace {
    .message-input {
      font-size: 16px;
    }
    .right {
    }
  }
  ::v-deep.popup-about-marketplace {
    .message-input {
      ::placeholder {
        font-size: 16px;
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-about-marketplace {
      scroll-behavior: behavior;
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .popup-content {
          .text-content {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 16px !important;
          }
          .el-form-item {
            margin-bottom: 16px;
          }
          .el-input__inner {
            font-size: 16px;
            line-height: 24px;
            font-weight: 400;
            border-color: #dbdbdb;
            color: #0a0b0d;
          }
        }
      }
      .footer,
      .popup-footer {
        button {
          max-width: 100px;
          width: 100%;
          font-size: 14px !important;
          line-height: 20px !important;
          font-weight: 600 !important;
        }
      }
    }
  }
</style>
