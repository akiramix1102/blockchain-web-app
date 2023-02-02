<template>
  <div class="landing-footer">
    <div class="landing-wrap container-lang">
      <div class="landing-footer-left">
        <img src="../../../assets/images/landing/logo.png" class="logo" alt="" />
        <div class="sack-email">
          <span class="sack-email-label style-label">{{ $t('landing-ido.footer-email') }}: </span>
          <span class="sack-email-name"><a href="mailto:support@lynkey.com" target="_blank" style="color: #fff; text-decoration: none">support@lynkey.com</a></span>
        </div>
        <div class="sack-address">
          <span class="sack-address-label style-label">{{ $t('landing-ido.footer-address') }}: </span>
          <span class="sack-address-name">{{ $t('landing-ido.footer-address-name') }}</span>
        </div>
        <div class="sack-copy-right">{{ $t('landing-ido.footer-copyright') }}</div>
      </div>
      <div class="landing-footer-right">
        <div class="title-down">{{ $t('landing-ido.footer-download-title') }}</div>
        <div class="img-down-app">
          <a href="https://play.google.com/store/apps/details?id=vn.beedu.blockchain" target="_blank" class="icon-google-play">
            <img src="../../../assets/images/landing/google-play.png" alt="" />
          </a>
          <a href="https://apps.apple.com/us/app/lynkey/id1591160349" target="_blank" class="img-app-store">
            <img src="../../../assets/images/landing/app-store.png" alt="" />
          </a>
        </div>
        <div class="sack-icon-contact">
          <a href="https://t.me/LynKeychat" target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/tele.png" alt="" /> -->
            <base-icon icon="tele-icon" size="36" />
          </a>
          <a href="https://www.facebook.com/LynKey-103648988780161" target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/face.png" alt="" /> -->
            <base-icon icon="face-icon" size="36" />
          </a>
          <a href="https://www.instagram.com/lynkey__/" target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/ins.png" alt="" /> -->
            <base-icon icon="inta-icon" size="36" />
          </a>
          <a href="https://twitter.com/LynKey_" target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/twi.png" alt="" /> -->
            <base-icon icon="swi-icon" size="36" />
          </a>
          <a href="https://www.linkedin.com/company/76635212 " target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/in.png" alt="" /> -->
            <base-icon icon="in-icon" size="36" />
          </a>
          <a href="https://www.youtube.com/channel/UCH1a6zb0lnkt69rMLFdN4zg" target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/tube.png" alt="" /> -->
            <base-icon icon="tube-icon" size="36" />
          </a>
          <a href="https://www.reddit.com/r/LynKey_Global/" target="_blank" class="style-contact">
            <!-- <img src="../../../assets/images/landing/red.png" alt="" /> -->
            <base-icon icon="re-icon" size="36" />
          </a>
        </div>
        <div class="select-lang">
          <el-select
            class="select-language select-language--header select-language--disable"
            :class="{ russian: selectLanguage === 'ru' }"
            v-model="selectLanguage"
            @change="handleChangeLanguage"
            popper-class="select-language-footer"
          >
            <el-option :label="`${$t('login.en')}`" value="en">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="flag-usa" size="14" style="margin-right: 4px" />
                  <span class="lang">{{ $t('login.en') }}</span>
                </div>
              </template>
            </el-option>
            <el-option :label="`${$t('login.vi')}`" value="vi">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="vietnam" size="14" style="margin-right: 4px; margin-left: -2px" />
                  <span class="lang" style="margin-left: 1px">{{ $t('login.vi') }}</span>
                </div>
              </template>
            </el-option>
            <el-option :label="`${$t('login.ru')}`" value="ru">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="russian" size="14" style="margin-right: 4px; margin-left: -2px" />
                  <span class="lang" style="margin-left: 1px">{{ $t('login.ru') }}</span>
                </div>
              </template>
            </el-option>
            <el-option :label="`${$t('login.kr')}`" value="kr">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="korea" size="14" style="margin-right: 4px; margin-left: -2px" />
                  <span class="lang" style="margin-left: 1px">{{ $t('login.kr') }}</span>
                </div>
              </template>
            </el-option>
            <el-option :label="`${$t('login.jp')}`" value="jp">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="japan" size="14" style="margin-right: 4px; margin-left: -2px" />
                  <span class="lang" style="margin-left: 1px">{{ $t('login.jp') }}</span>
                </div>
              </template>
            </el-option>
            <el-option :label="`${$t('login.cn')}`" value="cn">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="china" size="14" style="margin-right: 4px; margin-left: -2px" />
                  <span class="lang" style="margin-left: 1px">{{ $t('login.cn') }}</span>
                </div>
              </template>
            </el-option>
            <div class="suffix" slot="prefix">
              <base-icon class="flag-usa d-iflex lh-default" :icon="getIcon" size="22" />
              <!-- <base-icon v-else class="flag-vn d-iflex lh-default" :icon="getIcon" size="29" /> -->
            </div>
          </el-select>
        </div>
      </div>
    </div>
    <video playsinline autoplay loop muted id="myVideo" class="myVideo">
      <source src="https://lynkey.com/media/video-footer.mp4" type="video/mp4" />
    </video>
    <video playsinline autoplay loop muted id="myVideo" class="mobile-video">
      <source src="https://lynkey.com/media/video-footer-mobile.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component
  export default class LandingFooter extends Vue {
    selectLanguage = ''
    selectLang(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
    created() {
      this.selectLanguage = this.selectLang()
    }
    get getIcon(): string {
      let icon = 'vietnam'
      switch (this.selectLanguage) {
        case 'en':
          icon = 'flag-usa'
          break
        case 'ru':
          icon = 'russian'
          break
        case 'kr':
          icon = 'korea'
          break
        case 'jp':
          icon = 'japan'
          break
        case 'cn':
          icon = 'china'
          break
        default:
          icon = 'vietnam'
          break
      }
      return icon
    }
    handleChangeLanguage(lang: string): void {
      this.$i18n.locale = lang
      window.localStorage.setItem('bc-lang', lang)
      location.reload()
    }
  }
</script>

<style lang="scss" scoped>
  .landing-footer {
    position: relative;
    overflow: hidden;
  }

  .myVideo {
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // object-fit: cover;
    display: block;
  }
  .mobile-video {
    display: none;
  }
  .landing-wrap {
    display: flex;
    justify-content: space-between;
    color: #fff;
    padding: 80px 24px;
    position: absolute;
    top: 0;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
  }
  .landing-footer-left {
    max-width: 477px;
    width: 100%;
    .sack-email {
      margin-top: 47px;
      margin-bottom: 24px;
    }
    .sack-email,
    .sack-address,
    .sack-copy-right {
      font-size: 18px;
      line-height: 27px;
      font-weight: 400;
    }
    .sack-address {
      margin-bottom: 24px;
    }
    .style-label {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .landing-footer-right {
    max-width: 565px;
    width: 100%;
    text-align: right;
    .title-down {
      font-size: 20px;
      line-height: 30px;
      font-weight: 700;
    }
    .img-down-app {
      display: flex;
      justify-content: flex-end;
      margin-top: 25px;
      margin-bottom: 32px;
    }
    .icon-google-play {
      margin-right: 25px;
    }
    .sack-icon-contact > .style-contact {
      margin-left: 36px;
    }
    ::v-deep.select-lang {
      margin-top: 68px;
      .suffix {
        margin-top: 9px;
      }
      .el-input__inner {
        width: 150px;
        background-color: var(--bc-color-grey190);
        color: var(--bc-bg-white);
        border-color: #a6a6a6;
        border-radius: 4px;
      }
      .el-select.russian {
        .el-input__inner {
          width: 180px;
        }
      }
      @media (max-width: 768px) {
        margin-top: 14px;
        text-align: center;
      }
    }
  }
  @media (max-width: 767px) {
    .myVideo {
      display: none;
    }
    .mobile-video {
      display: block;
      transform: scale(1) translate(-28%, 6px);
    }
    // #myVideo {
    //   transform: translate(0px, 0px);
    // }
    .landing-wrap {
      flex-direction: column;
      padding: 36px 24px;
    }
    .logo {
      width: 144px;
      height: 48px;
    }
    .landing-footer-left {
      margin-bottom: 28px;
      .sack-email {
        margin-top: 24px;
        margin-bottom: 12px;
      }
      .sack-email,
      .sack-address,
      .sack-copy-right {
        font-size: 14px;
        line-height: 21px;
        font-weight: 600;
      }
      .sack-address {
        margin-bottom: 12px;
      }
    }
    .landing-footer-right {
      text-align: left;
      .title-down {
        font-size: 16px;
        line-height: 24px;
      }
      .img-down-app {
        justify-content: unset;
        margin-top: 16px;
        margin-bottom: 4px;
      }
      .icon-google-play {
        margin-right: 19px;
      }
      .icon-google-play,
      .img-app-store {
        img {
          width: 154px;
          height: 46px;
        }
      }
      .sack-icon-contact > .style-contact {
        margin-left: 24px;
        svg {
          width: 24px;
          height: 24px;
          font-size: 24px !important;
        }
      }
      .style-contact:first-child {
        margin-left: unset;
      }
    }
  }
  .select-language-footer {
    background-color: #201f1e;
    @media (max-height: 768px) {
    }
  }
</style>
