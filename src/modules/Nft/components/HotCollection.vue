<template>
  <div id="hot-collection">
    <div class="container-nft">
      <div class="mt-60 mb-40 nft-header3 text-semibold">
        <div class="title-icon">
          <p style="margin-right: 8px">{{ $t('nft.home.hot-collect') }}</p>
          <img style="margin-top: -14px" src="../../../assets/images/nft/fire.png" class="one-collection-fire" alt="" />
        </div>
      </div>
      <swiper class="wrap-top-collection" :options="swiperOption" ref="swiperRef">
        <!-- one collection -->
        <swiper-slide class="one-collection" v-for="item in hotCollectionList" :key="item.id">
          <img v-if="item.featured" :src="item.featured" class="one-collection-banner" style="object-fit: cover; cursor: pointer" alt="" @click="hanldeViewCollection(item.id)" />
          <bc-media v-else style="object-fit: cover" class="one-collection-banner" @click="hanldeViewCollection(item.id)" :url="item.featured" :size="32" />
          <div class="sack-avatar">
            <div v-if="item.isNew == 'YES'" class="sack-avatar-active"></div>
            <!-- <img :src="item.avatar" class="sack-avatar-img" alt="" style="cursor: pointer" @click="hanldeViewCollection(item.id)" /> -->
            <bc-media :url="item.avatar" class="sack-avatar-img" :size="18" :radius="80" @click="hanldeViewCollection(item.id)" />
            <base-icon v-if="item.isVerified == 'YES'" icon="icon-verified" size="20" class="d-iflex sack-avatar-tick" />
          </div>
          <div class="one-collection-content" style="cursor: pointer" @click="hanldeViewCollection(item.id)">
            <div style="color: #0a0b0d" class="one-collection-heading text-overflow-1">{{ item.collectionName }}</div>
            <div class="one-collection-by">
              <span class="one-collection-by-title">{{ $t('nft.home.by') }}</span>
              <span class="one-collection-by-name">{{ item.creatorName }}</span>
              <base-icon v-if="item.creatorIsVerified == 'YES'" icon="icon-verified" size="14" class="d-iflex" style="padding-left: 4px" />
            </div>
            <!-- <div class="one-collection-des text-overflow-3">{{item.shortDescription}}</div> -->
            <div class="one-collection-des text-overflow-3"><p v-html="item.textDescription"></p></div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <div v-if="hotCollectionList.length > 4" class="btn-crousel cursor prev" @click="handleClickArrow('prev')">
        <base-icon icon="icon-prev" size="32" class="d-iflex" />
      </div>
      <div v-if="hotCollectionList.length > 4" class="btn-crousel cursor next" @click="handleClickArrow('next')">
        <base-icon icon="icon-next" size="32" class="d-iflex" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { SwiperOptions } from 'swiper'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')

  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.css'

  // import 'swiper/css/pagination'
  @Component({ components: { Swiper, SwiperSlide } })
  export default class HotCollection extends Vue {
    language = ''
    swiperOption: SwiperOptions = {
      slidesPerView: 4,
      spaceBetween: 24,
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
    hotCollectionList: Array<Record<string, any>> = []
    mounted(): void {
      if (localStorage.getItem('bc-lang')) {
        this.language = localStorage.getItem('bc-lang')?.toString() as string
      }
    }
    hanldeViewCollection(idCollect: string | number): void {
      console.log('id', idCollect)
      const id1 = idCollect.toString()
      this.$router.push({ name: 'DetailCollection', params: { id: id1 } })
    }
    async created(): Promise<void> {
      const params = {
        collectionType: 'HOT',
        page: 1,
        limit: ''
      }
      try {
        this.hotCollectionList = await apiNft.getListCollection(params)
        const language = window.localStorage.getItem('bc-lang')!
        for (let i = 0; i < this.hotCollectionList.length; i++) {
          const objDesc = JSON.parse(this.hotCollectionList[i].shortDescription)
          const textDescription = objDesc[language].replace(/\\n/g, '<br>')
          this.hotCollectionList[i] = {
            ...this.hotCollectionList[i],
            textDescription: textDescription
          }
        }
        // console.log('result', result)
      } catch (error) {
        console.log(error)
      }
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
  }
</script>
<style scoped lang="scss">
  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #hot-collection {
    margin-bottom: 80px;
    position: relative;

    .wrap-top-collection {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      overflow: hidden;
      padding-bottom: 40px;
    }
    .one-collection {
      width: 285px;
      height: 395px;
      position: relative;
      border: 1px solid #dbdbdb;
      // box-shadow: 0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13);
      border-radius: 8px;
      background: #ffffff;
      overflow: hidden;
      &-banner {
        width: 285px;
        height: 190px;
        display: block;
        object-fit: cover;
      }
      .sack-avatar-tick {
        position: absolute;
        right: 0px !important;
        bottom: 0px !important;
      }
      .one-collection.swiper-slide:hover {
        // transform: translateY(-2px);
        // box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
        // transition: linear 0.1s;
      }
      .one-collection-des {
        margin-top: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
        margin-left: 16px !important;
        margin-right: 16px !important;
        align-items: left;
      }
      .sack-avatar-active {
        position: absolute;
        top: 5px !important;
        right: 7px !important;
        background: #129961;
        width: 10px;
        height: 10px;
        z-index: 10;
        border-radius: 50%;
        border: 1px solid #fff;
        box-shadow: 0px 0.6px 1.8px rgb(0 0 0 / 10%), 0px 3.2px 7.2px rgb(0 0 0 / 13%);
      }
      .sack-avatar-img {
        position: relative;
        width: 64px;
        height: 64px;
        object-fit: contain;
        border-radius: 40px !important;
        border: 3px solid #fff !important;
      }
      .sack-avatar-img {
        position: relative;
        width: 64px;
        height: 64px;
        border-radius: 40px;
      }
      .sack-avatar {
        position: absolute;
        top: 160px;
        left: calc(50% - 32px);
        &-img {
          position: relative;
        }
        &-tick {
          position: absolute;
          right: 7px;
          bottom: 17px;
        }
        &-active {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #129961;
          width: 10px;
          height: 10px;
          z-index: 10;
          border-radius: 50%;
          border: 1px solid #fff;
          box-shadow: 0px 0.6px 1.8px rgb(0 0 0 / 10%), 0px 3.2px 7.2px rgb(0 0 0 / 13%);
        }
      }
      &-content {
        margin-top: 40px;
        text-align: center;
      }
      &-heading {
        font-size: 20px;
        line-height: 24px;
        font-weight: 500;
        color: var(--bc-text-market-primary);
        padding: 0 16px;
      }
      &-by {
        margin-top: 4px;
        &-title {
          font-size: 14px;
          line-height: 24px;
          font-weight: 400;
          color: #5b616e;
          margin-right: 5px;
        }
        &-name {
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
          color: #5087fd;
        }
      }
      &-des {
        margin-top: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
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
      left: -24px;
    }
    .next {
      right: -24px;
    }
  }
  ::v-deep.swiper-pagination {
    .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      margin-right: 12px !important;
    }
  }
</style>
