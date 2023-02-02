<template>
  <base-popup name="popup-staking-success" class="popup-staking-success" width="400px" :open="handleOpen" :close="handleClose" :isShowFooter="false">
    <p slot="title" class="header-popup">{{ $t('detail-nft.popup-success.title') }}</p>
    <div class="content">
      <img class="img-success" src="../../../../assets/images/nft/icon-success.png" alt="" />
      <div class="title-success text-base color-primary text-semibold">
        <span v-if="type === 'STAKING'">You have successfully staked the amount</span>
        <span v-else>You have successfully unstaked the amount</span>
      </div>
      <div class="monney-transaction text-base text-semibold">{{ amountNumber | convertAmountDecimal(currency) }} {{ currency }}</div>
      <div v-if="type === 'STAKING'" class="router_center router_setting mt-24" @click="handleOpenWallet">
        <el-button class="btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success">{{ $t('button.go-to-wallet') }}</el-button>
      </div>
      <div v-else class="router_center router_setting mt-24" @click="handleContinue">
        <el-button class="btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success">{{ $t('button.continue') }}</el-button>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')

  @Component
  export default class PopupStakingSuccess extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String }) currency!: string
    @Prop({ required: true, type: Number }) amountNumber!: number
    @Prop({ required: true, type: String }) type!: 'STAKING' | 'UNSTAKING'

    async handleOpen(): Promise<void> {
      //
    }

    handleClose(): void {
      this.handleContinue()
    }

    handleOpenWallet(): void {
      this.setOpenPopup({
        popupName: 'popup-staking-success',
        isOpen: false
      })
      this.$router.push({
        path: `/wallet/${this.currency}`
      })
    }

    handleContinue(): void {
      this.setOpenPopup({
        popupName: 'popup-staking-success',
        isOpen: false
      })
      this.$emit('click-success')
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    color: black;
    text-align: center;
  }

  .title-success {
    margin-top: 12px;
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
  .btn-theme {
    height: 48px;
    width: 100%;
    font-size: 16px !important;
    line-height: 24px !important;
    margin-bottom: 24px;
  }
  @media (max-width: 768px) {
    ::v-deep.popup-staking-success {
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
          .title-success {
            font-size: 14px;
            line-height: 20px;
          }
          .monney-transaction {
            font-size: 14px;
            line-height: 20px;
          }
          .btn-success {
            font-size: 14px !important;
            line-height: 20px !important;
          }
        }
      }
    }
  }
</style>
