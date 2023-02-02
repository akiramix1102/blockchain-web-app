<template>
  <div class="activities" id="activities">
    <FilterActivitiesMyProfile :tabActive="tabActive" :responeList="responeList" :query="query" class="mb-60" @filter="handleFilter" />
    <div
      :data="responeList"
      :table="query"
      :showPagination="true"
      :paginationInfo="paginationInfo"
      class="base-table table-wallet"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
    >
      <el-table-column width="300">
        <template v-slot:header>
          <div class="nft-header6 text-discrip3">{{ $t('collection.activities-collection.item') }}</div>
        </template>
        <template slot-scope="scope">
          <div class="item_content">
            <span class="color-primary item"> <img class="item_img" :src="scope.row.itemAvatar" alt="" /></span>
            <span class="color-primary text-overflow-1 name"> {{ scope.row.itemName }}</span>
          </div>
          <!-- <span class="d-block amount-exchange-small">~${{ (scope.row.price * scope.row.price) | convertAmountDecimal('USD') }}</span> -->
        </template>
      </el-table-column>
      <el-table-column class="text-hyperlink" width="120" :label="$t('collection.activities-collection.event-type')">
        <template slot-scope="scope">
          <div>
            <span class="text-cap">{{ scope.row.transactionType | convertTextUppercase }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column class="text-hyperlink" width="138" :label="$t('collection.activities-collection.from')">
        <template slot-scope="scope">
          <div class="text-hyperlink text-overflow-1" @click="handleViewProfileUser(scope.row.fromId)">
            <span v-if="scope.row.fromName">
              <span v-if="scope.row.fromName.length > 20">{{ scope.row.fromName | formatTransactionCode(5, 5) }}</span>
              <span v-else>{{ scope.row.fromName }}</span>
            </span>
            <span v-else> {{ scope.row.fromAddress | formatTransactionCode(5, 5) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column class="text-hyperlink" width="138" :label="$t('collection.activities-collection.to')">
        <template slot-scope="scope">
          <div class="text-hyperlink text-overflow-1" @click="handleViewProfileUser(scope.row.toId)">
            <span v-if="scope.row.toName">
              <span v-if="scope.row.toName.length > 20">{{ scope.row.toName | formatTransactionCode(5, 5) }}</span>
              <span v-else>{{ scope.row.toName }}</span>
            </span>
            <span v-else> {{ scope.row.toAddress | formatTransactionCode(5, 5) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="right" width="150">
        <template v-slot:header>
          <div class="be-flex align-center jc-flex-end cursor">
            <span class="nft-header6 text-discrip3">{{ $t('collection.activities-collection.price') }}</span>
          </div>
        </template>
        <template slot-scope="scope">
          <span class="">{{ scope.row.price | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }} </span>
          <span class="d-block amount-exchange-small">~${{ (scope.row.price * scope.row.usdExchangeRate) | convertAmountDecimal('USD') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" width="130">
        <template v-slot:header>
          <div class="be-flex align-center jc-flex-end cursor">
            <span class="nft-header6 text-discrip3">{{ $t('collection.activities-collection.quantity') }}</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="nft-body-base color-primary">{{ scope.row.quantity | formatNumber }}</div>
        </template>
      </el-table-column>

      <el-table-column align="right" width="220" :label="$t('collection.activities-collection.date')">
        <template slot-scope="scope">
          <div class="be-flex align-center jc-flex-end">
            <div>{{ scope.row.transactionDate | formatMMDDYY }}</div>
            <div v-if="scope.row.isOnchain === 'YES' && scope.row.status === 'SUCCESS'" @click="handleClickOpenTab(scope.row.transactionCode)">
              <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px" />
            </div>
            <div v-else>
              <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px; visibility: hidden" />
            </div>
          </div>
        </template>
      </el-table-column>
      hihih
    </div>
    <div style="width: 100%">
      <button class="load_more cursor">Load more</button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import FilterActivitiesMyProfile from '../myprofile/FilterActivitiesMyProfile.vue'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  import filter from 'lodash/filter'
  import { namespace } from 'vuex-class'

  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  @Component({ components: { FilterActivitiesMyProfile } })
  export default class ActivitieCollection extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) })
    dataMyprofile!: Record<string, any>
    @Prop() tabActive!: any
    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @beBase.State('coinMain') coinMain!: string

    dataActivities: Record<string, any> = {}

    filter: Record<string, any> = {
      accountId: this.$route.params.id
    }

    query: any = {
      transactionType: '',
      fromPrice: '',
      toPrice: '',
      currency: '',
      page: 1,
      limit: 10,
      total: '',
      orderBy: 'CREATED_AT_DESC'
    }
    // categories: Array<Record<string, any>> = []
    responeList: Array<Record<string, any>> = []
    arrTab: Array<Record<string, any>> = [
      {
        title: this.$t('detail-nft.tab.activi')
      },
      {
        title: this.$t('detail-nft.tab.bids')
      },
      {
        title: this.$t('detail-nft.tab.stats')
      }
    ]

    // number = 10
    idNft = ''
    accountId = 0
    @Watch('this.accountId') async handleChangeId(accountId: string): Promise<void> {
      const params = {
        ...this.query,
        ...this.filter
      }
      this.dataActivities = {}
      this.dataActivities = await apiNft.getListActivityProfileNft(this.accountId, params)
    }
    async created(): Promise<void> {
      this.accountId = this.dataMyprofile.id
      this.getListActivityProfileNft(this.accountId)

      EventBus.$on('emitFilterCollection', this.handleFilterSelect)
      EventBus.$on('emitFilterPrice', this.handleFilterPrice)
      console.log('accountID', this.accountId)
    }
    handleViewProfileUser(id: string): void {
      this.$router.push({ name: 'UserProfile', params: { id: id } })
      location.reload()
    }

    // checkTransactionType(type: string): any {
    //   switch (type) {
    //     case 'CANCEL_BID':
    //       return this.$i18n.t('wallet.table.cancel-bid')
    //   }
    // }
    async getListActivityProfileNft(accountId: number): Promise<void> {
      const params = {
        ...this.query,
        ...this.filter
      }

      const result = await apiNft.getListActivityProfileNft(this.accountId, params)
      this.responeList = result?.content
      this.query.total = result.totalElements
      console.log('responelist', result)
    }
    get paginationInfo(): string {
      return this.$t('paging.activities') as string
    }

    handleFilter(filter: Record<string, any>): void {
      // ở đây dùng categoryIds, ở comp filter dùng categoryId
      let categoryIds = ''
      // if (filter.categoryId && filter.categoryId !== +this.$route.params.id && this.$route.params.id !== 'all') {
      //   categoryIds = `${this.$route.params.id},${filter.categoryId}`

      // } else {
      //   categoryIds = filter.categoryId
      // }
      console.log('jdfdf', filter)
      this.query = { ...this.query, ...filter }
      this.getListActivityProfileNft(this.filter.accountId)
    }

    handleFilterSelect(value: string): void {
      console.log('aa', value)
      const a = {
        transactionType: value
      }
      this.filter = {
        ...this.filter,
        ...a
      }
      this.getListActivityProfileNft(this.filter.accountId)
    }
    handleFilterPrice(value: any): void {
      console.log('value```', value)

      const objPrice = {
        orderBy: value.orderBy,
        fromPrice: value.fromPrice,
        toPrice: value.toPrice
      }
      this.filter = {
        ...this.filter,
        ...objPrice
      }
      this.getListActivityProfileNft(this.filter.accountId)
    }
    handleSizeChange(value: number): void {
      console.log('sizechage', value)
      this.query.limit = value
      this.query.page = 1
      this.getListActivityProfileNft(this.filter.accountId)
    }
    handleCurrentChange(page: number): void {
      console.log('page', page)
      this.query.page = page
      this.getListActivityProfileNft(this.filter.accountId)
    }
    getTitleTransType(type: string): any {
      switch (type) {
        case 'USE_PENDING':
          return (type = 'Request to use')
        case 'USE_CANCELLED':
          return (type = 'Cancel request')
        case 'USE_COMPLETED':
          return (type = 'Used')
        case 'CANCEL_BID':
          return this.$i18n.t('wallet.table.cancel-bid')
        case 'CANCEL_OFFER':
          return this.$i18n.t('wallet.table.cancel-offer')
        default:
          if (type) {
            type = type.split('_').join(' ').toLowerCase()
            return type.charAt(0).toUpperCase() + type.slice(1)
          }
          return ''
      }
    }
    handleClickOpenTab(address: string): void {
      window.open(`${process.env.VUE_APP_URL_SCAN_ADDRESS_ETH}${address}`, '_blank')
    }
  }
</script>

<style lang="scss" scoped>
  .color_hyperlink {
    color: #0151fc;
  }
  #activities {
    margin-top: 40px;

    .el-table__body-wrapper {
      .el-table__row {
        cursor: none;
        td {
          .cell {
            color: var(--bc-text-market-primary-nft);
            .span {
              text-transform: capitalize;
            }
            .item_content {
              display: flex;
              align-items: center;
              .color-primary {
              }
              .item {
                width: 48px;
                height: 48px;
                margin-right: 8px;
                .item_img {
                  width: 48px;
                  border-radius: 4px;
                  height: 48px;
                  object-fit: cover;
                }
              }
            }
            .content {
              color: var(--bc-text-market-primary-nft);
            }
          }
          .hyperlink {
            color: #0151fc;
          }
        }
      }
    }
    .base-pagination {
      padding: 20px 0 40px;
      .info {
        color: var(--bc-text-discript);
      }
    }
  }
</style>
