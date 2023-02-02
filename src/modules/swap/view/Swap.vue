<template>
  <div v-if="isDesktop" class="m-auto bc-crowd-sale">
    <div class="be-flex bc-crowd-sale__above mb-24">
      <form-swap @success="swapSuccess" />
    </div>
    <div class="be-flex bc-crowd-sale__below mb-24 mt-24">
      <table-transaction ref="table-transaction" />
    </div>
  </div>
  <div v-else class="bc-crowd-sale-mobile">
    <!-- <p class="title-crowdsale">Crowdsale</p> -->
    <div class="">
      <form-swap-mobile class="mb-24" @success="swapSuccess" />
    </div>
    <div class="mt-24">
      <TableTransactionMobile class="mb-24" ref="table-transaction" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import FormSwap from '../components/FormSwap.vue'
  import TableTransaction from '../components/TableTranscation.vue'
  import { namespace } from 'vuex-class'
  import FormSwapMobile from '../components/mobileSwap/FormSwapMobile.vue'
  import TableTransactionMobile from '../components/mobileSwap/TableTransactionMobile.vue'

  const beAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  @Component({ components: { FormSwap, TableTransaction, FormSwapMobile, TableTransactionMobile } })
  export default class CrowdSale extends Vue {
    @beAuth.State('moduleConfig') moduleConfig!: Record<string, any>
    @beBase.State('isDesktop') isDesktop!: boolean

    swapSuccess(): void {
      //@ts-ignore
      this.$refs['table-transaction']?.init()
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
