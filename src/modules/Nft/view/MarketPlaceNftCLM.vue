<template>
  <div class="wrap-home">
    <the-banner />
    <div class="container-nft">
      <div class="wrap-home-pc">
        <slide-banner />
        <top-collection />
        <hot-nft />
        <unique-per-day />
        <div v-if="listCategoryFilter.length">
          <div v-for="(itemCategory, index) in listCategoryFilter" :key="index">
            <explore-nfts :itemCategory="itemCategory" />
          </div>
          <!-- <commercial-nft :itemCommercial="listCategoryFilter[1]" />
          <mixed-fund-nft :itemMiXed="listCategoryFilter[2]" /> -->
        </div>
        <about-market />

        <!-- <hotcollecttion />
      <trending-collection /> -->
        <!-- <top-seller /> -->
        <!-- <list-category />
      <download-app /> -->
      </div>
      <!-- <div class="wrap-home-mobile" v-else>
        <market-place-nft-mobile />
      </div>
      <about-market /> -->
    </div>
    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import SlideBanner from '../components/home/SlideBanner.vue'
  import TopCollection from '../components/maketplaceCLM/TopCollection.vue'
  import HotNft from '@/modules/Nft/components/maketplaceCLM/HotNft.vue'
  import TrendingCollection from '@/modules/Nft/components/TrendingCollection.vue'
  import TopSeller from '../components/home/TopSeller.vue'
  import ListCategory from '../components/home/ListCategory.vue'
  import DownloadApp from '../components/DownloadApp.vue'
  import FooterMarket from '../components/Footer.vue'
  import UniquePerDay from '../components/home/UniquePerDay.vue'
  import AboutMarket from '../components/home/AboutMarket.vue'
  import ExploreNfts from '../components/maketplaceCLM/ExploreNfts.vue'
  import { namespace } from 'vuex-class'
  import TheBanner from '../components/maketplaceCLM/TheBanner.vue'
  import filter from 'lodash/filter'
  const bcNft = namespace('bcNft')

  @Component({
    components: {
      SlideBanner,
      FooterMarket,
      TopCollection,
      TopSeller,
      DownloadApp,
      TrendingCollection,
      ListCategory,
      HotNft,
      UniquePerDay,
      AboutMarket,
      TheBanner,
      ExploreNfts
    }
  })
  export default class MarketPlaceNft extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean
    @bcNft.State('listCategoryFilter') listCategoryFilter!: Array<Record<string, any>>

    // itemResidential = {}

    // get getResidential(){
    //    this.itemResidential = filter(this.listCategoryFilter, item => item.name === country)[0]
    // }
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
