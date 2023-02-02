<template>
  <div v-if="arrCollection.length" class="slide-banner">
    <div class="wrap">
      <div class="carousel-swiper">
        <div class="carousel-item-first cursor">
          <swiper class="carousel-swiper" :options="swiperOption" ref="swiperRef">
            <swiper-slide v-for="index in arrCollection" :key="index.id">
              <bc-media :isShow="getIsShow(index.objectAvatarType)" :url="index.objectAvatar" @click="handleClickSlide(index.objectId, index.objectType)" :radius="16" />
              <div class="content text-white" @click="handleClickSlide(index.objectId, index.objectType)">
                <div v-if="isShowTextLeft" class="be-flex align-center title">
                  <div class="nft-header4 text-overflow-1 title-first">{{ index.objectName }}</div>
                  <base-icon v-if="index.objectVerified === 'YES'" icon="icon-verified" size="24" class="d-iflex" style="padding-left: 8px" />
                </div>
                <div v-if="isShowTextLeft" class="des nft-body-small text-overflow-2">
                  {{ getDescription(index.objectShortDescription) }}
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>

          <div class="overplay"></div>
          <div class="paging">
            <div v-for="(item, index) in arrCollection" :key="index" class="paging-item" @click="handleClickPaging(index)">
              <div class="item">
                <div v-if="index === pagingIndex" class="progress" :style="{ width: width + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="carousel-item-two cursor" style="margin-right: 0px"></div> -->
        <div class="wrap-banner-silde-two">
          <div class="carousel-item cursor" v-for="item in data" :key="item.id">
            <div v-for="(value, index) in item.children" :key="index" class="wrap" @click="handleClickSlide(value.objectId, value.objectType)">
              <div class="media">
                <bc-media :isShow="getIsShow(value.objectAvatarType)" :url="value.objectAvatar" :radius="16" />
              </div>
              <div class="content text-white">
                <div v-if="isShowTextRight" class="be-flex align-center title">
                  <div class="text-regular text-xs text-overflow-1">
                    {{ value.objectName }}
                  </div>
                  <base-icon v-if="value.objectVerified === 'YES'" icon="icon-verified" size="14" class="d-iflex" style="padding-left: 4px" />
                </div>
                <!-- <div v-if="isShowTextRight" class="des nft-body-small text-overflow-1">{{ getDescription(value.objectShortDescription) }}</div> -->
              </div>
              <div class="overplay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Swiper as SwiperClass, Navigation, Autoplay, Pagination, EffectFade } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Navigation, Autoplay, Pagination, EffectFade])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.min.css'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import { filter, forEach } from 'lodash'
  const apiNft: NftRepository = getRepository('nft')
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  @Component({
    components: {
      Swiper,
      SwiperSlide
    }
  })
  export default class SlideBanner extends Vue {
    @beBase.State('coinMain') coinMain!: string

    data: Array<Record<string, any>> = []
    firstSlide: Record<string, any> = {}

    arrCollection: string[] = []

    urlVideo = 'https://img.rarible.com/feat/video/webm/x2/9b03fb01aa89e6a27230fb53106de786/82eb72ea/Sphere_all.mp4'
    pagingIndex = 0
    width = 0
    timing: any = null

    index = 0

    numOfBanner = 5
    isShowTextLeft = true
    isShowTextRight = true

    swiperOption = {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 10,
      autoplay: {
        delay: 3000
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }

    async created(): Promise<void> {
      const systemParams = await apiNft.getSystemparam({ type: 'REMARKABLE' })
      const banner = filter(systemParams, elm => elm.key === 'num.of.banner.remarkable')
      if (banner.length) {
        this.numOfBanner = banner[0].value
      }
      this.isShowTextLeft = filter(systemParams, elm => elm.key === 'display.text.banner.remarkable')[0].value === 'ON'
      this.isShowTextRight = filter(systemParams, elm => elm.key === 'display.text.remarkable')[0].value === 'ON'

      const rs = await apiNft.getListSlideBanner({ page: 1, limit: 1000 })
      this.arrCollection = rs.content.splice(0, this.numOfBanner)
      console.log('banner', this.arrCollection)
      forEach(rs.content, () => {
        if (rs.content.length) {
          const children = rs.content.splice(0, 2)
          this.data.push({
            children
          })
        }
      })
    }

    destroyed(): void {
      clearInterval(this.timing)
    }

    getDescription(description: string): string {
      const language = window.localStorage.getItem('bc-lang')!
      if (description) {
        const objDesc = JSON.parse(description)
        return objDesc[language]
      }
      return ''
    }

    getIsShow(type: string): boolean {
      return type === 'IMAGE'
    }
    handleClickPaging(index: number): void {
      clearInterval(this.timing)
      if (index !== this.pagingIndex) {
        this.pagingIndex = index
        // this.urlVideo = this.arrCollection[index]
        // this.handlePlayProgress()
        this.$forceUpdate()
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

    handleClickSlide(id: number, type: string): void {
      if (type === 'NFT') {
        this.$router.push({ name: 'DetailNftItem', params: { id: id + '' } })
      } else {
        this.$router.push({ name: 'DetailCollection', params: { id: id + '' } })
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.slide-banner {
    // height: 100%;
    margin-top: 16px;
    position: relative;
    margin-bottom: 40px;
    .wrap {
      overflow: hidden;
      // .carousel
      .carousel-swiper {
        transition: 0.5s linear;
        .carousel-item-first {
          max-width: 335px !important;
          width: 100%;
          height: 330px;
          position: relative;
          left: 50%;
          transform: translateX(-50%);

          video {
            width: 100%;
            border-radius: 16px;
            object-fit: fill;
          }

          img {
            max-width: 335px !important;
            height: 100%;
            border-radius: 16px;
            display: block;
            object-fit: cover;
          }
          .el-image {
            width: 100%;
            height: 100%;
            background: #dbdbdb;
            border-radius: 16px;
            .image-slot {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .content {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            padding: 8px;
            z-index: 2;
            .title {
              .title-first {
                max-width: calc(100% - 32px);
              }
            }
          }
        }
        .carousel-item-two {
          width: 0 !important;
          margin-right: 0px !important;
        }
        .carousel-item {
          display: flex;
          .wrap {
            position: relative;
            margin-right: 16px;

            .media {
              width: 120px;
              height: 120px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 16px;
                display: block;
              }
              video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 16px;
                display: block;
              }
              .el-image {
                width: 100%;
                height: 100%;
                background: #dbdbdb;
                border-radius: 16px;
                .image-slot {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }

            .content {
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              padding: 16px 16px 0 8px;
              z-index: 2;
              .title {
                .title-first {
                  max-width: calc(100% - 18px);
                }
              }
            }
          }
        }
        .wrap-media {
          .empty {
            border-radius: 16px;
          }
        }
        // .overplay {
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 120px;
        //   background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
        //   border-radius: 16px 16px 0px 0px;
        // }
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
      display: none;
      // opacity: 1;
      // cursor: pointer;
      // pointer-events: unset;
    }
    .prev {
      left: -24px;
    }
    .next {
      right: -24px;
    }
    .wrap-banner-silde-two {
      display: flex;
      overflow: auto;
      margin-top: 16px;
      margin-right: -16px;
    }
    .swiper-pagination {
      margin-top: 18px;
      position: absolute;
      bottom: 0;
      top: 264px;
      .swiper-pagination-bullet {
        padding: 1px 10px;
        border-radius: 0;
        width: 40px;
        height: 3px;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        color: #000 !important;
        opacity: 1;
        background: rgba(0, 0, 0, 0.2);
      }
      .swiper-pagination-bullet-active {
        color: #fff !important;
        background: #fff !important;
      }
    }
    @media (min-width: 570px) {
      .wrap-banner-silde-two {
        justify-content: center !important;
        padding: 0 !important;
      }
    }
  }
</style>
