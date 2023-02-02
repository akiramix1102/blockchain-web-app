<template>
  <div class="slide-detail-nft">
    <div class="nft-header3 text-semibold title-related">{{ $t('detail-nft.related') }}</div>
    <div class="list-collection">
      <div v-if="itemRelated.length">
        <div class="isPc">
          <swiper :options="swiperOption" class="row-nft" ref="swiperRef">
            <!-- 1 khoi -->
            <swiper-slide v-for="item in itemRelated" :key="item.id" class="item">
              <nft-item :itemNft="item" @favourite="handleClickFavourite" @buy-collection="handleBuy" @bid-explore="handleBid" />
            </swiper-slide>
          </swiper>
        </div>
        <div class="isMobile">
          <div class="wrap-carousel">
            <div class="carousel-item" v-for="(item, index) in itemRelated.slice(0, 4)" :key="index">
              <nft-item :itemNft="item" @favourite="handleClickFavourite" @bid-hot="handleBuy" @bid-explore="handleBid" class="relate-nft-item-mobile" />
            </div>
          </div>
        </div>
      </div>
      <empty-block v-else :show="true" class="empty" />
      <div class="swiper-pagination isPC"></div>
      <div class="isPC">
        <div v-if="itemRelated.length > 4" class="btn-crousel cursor prev" @click="handleClickArrow('prev')">
          <base-icon v-if="coinMain === 'LYNK'" icon="icon-prev" size="32" class="d-iflex" />
          <base-icon v-else icon="icon-prev-clm" size="32" class="d-iflex" />
        </div>
        <div v-if="itemRelated.length > 4" class="btn-crousel cursor next" @click="handleClickArrow('next')">
          <base-icon v-if="coinMain === 'LYNK'" icon="icon-next" size="32" class="d-iflex" />
          <base-icon v-else icon="icon-next-clm" size="32" class="d-iflex" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Mixins } from 'vue-property-decorator'
  import NftItem from '../base/NftItem.vue'
  import { SwiperOptions } from 'swiper'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.css'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  @Component({ components: { NftItem, Swiper, SwiperSlide, EmptyBlock } })
  export default class ListCollection extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array, default: [] }) itemRelated!: Array<Record<string, any>>

    @beBase.State('coinMain') coinMain!: string

    itemNft = {}

    swiperOption: SwiperOptions = {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
      console.log('bid-collection3', itemNft)
      this.setOpenPopup({
        popupName: 'popup-bid-explore',
        isOpen: true
      })
    }
    handleClickArrow(type: 'prev' | 'next'): void {
      if (type === 'prev') {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slidePrev()
      } else {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slideNext()
      }
    }
    collection = {
      name: 'Virtual Tour SandBox',
      verified: true,
      price: 8765612.88,
      numOfFavourite: 121
    }

    handleClickFavourite(data: Record<string, any>): void {
      this.$emit('favourite', data)
    }
    handleBuy(itemNft): void {
      this.$emit('dataItemNFT', itemNft)
    }
  }
</script>

<style scoped lang="scss">
  .slide-detail-nft {
    margin: 60px 0;
    @media (max-width: 767px) {
      margin: 40px 0;
    }
  }
  ::v-deep.list-collection {
    margin-top: 40px;
    position: relative;
    .row-nft {
      display: flex;
      overflow: hidden;
      padding-top: 5px;
      .item {
        transition: all 0.2s ease;
        &:hover {
          transform: translateY(-5px);
        }
      }
    }
    .empty-block.empty {
      text-align: center;
      padding: 0 !important;
      .span-icon {
        font-size: 150px !important;
      }
      .empty-text {
        color: #8f8f8f;
      }
    }
    .swiper-pagination {
      position: relative;
      margin-top: 40px;
      bottom: 0 !important;
      .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        margin-right: 12px;
      }
    }
  }

  .btn-crousel {
    top: 45%;
    z-index: 2;
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
  }
  .prev {
    left: -29px;
  }
  .next {
    right: -29px;
  }
  .isPC {
    display: block !important;
  }
  .isMobile {
    display: none !important;
  }
  @media screen and (max-width: 1201px) {
    .isPC {
      display: none !important;
    }
    .isMobile {
      display: block !important;
    }
    .relate-nft-item-mobile {
      width: 310px;
      .avatar {
        width: 100% !important;
      }
    }
    .wrap-carousel {
      display: flex;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .carousel-item {
        margin-right: 20px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
    .list-collection {
      margin-top: 24px;
      .row-nft {
        display: none;
      }
    }
  }
  @media (max-width: 767px) {
    .title-related {
      font-size: 24px;
      line-height: 32px;
    }
  }
</style>
