<template>
  <div v-if="isDesktop" class="w-100 bc-wallet">
    <AffiliateHeader />
    <AffiliateTable />
  </div>
  <div v-else class="w-100 bc-wallet" style="margin-top: -4px">
    <p class="title-affiliate">{{ $t('affiliate.affiliate') }}</p>
    <AffiliateHeaderMobile />
    <AffiliateTableMobile />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import AffiliateHeader from '../components/AffiliateHeader.vue'
  import AffiliateTable from '../components/AffiliateTable.vue'
  import AffiliateHeaderMobile from '../components/mobileAffiliate/AffiliateHeaderMobile.vue'
  import AffiliateTableMobile from '../components/mobileAffiliate/AffiliateTableMobile.vue'

  const beBase = namespace('beBase')
  //@ts-ignore
  // import WalletTable from '../components/WalletTable.vue'
  @Component({ components: { AffiliateHeader, AffiliateTable, AffiliateHeaderMobile, AffiliateTableMobile } })
  export default class BCHome extends Vue {
    @beBase.State('isDesktop') isDesktop!: boolean
  }
</script>

<style scoped>
  .title-affiliate {
    font-size: 20px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-top: -6px;
    margin-bottom: 24px;
  }
</style>
