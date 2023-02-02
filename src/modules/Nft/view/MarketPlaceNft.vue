<template>
  <div class="wrap-home">
    <div class="container-nft">
      <div class="wrap-home-pc" v-if="isDesktop">
        <slide-banner />
        <top-collection />
        <hot-nft />
        <unique-per-day />
        <explore-nft />

        <!-- <hotcollecttion />
      <trending-collection /> -->
        <!-- <top-seller /> -->
        <!-- <list-category />
      <download-app /> -->
      </div>
      <div class="wrap-home-mobile" v-else>
        <market-place-nft-mobile />
      </div>
      <about-market />
    </div>
    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import SlideBanner from '../components/home/SlideBanner.vue'
  import TopCollection from '../components/home/TopCollection.vue'
  import Hotcollecttion from '@/modules/Nft/components/HotCollection.vue'
  import TrendingCollection from '@/modules/Nft/components/TrendingCollection.vue'
  import TopSeller from '../components/home/TopSeller.vue'
  import ListCategory from '../components/home/ListCategory.vue'
  import DownloadApp from '../components/DownloadApp.vue'
  import FooterMarket from '../components/Footer.vue'
  import HotNft from '../components/home/HotNft.vue'
  import UniquePerDay from '../components/home/UniquePerDay.vue'
  import ExploreNft from '../components/home/ExploreNft.vue'
  import AboutMarket from '../components/home/AboutMarket.vue'
  import MarketPlaceNftMobile from './MaketPlaceNftMobile.vue'
  import FooterMobile from '@/modules/Nft/components/home/mobile/FooterMobile.vue'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component({
    components: {
      SlideBanner,
      FooterMarket,
      TopCollection,
      TopSeller,
      DownloadApp,
      Hotcollecttion,
      TrendingCollection,
      ListCategory,
      HotNft,
      UniquePerDay,
      ExploreNft,
      AboutMarket,
      MarketPlaceNftMobile,
      FooterMobile
    }
  })
  export default class MarketPlaceNft extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean
  }
</script>

<style lang="scss" scoped>
  .wrap-home {
    //height: 100vh;
    overflow: hidden;
    padding-top: 70px;
    // background-color: var(--bc-bg-market);
  }
</style>
