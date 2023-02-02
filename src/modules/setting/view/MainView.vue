<template>
  <div v-if="isDesktop" class="w-100 bc-setting">
    <div class="be-flex w-100 tabs">
      <div class="tab-item cursor" v-for="tab in getTab" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleClickTab(tab)">
        <span class="text-base">{{ $t(`setting.${tab.i18n}`) }}</span>
      </div>
    </div>
    <div class="content">
      <router-view />
      <!--      <profile v-if="$route.name === 'Profile'"/>-->
    </div>
  </div>

  <div v-else class="w-100 bc-setting">
    <h1 class="title-setting">{{ $t(`setting.title-setting`) }}</h1>
    <div class="be-flex w-100 tabs">
      <div class="tab-item cursor" v-for="tab in getTab" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleClickTab(tab)">
        <span class="text-base">{{ $t(`setting.${tab.i18n}`) }}</span>
      </div>
    </div>
    <div class="content">
      <mobile-profile v-if="$route.name === 'Profile'" />
      <mobile-kyc v-if="$route.name === 'KYC'" />
      <mobile-security v-if="$route.name === 'Security'" />
      <mobile-activity v-if="$route.name === 'Activity'" />
      <mobile-level v-if="$route.name === 'Quota'" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import MobileProfile from '@/modules/setting/components/mobileSetting/MobileProfile.vue'
  import MobileKyc from '@/modules/setting/components/mobileSetting/MobileKyc.vue'
  import Security from '@/modules/setting/view/Security.vue'
  import Activity from '@/modules/setting/view/Activity.vue'
  import Quota from '@/modules/setting/view/Quota.vue'
  import MobileSecurity from '@/modules/setting/components/mobileSetting/MobileSecurity.vue'
  import MobileActivity from '@/modules/setting/components/mobileSetting/MobileActivity.vue'
  import MobileLevel from '@/modules/setting/components/mobileSetting/MobileLevel.vue'
  const beBase = namespace('beBase')
  const bcAuth = namespace('beAuth')
  @Component({
    components: { MobileLevel, MobileActivity, MobileSecurity, Quota, Activity, Security, MobileKyc, MobileProfile }
  })
  export default class MainView extends Vue {
    @bcAuth.Getter('isLogin') isLogin!: boolean
    @beBase.State('isDesktop') isDesktop!: boolean

    tabs: Array<Record<string, any>> = [
      {
        id: 0,
        title: 'Profile',
        routeName: 'Profile',
        i18n: 'tab-profile'
      },
      {
        id: 1,
        title: 'KYC',
        routeName: 'KYC',
        i18n: 'kyc'
      },
      {
        id: 2,
        title: 'Security',
        routeName: 'Security',
        i18n: 'security'
      },
      {
        id: 3,
        title: 'Activity',
        routeName: 'Activity',
        i18n: 'tab-activity'
      },
      {
        id: 4,
        title: 'Level',
        routeName: 'Quota',
        i18n: 'level'
      }
    ]
    tabActive = 0

    get getTab(): Array<Record<string, any>> {
      if (this.isLogin) {
        return this.tabs
      } else {
        return [
          {
            id: 0,
            title: 'Profile',
            routeName: 'Profile',
            i18n: 'tab-profile'
          }
        ]
      }
    }

    handleClickTab(tab: Record<string, any>): void {
      this.tabActive = tab.id
      this.$router.push({ name: tab.routeName })
    }
  }
</script>

<style scoped lang="scss">
  .bc-setting {
    .tabs {
      border-bottom: 1px solid var(--bc-border-primary);
      .tab-item {
        padding: 16px 20px;
        position: relative;
        color: var(--bc-text-color-tab-item) !important;
        &:hover {
          background: var(--bc-tab-active);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .tab-active {
        background: var(--bc-tab-active);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background: var(--bc-tab-active);
        }
      }
      background: var(--bc-color-white);
    }
  }
  @media screen and (max-width: 768px) {
    .bc-setting {
      .title-setting {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        padding: 0 20px 24px 0;
      }
      .tabs::-webkit-scrollbar {
        display: none;
      }
      .tabs {
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
        .tab-item {
          padding: 12px 20px 6px 20px;
          .text-base {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: #89909e;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
