<template>
  <div class="w-100 bc-wallet">
    <div v-if="!isDesktop" class="wallet">Wallet</div>
    <div v-if="!isDesktop">
      <MobileWalletHeader />
      <mobile-wallet-table />
    </div>
    <div v-else>
      <wallet-header />
      <!-- <wallet-table /> -->
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import WalletHeader from '../components/WalletHeader.vue'
  import WalletTable from '../components/WalletTable.vue'
  import { namespace } from 'vuex-class'
  import MobileWalletHeader from '@/modules/home/components/mobileWallet/MobileWalletHeader.vue'
  import MobileWalletTable from '../components/mobileWallet/MobileWalletTable.vue'
  const beBase = namespace('beBase')
  const bcWallet = namespace('bcWallet')
  // import getRepository from '@/services'
  // import WalletRepository from '@/services/repositories/wallet'
  // const apiWallet: WalletRepository = getRepository('wallet')
  @Component({ components: { MobileWalletHeader, WalletHeader, WalletTable, MobileWalletTable } })
  export default class BCHome extends Vue {
    @beBase.State('coinMain') coinMain!: string
    // @bcWallet.State('isDesktop') isDesktop!: boolean
    @beBase.State('isDesktop') isDesktop!: boolean
    // wallet: Array<Record<string, any>> = []
    // exchangeRate: Array<Record<string, any>> = []
    created(): void {
      // if (this.coinMain === 'LYNK') {
      //   this.$router.push({ name: 'WalletLyn' })
      // } else {
      //   this.$router.push({ name: 'WalletClm' })
      // }
    }
  }
</script>

<style scoped>
  .wallet {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: var(--bc-text-primary);
    margin: 0 0 24px 0;
  }
</style>
