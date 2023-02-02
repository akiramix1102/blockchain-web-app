<template>
  <div v-if="isDesktop" class="m-auto bc-crowd-sale">
    <div class="be-flex bc-crowd-sale__above mb-24">
      <buy-lyn />
      <time-progress />
    </div>
    <div class="be-flex bc-crowd-sale__middle mb-24">
      <table-round />
    </div>
    <div class="be-flex bc-crowd-sale__below mb-24">
      <table-transaction />
    </div>
  </div>
  <div v-else class="bc-crowd-sale-mobile">
    <p class="title-crowdsale">Crowdsale</p>
    <div class="">
      <BuyLynMobile class="mb-24" />
      <TimeProgressMobile class="mb-24" />
    </div>
    <div class="">
      <TableRoundMobile class="mb-24" />
    </div>
    <div class="">
      <TableTransactionMobile class="mb-24" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import BuyLyn from '../components/BuyLyn.vue'
  import TimeProgress from '../components/TimeProgress.vue'
  import TableRound from '../components/TableRound.vue'
  import TableTransaction from '../components/TableTranscation.vue'
  import { namespace } from 'vuex-class'
  import BuyLynMobile from '../components/mobileCrowdsale/BuyLynMobile.vue'
  import TimeProgressMobile from '../components/mobileCrowdsale/TimeProgressMobile.vue'
  import TableRoundMobile from '../components/mobileCrowdsale/TableRoundMobile.vue'
  import TableTransactionMobile from '../components/mobileCrowdsale/TableTransactionMobile.vue'

  const beAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  @Component({ components: { BuyLyn, TimeProgress, TableRound, TableTransaction, BuyLynMobile, TimeProgressMobile, TableRoundMobile, TableTransactionMobile } })
  export default class CrowdSale extends Vue {
    @beAuth.State('moduleConfig') moduleConfig!: Record<string, any>
    @beBase.State('isDesktop') isDesktop!: boolean

    created(): void {
      // if (!this.moduleConfig.Crowdsale) {
      //   this.$router.push({ name: 'Wallet' })
      // }
    }
  }
</script>

<style scoped lang="scss">
  .bc-crowd-sale {
    width: 1152px;
  }

  .bc-crowd-sale-mobile {
    width: 100%;
  }
  .title-crowdsale {
    font-size: 20px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-top: -10px;
    margin-bottom: 24px;
  }
</style>
