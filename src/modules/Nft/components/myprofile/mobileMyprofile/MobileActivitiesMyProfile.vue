<template>
  <div class="activities" id="activities">
    <div class="container-nft">
      <el-collapse accordion style="border-top: none">
        <el-collapse-item v-for="item in listActivity" :key="item">
          <!-- <template slot="title">
            <div class="activities_item">
              <img class="item_img" src="https://th.bing.com/th/id/OIP.y3a4BmGMnh-Pc2NjSFb43QHaGF?pid=ImgDet&rs=1" alt="" />
              <div>
                <div>
                  <span class="nft-header6">
                    {{ item.transactionType }}
                  </span>
                  <div class="info-title">
                    <span class="item-type header-6 text-bold color-primary">{{ item.transactionType }}</span>
                    <span class="time body-small color-primary">{{ item.transactionDate | formatMMDDYY }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template> -->
          <template slot="title">
            <div class="title">
              <span class="avatar"><img class="item-img" :src="item.itemAvatar" alt="" /></span>
              <div class="info-title">
                <span class="item-type header-6 text-bold color-primary">{{ item.transactionType | convertTextUppercase }}</span>
                <span class="time text-body-small color-primary">{{ item.transactionDate | formatMMDDYY }}</span>
              </div>
            </div>
          </template>
          <div class="be-flex jc-space-between mt-16" @click="redirectViewNft(item.itemId)">
            <div class="nft-body-small">{{ $t('collection.activities-collection.item') }}</div>
            <div class="nft-body-base-small text-over" style="">
              {{ item.itemName }}
            </div>
          </div>
          <div class="be-flex jc-space-between mt-12">
            <span class="nft-body-small">{{ $t('detail-nft.table.from') }}</span>
            <div class="nft-body-base-small text-hyperlink cursor text-overflow-1 click" @click="handleViewProfileUser(item.fromId)">
              <span v-if="item.fromName">
                <span v-if="item.fromName.length > 20">{{ item.fromName | formatTransactionCode(5, 5) }}</span>
                <span v-else>{{ item.fromName }}</span>
              </span>
              <span v-else> {{ item.fromAddress | formatTransactionCode(5, 5) }}</span>
            </div>
          </div>
          <div class="be-flex jc-space-between mt-12">
            <span class="nft-body-small">{{ $t('detail-nft.table.to') }}</span>
            <div class="nft-body-base-small text-hyperlink cursor text-overflow-1 click" @click="handleViewProfileUser(item.toId)">
              <span v-if="item.toName">
                <span v-if="item.toName.length > 20">{{ item.toName | formatTransactionCode(5, 5) }}</span>
                <span v-else>{{ item.toName }}</span>
              </span>
              <span v-else> {{ item.toAddress | formatTransactionCode(5, 5) }}</span>
            </div>
          </div>
          <div class="be-flex jc-space-between mt-12">
            <span class="nft-body-small">{{ $t('detail-nft.table.price') }}</span>
            <div>
              <div class="nft-body-base-small text-regular">{{ item.price | convertAmountDecimal(item.currency) }} {{ item.currency }}</div>
              <!-- <div class="nft-body-base-small-small text-regular text-desc">~${{ (item.price * item.usdExchangeRate) | convertAmountDecimal('USD') }}</div> -->
            </div>
          </div>
          <div class="be-flex jc-space-between mt-12">
            <span class="nft-body-small">{{ $t('detail-nft.table.quantity') }}</span>
            <div class="click">
              <div class="nft-body-base-small color-primary" style="text-align: right">{{ item.quantity | formatNumber }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="loadmore" style="width: 100%">
        <button @click="handleLoadMore" class="load_more cursor">Load more</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class TableActivities extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) }) listActivity!: Record<string, any>

    //@Prop({ required: false, type: Array, default: () => [] }) listActivity!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    loadmore = true
    handleLoadMore(val: number): void {
      if (this.listActivity.length === this.query.total) {
        this.loadmore = false
      }
      this.$emit('loadmore', val)
    }
    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    getTitleTransType(type: string): string {
      switch (type) {
        case 'USE_PENDING':
          return (type = 'Request to use')
        case 'USE_CANCELLED':
          return (type = 'Cancel request')
        case 'USE_COMPLETED':
          return (type = 'Used')
        default:
          if (type) {
            type = type.split('_').join(' ').toLowerCase()
            return type.charAt(0).toUpperCase() + type.slice(1)
          }
          return ''
      }
    }

    handleViewProfileUser(id: string): void {
      this.$router.push({ name: 'UserProfile', params: { id } }).catch(() => {
        return
      })
    }
    redirectViewNft(id: string): void {
      apiNft.getDetailNftItem(id).then(() => {
        this.$router.push({ name: 'DetailNftItem', params: { id } }).catch(() => {
          return
        })
      })
      // .catch(error => {
      //   const { data } = error.response
      //   if (data.status === 'ITEM_INACTIVE') {
      //     const message = this.$t('notify.item-not-exist') as string
      //     this.$message.error({ message })
      //   }
      //   if (data.status === 'ITEM_IS_NOT_EXIST') {
      //     const message = this.$t('notify.item-not-exist') as string
      //     this.$message.error({ message })
      //   }
      // })
    }

    handleClickOpenTab(currency: string, address: string): void {
      const path = currency === 'BNB' || currency === 'BUSD' ? process.env.VUE_APP_URL_SCAN_TX_BNB : process.env.VUE_APP_URL_SCAN_TX_ETH
      window.open(`${path}${address}`, '_blank')
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.activities {
    .text-over {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 198px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .el-collapse-item__content {
      color: #0a0b0d;
      padding-bottom: 16px;
      border-top: 1px solid #dbdbdb;
    }
    .el-collapse-item__header {
      height: 74px;
      color: #0a0b0d;
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
          margin-top: 20px;
          width: 40px;
          border-radius: 50%;
          height: 40px;
          object-fit: cover;
        }
      }
    }
  }
</style>
