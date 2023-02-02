<template>
  <div class="staking-view">
    <div class="staking__steps-view">
      <p class="step-header">Put your asset to work and earn rewards</p>
      <p class="step-header-mobile">
        <span>Put your asset to</span><br />
        work and earn rewards
      </p>
      <div class="staking-step-wrap">
        <div class="staking-step-item">
          <img src="@/assets/images/earn/staking-step-1.png" alt="" class="step-img" />
          <div class="staking-step-item-header">Get staking assets</div>
          <div class="staking-step-item-desc">Buy assets or fund your LynKey account with one of the assets that are eligible for staking below.</div>
        </div>
        <div class="staking-step-item">
          <img src="@/assets/images/earn/staking-step-2.png" alt="" class="step-img" />
          <div class="staking-step-item-header">Select an asset to stake</div>
          <div class="staking-step-item-desc">Choose from the available assets in your spot wallet.</div>
        </div>
        <div class="staking-step-item">
          <img src="@/assets/images/earn/staking-step-3.png" alt="" class="step-img" />
          <div class="staking-step-item-header">Earn rewards</div>
          <div class="staking-step-item-desc">You will receive rewards Up to 60% a year from your staked assets.</div>
        </div>
      </div>
      <swiper class="carousel-swiper staking-step-wrap-mobile" :options="swiperOption" ref="swiperRef">
        <swiper-slide class="cursor" v-for="item in listSteps" :key="item.id">
          <div class="text-center">
            <img :src="item.imgUrl" alt="" class="step-img" />
            <p class="text-0xl text-bold text-0a0b0d">{{ item.title }}</p>
            <p class="description text-body-small text-regular">
              {{ item.description }}
            </p>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="staking__list">
      <div class="staking__list-header">DeFi Staking</div>
      <el-select v-if="!isDesktop" v-model="selectedCurrency" placeholder="Select currency" class="w-100 mt-24 staking__list-filter" popperClass="popper-staking-filter">
        <div class="staking__list-filter-prefix" slot="prefix">
          <base-icon :icon="getIconCurrency(selectedCurrency)" size="24" class="mr-8"></base-icon>
          {{ prefixSelectCurrency }}
        </div>
        <el-option v-for="item in listSelectCurrencies" :key="item.id" :value="item.currency" class="flex js-space-between">
          <base-icon :icon="getIconCurrency(item.currency)" size="24" class="mr-8"></base-icon>
          <span>{{ item.currency }} ({{ item.currencyName }})</span>
        </el-option>
      </el-select>
      <div class="staking__list-wrap">
        <div class="staking-card" v-for="item in listStakingPackFilter" :key="item.id" @click="handleViewStakingPack(item.id)">
          <base-icon :icon="getIconCurrency(item.currency)" size="36" class="currency-icon"></base-icon>
          <p class="staking-card__currency mt-12">{{ item.currency }}</p>
          <p class="staking-card__apr mt-12">
            APR: <span class="text-green">{{ item.aprPercent }}%</span>
          </p>
          <div class="staking-rewards mt-12">
            <div class="staking-rewards__life-cycle">{{ item.durations }} {{ getDurationType(item.durations, item.durationType) }}</div>
            <div class="staking-rewards__type">{{ getInterestType(item.interestType) }}</div>
          </div>
          <div class="staking-btn" @click="handleViewStakingPack(item.id)">Explore</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const stakingStore = namespace('stakingStore')
  const beBase = namespace('beBase')
  import { IStakingPack } from '@/modules/earn/store/staking'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import { SwiperOptions } from 'swiper'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  import 'swiper/swiper-bundle.css'
  SwiperClass.use([Pagination])

  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)

  import getRepository from '@/services'
  import { EarnRepository } from '@/services/repositories/earn'
  const apiStaking: EarnRepository = getRepository('earn')
  import firebase from '@/utils/firebase'

  interface IParamData {
    id: number
    code: string
    key: string
    value: string
    type: string
    districtId: number
    districtNo: string
    createdBy: string | null
    updatedBy: string | null
    createdAt: string
    updatedAt: string | null
  }

  @Component({ components: { Swiper, SwiperSlide } })
  export default class StakingHome extends Vue {
    @stakingStore.State('stakingPack') stakingPack!: IStakingPack
    @stakingStore.State('allStakingPack') allStakingPack!: IStakingPack[]
    @beBase.State('isDesktop') isDesktop!: boolean

    listOfInterestType: Array<IParamData> = []
    listOfDurationType: Array<IParamData> = []

    // list select currencies
    listAssetCurrencies: Array<Record<string, any>> = []
    selectedCurrency = 'ALL'
    refAssetNetwork: any = null

    listSteps = [
      {
        id: 0,
        title: 'Get staking assets',
        description: 'Buy assets or fund your LynKey account with one of the assets that are eligible for staking below.',
        imgUrl: 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2022/12/8/165472_1670486763288.png'
      },
      {
        id: 1,
        title: 'Select an asset to stake',
        description: 'Choose from the available assets in your spot wallet.',
        imgUrl: 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2022/12/8/165472_1670486763249.png'
      },
      {
        id: 2,
        title: 'Earn rewards',
        description: 'You will receive rewards Up to 60% a year from your staked assets.',
        imgUrl: 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2022/12/8/165472_1670486763282.png'
      }
    ]

    swiperOption: SwiperOptions = {
      slidesPerView: 1,
      spaceBetween: 0,
      slidesPerGroup: 1,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    }

    // ================================= lifecycle fnc
    created(): void {
      this.initParams()
      const refAssetNetwork = firebase.database().ref('asset_networks')
      this.refAssetNetwork = refAssetNetwork.on('value', snapshot => {
        this.listAssetCurrencies = snapshot.val()
      })
      if (!this.isDesktop) this.selectedCurrency = 'LYNK'
      else this.selectedCurrency = 'ALL'
    }

    destroy(): void {
      const refAssetNetwork = firebase.database().ref('asset_networks')
      refAssetNetwork.off('value', this.refAssetNetwork)
    }

    // ================================= computed

    get prefixSelectCurrency(): string {
      if (this.selectedCurrency === 'ALL') return `All tokens`
      let selectedObj = this.listSelectCurrencies.find(el => el.currency === this.selectedCurrency)
      return `${selectedObj?.currency} (${selectedObj?.currencyName})`
    }

    get listStakingPackFilter(): Array<IStakingPack> {
      if (this.selectedCurrency === 'ALL') return this.allStakingPack
      return this.allStakingPack.filter(el => el.currency === this.selectedCurrency)
    }

    get listSelectCurrencies(): Array<Record<string, any>> {
      return [...this.listAssetCurrencies]
    }

    // ================================= methods

    handleViewStakingPack(stakingId: number): void {
      this.$router.push({ name: 'StakingDetail', params: { stakingId: `${stakingId}` } })
    }

    async initParams(): Promise<void> {
      //
      const rs = await Promise.all([apiStaking.getTypeDistricParams({ type: 'INTEREST_TYPE' }), apiStaking.getTypeDistricParams({ type: 'DURATION_TYPE' })])
      this.listOfInterestType = rs[0]?.content
      this.listOfDurationType = rs[1]?.content
    }

    // ================================= Builtin Functions

    getIconCurrency(currency: string): string {
      return 'icon-' + currency.toLowerCase()
    }

    getInterestType(type: string): string {
      const value = this.listOfInterestType.find(el => el.key === type)?.value || ''
      return value
    }

    getDurationType(duration: number, type: string): string {
      const value = this.listOfDurationType.find(el => el.key === type)?.value || ''
      return duration < 2 ? value : value + 's'
    }
  }
</script>

<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  .staking-view {
    overflow: hidden;
    max-width: 1200px;
    margin: 0 auto 60px;

    .staking__steps-view {
      width: 100%;

      .step-header {
        @include text(40px, 56px, 600, var(--bc-text-primary));
        text-align: center;
        max-width: 449px;
        margin: 40px auto 0;
        text-align: center;
      }

      .step-header-mobile {
        display: none;
      }
      .staking-step-wrap {
        display: flex;
        margin-top: 40px;
        align-items: flex-start;
        justify-content: space-between;
        .staking-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 322px;

          &-header {
            margin-top: 20px;
            @include text(20px, 24px, 600, #000);
          }
          &-desc {
            margin-top: 12px;
            text-align: center;
            @include text(14px, 24px, 400, #000);
          }
        }
      }
      .staking-step-wrap-mobile {
        display: none;
      }
    }

    .staking__list {
      margin-top: 60px;
      .staking__list-header {
        @include text(40px, 56px, 600, var(--bc-text-primary));
        text-align: center;
      }
      .staking__list-filter {
        ::v-deep.el-input {
          .el-input__inner {
            color: transparent;
            border-color: #dbdbdb;
          }
          .el-input__prefix {
            user-select: none;
            pointer-events: none;
          }
        }
        .staking__list-filter-prefix {
          display: flex;
          align-items: center;
          margin-top: 7px;
          margin-left: 7px;
          left: 12px !important;
          user-select: none;
          pointer-events: none;
          @include text(16px, 24px, 400, #5b616e);
        }
      }
      .staking__list-wrap {
        margin-top: 40px;
        display: flex;
        flex-wrap: wrap;
        gap: 24px 24px;

        .staking-card {
          width: 282px;
          height: 260px;
          border-radius: 8px;
          padding: 24px;
          border: 1px solid #dbdbdb;
          display: flex;
          flex-direction: column;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
          .currency-icon {
            height: 36px;
            width: 36px;
            display: flex;
          }
          .staking-card__currency {
            @include text(20px, 24px, 600, var(--bc-text-primary));
          }
          .staking-card__apr {
            @include text(16px, 24px, 400, var(--bc-text-primary));
            .text-green {
              color: var(--bc-status-success);
            }
            .text-red {
              color: var(--bc-status-error);
            }
          }
          .staking-rewards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            gap: 6px;
            .staking-rewards__life-cycle,
            .staking-rewards__type {
              @include text(12px, 16px, 400, var(--bc-text-primary));
              display: flex;
              height: 32px;
              width: 100%;
              border: 1px solid #dbdbdb;
              border-radius: 4px;
              justify-content: center;
              align-items: center;
            }
          }
          .staking-btn {
            width: 100%;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
            border-radius: 6px;
            @include text(16px, 24px, 400, #fff);
            &:hover {
              cursor: pointer;
              background: linear-gradient(52.87deg, #8c3ef2 40.29%, #3037f4bb 97.93%);
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    ::v-deep.staking-view {
      padding: 16px 20px;
      margin-bottom: 32px;

      .staking__list {
        margin-top: 40px;
        .staking__list-header {
          @include text(24px, 32px, 600, var(--bc-text-primary));
        }
        .staking__list-wrap {
          margin-top: 16px;
          display: grid;

          .staking-card {
            // min-width: 336px;
            width: 100%;
            padding: 16px;
            height: auto;
          }
        }
      }
      .step-header {
        display: none;
      }

      .staking-step-wrap {
        display: none !important;
      }

      .swiper-container {
        overflow: hidden;
      }
      .staking-step-wrap-mobile {
        display: block !important;
        text-align: center;

        .swiper-slide {
          margin-bottom: 20px;
          .step-img {
            margin-bottom: 20px;
            width: 60px;
            height: 60px;
          }
          .description {
            margin-top: 12px;
            color: #0a0b0d;
          }
        }
        .swiper-pagination {
          bottom: -54px;
          text-align: center;
          display: contents !important;

          .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
          }
          .swiper-pagination-bullet {
            background: #dbdbdb;
            opacity: 1;
          }
        }
      }

      .staking-rewards {
        display: flex !important;
        gap: 0 !important;

        .staking-rewards__life-cycle {
          margin-right: 8px;
        }
      }
      .step-header-mobile {
        display: block !important;
        @include text(24px, 32px, 600, #0a0b0d);
        text-align: center;
        margin-top: 0px;
        margin-bottom: 24px;
      }
    }
  }
</style>
