<template>
  <div class="hot-nft">
    <div class="nft-header3 text-semibold be-flex align-center jc-space-center mb-40 title">
      <span> {{ $t('text-nft.hot-nft') }}</span>
      <img src="../../../../assets/images/nft/fire.png" class="d-block" alt="" style="margin-left: 8px; margin-top: -14px" />
      <div v-if="listNft.length > 1" class="swiper-button-prev btn-crousel cursor prev" @click="handleClickArrow('prev')">
        <base-icon v-if="coinMain === 'LYNK'" icon="icon-prev" size="32" class="d-iflex" />
        <base-icon v-else icon="icon-prev-clm" size="32" class="d-iflex" />
      </div>
      <div v-if="listNft.length > 1" class="swiper-button-next btn-crousel cursor next" @click="handleClickArrow('next')">
        <base-icon v-if="coinMain === 'LYNK'" icon="icon-next" size="32" class="d-iflex" />
        <base-icon v-else icon="icon-next-clm" size="32" class="d-iflex" />
      </div>
    </div>
    <div v-if="listNft.length" class="wrap-carousel">
      <swiper class="carousel-swiper" :options="swiperOption" ref="swiperRef">
        <swiper-slide class="carousel-item" v-for="(item, index) in listNft" :key="index">
          <div v-for="(nft, index) in item.children" :key="index" class="item">
            <nft-item :itemNft="nft" @favourite="handleClickFavourite" @bid-hot="handleBid" />
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <empty-block v-else :show="true" class="empty" />
    <!-- <PopupBidSuccess /> -->
  </div>
</template>

<script lang="ts">
  import forEach from 'lodash/forEach'
  import { Component, Vue, Mixins } from 'vue-property-decorator'
  import { SwiperOptions } from 'swiper'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'

  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  // import style
  import 'swiper/swiper-bundle.min.css'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'

  const apiNft: NftRepository = getRepository('nft')

  import NftItem from '../base/NftItem.vue'
  // import PopupBidSuccess from '@/modules/Nft/components/nft-detail/PopupBidSuccess.vue'
  import PopupMixin from '@/mixins/popup'
  import EventBus from '@/utils/eventBus'

  @Component({
    components: {
      Swiper,
      SwiperSlide,
      NftItem,
      EmptyBlock
      // PopupBidSuccess
    }
  })
  export default class HotNft extends Mixins(PopupMixin) {
    @beBase.State('coinMain') coinMain!: string

    swiperOption: SwiperOptions = {
      slidesPerView: 1,
      loop: false,
      autoHeight: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    }
    heightCarousel = '0px'

    listNft: Array<Record<string, any>> = []
    itemNft = {}
    title = ''
    titlePrice = ''
    isShowBtn = false

    async created(): Promise<void> {
      // update l???i info nft khi mua
      EventBus.$on('reload-nft-home', async () => {
        const result = await apiNft.getHotNft({ page: 1, limit: 1000 })
        forEach(result.content, (value, index) => {
          if (result.content.length) {
            const children = result.content.splice(0, 12)
            this.listNft[index].children = children
          }
        })
      })
      this.getListData()
      // EventBus.$on('reload-remove', async () => {
      //   const result = await apiNft.getHotNft({ page: 1, limit: 1000 })
      //   forEach(result.content, (value, index) => {
      //     if (result.content.length) {
      //       const children = result.content.splice(0, 12)
      //       this.listNft[index].children = children
      //     }
      //   })
      // })
      // EventBus.$on('reload-remove', this.getListData)
    }
    handleBid(itemNft): void {
      this.itemNft = itemNft
      console.log('hot', itemNft)
      this.setOpenPopup({
        popupName: 'popup-place-bid',
        isOpen: true
      })
      // this.setOpenPopup({
      //   popupName: 'popup-bid-success',
      //   isOpen: true
      // })
    }
    // Bidinfo: Record<string, any> = {}
    // handleBidNft(infoBid): void {
    //   console.log("hi",infoBid)
    //   this.Bidinfo = infoBid
    // }
    destroyed(): void {
      EventBus.$off('reload-nft-home')
      // EventBus.$off('reload-remove', this.getListData)
    }

    async getListData(): Promise<void> {
      try {
        const result = await apiNft.getHotNft({ page: 1, limit: 1000 })
        forEach(result.content, () => {
          if (result.content.length) {
            const children = result.content.splice(0, 12)
            this.listNft.push({ children })
          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    handleClickArrow(type: string): void {
      if (type === 'next') {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slideNext()
      } else {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slidePrev()
      }
    }

    // handleShare(): void {
    //   return
    // }
    async handleClickFavourite(data: Record<string, any>): Promise<void> {
      try {
        await apiNft.favouriteItem(data)
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.hot-nft {
    margin-top: 80px;
    .title {
      position: relative;
      .btn-crousel {
        top: 28px;
        transform: translateY(-50%);
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
        margin-top: 0;
        &::after {
          display: none;
        }
      }
      .swiper-button-disabled {
        // display: none;
        opacity: 1;
        cursor: pointer;
        pointer-events: unset;
      }
      .prev {
        left: unset;
        right: 56px;
      }
      .next {
        right: 0;
      }
    }
    .wrap-carousel {
      overflow: hidden;
      position: relative;
      padding-top: 5px;
      .carousel-swiper {
        .swiper-wrapper {
          padding-bottom: 10px;
          .carousel-item {
            display: flex;
            flex-wrap: wrap;
            .item {
              width: calc(1 / 4 * 100% - (1 - 1 / 4) * 20px);
              margin: 28px 20px 0 0;
              transition: all 0.2s ease;

              &:hover {
                transform: translateY(-5px);
              }
            }
            .item:nth-child(4n) {
              margin-right: 0;
            }
            .item:nth-child(-n + 4) {
              margin-top: 0;
            }
          }
        }
        .swiper-pagination {
          margin-top: 18px;
          position: relative;
          bottom: 0;
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            margin-right: 12px !important;
          }
        }
      }
    }

    .empty {
      text-align: center;
      padding-top: 0 !important;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .span-icon {
        font-size: 150px !important;
      }
      .empty-text {
        color: #8f8f8f;
      }
    }
  }
</style>
