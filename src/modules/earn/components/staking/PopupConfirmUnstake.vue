<template>
  <base-popup name="popup-confirm-unstake" class="popup-confirm-unstake" width="480px" :open="handleOpen" :close="handleClose">
    <p slot="title" class="header-popup">UNSTAKE</p>
    <div class="content">
      <div class="title-text text-base color-primary text-regular">
        <span>Are you sure you want to unstake this transaction? This action cannot be undone. All your interest will be forfeited.</span>
      </div>
    </div>
    <div class="footer" slot="footer">
      <button class="cursor btn-default btn-success" @click="handleCancel">{{ $t('button.cancel') }}</button>
      <button class="btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success" @click="handleContinue">{{ $t('button.confirm') }}</button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import { namespace } from 'vuex-class'

  @Component
  export default class PopupConfirmUnstake extends Mixins(PopupMixin) {
    async handleOpen(): Promise<void> {
      //
    }

    handleClose(): void {
      //
    }

    handleContinue(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-unstake',
        isOpen: false
      })
      this.$emit('click-confirm')
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-unstake',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    color: black;
    text-align: center;
    word-break: break-word;
    margin-bottom: 24px;
    text-align: left;
  }

  .title-text {
    word-break: break-word;
  }
  .monney-transaction {
    margin-top: 4px;

    background: var(--bc-menu-active);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .btn-payment {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dbdbdb;
    outline: none;
    border-radius: 6px;
    padding-left: 12px;
    padding-right: 12px;
    background: var(--bc-theme-primary-gradient);
    margin-bottom: 12px;
    cursor: pointer;
    .name-coin {
      margin: 0 auto;
      color: #fff !important;
    }
    &:last-child {
      margin-bottom: 24px;
    }
  }
  .btn-success {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    height: 40px;
    width: 100px;
    &:first-child {
      margin-right: 16px;
    }
  }
  .btn-default {
    padding: 0 !important;
    outline: none;
  }
  @media (max-width: 768px) {
    ::v-deep.popup-confirm-unstake {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .content {
          .img-success {
            width: 60px;
            height: 60px;
          }
          .title-text {
            font-size: 14px;
            line-height: 20px;
            color: #5b616e;
          }
          .monney-transaction {
            font-size: 14px;
            line-height: 20px;
          }
          .btn-success {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
    .btn-success {
      font-size: 14px !important;
      line-height: 20px !important;
      font-weight: 600;
      &:first-child {
        margin-right: 12px !important;
        color: #5b616e;
      }
      // color: #5b616e;
    }
  }
</style>
