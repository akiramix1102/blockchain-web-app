<template>
  <div id="download-app">
    <div class="container-nft">
      <div class="download-app">
        <div style="display: flex">
          <div class="text-content">
            <div class="header-download ml-100 mt-100 nft-header3 text-semibold mb-8">Download Our App</div>
            <div style="opacity: 70%" class="description-download ml-100 nft-header6 text-regular mb-28">Book, buy, sell, invest right on your mobile device</div>
            <div class="icon-download ml-100 mb-120">
              <div class="app-store">
                <a :href="urlSystem['system.token.app.ios.download']" class="mr-16" target="_blank">
                  <img src="../../../assets/images/market/app-store.png" />
                </a>
              </div>
              <div>
                <a :href="urlSystem['system.token.app.android.download']" target="_blank">
                  <img src="../../../assets/images/market/google-play.png" />
                </a>
              </div>
            </div>
          </div>
          <div style="margin-left: 184px" class="qr-code mt-60 mb-60">
            <qrcode-vue
              style="border: 10px solid #fff; width: 279px; height: 279px; border-radius: 8px"
              :value="urlSystem['system.token.app.download']"
              size="260"
              level="H"
            ></qrcode-vue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import QrcodeVue from 'qrcode.vue'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  @Component({ components: { QrcodeVue } })
  export default class DownloadApp extends Vue {
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    textQrCode = 'ahihihi'
  }
</script>
<style scoped lang="scss">
  #download-app {
    background: #fff !important;
    // padding-top: 160px;
    padding-bottom: 80px;

    .download-app {
      background-image: url('../../../assets/images/market/Background-download-app.jpg');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      border-radius: 32px;
      overflow: hidden;
      display: flex;
      align-items: center;
      .text-content {
        color: #fff;
      }
      .icon-download {
        display: flex;
      }
      .content-download {
        display: flex;
        .title-header {
          .title1,
          .title3 {
            font-family: Open Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            text-align: center;
            color: #ffffff;
            opacity: 0.7;
          }

          .title2 {
            max-width: 580px;
            font-family: Open Sans;
            font-style: normal;
            font-weight: 600;
            font-size: 48px;
            line-height: 64px;
            text-align: center;
            color: #ffffff;
            margin-bottom: 8px;
          }
        }

        .QR-code {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 80px;
          padding: 0 40px;
          .store-download {
            .app-store {
              margin-bottom: 40px;
            }
            img {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
