<template>
  <div v-if="false" class="time-progress" v-loading="isLoading">
    <div class="time-item time-item--ver2 mb-24">
      <h2 class="text-1xl text-bold text-center title">Total Investors</h2>
      <div class="mt-24 be-flex jc-space-center wrap-nunber">
        <div v-for="(item, index) in arrTotalInvestor" :key="index" class="number">
          {{ item }}
        </div>
      </div>
      <!-- <h2 class="text-2xl text-bold text-center title">{{ getRoundNumber }}</h2>
      <h3 v-if="isEndOn" class="text-base text-bold text-center mb-24">
        {{ $t('crowd-sale.end-on') }} {{ roundCurrent && roundCurrent.toDate && roundCurrent.toDate.time | formatMMDDYYWithoutHours }}
      </h3>
      <h3 v-else class="text-base text-bold text-center mb-24">
        {{ $t('crowd-sale.ready-start') }} {{ roundCurrent && roundCurrent.fromDate && roundCurrent.fromDate.time | formatMMDDYYWithoutHours }}
      </h3>
      <div class="be-flex timer">
        <div class="timer-item">
          <h3 class="text-40">{{ day }}</h3>
          <span class="small-title">{{ $t('time.day') }}{{ day > 1 && getLang ? 's' : '' }}</span>
        </div>
        <div class="timer-item">
          <h3 class="text-40">{{ hour }}</h3>
          <span class="small-title">{{ $t('time.hour') }}{{ hour > 1 && getLang ? 's' : '' }}</span>
        </div>
        <div class="timer-item">
          <h3 class="text-40">{{ minute }}</h3>
          <span class="small-title">{{ $t('time.minute') }}{{ minute > 1 && getLang ? 's' : '' }}</span>
        </div>
        <div class="timer-item">
          <h3 class="text-40">{{ second }}</h3>
          <span class="small-title">{{ $t('time.second') }}{{ second > 1 && getLang ? 's' : '' }}</span>
        </div>
      </div> -->
    </div>
    <div class="time-item time-item--ver3">
      <h2 class="text-1xl text-bold text-center title mb-24">Top 3 countries</h2>
      <div class="wrap-top">
        <div v-for="(item, index) in top3" :key="index" class="be-flex align-center jc-space-between top-item">
          <div class="be-flex align-center left">
            <div class="text-l text-bold-1 index">{{ index + 1 }}</div>
            <div class="text-l name text-overflow-1">{{ item.country }}</div>
          </div>
          <div class="be-flex align-center right">
            <div class="text-xl lh-default text-semibold number">
              {{ item.numOfInvestor | formatNumber }}
            </div>
            <base-icon icon="icon-persion" size="16" />
          </div>
        </div>
      </div>
      <!-- <h2 class="text-2xl text-bold text-center title mb-24">{{ $t('crowd-sale.progress') }}</h2>
      <div class="be-flex jc-space-between progress-label">
        <span class="text-sm">{{ roundCurrent && roundCurrent.totalSold | formatNumber }} {{ $t('crowd-sale.sold') }}</span>
        <span class="text-sm">{{ roundCurrent && roundCurrent.totalAvailable | formatNumber }} {{ $t('crowd-sale.left') }}</span>
      </div>
      <el-progress :percentage="progressbar" color="#129961" :show-text="false" :stroke-width="12"></el-progress>
      <div class="be-flex description">
        <div class="desitem">
          <h3 class="text-l text-bold">{{ ((roundCurrent && roundCurrent.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</h3>
          <span class="small-title">{{ $t('crowd-sale.funded') }}</span>
        </div>
        <div class="desitem desitem--border">
          <h3 class="text-l text-bold">${{ roundCurrent && (roundCurrent.totalSold * roundCurrent.price) | convertAmountDecimal('USD') }}</h3>
          <span class="small-title">{{ $t('crowd-sale.raised') }}</span>
        </div>
        <div class="desitem">
          <h3 class="text-l text-bold">{{ roundCurrent && roundCurrent.totalBacker | formatNumber }}</h3>
          <span class="small-title">{{ $t('crowd-sale.backers') }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import firebase from '@/utils/firebase'

  import findIndex from 'lodash/findIndex'
  import filter from 'lodash/filter'
  import forEach from 'lodash/forEach'
  import EventBus from '@/utils/eventBus'

  import { namespace } from 'vuex-class'
  const bcCrowdsale = namespace('bcCrowdsale')

  @Component
  export default class TimeProgress extends Vue {
    @bcCrowdsale.Action('setIsActiveRound') setIsActiveRound!: (status: boolean) => void
    @bcCrowdsale.Action('setroundCurrent') setroundCurrent!: (round: Record<string, any>) => void
    @bcCrowdsale.Action('setListRound') setListRound!: (list: Record<string, any>) => void

    listRound: Record<string, any>[] = []

    timing: any = null
    day: string | number = 0
    hour: string | number = 0
    minute: string | number = 0
    second: string | number = 0

    roundCurrent: Record<string, any> | any = {}

    isLoading = true
    progressbar = 0

    countDownDate = 0

    listener: any = null
    listener1: any = null
    isEndOn = false
    isEndRound = false

    arrTotalInvestor: string[] = ['0', '0', '0', '0', '0', '0', '0']
    top3: Record<string, any>[] = []

    get getLang(): boolean {
      return window.localStorage.getItem('bc-lang') === 'en'
    }

    // get countDownDate(): number {
    //   return new Date(this.roundCurrent.toDate).getTime()
    // }

    get getRoundNumber(): string {
      return this.roundCurrent?.name
    }

    get getIsEndRound(): boolean {
      const index = findIndex(this.listRound, elm => elm.id === this.roundCurrent.id)
      if (index === this.listRound.length - 1) {
        return true
      }
      return false
    }

    // get getProgressBar(): number {
    //   return (this.roundCurrent.totalSold / this.roundCurrent.totalAvailable) * 100
    // }

    /**
     * *  created => event firebase on => check isActive
     * * N???u isActive = true => l???y currentRound = data firebase tr??? v???
     * * N???u isActive = false => l???y round ti???p theo t??? list round => off event firebase, isShowRoundFirebase = false
     * * N???u isActive = false v?? h???t time fromDate => isShowRoundFirebase = true
     */

    mounted(): void {
      // this.isLoading = true
      this.handleTurnOnFirebase()
    }

    destroyed(): void {
      const leadsRef1 = firebase.database().ref('crowdsales_dashboard')
      const leadsRef = firebase.database().ref('crowd-sales')
      leadsRef1.off('value', this.listener1)
      leadsRef.off('value', this.listener)
    }

    handleTurnOnFirebase(): void {
      const leadsRef1 = firebase.database().ref('crowdsales_dashboard')
      const leadsRef = firebase.database().ref('crowd-sales')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      this.listener1 = leadsRef1.on('value', function (snapshot) {
        const response = snapshot.val()
        const totalInvestor = response.totalInvestor
        // const totalInvestor = filter(response.data, elm => elm.numOfInvestor).reduce((previousValue, currentValue) => previousValue + currentValue.numOfInvestor, 0)
        _this.arrTotalInvestor = (new Array(7 + 1 - (totalInvestor + '').length).join('0') + totalInvestor).split('')
        _this.top3 = response.data.slice(0, 3)
        _this.isLoading = false
      })

      this.listener = leadsRef.on('value', function (snapshot) {
        console.log('round get firebase', snapshot.val())
        _this.listRound = snapshot.val()
        _this.setListRound(snapshot.val())
        const roundActive = filter(snapshot.val(), round => round.isActive)
        console.log('roundActive', roundActive)
        if (!roundActive.length) {
          _this.roundCurrent = null
          _this.isEndOn = false
          _this.handleGetRoundNext()
          _this.setIsActiveRound(false)
        } else {
          _this.roundCurrent = roundActive[0]
          _this.isEndOn = true
          _this.progressbar = (_this.roundCurrent.percentageSold * 1000) / 10
          _this.handleGetData()
          _this.setIsActiveRound(true)
        }
      })
    }

    handleGetRoundNext(): void {
      const leadsRef = firebase.database().ref('crowd-sales')
      leadsRef.off('value', this.listener)

      /**
       * N???u response l?? round cu???i
       * response l?? null <=> ch??a v??o round n??o => l???y round 1
       */

      if (!this.roundCurrent) {
        const roundFirst = this.listRound[0]
        const roundLast = this.listRound[this.listRound.length - 1]

        const toDay = Date.now()
        const fromTimeRoundFirst = new Date(roundFirst.fromDate.time).getTime()
        const toTimeRoundLast = new Date(roundLast.toDate.time).getTime()

        // N???u today > time roundLast
        if (toDay > toTimeRoundLast) {
          this.day = '00'
          this.hour = '00'
          this.minute = '00'
          this.second = '00'
          this.roundCurrent = roundLast
          this.isEndOn = true
          this.isLoading = false
        }
        // N???u today < time roundFirst
        if (toDay < fromTimeRoundFirst) {
          this.roundCurrent = this.listRound[0]
          this.progressbar = (this.roundCurrent.percentageSold * 1000) / 10
          this.handleGetData('from')
        }
        // N???u fromTimeRoundFirst < today < toTimeRoundLast
        if (toDay > fromTimeRoundFirst && toDay < toTimeRoundLast) {
          forEach(this.listRound, round => {
            const fromTime = new Date(round.fromDate.time).getTime()
            if (toDay < fromTime) {
              this.roundCurrent = round
              return false
            }
          })

          this.isEndOn = false
          this.progressbar = (this.roundCurrent.percentageSold * 1000) / 10
          this.handleGetData('from')
        }
      }

      // const index = findIndex(this.listRound, round => round.id === this.roundCurrent.id)

      // if (index === this.listRound.length - 1) {
      //   this.isEndRound = true
      // } else {
      //   this.roundCurrent = this.listRound[index + 1]
      //   this.progressbar = (this.roundCurrent.percentageSold * 1000) / 10
      //   console.log('round next', this.roundCurrent)
      //   this.handleGetData('from')
      // }
    }

    handleGetData(type = 'to'): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      this.countDownDate = type === 'to' ? new Date(this.roundCurrent.toDate.time).getTime() : new Date(this.roundCurrent.fromDate.time).getTime()
      this.setroundCurrent(this.roundCurrent)
      this.timing = setInterval(function () {
        let now = new Date().getTime()

        let distance = _this.countDownDate - now

        //case ready start ch???y h???t time
        if (distance <= 0 && !_this.isEndOn) {
          console.log('vao day 1')
          _this.countDownDate = new Date(_this.roundCurrent.toDate.time).getTime()
          _this.handleTurnOnFirebase()
          _this.isEndOn = true
          _this.isLoading = false
        }

        //case ch???y h???t time end on v?? kh??ng ph???i round cu???i
        if (distance <= 0 && _this.isEndOn && !_this.getIsEndRound) {
          _this.isLoading = true
          _this.handleTurnOnFirebase()
          _this.isEndOn = true
          _this.isLoading = false
          return
        }

        //case round cu???i v?? h???t h???n
        if (distance <= 0 && _this.isEndOn && _this.getIsEndRound) {
          clearInterval(_this.timing)
          const leadsRef = firebase.database().ref('crowd-sales')
          leadsRef.off('value', _this.listener)
          // EventBus.$emit('activeRound', false)
          _this.setIsActiveRound(false)

          _this.isLoading = false
          return
        }

        _this.day =
          Math.floor(distance / (1000 * 60 * 60 * 24)) >= 10
            ? Math.floor(distance / (1000 * 60 * 60 * 24))
            : Math.floor(distance / (1000 * 60 * 60 * 24)) === 0
            ? '0'
            : '0' + Math.floor(distance / (1000 * 60 * 60 * 24))
        _this.hour =
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) >= 10
            ? Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) === 0
            ? '0'
            : '0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        _this.minute =
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) >= 10
            ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) === 0
            ? '0'
            : '0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        _this.second =
          Math.floor((distance % (1000 * 60)) / 1000) >= 10
            ? Math.floor((distance % (1000 * 60)) / 1000)
            : Math.floor((distance % (1000 * 60)) / 1000) === 0
            ? '0'
            : '0' + Math.floor((distance % (1000 * 60)) / 1000)
      }, 1000)
      this.isLoading = false
    }

    beforeDestroy(): void {
      clearInterval(this.timing)
    }
  }
</script>

<style scoped lang="scss">
  .time-progress {
    .time-item {
      padding: 43px 24px;
      width: 368px;
      background: #fff;
      box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
      border-radius: 4px;
      .timer-item {
        flex: 1;
        text-align: center;
        position: relative;
        .text-40 {
          font-size: 40px;
          line-height: 48px;
        }
        .small-title {
          font-size: 12px;
          line-height: 16px;
        }
      }
      .timer-item:not(:last-child)::after {
        content: ':';
        position: absolute;
        font-size: 30px;
        top: 0;
        right: -4px;
      }
      .progress-label {
        margin-bottom: 8px;
        span {
          color: #5b616e;
        }
      }
      .description {
        margin-top: 12px;
        .desitem {
          flex-basis: 33%;
          text-align: center;
          position: relative;
          .small-title {
            font-size: 14px;
            line-height: 20px;
            color: #5b616e;
          }
        }
        .desitem--border {
          // border-left: 1px solid #d2d0ce;
          // border-right: 1px solid #d2d0ce;
          padding: 0 5px;
          margin: 0 10px;
          &::before {
            content: '';
            width: 1px;
            height: 32px;
            position: absolute;
            background: #d2d0ce;
            left: -2px;
            top: 50%;
            transform: translateY(-50%);
          }
          &::after {
            content: '';
            width: 1px;
            height: 32px;
            position: absolute;
            background: #d2d0ce;
            right: -2px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .time-item--ver2 {
      padding: 65px 24px;
      .wrap-nunber {
        // padding: 0 29px;
        .number {
          font-size: 48px;
          line-height: 1;
          font-weight: 600;
          // letter-spacing: 0.24em;
          margin-right: 8px;
        }
        .number:last-child {
          margin-right: 0;
        }
      }
    }
    .time-item--ver3 {
      padding: 24px 24px 23px 24px;
      .wrap-top {
        .top-item {
          padding-bottom: 12px;
          margin-top: 12px;
          border-bottom: 1px solid #dbdbdb;
          .left {
            width: 73%;
          }
          .index {
            background: var(--bc-menu-active);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-right: 8px;
          }
          .number {
            margin-right: 4px;
          }
        }
        .top-item:first-child {
          margin-top: 0;
        }
      }
    }
  }
</style>
