<template>
  <div class="content-detail">
    <div class="isPc">
      <FilterDetailNFT @filter="handleFilter" :query="query" :changeTabAcitve="changeTabAcitve" :nftItem="nftItem" />
      <div class="table">
        <base-table
          :data="listActivity"
          :table="query"
          :paginationInfo="getPaginationInfo"
          class="base-table table-wallet"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        >
          <el-table-column width="190">
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
                <div class="avatar click" @click="handleViewProfileUser(scope.row.fromId)">
                  <bc-media v-if="scope.row.fromAvatar" :url="scope.row.fromAvatar" :radius="100" :size="12" />
                  <base-icon v-else icon="default-avatar" size="36" style="display: inline-flex" />
                  <div v-if="scope.row.fromIsNew === 'YES'" class="new-circle"></div>
                  <div v-if="scope.row.fromIsVerified === 'YES'" class="item-verifed">
                    <base-icon icon="icon-verified" size="12" class="d-iflex" />
                  </div>
                </div>
                <div class="nft-body-base text-hyperlink click" @click="handleViewProfileUser(scope.row.fromId)">
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
                <div class="avatar click" @click="handleViewProfileUser(scope.row.toId)">
                  <bc-media v-if="scope.row.toAvatar" :url="scope.row.toAvatar" :radius="100" :size="12" />
                  <base-icon v-else icon="default-avatar" size="36" style="display: inline-flex" />
                  <div v-if="scope.row.toIsNew === 'YES'" class="new-circle"></div>
                  <div v-if="scope.row.toIsVerified === 'YES'" class="item-verifed">
                    <base-icon icon="icon-verified" size="12" class="d-iflex" />
                  </div>
                </div>
                <div class="nft-body-base text-hyperlink click" @click="handleViewProfileUser(scope.row.toId)">
                  <span v-if="scope.row.toName">
                    <span v-if="scope.row.toName.length > 20">{{ scope.row.toName | formatTransactionCode(5, 5) }}</span>
                    <span v-else>{{ scope.row.toName }}</span>
                  </span>
                  <span v-else> {{ scope.row.toAddress | formatTransactionCode(5, 5) }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" :width="selectLanguage() === 'ru' ? 180 : 200">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end">
                <span class="nft-header6">{{ $t('detail-nft.table.price') }}</span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base text-regular">{{ scope.row.price | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</div>
              <div class="nft-body-base-small text-regular text-desc">~${{ (scope.row.price * scope.row.usdExchangeRate) | convertAmountDecimal(scope.row.currency) }}</div>
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

          <el-table-column align="right" width="220" class-name="date">
            <template v-slot:header>
              <span class="nft-header6 text-discrip3">{{ $t('detail-nft.table.date') }}</span>
            </template>
            <template slot-scope="scope">
              <div class="be-flex align-center jc-flex-end">
                <div class="nft-body-base text-regular">{{ scope.row.transactionDate | formatMMDDYY }}</div>
                <span v-if="scope.row.isOnchain === 'YES' && scope.row.status === 'SUCCESS'" @click="handleClickOpenTab(scope.row.transactionCode, scope.row.network)">
                  <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px"
                /></span>
                <span v-else> <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px; visibility: hidden" /></span>
              </div>
            </template>
          </el-table-column>
        </base-table>
      </div>
    </div>
    <div class="isMobile">
      <div class="filter-detail-nft-mobile">
        <FilterDEtailNFTMobile @filter="handleFilter" :query="query" :changeTabAcitve="changeTabAcitve" :nftItem="nftItem" />
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item :name="index" v-for="(item, index) in listActivity.slice(0, this.length)" :key="index">
          <template slot="title">
            <div class="be-flex align-center">
              <div class="avatar click" @click="handleViewProfileUser(item.fromId)">
                <bc-media v-if="item.fromAvatar" :url="item.fromAvatar" :radius="100" :size="12" />
                <base-icon v-else icon="default-avatar" size="40" style="display: inline-flex" />
                <div v-if="item.fromIsNew === 'YES'" class="new-circle"></div>
                <div v-if="item.fromIsVerified === 'YES'" class="item-verifed">
                  <base-icon icon="icon-verified" size="12" class="d-iflex" />
                </div>
              </div>
              <div class="flex-column">
                <div class="nft-body-base color-primary">{{ item.transactionType | convertTextUppercase }}</div>
                <div class="be-flex align-center" style="line-height: 1px">
                  <div class="text-body-small text-regular">{{ item.transactionDate | formatMMDDYY }}</div>
                  <span v-if="item.isOnchain === 'YES' && item.status === 'SUCCESS'" @click="handleClickOpenTab(item.transactionCode, item.network)">
                    <base-icon class="cursor" icon="icon-open-tab" size="21" style="padding-left: 5px"
                  /></span>
                  <!-- <span v-else> <base-icon class="cursor" icon="icon-open-tab" size="28" style="padding-left: 5px; visibility: hidden" /></span> -->
                </div>
              </div>
            </div>
          </template>
          <div class="content-detail-acti">
            <div class="be-flex jc-space-between">
              <p class="text-body-small text-regular color-primary">{{ $t('detail-nft.table.from') }}</p>
              <div class="text-body-small text-regular text-hyperlink click" @click="handleViewProfileUser(item.fromId)">
                <span v-if="item.fromName">
                  <span v-if="item.fromName.length > 20">{{ item.fromName | formatTransactionCode(5, 5) }}</span>
                  <span v-else>{{ item.fromName }}</span>
                </span>
                <span v-else> {{ item.fromAddress | formatTransactionCode(5, 5) }}</span>
              </div>
            </div>
            <div class="be-flex jc-space-between item-acti">
              <p class="text-body-small text-regular color-primary">{{ $t('detail-nft.table.to') }}</p>
              <div class="text-body-small text-regular text-hyperlink click" @click="handleViewProfileUser(item.toId)">
                <span v-if="item.toName">
                  <span v-if="item.toName.length > 20">{{ item.toName | formatTransactionCode(5, 5) }}</span>
                  <span v-else>{{ item.toName }}</span>
                </span>
                <span v-else> {{ item.toAddress | formatTransactionCode(5, 5) }}</span>
              </div>
            </div>
            <div class="be-flex jc-space-between item-acti">
              <p class="text-body-small text-regular color-primary">{{ $t('detail-nft.table.price') }}</p>
              <div>
                <div class="text-body-small text-regular color-primary">{{ item.price | convertAmountDecimal(item.currency) }} {{ item.currency }}</div>
                <!-- <div class="nft-body-base-small text-regular text-desc">~${{ (item.price * item.usdExchangeRate) | convertAmountDecimal(item.currency) }}</div> -->
              </div>
            </div>
            <div class="be-flex jc-space-between item-acti">
              <p class="text-body-small text-regular color-primary">{{ $t('detail-nft.table.quantity') }}</p>
              <div class="text-body-small text-regular color-primary" style="text-align: right">{{ item.quantity | formatNumber }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="length < listActivity.length" class="btn-more">
        <el-button @click="handleLoadMore" class="el-button nft-header6 text-semibold text-center bid el-button-custom el-button--default">Load more</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import FilterDetailNFT from './FilterDetailNFT.vue'
  import FilterDEtailNFTMobile from '../home/mobile/FilterDetailNFTMobile.vue'

  const beBase = namespace('beBase')
  const beAuth = namespace('beAuth')
  @Component({
    components: { FilterDetailNFT, FilterDEtailNFTMobile }
  })
  export default class ContentDetailNFT extends Vue {
    @Prop({ required: true, type: Object, default: () => ({}) }) query!: Record<string, any>
    @Prop({ required: true, type: Array, default: () => [] }) listActivity!: Array<Record<string, any>>
    @Prop({ required: true, type: String, default: 'ACTIVITY' }) changeTabAcitve!: string
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>

    @beBase.State('coinMain') coinMain!: string

    handleViewProfileUser(id: string): void {
      let id1 = id
      if (!id1) return
      this.$router.push({ name: 'UserProfile', params: { id: id1 } })
    }
    activeNames = '1'

    // handleViewTo(id: string): void {
    //   // for (let i = 0; i < this.listActivity.length; i++) {
    //   //   this.getToId = this.listActivity[i].toId
    //   //   // console.log('listToId', this.getToId);
    //   // }

    //   let id2 = id
    //   this.$router.push({ name: 'UserProfile', params: { id: id2 } })
    //   console.log('toId', id)
    // }
    length = 5
    get getPaginationInfo(): string {
      if (this.query.activityTab === 'BIDS') {
        return this.$t('detail-nft.paging.bid') as string
      }
      return this.$t('detail-nft.paging.activities') as string
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

    handleSizeChange(size: number): void {
      this.$emit('sizeChange', size)
    }
    handleCurrentChange(page: number): void {
      this.$emit('currentChange', page)
    }
    handleFilter(filter: Record<string, any>): void {
      this.$emit('filter', filter)
    }
    handleClickOpenTab(address: string, network: string): void {
      const path = network === 'BEP20' ? process.env.VUE_APP_URL_SCAN_TX_BNB : process.env.VUE_APP_URL_SCAN_TX_ETH
      window.open(`${path}${address}`, '_blank')
    }
    handleLoadMore(): void {
      this.length += 5
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    mounted() {
      console.log('listActivity', this.listActivity)
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.content-detail {
    .click {
      cursor: pointer;
    }
    // padding-top: 16px;
    .table {
      margin-top: 40px;
      .el-table__header-wrapper {
        .el-table__header {
          .date {
            padding-right: 33px;
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
    .isPc {
      display: block;
    }
    .isMobile {
      display: none;
    }
    @media (max-width: 1200px) {
      .isPc {
        display: none;
      }
      .isMobile {
        display: block;
      }
      .avatar {
        position: relative;
        margin-right: 12px;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        img {
          width: 40px;
          height: 40px;
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
          bottom: 13px;
          right: 0;
          height: 16px;
        }
        .wrap-media {
          .empty {
            border-radius: 50% !important;
          }
        }
      }
      .item-acti {
        margin-top: 12px;
      }
      .content-detail-acti {
        margin-top: 16px;
      }
      .detail-nft .tab {
        max-width: 630px;
        margin: 0 auto;
      }
      .btn-more {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
        margin-bottom: 40px;
        max-width: 630px;
        margin: 0 auto;
        .el-button {
          width: 89% !important;
          height: 48px;
        }
      }
    }
  }
</style>
