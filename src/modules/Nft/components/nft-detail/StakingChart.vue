<template>
  <div class="wrap-chart">
    <ul class="select-time">
      <li v-for="(item, index) in listTime" :key="index" class="time-item" :class="item.value === timeActive ? 'active' : null" @click="handleClickTime(item.value)">
        {{ item.title }}
      </li>
    </ul>
    <div id="chart" v-loading="isLoading"></div>
    <span class="label-price">Price</span>
    <span class="label-rate">Rate</span>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'
  import getRepository from '@/services'
  import NftRepository from '@/services/repositories/nft'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class StakingChart extends Vue {
    @bcNft.State('isDesktop') isDesktop!: boolean
    chartData: Array<Record<string, any>> = []
    isLoading = false
    lines: Array<Record<string, any>> = [
      {
        key: 'visits',
        label: 'visits',
        color: '#E34537'
      },
      {
        key: 'hits',
        label: 'hits',
        color: '#1068da'
      }
    ]

    listTime = [
      {
        title: '7D',
        value: 7
      },
      {
        title: '30D',
        value: 30
      },
      {
        title: '90D',
        value: 90
      },
      {
        title: '1Y',
        value: 365
      }
    ]
    timeActive = 30

    chart = {} as am4charts.XYChart

    created(): void {
      this.getStakingChart()
    }

    handleClickTime(time: number): void {
      this.timeActive = time
      this.getStakingChart()
    }

    async getStakingChart(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          itemId: this.$route.params.id,
          fromDate: this.formatTimestamp()
        }
        const result = await apiNft.getStakingChart(params)
        this.chartData = result
        this.createChart()
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    createChart(): void {
      // Themes begin
      am4core.useTheme(am4themes_animated)
      this.chart = am4core.create('chart', am4charts.XYChart)
      this.chart.data = this.chartData
      this.chart.paddingRight = this.isDesktop ? 20 : 0
      this.chart.paddingLeft = 0

      const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.grid.template.strokeWidth = 0

      dateAxis.renderer.minGridDistance = 50
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.5

      this.createAxisAndSeries('interestPrice', 'Price', false)
      this.createAxisAndSeries('interestAmount', 'Interest rate', true)
      // Add legend
      this.chart.legend = new am4charts.Legend()

      // Add cursor
      this.chart.cursor = new am4charts.XYCursor()

      // this.chart.scrollbarX = new am4core.Scrollbar()
      // this.chart.scrollbarX.parent = this.chart.bottomAxesContainer
    }

    createAxisAndSeries(field: string, name: string, opposite: boolean): void {
      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.renderer.grid.template.stroke = am4core.color('#aaaaaa')
      // valueAxis.renderer.labels.template.fontSize = 12

      // valueAxis.renderer.labels.template.fill = am4core.color('#ffffff')

      if (this.chart.yAxes.indexOf(valueAxis) != 0) {
        //@ts-ignore
        valueAxis.syncWithAxis = this.chart.yAxes.getIndex(0)
      }

      let series = this.chart.series.push(new am4charts.LineSeries())
      series.fill = field === 'interestPrice' ? am4core.color('#B32DF0') : am4core.color('#0151FC')
      series.stroke = field === 'interestPrice' ? am4core.color('#B32DF0') : am4core.color('#0151FC')

      series.dataFields.valueY = field
      series.dataFields.dateX = 'logDate'
      series.strokeWidth = 2
      series.yAxis = valueAxis
      // series.yAxis.fontSize = 12

      series.name = name
      series.tooltipText = field === 'interestPrice' ? '{name}: ${valueY}' : `{name}: {valueY}%`
      series.tensionX = 0.8
      series.showOnInit = true

      let interfaceColors = new am4core.InterfaceColorSet()

      valueAxis.renderer.line.strokeOpacity = 0.5
      valueAxis.renderer.line.strokeWidth = 1
      valueAxis.renderer.line.stroke = am4core.color('#717171')
      valueAxis.renderer.labels.template.fill = am4core.color('#717171')
      valueAxis.renderer.opposite = opposite
    }

    formatTimestamp(): string {
      const time = new Date(Date.now() - this.timeActive * 24 * 60 * 60 * 1000).getTime()

      if (!time) {
        return ''
      }
      const gmt = new Date().getTimezoneOffset() / -60
      const ago = time - gmt * 60 * 60 * 1000
      const date = new Date(ago)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    }
  }
</script>

<style scoped lang="scss">
  .wrap-chart {
    // min-height: 500px;
    position: relative;

    .select-time {
      display: flex;
      background: rgb(239, 242, 245);
      padding: 3px;
      border-radius: 8px;
      align-items: center;
      width: fit-content;
      margin: 16px 0 0 auto;
      .time-item {
        padding: 7px 8px;
        white-space: nowrap;
        color: var(--bc-text-discript);
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        &:hover {
          background-color: rgb(248, 250, 253);
        }
      }
      .active {
        background-color: rgb(248, 250, 253);
      }
    }
    #chart {
      width: 100%;
      height: 550px;
      margin-top: 30px;
    }
    .label-price {
      position: absolute;
      top: 46px;
      left: 1%;
    }
    .label-rate {
      position: absolute;
      right: 3%;
      top: 46px;
    }

    @media screen and (max-width: 576px) {
      .label-price,
      .label-rate {
        display: none;
      }
      #chart {
        margin-top: 16px;
      }
    }
  }
</style>
