<template>
  <div>
    <div v-if="isDesktop" class="be-flex align-center jc-space-between filter-collection">
      <div class="filter-collection__left">
        <el-form class="be-flex form-filter">
          <!-- <el-form-item class="mr-16">
          <el-select v-model="filter.type" disabled class="form-item-disabled">
            <el-option v-for="item in arrType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item> -->
          <el-form-item class="mr-16" :class="{ russian: selectLanguage() === 'ru', korean: selectLanguage() === 'kr' || selectLanguage() === 'jp' }">
            <el-select
              @click.native="closePopper"
              v-if="tabActive === 0"
              v-model="filter.saleStatus"
              @change="handleChangeStatus"
              :placeholder="$t('placeholder.sale-status')"
              clearable
            >
              <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
            <el-select
              @click.native="closePopper"
              v-if="tabActive === 1"
              v-model="filter.transactionType"
              @change="handleChangeTransactionType"
              :placeholder="$t('placeholder.all-event')"
              clearable
            >
              <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="tabActive === 1" class="mr-16 all-time" :class="{ russian: selectLanguage() === 'ru' }">
            <el-select
              @click.native="closePopper"
              v-model="filter.lastTime"
              :placeholder="$t('placeholder.all-time')"
              clearable
              popper-class="text-base-nft"
              @change="handleChangeTime"
            >
              <el-option v-for="item in arrTime" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item class="mr-16">
          <el-select v-model="filter.isVerified" @change="handleChangeVerified" :placeholder="$t('placeholder.verify-status')" clearable>
            <el-option v-for="item in arrIsVerified" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item> -->

          <el-form-item>
            <el-popover
              :value="isVisible"
              placement="bottom"
              width="384"
              trigger="click"
              popper-class="popper-price-slider"
              class="wrap-property"
              @show="handleShowPopper"
              @hide="isVisible = false"
            >
              <div class="wrap-inside">
                <div class="wrap-form">
                  <el-slider v-model="valueRange" range :max="maxPrice" :format-tooltip="formatTooltip" tooltip-class="tooltip-price" @change="changeSlider" ref="rangeSlider">
                  </el-slider>
                  <div class="be-flex jc-space-between info-price">
                    <div class="nft-body-caption text-desc">$0</div>
                    <div class="nft-body-caption text-desc">$5,000,000</div>
                  </div>
                  <el-form class="be-flex">
                    <el-form-item class="mr-16">
                      <el-input
                        v-model="fromPrice"
                        :placeholder="$t('placeholder.from')"
                        clearable
                        @input="handleChangeFromPrice"
                        @keypress.native="onlyNumber($event, 'fromPrice')"
                        @keyup.native="numberFormat($event)"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="toPrice"
                        :placeholder="$t('placeholder.to')"
                        clearable
                        @input="handleChangeToPrice"
                        @keypress.native="onlyNumber($event, 'toPrice')"
                        @keyup.native="numberFormat($event)"
                      />
                    </el-form-item>
                    <div v-if="isErrorFrom" class="error-amount">
                      <p>{{ $t('nft.error-from') }}</p>
                    </div>
                  </el-form>
                </div>

                <div class="be-flex jc-flex-end footer">
                  <button class="btn-default mr-15 nft-header6 text-desc text-semibold" @click="handleReset">
                    <p>{{ $t('button.reset') }}</p>
                  </button>
                  <button :class="isErrorFrom ? 'btn--disabled' : ''" class="btn-default-bg btn mr-15 nft-header6 text-semibold is-none-border" @click="handleApply">
                    {{ $t('button.apply') }}
                  </button>
                </div>
              </div>
              <!-- <div slot="reference" class="nft-body-base be-flex align-center jc-space-between cursor"> -->
              <!-- sửa ở đây -->
              <!-- <div class="be-flex align-center icon-price">
                <img src="@/assets/images/nft/icon-lynkey-bg.png" alt="" />
                <span class="text-overflow-1" v-if="fromPrice || toPrice">{{ fromPrice }} - {{ toPrice ? toPrice : 0 }}</span>
                <span v-else>{{ $t('placeholder.price') }}</span>
              </div>
              <span class="arrow" :class="statusArrow ? 'is-reverse' : null"><i class="el-select__caret el-input__icon el-icon-arrow-down"></i></span> -->
              <el-form-item class="price" slot="reference">
                <el-select @click.native="isVisible = !isVisible" v-model="price" popper-class="d-none" @clear="handleClearPrice" :placeholder="$t('placeholder.price')" clearable>
                  <!--  @focus="handleFocusPrice" -->
                  <!-- <el-option v-for="item in arrPrice" :key="item.id" :label="$t(`nft.price_range.${item.key}`)" :value="item.value" /> -->
                </el-select>
              </el-form-item>
              <!-- </div> -->
            </el-popover>
          </el-form-item>

          <!-- <el-form-item>
          <el-popover
            :value="isVisible"
            placement="bottom"
            width="200"
            trigger="click"
            popper-class="popper-property"
            class="wrap-property"
            @show="handleShowPopper"
            @hide="statusArrow = false"
          >
            <div class="wrap-inside">
              <div class="wrap-form">
                <el-form>
                  <el-form-item v-for="item in 5" :key="item" :label="'Property ' + item">
                    <el-select class="w-100" popper-class="select-property" v-model="selectProperties" clearable @change="handleChange(item, $event)">
                      <el-option v-for="item in 3" :key="item" :label="'Option ' + item" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>

              <div class="be-flex jc-flex-end footer">
                <button class="btn-default mr-15 nft-header6 text-desc text-semibold" @click="handleReset">
                  <p>{{ $t('button.reset') }}</p>
                </button>
                <button class="btn-default-bg mr-15 nft-header6 text-semibold btn is-none-border" @click="handleApply">
                  {{ $t('button.apply') }}
                </button>
              </div>
            </div>
            <div slot="reference" class="nft-body-base cursor btn-reference">
              Properties ({{ numOfProperties }})
              <span class="arrow" :class="statusArrow ? 'is-reverse' : null"><i class="el-select__caret el-input__icon el-icon-arrow-down"></i></span>
            </div>
          </el-popover>
        </el-form-item> -->
        </el-form>
      </div>
      <div class="be-flex align-center filter-collection__right">
        <div class="cursor wrap-sort">
          <el-dropdown trigger="click" @command="handleSort">
            <span class="be-flex align-center">
              <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="24" class="d-iflex" />
              <span class="nft-body-base" style="color: #0a0b0d">{{ $t('nft.sort.title') }}</span></span
            >
            <el-dropdown-menu class="dropdown-sort-nft" :class="{ russian: selectLanguage() === 'ru' }" slot="dropdown">
              <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="filter.orderBy === value.command ? 'active' : null" :command="value.command">
                <div class="be-flex">
                  <p class="be-flex-item label" :class="filter.orderBy === value.command ? 'label-active' : null">
                    {{ value.label }}
                  </p>
                  <base-icon v-if="filter.orderBy === value.command && coinMain === 'LYNK'" icon="icon-tick-dropdown" size="16" />
                  <base-icon v-if="filter.orderBy === value.command && coinMain === 'CLM'" icon="icon-tick-dropdown-clm" size="16" />
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <div class="be-flex view-type">
        <div class="cursor item" :class="viewType === 'list' ? 'active' : null" @click="viewType = 'list'">
          <base-icon icon="icon-bullet-list" size="24" class="d-iflex" />
        </div>
        <div class="cursor item" :class="viewType === 'grid' ? 'active' : null" @click="viewType = 'grid'">
          <base-icon icon="icon-view-grid" size="24" class="d-iflex" />
        </div>
      </div> -->
      </div>
    </div>
    <!-- <filter-collection-detail-mobile :tabActive="tabActive" v-else /> -->
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import FilterPriceNft from '@/mixins/filterPriceNft'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  // import FilterCollectionDetailMobile from '../home/mobile/FilterDetailCollectionMobile.vue'
  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  interface IFilter {
    roundId?: number
    status?: number
    price?: number
    orderBy?: string
    toPrice?: number | null
    fromPrice?: number | null
    [x: string]: any
  }
  @Component({ components: {} })
  export default class FilterCollectionDetail extends Mixins(FilterPriceNft) {
    @Prop({ required: true, type: Number, default: 0 }) tabActive!: number
    @Prop({ required: true, type: Array, default: () => ({}) })
    dataFilter!: Record<string, any>
    // @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @bcNft.State('isDesktop') isDesktop!: boolean

    @bcAuth.State('featureConfig') featureConfig!: Record<string, boolean>
    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @bcAuth.Getter('isOffer') isOffer!: boolean

    numOfProperties = 0
    statusArrow = false
    sortActive = 0

    filter: IFilter = {
      saleStatus: '',
      orderBy: 'CREATED_AT_DESC',
      transactionType: ''
    }
    query: Record<string, any> = {
      page: 1,
      limit: 12,
      lastTime: 'LAST_24_HOURS',
      collectionType: 'TOP',
      orderBy: 'CREATED_AT_DESC'
    }

    selectProperties: any = ''

    viewType = 'grid'

    arrType: Array<Record<string, any>> = [
      {
        id: 0,
        title: 'Blockchain',
        value: 'blockchain'
      }
    ]
    arrStatus: Array<Record<string, any>> = [
      {
        id: 2,
        title: this.$t('nft.filter.on-sale'),
        value: 'ON_SALE'
      },
      {
        id: 3,
        title: this.$t('text-nft.not-for-sale'),
        value: 'NOT_FOR_SALE'
      }
    ]
    arrIsVerified: Array<Record<string, any>> = [
      {
        id: 1,
        title: this.$t('nft.filter.verified'),
        value: 'YES'
      },
      {
        id: 2,
        title: this.$t('nft.filter.un-verified'),
        value: 'NO'
      }
    ]

    arrTime: Array<Record<string, any>> = [
      {
        id: 1,
        title: this.$t('nft.filter.last-7day'),
        value: 7
      },
      {
        id: 2,
        title: this.$t('nft.filter.last-14day'),
        value: 14
      },
      {
        id: 3,
        title: this.$t('nft.filter.last-30day'),
        value: 30
      },
      {
        id: 4,
        title: this.$t('nft.filter.last-60day'),
        value: 60
      },
      {
        id: 5,
        title: this.$t('nft.filter.last-90day'),
        value: 90
      },
      {
        id: 6,
        title: this.$t('nft.filter.last-year'),
        value: 365
      }
    ]

    sorts: Array<Record<string, any>> = [
      {
        command: 'CREATED_AT_DESC',
        label: this.$t('nft.sort.latest')
      },
      {
        command: 'CREATED_AT_ASC',
        label: this.$t('nft.sort.oldest')
      },
      {
        command: 'PRICE_DESC',
        label: this.$t('nft.sort.price-high')
      },
      {
        command: 'PRICE_ASC',
        label: this.$t('nft.sort.price-low')
      }
    ]

    // @Watch('tabActive') watchTabActive(): void {
    //   this.filter.saleStatus = ''
    // }

    get getArrFilterSaleStatus(): Array<Record<string, any>> {
      const arr = [...this.arrStatus]
      if (this.tabActive === 0) {
        if (this.featureConfig?.offer) {
          arr.push({
            id: 1,
            title: this.$t('nft.filter.has-offer'),
            value: 'HAS_OFFER'
          })
        }
        if (this.featureConfig?.bid) {
          arr.push({
            id: 0,
            title: this.$t('nft.filter.on-auction'),
            value: 'ON_AUCTION'
          })
        }
        return arr
      } else {
        if (!this.isBid && !this.isOffer) {
          return [
            {
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 3,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        } else if (!this.isBid) {
          return [
            {
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 3,
              title: this.$t('nft.filter.offer'),
              value: 'OFFER'
            },
            {
              id: 4,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        } else if (!this.isOffer) {
          return [
            {
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 3,
              title: this.$t('nft.filter.bid'),
              value: 'BID'
            },
            {
              id: 4,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        } else {
          return [
            {
              id: 0,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 1,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 2,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 3,
              title: this.$t('nft.filter.bid'),
              value: 'BID'
            },
            {
              id: 4,
              title: this.$t('nft.filter.offer'),
              value: 'OFFER'
            },
            {
              id: 5,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        }
      }
    }

    async created(): Promise<void> {
      this.$emit('filter', this.filter)
    }
    @Watch('tabActive') watchTabActive(valueNew): void {
      if (valueNew === 0) {
        console.log('lan 1')
        this.fromPrice = ''
        ;(this.toPrice = ''), (this.price = '')
        this.valueRange = [0, 0]
        this.filter = {
          orderBy: 'CREATED_AT_DESC'
        }
        //this.$emit('filter', this.filter)
      }

      if (valueNew === 1) {
        console.log('lan 2')
        this.fromPrice = ''
        ;(this.toPrice = ''), (this.price = '')
        this.valueRange = [0, 0]
        this.filter = {
          orderBy: 'CREATED_AT_DESC'
        }
        // this.$emit('filter', this.filter)
      }
      //this.handleReset()
      //this.$emit('filter', this.filter)
    }
    resetFilter(): void {
      this.filter = {
        saleType: '',
        orderBy: 'CREATED_AT_DESC',
        categoryId: '',
        listType: 'NFT',
        transactionType: ''
      }
      this.price = ''
      this.fromPrice = ''
      this.toPrice = ''
      this.valueRange = [0, 0]
    }
    handleChange(item: number, event: any): void {
      console.log(item, event)
    }

    handleChangeStatus(value: any): void {
      // EventBus.$emit('emitFilterCollection', value)
      this.$emit('filter', this.filter)
    }
    handleChangeTransactionType(value: any): void {
      EventBus.$emit('emitFilterCollection', value)
      // this.$emit('filter', this.filter)
    }
    destroyed(): void {
      EventBus.$off('emitFilterCollection')
      EventBus.$off('emitFilterTime')
    }
    handleChangeVerified(): void {
      this.$emit('filter', this.filter)
    }
    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }

    checkTime(day: number): string {
      const time = new Date(Date.now() - day * 24 * 60 * 60 * 1000).setHours(0, 0, 0)
      return this.formatTimestamp(time)
    }
    formatTimestamp(value: number): string {
      if (!value) {
        return ''
      }
      const gmt = new Date().getTimezoneOffset() / -60
      const ago = value - gmt * 60 * 60 * 1000
      const date = new Date(ago)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    }

    handleChangeTime(time: string | number): void {
      let fromDate
      let toDate
      if (time === 'all' || time === '') {
        fromDate = null
        toDate = null
      } else {
        fromDate = this.checkTime(+time)
        toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      }
      EventBus.$emit('emitFilterTime', { fromDate, toDate })
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-collection {
    margin-top: 40px;
    .el-form-item {
      &.russian {
        width: 208px !important;
      }
      &.korean {
        width: 184px !important;
      }
      &.all-time.russian {
        width: 220px !important;
      }
    }
    &__left {
      .form-filter {
        .el-form-item {
          width: 160px;
          margin-bottom: 0;
          .wrap-property {
            .btn-reference {
              line-height: 46px;
              border: 1px solid var(--bc-select-border);
              border-radius: 4px;
              padding: 0 15px;
              position: relative;
              &:hover {
                border-color: var(--bc-input-hover-border);
              }
              .arrow {
                position: absolute;
                right: 10px;
                i {
                  width: auto;
                  color: #89909e;
                  font-size: 14px;
                }
              }
              .is-reverse {
                i {
                  transform: rotate(-180deg);
                }
              }
            }
          }
          .el-input__prefix {
            display: flex;
            align-items: center;
            left: 12px;
            .icon {
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f3f2f1;
              border-radius: 50%;
            }
          }
        }

        .form-item-disabled {
          .el-input__inner {
            background: transparent;
            color: var(--bc-text-discript);
          }
        }
      }
    }
    &__right {
      .wrap-sort {
        &:hover {
          .span-icon {
            color: var(--bc-theme-primary-gradient-hover) !important;
          }
          .nft-body-base {
            background: var(--bc-menu-active);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      .view-type {
        .item {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .active {
          background: #f3f2f1;
          border-radius: 6px;
        }
      }
    }
  }
  ::v-deep.dropdown-sort-nft {
    &.russian {
      width: 282px;
      .el-dropdown-menu__item {
        width: 100%;
      }
    }
  }
</style>
