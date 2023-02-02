<template>
  <div class="w-100 table-transaction">
    <h3 class="text-bold mb-24" style="font-size: 20px">{{ $t('crowd-sale.transaction') }}</h3>
    <div class="w" style="display: flex; flex-direction: column">
      <div class="container" v-for="data in data" :key="data.email">
        <div class="column-1">
          <p class="userEmail text-semibold">{{ data.userEmail }}</p>
          <p class="date">{{ data.transactionDate.time | formatMMDDYY }}</p>
        </div>
        <div class="column-2">
          <p class="amount-decrease paid">-{{ data.paidAmount | convertAmountDecimal(data.paidCurrency) }} {{ data.paidCurrency }}</p>
          <p class="amount-increase token">+{{ data.tokenAmount | convertAmountDecimal(data.tokenCurrency) }} {{ data.tokenCurrency }}</p>
        </div>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.limit"
        layout="sizes, prev, pager, next"
        background
        class="pagination"
        :total="query.total"
        pager-count="3"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import EventBus from '@/utils/eventBus'
  import { Component, Vue } from 'vue-property-decorator'
  import getRepository from '@/services'
  import CrowdSaleRepository from '@/services/repositories/crowd-sale'
  import { IQuery } from '@/interface'
  import firebase from '@/utils/firebase'
  import filter from 'lodash/filter'
  import { cloneDeep } from 'lodash'

  const apiCrowdSale: CrowdSaleRepository = getRepository('crowd-sale')
  // const apiCrowdSale: CrowdsaleRepository = getRepository('crowdsale')

  @Component
  export default class TableTransactionMobile extends Vue {
    data: Array<Record<string, any>> = []
    dataBackup: Array<Record<string, any>> = []
    query: IQuery = {
      page: 1,
      limit: 10,
      total: 0
    }
    isLoading = false

    tabActive = 0
    listener: any = null
    dataPagination: Record<string, any> = {}
    listRound: Array<Record<string, any>> = []

    get getPaginationInfo(): any {
      return this.$t('crowd-sale.table.paginationInfo')
    }
    created(): void {
      this.init()
      EventBus.$on('reloadTable', payLoad => {
        this.init()
      })
      this.getListRound()
      EventBus.$on('reloadData', () => {
        this.init()
      })
    }

    destroyed(): void {
      const leadsRef = firebase.database().ref('crowdsale_transactions')
      leadsRef.off('value', this.listener)
      EventBus.$off('reloadData')
    }

    paginationData(): void {
      let dataClone = cloneDeep(this.dataBackup)
      this.data = cloneDeep(dataClone.slice((this.query.page! - 1) * this.query.limit!, this.query.page! * this.query.limit!))
    }

    async init(): Promise<void> {
      try {
        const leadsRef = firebase.database().ref('crowdsale_transactions')
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let _this = this
        this.listener = leadsRef.on('value', function (snapshot) {
          _this.dataBackup = cloneDeep(snapshot.val())
          _this.query.total = _this.dataBackup.length
          _this.paginationData()
        })
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    async getListRound(): Promise<void> {
      try {
        const result = await apiCrowdSale.getListRoundCrowdsale()
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

    handleSizeChange(value: number): void {
      // this.query.page = 1
      this.query.limit = value
      this.paginationData()
    }

    handleCurrentChange(value: number): void {
      this.query.page = value
      this.paginationData()
    }
  }
</script>

<style scoped lang="scss">
  .table-transaction {
    padding: 20px;
    background: #fff;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
  }

  .w {
    margin-top: -25px;
  }
  .container {
    margin: 24px 0 0 0;
    display: flex;
    flex-direction: row;
  }

  .column-1 {
    display: flex;
    flex-direction: column;
    width: 45%;
    // margin: 12px 0;
    border-bottom: 1px solid #dbdbdb;

    .userEmail {
      // width: 45%;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #0a0b0d;
    }

    .date {
      width: 100%;
      font-size: 12px;
      color: #5b616e;
      // line-height: 16px;
      margin: 3.5px 0 18px 0;
    }
  }

  ::v-deep.pagination {
    margin-top: 32px;
    padding: 0;

    .el-pager {
      // background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
      .number {
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
      }
    }
  }

  ::v-deep.el-pagination {
    .btn-next {
      .el-icon-arrow-right:before {
        content: '\e6e0' !important;
        transform: rotate(90deg);
      }
    }
  }

  ::v-deep.is-background {
    .el-pager {
      .active {
        background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
      }
    }
  }

  ::v-deep.el-select-dropdown {
    .el-scrollbar {
      .el-select-dropdown__list {
        .selected::after {
          right: -5px;
          position: relative !important;
        }
      }
    }
  }

  .el-select-dropdown .el-scrollbar .el-select-dropdown__list .el-select-dropdown__item.selected::after {
    right: -5px;
    position: relative;
  }

  ::v-deep.is-background {
    margin-left: auto;
    .el-pagination__sizes {
      margin-right: auto;
      .el-select--mini {
        .el-input--suffix {
          width: 49.95px;
        }
      }
    }
  }

  .column-2 {
    width: 55%;
    display: flex;
    flex-direction: column;
    // margin: 12px 0;
    text-align: right;
    border-bottom: 1px solid #dbdbdb;

    .token {
      width: 100%;
      margin: 0 0 18px 0;
    }
  }
</style>
