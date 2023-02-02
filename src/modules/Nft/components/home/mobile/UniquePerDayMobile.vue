<template>
  <div class="unique-banner">
    <div class="text-1xl text-semibold be-flex mb-24 mt-16">
      <span> {{ $t('nft.home.unique-per-day') }}</span>
    </div>
    <div v-if="listBanner.length" class="wrap-carousel">
      <!-- <div v-if="listBanner.length > 1" class="swiper-button-prev btn-crousel cursor prev">
        <base-icon icon="icon-prev" size="32" class="d-iflex" />
      </div>
      <div v-if="listBanner.length > 1" class="swiper-button-next btn-crousel cursor next">
        <base-icon icon="icon-next" size="32" class="d-iflex" />
      </div> -->
      <swiper class="carousel-swiper" :options="swiperOption" ref="swiperRef">
        <swiper-slide class="carousel-item cursor" v-for="item in listBanner" :key="item.objectId">
          <!-- <div class="left">
            <div class="nft-header3 text-semibold text-white text-overflow-3 title" @click="handleClick(item)">
              <span>{{ item.objectName }}</span>
            </div>
            <p class="description">
              <description-item class="nft-header5 text-white text-overflow-3" :description="item.objectShortDescription" />
            </p>
          </div> -->
          <div class="right">
            <bc-media :isShow="getIsShow(item.objectAvatarType)" :url="item.objectAvatar" :radius="16" @click="handleClick(item)" />
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <empty-block v-else :show="true" class="empty" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import DescriptionItem from '../DescriptionItem.vue'

  import { SwiperOptions } from 'swiper'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.css'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'

  const apiNft: NftRepository = getRepository('nft')

  @Component({
    components: {
      Swiper,
      SwiperSlide,
      EmptyBlock,
      DescriptionItem
    }
  })
  export default class UniquePerDay extends Vue {
    swiperOption: SwiperOptions = {
      slidesPerView: 1,
      spaceBetween: 0,
      slidesPerGroup: 1,
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

    listBanner: Array<Record<string, any>> = []

    async created(): Promise<void> {
      const result = await apiNft.getUnique({ page: 1, limit: 1000 })
      this.listBanner = result.content
    }

    getIsShow(type: string): boolean {
      return type === 'IMAGE'
    }

    handleClick(item: Record<string, any>): void {
      if (item.objectId) {
        if (item.objectType === 'NFT') {
          this.$router.push({ name: 'DetailNftItem', params: { id: item.objectId + '' } })
        } else {
          this.$router.push({ name: 'DetailCollection', params: { id: item.objectId + '' } })
        }
      } else {
        window.open(item.objectUrl, '_blank')
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.unique-banner {
    .wrap-carousel {
      position: relative;
      .carousel-swiper {
        overflow: hidden;
        .swiper-wrapper {
          .carousel-item {
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            .left {
              width: 454px;
              word-break: break-word;
              margin-top: 85px;
              .description {
                margin-top: 15px;
              }
            }
            .right {
              width: 100%;
              height: 112px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              video {
                height: auto;
                max-height: 100%;
                max-width: 100%;
                -o-object-fit: contain;
                object-fit: contain;
                width: auto;
              }
            }
          }
        }
        .swiper-pagination {
          bottom: 7px;
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            margin-right: 12px !important;
          }
          .swiper-pagination-bullet {
            background: #dbdbdb;
            opacity: 1;
          }
        }
      }
      .btn-crousel {
        top: 50%;
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
        opacity: 1;
        cursor: pointer;
        pointer-events: unset;
      }
      .prev {
        left: -24px;
      }
      .next {
        right: -24px;
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
