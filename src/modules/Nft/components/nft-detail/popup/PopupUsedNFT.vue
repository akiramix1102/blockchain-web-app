<template>
  <base-popup name="popup-use-nft" class="popup-use-nft" width="480px" :open="handleCommand" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.pop-use.title') }}</p>
    <div class="content">
      <div class="be-flex jc-space-between w-100" slot="label">
        <span style="color: #0a0b0d">{{ $t('label_quantity') }}</span>
        <span class="available"
          >{{ $t('label_available') }}: <span class="remain">{{ remainQuantity }}</span></span
        >
      </div>
      <el-input class="input-quantity" :class="inputQuantity || form.quantity === '' ? 'mb-24' : 'mb-8'" size="large" type="number" v-model="form.quantity"></el-input>
      <span class="quantity" v-if="!inputQuantity && form.quantity !== ''">{{ $t('detail-nft.pop-use.inputQuantity') }} {{ remainQuantity }}</span>
      <p class="text-note">{{ $t('detail-nft.pop-use.text-note') }}</p>
      <p class="text-des" v-if="isDesktop">{{ $t('detail-nft.pop-use.text-des') }}</p>

      <el-input class="area" type="textarea" v-model="form.note" :placeholder="`${$t('detail-nft.pop-use.placeholder')}`"></el-input>

      <div>
        <div class="el-form chk-accept" v-if="isShowCheckboxAccept">
          <el-checkbox v-model="checkedAccept">
            <div class="terms text-left" style="font-size: 16px; line-height: 24px; margin-bottom: 24px; font-weight: 400; color: var(--bc-text-discript)">
              {{ $t('text-tern.click-confirm') }}
              <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
                {{ $t('text-tern.term') }}</a
              >
            </div></el-checkbox
          >
        </div>
        <div v-else class="terms text-left" style="font-size: 16px; line-height: 24px; margin-bottom: 24px; font-weight: 400; color: var(--bc-text-discript)">
          {{ $t('text-tern.click-confirm') }}
          <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
            {{ $t('text-tern.term') }}</a
          >
        </div>
      </div>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-cancel">
        <p class="text-cancel" @click="handleClose">{{ $t('detail-nft.pop-report.cancel') }}</p>
      </button>
      <button class="btn-report" :disabled="disableConfirm" :class="disableConfirm && 'disable'" @click="handleConfirm">
        <p class="text-report">{{ $t('detail-nft.pop-use.confirm') }}</p>
      </button>
    </div>
    <!-- body.modal-open { overflow: hidden; } -->
    <PopupVerifyEmail :type="typeVerify" :nftItem="nftItem" :quantity="form.quantity" :note="form.note" @status="close" :info="info" />
    <PopupNotifySuccess />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'
  import filter from 'lodash/filter'
  import { namespace } from 'vuex-class'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  import PopupVerifyEmail from '@/modules/setting/components/popup/PopupVerifyEmail.vue'
  import NftRepository from '@/services/repositories/nft'
  import PopupNotifySuccess from '../../base/PopupNotifySuccess.vue'
  const bcAuth = namespace('beAuth')

  const apiSetting: SettingRepository = getRepository('setting')
  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { PopupVerifyEmail, PopupNotifySuccess } })
  export default class PopupUsedNFT extends Mixins(PopupMixin, OnChainMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) info!: Record<string, any>
    @Prop({ required: true, type: Number, default: 0 }) remainQuantity!: number
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Array<Record<string, any>>

    form: Record<string, any> = {
      quantity: '',
      note: ''
    }
    typeVerify = ''
    async handleCommand(): Promise<void> {
      const params = {
        email: this.info.email
      }
      this.typeVerify = await apiSetting.get2fa(params)
      console.log('>>> / file: PopupUsedNFT.vue / line 70 / typeVerify', this.typeVerify)
    }
    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-use-nft',
        isOpen: false
      })
    }

    get inputQuantity(): boolean {
      return this.form.quantity <= this.nftItem.myRemainQuantity && this.form.quantity > 0
    }

    close(result): void {
      console.log('>>> / file: PopupUsedNFT.vue / line 116 / result', result)
      if (result.status === 'SUCCESS') {
        this.handleClose()
        this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
      } else {
        this.handleClose()
      }
    }

    handleClose(): void {
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-use-nft',
        isOpen: false
      })
      this.form = {
        quantity: '',
        note: ''
      }
      this.checkedAccept = false
      this.$emit('updateRemainQuantity')
    }
    get getTerm(): string {
      if (this.systemParamsPublic.length) {
        const param = filter(this.systemParamsPublic, param => param.key === 'system.marketplace.terms.and.conditions')
        return (param[0] && param[0].value) || ''
      }
      return ''
    }

    async handleConfirm(): Promise<void> {
      if (this.typeVerify === 'EMAIL' || this.typeVerify === 'SMS') {
        this.setTypeOfAction('use-nft')
        this.setOpenPopup({
          popupName: 'popup-verify-email',
          isOpen: true
        })
      } else if (this.typeVerify === 'NONE') {
        this.isLoading = true
        this.setTypeOfAction('use-nft')
        const data = {
          itemId: this.nftItem.id,
          quantity: this.form.quantity,
          note: this.form.note,
          verificationCode: ''
        }
        const result = await apiNft.useNFT(data)
        if (result.status === 'SUCCESS') {
          await this.handleClose()
          this.setOpenPopup({
            popupName: 'popup-notify-success',
            isOpen: true
          })
        } else {
          let message: any = ''
          message = this.$t('nft.notify.errorVerify')
          this.$message.error({ message, duration: 5000 })
        }
        console.log('>>> / file: PopupUsedNFT.vue / line 149 / result', result)
      }
    }

    get disableConfirm(): boolean {
      return this.form.quantity && this.form.note && this.checkedAccept && this.inputQuantity ? false : true
    }
  }

  // function Prop(arg0: { required: boolean; type: ObjectConstructor; default: () => {} }) {
  //   throw new Error('Function not implemented.')
  // }
</script>

<style lang="scss" scoped>
  ::v-deep.content {
    color: black;

    .input-quantity {
      margin-top: 8px;
      // margin-bottom: 24px;

      .el-input__inner {
        height: 48px;
        font-size: 16px;
        color: #0a0b0d;
      }
    }

    .available {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #0a0b0d;
    }

    .remain {
      color: #0151fc;
    }

    .text-content {
      padding-bottom: 24px;
      p {
        font-size: 16px;
        line-height: 24px;
        word-break: break-word;
        color: #5b616e;
      }
    }
    .area {
      margin-bottom: 24px;
      border-radius: 4px;
      .el-textarea__inner {
        min-height: 98px !important;
      }
    }
  }

  .quantity {
    color: red;
    font-size: 12px;
  }

  .text-note {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 4px;
    color: #0a0b0d;
  }
  .text-des {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 8px;
    color: #5b616e;
  }
  .footer {
    max-width: 452px;
    width: 100%;
    .btn-report {
      background: var(--bc-theme-primary-gradient);
      margin-left: 16px;
    }

    .disable {
      background: #fff;
      margin-left: 16px;
      .text-report {
        color: #5b616e !important;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
      }
    }
    button {
      max-width: 100px;
      width: 100%;
      height: 40px;
      border: 1px solid rgba(219, 219, 219, 1);
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      .text-cancel {
        font-size: 16px;
        line-height: 24px;
        color: #3b3a39;
        font-weight: 600;
      }
      .text-report {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: white;
      }
    }
    .btn-cancel {
      &:hover {
        border-color: var(--bc-btn-default-border-hover);
        -webkit-background-clip: text;
        -webkit-text-fill-color: var(--bc-btn-default-border-hover);
        border-color: var(--bc-btn-default-border-hover);
        text-shadow: 0px 0px #00000000;
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-use-nft {
      .el-dialog {
        width: 350px !important;
      }
    }

    ::v-deep.chk-accept {
      .el-checkbox {
        display: block;
        .el-checkbox__input {
        }
      }
    }
  }
</style>
