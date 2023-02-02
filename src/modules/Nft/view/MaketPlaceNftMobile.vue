<template>
  <div>
    <slider-banner-mobile-rework />
    <top-collection-mobile />
    <hot-nft-mobile />
    <unique-per-day />
    <explore-nft-mobile />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import SliderBannerMobileRework from '../components/home/mobile/SliderBannerMobileRework.vue'
  import TopCollectionMobile from '../components/home/mobile/TopCollectionMobile.vue'
  import HotNftMobile from '../components/home/mobile/HotNftMobile.vue'
  import UniquePerDay from '../components/home/UniquePerDay.vue'
  import ExploreNftMobile from '../components/home/mobile/ExploreNftMobile.vue'

  @Component({
    components: {
      SliderBannerMobileRework,
      TopCollectionMobile,
      HotNftMobile,
      ExploreNftMobile,
      UniquePerDay
    }
  })
  export default class MarketPlaceNft extends Vue {}
</script>

<style></style>
