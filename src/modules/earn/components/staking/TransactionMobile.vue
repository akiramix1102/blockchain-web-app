<template>
  <div class="transaction-mobile">
    <base-collapse-table :data="data">
      <template #top="{ transactionType, currency, amount }">
        <div class="be-flex align-center wrap-top">
          <div class="be-flex jc-space-center align-center left">
            <!-- <span><base-icon :icon="`icon-${marketName.toLowerCase()}`" size="24"></base-icon></span> -->
            <p class="text-0a0b0d text-body-small">{{ transactionType.charAt(0).toUpperCase() + transactionType.slice(1).toLowerCase().replaceAll('_', ' ') }}</p>
          </div>
          <div class="right">
            <div class="be-flex jc-space-center align-center">
              <!-- <img :src="iconUrl" alt="" class="icon-token" /> -->
              <div v-if="transactionType === 'STAKE'" class="amount-increase">
                <p class="text-ec text-body-small">+{{ amount | convertAmountDecimal(currency) }} {{ currency }}</p>
              </div>
              <div v-else class="amount-decrease">
                <span>-{{ amount | convertAmountDecimal(currency) }} {{ currency }}</span>
              </div>
            </div>
            <base-icon icon="icon-arrow-down-staking" size="16" class="square-icon be-flex jc-center align-center" />
          </div>
        </div>
      </template>
      <template #bottom="item">
        <div class="list">
          <div class="list-item">
            <p class="text-body-small text-0a0b0d title">Transaction ID</p>
            <p class="text-body-small" style="color: #201f1e">{{ item.transactionCode | formatTransactionCode(5, 5) }}</p>
          </div>
          <div class="list-item">
            <p class="text-body-small text-0a0b0d title">Date</p>
            <p class="text-0a0b0d text-body-small text-0a0b0d">{{ item.transactionDate | formatMMDDYY }}</p>
          </div>
          <div class="list-item" v-if="tabActive === 'ALL_TXS'">
            <p class="text-body-small text-0a0b0d title">From</p>
            <p class="text-ec text-body-small" @click="handleOpenDetail(item)" style="color: #201f1e">{{ item.userName }}</p>
          </div>
          <div class="list-item">
            <p class="text-body-small text-0a0b0d title">Type</p>
            <p class="text-ec text-body-small text-0a0b0d">{{ item.transactionType.replaceAll('_', ' ') }}</p>
          </div>
          <div class="list-item">
            <p class="text-body-small text-0a0b0d title">Amount</p>
            <div class="text-ec text-body-small text-right">
              <div v-if="item.transactionType === 'STAKE'" class="amount-increase">
                <p class="text-ec text-body-small">+{{ item.amount | convertAmountDecimal(item.currency) }} {{ item.currency }}</p>
              </div>
              <div v-else class="amount-decrease">
                <span>-{{ item.amount | convertAmountDecimal(item.currency) }} {{ item.currency }}</span>
              </div>
              <p class="text-xs text-5b616e">~${{ getUsdValue(item.amount) | convertAmountDecimal('USD') }}</p>
            </div>
          </div>
          <el-button class="btn-unstake" v-if="tabActive === 'MY_TXS' && isShowUnstakeButton(item)" @click="$emit('unstake', item)">Unstake</el-button>
        </div>
      </template>
      <base-pagination
        v-if="data.length != 0"
        @sizeChange="handleSizeChange"
        :table="query"
        @currentChange="handleCurrentChange"
        info="transaction"
        popperClass="staking-pagination"
        :arrPageSize="[10, 20, 30, 50]"
        sizeChangeCustom
      >
      </base-pagination>
      <empty-block v-if="data.length == 0" showNoData class="be-flex-column align-center"></empty-block>
    </base-collapse-table>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import BaseCollapseTable from '../base/BaseCollapseTable.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import BasePagination from '@/components/base/pagination/BasePagination.vue'
  import { namespace } from 'vuex-class'
  const bcAuth = namespace('beAuth')

  @Component({ components: { BaseCollapseTable, BasePagination, EmptyBlock } })
  export default class TransactionMobile extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) data!: Array<Record<string, any>>
    @Prop({ required: false, type: String, default: '' }) exchangeRate!: string
    @Prop({ required: false, type: String, default: '' }) tabActive!: string
    @Prop({ required: false, type: Object, default: '' }) query!: Record<string, any>
    @bcAuth.State('walletAddress') walletAddress!: string
    // @Prop({ required: false, type: String, default: '' }) exchangeRate!: string

    getUsdValue(payload: string | number): string {
      let value = 0
      if (typeof payload === 'string') value = +payload.replaceAll(',', '')
      else value = +payload
      return (value * +this.exchangeRate).toString()
    }
    handleSizeChange(value: number): void {
      this.$emit('sizeChange', value)
    }
    handleCurrentChange(value: number): void {
      this.$emit('currentChange', value)
    }

    handleOpenDetail(item: Record<string, any>): void {
      // this.$router.push({
      //   name: 'UserProfile',
      //   params: {
      //     id: item?.userId
      //   }
      // })
    }
    isShowUnstakeButton(row: Record<string, any>): boolean {
      const { transactionType, status, transactionDate, endStakeDate, unstakeDay } = row
      const unstakeDate = transactionDate + unstakeDay * 1000 * 3600 * 24
      const now = Date.now()
      return transactionType === 'STAKE' && status === 'STAKE' && unstakeDate < endStakeDate && unstakeDate <= now && endStakeDate > now && !this.walletAddress
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.base-pagination {
    border-top: none;
    padding: 0 !important;
    margin-top: 24px;
    .custom-pagination {
      padding: 0;

      .el-pagination__sizes {
        left: 20px;
        position: absolute;
        right: auto;
      }
    }
    .info {
      display: none;
    }
    .el-pagination {
      .el-select .el-input {
        margin: 0;
        width: 51px;
      }
    }
  }

  .btn-unstake {
    width: 100%;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    height: 48px;
    border-radius: 8px;
    color: #5b616e;
    margin-top: 8px;
    margin-bottom: 8px;

    &:active,
    &:hover {
      color: #5b616a;
      background-color: transparent;
      border-color: #dbdbdb;
    }
  }
</style>
<style lang="scss">
  .staking-pagination {
    .el-scrollbar {
      .el-select-dropdown__wrap {
        .el-select-dropdown__list {
          width: 120px;
        }
      }
    }
  }
</style>
