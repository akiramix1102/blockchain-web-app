<template>
  <div class="container">
    <div class="header-filter">
      <div v-for="item in timeFilter" :key="item.value" class="filter-item" :class="item.value == '15M' ? 'exchange-text-active' : ''">
        {{ item.label }}
      </div>
    </div>
    <div class="chart">
      <div class="info">
        <base-icon icon="trade-arrow-down" size="12" class="icon-trade" @click.native="visiblePrice = !visiblePrice" v-show="visiblePrice"></base-icon>
        <base-icon icon="trade-arrow-right" size="12" class="icon-trade" @click.native="visiblePrice = !visiblePrice" v-show="!visiblePrice"></base-icon>
        <div v-if="visiblePrice">
          2022/07/06 Open: <span class="exchange-text-success">20175.84</span> High: <span class="exchange-text-success">20414.01</span> Low:
          <span class="exchange-text-success">19761.25</span> Close: 20212.29 CHANGE: <span class="exchange-text-success">0.18%</span>
        </div>
      </div>
      <div id="tvchart" v-if="showChart"></div>
      <div class="info-volume pt-8" v-if="!deleteVolume">
        <base-icon icon="trade-arrow-down" size="12" class="icon-trade" @click.native="visibleVolume = !visibleVolume" v-show="visibleVolume"></base-icon>
        <base-icon icon="trade-arrow-right" size="12" class="icon-trade" @click.native="visibleVolume = !visibleVolume" v-show="!visibleVolume"></base-icon>
        <span v-if="visibleVolume"> Vol (LYNK): <span class="exchange-text-success">3.649K</span> Vol (USDT): <span class="exchange-text-success">42.649M</span> </span>
        <div class="mt-8">
          <base-icon icon="trade-eye" size="14" class="icon-trade" @click.native="hideVolume" v-show="visibleShow && visibleVolume"></base-icon>
          <base-icon icon="trade-hide-eye" size="14" class="icon-trade" @click.native="showVolume" v-show="!visibleShow && visibleVolume"></base-icon>
          <base-icon icon="trade-delete" size="14" class="icon-trade trade-delete" v-if="!closeVolume && visibleVolume" @click.native="removeVolume"></base-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Component, Vue } from 'vue-property-decorator'
  import { createChart, CrosshairMode } from 'lightweight-charts'
  import SortHeader from '../base/SortHeader'

  @Component({ components: { SortHeader } })
  export default class Chart extends Vue {
    visiblePrice = true
    visibleVolume = true
    visibleShow = true
    showChart = true
    closeVolume = false
    deleteVolume = false

    timeFilter = [
      {
        value: '15M',
        label: '15M'
      },
      {
        value: '30M',
        label: '30M'
      },
      {
        value: '1H',
        label: '1H'
      },
      {
        value: '4H',
        label: '4H'
      },
      {
        value: '1D',
        label: '1D'
      },
      {
        value: '1W',
        label: '1W'
      },
      {
        value: '1M',
        label: '1M'
      }
    ]
    chart = {}
    candleSeries = {}
    volumeSeries = {}

    showVolume() {
      this.visibleShow = true
      this.volumeSeries.applyOptions({
        visible: true
      })
    }

    hideVolume() {
      this.visibleShow = false
      this.volumeSeries.applyOptions({
        visible: false
      })
    }

    removeVolume() {
      this.chart.removeSeries(this.volumeSeries)
      this.deleteVolume = true
      this.chart.applyOptions({
        priceScale: {
          scaleMargins: {
            top: 0.15,
            bottom: 0.15
          }
        }
      })
    }

    nextBar() {
      if (!this.nextBar.date) this.nextBar.date = new Date(2020, 0, 0)
      if (!this.nextBar.bar) this.nextBar.bar = { open: 100, high: 104, low: 98, close: 103 }

      this.nextBar.date.setDate(this.nextBar.date.getDate() + 1)
      this.nextBar.bar.time = {
        year: this.nextBar.date.getFullYear(),
        month: this.nextBar.date.getMonth() + 1,
        day: this.nextBar.date.getDate()
      }

      let old_price = this.nextBar.bar.close
      let volatility = 0.1
      let rnd = Math.random()
      let change_percent = 2 * volatility * rnd

      if (change_percent > volatility) change_percent -= 2 * volatility

      let change_amount = old_price * change_percent
      this.nextBar.bar.open = this.nextBar.bar.close
      this.nextBar.bar.close = old_price + change_amount
      this.nextBar.bar.high = Math.max(this.nextBar.bar.open, this.nextBar.bar.close) + Math.abs(change_amount) * Math.random()
      this.nextBar.bar.low = Math.min(this.nextBar.bar.open, this.nextBar.bar.close) - Math.abs(change_amount) * Math.random()
      this.nextBar.bar.value = Math.random() * 1000
      this.nextBar.bar.color = this.nextBar.bar.close < this.nextBar.bar.open ? 'rgba(207, 32, 47, 0.3)' : 'rgba(18, 153, 97, 0.3)'

      return this.nextBar.bar
    }

    mounted() {
      this.chart = createChart(document.getElementById('tvchart'), {
        width: 335,
        height: 330,
        layout: {
          backgroundColor: 'transparent',
          textColor: '#999999'
        },
        grid: {
          vertLines: {
            color: 'rgba(51,65,88,0.5)'
          },
          horzLines: {
            color: 'rgba(51,65,88,0.5)'
          }
        },
        crosshair: {
          mode: CrosshairMode.Normal
        },
        priceScale: {
          borderColor: '#31353e',
          scaleMargins: {
            top: 0.05,
            bottom: 0.2
          }
        },
        timeScale: {
          borderColor: 'transparent',
          tickMarkFormatter: (time, tickMarkType, locale) => {
            return (time.month < 10 ? '0' + time.month : time.month) + '/' + (time.day < 10 ? '0' + time.day : time.day)
          }
        }
      })
      this.candleSeries = this.chart.addCandlestickSeries({
        upColor: 'rgba(18, 153, 97, 0.6)',
        downColor: 'rgba(207, 32, 47, 0.6)',
        borderDownColor: 'rgba(207, 32, 47, 0.6)',
        borderUpColor: 'rgba(18, 153, 97, 0.6)',
        wickDownColor: 'rgba(207, 32, 47, 0.6)',
        wickUpColor: 'rgba(18, 153, 97, 0.6)'
      })
      this.volumeSeries = this.chart.addHistogramSeries({
        priceFormat: {
          type: 'volume'
        },

        priceScaleId: '',
        scaleMargins: {
          top: 0.9,
          bottom: 0
        }
      })

      for (let i = 0; i < 200; i++) {
        const bar = this.nextBar()
        this.candleSeries.update(bar)
        this.volumeSeries.update(bar)
      }

      setInterval(() => {
        const bar = this.nextBar()
        this.candleSeries.update(bar)
        this.volumeSeries.update(bar)
      }, 3000)
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;

    .header-filter {
      margin: 24px 0;
      display: flex;

      .filter-item {
        color: var(--color-text-secondary);
        cursor: pointer;
        padding-right: 12px;

        &:hover {
          color: var(--color-text-secondary);
          background: var(--color-active-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    .chart {
      position: relative;
      border-top: 1px solid var(--color-border-primary);

      .info {
        background-color: rgba(21, 23, 24, 0.6);
        position: absolute;
        z-index: 20;

        .icon-trade {
          cursor: pointer;
          transform: rotate(90deg);
        }

        .icon-trade:hover {
          opacity: 0.9;
        }

        > div {
          color: var(--color-text-secondary);
          font-size: 12px;
          width: 80%;
        }
      }

      .info-volume {
        padding-top: 8px;
        align-items: center;
        width: 100%;
        border-top: 1px solid var(--color-border-primary);
        bottom: 40px;
        position: absolute;
        z-index: 20;

        .icon-trade {
          cursor: pointer;
          margin-right: 8px;

          &:hover {
            opacity: 0.6;
          }
        }

        .trade-delete {
          margin: 0;

          &:hover {
            opacity: 0.9;
          }
        }

        > span {
          color: var(--color-text-secondary);
          font-size: 12px;
        }
      }
    }
  }
</style>
