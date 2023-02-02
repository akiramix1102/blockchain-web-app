<template>
  <div>
    <div class="be-flex jc-space-between about-market" v-if="coinMain === 'LYNK'">
      <div class="nft-header3 text-semibold mb-24 title isMobile">
        <span>{{ $t('nft.home.title-about') }}</span>
      </div>
      <div class="left">
        <img src="../../../../assets/images/nft/img-about.jpg" class="d-block" alt="" />
      </div>
      <div class="right">
        <div class="nft-header3 text-semibold mb-24 title isPc">
          <span>{{ $t('nft.home.title-about') }}</span>
        </div>
        <p class="nft-body-base text-desc" v-html="getDescription"></p>
        <div class="sack-service">
          <div class="title-service color-primary text-medium text-0xl">{{ $t('about-market.our-services') }}</div>
          <div class="about-market-service">
            <div class="service-one">
              <img src="../../../../assets/images/market/nft-initial-setup.jpg" alt="" />
              <div class="service-one-name">{{ $t('nft-initial-setup') }}</div>
            </div>
            <div class="service-one">
              <img src="../../../../assets/images/market/advertising-services.jpg" alt="" />
              <div class="service-one-name">{{ $t('advertising-services') }}</div>
            </div>
            <div class="service-one">
              <img src="../../../../assets/images/market/shopping-store-leasing.jpg" alt="" />
              <div class="service-one-name">{{ $t('shopping-store-leasing') }}</div>
            </div>
          </div>
        </div>
        <el-button :loading="isLoading" class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="handleContact">
          <span class="text-btn">{{ $t('button.about-contact') }}</span>
        </el-button>
      </div>
      <PopupAboutMarketplace />
    </div>
    <div class="be-flex jc-space-between about-market" v-if="coinMain === 'CLM'">
      <div class="nft-header3 text-semibold mb-24 title isMobile">
        <span>{{ $t('nft.home.title-about-nft') }} abc</span>
      </div>
      <div class="left">
        <img src="../../../../assets/images/market/img-about-clm.png" class="d-block" alt="" />
      </div>
      <div class="right">
        <div class="nft-header3 text-semibold mb-24 title isPc">
          <span>{{ $t('nft.home.title-about-nft') }}</span>
        </div>
        <p class="nft-body-base text-desc" v-html="getDescription"></p>
        <div class="sack-service">
          <div class="title-service color-primary text-medium text-0xl">{{ $t('about-market.our-services') }}</div>
          <div class="about-market-service">
            <div class="service-one">
              <img src="../../../../assets/images/market/nft-tokenization.png" alt="" />
              <div class="service-one-name">{{ $t('about-market.initial-setup') }}</div>
            </div>
            <div class="service-one">
              <img src="../../../../assets/images/market/advertising-service-clm.png" alt="" />
              <div class="service-one-name">{{ $t('about-market.advertising-services') }}</div>
            </div>
            <div class="service-one">
              <img src="../../../../assets/images/market/blockchain-consulting.png" alt="" />
              <div class="service-one-name">{{ $t('about-market.shopping-store-leasing') }}</div>
            </div>
          </div>
        </div>
        <el-button :loading="isLoading" class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="handleContact">
          <span class="text-btn">{{ $t('button.about-contact') }}</span>
        </el-button>
      </div>
      <PopupAboutMarketplace />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Mixins } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import PopupMixin from '@/mixins/popup'
  import PopupAboutMarketplace from '../nft-detail/popup/PopupAboutMarketPlace.vue'
  const beBase = namespace('beBase')
  @Component({ components: { PopupAboutMarketplace } })
  export default class AboutMarket extends Mixins(PopupMixin) {
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    @beBase.State('coinMain') coinMain!: string
    isLoading = false
    get getDescription(): string {
      try {
        const language = window.localStorage.getItem('bc-lang')!
        if (this.urlSystem['system.token.about.marketplace']) {
          const objDesc = JSON.parse(this.urlSystem['system.token.about.marketplace'])
          return objDesc[language].replace(/\\n/g, '<br>')
        }
        return ''
      } catch (error) {
        return ''
      }
    }

    handleContact(): void {
      this.setOpenPopup({
        popupName: 'popup-about-marketplace',
        isOpen: true
      })
    }
  }
</script>

<style scoped lang="scss">
  .about-market {
    margin-top: 80px;
    margin-bottom: 60px;
    @media (max-width: 1199px) {
      margin-top: 40px;
    }
    @media (max-width: 1199px) {
      flex-direction: column;
    }
    .left {
      max-width: 510px;
      width: 100%;
      @media (max-width: 1199px) {
        max-width: unset;
        display: flex;
        justify-content: center;
      }
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        display: block;
      }
    }
    ::v-deep.right {
      max-width: 620px;
      width: 100%;
      position: relative;
      @media (max-width: 1199px) {
        max-width: unset;
      }
      .title {
        margin-bottom: 0px !important;
      }
      .text-desc {
        padding-top: 14px;
        @media (max-width: 1199px) {
          padding-top: 24px;
        }
      }
      .btn {
        width: 100%;
        height: 48px;
        // margin-top: 6px;
        .text-btn {
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          color: #fff;
        }
      }
      #ck-content {
        ul + p {
          span {
            color: var(--bc-text-footer-about) !important;
          }
        }
      }
    }
  }
  ::v-deep.nft-header3 {
    @media (max-width: 1199px) {
      font-size: 24px;
      line-height: 32px;
    }
  }
  .sack-service {
    margin-top: 14px;
  }
  .about-market-service {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 28px;
    margin-top: 21px;

    @media screen and (max-width: 374px) {
      align-items: unset;
    }

    .service-one {
      text-align: center;
      @media (max-width: 1199px) {
        background: #ffffff;
        box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
        border-radius: 4px;
        margin-right: 16px;
        width: 101px;
        &:nth-child(1) {
          padding: 16px 4px;
        }
        &:nth-child(2) {
          padding: 16px 4px;
        }
        &:nth-child(3) {
          padding: 16px 6px;
          margin-right: 0px;
        }
      }
    }
    .service-one-name {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      margin-top: 13px;
      color: var(--bc-text-discript);
      @media (max-width: 1199px) {
        font-size: 14px;
        line-height: 20px;
        margin-top: 12px;
      }
    }
  }
  .isPc {
    display: block;
  }
  .isMobile {
    display: none;
  }
  @media (max-width: 1199px) {
    .isPc {
      display: none;
    }
    .isMobile {
      display: block;
    }
  }
</style>
