<template>
  <div class="landing-road-map" id="roadmap">
    <div class="wrap-road-map">
      <div class="road-map-top container-lang">
        <div class="road-map-left">
          <div class="title1">{{ $t('landing-ido.roadmap-development') }}</div>
          <div class="title2">{{ $t('landing-ido.roadmap-product') }}</div>
          <div class="title3">{{ $t('landing-ido.roadmap-text') }}</div>
        </div>
        <div class="road-map-right">
          <img src="../../../assets/images/landing/arrow-left.png" class="arrow-left" @click="handleSCroll(1)" alt="" />
          <img src="../../../assets/images/landing/arrow-right.png" class="arrow-right" @click="handleSCroll(-1)" alt="" />
        </div>
      </div>
      <div class="container-road-map">
        <div class="sack-progress">
          <div class="range" data-aos="fade-up" data-aos-duration="2000">
            <div class="process"></div>
          </div>
          <div class="road-map-bottom" data-aos="fade-up" data-aos-duration="3000">
            <div class="item1">
              <div class="item1-title">Q1 2023</div>
              <div class="item1-des">Travel NFTs Collection</div>
              <div class="item1-des">DeFi Staking NFTs on App</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q2 2023</div>
              <div class="item1-des">LynKey Super App</div>
              <div class="item1-des">Add BSC Chain to MetaMart</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q3 2023</div>
              <div class="item1-des">NFTs Yacht Collection</div>
              <div class="item1-des">Metaverse Holiday Club</div>
              <div class="item1-des">DeFi Yacht NFTs</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q4 2023</div>
              <div class="item1-des">Listing CEX Tier 1</div>
              <div class="item1-des">DeFi Staking Property NFTs</div>
              <div class="item1-des">Tokenizing Crystal Holidays Harbour Van Don</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q1 2024</div>
              <div class="item1-des">Metaverse Crystal Holidays Harbour Van Don + AI-Enabled</div>
              <div class="item1-des">Property NFTs Collection</div>
              <div class="item1-des">DeFi Staking NFTs</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q2 2024</div>
              <div class="item1-des">Metaverse Crystal Holidays Heritage Ly Son + AI-Enabled</div>
              <div class="item1-des">Property NFTs Collection</div>
              <div class="item1-des">DeFi Staking NFTs</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q3 2024</div>
              <div class="item1-des">Metaverse Crystal Holidays Marina Phu Yen + AI-Enabled</div>
              <div class="item1-des">Property + Golf NFTs Collection</div>
              <div class="item1-des">DeFi Staking NFTs</div>
            </div>
            <div class="item1">
              <div class="item1-title">Q4 2024</div>
              <div class="item1-des">LynKey Web3 Deployment</div>
            </div>
            <div class="item1">
              <div class="item1-title">2025</div>
              <div class="item1-des">LynKey Web3 Operation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentScrollPosition: 0,
        scrollAmount: 2000
      }
    },
    methods: {
      // checkAcitve(){

      // },
      handleSCroll(val) {
        const sackProgress = document.querySelector('.sack-progress')
        const arrowLeft = document.querySelector('.arrow-left')
        const arrowRight = document.querySelector('.arrow-right')
        this.currentScrollPosition += val * this.scrollAmount
        const containerRoad = document.querySelector('.container-road-map')
        let maxScroll = -containerRoad.offsetWidth + sackProgress.offsetWidth
        if (this.currentScrollPosition > 0) {
          this.currentScrollPosition = 0
          arrowLeft.classList.add('swiper-button-disabled')
          arrowRight.classList.remove('swiper-button-disabled')
        } else {
          this.currentScrollPosition = -maxScroll
          arrowRight.classList.add('swiper-button-disabled')
          arrowLeft.classList.remove('swiper-button-disabled')
        }
        sackProgress.style.transform = `translateX(${this.currentScrollPosition}px)`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .landing-road-map {
    color: #fff;
    margin-top: -120px;
    padding-top: 120px;
    scroll-margin-top: 100px;
  }
  .container-road-map {
    max-width: 1488px;
    overflow: hidden;
    padding: 0 24px;
    margin: 0 auto;
    width: 100%;
    // pointer-events: none;
  }
  .wrap-road-map {
    overflow: hidden;
  }
  .road-map-top {
    display: flex;
    justify-content: space-between;
    .road-map-left {
      .title1 {
        font-size: 18px;
        line-height: 27px;
        font-weight: 400;
      }
      .title2 {
        font-size: 36px;
        line-height: 44px;
        margin: 12px 0;
        font-family: archivo-expanded;
      }
      .title3 {
        font-size: 18px;
        line-height: 27px;
        font-weight: 400;
        opacity: 0.8;
      }
    }
    .road-map-right {
      align-self: flex-end;
      img {
        cursor: pointer;
      }
      .arrow-left {
        margin-right: 20px;
      }
    }
  }
  .road-map-bottom {
    display: flex;
    width: 1800px;
    @media (max-width: 767px) {
      width: 1500px;
    }
  }
  .item1 {
    flex: 1;
    padding-right: 16px;
    &-title {
      font-size: 24px;
      line-height: 32px;
      font-family: archivo-expanded;
    }
    &-des {
      font-size: 18px;
      line-height: 27px;
      font-weight: 400;
      opacity: 0.8;
      margin-top: 16px;
    }
  }
  .sack-progress {
    width: 1800px;
    transition: 0.5s;
    @media (max-width: 767px) {
      width: 1500px;
    }
  }
  .range {
    width: 1800px;
    height: 6px;
    background: linear-gradient(90deg, #c4c4c4 0%, rgba(196, 196, 196, 0) 100%);
    margin: 87px 0;
    @media (max-width: 767px) {
      width: 1500px;
    }

    .process {
      background: linear-gradient(243.43deg, #9c27b0 0%, #0ba5ec 83.33%);
      width: 2%;
      height: 6px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: -10px;
        right: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0px 0 24px 12px #b300d0;
      }
    }
  }
  @media (max-width: 767px) {
    .wrap-road-map {
      margin-top: 40px;
    }
    .container-road-map {
      overflow-x: scroll;
      overflow-y: hidden;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    // .range {
    //   .process {
    //     width: 14%;
    //   }
    // }
    .item1 {
      flex: 1;
      &-title {
        font-size: 18px;
        line-height: 27px;
      }
      &-des {
        font-size: 12px;
        line-height: 18px;
        font-weight: 400;
        color: #e4e7ec;
        opacity: 0.8;
        margin-top: 8px;
        padding-right: 24px;
      }
    }
    .road-map-top {
      .road-map-left {
        .title1 {
          font-size: 14px;
          line-height: 21px;
        }
        .title2 {
          font-size: 24px;
          line-height: 32px;
          margin: 4px 0 12px 0;
        }
        .title3 {
          font-size: 14px;
          line-height: 21px;
        }
      }
      .road-map-right {
        display: none;
      }
    }
    .range {
      margin: 51px 0;
    }
  }
</style>
