<template>
  <div class="staking-detail-view">
    <div class="staking-detail__navigation">
      <base-icon icon="icon-arrow-left-black" class="icon-back mr-12" size="28" @click.native="$router.push({ name: 'Staking' })"></base-icon>
      <base-icon :icon="'icon-' + stakingCurrency.toLowerCase()" size="24"></base-icon>
      <span class="navigation-header">{{ stakingCurrency }} - {{ stakingPack.planName }}</span>
    </div>
    <div class="staking-detail__wrap-info">
      <div class="staking-info-item left">
        <div class="staking-amount-wrap">
          <div class="title">Total staked amount</div>
          <div class="total-amount">{{ stakingPack.totalStakedAmount | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</div>
          <div class="total-amount-usd">~ ${{ getUsdValue(stakingPack.totalStakedAmount) | convertAmountDecimal('USD') }}</div>
          <div class="info-item mt-32">
            <div class="label">My staked amount</div>
            <div class="value">
              {{ stakingPack.userAmount | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}
              <span style="color: #5b616e">(~{{ getPercentage(stakingPack.userAmount, stakingPack.totalStakedAmount) }}%)</span>
            </div>
          </div>
          <div class="info-item mt-16">
            <div class="label">Total investors</div>
            <div class="value">{{ stakingPack.totalInvestor | formatNumber }}</div>
          </div>
        </div>
        <div class="staking-info-wrap">
          <div class="info-item">
            <div class="label">Duration</div>
            <div class="value">{{ stakingPack.durations }} {{ getDurationType(stakingPack.durationType, stakingPack.durations) }}</div>
          </div>
          <div class="info-item mt-16">
            <div class="label">APR</div>
            <div class="value">{{ stakingPack.aprPercent }}%</div>
          </div>
          <div class="info-item mt-16">
            <div class="label">Interest distribution type</div>
            <div class="value">{{ getInterestType(stakingPack.interestType) }}</div>
          </div>
          <div class="info-item mt-16">
            <div class="label">Minimum amount</div>
            <div class="value">{{ stakingPack.minAmount | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</div>
          </div>
          <div class="info-item mt-16">
            <div class="label">Maximum amount</div>
            <div class="value">{{ stakingPack.maxQuantity | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</div>
          </div>
          <div class="info-item mt-16">
            <div class="label">Total amount</div>
            <div class="value">{{ stakingPack.limitAmount | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</div>
          </div>
        </div>
      </div>
      <div class="staking-info-item right">
        <el-form class="form-staking" :rules="rules" :model="stakingFormData">
          <el-form-item class="mb-1" prop="amount">
            <el-input
              :disabled="false"
              placeholder="Enter staking amount"
              class="text-form-item"
              v-model="stakingFormData.amount"
              @keypress.native="onlyNumber($event, 'amount')"
              @keyup.native="numberFormat($event)"
              @input="handleInputAmount"
            />
            <div class="prefix prefix--amount">
              <span class="text-form-item">{{ stakingCurrency }}</span>
            </div>
            <div class="be-flex jc-space-between w-100" slot="label">
              <span class="be-flex jc-space-center align-center">
                Amount &nbsp;
                <span class="text-amount-min"
                  >(min: <span :class="'amount-' + stakingCurrency">{{ stakingPack.minAmount | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</span
                  >)</span
                >
                <el-popover v-model="amountInfo" trigger="click" placement="bottom" class="icon-information" popperClass="amount-information">
                  <div slot="reference">
                    <base-icon icon="icon-information" size="16" class="be-flex" />
                  </div>
                  <div class="content-popper">
                    <div class="nft-body-base cursor element">
                      {{ $t('withdraw.information-1') }}
                      <span :class="'amount-' + stakingCurrency">{{ stakingPack.minAmount | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</span>
                      {{ $t('withdraw.information-2') }}
                    </div>
                  </div>
                </el-popover>
              </span>
              <span class="text-avail-pc"
                >{{ $t('withdraw.available') }}:
                <span :class="'amount-' + stakingCurrency">{{ stakingFormData.available | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</span></span
              >
              <span class="text-avail-mb"
                >{{ $t('withdraw.avail') }}
                <span :class="'amount-' + stakingCurrency" style="margin-left: 2px"
                  >{{ stakingFormData.available | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</span
                ></span
              >
            </div>
          </el-form-item>
          <div class="be-flex jc-space-between amount-option-tab mb-20">
            <div
              class="text-base cursor amount-item"
              v-for="percentage in percentOptions"
              :key="percentage"
              :class="percentage === percentSelected ? 'active' : null"
              @click="handleSelectPercent(percentage)"
            >
              <span>{{ percentage }}%</span>
            </div>
          </div>
          <el-form-item class="mb-20">
            <el-input class="text-form-item" :disabled="true" placeholder="Service fee" :value="stakingServiceFee + ' ' + stakingCurrency" />
            <div class="prefix prefix--amount">
              <span class="text-form-item">~ ${{ stakingServiceFeeUsd }}</span>
            </div>
            <div class="be-flex jc-space-between w-100" slot="label">
              <span> Service fee ({{ stakingPack.feeAmount }}%) </span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('buy-nft.ref-code')" prop="stakingReferralCode" class="mb-20">
            <el-input :placeholder="$t('placeholder.ref-code')" :readonly="false" v-model="stakingReferralCode" />
          </el-form-item>
          <div class="form-stake-footer flex jc-space-between w-100">
            <p>You will reward</p>
            <p>{{ stakingReward | convertAmountDecimal(stakingCurrency) }} {{ stakingCurrency }}</p>
          </div>
          <p class="will-stake-usd text-right mb-20">
            <span>~ ${{ stakingRewardUsd | convertAmountDecimal('USD') }}</span>
          </p>
          <div class="chk-accept">
            <el-checkbox v-model="isCheckedTerm">
              <div class="terms text-left mb-20" style="font-size: 14px; line-height: 24px; color: var(--bc-text-discript)">
                {{ $t('text-tern.click-confirm') }}
                <a :href="getTerm" :target="getTerm == '#' || getTerm == '' ? null : '_blank'" style="color: var(--bc-theme-primary); text-decoration: none">
                  {{ $t('text-tern.term') }}</a
                >
              </div>
            </el-checkbox>
          </div>
          <el-button
            v-if="isLogin || walletAddress"
            :loading="isLoadingStakingBtn"
            :class="disabledStaking ? 'btn--disabled btn-default-bg text-regular btn-h48 w-100 btn' : 'btn-default-bg text-regular btn-h48 w-100 btn'"
            :disabled="disabledStaking"
            class="staking-btn is-none-border"
            type="button"
            @click="handleStaking"
          >
            Stake now
          </el-button>
          <el-button v-else class="staking-btn is-none-border btn-default-bg text-regular btn-h48 w-100 btn" type="button" @click="handleLogin"> Login </el-button>
        </el-form>
      </div>
    </div>
    <div class="staking-detail__wrap-descriptions">
      <div class="tab-info">
        <div class="be-scroll-custom list-item">
          <div class="be-flex">
            <div v-for="tab in stakingTabsActive" :key="tab.value" class="item" :class="stakingTabActive === tab.value ? 'active' : null" @click="handleChangeTab(tab.value)">
              {{ tab.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="tab-data">
        <transition name="fade" mode="out-in">
          <div class="tab-details ck-text-description" v-if="stakingTabActive === 'DETAIL'">
            <div v-html="stakingPack.description"></div>
          </div>
          <base-table
            v-else-if="stakingTabActive === 'ALL_TXS' && stakingTxs.length && isDesktop"
            :data="stakingTxs"
            :table="query"
            :isLoading="isLoading"
            :showEmpty="false"
            :emptyText="'No data'"
            paginationInfo="transactions"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            class="base-table table-all-staking"
            :key="'TABLE_ALL_TXS'"
          >
            <el-table-column :label="$t('wallet.table.transaction')" prop="transactionCode" width="240">
              <template slot-scope="scope">
                <div class="be-flex align-center" style="position: relative">
                  <span class="d-ib mr-2">{{ scope.row.transactionCode | formatTransactionCode(5, 5) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('wallet.table.date')" prop="transactionDate" width="260">
              <template slot-scope="scope">
                <span>{{ scope.row.transactionDate | formatMMDDYY }}</span>
              </template>
            </el-table-column>
            <el-table-column label="From" prop="from" width="280">
              <template slot-scope="scope">
                <div class="user-data">
                  <img class="avatar" :src="scope.row.avatar" alt="" />
                  <span>{{ scope.row.userName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('wallet.table.type')" prop="transactionType">
              <template slot-scope="scope">
                <span>{{ scope.row.transactionType.replaceAll('_', ' ') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('wallet.table.amount')" align="right">
              <template slot-scope="scope">
                <div v-if="scope.row.transactionType === 'STAKE'" class="amount-increase">
                  <span>+{{ scope.row.amount | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</span>
                  <span class="d-block amount-exchange-small">~${{ getUsdValue(scope.row.amount) | convertAmountDecimal('USD') }}</span>
                </div>
                <div v-else class="amount-decrease">
                  <span>-{{ scope.row.amount | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</span>
                  <span class="d-block amount-exchange-small">~${{ getUsdValue(scope.row.amount) | convertAmountDecimal('USD') }}</span>
                </div>
              </template>
            </el-table-column>
          </base-table>
          <base-table
            v-else-if="stakingTabActive === 'MY_TXS' && stakingTxs.length && isDesktop"
            :data="stakingTxs"
            :table="query"
            :isLoading="isLoading"
            :emptyText="'No data'"
            :showEmpty="false"
            paginationInfo="transactions"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            class="base-table table-all-staking"
            :key="'TABLE_MY_TXS'"
          >
            <el-table-column :label="$t('wallet.table.transaction')" prop="transactionCode" width="260">
              <template slot-scope="scope">
                <div class="be-flex align-center" style="position: relative">
                  <span class="d-ib mr-2">{{ scope.row.transactionCode | formatTransactionCode(5, 5) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('wallet.table.date')" prop="transactionDate" width="310">
              <template slot-scope="scope">
                <span>{{ scope.row.transactionDate | formatMMDDYY }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('wallet.table.type')" prop="transactionType" width="210">
              <template slot-scope="scope">
                <span>{{ scope.row.transactionType.replaceAll('_', ' ') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('wallet.table.amount')" align="right" width="230">
              <template slot-scope="scope">
                <div v-if="scope.row.transactionType === 'STAKE'" class="amount-increase">
                  <span>+{{ scope.row.amount | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</span>
                  <span class="d-block amount-exchange-small">~${{ getUsdValue(scope.row.amount) | convertAmountDecimal('USD') }}</span>
                </div>
                <div v-else class="amount-decrease">
                  <span>-{{ scope.row.amount | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</span>
                  <span class="d-block amount-exchange-small">~${{ getUsdValue(scope.row.amount) | convertAmountDecimal('USD') }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="" align="right">
              <template slot-scope="scope">
                <el-button class="btn-unstake" @click="openPopupConfirmUnstake(scope.row)" v-if="isShowUnstakeButton(scope.row)">Unstake</el-button>
              </template>
            </el-table-column>
          </base-table>

          <TransactionMobile
            class="transaction-mobile"
            :data="stakingTxs"
            :key="'TABLE_TXS_MOBILE'"
            v-else-if="stakingTxs.length && !isDesktop"
            :exchangeRate="exchangeRate"
            :tabActive="stakingTabActive"
            :query="query"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            @unstake="openPopupConfirmUnstake"
          ></TransactionMobile>
          <empty-block v-else-if="stakingTxs.length == 0" showNoData class="empty-block"></empty-block>
        </transition>
      </div>
    </div>

    <popup-staking-success :amountNumber="stakingAmount" :type="stakingType" :currency="stakingCurrency" @click-success="handleAfterStakingSuccess"></popup-staking-success>
    <popup-confirm-unstake @click-confirm="handleUnstake"></popup-confirm-unstake>
  </div>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { filter, includes } from 'lodash'
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import TransactionMobile from './TransactionMobile.vue'
  import PopupStakingSuccess from './PopupStakingSuccess.vue'
  import PopupConfirmUnstake from './PopupConfirmUnstake.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const stakingStore = namespace('stakingStore')
  import { IStakingPack } from '@/modules/earn/store/staking'
  import { IStakingTransaction } from '../../interface/staking'

  import { convertAmountDecimal, formatNumber, getDecimalsToken } from '@/configs/format'
  import firebase from '@/utils/firebase'
  import getRepository from '@/services'
  import { EarnRepository } from '@/services/repositories/earn'
  import WalletRepository from '@/services/repositories/wallet'
  import Decimal from 'decimal.js'

  const apiStaking: EarnRepository = getRepository('earn')
  const apiWallet: WalletRepository = getRepository('wallet')

  interface IStakingFormData {
    amount: string
    address: string
    available: string
    exchangeRate: number
  }

  @Component({ components: { PopupStakingSuccess, PopupConfirmUnstake, TransactionMobile, EmptyBlock } })
  export default class StakingDetail extends Mixins(PopupMixin) {
    @bcAuth.State('user') user!: Record<string, any>
    @bcAuth.Getter('isLogin') isLogin!: boolean
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    @beBase.State('isDesktop') isDesktop!: boolean
    @stakingStore.State('stakingPack') stakingPack!: IStakingPack
    @stakingStore.State('allStakingPack') allStakingPack!: IStakingPack[]
    @bcAuth.State('walletAddress') walletAddress!: string
    @stakingStore.Mutation('SET_STAKING_PACK_DATA') setStakingPackData!: (payload: IStakingPack) => void

    amountInfo = false

    percentSelected: number | null = null
    percentOptions: number[] = [25, 50, 75, 100]
    stakingFormData: IStakingFormData = {
      amount: '',
      address: '',
      available: '1000',
      exchangeRate: 0.005
    }
    rules: Record<string, any> = {
      amount: [{ required: true, message: ' ', trigger: 'blur' }]
    }
    isLoading = false
    isLoadingStakingBtn = false
    isCheckedTerm = false
    listExchangeRate: Record<string, any>[] = []
    exchangeRateListener: any = null

    // stakingPackData: Record<string, any> = {}
    stakingTabs: Array<Record<string, any>> = [
      {
        label: 'Details',
        value: 'DETAIL'
      },
      {
        label: 'All transactions',
        value: 'ALL_TXS'
      },
      {
        label: 'My transactions',
        value: 'MY_TXS'
      }
    ]
    stakingTabActive: 'DETAIL' | 'ALL_TXS' | 'MY_TXS' = 'DETAIL'

    stakingTxs: Array<IStakingTransaction> = []
    stakingMyTxs: Array<IStakingTransaction> = []
    rowUnstake: IStakingTransaction | Record<string, any> = {}
    stakingType: 'STAKING' | 'UNSTAKING' = 'STAKING'
    stakingAmount = 0
    stakingReferralCode = ''

    query: Record<string, any> = {
      page: 1,
      limit: 20,
      total: 0
    }
    // =================================================================computed

    get amountNumber(): number {
      return +this.stakingFormData.amount.replaceAll(',', '')
    }

    get stakingServiceFee(): string {
      const amountStr = this.stakingFormData.amount.replaceAll(',', '') || '0'
      // const fee = +amountStr * (this.stakingPack.feeAmount / 100)
      const fee = Decimal.mul(amountStr, this.stakingPack.feeAmount / 100).toString()
      return fee
    }

    get stakingServiceFeeFormat(): string {
      return formatNumber(this.stakingServiceFee)
    }

    get stakingServiceFeeUsd(): string {
      const amountStr = this.stakingFormData.amount.replaceAll(',', '')
      const fee = +amountStr * (this.stakingPack.feeAmount / 100)
      const feeUsd = fee * +this.exchangeRate
      return formatNumber(feeUsd.toFixed(2))
    }

    get stakingCurrency(): string {
      return this.stakingPack.currency || ''
    }

    get disabledStaking(): boolean {
      return !this.isCheckedTerm || !this.stakingFormData.amount || +this.stakingFormData.amount.replaceAll(',', '') < this.stakingPack.minAmount || this.walletAddress !== ''
    }

    get stakingId(): string {
      return this.$route.params?.stakingId || ''
    }

    get stakingTabsActive(): Array<Record<string, any>> {
      if (this.isLogin) return this.stakingTabs
      else return this.stakingTabs.filter(el => el.value !== 'MY_TXS')
    }

    get stakingInterestType(): string {
      return this.stakingPack.interestType as string
    }
    get stakingDurationType(): string {
      return this.stakingPack.durationType as string
    }

    get stakingReward(): number {
      const amount = +this.stakingFormData.amount.replaceAll(',', '') || 0
      const durationVar = {
        DAY: 1,
        WEEK: 7,
        MONTH: 30,
        YEAR: 365
      }
      const interestTypeVar = {
        DAILY: [365, 1],
        WEEKLY: [52, 7],
        MONTHLY: [12, 30],
        YEARLY: [1, 365]
      }

      const X = interestTypeVar[this.stakingInterestType][0]
      const Y = durationVar[this.stakingDurationType]
      const Z = interestTypeVar[this.stakingInterestType][1]

      const rewardCount = this.stakingPack.durations * Math.round(Y / Z)
      const rewardAmountPerTimes = (amount * this.stakingPack.aprPercent) / 100 / X
      return amount + rewardAmountPerTimes * rewardCount
    }
    get stakingRewardUsd(): number {
      return this.stakingReward * +this.exchangeRate
    }

    get exchangeRate(): string {
      return this.listExchangeRate.find(el => el.currency === this.stakingCurrency)?.exchangeRate || '0'
    }

    // =================================================================methods

    async init(): Promise<void> {
      //
    }
    handleLogin(): void {
      this.$router.push({ name: 'login' })
    }
    async handleStaking(): Promise<void> {
      try {
        const stakeBody = {
          stakingPlanId: this.stakingId,
          currency: this.stakingCurrency,
          amount: this.amountNumber,
          feeAmount: +this.stakingServiceFee,
          refUserCode: this.stakingReferralCode
        }
        this.isLoadingStakingBtn = true
        const rs = await apiStaking.createNewStaking(stakeBody)
        if (rs) {
          this.stakingAmount = this.amountNumber
          this.stakingType = 'STAKING'
          this.setOpenPopup({
            popupName: 'popup-staking-success',
            isOpen: true
          })
        }
        this.isLoadingStakingBtn = false
      } catch (error) {
        this.isLoadingStakingBtn = false
      }
    }
    async handleUnstake(): Promise<void> {
      //
      const body = {
        transactionCode: this.rowUnstake.transactionCode
      }
      const rs = await apiStaking.unstake(body)
      if (rs) {
        this.stakingType = 'UNSTAKING'
        this.stakingAmount = this.rowUnstake.amount
        this.setOpenPopup({
          popupName: 'popup-staking-success',
          isOpen: true
        })
      }
    }
    openPopupConfirmUnstake(row: Record<string, any>): void {
      console.log('open confirm')
      this.rowUnstake = row
      this.setOpenPopup({
        popupName: 'popup-confirm-unstake',
        isOpen: true
      })
    }
    async handleAfterStakingSuccess(): Promise<void> {
      await this.initStakingPackData()
      await this.getAvailableBalance()
      this.stakingFormData.amount = ''
      this.isCheckedTerm = false
      this.handleSelectStakingTab(this.stakingTabActive)
    }

    handleSelectStakingTab(tabValue: 'DETAIL' | 'ALL_TXS' | 'MY_TXS'): void {
      switch (tabValue) {
        case 'DETAIL':
          this.getStakingDetail()
          return
        case 'ALL_TXS':
          this.getStakingAllTransations()
          return
        case 'MY_TXS':
          this.getStakingMyTransaction()
          return
      }
    }

    async getStakingDetail(): Promise<void> {
      console.log('get staking detail')
    }

    async getStakingAllTransations(): Promise<void> {
      this.isLoading = true
      this.stakingTxs = []
      const rs = await apiStaking.getTransactionStaking(+this.stakingId, 0, { page: this.query.page, limit: this.query.limit })
      this.stakingTxs = rs?.content || []
      this.query.total = rs?.totalElements || 0
      this.isLoading = false
    }

    async getStakingMyTransaction(): Promise<void> {
      if (this.isLogin) {
        this.isLoading = true
        console.log('getStakingMyTransaction')
        this.stakingTxs = []
        const rs = await apiStaking.getTransactionStaking(+this.stakingId, this.user?.userId, { page: this.query.page, limit: this.query.limit })
        this.stakingTxs = rs?.content || []
        this.query.total = rs?.totalElements || 0
        this.isLoading = false
      }
    }

    async getAvailableBalance(): Promise<void> {
      //
      if (this.isLogin) {
        const rs = await apiWallet.getMyWallet({ currency: this.stakingCurrency })
        console.log('>>> / file: StakingDetail.vue:389 / rs', rs)
        this.stakingFormData.available = `${rs[0]?.assetBalances.availableBalance}`
      } else {
        this.stakingFormData.available = '0'
      }
    }

    async initStakingPackData(): Promise<void> {
      const stakingId = +this.$route.params?.stakingId
      const rs = await apiStaking.getStakingPackDetail(stakingId)
      const existedStakingPack = rs?.content[0]

      if (!existedStakingPack) {
        this.$message.error('Staking plan is not exist')
        this.$router.push({ name: 'Staking' })
        return
      }
      this.setStakingPackData(existedStakingPack)
    }

    getDurationType(type: 'DAY' | 'MONTH' | 'WEEK' | 'YEAR' | string, duration: number): string {
      switch (type) {
        case 'DAY':
          return duration == 1 ? 'day' : 'days'
        case 'MONTH':
          return duration == 1 ? 'month' : 'months'
        case 'WEEK':
          return duration == 1 ? 'week' : 'weeks'
        case 'YEAR':
          return duration == 1 ? 'year' : 'years'
        default: {
          const str = type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase() || ''
          return duration == 1 ? str : `${str}s`
        }
      }
    }
    getInterestType(type: 'DAILY' | 'MONTHLY' | 'WEEKLY' | 'YEARLY' | string): string {
      switch (type) {
        case 'DAILY':
          return 'Daily Rewards'
        case 'MONTHLY':
          return 'Monthly Rewards'
        case 'WEEKLY':
          return 'Weekly Rewards'
        case 'YEARLY':
          return 'Yearly Rewards'
        default:
          return type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase() || ''
      }
    }
    getUsdValue(payload: string | number): string {
      let value = 0
      if (typeof payload === 'string') value = +payload.replaceAll(',', '')
      else value = +payload
      return (value * +this.exchangeRate).toString()
    }

    isShowUnstakeButton(row: Record<string, any>): boolean {
      const { transactionType, status, transactionDate, endStakeDate, unstakeDay } = row
      const unstakeDate = transactionDate + unstakeDay * 1000 * 3600 * 24
      const now = Date.now()
      return transactionType === 'STAKE' && status === 'STAKE' && unstakeDate < endStakeDate && unstakeDate <= now && endStakeDate > now && !this.walletAddress
    }

    // ================================= watch

    // ================================================================= lifecycle-fnc
    created(): void {
      //
      console.log('🚀 ~ file: StakingDetail.vue:322 ~ stakingPack', this.stakingPack)

      console.log('STAKING-DETAIL-CREATED')
      const exchangeRateRef = firebase.database().ref('exchange_rates')
      this.exchangeRateListener = exchangeRateRef.on('value', snapshot => {
        this.listExchangeRate = snapshot.val()
      })
    }
    async mounted(): Promise<void> {
      console.log('STAKING-DETAIL-MOUNTED')
      await this.initStakingPackData()
      this.handleChangeTab('DETAIL')
      await this.getAvailableBalance()
      return
    }

    destroy(): void {
      const exchangeRateRef = firebase.database().ref('exchange_rates')
      exchangeRateRef.off(this.exchangeRateListener)
    }

    // ======= builtin-fnc ==========================================================

    get getTerm(): string {
      return this.urlSystem['system.token.terms'] || ''
    }
    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }
    handleSizeChange(value: number): void {
      this.query.page = 1
      this.query.limit = value
      this.handleSelectStakingTab(this.stakingTabActive)
    }
    handleCurrentChange(value: number): void {
      this.query.page = value
      this.handleSelectStakingTab(this.stakingTabActive)
    }
    handleChangeTab(tabValue: 'DETAIL' | 'ALL_TXS' | 'MY_TXS'): void {
      this.stakingTabActive = tabValue
      this.resetQuery()
      this.handleSelectStakingTab(tabValue)
    }

    handleSelectPercent(percentage: number): void {
      if (this.percentSelected === percentage) {
        this.percentSelected = null
        this.stakingFormData.amount = ''
      } else {
        this.percentSelected = percentage
        const _available = Number(this.stakingFormData.available.replaceAll(',', ''))
        const amount = (percentage * _available) / 100
        this.stakingFormData.amount = this.$options.filters?.convertAmountDecimal(amount, this.stakingCurrency)
        const receive = Number(this.stakingFormData.amount.replaceAll(',', ''))
      }
    }

    handleInputAmount(value: string): void {
      const _amount = Number(value.replaceAll(',', ''))
      // if (parseFloat(value) > 0) {
      //   this.stakingFormData.totalWillStake = this.$options.filters?.convertAmountDecimal(_amount * this.stakingFormData.exchangeRate, this.stakingCurrency)
      // } else {
      //   this.stakingFormData.totalWillStake = '0'
      // }
      // this.disabledStaking = value ? false : true

      // if (value == null || value == '' || _amount == 0 || this.stakingFormData.totalWillStake == '' || this.stakingFormData.totalWillStake == '0.00') {
      //   this.disabledStaking = true
      // } else {
      //   this.disabledStaking = false
      // }

      this.percentSelected = null
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.stakingFormData[type], '.')) {
        event.preventDefault()
      }
    }

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }

    convertWeiToAmount(amount: number | string, currency?: string): string {
      const decimal = getDecimalsToken(currency || this.stakingCurrency)
      return (+amount / 10 ** decimal).toString()
    }

    resetQuery(): void {
      this.query = {
        page: 1,
        limit: 10,
        total: 0
      }
    }

    getPercentage(numerator: number, denominator: number, toFixed = 2): string {
      if (denominator <= 0 || numerator < 0) return (0).toFixed(toFixed)
      return ((numerator / denominator) * 100).toFixed(toFixed)
    }
  }
</script>

<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .staking-detail-view {
    max-width: 1200px;
    margin: 40px auto 60px;
    .staking-detail__navigation {
      display: flex;
      align-items: center;
      height: 48px;

      .icon-back {
        &:hover {
          cursor: pointer;
        }
      }
      .navigation-header {
        margin-left: 8px;
        @include text(20px, 24px, 600, var(--bc-text-primary));
      }
    }
    .staking-detail__wrap-info {
      margin-top: 16px;
      display: flex;
      gap: 24px;
      .staking-info-item {
        width: 100%;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        padding: 32px;
      }

      .left {
        display: flex;
        flex-direction: column;
        .staking-amount-wrap {
          display: flex;
          flex-direction: column;
          padding-bottom: 32px;
          border-bottom: 1px solid #dbdbdb;
          align-items: center;
          .title {
            @include text(20px, 24px, 600, #5b616e);
          }
          .total-amount {
            margin-top: 8px;
            @include text(32px, 48px, 600, #0a0b0d);
          }
          .total-amount-usd {
            margin-top: 4px;
            @include text(20px, 24px, 600, #0a0b0d);
          }
        }
        .staking-info-wrap {
          padding-top: 32px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          width: 100%;
          @include text(16px, 24px, 400, #5b616e);
          .label {
            color: #5b616e;
          }
          .value {
            color: #0a0b0d;
          }
        }
      }

      .right {
        .form-staking {
          .prefix {
            position: absolute;
            z-index: 10;
          }
          .prefix--amount {
            right: 13px;
            bottom: 3px;
            user-select: none;
          }
          .text-amount-min {
            @include text(12px, 16px, 400, #5b616e);
          }
          .text-avail-mb {
            display: none;
          }
          .icon-information {
            display: none;
          }

          .text-form-item {
            @include text(16px, 24px, 400, #5b616e);
            ::v-deep.el-input__inner {
              color: #0a0b0d !important;
              &::placeholder {
                color: #5b616e !important;
              }
            }
          }

          .amount-option-tab {
            .amount-item {
              padding: 4px 0;
              flex: 1;
              text-align: center;
              margin-right: 8px;
              background-color: #f3f2f1;
              border-radius: 4px;
              border: 1px solid transparent;
              color: #5b616e;
              &:last-child {
                margin-right: 0;
              }
              &:hover {
                border: 1px solid var(--bc-tab-buy-border);
                // color: var(--bc-text-tab-buy);
                background: var(--bc-text-tab-buy);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
            .active {
              background: var(--bc-tab-active);
              color: #fff;
              &:hover {
                color: #fff !important;
                background: var(--bc-tab-active);
                -webkit-text-fill-color: initial;
              }
            }
          }
          .form-stake-footer {
            @include text(16px, 24px, 600, #0a0b0d);
          }
          .will-stake-usd {
            @include text(14px, 24px, 400, #5b616e);
            @media screen and(max-width: 768px) {
              margin-bottom: 16px !important;
            }
          }
          .staking-btn {
            height: 48px;
            @include text(16px, 24px, 400, #fff);
          }
          @media screen and(max-width: 768px) {
            ::v-deep.btn--disabled {
              background: #f3f2f1 !important;
              border: 1px solid #dbdbdb !important;
              & > span {
                color: #89909e !important;
              }
            }
          }
        }
      }
    }
  }
  .staking-detail__wrap-descriptions {
    .tab-info {
      .list-item {
        padding-left: 0;
        list-style: none;
        display: flex;
        border-bottom: 1px solid #dbdbdb;
        margin-top: 16px;
        overflow: auto;

        &:hover {
          ::-webkit-scrollbar {
            height: 4px;
          }
        }

        &::-webkit-scrollbar-thumb {
          background: rgb(22 22 26 / 27%);
        }
        &::-webkit-scrollbar {
          height: 4px;
          display: none;
        }

        .item {
          padding: 15px 12px;
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          color: #5b616e;
          cursor: pointer;
          position: relative;
          width: max-content;
          &:hover {
            background: var(--bc-menu-active);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .item.active {
          // border-image-source: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
          // border-bottom: 1px solid;
          // border-image-slice: 1;
          // border-width: 2px;
          // background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
          background: var(--bc-menu-active);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
          &::before {
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
    .tab-data {
      .tab-details {
        padding: 32px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
      }
      .table-all-staking {
        .user-data {
          display: flex;
          align-items: center;
          @include text(16px, 24px, 400, #201f1e);
          .avatar {
            margin-right: 8px;

            width: 36px;
            height: 36px;
            object-fit: cover;
            border-radius: 50%;
          }
        }

        .btn-unstake {
          @include text(16px, 24px, 400, #5b616e);
          padding: 8px 19px !important;
          border: 1px solid #dbdbdb;
          border-radius: 6px;
        }
      }
      .transaction-mobile {
        display: none;
      }
      .empty-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 0 !important;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .staking-detail-view {
      margin-bottom: 48px;
      margin-top: 16px;
      .staking-detail__navigation {
        margin: 0 14px;
        margin-bottom: 24px;
      }
      .staking-detail__wrap-info {
        display: grid;
        grid-template-rows: auto auto;
        margin: 0 20px;
        height: 100%;
        align-items: center;
        gap: 20px;
        padding-bottom: 10px;

        .staking-info-item {
          width: 100%;
          padding: 16px;
        }

        .left {
          .staking-amount-wrap {
            padding-bottom: 16px;
            .title {
              @include text(16px, 24px, 600, #5b616e);
            }
            .total-amount {
              @include text(24px, 32px, 600, #0a0b0d);
            }
            .total-amount-usd {
              @include text(16px, 24px, 600, #0a0b0d);
            }
            .info-item {
              margin-top: 16px !important;
              .label {
                @include text(14px, 20px, 400, #5b616e);
              }
              .value {
                display: flex;
                flex-direction: column;
                text-align: right;
                @include text(14px, 20px, 400, #0a0b0d);
                & > span {
                  color: #5b616a;
                }
              }
              &:last-child {
                margin-top: 12px !important;
              }
            }
          }
          .staking-info-wrap {
            padding-top: 16px !important;
            .info-item {
              margin-top: 12px !important;
              &:first-child {
                margin-top: 0 !important;
              }
              .label {
                @include text(14px, 20px, 400, #5b616e);
              }
              .value {
                display: flex;
                flex-direction: column;
                text-align: right;
                @include text(14px, 20px, 400, #0a0b0d);
              }
            }
          }
        }
        .right {
          ::v-deep.form-staking {
            .amount-option-tab {
              margin-bottom: 16px !important;
            }
            .form-stake-footer {
              margin-top: 16px !important;
            }

            .el-button {
              span {
                @include text(16px, 24px, 600, #fff);
              }
            }
            .chk-accept {
              margin-top: 16px !important;
              .el-checkbox {
                .el-checkbox__input {
                  margin-top: 2px;
                  .el-checkbox__inner {
                    width: 16px;
                    height: 16px;

                    &::after {
                      height: 6px;
                      top: 2px;
                      left: 5px;
                    }
                  }
                }
                .el-checkbox__label {
                  padding-left: 8px;
                  .terms {
                    @include text(12px !important, 16px !important, 400 !important, #5b616a);
                    margin-bottom: 16px !important;
                  }
                }
              }
            }
            .el-form-item {
              margin-bottom: 8px !important;
              .el-form-item__content {
                .text-form-item {
                  .el-input__inner {
                    padding: 0 12px !important;
                    &::placeholder {
                      @include text(16px, 48px, 400, #5b616a);
                    }
                  }
                }
              }
              .el-form-item__label {
                &::after {
                  content: none;
                }
                & > div > span {
                  display: flex;
                }
                .text-amount-min {
                  display: none !important;
                }

                .text-avail-mb {
                  display: flex !important;
                  justify-content: center;
                  align-items: center;
                  @include text(12px, 16px, 400, #5b616a);
                }
                .text-avail-pc {
                  display: none !important;
                }
                .icon-information {
                  display: flex !important;
                  margin-left: 4px;
                  .el-popover__reference-wrapper {
                    z-index: 10;
                  }
                }
              }
            }
          }
        }
      }

      .staking-detail__wrap-descriptions {
        padding: 0 20px;
        .tab-data {
          .tab-details {
            padding: 16px;
          }
          .table-all-staking {
            display: none !important;
          }
          .transaction-mobile {
            display: block !important;
          }
        }

        .tab-info {
          .list-item {
            .item {
              padding: 15px 20px 8px;
              @include text(14px, 20px, 400, #5b616e);
            }
            .active {
              @include text(14px, 20px, 600, null);
            }
          }
        }
      }
    }
    .navigation-header {
      @include text(16px !important, 24px !important, 600, var(--bc-text-primary));
    }
  }
</style>
<style lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  .amount-information {
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    // display: block;
    margin-top: 9px !important;
    margin-left: 15px;
    width: calc(100% - 40px);
    .content-popper {
      .element {
        // width: 311px;
        word-break: break-word;
        @include text(14px, 20px, 400, #5b616e);
        text-align: left;
      }
    }
  }
</style>
