<template>
  <div v-if="arrCollection.length" class="slide-banner">
    <div class="wrap">
      <div class="carousel-swiper">
        <div class="carousel-item-first cursor">
          <!-- <video ref="video" muted playinside autoplay loop :src="urlVideo" alt="" /> -->
          <!-- <img v-if="firstSlide.remarkableUrl" :src="firstSlide.remarkableUrl" alt="" @click="handleClickSlide(firstSlide.id)" /> -->
          <bc-media
            :isShow="getIsShow(arrCollection[pagingIndex] && arrCollection[pagingIndex].objectAvatarType)"
            :url="arrCollection[pagingIndex] && arrCollection[pagingIndex].objectAvatar"
            @click="handleClickSlide(arrCollection[pagingIndex].objectId, arrCollection[pagingIndex].objectType)"
            :radius="16"
          />
          <!--
          <swiper
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :navigation="true"
            :spaceBetween="30"
            :centeredSlides="true"
            :effect="'fade'"
          >
            <swiper-slide v-for="index in arrCollection" :key="index.id">
              <bc-media
                :isShow="getIsShow(index.objectAvatarType)"
                :url="index.objectAvatar"
                @click="handleClickSlide(index.objectId, index.objectType)"
                :radius="16"
              />
            </swiper-slide>
          </swiper>
          -->
          <!-- <div class="w-100 h-100" @click="handleClickSlide(firstSlide.id)">
            <el-image :src="firstSlide.remarkableUrl">
              <div slot="error" class="image-slot">
                <base-icon icon="icon-no-image" size="24" class="d-iflex" />
              </div>
            </el-image>
          </div> -->

          <div class="content text-white" @click="handleClickSlide(arrCollection[pagingIndex].objectId, arrCollection[pagingIndex].objectType)">
            <div v-if="isShowTextLeft" class="be-flex align-center title">
              <div class="nft-header4 text-overflow-1 title-first">{{ arrCollection[pagingIndex] && arrCollection[pagingIndex].objectName }}</div>
              <base-icon
                v-if="arrCollection[pagingIndex] && arrCollection[pagingIndex].objectVerified === 'YES'"
                icon="icon-verified"
                size="24"
                class="d-iflex"
                style="padding-left: 8px"
              />
            </div>
            <div v-if="isShowTextLeft" class="des nft-body-small text-overflow-2">
              {{ getDescription(arrCollection[pagingIndex] && arrCollection[pagingIndex].objectShortDescription) }}
            </div>
          </div>
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
                <!-- <img :src="value.remarkableUrl" alt="" /> -->
                <!-- <el-image :src="value.remarkableUrl">
                <div slot="error" class="image-slot">
                  <base-icon icon="icon-no-image" size="24" class="d-iflex" />
                </div>
              </el-image> -->
                <!-- <video v-else playinside autoplay loop src="https://img.rarible.com/feat/video/webm/x1/cd2cb57df9410afb050c4e1beae14e47/9954408e/Rarible_CoverSeries11.mp4" alt="" /> -->
              </div>
              <div class="content text-white">
                <div v-if="isShowTextRight" class="be-flex align-center title">
                  <div class="text-regular text-xs text-overflow-1 lowercase">
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

    <!-- <div v-if="isShowPrev" class="btn-crousel cursor prev" @click="handleClickArrow('prev')">
      <base-icon icon="icon-prev" size="32" class="d-iflex" />
    </div>
    <div v-if="isShowNext" class="btn-crousel cursor next" @click="handleClickArrow('next')">
      <base-icon icon="icon-next" size="32" class="d-iflex" />
    </div> -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  // import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import { Swiper as SwiperClass, Navigation, Autoplay, Pagination, EffectFade } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Navigation, Autoplay, Pagination, EffectFade])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)

  import 'swiper/swiper-bundle.css'
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

    mounted(): void {
      setTimeout(() => {
        this.handlePlayProgress()
      }, 500)
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

    handlePlayProgress(): void {
      this.width = 0
      this.timing = setInterval(() => {
        if (this.width >= 100) {
          this.width = 0
          if (this.pagingIndex === this.arrCollection.length - 1) {
            this.pagingIndex = 0
          } else {
            this.pagingIndex += 1
          }
          // this.urlVideo = this.arrCollection[this.pagingIndex]
        } else {
          this.width++
        }
      }, 40)
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
          .paging {
            position: absolute;
            bottom: 20px;
            left: 40px;
            width: calc(100% - 80px);
            display: flex;
            justify-content: space-between;
            .paging-item {
              margin-right: 9px;
              flex: 1;
              cursor: pointer;
              padding: 15px 0;
              &:hover {
                .item {
                  transform: scale(1, 2.5);
                }
              }
              .item {
                background: #dbdbdb;
                height: 2px;
                transition: 0.2s linear;
              }
              .progress {
                height: 2px;
                background: #ffffff;
                width: 0;
              }
            }
            .paging-item:last-child {
              margin-right: 0;
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
              padding: 8px 16px 0 8px;
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
        .overplay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
          border-radius: 16px 16px 0px 0px;
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
    @media (min-width: 570px) {
      .wrap-banner-silde-two {
        justify-content: center !important;
        padding: 0 !important;
      }
    }
  }
</style>
