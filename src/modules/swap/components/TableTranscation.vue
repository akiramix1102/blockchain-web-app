<template>
  <div class="w-100 table-transaction">
    <h3 class="mb-24 text-2xl text-bold">List transactions</h3>
    <base-table
      :data="data"
      :table="query"
      :isLoading="isLoading"
      :paginationInfo="getPaginationInfo"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      class="base-table table-transaction-custom"
    >
      <el-table-column label="#" :index="getIndex" type="index" align="center" width="80" />
      <el-table-column :label="$t('crowd-sale.table.date')" prop="transactionDate" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionDate | formatMMDDYY }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('crowd-sale.table.paid')" prop="paid" align="right">
        <template slot-scope="scope">
          <span class="amount-decrease">-{{ scope.row.paidAmountDisplay | convertAmountDecimal(scope.row.paidCurrency) }} {{ scope.row.paidCurrency }}</span>
          <span class="d-block amount-exchange-small">~${{ scope.row.paidAmountToUsd | convertAmountDecimal('USD') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('crowd-sale.table.amount')" prop="amount" align="right">
        <template slot-scope="scope">
          <span class="amount-increase">+{{ scope.row.tokenAmountDisplay | convertAmountDecimal(scope.row.tokenCurrency) }} {{ scope.row.tokenCurrency }}</span>
          <span class="d-block amount-exchange-small">~${{ scope.row.tokenAmountToUsd | convertAmountDecimal('USD') }}</span>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { IQuery } from '@/interface'
  import CrowdSaleRepository from '@/services/repositories/crowd-sale'
  import getRepository from '@/services'

  const apiCrowdSale: CrowdSaleRepository = getRepository('crowd-sale')

  @Component
  export default class TableTransaction extends Vue {
    data: Array<Record<string, any>> = []
    query = {
      page: 1,
      limit: 20,
      total: 0,
      transactionType: 'SWAP'
    }
    isLoading = false

    get getPaginationInfo(): any {
      return this.$t('crowd-sale.table.paginationInfo')
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }
    created(): void {
      this.init()
    }

    async init(): Promise<void> {
      try {
        const result = await apiCrowdSale.getListTransactionSwap(this.query)
        console.log(result)
        this.data = result.content || []
        this.query.total = result.totalElements
      } catch (error) {
        this.isLoading = false
        console.log(error)
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
  }
</script>

<style scoped lang="scss">
  .table-transaction {
    padding: 24px;
    background: #fff;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
  }
</style>
