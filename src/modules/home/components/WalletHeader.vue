<template>
  <div class="bg-white mb-24 wallet-header">
    <base-popup name="popup-change-phone" class="popup-wallet-header" width="480px" :isShowFooter="false" :close="handleClose">
      <div class="title-popup" slot="title">
        <span>{{ $t('popup.title.verification-phone') }}</span>
      </div>

      <div class="form">
        <el-form class="form-item" ref="form-phone">
          <el-form-item style="line-height: 24px; margin-top: -2px" prop="country">
            <span v-if="this.typeAction == 'TRANSFER'" style="word-break: break-word; color: #0a0b0d"
              >{{ $t('wallet.popup.errPhoneverified') }} {{ $t('wallet.popup.transfer-transaction') }}</span
            >
            <span v-else style="word-break: break-word; color: #0a0b0d">{{ $t('wallet.popup.errPhoneverified') }}{{ $t('wallet.popup.widthdaw-transaction') }} </span>
          </el-form-item>
        </el-form>
        <hr class="hr" />
        <div slot="footer" class="footer">
          <button class="btn-default mr-15 text-regular btn-h40" @click="handleClose">
            <p>{{ $t('button.cancel') }}</p>
          </button>
          <el-button class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="handleContinue">{{ $t('button.verify') }}</el-button>
        </div>
      </div>
    </base-popup>
    <div class="be-flex align-center jc-space-between wallet-header__above">
      <div class="wallet-header__above-tabs be-flex">
        <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="tabActive === tab.currency ? 'tab-active' : null" @click="handleChangeTab(tab)">
          <span class="text-base">{{ tab.title }}</span>
        </div>
      </div>
      <div class="wallet-header__above-btn be-flex">
        <button v-if="moduleConfig.Deposit" class="btn-default-bg mr-15 text-regular btn is-none-border w-auto" @click="handleOpenPopup('popup-deposit')">
          {{ $t('wallet.button.deposit') }} {{ getUnit }}
        </button>
        <button v-if="moduleConfig.Withdraw" class="btn-default mr-15 text-regular w-auto" @click="handleOpenPopup('popup-withdraw')">
          <p>{{ $t('wallet.button.withdraw') }} {{ getUnit }}</p>
        </button>
        <button v-if="moduleConfig.Transfer" class="btn-default mr-15 text-regular w-auto" @click="handleOpenPopup('popup-transfer-lyn')">
          <p>{{ $t('wallet.button.transfer') }} {{ getUnit }}</p>
        </button>
        <button
          v-if="tabActive !== 'LYNK' && tabActive !== 'CLM' && moduleConfig.Crowdsale"
          class="btn-default mr-15 text-regular w-auto"
          @click="handleOpenPopup('popup-buy-lyn')"
        >
          <p>{{ $t('wallet.button.buy') }} {{ coinMain }}</p>
        </button>
      </div>
    </div>
    <div class="wallet-header__below">
      <div ref="wrap-card" class="be-flex jc-space-between wallet-header__below-amount" :class="tabActive !== coinMain ? ' wallet-header__below-amount--fix' : null">
        <div class="amount-wallet card">
          <div class="be-flex align-center above">
            <base-icon :icon="getIcon" size="40" class="square-icon" :style="{ display: tabActive === 'LYNK' ? 'display:inline-flex' : 'block' }" />
            <!-- <img v-else src="../../../assets/images/icon-eth.jpg" alt="aa" /> -->
            <div class="title">
              <span class="d-block text-base text-semibold title-coin">{{ getTitle }}</span>
              <span class="text-xs" style="color: #5b616e">{{ $t('wallet.balance') }}</span>
            </div>
          </div>
          <div class="amount">
            <span class="d-ib text-3xl text-semibold mr-16" :class="getClassUnit">{{ numOfBallance | convertAmountDecimal(getUnit) }} {{ getUnit }}</span>
            <span class="text-2xl amount-exchange">~${{ (numOfBallance * currentExchangeRate) | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
        <div class="amount-lock card" v-if="tabActive === coinMain">
          <div class="be-flex align-center above">
            <base-icon icon="icon-available" class="square-icon" style="color: #000" size="40" />
            <div class="title">
              <span class="d-block text-base text-semibold title-coin">{{ $t('wallet.available') }}</span>
              <span class="text-xs" style="color: #5b616e">{{ $t('withdraw.available') }}</span>
            </div>
          </div>
          <div class="amount">
            <span class="d-ib text-3xl text-semibold mr-16">{{ numOfAvaiBalance | convertAmountDecimal(getUnit) }} {{ getUnit }}</span>
            <span class="text-2xl amount-exchange">~${{ (numOfAvaiBalance * currentExchangeRate) | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
        <div class="amount-lock card">
          <div class="be-flex align-center above">
            <base-icon icon="icon-lock" class="square-icon" style="color: #000" size="40" />
            <div class="title">
              <span class="d-block text-base text-semibold title-coin">{{ $t('wallet.lock') }}</span>
              <span class="text-xs" style="color: #5b616e">{{ $t('wallet.withdrawal-request') }}</span>
            </div>
          </div>
          <div class="amount">
            <span class="d-ib text-3xl text-semibold mr-16">{{ numOfLockedAmount | convertAmountDecimal(getUnit) }} {{ getUnit }}</span>
            <span class="text-2xl amount-exchange">~${{ (numOfLockedAmount * currentExchangeRate) | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
        <div class="amount-staking card">
          <div class="be-flex align-center above">
            <base-icon icon="icon-staking" class="square-icon" style="color: #000" size="40" />
            <div class="title">
              <span class="d-block text-base text-semibold title-coin">{{ $t('wallet.staking') }}</span>
              <span class="text-xs" style="color: #5b616e">{{ $t('wallet.staking-title') }}</span>
            </div>
          </div>
          <div class="amount">
            <span class="d-ib text-3xl text-semibold mr-16">{{ numOfStaking | convertAmountDecimal(this.tabActive) }} {{ this.tabActive }}</span>
            <span class="text-2xl amount-exchange">~${{ (numOfStaking * currentExchangeRate) | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
        <div class="amount-vesting card" v-if="tabActive === coinMain">
          <div class="be-flex align-center above">
            <base-icon icon="icon-vesting" class="square-icon" style="color: #000" size="40" />
            <div class="title">
              <span class="d-block text-base text-semibold title-coin">{{ $t('wallet.vesting-title') }}</span>
              <span v-if="vesting && vesting.nextVestingDate" class="text-xs" style="color: #5b616e"
                >{{ $t('wallet.next-release') }} {{ vesting && vesting.nextVestingDate | formatMMDDYYWithoutHours }}</span
              >
              <span v-else> &nbsp;</span>
            </div>
          </div>
          <div class="amount">
            <span class="d-ib text-3xl text-semibold mr-16">{{ vesting && vesting.totalAmount | convertAmountDecimal(coinMain) }} {{ coinMain }}</span>
            <span class="text-2xl amount-exchange">~${{ vesting && vesting.totalAmountInUsd | convertAmountDecimal('USD') }}</span>
          </div>
        </div>

        <div class="btn-navigation">
          <base-icon v-if="isNext" icon="arrow" size="32" class="square-icon next" @click.native="handleClickArrow('next')" />
          <base-icon v-if="isPrev" icon="arrow" size="32" class="square-icon prev" @click.native="handleClickArrow('prev')" />
        </div>
      </div>
    </div>

    <popup-with-draw
      :dataWithdraw="dataWithdraw"
      :type="tabActive"
      :currentExchangeRate="currentExchangeRate"
      :baseCurrencyExchangeRate="baseCurrencyExchangeRate"
      :listAssetNetwork="listAssetNetwork"
      :listGasTracker="listGasTracker"
      :exchangeRateETH="exchangeRateETH"
      :exchangeRateBNB="exchangeRateBNB"
      @reloadData="reloadData"
    />
    <popup-deposit :type="tabActive" :currentExchangeRate="currentExchangeRate" />
    <popup-buy-lyn :type="tabActive" @reloadData="init" />
    <popup-transfer-lyn :dataTransfer="dataTransfer" @reloadData="reloadData" :typeActive="tabActive" />
    <popup-verify @callApi="handleCallApi" :typeAction="typeAction" :type="type2fa" :dataWithdraw="dataWithdraw" :dataTransfer="dataTransfer" :phoneVerified="phoneVerified" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupWithDraw from './popup/PopupWithDraw.vue'
  import PopupDeposit from './popup/PopupDeposit.vue'
  import PopupBuyLyn from './popup/PopupBuyLin.vue'
  import PopupTransferLyn from './popup/PopupTransferLyn.vue'
  import PopupVerify from '@/components/popup/PopupVerify.vue'
  import PopupMixin from '@/mixins/popup'

  import forEach from 'lodash/forEach'
  import filter from 'lodash/filter'
  import includes from 'lodash/includes'

  import { namespace } from 'vuex-class'

  import getRepository from '@/services'
  import WalletRepository from '@/services/repositories/wallet'
  import EventBus from '@/utils/eventBus'

  const apiWallet: WalletRepository = getRepository('wallet')
  const beBase = namespace('beBase')
  const beAuth = namespace('beAuth')

  import firebase from '@/utils/firebase'

  @Component({ components: { PopupWithDraw, PopupDeposit, PopupBuyLyn, PopupTransferLyn, PopupVerify } })
  export default class WalletHeader extends Mixins(PopupMixin) {
    @beBase.State('coinMain') coinMain!: string
    @beAuth.State('moduleConfig') moduleConfig!: Record<string, any>
    @beAuth.State('currencyCanWithDraw') currencyCanWithDraw!: string[]
    @beAuth.State('user') user!: Record<string, any>

    roundCurrentPopup: Record<string, any> | any = {}
    listRoundPopup: Record<string, any>[] = []
    listenerCrowd: any = null
    type2fa = 'SMS'
    phoneVerified = true
    typeAction = ''
    isNext = true
    isPrev = false

    tabs: Record<string, any>[] = [
      {
        id: 1,
        title: 'Bitcoin',
        currency: 'BTC',
        routeName: 'WalletBtc'
      },
      {
        id: 2,
        title: 'Ethereum',
        currency: 'ETH',
        routeName: 'WalletEth'
      },
      {
        id: 3,
        title: 'BNB',
        currency: 'BNB',
        routeName: 'WalletBnb'
      },
      {
        id: 4,
        title: 'Tether',
        currency: 'USDT',
        routeName: 'WalletUsdt'
      },
      {
        id: 5,
        title: 'USDC',
        currency: 'USDC',
        routeName: 'WalletUsdc'
      },
      {
        id: 6,
        title: 'Binance USD',
        currency: 'BUSD',
        routeName: 'WalletBusd'
      }
    ]
    tabActive = ''

    listener: any = null

    wallet: Array<Record<string, any>> = []
    vesting: Record<string, any> = {}

    exchangeRate: Array<Record<string, any>> = []

    dataTransfer: any = {}
    dataWithdraw: any = {}

    refGasTracker: any = null
    listGasTracker: Array<Record<string, any>> = []
    refAssetNetwork: any = null
    listAssetNetwork: Array<Record<string, any>> = []

    // currencyObj: Record<string, any> = {
    //   LYN: '.00',
    //   BTC: '.00000000',
    //   ETH: '.00000000'
    // }

    routeTabActive: Record<string, any> = {
      WalletLyn: 'LYNK',
      WalletClm: 'CLM',
      WalletBtc: 'BTC',
      WalletEth: 'ETH',
      WalletBnb: 'BNB',
      WalletUsdt: 'USDT',
      WalletUsdc: 'USDC',
      WalletBusd: 'BUSD'
    }

    get getStatusCanBuy(): boolean {
      const existRound = includes(this.user.roundsUserCanBuy, this.roundCurrentPopup.id)
      return existRound
    }

    get getTabs(): Array<Record<string, any>> {
      if (this.coinMain === 'LYNK') {
        const tab: Record<string, any> = {
          id: 0,
          title: 'LynKey',
          currency: 'LYNK',
          routeName: 'WalletLyn'
        }
        return [tab, ...this.tabs]
      } else {
        const tab: Record<string, any> = {
          id: 0,
          title: 'CleverMe',
          currency: 'CLM',
          routeName: 'WalletClm'
        }
        return [tab, ...this.tabs]
      }
    }

    get getTitle(): any {
      switch (this.tabActive) {
        case 'LYNK':
          return this.$t('wallet.Linkey')
        case 'BTC':
          return this.$t('wallet.Bitcoin')
        case 'ETH':
          return this.$t('wallet.Ethereum')
        case 'BNB':
          return this.$t('wallet.Bnb')
        case 'USDT':
          return this.$t('wallet.Usdt')
        case 'USDC':
          return this.$t('wallet.Usdc')
        case 'BUSD':
          return this.$t('wallet.Busd')
        default:
          return this.$t('wallet.Cleverme')
      }
    }
    get getIcon(): string {
      switch (this.tabActive) {
        case 'LYNK':
          return 'icon-lin'
        case 'BTC':
          return 'icon-btc'
        case 'ETH':
          return 'icon-eth'
        case 'BNB':
          return 'icon-bnb'
        case 'USDT':
          return 'icon-usdt'
        case 'USDC':
          return 'icon-usdc'
        case 'BUSD':
          return 'icon-busd'
        default:
          return 'icon-clm'
      }
    }
    get getUnit(): string {
      switch (this.tabActive) {
        case 'LYNK':
          return 'LYNK'
        case 'BTC':
          return 'BTC'
        case 'ETH':
          return 'ETH'
        case 'BNB':
          return 'BNB'
        case 'USDT':
          return 'USDT'
        case 'USDC':
          return 'USDC'
        case 'BUSD':
          return 'BUSD'
        default:
          return 'CLM'
      }
    }
    get getClassUnit(): string {
      switch (this.tabActive) {
        case 'LYNK':
          return 'amount-lyn'
        case 'BTC':
          return 'amount-btc'
        case 'ETH':
          return 'amount-eth'
        case 'BNB':
          return 'amount-bnb'
        case 'USDT':
          return 'amount-usdt'
        case 'USDC':
          return 'amount-usdc'
        case 'BUSD':
          return 'amount-busd'
        default:
          return 'amount-clm'
      }
    }

    get numOfBallance(): number {
      const currentWallet = filter(this.wallet, elm => elm.currency === this.tabActive)[0]
      return currentWallet?.assetBalances.balance || 0
    }

    get numOfLockedAmount(): number {
      const currentWallet = filter(this.wallet, elm => elm.currency === this.tabActive)[0]
      return currentWallet?.assetBalances.totalLockedAmount || 0
    }

    get numOfAvaiBalance(): number {
      const currentWallet = filter(this.wallet, elm => elm.currency === this.tabActive)[0]
      return currentWallet?.assetBalances.availableBalance || 0
    }
    get numOfStaking(): number {
      const currentWallet = filter(this.wallet, elm => elm.currency === this.tabActive)[0]
      return currentWallet?.assetBalances.lockedStakingAmount || 0
    }

    get currentExchangeRate(): number {
      const currentExchange = filter(this.exchangeRate, elm => elm.currency === this.tabActive)[0]
      return +currentExchange?.exchangeRate || 0
    }

    get baseCurrencyExchangeRate(): number {
      const baseETH = ['LYNK', 'USDC', 'USDT', 'ETH', 'CLM']
      const baseBNB = ['BUSD', 'BNB']
      let baseCurrentExchange: Record<string, any> = {}
      if (includes(baseETH, this.tabActive)) {
        baseCurrentExchange = filter(this.exchangeRate, elm => elm.currency === 'ETH')[0]
        return +baseCurrentExchange?.exchangeRate || 0
      } else if (includes(baseBNB, this.tabActive)) {
        baseCurrentExchange = filter(this.exchangeRate, elm => elm.currency === 'BNB')[0]
        return +baseCurrentExchange?.exchangeRate || 0
      } else {
        baseCurrentExchange = filter(this.exchangeRate, elm => elm.currency === 'BTC')[0]
        return +baseCurrentExchange?.exchangeRate || 0
      }
    }

    get exchangeRateETH(): number {
      const exchangeRate = filter(this.exchangeRate, elm => elm.currency === 'ETH')[0]
      return +exchangeRate?.exchangeRate || 0
    }
    get exchangeRateBNB(): number {
      const exchangeRate = filter(this.exchangeRate, elm => elm.currency === 'BNB')[0]
      return +exchangeRate?.exchangeRate || 0
    }

    handleCallApi(): void {
      this.setOpenPopup({
        popupName: 'popup-change-phone',
        isOpen: false
      })
    }
    created(): void {
      this.handleTurnOnFirebase()
      this.handleGetGasTracker()
      this.handleGetAssetNetwork()
      const exchangeRateRef = firebase.database().ref('exchange_rates')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      this.listener = exchangeRateRef.on('value', function (snapshot) {
        _this.exchangeRate = snapshot.val()
      })
      this.tabActive = this.routeTabActive[this.$route.name!]
      this.init()
    }

    destroyed(): void {
      const exchangeRateRef = firebase.database().ref('exchange_rates')
      exchangeRateRef.off('value', this.listener)
      const leadsRef = firebase.database().ref('crowd-sales')
      leadsRef.off('value', this.listenerCrowd)
      const refGasTracker = firebase.database().ref('gas_trackers')
      refGasTracker.off('value', this.refGasTracker)
      const refAssetNetwork = firebase.database().ref('asset_networks')
      refAssetNetwork.off('value', this.refAssetNetwork)
    }

    handleGetGasTracker(): void {
      const refGasTracker = firebase.database().ref('gas_trackers')
      this.refGasTracker = refGasTracker.on('value', snapshot => {
        this.listGasTracker = snapshot.val()
        console.log(this.listGasTracker)
      })
    }
    handleGetAssetNetwork(): void {
      const refAssetNetwork = firebase.database().ref('asset_networks')
      this.refAssetNetwork = refAssetNetwork.on('value', snapshot => {
        this.listAssetNetwork = snapshot.val()
      })
    }

    handleTurnOnFirebase(): void {
      const leadsRef = firebase.database().ref('crowd-sales')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this

      this.listenerCrowd = leadsRef.on('value', function (snapshot) {
        _this.listRoundPopup = snapshot.val()
        const roundActive = filter(snapshot.val(), round => round.isActive)

        if (!roundActive.length) {
          _this.roundCurrentPopup = null
          _this.handleGetRoundNext()
        } else {
          _this.roundCurrentPopup = roundActive[0]
        }
      })
    }

    handleGetRoundNext(): void {
      const leadsRef = firebase.database().ref('crowd-sales')
      leadsRef.off('value', this.listener)

      /**
       * Nếu response là round cuối
       * response là null <=> chưa vào round nào => lấy round 1
       */

      if (!this.roundCurrentPopup) {
        const roundFirst = this.listRoundPopup[0]
        const roundLast = this.listRoundPopup[this.listRoundPopup.length - 1]

        const toDay = Date.now()
        const fromTimeRoundFirst = new Date(roundFirst.fromDate.time).getTime()
        const toTimeRoundLast = new Date(roundLast.toDate.time).getTime()

        // Nếu today > time roundLast
        if (toDay > toTimeRoundLast) {
          this.roundCurrentPopup = roundLast
        }
        // Nếu today < time roundFirst
        if (toDay < fromTimeRoundFirst) {
          this.roundCurrentPopup = this.listRoundPopup[0]
        }
        // Nếu fromTimeRoundFirst < today < toTimeRoundLast
        if (toDay > fromTimeRoundFirst && toDay < toTimeRoundLast) {
          forEach(this.listRoundPopup, round => {
            const fromTime = new Date(round.fromDate.time).getTime()
            if (toDay < fromTime) {
              this.roundCurrentPopup = round
              return false
            }
          })
        }
      }
    }

    async init(): Promise<void> {
      try {
        this.wallet = await apiWallet.getMyWallet({ currency: this.tabActive })
        if (this.tabActive === 'LYNK' || this.tabActive === 'CLM') {
          this.vesting = await apiWallet.getInfoVesting({ userId: this.user.userId })
        }
        // const result = await apiWallet.getExchangeRate()
        // this.exchangeRate = result.exchangeRates
      } catch (error) {
        console.log(error)
      }
    }
    async reloadData(): Promise<void> {
      //ban su kien sang wallet Tabel
      await EventBus.$emit('callAcountTransaction')
      await this.init()
    }
    handleChangeTab(tab: Record<string, any>): void {
      this.isNext = true
      this.isPrev = false
      this.tabActive = tab.currency
      this.init()
      this.$router.push({ name: tab.routeName })

      // EventBus.$emit('changeTab', tab.currency)
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-change-phone',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-place-bid',
        isOpen: false
      })
    }
    handleContinue(): void {
      this.setOpenPopup({
        popupName: 'popup-base-verify',
        isOpen: true
      })
      // this.setOpenPopup({
      //   popupName: 'popup-change-phone',
      //   isOpen: false
      // })
    }
    open(): void {
      let message: any = this.$t('wallet.popup.errPhoneverified')
      // this.$message.error(message)
      this.setOpenPopup({
        popupName: 'popup-change-phone',
        isOpen: true
      })
    }
    async handleOpenPopup(popupName: string): Promise<void> {
      if (popupName == 'popup-transfer-lyn') {
        this.typeAction = 'TRANSFER'
        await apiWallet.getLynInfo(this.tabActive.toLowerCase()).then((res: any) => {
          console.log(res)
          this.phoneVerified = res.phoneVerified
          this.dataTransfer = res
          this.dataWithdraw = res
          if (res.kycStatus != 'VERIFIED') {
            // alert('abc')
            let message: any = this.$t('wallet.popup.errorGetLyn2')
            this.$message.error({ message, duration: 5000 })
          } else if (res.originAvailable <= 0) {
            let message: any = this.$t('wallet.popup.errorGetLyn4')
            this.$message.error({ message, duration: 5000 })
          } else if (res.phoneVerified == 0) {
            // let message: any = this.$t('wallet.popup.errPhoneverified')
            // this.$message.error(message)
            this.open()
          } else {
            this.setOpenPopup({
              popupName,
              isOpen: true
            })
          }
        })
      } else if (popupName == 'popup-withdraw') {
        if (includes(this.currencyCanWithDraw, this.tabActive) || !this.currencyCanWithDraw.length) {
          this.typeAction = 'WITHDRAW'
          await apiWallet.getDataWithdraw(this.tabActive.toLowerCase()).then((res: any) => {
            this.dataWithdraw = res
            this.phoneVerified = res.phoneVerified
            console.log('dataWithdraw: ', this.dataWithdraw)
            if (res.kycStatus != 'VERIFIED') {
              let message: any = this.$t('wallet.popup.errorGetLyn2')
              this.$message.error({ message, duration: 5000 })
            } else if (res.originAvailable <= 0) {
              let message: any = this.$t('wallet.popup.errorGetLyn4')
              this.$message.error({ message, duration: 5000 })
            } else if (res.phoneVerified == 0) {
              this.open()
            } else {
              this.setOpenPopup({
                popupName,
                isOpen: true
              })
            }
          })
        } else {
          const message = this.$t('notify.function-not-available') as string
          this.$message.error({ message, duration: 5000 })
        }
      } else {
        if (popupName == 'popup-buy-lyn') {
          if (!this.getStatusCanBuy) {
            const message: any = this.$t('notify.can-not-buy-lyn')
            this.$message.error({ message, duration: 5000 })
            return
          } else if (this.numOfBallance <= 0) {
            let message: any = this.$t('buy-lyn.fail')
            this.$message.error({ message, duration: 5000 })
          } else {
            this.setOpenPopup({
              popupName,
              isOpen: true
            })
          }
        } else {
          this.setOpenPopup({
            popupName,
            isOpen: true
          })
        }
      }
    }

    handleClickArrow(type: 'prev' | 'next'): void {
      const elm = this.$refs['wrap-card'] as Element
      const left = type === 'prev' ? 0 : 500
      elm.scrollTo({
        top: 0,
        left,
        behavior: 'smooth'
      })
      this.isNext = type === 'next' ? false : true
      this.isPrev = type === 'prev' ? false : true
    }
  }
</script>

<style scoped lang="scss">
  .w-auto {
    width: auto !important;
  }
  .footer {
    .btn-h40 {
      height: 40px;
      border: 1px solid #dbdbdb;
      border-radius: 6px;
      &:hover {
        border-color: var(--bc-input-hover-border);
      }
    }
    margin-bottom: 12px;
    float: right;
  }
  .wallet-header {
    &__above {
      border-bottom: 1px solid var(--bc-border-primary);
      &-tabs {
        .tab-item {
          padding: 16px 12px;
          position: relative;
          color: var(--bc-text-color-tab-item);
          &:hover {
            background: var(--bc-tab-active);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .tab-active {
          background: var(--bc-tab-active);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
          &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: 0;
            left: 0;
            background: var(--bc-tab-active);
          }
        }
      }
    }

    &__below {
      padding: 24px;
      position: relative;
      &-amount {
        display: grid;
        grid-template-columns: repeat(5, 280px);
        gap: 16px;
        overflow: hidden;

        .card {
          // flex-basis: 50%;
          word-break: break-word;
          .title {
            margin-left: 16px;
            .title-coin {
              color: #201f1e;
            }
          }
          .amount {
            margin-top: 16px;
          }
        }
        .amount-vesting,
        .amount-staking {
          .amount {
            color: var(--bc-amount-lock);
          }
        }

        .card {
          width: 280px;
          padding: 16px;
          border: 1px solid #dbdbdb;
          border-radius: 8px;
        }
        .btn-navigation {
          .next,
          .prev {
            border-radius: 50%;
            border: 1px solid #ececec;
            background: #fff;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            user-select: none;
          }
          .next {
            right: 8px;
          }
          .prev {
            left: 8px;
            transform: translateY(-50%) rotate(180deg);
          }
        }
      }
      &-amount--fix {
        grid-template-columns: 1fr 1fr 1fr;
        .card {
          width: 100%;
        }
        .btn-navigation {
          display: none;
        }
      }
    }
  }
  .amount-exchange {
    color: #5b616e;
  }
  .class-icon-lynk {
    font-size: 30px !important;
    background: #f3f2f1;
    width: 40px;
    height: 40px;
    text-align: center;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
  }
  .btn-default {
    &:hover {
      p {
        background: var(--bc-btn-default-text-hover);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        border-color: var(--bc-btn-default-border-hover);
        text-shadow: 0px 0px #00000000;
      }
    }
  }
  hr.hr {
    width: 483px;
    transform: translateX(-27px);
    border: 0;
    border-top: 1px solid var(--bc-border-primary);
    margin-bottom: 24px;
    margin-top: -6px;
  }
</style>
