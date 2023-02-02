<template>
  <div class="table">
    <base-table :data="listActivity" :showEmpty="false" :showPagination="false" class="base-table table-wallet">
      <el-table-column :width="selectLanguage() === 'ru' ? 260 : 300">
        <template v-slot:header>
          <div class="nft-header6 text-discrip3">{{ $t('collection.activities-collection.item') }}</div>
        </template>
        <template slot-scope="scope">
          <div class="item_content cursor" @click="redirectViewNft(scope.row.itemId)">
            <span class="color-primary item"> <img class="item_img" :src="scope.row.itemAvatar" alt="" /></span>
            <span class="color-primary text-overflow-1 name"> {{ scope.row.itemName }}</span>
          </div>
          <!-- <span class="d-block amount-exchange-small">~${{ (scope.row.price * scope.row.price) | convertAmountDecimal('USD') }}</span> -->
        </template>
      </el-table-column>
      <el-table-column width="170">
        <template v-slot:header>
          <div class="nft-header6 text-discrip3">{{ $t('detail-nft.table.event-type') }}</div>
        </template>
        <template slot-scope="scope">
          <div class="be-flex align-center info">
            <div class="content">
              <div class="nft-header6 text-regular">{{ scope.row.transactionType | convertTextUppercase }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="left">
        <template v-slot:header>
          <div class="be-flex align-center jc-flex-start">
            <span class="nft-header6">{{ $t('detail-nft.table.from') }}</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div v-if="scope.row.fromId" class="be-flex align-center">
            <div class="nft-body-base text-hyperlink cursor text-overflow-1 click" @click="handleViewProfileUser(scope.row.fromId)">
              <span v-if="scope.row.fromName">
                <span v-if="scope.row.fromName.length > 20">{{ scope.row.fromName | formatTransactionCode(5, 5) }}</span>
                <span v-else>{{ scope.row.fromName }}</span>
              </span>
              <span v-else> {{ scope.row.fromAddress | formatTransactionCode(5, 5) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left">
        <template v-slot:header>
          <div class="be-flex align-center jc-flex-start">
            <span class="nft-header6">{{ $t('detail-nft.table.to') }}</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div v-if="scope.row.toId" class="be-flex align-center">
            <div class="nft-body-base text-hyperlink cursor text-overflow-1 click" @click="handleViewProfileUser(scope.row.toId)">
              <span v-if="scope.row.toName">
                <span v-if="scope.row.toName.length > 20">{{ scope.row.toName | formatTransactionCode(5, 5) }}</span>
                <span v-else>{{ scope.row.toName }}</span>
              </span>
              <span v-else> {{ scope.row.toAddress | formatTransactionCode(5, 5) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" width="180">
        <template v-slot:header>
          <div class="be-flex align-center jc-flex-end">
            <span class="nft-header6">{{ $t('detail-nft.table.price') }}</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="nft-body-base text-regular">{{ scope.row.price | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</div>
          <div class="nft-body-base-small text-regular text-desc">~${{ (scope.row.price * scope.row.usdExchangeRate) | convertAmountDecimal('USD') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" :width="selectLanguage() === 'ru' ? 130 : 110">
        <template v-slot:header>
          <div class="be-flex align-center jc-flex-end">
            <span class="nft-header6 text-discrip3">{{ $t('detail-nft.table.quantity') }}</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="nft-body-base color-primary" style="text-align: right">{{ scope.row.quantity | formatNumber }}</div>
        </template>
      </el-table-column>

      <el-table-column align="right" width="150" class-name="date">
        <template v-slot:header>
          <span class="nft-header6 text-discrip3">{{ $t('detail-nft.table.date') }}</span>
        </template>
        <template slot-scope="scope">
          <div class="be-flex align-start jc-flex-end">
            <div>
              <p>{{ new Date(scope.row.transactionDate).toLocaleDateString('en-EN') }}</p>
              <p class="text-body-small text-regular text-desc">{{ new Date(scope.row.transactionDate).toLocaleTimeString('en-EN', { hour12: false }) }}</p>
            </div>
            <div v-if="scope.row.isOnchain === 'YES' && scope.row.status === 'SUCCESS'" @click="handleClickOpenTab(scope.row.network, scope.row.transactionCode)">
              <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px" />
            </div>
            <span v-else> <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px; visibility: hidden" /></span>
          </div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class TableActivities extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) listActivity!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
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

    handleClickOpenTab(network: string, address: string): void {
      const path = network === 'BEP20' ? process.env.VUE_APP_URL_SCAN_TX_BNB : process.env.VUE_APP_URL_SCAN_TX_ETH
      window.open(`${path}${address}`, '_blank')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.table {
    margin-top: 40px;
    .el-table__header-wrapper {
      .el-table__header {
        .date {
          padding-right: 30px;
        }
      }
    }
    .el-table__body-wrapper {
      .el-table__row {
        cursor: initial;
        td {
          .cell {
            color: var(--bc-text-market-primary-nft);
            .content {
              color: var(--bc-text-market-primary-nft);
            }
          }
          .avatar {
            position: relative;
            margin-right: 8px;
            height: 36px;
            width: 36px;
            border-radius: 50%;
            img {
              width: 36px;
              height: 36px;
              border-radius: 100% !important;
              display: block;
              object-fit: cover;
            }
            .new-circle {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #129961;
              border: 1px solid #ffffff;
              position: absolute;
              right: 2px;
              top: 0px;
            }
            .item-verifed {
              position: absolute;
              bottom: 0;
              right: 0;
              height: 16px;
            }
            .wrap-media {
              .empty {
                border-radius: 50% !important;
              }
            }
          }
          .text-cap {
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
        }
      }
    }
  }
</style>
