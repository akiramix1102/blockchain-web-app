<template>
  <base-popup name="popup-open" class="popup-open" width="480px" :open="handleCommand" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.pop-report.title') }}</p>
    <div class="content">
      <div class="text-content">
        <span
          ><p>{{ $t('detail-nft.pop-report.content') }}</p></span
        >
      </div>
      <div class="report-input">
        <!-- <textarea langKey="place-holder" type="text" :placeholder="`${$t('detail-nft.pop-report.placeholder')}`" /> -->
        <textarea class="area-input" langKey="place-holder" type="text" :placeholder="`${$t('detail-nft.pop-report.placeholder')}`" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-cancel">
        <p class="text-cancel" @click="handleClose">{{ $t('detail-nft.pop-report.cancel') }}</p>
      </button>
      <button class="btn-report">
        <p class="text-report">{{ $t('detail-nft.pop-report.report') }}</p>
      </button>
    </div>
    <!-- body.modal-open { overflow: hidden; } -->
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  @Component
  export default class PopupOpen extends Mixins(PopupMixin) {
    handleCommand(): void {
      this.setOpenPopup({
        popupName: 'open',
        isOpen: true
      })
    }
    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-open',
        isOpen: false
      })
    }
    handleClose(): void {
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-open',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    color: black;
    .text-content {
      padding-bottom: 24px;
      p {
        font-size: 16px;
        line-height: 24px;
        word-break: break-word;
        color: #5b616e;
      }
    }
    .report-input {
      .area-input {
        max-width: 432px;
        width: 100%;
        height: 87px;
        margin-bottom: 24px;
        border: 1px solid rgba(219, 219, 219, 1);
        border-radius: 6px;
        vertical-align: text-top;
        padding: 10px 30px 50px 10px;
        font-size: 16px;
        color: #0a0b0d;
        line-height: 24px;
        ::placeholder {
          color: #89909e;
          line-height: 24px;
          font-weight: 400;
          font-size: 16px;
          // padding: 12px 10px;
        }
      }
    }
  }
  .footer {
    max-width: 452px;
    width: 100%;
    .btn-report {
      background: var(--bc-theme-primary-gradient);
      margin-left: 16px;
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
        color: #5b616e;
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
    ::v-deep.popup-open {
      .el-dialog {
        width: 350px !important;
      }
    }
  }
</style>
