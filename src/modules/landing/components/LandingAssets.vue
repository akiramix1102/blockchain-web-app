<template>
  <div class="assets">
    <div class="container-lang">
      <div class="content">
        <div class="btn-swi swiper-button-prev2"></div>
        <div>
          <h1>{{ $t('landing-ido.assets_pri-title') }}</h1>
          <p class="title">{{ $t('landing-ido.assets_title') }}</p>
        </div>
        <div class="btn-swi swiper-button-next2"></div>
      </div>
      <swiper class="slide" :options="swiperOption">
        <swiper-slide class="project" data-aos="fade-left" data-aos-duration="1000">
          <div class="sack-img-dialog po-relative" @click="dialogTableVisibleVanDon = true">
            <img src="https://lynkey.com/media/Van_Don_main_1.jpg" class="img-assets" alt="" />
            <div class="sack-icon-overlay">
              <div class="overlay"></div>
              <div class="icon-play">
                <img src="../../../assets/image/icon-play.png" class="icon-play-2" />
              </div>
            </div>
          </div>
          <div class="des-prj">
            <div class="price">
              <p class="text-price">{{ $t('landing-ido.assets_text-price1') }}</p>
            </div>
            <a class="name" style="text-decoration: none" href="http://www.crystalholidaysharbourvandon.com/" target="_blank">
              <p class="text-name" style="color: #fff">{{ $t('landing-ido.assets_text-name1') }}</p>
            </a>
          </div>

          <div></div>
        </swiper-slide>
        <swiper-slide class="project" data-aos="fade-left" data-aos-duration="1500" data-aos-delay="500">
          <div class="sack-img-dialog po-relative" @click="dialogTableVisiblePhuYen = true">
            <img src="https://lynkey.com/media/Phu_Yen_Santorini_main_1.jpeg" class="img-assets" alt="" />
            <div class="sack-icon-overlay">
              <div class="overlay"></div>
              <div class="icon-play">
                <img src="../../../assets/image/icon-play.png" class="icon-play-2" />
              </div>
            </div>
          </div>
          <div class="des-prj">
            <div class="price">
              <p class="text-price">{{ $t('landing-ido.assets_text-price2') }}</p>
            </div>
            <div class="name">
              <p class="text-name">{{ $t('landing-ido.assets_text-name2') }}</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="project" data-aos="fade-left" style="cursor: default" data-aos-duration="2000" data-aos-delay="1000">
          <img src="https://lynkey.com/media/Ly_Son_main_1.jpeg" class="img-assets" alt="" />
          <!-- <div class="sack-img-dialog po-relative" @click="dialogTableVisibleVanDon = true">
            <div class="sack-icon-overlay">
              <div class="overlay"></div>
              <div class="icon-play">
                <img
                  v-bind:style="{
                    width: ratio * 100 + 'px',
                    height: ratio * 100 + 'px'
                  }"
                  src="../../../assets/image/icon-play.png"
                  class="icon-play-2"
                />
              </div>
            </div>
          </div> -->
          <div class="des-prj">
            <div class="price">
              <p class="text-price">{{ $t('landing-ido.assets_text-price3') }}</p>
            </div>
            <div class="name">
              <p class="text-name">{{ $t('landing-ido.assets_text-name3') }}</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="project" data-aos="fade-left" style="cursor: default" data-aos-duration="2500" data-aos-delay="1500">
          <img src="https://lynkey.com/media/Van_Don_Smart_City_main.jpg" class="img-assets" alt="" />
          <!-- <div class="sack-img-dialog po-relative" @click="dialogTableVisibleVanDon = true">
            <div class="sack-icon-overlay">
              <div class="overlay"></div>
              <div class="icon-play">
                <img
                  v-bind:style="{
                    width: ratio * 100 + 'px',
                    height: ratio * 100 + 'px'
                  }"
                  src="../../../assets/image/icon-play.png"
                  class="icon-play-2"
                />
              </div>
            </div>
          </div> -->

          <div class="des-prj">
            <div class="price">
              <p class="text-price">{{ $t('landing-ido.assets_text-price4') }}</p>
            </div>
            <div class="name">
              <p class="text-name">{{ $t('landing-ido.assets_text-name4') }}</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="project" data-aos="fade-left" style="cursor: default" data-aos-duration="3000">
          <img src="https://lynkey.com/media/Xuan_Dai_Bay.jpg" class="img-assets" alt="" />
          <!-- <div class="sack-img-dialog po-relative" >
            <div class="sack-icon-overlay">
              <div class="overlay"></div>
              <div class="icon-play">
                <img
                  v-bind:style="{
                    width: ratio * 100 + 'px',
                    height: ratio * 100 + 'px'
                  }"
                  src="../../../assets/image/icon-play.png"
                  class="icon-play-2"
                />
              </div>
            </div>
          </div> -->
          <div class="des-prj">
            <div class="price">
              <p class="text-price">{{ $t('landing-ido.assets_text-price5') }}</p>
            </div>
            <div class="name">
              <p class="text-name">{{ $t('landing-ido.assets_text-name5') }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <el-dialog title="" :visible.sync="dialogTableVisible">
      <iframe
        v-if="dialogTableVisible === true"
        v-bind:height="ratio * 720 + 'px'"
        width="100%"
        src="https://www.youtube.com/embed/3Vvu-L8Gc_A?autoplay=1"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogTableVisibleVanDon">
      <!-- <video src="https://www.youtube.com/embed/sGpAUxeqK74"></video> -->
      <video playsinline autoplay controls loop muted id="myVideo" v-if="dialogTableVisibleVanDon === true" class="myVideo">
        <source src="https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2022/3/18/8479_1504741394_1647579670999.mp4" type="video/mp4" />
      </video>
      <!-- <iframe
        v-if="dialogTableVisibleVanDon === true"
        v-bind:height="ratio * 720 + 'px'"
        width="100%"
        src="https://www.youtube.com/embed/sGpAUxeqK74?autoplay=1"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe> -->
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogTableVisiblePhuYen">
      <video playsinline autoplay controls loop muted id="myVideo" v-if="dialogTableVisiblePhuYen === true" class="myVideo">
        <source src="https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2022/3/18/8479_1196165490_1647579390895.mp4" type="video/mp4" />
      </video>
      <!-- <iframe
        v-if="dialogTableVisiblePhuYen === true"
        v-bind:height="ratio * 720 + 'px'"
        src="https://www.youtube.com/embed/3Vvu-L8Gc_A?autoplay=1"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe> -->
    </el-dialog>
  </div>
</template>

<script>
  import 'swiper/swiper-bundle.css'
  import Vue from 'vue'
  import { Swiper as SwiperClass, Navigation } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Navigation])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)

  export default {
    name: 'swiper-example-loop-group',
    title: 'Loop mode with multiple slides per group',
    components: {
      Swiper,
      SwiperSlide
    },
    data() {
      return {
        dialogTableVisible: false,
        dialogTableVisibleVanDon: false,
        dialogTableVisiblePhuYen: false,
        ratio: window.innerWidth / 1920,
        swiperOption: {
          // slidesPerView: 4,
          // spaceBetween: 15,
          grabCursor: true,
          breakpoints: {
            350: {
              slidesPerView: 1.5,
              spaceBetween: 16,
              grabCursor: true
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 16,
              grabCursor: true
            },
            786: {
              slidesPerView: 2.5,
              spaceBetween: 20,
              // centeredSlides: true,
              grabCursor: true
            },
            1000: {
              slidesPerView: 3,
              spaceBetween: 24
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 24
            },
            1400: {
              slidesPerView: 4,
              spaceBetween: 24
            },
            1770: {
              slidesPerView: 4,
              spaceBetween: 24
            }
          },
          navigation: {
            nextEl: '.swiper-button-next2',
            prevEl: '.swiper-button-prev2'
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .po-relative {
    position: relative;
  }
  .assets {
    position: relative;
    padding: 90px 0 0 0;
    color: white;
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 60px 0;
      text-align: center;
      .swiper-button-prev2 {
        position: relative;
        top: 0;
        left: 0;
        width: 72px;
        height: 72px;
        margin-top: 0;
        content: url(../../../assets/images/landing/swiper-prev.png);
        cursor: pointer;
      }
      .swiper-button-next2 {
        content: url(../../../assets/images/landing/swiper-next.png);
        position: relative;
        top: 0;
        left: 0;
        width: 72px;
        height: 72px;
        margin-top: 0;
        cursor: pointer;
      }
      .btn-carousel {
        font-size: 20px;
        border: 1px solid;
        border-radius: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 50px;
        cursor: pointer;
        opacity: 0.8;
        :active {
          color: violet;
        }
      }
      h1 {
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
        font-weight: 400;
      }
      .title {
        margin-top: 12px;
        font-size: 36px;
        line-height: 44px;
        // font-weight: 600;
        font-family: archivo-expanded;
      }
    }
    video#myVideo {
      height: 71vh;
      width: 100%;
      object-fit: cover;
      @media (max-width: 450px) {
        height: 51vh;
      }
    }
  }
  .project:hover {
    .sack-icon-overlay {
      opacity: 1;
      visibility: visible;
    }
  }
  .sack-icon-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    visibility: hidden;
    transition: 0.5s;
    @media (max-width: 769px) {
      opacity: 1;
      visibility: visible;
    }
  }
  .overlay {
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .img-assets {
    height: 240px;
    @media (max-width: 768px) {
      height: 160px;
    }
  }
  .icon-play {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    cursor: pointer;
    position: absolute;
    z-index: 10;

    img {
      width: 100px;
      height: 100px;
    }
  }
  .icon-play-2 {
    width: 60px !important;
    height: 60px !important;
  }
  .slide {
    display: flex;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    overflow: hidden;
    .project {
      // width: 350px !important;
      overflow: hidden;
      img {
        object-fit: cover;
        max-width: 100%;
      }
      .des-prj {
        .price {
          .text-price {
            color: rgba(255, 255, 255, 0.8);
            font-size: 18px;
            line-height: 27px;
            margin: 24px 0 8px 0;
          }
        }
        .name {
          .text-name {
            font-size: 20px;
            line-height: 30px;
            font-weight: 700;
            max-width: 278px;
            font-family: archivo-expanded;
          }
        }
      }
    }
  }
  @media (max-width: 786px) {
  }
  @media (max-width: 767px) {
    .container-lang {
      padding-right: 0;
    }
    .assets {
      padding-top: 60px !important;
      .content {
        text-align: start;
        margin-bottom: 36px;
        justify-content: space-between !important;
        h1 {
          font-size: 14px;
          line-height: 21px;
        }
        .title {
          font-weight: 700;
          font-size: 24px;
          line-height: 32px;
          margin-top: 4px !important;
        }
        .btn-carousel {
          display: none !important;
        }
      }
    }
    .slide {
      .text-price {
        font-size: 12px !important;
        line-height: 18px !important;
        margin: 16px 0 0px 0 !important;
      }
      .text-name {
        font-size: 18px !important;
        line-height: 27px !important;
      }
    }
  }
  @media (max-width: 1000px) {
    .btn-swi {
      display: none !important;
    }
    .assets .content {
      justify-content: center;
    }
  }
</style>
