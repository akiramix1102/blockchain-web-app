<template>
  <div class="staking-view-wrapper">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <Footer />
    <popup-payment-method />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Footer from '@/modules/Nft/components/Footer.vue'
  import PopupPaymentMethod from '@/modules/Nft/components/base/PopupPaymentMethod.vue'
  import { namespace } from 'vuex-class'

  import getRepository from '@/services'
  import { EarnRepository } from '@/services/repositories/earn'
  const apiStaking: EarnRepository = getRepository('earn')

  const stakingStore = namespace('stakingStore')
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  import { IStakingPack } from '@/modules/earn/store/staking'

  @Component({ components: { Footer, PopupPaymentMethod } })
  export default class StakingView extends Vue {
    @stakingStore.Mutation('SET_LIST_STAKING_PACK') setListStakingPack!: (listStakingPack: IStakingPack[]) => void
    @beBase.Mutation('SET_STATUS_SCREEN') setStatusScreen!: (status: boolean) => void
    @bcNft.Mutation('SET_STATUS_SCREEN') setStatusScreenNFT!: (status: boolean) => void
    created(): void {
      console.log('created staking view')
      if (window.innerWidth > 1200) {
        this.setStatusScreen(true)
        this.setStatusScreenNFT(true)
      } else {
        this.setStatusScreen(false)
        this.setStatusScreenNFT(false)
      }
    }
    async initAllStakingPackages(): Promise<void> {
      const rs = await apiStaking.getAllStakingPack({ page: 1, limit: 1000 })
      this.setListStakingPack(rs.content)
    }
    mounted(): void {
      console.log('mounted staking view')
      this.initAllStakingPackages()
    }
    destroy(): void {
      //
    }
  }
</script>

<style lang="scss" scoped>
  .staking-view-wrapper {
    overflow: hidden;
    padding-top: 80px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
