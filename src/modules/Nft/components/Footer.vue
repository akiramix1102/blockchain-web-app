<template>
  <div id="footer-market">
    <div v-if="isDesktop" class="container-nft">
      <div class="be-flex jc-space-between footer-above">
        <div class="left">
          <div class="nft-body-base label text-semibold">
            <span class="uppercase">{{ $t('market-home.footer.contact-us') }}</span>
          </div>
          <el-form>
            <el-form-item class="mb-0">
              <el-input v-model="email" :placeholder="$t('placeholder.footer-email')">
                <template slot="append"
                  ><a style="color: white; text-decoration: none" :href="bodyMail">{{ $t('market-home.footer.send') }}</a></template
                >
              </el-input>
              <span class="validate-email" v-if="!isValidatedMail && email !== ''">{{ $t('market-home.footer.validateEmail') }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="be-flex right">
          <!-- <div class="qr-code">
            <qrcode-vue
              style="border: 6px solid #fff; width: 80px; height: 80px; border-radius: 8px"
              :value="urlSystem['system.token.app.download']"
              size="68"
              level="H"
            ></qrcode-vue>
          </div> -->
          <div class="down-app">
            <div class="uppercase nft-body-base text-white text-semibold label" v-if="coinMain === 'LYNK'">{{ $t('market-home.footer.down-load') }}</div>
            <div class="uppercase nft-body-base text-white text-semibold label" v-else>{{ $t('market-home.footer.down-load-clm') }}</div>
            <div class="logo">
              <a :href="urlSystem['system.token.app.ios.download']" target="_blank">
                <img src="../../../assets/images/nft/app-store.png" alt="" style="margin-right: 16px" />
              </a>
              <a :href="urlSystem['system.token.app.android.download']" target="_blank">
                <img src="../../../assets/images/nft/gg-play.png" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="body-footer">
        <div class="item-footer lynkey">
          <div class="be-flex align-center img-lynkey">
            <img v-if="coinMain === 'LYNK'" src="../../../assets/images/market/OBJECTS.png" />
            <div class="be-flex align-center" v-else>
              <base-icon icon="icon-clm" size="80" class="d-iflex" />
              <h3 class="text-clm">CLEVERME</h3>
            </div>
          </div>
          <p class="title-2 disabled-hover">{{ urlSystem['system.token.company.address'] }}</p>
          <p class="title-2 disabled-hover" style="cursor: pointer" @click="handleClickTerm">{{ $t('footer.terms') }}</p>
        </div>
        <div class="item-footer product">
          <p class="title-1">{{ $t('market-home.footer.products') }}</p>
          <p class="title-2">
            <a href="/wallet">{{ $t('market-home.footer.wallet') }}</a>
          </p>
          <p class="title-2">
            <a href="/metamart">{{ $t('market-home.footer.marketplace') }}</a>
          </p>
          <p class="title-2">{{ $t('market-home.footer.exchange') }}</p>
          <p class="title-2">{{ $t('market-home.footer.defi') }}</p>
        </div>
        <div class="item-footer support">
          <p class="title-1">{{ $t('market-home.footer.support') }}</p>
          <p class="title-2" @click="handlePushRoute('faqs')">
            {{ $t('market-home.footer.help-center') }}
          </p>
          <p class="title-2">
            <a href="https://lynkey.gitbook.io/guide/">{{ $t('market-home.footer.guides') }}</a>
          </p>
          <p class="title-2" @click="handlePushRoute('docs')">{{ $t('market-home.footer.document') }}</p>
          <p class="title-2">
            <a href="mailto:support@lynkey.com" target="_blank">{{ $t('market-home.footer.contact-us1') }}</a>
          </p>
        </div>
        <div class="item-footer company">
          <p class="title-1">{{ $t('market-home.footer.company') }}</p>
          <p class="title-2" @click="handlePushRoute('team')">{{ $t('market-home.footer.about-us') }}</p>
          <p class="title-2" @click="handlePushRoute('partner')">{{ $t('market-home.footer.partners') }}</p>
          <p class="title-2" @click="handlePushRoute('media')">{{ $t('market-home.footer.blog') }}</p>
          <p class="title-2" @click="handlePushRoute('media')">{{ $t('market-home.footer.press') }}</p>
        </div>
        <div class="item-footer community">
          <div style="width: 100%">
            <p class="title-1">{{ $t('market-home.footer.community') }}</p>
          </div>
          <div class="list-icon-1">
            <a href="https://t.me/LynKeychat" target="_blank"><base-icon icon="tele" size="40" /></a>
            <a href="https://twitter.com/LynKey_" target="_blank"><base-icon icon="Twitter" size="40" /></a>
            <a href="https://www.facebook.com/LynKey-103648988780161" target="_blank"><base-icon icon="facebook" size="40" /></a>
            <a href="https://www.youtube.com/channel/UCH1a6zb0lnkt69rMLFdN4zg" target="_blank"><base-icon icon="youtube" size="40" /></a>
          </div>
          <div class="list-icon-2">
            <a href="https://www.linkedin.com/company/76635212" target="_blank"><base-icon icon="in" size="40" /></a>
            <a href="https://www.instagram.com/lynkey__/" target="_blank"><base-icon icon="insta" size="40" /></a>
            <!--            <a href="#"><base-icon icon="m" size="40" /></a>-->
            <!--            <a href="#"><base-icon icon="githup" size="40" /></a>-->
            <a href="https://www.reddit.com/r/LynKey_Global/" target="_blank"><base-icon icon="reddit" size="40" /></a>
          </div>
        </div>
      </div>
    </div>
    <video v-if="isDesktop" playsinline autoplay loop muted id="myVideo" class="myVideo">
      <source src="https://lynkey.com/media/video-footer.mp4" type="video/mp4" />
    </video>

    <!-- Mobile -->
    <FooterMobile v-else />
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import QrcodeVue from 'qrcode.vue'
  import FooterMobile from './home/mobile/FooterMobile.vue'

  import { namespace } from 'vuex-class'
  import { filter } from 'lodash'
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')
  @Component({ components: { QrcodeVue, FooterMobile } })
  export default class FooterMarket extends Vue {
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    @beBase.State('coinMain') coinMain!: string
    @bcAuth.State('systemParamsPublic') systemParamsPublic!: Array<Record<string, any>>
    @bcNft.State('isDesktop') isDesktop!: boolean
    email = ''

    get mailAddress(): string {
      return this.urlSystem['system.token.support_email']
    }

    get intro(): string {
      return this.coinMain === 'LYNK' ? 'LynKey' : 'CleverMe'
    }

    get isValidatedMail(): boolean {
      // return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
      return /^[a-z][a-z0-9_.]{0,50}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm.test(this.email)
    }

    get bodyMail(): string {
      if (this.coinMain === 'LYNK') {
        return `mailto:${this.mailAddress}?&subject=Asking%20for%20information&body=Hi%20${this.intro},%0D%0AI%20would%20be%20grateful%20if%20you%20could%20give%20me%20some%20information/further%20details%20about%20your%20Marketplace.
                          %0D%0ALooking%20forward%20to%20hearing%20from%20you.
                          %0D%0AThanks!`
      }
      return `mailto:${this.mailAddress}?&subject=Asking%20for%20information&body=Hi%20${this.intro},%0D%0AI%20would%20be%20grateful%20if%20you%20could%20give%20me%20some%20information/further%20details%20about%20your%20Marketplace.
                          %0D%0ALooking%20forward%20to%20hearing%20from%20you.
                          %0D%0AThanks!`
    }
    handlePushRoute(name: string): void {
      this.$router.push({ name: 'home', query: { id: name } })
    }

    handleClickTerm(): void {
      const term = filter(this.systemParamsPublic, term => term.key === 'system.marketplace.terms.and.conditions')[0]
      if (!term.value || term.value === '#') {
        return
      }
      window.open(`${term.value}`, '_blank')
    }
  }
</script>
<style scoped lang="scss">
  #footer-market {
    background: #0a0b0d;
    display: flex;
    justify-content: center;
    // text-align: center;
    padding: 0 0 80px;
    position: relative;

    .container-nft {
      position: relative;
      z-index: 2;
    }

    ::v-deep.footer-above {
      border-bottom: 1px solid rgba(219, 219, 219, 0.2);
      margin-bottom: 40px;
      .left {
        margin-top: 80px;
        .label {
          color: #ececec;
          margin-bottom: 16px;
        }
        .el-form-item {
          width: 280px;
          .el-input__inner {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: none;
            padding-right: 0;
            font-size: 14px;
          }
          .el-input-group__append {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            padding: 0 12px;
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            cursor: pointer;
          }
          ::placeholder {
            color: #fff;
            font-size: 14px;
          }
        }
      }
      .right {
        margin-bottom: 40px;
        .qr-code {
          margin-top: 67px;
          width: 104px;
          height: 132px;
          border: 4px solid #5b616e;
          border-radius: 8px 8px 0px 0px;
          border-bottom: none;
          padding: 8px;
        }
        .down-app {
          margin-top: 80px;
          margin-left: 40px;
          .label {
            margin-bottom: 16px;
            font-weight: 600;
          }
        }
      }
    }

    .myVideo {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .body-footer {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .item-footer:first-of-type {
        width: calc((82px * 4) + 80px);
      }

      .item-footer {
        // width: calc((100% / 5) - 64px);

        a {
          text-decoration: none;
          margin-right: 16px;
          &:last-of-type {
            margin-right: 0;
          }
        }
        .list-icon-2,
        .list-icon-1 {
          display: flex;
        }
      }
      .product,
      .support,
      .company {
        width: calc((82px * 2) + 40px);
      }
      // @media screen and (min-width: 1366px) and (max-width: 1440px) {
      //   .item-footer {
      //     width: calc((100% / 5) - 48px);
      //   }
      // }
    }
    .title-2 {
      font-weight: normal;
      font-size: 14px;
      color: #ececec;
      margin-bottom: 8px;
      line-height: 24px;
      cursor: pointer;
      a {
        font-weight: normal;
        font-size: 14px;
        color: #ececec;
        margin-bottom: 8px;
        line-height: 24px;
        cursor: pointer;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
      &:not(.disabled-hover):hover {
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #ececec;
        cursor: pointer;
        font-family: Open Sans;
        background: var(--bc-menu-active);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .disabled-hover {
      cursor: inherit;
    }

    .validate-email {
      color: var(--bc-theme-primary);
      font-size: 12px;
    }

    .title-1 {
      font-family: Open Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #ececec;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .lynkey {
      .img-lynkey {
        margin-bottom: 24px;
      }
    }
    .community {
      .span-icon {
        margin-right: 16px;
        cursor: pointer;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
    .text-clm {
      font-family: 'Open Sans', sans-serif;
      font-size: 30px;
      color: #fff;
      margin-left: 9px;
    }
  }

  ::v-deep.el-form {
    .el-form-item {
      .el-form-item__content {
        .el-input-group--append {
          .el-input__inner {
            height: 40px;
          }
        }
      }
    }
  }
</style>
