<template>
  <div class="mobile-activity">
    <div class="list-activity">
      <el-collapse v-for="item in dataActivities" :key="item.id" accordion>
        <el-collapse-item class="item">
          <template slot="title">
            <div class="title">
              <span class="avatar"><img class="item-img" :src="item.itemAvatar" alt="" /></span>
              <div class="info-title">
                <span class="item-type header-6 text-bold color-primary">{{ item.transactionType | convertTextUppercase }}</span>
                <span class="time body-small color-primary">{{ item.transactionDate | formatMMDDYY }}</span>
              </div>
            </div>
          </template>
          <div class="collapse">
            <div class="collapse-detail">
              <span class="body-small">Item</span>
              <span class="item-name body-small" @click="redirectViewNft(item.itemId)">{{ item.itemName | formatTransactionCode(10, 10) }}</span>
            </div>
            <div class="collapse-detail">
              <span class="body-small">From</span>
              <span class="from-name" @click="handleViewProfileUser(item.fromId)">{{ item.fromName }}</span>
            </div>
            <div class="collapse-detail">
              <span class="body-small">To</span>
              <span class="body-small to-name" @click="handleViewProfileUser(item.toId)">{{ item.toName }}</span>
            </div>
            <div class="collapse-detail">
              <span class="body-small">Price</span>
              <span class="body-small">{{ item.price | convertAmountDecimal(item.currency) }} {{ item.currency }}</span>
            </div>
            <div class="collapse-detail">
              <span class="body-small">Quantity</span>
              <span class="body-small">{{ item.quantity | formatNumber }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div v-if="this.dataActivities.length < this.query.total" class="btn-more">
      <el-button @click="handleLoadMore" class="el-button nft-header6 text-semibold text-center bid el-button-custom el-button--default">Load more</el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class CollectionActivityMobile extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @Prop() filter!: any
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
    //   collectionId: this.$route.params.id,
    //   lastTime: 'LAST_24_HOURS'
    // }
    // categories: Array<Record<string, any>> = []
    // responeList: Array<Record<string, any>> = []
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
    // created(): void {
    //   this.getListActivity()
    //   EventBus.$on('emitFilterCollection', this.handleFilterSelect)
    //   EventBus.$on('emitFilterPrice', this.handleFilterPrice)
    //   EventBus.$on('emitFilterTime', this.handleFilterTime)
    // }

    // destroyed(): void {
    //   EventBus.$off('emitFilterCollection')
    //   EventBus.$off('emitFilterPrice')
    //   EventBus.$off('emitFilterTime')
    // }
    // handleFilterTime({ fromDate, toDate }: Record<string, any>): void {
    //   const params = { fromDate, toDate }
    //   this.filter = {
    //     ...this.filter,
    //     ...params
    //   }
    //   this.query = { ...this.query, page: 1, limit: 10 }
    //   this.getListActivity()
    // }

    // handleFilterSelect(value: string): void {
    //   console.log('aa', value)
    //   const a = {
    //     transactionType: value
    //   }
    //   this.filter = {
    //     ...this.filter,
    //     ...a
    //   }
    //   this.query = { ...this.query, page: 1, limit: 10 }
    //   this.getListActivity()
    // }

    handleLoadMore(val: number): void {
      this.$emit('loadmore', val)
      console.log('vall', val)
    }

    handleViewProfileUser(id: string): void {
      this.$router.push({ name: 'UserProfile', params: { id: id } })
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
      this.query.total = result.totalElements
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

    handleClickOpenTab(currency: string, address: string): void {
      const path = currency === 'BNB' || currency === 'BUSD' ? process.env.VUE_APP_URL_SCAN_TX_BNB : process.env.VUE_APP_URL_SCAN_TX_ETH
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
  ::v-deep.mobile-activity {
    .list-activity {
      margin-bottom: 24px;
    }
    .btn-more {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40px;
      .el-button {
        width: 89% !important;
        height: 48px;
      }
    }
    .el-collapse:first-child {
      border-top: none;
    }
    .el-collapse-item__content {
      padding-bottom: 16px;
    }
    .el-collapse-item__header:last-child {
      border-bottom: none;
    }
    .el-collapse-item__header {
      height: 72px;
      padding: 0 20px;
    }
    .item {
      .collapse {
        .collapse-detail:first-child {
          border-top: 1px solid #dbdbdb;
          padding-top: 16px;
        }
        .collapse-detail {
          padding: 12px 20px 0 20px;
          color: #0a0b0d;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .from-name {
            color: #2e89ff;
          }
          .to-name {
            color: #2e89ff;
          }
        }
      }
      .title {
        display: flex;
        flex-direction: row;
        .info-title {
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          margin-top: 20px;
        }
        .avatar {
          .item-img {
            // margin-left: 20px;
            margin-top: 20px;
            width: 40px;
            border-radius: 50%;
            height: 40px;
            object-fit: cover;
          }
        }
      }
    }
  }
</style>
