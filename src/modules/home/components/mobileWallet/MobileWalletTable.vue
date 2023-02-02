<template>
  <!-- <div>MobileWalletTable</div> -->
  <div class="w-100 bg-white wallet-table">
    <div class="be-flex align-center jc-space-between wallet-table__above">
      <div class="wallet-table__above-tabs be-flex">
        <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="tabActive === tab.id ? 'tab-active' : null" @click="handleChangeTab(tab)">
          <span class="text-base">{{ $t(`wallet.` + tab.title) }}</span>
        </div>
      </div>
    </div>
    <div class="wallet-table__respon">
      <div class="wallet-table__respon_content">
        <div class="transaction" v-for="item in data" :key="item.id" @click="handleRowClick(item)">
          <div class="transaction-icon">
            <base-icon :icon="renderIcon(item)" size="40" class="d-iflex" />
          </div>
          <div class="transaction-detail">
            <div class="transaction-detail-above">
              <span class="transaction-detail-above__title">{{ item.transactionType | convertTextUppercase }}</span>
              <span class="transaction-detail-above__amount-increase" v-if="item.creditAmount">
                <span v-if="item.transactionAmount > 1000 || item.transactionAmount < -1000"> +{{ handleNumber(item.transactionAmount) }}...{{ item.creditCurrency }} </span>
                <span v-else> {{ item.transactionAmount | convertAmountDecimal(item.creditCurrency) }} {{ item.creditCurrency }} </span>
              </span>
              <span class="transaction-detail-above__amount-decrease" v-else>
                <span v-if="item.transactionAmount > 1000 || item.transactionAmount < -1000"> {{ handleNumber(item.transactionAmount) }}...{{ item.debitCurrency }} </span>
                <span v-else> {{ item.transactionAmount | convertAmountDecimal(item.debitCurrency) }} {{ item.debitCurrency }} </span>
              </span>
            </div>
            <div class="transaction-detail-below">
              <span class="transaction-detail-below__date">
                {{ item.transactionMillisecond | formatMMDDYY }}
              </span>
              <span class="transaction-detail-below__amount-usd"> ~${{ item.transactionAmountToUsd | convertAmountDecimal('USD') }} </span>
            </div>
          </div>
          <!-- <div class="transaction-detail">
            <h4 class="transaction-detail__title">{{ checkTransactionType(item.transactionType) }}</h4>
            <p class="transaction-detail__date">{{ item.transactionMillisecond | formatMMDDYY }}</p>
          </div>
          <div class="transaction-amount-increase" v-if="item.creditAmount">
            <h4 class="transaction-amount__currency">+{{ item.transactionAmount | convertAmountDecimal(item.creditCurrency) }} {{ item.creditCurrency }}</h4>
            <p class="transaction-amount-usd">~${{ item.transactionAmountToUsd | convertAmountDecimal('USD') }}</p>
          </div>
          <div class="transaction-amount-decrease" v-else>
            <h4 class="transaction-amount__currency">{{ item.transactionAmount | convertAmountDecimal(item.debitCurrency) }} {{ item.debitCurrency }}</h4>
            <p class="transaction-amount-usd">~${{ item.transactionAmountToUsd | convertAmountDecimal('USD') }}</p>
          </div> -->
          <br style="clear: both" />
        </div>
        <div class="wallet-table__empty" v-if="data.length < 1">
          <base-icon icon="no-data" size="100" />
          <p class="wallet-table__empty_text">{{ $t('notify.no-data') }}</p>
        </div>
      </div>
    </div>
    <div class="wallet-pagination__respon">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="query.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.limit"
        :pager-count="3"
        layout="prev, pager, next"
        background
        popper-class="abc"
        :total="dataPagination.totalElements"
      >
      </el-pagination>
      <div class="page-size-custom">
        <el-select v-model="pageSizeValue" placeholder="Select" popper-class="page-size-dropdown">
          <el-option v-for="item in pageSize" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>
    <popup-detail-trans-respon :rowCurrent="rowCurrent" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import getRepository from '@/services'
  import WalletRepository from '@/services/repositories/wallet'
  import EventBus from '@/utils/eventBus'
  import PopupMixin from '@/mixins/popup'
  import PopupDetailTransRespon from './popuprespon/PupupDetailTransRespon.vue'
  import VestingList from '../VestingList.vue'
  import filter from 'lodash/filter'
  import isEmpty from 'lodash/isEmpty'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import BaseIcon from '@/components/base/icon/BaseIcon.vue'
  import BasePagination from '@/components/base/pagination/BasePagination.vue'
  import { PaginationInterface } from '@/interface'

  const apiWallet: WalletRepository = getRepository('wallet')

  @Component({ components: { PopupDetailTransRespon, VestingList, EmptyBlock, BaseIcon, BasePagination } })
  export default class MobileWalletTable extends Mixins(PopupMixin) {
    tabs: Array<Record<string, any>> = [
      {
        id: 0,
        title: 'transactions',
        transactionType: null
      },
      {
        id: 1,
        title: 'withdrawal-request',
        transactionType: 'WITHDRAW'
      }
      // ,
      // {
      //   id: 2,
      //   title: 'vesting-detail',
      //   transactionType: 'WITHDRAW'
      // }
    ]
    tabActive = 0
    data: Array<Record<string, any>> = []
    dataPagination: Record<string, any> = {}
    table!: PaginationInterface
    rowCurrent: Record<string, any> = {}
    listRound: Array<Record<string, any>> = []
    pageSizeValue = 10
    pageSize = [
      {
        label: '10',
        value: 10
      },
      {
        label: '20',
        value: 20
      },
      {
        label: '50',
        value: 50
      },
      {
        label: '100',
        value: 100
      }
    ]
    isLoading = false
    isConflictClick = false

    currencyObj: Record<string, any> = {
      WalletLyn: 'LYNK',
      WalletClm: 'CLM',
      WalletBtc: 'BTC',
      WalletEth: 'ETH',
      WalletBnb: 'BNB',
      WalletUsdt: 'USDT',
      WalletUsdc: 'USDC',
      WalletBusd: 'BUSD'
    }

    widthColStatus = 120
    widthColType = 150

    query: Record<string, any> = {
      page: 1,
      limit: 10,
      transactionType: null,
      total: 0
    }

    @Watch('pageSizeValue') handleChangeLimit(pageSizeValue: number): void {
      this.query.limit = pageSizeValue
      this.handleSizeChange(pageSizeValue)
    }
    @Watch('$route.name') handleWatchRoute(routeName: string): void {
      this.query.transactionType = null
      this.tabActive = 0
      this.resetQuery()
      this.init()
    }
    get getTabs(): Array<Record<string, any>> {
      const routeName = this.$route.name!
      if (routeName === 'WalletLyn' || routeName === 'WalletClm') {
        return this.tabs
      }
      return [
        {
          id: 0,
          title: 'transactions',
          transactionType: null
        },
        {
          id: 1,
          title: 'withdrawal-request',
          transactionType: 'WITHDRAW'
        }
      ]
    }

    get isShowVesting(): boolean {
      const routeName = this.$route.name!
      if (routeName === 'WalletLyn' || routeName === 'WalletClm') {
        return true
      }
      return false
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    get getPaginationInfo(): any {
      if (this.tabActive === 0) {
        return this.$t('wallet.paginationInfo')
      }
      return this.$t('wallet.paginationInfoRq')
    }

    created(): void {
      this.widthColStatus = window.localStorage.getItem('bc-lang') === 'en' ? 120 : 140
      this.widthColType = window.localStorage.getItem('bc-lang') === 'en' ? 200 : 220

      if (!isEmpty(this.$route.query)) {
        const query = this.$route.query
        apiWallet.getDetailTransaction(query).then(res => {
          this.rowCurrent = res[0]
          this.setOpenPopup({
            popupName: 'popup-detail-trans-respon',
            isOpen: true
          })
        })
      }

      this.init()
      this.getListRound()

      EventBus.$on('changeLang', (lang: string) => {
        this.widthColStatus = lang === 'en' ? 120 : 140
        this.widthColType = lang === 'en' ? 200 : 220
      })
      EventBus.$on('reloadData', () => {
        this.init()
      })
      EventBus.$on('callAcountTransaction', () => {
        this.init()
      })
    }
    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('reloadData')
      EventBus.$off('callAcountTransaction')
    }

    async init(): Promise<void> {
      try {
        this.isLoading = true
        const currency = this.currencyObj[this.$route.name!]
        const params = {
          ...this.query,
          total: null,
          currency
        }
        if (this.tabActive !== 2) {
          const result = await apiWallet.getListTransaction(params)
          this.data = result.content || []
          this.dataPagination = {
            totalElements: result.totalElements,
            totalPages: result.totalPages
          }
          console.log('215', this.dataPagination)
          this.query.total = result.totalElements || 0
        }
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    }

    async getListRound(): Promise<void> {
      try {
        const result = await apiWallet.getListRoundCrowdsale()
        this.listRound = filter(result, round => round.totalVestingMonth)
      } catch (error) {
        console.log(error)
      }
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 20,
        total: 0
      }
    }

    // checkAmount(amount: string): string {
    //   return parseFloat(amount) >= 0 ? 'amount-increase' : 'amount-decrease'
    // }
    checkType(type: string): string {
      return type === 'PENDING'
        ? 'status-pending'
        : type === 'FAILED'
        ? 'status-error'
        : type === 'PROCESSING'
        ? 'status-warning'
        : type === 'REJECTED'
        ? 'status-reject'
        : 'status-success'
    }

    checkTransactionStatus(status: string): any {
      switch (status) {
        case 'SUCCESS':
          return this.$i18n.t('wallet.table.succsess')
        case 'PENDING':
          return this.$i18n.t('wallet.table.pending')
        case 'PROCESSING':
          return this.$i18n.t('wallet.table.processing')
        case 'REJECTED':
          return this.$i18n.t('wallet.table.rejected')

        default:
          return this.$i18n.t('wallet.table.failed')
      }
    }

    checkTransactionType(type: string): any {
      switch (type) {
        case 'DEPOSIT':
          return this.$i18n.t('wallet.table.deposit')
        case 'NFT_STAKING':
          return this.$i18n.t('wallet.table.staking')
        case 'WITHDRAW':
          return this.$i18n.t('wallet.table.withdraw')
        case 'TRANSFER':
          return this.$i18n.t('wallet.table.transfer')
        case 'CROWDSALE':
          return this.$i18n.t('wallet.table.crowdsale')
        case 'BUY':
          return this.$i18n.t('wallet.table.buy')
        case 'BONUS_SIGN_UP':
          return this.$i18n.t('wallet.table.bonus-sign-up')
        case 'BONUS_CROWDSALE':
          return this.$i18n.t('wallet.table.bonus-crowdsale')
        case 'BONUS_FIRST_TRANS':
          return this.$i18n.t('wallet.table.bonus-first-trans')
        case 'BONUS_AFFILIATE':
          return this.$i18n.t('wallet.table.bonus-affiliate')
        case 'BONUS_BIG_BACKER':
          return this.$i18n.t('wallet.table.bonus-big-backer')
        case 'BONUS_EARLY_BACKER':
          return this.$i18n.t('wallet.table.bonus-early-backer')
        case 'BONUS_SIGN_UP_REFERRAL':
          return this.$i18n.t('wallet.table.bonus-sign-up-referral')
        case 'NFT_SALE':
          return this.$i18n.t('wallet.table.nft-sale')
        case 'NFT_TRANSFER':
          return this.$i18n.t('wallet.table.nft-transfer')
        case 'ROYALTIES_FEE':
          return this.$i18n.t('wallet.table.royalties-fee')

        default:
          return this.$i18n.t('wallet.table.sell')
      }
    }

    handleSizeChange(value: number): void {
      this.query.page = 1
      this.query.limit = value
      this.init()
    }
    handleCurrentChange(value: number): void {
      this.query.page = value
      this.init()
    }

    handleRowClick(row: Record<string, any>): void {
      if (this.isConflictClick) {
        this.isConflictClick = false
        return
      }
      this.rowCurrent = row
      this.setOpenPopup({
        popupName: 'popup-detail-trans-respon',
        isOpen: true
      })
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.tabActive = tab.id
      this.query.transactionType = tab.transactionType
      this.resetQuery()
      this.init()
    }

    handleCopyTransaction(row: Record<string, any>): void {
      this.isConflictClick = true
      let message: any = ''
      const el = document.createElement('input')
      el.value = row.transactionCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success({ message, duration: 5000 })
    }

    renderIcon(type: any): string {
      switch (type.transactionType) {
        case 'DEPOSIT':
          return 'icon-deposit-success-res'
        case 'CROWDSALE':
          return 'icon-deposit-success-res'
        case 'WITHDRAW':
          return 'icon-withdraw'
        case 'TRANSFER':
          return 'icon-transfer'
        case 'SWAP':
          return 'icon-transfer-success'
        case 'ROYALTIES_FEE':
          return 'icon-fee-royalties'
        case 'NFT_TRANSFER':
          return 'icon-transfer-nft'
        case 'NFT_SALE':
          return type.transactionAmount < 0 ? 'icon-buy-nft' : 'icon-sell-nft'
        default:
          return type.status === 'SUCCESS' ? 'icon-bonus-success' : 'icon-bonus'
      }
    }
    handleNumber(input: number): number {
      if (input < 0) {
        console.log('negative', input)
      }
      if (input > 1000) {
        while (input > 1000) {
          input = input / 10
        }
        input = Math.floor(input)
      } else if (input < -1000) {
        while (input < -1000) {
          input = input / 10
        }
        input = Math.ceil(input)
      }
      return input
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.wallet-table {
    &__above {
      border-bottom: 1px solid var(--bc-border-primary);
      &-tabs {
        .tab-item {
          padding: 16px 12px;
          position: relative;
          color: var(--bc-text-disabled) !important;
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
      padding: 0 24px;
      .table-wallet {
        .amount-decrease {
          color: var(--bc-status-error);
        }
        .amount-increase {
          color: var(--bc-status-success);
        }
      }
    }
    .wallet-pagination__respon {
      position: relative;
      .el-pagination {
        height: 40px;
        .el-select {
          text-align: left;
          .el-input {
            width: 44px;
          }
        }
      }
      .page-size-custom {
        width: 44px;
        height: 36px;
        position: absolute;
        top: 26px;
        left: 30px;
        .el-input__inner {
          padding: 0 0 0 2px;
        }
        .el-input__suffix {
          right: -3px;
        }
      }
    }
    .el-pagination .el-select .el-input__inner {
      width: 44px;
      height: 36px;
      padding-left: 2px;
      &.is-focus {
        padding-left: 2px;
      }
    }
    .btn-prev,
    li.number,
    .more.btn-quicknext {
      width: 32px;
      height: 32px;
      margin-top: 3px;
    }
    .btn-next {
      transform: rotate(90deg);
      width: 32px;
      height: 32px;
      margin-top: 3px;
    }
  }
  ::v-deep.el-select-dropdown.el-popper.page-size-dropdown {
    width: 100px;
  }
</style>
