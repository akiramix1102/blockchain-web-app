<template>
  <div>
    <div class="activities" id="activities">
      <base-table
        :data="responeList"
        :table="query"
        :showPagination="true"
        :paginationInfo="paginationInfo"
        class="base-table table-wallet"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      >
        <el-table-column :width="selectLanguage() === 'ru' || selectLanguage() === 'jp' ? 280 : 300">
          <template v-slot:header>
            <div class="nft-header6 text-discrip3">{{ $t('collection.activities-collection.item') }}</div>
          </template>
          <template slot-scope="scope">
            <div class="item_content" @click="redirectViewNft(scope.row.itemId)">
              <span class="color-primary item"> <img class="item_img" :src="scope.row.itemAvatar" alt="" /></span>
              <span class="color-primary text-overflow-1 name"> {{ scope.row.itemName }}</span>
            </div>
            <!-- <span class="d-block amount-exchange-small">~${{ (scope.row.price * scope.row.price) | convertAmountDecimal('USD') }}</span> -->
          </template>
        </el-table-column>
        <el-table-column class="text-hyperlink" width="170" :label="$t('collection.activities-collection.event-type')">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.transactionType | convertTextUppercase }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column class="text-hyperlink" width="138" :label="$t('collection.activities-collection.from')">
          <template slot-scope="scope">
            <div class="text-hyperlink text-overflow-1" @click="handleViewProfileUser(scope.row.fromId)">
              <!-- <span class="text-hyperlink text-overflow-1" v-if="scope.row.fromName">{{ scope.row.fromName }}</span>
            <span class="text-hyperlink" v-else>{{ scope.row.fromAddress | formatTransactionCode(5, 5) }}</span> -->
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
              <!-- <span class="text-hyperlink text-overflow-1" v-if="scope.row.toName">{{ scope.row.toName }}</span>
            <span class="text-hyperlink" v-else>{{ scope.row.toAddress | formatTransactionCode(5, 5) }}</span> -->
              <span v-if="scope.row.toName">
                <span v-if="scope.row.toName.length > 20">{{ scope.row.toName | formatTransactionCode(5, 5) }}</span>
                <span v-else>{{ scope.row.toName }}</span>
              </span>
              <span v-else> {{ scope.row.toAddress | formatTransactionCode(5, 5) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="right" width="170">
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

        <el-table-column align="right" width="150" :label="$t('collection.activities-collection.date')" class-name="date">
          <template slot-scope="scope">
            <div class="be-flex align-start jc-flex-end">
              <div>
                <p>{{ new Date(scope.row.transactionDate).toLocaleDateString('en-EN') }}</p>
                <p class="text-body-small text-regular text-desc">{{ new Date(scope.row.transactionDate).toLocaleTimeString('en-EN', { hour12: false }) }}</p>
              </div>
              <div v-if="scope.row.isOnchain === 'YES' && scope.row.status === 'SUCCESS'" @click="handleClickOpenTab(scope.row.network, scope.row.transactionCode)">
                <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px" />
              </div>
              <div v-else><base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px; visibility: hidden" /></div>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  const apiNft: NftRepository = getRepository('nft')
  const bcNft = namespace('bcNft')
  @Component({ components: {} })
  export default class ActivitieCollection extends Vue {
    // @bcNft.State('isDesktop') isDesktop!: boolean

    @Prop() filter!: any
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @Prop({
      required: false,
      type: Object,
      default: () => ({})
    })
    @Prop({ required: true, type: Array, default: () => ({}) })
    dataActivities!: Record<string, any>

    // filter: Record<string, any> = {
    //   collectionId: this.$route.params.id,
    //   lastTime: 'LAST_24_HOURS'
    // }
    // filter: Record<string, any> = {

    //   lastTime: 'LAST_24_HOURS'
    // }
    // query: Record<string, any> = {
    //   page: 1,
    //   limit: 10,
    //   total: 0
    // }
    categories: Array<Record<string, any>> = []
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
    created(): void {
      this.getListActivity()
      console.log('filter', this.filter)
      EventBus.$on('emitFilterCollection', this.handleFilterSelect)
      EventBus.$on('emitFilterPrice', this.handleFilterPrice)
      EventBus.$on('emitFilterTime', this.handleFilterTime)
    }

    destroyed(): void {
      EventBus.$off('emitFilterCollection')
      EventBus.$off('emitFilterPrice')
      EventBus.$off('emitFilterTime')
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
    handleViewProfileUser(id: string): void {
      this.$router.push({ name: 'UserProfile', params: { id: id } })
    }
    handleFilterTime({ fromDate, toDate }: Record<string, any>): void {
      const params = { fromDate, toDate }
      this.filter = {
        ...this.filter,
        ...params
      }
      this.query = { ...this.query, page: 1, limit: 10 }
      this.getListActivity()
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
      this.query = { ...this.query, ...this.filter, page: 1, limit: 10, fromPrice: this.filter.fromPrice !== '0' && this.filter.fromPrice ? this.filter.fromPrice : null }

      this.getListActivity()
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
      this.query = { ...this.query, page: 1, limit: 10 }
      this.getListActivity()
    }

    async getListActivity(): Promise<void> {
      console.log('quey', this.query)
      const params = {
        ...this.query,
        ...this.filter
      }
      console.log('params', params)

      const result = await apiNft.getListActivity(params)
      this.responeList = result.content || []
      this.query.total = result.totalElements
      console.log('result', this.query)
    }
    get paginationInfo(): string {
      return this.$t('paging.activities') as string
    }

    handleSizeChange(value: number): void {
      console.log('sizechNGW', value)
      this.query.limit = value
      this.query.page = 1
      this.getListActivity()
    }
    handleCurrentChange(page: number): void {
      this.query.page = page
      this.getListActivity()
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

    handleClickOpenTab(network: string, address: string): void {
      const path = network === 'BEP20' ? process.env.VUE_APP_URL_SCAN_TX_BNB : process.env.VUE_APP_URL_SCAN_TX_ETH
      window.open(`${path}${address}`, '_blank')
    }

    redirectViewNft(id: string): void {
      apiNft.getDetailNftItem(id).then(() => {
        this.$router.push({ name: 'DetailNftItem', params: { id } }).catch(() => {
          return
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
  .color_hyperlink {
    color: #0151fc;
  }
  ::v-deep#activities {
    margin-top: 40px;

    .el-table__header-wrapper {
      .el-table__header {
        .date {
          padding-right: 32px;
        }
      }
    }

    .el-table__body-wrapper {
      .el-table__row {
        td {
          .cell {
            color: var(--bc-text-market-primary-nft);
            .span {
              text-transform: capitalize;
            }
            .item_content {
              display: flex;
              align-items: center;
              .name {
                flex: 1;
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
