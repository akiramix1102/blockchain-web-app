<template>
  <div class="container-nft">
    <div class="footer-above-mb">
      <div class="footer-logo">
        <div class="img-lynkey">
          <img v-if="coinMain === 'LYNK'" src="../../../../../assets/images/market/OBJECTS.png" />
          <div class="be-flex align-center jc-space-center" v-else>
            <base-icon icon="icon-clm" size="80" class="d-iflex" />
            <h3 class="text-clm text-semibold">CleverMe</h3>
          </div>
        </div>
      </div>
      <div class="below">
        <div class="down-app">
          <div class="uppercase nft-body-base text-white text-semibold label" v-if="coinMain === 'LYNK'">{{ $t('market-home.footer.down-load') }}</div>
          <div class="uppercase nft-body-base text-white text-semibold label" v-else>{{ $t('market-home.footer.down-load-clm') }}</div>
          <div class="logo">
            <a :href="urlSystem['system.token.app.ios.download']" target="_blank">
              <img src="../../../../../assets/images/nft/app-store.png" alt="" style="margin-right: 16px" />
            </a>
            <a :href="urlSystem['system.token.app.android.download']" target="_blank">
              <img src="../../../../../assets/images/nft/gg-play.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-body">
      <div class="footer-contact">
        <div class="nft-body-base label">
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
      <div class="footer-community">
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
          <!-- <a href="#"><base-icon icon="iconf6" size="40" /></a> -->
          <a href="#"><base-icon icon="githup" size="40" /></a>
          <a href="https://www.reddit.com/r/LynKey_Global/" target="_blank"><base-icon icon="reddit" size="40" /></a>
        </div>
      </div>
      <div class="footer-collapse">
        <el-collapse class="collapse collapse-detail" v-model="activeNames" accordion @change="handleChange">
          <el-collapse-item class="collapse-item" :title="$t('market-home.footer.products')" :name="1">
            <p class="title">
              <a href="/wallet">{{ $t('market-home.footer.wallet') }}</a>
            </p>
            <p class="title">
              <a href="/metamart">{{ $t('market-home.footer.marketplace') }}</a>
            </p>
            <p class="title">
              {{ $t('market-home.footer.exchange') }}
            </p>
            <p class="title">
              {{ $t('market-home.footer.defi') }}
            </p>
          </el-collapse-item>
          <el-collapse-item class="collapse-item" :title="$t('market-home.footer.support')" :name="2">
            <p class="title" @click="handlePushRoute('faqs')">
              {{ $t('market-home.footer.help-center') }}
            </p>
            <p class="title">
              <a href="https://lynkey.gitbook.io/guide/">{{ $t('market-home.footer.guides') }}</a>
            </p>
            <p class="title" @click="handlePushRoute('docs')">{{ $t('market-home.footer.document') }}</p>
            <p class="title">
              <a href="mailto:support@lynkey.com" target="_blank">{{ $t('market-home.footer.contact-us1') }}</a>
            </p>
          </el-collapse-item>
          <el-collapse-item class="collapse-item" :title="$t('market-home.footer.company')" :name="3">
            <p class="title" @click="handlePushRoute('team')">{{ $t('market-home.footer.about-us') }}</p>
            <p class="title" @click="handlePushRoute('partner')">{{ $t('market-home.footer.partners') }}</p>
            <p class="title" @click="handlePushRoute('media')">{{ $t('market-home.footer.blog') }}</p>
            <p class="title" @click="handlePushRoute('media')">{{ $t('market-home.footer.press') }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="privacy">
        <p class="title">@2021 LynKey International Ltd.</p>
        <p class="title">Privacy & Terms</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import QrcodeVue from 'qrcode.vue'

  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  @Component({ components: { QrcodeVue } })
  export default class FooterMobile extends Vue {
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    @beBase.State('coinMain') coinMain!: string

    @bcNft.State('isDesktop') isDesktop!: boolean
    email = ''
    name = 'FooterMobile'
    activeNames = '1'

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
      window.open(`${this.urlSystem['system.token.terms']}`)
    }
    handleChange(val: any): void {
      this.activeNames = val
    }
  }
</script>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    #footer-market {
      background: #0a0b0d;
      // display: flex;
      // justify-content: center;
      text-align: center;
      padding: 40px 42px 24px;
      position: relative;
    }
    .container-nft {
      margin: 0;
      max-width: 291px;
      text-align: center;
    }
    .footer-logo {
      border-bottom: 1px solid rgba(219, 219, 219, 0.2);
      margin-top: 40px;
      .img-lynkey {
        margin-bottom: 40px;
        text-align: center;

        .text-clm {
          font-size: 30px;
          color: #fff;
          margin-left: 9px;
        }
      }
    }
    ::v-deep.below {
      margin-top: 40px;
      border-bottom: 1px solid rgba(219, 219, 219, 0.2);
      .down-app {
        .label {
          color: #ececec;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .logo {
        display: flex;
        margin: 24px 0 40px;
        image-rendering: pixelated;
      }
    }
    ::v-deep.footer-body {
      .footer-contact {
        margin-top: 40px;
        .label {
          font-size: 16px;
          font-weight: 600;
          color: #ececec;
          margin-bottom: 24px;
        }
        .uppercase {
          text-transform: none;
        }
        .el-form-item {
          width: 100%;
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
      .footer-community {
        margin: 40px 0;
        border-bottom: 1px solid rgba(219, 219, 219, 0.2);
        .title-1 {
          font-family: Open Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
          color: #ececec;
          margin-bottom: 24px;
        }
        .list-icon-2 {
          margin-bottom: 40px;
        }
        .span-icon {
          margin-right: 12px;
          cursor: pointer;
          &:last-of-type {
            margin-right: 12px;
          }
        }
      }
      .footer-collapse {
        .el-collapse {
          border-bottom: 1px solid rgba(219, 219, 219, 0.2);
          border-top: none;
          //   margin-bottom: 40px;
          .el-collapse-item__header {
            background-color: #0a0b0d;
            color: #5b616e !important;
            margin-bottom: 16px;
            border: none;
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
          }
          .el-collapse-item__wrap {
            background-color: #0a0b0d;
            border: none;
            .title {
              text-align: left;
              font-weight: 400;
              font-size: 14px;
              line-height: 20px;
              color: #ececec;
              margin-bottom: 12px;
              a {
                text-decoration: none;
                color: #ececec;
              }
            }
          }
          .el-collapse-item:last-child {
            margin-bottom: 40px;
          }
        }
      }
      .privacy {
        color: #ececec !important;
        margin-top: 24px;
        .title:first-child {
          margin-bottom: 12px;
        }
      }
    }
  }

  .validate-email {
    color: var(--bc-theme-primary);
    font-size: 12px;
  }

  // Tablet
  @media (min-width: 767px) and (max-width: 1023px) {
    .container-nft {
      max-width: 500px;
      text-align: center;
    }
    .footer-logo {
      border-bottom: 1px solid;
      border-image-source: linear-gradient(90deg, rgba(91, 97, 110, 0) -0.6%, #5b616e 50.95%, rgba(91, 97, 110, 0) 103.28%);
      border-image-slice: 1;
      margin-top: 40px;

      .img-lynkey {
        margin-bottom: 40px;
      }
      .text-clm {
        font-size: 30px;
        color: #fff;
        margin-left: 9px;
      }
    }
    ::v-deep.below {
      margin-top: 40px;
      border-bottom: 1px solid;
      border-image-source: linear-gradient(90deg, rgba(91, 97, 110, 0) -0.6%, #5b616e 50.95%, rgba(91, 97, 110, 0) 103.28%);
      border-image-slice: 1;
      .down-app {
        .label {
          font-size: 18px;
        }
      }
      .logo {
        display: flex;
        justify-content: center;
        margin: 24px 0 40px;
      }
    }
    ::v-deep.footer-body {
      .footer-contact {
        margin-top: 40px;
        .label {
          font-size: 18px;
          font-weight: 600;
          color: #ececec;
          margin-bottom: 24px;
        }
        .el-form-item {
          width: 100%;
          .el-input__inner {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: none;
            padding-right: 0;
          }
          .el-input-group__append {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            padding: 0 12px;
            font-size: 16px;
            font-weight: 500;
          }
          ::placeholder {
            color: #fff;
            font-size: 16px;
          }
        }
      }
      .footer-community {
        margin: 40px 0;
        border-bottom: 1px solid;
        border-image-source: linear-gradient(90deg, rgba(91, 97, 110, 0) -0.6%, #5b616e 50.95%, rgba(91, 97, 110, 0) 103.28%);
        border-image-slice: 1;
        .title-1 {
          font-family: Open Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 18px;
          // line-height: 24px;
          color: #ececec;
          margin-bottom: 24px;
        }
        .list-icon-2 {
          margin-bottom: 40px;
        }
        .span-icon {
          margin-right: 12px;
          cursor: pointer;
          &:last-of-type {
            margin-right: 12px;
          }
        }
      }
      .footer-collapse {
        .el-collapse {
          border-bottom: 1px solid;
          border-image-source: linear-gradient(90deg, rgba(91, 97, 110, 0) -0.6%, #5b616e 50.95%, rgba(91, 97, 110, 0) 103.28%);
          border-image-slice: 1;
          border-top: none;
          //   margin-bottom: 40px;
          .el-collapse-item__header {
            background-color: #0a0b0d;
            color: #5b616e !important;
            margin-bottom: 16px;
            border: none;
            font-size: 18px;
            // line-height: 24px;
            font-weight: 600;
          }
          .el-collapse-item__wrap {
            background-color: #0a0b0d;
            border: none;
            .title {
              text-align: left;
              font-weight: 400;
              font-size: 16px;
              line-height: 20px;
              color: #ececec;
              margin-bottom: 12px;
              a {
                text-decoration: none;
                color: #ececec;
              }
            }
          }
          .el-collapse-item:last-child {
            margin-bottom: 40px;
          }
        }
      }
      .privacy {
        color: #ececec !important;
        margin-top: 24px;
        .title {
          font-size: 16px;
        }
        .title:first-child {
          margin-bottom: 12px;
        }
      }
    }
  }
</style>
