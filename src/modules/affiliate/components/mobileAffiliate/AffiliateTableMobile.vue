<template>
  <div>
    <div class="affiliate-table align-center jc-space-between mb-24 bg-white">
      <h3 class="text-bold" style="font-size: 20px; font-weight: 600">{{ $t('affiliate.over-view') }}</h3>
      <div class="affiliate-overview-k1">
        <div class="affiliate-overview-k1-left">
          <base-icon v-if="coinMain === 'LYNK'" icon="icon-friend-lyn" style="color: #000" size="80" />
          <base-icon v-else icon="icon-monney-clm" style="color: #000" size="80" />
        </div>
        <div class="affiliate-overview-k1-right">
          <div class="affiliate-overview-k1-right-title">{{ $t('affiliate.have-earn') }}</div>
          <div v-if="totalOfBonus > 0" class="affiliate-overview-k1-right-count">${{ totalOfBonus | convertAmountDecimal('USD') }}</div>
          <div v-else class="affiliate-overview-k1-right-count">${{ 0 }}</div>
        </div>
      </div>
      <div class="affiliate-overview-k1" style="margin-top: -13px">
        <div class="affiliate-overview-k1-left">
          <base-icon v-if="coinMain === 'LYNK'" icon="icon-money-lyn" size="80" />
          <base-icon v-else icon="icon-friend-clm" style="color: #000" size="80" />
        </div>
        <div class="affiliate-overview-k1-right">
          <div class="affiliate-overview-k1-right-title">{{ $t('affiliate.friend-ref') }}</div>
          <div class="affiliate-overview-k1-right-count">{{ friendRfr }}</div>
        </div>
      </div>
    </div>
    <div class="affiliate-table align-center jc-space-between mb-24 bg-white tab" style="margin-top: 24px; padding-top: 0px">
      <div class="affiliatehistory mt24">
        <!-- <div class="affiliate-overview-title">{{ $t('affiliate.history') }}</div> -->
        <div class="be-flex align-center jc-space-between affiliatehistory__above">
          <div class="affiliatehistory__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="tabActive === tab.id ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`affiliate.` + tab.title) }}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column">
          <div v-if="tabActive === 1">
            <div class="container" v-for="data in listReferral" :key="data.created">
              <div class="column-1">
                <p class="fullName">
                  <span style="float: left; margin-left: 2px" class="text-semibold"> {{ data.fullName }} </span>
                </p>
                <p class="date" style="margin-left: 12px">&nbsp;{{ data.inviteDate | formatMMDDYY }}</p>

                <!-- <p class="date">{{ data.fromDate.time | formatMMDDYYWithoutHours }} {{ data.toDate.time | formatMMDDYYWithoutHours }}</p> -->
              </div>
              <div class="column-2" align="center">
                <p :class="switchClass(data.status)" style="line-height: 1.9">&nbsp;{{ switchStatus(data.status) }}</p>
                <!-- <p class="progress">{{ ((data.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</p> -->
              </div>
            </div>

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="query.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="query.limit"
              layout="sizes, prev, pager, next"
              background
              :total="listReferral.length"
              class="pagination"
              pager-count="3"
            >
            </el-pagination>
          </div>
          <div class="w" v-if="tabActive === 0">
            <div class="container" v-for="data in responseList" :key="data.created">
              <div class="column-1">
                <div style="display: flex; flex-direction: row">
                  <div class="icon-gift">
                    <base-icon class="gift" icon="menu-gift"></base-icon>
                  </div>
                  <p class="fullName">
                    <span style="float: left" class="text-semibold">{{ data.friendName }} </span>
                    <span class="date">{{ data.transactionDate | formatMMDDYY }}</span>
                  </p>
                </div>
                <!-- <p class="date">{{ data.fromDate.time | formatMMDDYYWithoutHours }} {{ data.toDate.time | formatMMDDYYWithoutHours }}</p> -->
              </div>
              <div class="column-2">
                <p class="price text-semibold">+{{ data.transactionAmount | convertAmountDecimal(data.tokenCurrency) }} {{ data.tokenCurrency }}</p>
                <p class="value">${{ data.transactionAmountToUsd }}</p>
              </div>
            </div>

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="query.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="query.limit"
              layout="sizes, prev, pager, next"
              background
              :total="responseList.length"
              class="pagination"
              :pager-count="3"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { affiliateRepository } from '@/services/repositories/affiliate'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  import CrowdSaleRepository from '@/services/repositories/crowd-sale'
  // import { AuthRepository } from '@/services/repositories/auth'
  const beBase = namespace('beBase')
  const bcAuth = namespace('beAuth')
  const apiAuth = getRepository('auth')
  const apiCrowdSale: CrowdSaleRepository = getRepository('crowd-sale')
  const api = getRepository('affiliate')
  @Component
  export default class AffiliateTableMobile extends Vue {
    @beBase.State('coinMain') coinMain!: string
    @bcAuth.Action('getInfo') getInfo!: () => Promise<any>
    api?: affiliateRepository
    response: Array<Record<string, any>> = []
    responseList: any = []
    listReferral: Record<string, any> = {}
    // listReferral: Array<Record<string, any>> = []
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      transactionType: null,
      total: 0
    }
    userId = ''
    data = {}
    isLoading = false
    totalOfBonus = ''
    friendRfr = ''

    tabs: Array<Record<string, any>> = [
      {
        id: 0,
        title: 'bounus-history'
      },
      {
        id: 1,
        title: 'my-ref'
      }
    ]

    tabActive = 0

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    get getPaginationInfo(): any {
      return this.$t('affiliate.pagint')
    }
    get paginationInfoTree(): any {
      return this.$t('affiliate.pagint-tree')
    }

    mounted(): void {
      EventBus.$on('inputData', payLoad => {
        this.data = payLoad
        this.totalOfBonus = payLoad.totalOfBonus
        this.friendRfr = payLoad.friendRfr
      })
      EventBus.$on('reload-ref', () => {
        if (this.tabActive === 1) {
          this.handleGetMyReferral()
        }
      })
    }
    destroyed(): void {
      EventBus.$off('inputData')
      EventBus.$off('reload-ref')
    }

    async created(): Promise<void> {
      this.api = getRepository('affiliate')
      await this.getUser()
      await this.getData()
    }
    async getUser(): Promise<void> {
      await apiAuth
        ?.getInfo()
        .then((res: any) => {
          this.userId = res.userId
        })
        .catch(e => {
          console.log(e)
        })
    }
    async getData(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          transactionType: 'AFFILIATE',
          userId: this.userId,
          total: null
        }
        const result = await apiCrowdSale.getListTransactionAffiliate(params)
        this.responseList = result.content || []
        this.query.total = result.length || 0
        this.isLoading = false
        // console.log(this.responseList)
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    }

    handleCurrentChange(value: number): void {
      this.query.page = value
      if (this.tabActive === 0) {
        this.getData()
      } else {
        this.handleGetMyReferral()
      }
    }
    handleSizeChange(value: number): void {
      this.query.page = 1
      this.query.limit = value
      if (this.tabActive === 0) {
        this.getData()
      } else {
        this.handleGetMyReferral()
      }
    }

    async handleGetMyReferral(): Promise<void> {
      try {
        const rs = await apiCrowdSale.getMyReferral(this.query)
        this.listReferral = rs.content
        this.query.total = rs.length
        // console.log(this.listReferral)
      } catch (error) {
        console.log(error)
      }
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.tabActive = tab.id
      this.query = {
        page: 1,
        limit: 20,
        total: 0
      }
      if (tab.id === 0) {
        this.getData()
      } else {
        this.handleGetMyReferral()
      }
    }

    rowClassName(params: Record<string, any>): string {
      const { row } = params
      if (row.subs) {
        return 'have-subs'
      }
      return 'no-sub'
    }

    switchStatus(status: string): string {
      switch (status) {
        case 'INVITED':
          return this.$t('affiliate.invited') as string
        case 'SIGNED_UP':
          return this.$t('affiliate.signedup') as string
        default:
          return this.$t('affiliate.crowdsale') as string
      }
    }
    switchClass(status: string): string {
      switch (status) {
        case 'INVITED':
          return 'status-neutral-bg status-neutral status'
        case 'SIGNED_UP':
          return 'status-warning-bg status-warning status'
        default:
          return 'status-success-bg status-success status'
      }
    }
  }
</script>

<style scoped lang="scss">
  .affiliate-table {
    padding: 20px 20px 5.6px 20px;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
    // display: inline-block;

    .container {
      margin: 20px 0 24px 0;
      display: flex;
      flex-direction: row;
    }

    .column-1 {
      // display: flex;
      // flex-direction: column;
      // width: 70%;
      // border-bottom: 1px solid #dbdbdb;

      display: flex;
      flex-direction: column;
      width: 60%;
      // margin: 12px 0;
      border-bottom: 1px solid #dbdbdb;

      .transaction {
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        float: left;
        margin-left: 12px;
        display: flex;
        flex-direction: column;
      }

      .fullName {
        // width: 70%;
        // height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        // float: left;
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        white-space: nowrap;
      }

      .date {
        width: 100%;
        font-size: 12px;
        color: #5b616e;
        line-height: 16px;
        margin: 3.5px 0 18px 0;
      }

      .icon-gift {
        border-radius: 50%;
        background-color: #f3f2f1;
        width: 40px;
        height: 40px;
        position: relative;
        display: flex;
        flex-direction: column;
        .gift {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #46bdff;
        }
      }
    }
    .tab {
      padding: 0px 20px 5.6px 20px !important;
    }

    .column-2 {
      // display: flex;
      // flex-direction: column;
      // margin: 0 0 0 auto;
      // // text-align: right;
      // border-bottom: 1px solid #dbdbdb;
      // width: 50%;

      width: 55%;
      display: flex;
      flex-direction: column;
      // margin: 12px 0;
      text-align: right;
      border-bottom: 1px solid #dbdbdb;
      .status {
        margin: 7px 10px 24px auto;
        align-items: center;
        text-align: center;
      }
      .value {
        font-size: 12px;
        color: #5b616e;
        line-height: 16px;
        margin-top: 4px;
        margin-bottom: 18px;
        text-align: right;
      }

      .price {
        text-align: right;
        color: #129961;
      }
    }

    .affiliate-overview-title {
      font-size: 24px;
      line-height: 32px;
      font-weight: 600;
      color: var(--bc-text-primary);
    }
    .affiliate-overview-k1 {
      display: flex;
      align-items: center;
    }
    .affiliate-overview-k1-right-title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      color: var(--bc-text-primary);
    }
    .affiliate-overview-k1-left {
      margin-right: 16px;
    }
    .affiliate-overview-k1-right-count {
      font-size: 24px;
      line-height: 28px;
      font-weight: 600;
      color: var(--bc-text-primary);
    }
    .sack-affiliate-overview-k1 {
      display: flex;
    }

    .mr80 {
      margin-right: 80px;
    }
    .mt24 {
      margin-top: 24px;
    }
    .affiliate-overview {
      border-bottom: 1px solid #d2d0ce;
      padding-bottom: 24px;
    }
    .affiliatehistory {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 12px 12px 6px 12px;
            position: relative;
            color: var(-bc-text-color-tab-item) !important;
            &:hover {
              color: var(--bc-tab-active);
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
              background-color: var(--bc-tab-active);
            }
          }
        }
      }
    }
    .status {
      display: inline-block;
      width: 80px;
      height: 24px;
      text-align: center;
      border-radius: 4px;
      font-size: 12px;
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
    margin-left: auto;
    width: fit-content;
    .el-pagination__sizes {
      margin-right: auto;
      .el-select--mini {
        .el-input--suffix {
          width: 49.95px;
        }
      }
    }
    .el-pager {
      .active {
        background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
      }
    }
  }
</style>
