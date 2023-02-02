<template>
  <div class="header-wrapper">
    <div class="header-content">
      <div class="exchange-panel">
        <div class="left">
          <div class="currency-couple">
            <span class="currency-couple__exchange--pc text-trade-primary text-0xl text-medium"> LYNK/USDT </span>
            <span class="currency-couple__exchange--mobile text-trade-primary text-0xl text-medium">
              <span class="base-currency">LYNK <base-icon @click.native="$emit('visible')" :icon="'icon-chevron-down'" size="18"></base-icon></span>
              <span class="quote-currency">/USDT</span>
            </span>
            <p class="currency-couple__currency-name text-trade-desc text-base1 text-regular">LynKey</p>
          </div>
          <div class="exchange-couple">
            <p class="now-price text-base text-regular" :class="`text-trade-${nowPrice.state}`">
              {{ nowPrice.price | formatNumber }}
            </p>
            <p class="sub-price text-trade-primary text-base1 text-regular">${{ nowPrice.subPrice | formatNumber }}</p>
          </div>
          <p class="daily-value-left text-trade-desc">
            <span class="text-xs" :class="`text-trade-${dailyChangeData.state}`">{{ dailyChangeData.value }}</span>
            <span class="ml-12 text-xs" :class="`text-trade-${dailyChangeData.state}`">
              {{ dailyChangeData.state === 'up' ? '+' : dailyChangeData.state === 'down' ? '-' : '' }}{{ dailyChangeData.percent }} %
            </span>
          </p>
        </div>
        <div class="right">
          <div class="ticker-container">
            <div class="daily-change daily-change--24h">
              <p class="daily-title text-trade-desc text-xs text-regular">{{ dailyChangeData.title }}</p>
              <p class="daily-value text-trade-desc">
                <span class="text-sm" :class="`text-trade-${dailyChangeData.state}`"
                  >{{ dailyChangeData.state === 'up' ? '+' : dailyChangeData.state === 'down' ? '-' : '' }}{{ dailyChangeData.value }}</span
                >
                (<span class="" :class="`text-trade-${dailyChangeData.state}`">{{ dailyChangeData.percent }} %</span>)
              </p>
            </div>
            <div class="daily-change" v-for="(item, index) in tickerListData" :key="item.id" :class="`grid-index-${index + 1}`">
              <p class="daily-title daily-title--pc text-trade-desc text-xs text-regular">{{ item.title }}</p>
              <p class="daily-title daily-title--mobile text-trade-desc text-xs text-regular">{{ item.titleMobile }}</p>
              <p class="daily-value text-trade-primary text-base1">{{ item.value | formatNumber }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="header-guide"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import EventBus from '@/utils/eventBus'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({ components: {} })
  export default class ExchangeHeader extends Vue {
    timer: any = null

    dailyChangeData: Record<string, any> = {
      id: '24hChange',
      title: '24h Change',
      state: 'up',
      value: '439.07',
      percent: '2.11'
    }

    nowPrice: Record<string, any> = {
      price: '20,954.22',
      subPrice: '20,954.22',
      state: 'up', // up-down-default
      currency: 'LYNK',
      exchangeCurrency: 'USDT'
    }

    tickerListData: Array<Record<string, any>> = [
      {
        id: 1,
        title: '24h High',
        titleMobile: '24h High',
        value: '21,003.25'
      },
      {
        id: 2,
        title: '24h Low',
        titleMobile: '24h Low',
        value: '19,844.25'
      },
      {
        id: 3,
        title: '24h Volume (LYNK)',
        titleMobile: '24h Vol (LYNK)',
        value: '109,844.25'
      },
      {
        id: 4,
        title: '24h Volume (USDT)',
        titleMobile: '24h Vol (USDT)',
        value: '1,109,844.25'
      }
    ]

    created(): void {
      console.log('ex header')
      EventBus.$on('matchedValue', matchedValue => {
        // get now price
        this.nowPrice.price = matchedValue.currentPrice
        this.nowPrice.subPrice = matchedValue.currentPrice
        this.nowPrice.state = matchedValue.state
        this.tickerListData[3].value = (parseFloat(this.tickerListData[3].value) + parseFloat(matchedValue.currentPrice)).toFixed(2)

        // get dailyChange
        this.dailyChangeData.value = (Math.random() * 1000).toFixed(2)
        this.dailyChangeData.percent = (((Math.random() * 1000) / 21003.25) * 100).toFixed(2)
        this.dailyChangeData.state = Math.random() < 0.5 ? 'up' : 'down'
      })
    }
    destroy(): void {
      clearInterval(this.timer)
      EventBus.$off('matchedValue')
    }
  }
</script>

<style scoped lang="scss">
  @media screen and (min-width: 768px) {
    .header-wrapper {
      position: relative;
      padding: 16px 0;
      height: 100%;
      width: 100%;
      .header-content {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .exchange-panel {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          .left {
            position: relative;
            display: flex;
            height: 100%;
            .currency-couple {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              width: 138px;
              border-right: 1px solid var(--color-border-primary);
              // opacity: 0.8;
              .currency-couple__exchange--mobile {
                display: none;
              }
            }
            .exchange-couple {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              font-family: 'Open Sans';
              margin-left: 16px;
            }
            .daily-value-left {
              display: none;
            }
          }
          .right {
            display: flex;
            align-items: center;
            .ticker-container {
              display: flex;
              margin: 0 44px;

              .daily-change {
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-width: 120px;
                margin-left: 14px;
                &:first-child {
                  margin-left: 0;
                }
                .daily-title {
                  margin-top: 4px;
                }
                .daily-title--mobile {
                  display: none;
                }
                .daily-value {
                  margin-top: 3px;
                }
              }
            }
          }
        }
        .header-guide {
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .header-wrapper {
      position: relative;
      padding: 0 0;
      height: 100%;
      width: 100%;
      .header-content {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .exchange-panel {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          .left {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            .currency-couple {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              width: 110px;
              .currency-couple__exchange--pc {
                display: none;
              }
              .currency-couple__exchange--mobile {
                display: flex;
                flex-direction: column;
                .base-currency {
                }
                .quote-currency {
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 20px;
                  margin: 4px 0;
                }
              }
              .currency-couple__currency-name {
                font-size: 12px;
                line-height: 16px;
              }
            }
            .exchange-couple {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              font-family: 'Open Sans';
              margin-left: 0px;
              .now-price {
                font-size: 24px;
                font-weight: 600;
                line-height: 32px;
              }
              .sub-price {
                display: none;
              }
            }
            .daily-value-left {
              display: block !important;
              .ml-12 {
                margin-left: 12px;
              }
            }
          }
          .right {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 15px 0 15px 45px;
            .ticker-container {
              display: grid;
              grid-template:
                'a a'
                'b b';

              .grid-index-2 {
                grid-row: 2;
                grid-column: 1;
              }
              .daily-change {
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-width: 96px;
                &:first-child {
                  margin-left: 0;
                }
                .daily-title {
                  margin-top: 4px;
                }
                .daily-title--pc {
                  display: none;
                }
                .daily-value {
                  margin-top: 3px;
                }
              }
              .daily-change--24h {
                display: none;
              }
            }
          }
        }
        .header-guide {
        }
      }
    }
  }
</style>
