<template>
  <base-popup name="popup-share" class="popup-share" width="400px" :open="handleCommand">
    <p slot="title" class="header-popup">{{ $t(`${getShareType}`) }}</p>
    <div class="content">
      <div class="content-social">
        <div class="social">
          <ShareNetwork
            v-for="(network, index) in networks"
            :key="index"
            :network="network.network"
            :url="linkShare"
            :title="getTitle"
            class="share-netword"
            :hashtags="getTagName"
            tag="div"
          >
            <base-icon :icon="network.icon" size="48" />
            <img class="twitter-img" :src="network.src" alt="" />
            <span
              ><p>{{ network.name }}</p></span
            >
          </ShareNetwork>

          <div style="cursor: pointer" slot="append " @click="copyToClipboard">
            <base-icon icon="copy-icon-share" size="48" />
            <!-- <img class="email-img" src="@/assets/images/nft/copy.png" alt="" /> -->
            <span
              ><p>{{ $t('detail-nft.pop-share.copy') }}</p></span
            >
          </div>
        </div>
        <!-- <div class="social social-face">
          <a href="https://www.facebook.com/" target="_blank">
            <img class="telegram-img" src="../../../../assets/images/nft/face.png" alt="" />
            <span><p>Facebook</p></span>
          </a>
        </div> -->
        <!-- <div class="social social-telegram">
          <a href="https://web.telegram.org/z/" target="_blank">
            <img class="telegram-img" src="@/assets/images/nft/telegram.png" alt="" />
            <span><p>Telegram</p></span>
          </a>
        </div>
        <div class="social social-face">
          <ShareNetwork
            network="facebook"
            :url="link"
            title="iNam"
            description="LynKey is a blockchain-based certification utility ecosystem link and key that enables solutions to book, pay for holidays, buy timeshare or property in smart tourism: resorts, hotels, marinas, holidays, experiences, events, related services, and utilities."
            style="color: var(--bc-text-market-primary-nft); text-decoration: none"
          >
            <img class="face-img" src="@/assets/images/nft/face.png" alt="" />
            <p>Facebook</p>
          </ShareNetwork>
          <span><p>Facebook</p></span>
         </div>
        <div class="social social-email">
          <a href="https://mail.google.com/" target="_blank">
            <img class="email-img" src="@/assets/images/nft/email.png" alt="" />
            <span><p>Email</p></span>
          </a>
        </div> -->
      </div>
    </div>

    <div slot="footer" class="popup-footer"></div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  const beBase = namespace('beBase')
  @Component
  export default class PopupShare extends Mixins(PopupMixin) {
    @bcNft.State('linkShare') linkShare!: string
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('shareType') shareType!: string
    @beBase.State('coinMain') coinMain!: string
    // @Prop({ required: false, type: Number, default: 0 }) nftItem!: number
    // @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>

    networks: any = [
      { network: 'twitter', name: 'Twitter', icon: 'switer-icon-share' },
      { network: 'telegram', name: 'Telegram', icon: 'tele-icon-share' },
      { network: 'facebook', name: 'Facebook', icon: 'face-icon-share' },
      { network: 'email', name: 'Email', icon: 'mail-icon-share' }
    ]
    src = ''
    handleCommand(): void {
      this.setOpenPopup({
        popupName: 'remove',
        isOpen: true
      })
    }
    get getShareType(): string {
      switch (this.shareType) {
        case 'NFT':
          return 'detail-nft.pop-share.title-nft'
        case 'COLLECTION':
          return 'detail-nft.pop-share.title-collection'
        case 'ACCOUNT':
          return 'detail-nft.pop-share.title-account'
        default:
          return 'detail-nft.pop-share.title'
      }
    }

    get getTagName() {
      if (this.coinMain == 'LYNK') {
        return 'LynKey'
      }
      return 'CleverMe'
    }
    get getTitle() {
      if (this.coinMain == 'LYNK') {
        return 'LynKey - Luxury resort and tourism investment, powered by blockchain'
      }
      return 'CleverMe - Invest in real estate with crypto, cleverly'
    }
    mounted(): void {
      // console.log(this.getLink)
      this.setOpenPopup({
        popupName: 'popup-burn',
        isOpen: false
      })
    }

    copyToClipboard(): void {
      // this.$refs.clone.focus()
      // document.execCommand('copy')
      const el = document.createElement('input')
      el.value = this.linkShare
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      let message: any = ''
      message = this.$t('notify.copy')
      this.$message.success({ message, duration: 5000 })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    .content-social {
      margin-bottom: 24px;
      .social {
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        a {
          text-decoration: none !important;
          color: rgba(91, 97, 110, 1);
        }
        p {
          color: #5b616e;
        }
      }
    }
  }

  .share-netword {
    cursor: pointer;
  }
  ::v-deep.popup-share {
    .el-dialog__footer {
      display: none;
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-share {
      .el-dialog {
        width: 335px !important;
      }
    }
  }
</style>
