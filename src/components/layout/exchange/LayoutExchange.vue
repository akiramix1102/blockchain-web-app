<template>
  <el-container class="main-layout" :class="isLoading ? 'be-flex-center' : null">
    <transition name="el-fade-in-linear">
      <base-page-loading v-if="isLoading" />
    </transition>
    <el-container v-if="!isLoading" class="main-content">
      <el-header class="be-flex main-header" style="height: 70px">
        <div class="be-flex-item">
          <main-header />
        </div>
      </el-header>
      <el-main class="main-center scroll-custom-exchange">
        <el-header class="be-flex main-header header-mobile" style="height: 70px">
          <div class="be-flex-item">
            <main-header />
          </div>
        </el-header>
        <router-view />
        <el-footer class="be-flex align-center jc-space-between main-footer footer-desktop">
          <div class="footer-left">
            <span class="d-ib mr-24 cursor text-hyperlink" @click="handleClickTerm">{{ $t('footer.terms') }}</span>
            <span style="color: #5b616e">{{ urlSystem['system.token.company.address'] }}</span>
          </div>

          <div v-if="contractAddress" class="footer-right">
            Smart Contract (ERC-20):
            <span class="text-hyperlink" @click="handleOpenTab">{{ contractAddress | formatTransactionCode(5, 5) }}</span>
          </div>
        </el-footer>
      </el-main>
      <el-footer class="footer-mobile">
        <router-view name="footer"></router-view>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import MainSidebar from '../../sidebar/MainSidebar.vue'
  import MainHeader from '../../header/MainHeader.vue'
  import BasePageLoading from '../../page-loading/BasePageLoading.vue'
  import { namespace } from 'vuex-class'
  import EventBus from '@/utils/eventBus'
  import getRepository from '@/services'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  import { filter } from 'lodash'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')

  @Component({
    components: { MainSidebar, MainHeader, BasePageLoading }
  })
  export default class LayoutExchange extends Vue {
    @bcAuth.Action('getInfo') getInfo!: () => Promise<any>
    @bcAuth.Action('logout') logout!: () => Promise<any>
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    @beBase.State('coinMain') coinMain!: string
    @bcAuth.Action('setConfigModule') setConfigModule!: (data: Record<string, any>) => void
    @bcAuth.State('walletAddress') walletAddress!: string
    @bcAuth.Mutation('SET_INFO') setInfo!: (info: Record<string, any>) => Promise<any>
    isLoading = false
    selectLanguage = ''

    listAssetNetwork: Array<Record<string, any>> = []

    async created(): Promise<void> {
      try {
        this.isLoading = true
        this.selectLanguage = window.localStorage.getItem('bc-lang')!
        if (this.walletAddress) {
          const info = await apiNft.getInfoExternalUser()
          await this.setInfo(info.data)
        }
        this.isLoading = false
      } catch (error: any) {
        this.isLoading = false
      }
    }

    get getIcon(): string {
      return this.selectLanguage === 'vi' ? 'flag-vn' : 'flag-usa'
    }

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.coinMain)[0]
        return tokenLynk.contractAddress
      }
      return ''
    }

    handleOpenTab(): void {
      window.open(`https://etherscan.io/address/${this.contractAddress}`, '_blank')
    }

    handleChangeLanguage(lang: string): void {
      this.$i18n.locale = lang
      window.localStorage.setItem('bc-lang', lang)
      EventBus.$emit('changeLang', lang)
      location.reload()
    }

    handleClickTerm(): void {
      window.open(`${this.urlSystem['system.token.terms']}`)
    }
  }
</script>
<style lang="scss" scoped>
  .main-layout {
    .footer-mobile {
      display: none;
    }
    ::v-deep.main-content .main-header {
      border-bottom: initial !important;
    }

    ::v-deep#main-header,
    ::v-deep.main-footer {
      background-color: var(--color-background);

      .content-left__item > span,
      .text-base {
        color: var(--color-text-primary);
      }
    }
    ::v-deep.main-footer {
      border-top: 1px solid var(--color-border-primary);
    }

    position: relative;
    height: 100vh;

    .sidebar-left {
      border-right: 1px solid #ccc;
      height: 100%;
      overflow: hidden;
      background-color: #e9e9e9;
      position: relative;
    }

    .main-content {
      .main-header {
        border-bottom: 1px solid #d2d0ce;
        padding: 0px;
      }

      .main-center {
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 0;
        background-color: #f6f8fc;
      }
    }

    .sidebar-right {
      padding-top: 15px;
      border-left: 1px solid hsl(0deg 0% 100% / 10%);
      overflow: hidden;
    }
  }
  .main-header {
    display: flex;
    &.header-mobile {
      display: none;
    }
  }

  .show-player {
    .sidebar-left {
      height: calc(100vh - 90px);
    }

    .main-content {
      height: calc(100vh - 90px);
    }

    .sidebar-right {
      height: calc(100vh - 90px);
    }
  }

  .main-footer {
    border-top: 1px solid var(--bc-border-primary);
    padding: 0 24px;
  }

  .footer-right {
    // margin-right: 67px;
    span {
      cursor: pointer;
      color: var(--bc-theme-primary);
    }

    .suffix {
      .flag-usa {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 7px;
        display: block;
      }

      .flag-vn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 6px;
        display: block;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .main-layout {
      .el-footer {
        padding: 0;
      }
      .footer-mobile {
        height: initial !important;
        display: block;
      }
      .main-content .main-center {
        overflow-x: hidden;
        overflow-y: auto;
        background-color: var(--color-background-mobile);
      }
      .main-header {
        display: none;
        &.header-mobile {
          display: flex;
        }
      }

      .footer-desktop {
        display: none;
      }
    }
  }
</style>
