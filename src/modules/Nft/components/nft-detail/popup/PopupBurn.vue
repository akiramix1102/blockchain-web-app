<template>
  <base-popup name="popup-burn" class="popup-burn" width="480px" :open="handleCommand" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('detail-nft.pop-burn.title') }}</p>
    <div class="content">
      <div class="text-content">
        <span
          ><p>
            {{ $t('detail-nft.pop-burn.content') }}
          </p></span
        >
      </div>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-cancel">
        <p class="text-cancel" @click="handleClose">{{ $t('detail-nft.pop-burn.cancel') }}</p>
      </button>
      <button class="btn-burn">
        <p class="text-burn">{{ $t('detail-nft.pop-burn.burn') }}</p>
      </button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  @Component
  export default class PopupBurn extends Mixins(PopupMixin) {
    handleCommand(): void {
      this.setOpenPopup({
        popupName: 'burn',
        isOpen: true
      })
    }
    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-burn',
        isOpen: false
      })
    }
    handleClose(): void {
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-burn',
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
        color: #0a0b0d;
      }
    }
  }
  .footer {
    max-width: 452px;
    width: 100%;
    .btn-burn {
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
      .text-burn {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: white;
      }
    }
    .btn-cancel {
      font-size: 16px;
      font-weight: 600;
      &:hover {
        border-color: var(--bc-btn-default-border-hover);
        -webkit-background-clip: text;
        -webkit-text-fill-color: var(--bc-btn-default-border-hover);
        border-color: var(--bc-btn-default-border-hover);
        text-shadow: 0px 0px #00000000;
      }
    }
  }
  // @media (max-width: 768px) {
  //   ::v-deep.popup-burn {
  //     .el-dialog {
  //       width: 350px !important;
  //     }
  //   }
  // }
</style>
