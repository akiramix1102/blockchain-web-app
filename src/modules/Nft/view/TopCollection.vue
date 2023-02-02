/* eslint-disable vue/no-unused-vars */
<template>
  <div class="top-collection">
    <div class="container-nft wrapper">
      <div class="be-flex align-center jc-space-between mb-40 header">
        <div class="nft-header2 text-semibold cursor">
          <el-dropdown trigger="click" class="dropdown-top-seller" @command="handleCommand">
            <div class="el-dropdown-link text-semibold be-flex align-center">
              <span class="nft-header2 text-first">{{ $t('nft.home.top') }}</span>
              <span style="padding-left: 12px" class="nft-header2 text-hyperlink lowercase">{{ textTitle }}</span
              ><base-icon icon="icon-arrow-down" size="24" style="padding-left: 11px" />
            </div>
            <el-dropdown-menu slot="dropdown" class="dropdown-seller">
              <el-dropdown-item command="collection">{{ $t('nft.home.collection') }}</el-dropdown-item>
              <el-dropdown-item command="seller">{{ $t('nft.home.seller') }}</el-dropdown-item>
              <el-dropdown-item command="buyer">{{ $t('nft.home.buyer') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-form class="be-flex form-collection">
          <el-form-item class="mb-0 mr-16">
            <el-select v-model="filter.categoryId" popper-class="text-base-nft popper-select-category" @change="handleFilter">
              <el-option :label="$t('nft.filter.all-category')" :value="-1" />
              <el-option v-for="item in categories" :key="item.id" :label="item.categoryName" :value="item.id" :class="item.child ? 'item-child' : 'item-parent'" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-0">
            <el-select v-model="filter.lastTime" popper-class="text-base-nft" @change="handleFilter">
              <el-option v-for="item in time" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <base-table
          :data="dataCollection"
          :table="query"
          :paginationInfo="getPaginationInfo"
          class="base-table table-wallet"
          @rowClick="handleRowClick"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        >
          <el-table-column class-name="index" :index="getIndex" type="index" align="center" width="60">
            <template v-slot:header>
              <div class="nft-header6 text-desc">#</div>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
              <div class="nft-header6 text-desc">
                {{ $t('nft.table.collection') }}
              </div>
            </template>
            <template slot-scope="scope">
              <div class="be-flex align-center info">
                <div class="avatar">
                  <img :src="scope.row.avatar" class="d-block" />
                  <div v-if="scope.row.isNew === 'YES'" class="new-circle"></div>
                  <div v-if="scope.row.isVerified === 'YES'" class="item-verifed">
                    <base-icon icon="icon-verified" size="14" />
                  </div>
                </div>
                <div class="content">
                  <div class="nft-header6 text-semibold text-overflow-1">{{ scope.row.collectionName }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" width="150">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end cursor" @click="handleSortTable('volume')">
                <span class="nft-header6 text-desc">{{ $t('nft.table.volume') }}</span>
                <span v-if="objShowArrow.volume" class="header-icon d-iflex" :class="!orderBy ? 'rotate' : null">
                  <base-icon icon="arrow-down" size="11" />
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base">$ {{ scope.row.totalTrade | roundingNumberWithoutDot(1) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="right" width="110">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end cursor" @click="handleSortTable('day')">
                <span class="nft-header6 text-desc">{{ $t('nft.table.24h') }}</span>
                <span v-if="objShowArrow.day" class="header-icon d-iflex" :class="!orderBy ? 'rotate' : null">
                  <base-icon icon="arrow-down" size="11" />
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base" :class="scope.row.oneDayChange > 0 ? 'amount-increase' : 'amount-decrease'">
                <span v-if="scope.row.oneDayChange > 0"> + {{ scope.row.oneDayChange | convertAmountDecimal('PERCENT') }}%</span>
                <span v-else> - {{ scope.row.oneDayChange | convertAmountDecimal('PERCENT') }}%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" width="110">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end cursor" @click="handleSortTable('week')">
                <span class="nft-header6 text-desc">{{ $t('nft.table.7d') }}</span>
                <span v-if="objShowArrow.week" class="header-icon d-iflex" :class="!orderBy ? 'rotate' : null">
                  <base-icon icon="arrow-down" size="11" />
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base" :class="scope.row.sevenDayChange > 0 ? 'amount-increase' : 'amount-decrease'">
                <span v-if="scope.row.sevenDayChange > 0"> + {{ scope.row.sevenDayChange | convertAmountDecimal('PERCENT') }}%</span>
                <span v-else> {{ scope.row.sevenDayChange | convertAmountDecimal('PERCENT') }}%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" width="150">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end cursor" @click="handleSortTable('price')">
                <span class="nft-header6 text-desc">{{ $t('nft.table.price') }}</span>
                <span v-if="objShowArrow.price" class="header-icon d-iflex" :class="!orderBy ? 'rotate' : null">
                  <base-icon icon="arrow-down" size="11" />
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base">$ {{ (scope.row.floorPrice * scope.row.exchangeRate) | roundingNumberWithoutDot(1) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="right" :width="getLanguage === 'en' ? 110 : 190">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end cursor" @click="handleSortTable('owner')">
                <span class="nft-header6 text-desc">{{ $t('nft.table.owner') }}</span>
                <span v-if="objShowArrow.owner" class="header-icon d-iflex" :class="!orderBy ? 'rotate' : null">
                  <base-icon icon="arrow-down" size="11" />
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base">{{ scope.row.numOfOwners | formatNumber() }}</div>
            </template>
          </el-table-column>
          <el-table-column align="right" :width="getLanguage === 'en' ? 110 : 130">
            <template v-slot:header>
              <div class="be-flex align-center jc-flex-end cursor" @click="handleSortTable('item')">
                <span class="nft-header6 text-desc">{{ $t('nft.table.item') }}</span>
                <span v-if="objShowArrow.item" class="header-icon d-iflex" :class="!orderBy ? 'rotate' : null">
                  <base-icon icon="arrow-down" size="11" />
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="nft-body-base">{{ scope.row.numOfItems | formatNumber() }}</div>
            </template>
          </el-table-column>
        </base-table>
      </div>
    </div>

    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import FooterMarket from '../components/Footer.vue'
  import { forEach, reduce } from 'lodash'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')

  @Component({ components: { FooterMarket } })
  export default class TopCollection extends Vue {
    textTitle = this.$t('nft.home.collection')

    filter: Record<string, any> = {
      categoryId: -1,
      lastTime: 'LAST_24_HOURS'
    }
    categories: Array<Record<string, any>> = []
    time: Array<Record<string, any>> = [
      {
        id: 1,
        title: this.$t('nft.tab.last-24h'),
        value: 'LAST_24_HOURS'
      },
      {
        id: 2,
        title: this.$t('nft.tab.last-7day'),
        value: 'LAST_7_DAYS'
      },
      {
        id: 3,
        title: this.$t('nft.tab.last-30day'),
        value: 'LAST_30_DAYS'
      }
    ]

    objShowArrow: Record<string, boolean> = {
      volume: true,
      day: false,
      week: false,
      price: false,
      owner: false,
      item: false
    }

    // true =  asc(tang), false = desc (giam)
    orderBy = true

    query: Record<string, any> = {
      total: 100,
      page: 1,
      limit: 20,
      collectionType: 'TOP'
    }

    dataCollection: Array<Record<string, any>> = []

    get getPaginationInfo(): string {
      return this.$t('paging.collection') as string
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    get getLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }

    async created(): Promise<void> {
      this.filter.lastTime = this.$route.query.lastTime
      await this.getListCollection()
      const result = await apiNft.getListCategory()

      forEach(result, value => {
        this.categories.push({
          id: value.id,
          categoryName: value.categoryName
        })
        if (value.subCategory.length) {
          forEach(value.subCategory, elm => {
            this.categories.push({
              id: elm.id,
              categoryName: elm.categoryName,
              child: 1
            })
          })
        }
      })
    }

    async getListCollection(): Promise<void> {
      const result = await apiNft.getListCollection({ ...this.query, ...this.filter })
      this.dataCollection = result.content
      this.query.total = result.totalElements
    }

    handleFilter(): void {
      this.query.page = 1
      this.query.limit = 20
      this.getListCollection()
    }

    handleSortTable(type: string): void {
      if (this.objShowArrow[type]) {
        this.orderBy = !this.orderBy
      } else {
        this.orderBy = true
        const keys = Object.keys(this.objShowArrow)
        forEach(keys, elm => {
          if (elm !== type) {
            this.objShowArrow[elm] = false
          } else {
            this.objShowArrow[elm] = true
          }
        })
      }
      this.$forceUpdate()
    }

    handleCommand(command: string): void {
      if (command === 'collection') {
        this.textTitle = this.$t('nft.home.collection')
      } else if (command === 'buyer') {
        this.textTitle = this.$t('nft.home.buyer')
      } else {
        this.textTitle = this.$t('nft.home.seller')
      }
    }

    handleRowClick(row: Record<string, any>): void {
      this.$router.push({ name: 'DetailCollection', params: { id: row.row.id } })
    }

    handleSizeChange(size: number): void {
      this.query.limit = size
      this.getListCollection()
    }
    handleCurrentChange(page: number): void {
      this.query.page = page
      this.getListCollection()
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.top-collection {
    margin-top: 80px;
    .wrapper {
      padding-top: 40px;
      .header {
        .text-first {
          color: var(--bc-text-market-primary-nft);
        }
      }
      .form-collection {
        .el-select {
          width: 240px;
        }
      }
      .table {
        .el-table__header-wrapper {
          .header-icon {
            padding-left: 6px;
          }
          .rotate {
            transform: rotate(180deg);
            padding-right: 6px;
            padding-left: 0;
          }
        }
        .el-table__body-wrapper {
          .el-table__row {
            td {
              padding: 20px 0 !important;
              .cell {
                color: var(--bc-text-market-primary-nft);
                .content {
                  color: var(--bc-text-market-primary-nft);
                }
              }
            }

            .index {
              .cell {
                font-size: 14px;
                line-height: 24px;
              }
            }

            .info {
              .avatar {
                position: relative;
                margin-right: 16px;
                img {
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                }
                .new-circle {
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: #129961;
                  border: 1px solid #ffffff;
                  position: absolute;
                  right: 4px;
                  top: 2px;
                }
                .item-verifed {
                  position: absolute;
                  bottom: 0;
                  right: 0;
                }
              }
            }
          }
        }
        .base-pagination {
          padding: 40px 0 60px;
          .info {
            color: var(--bc-text-discript);
          }
        }
      }
    }
  }
</style>
