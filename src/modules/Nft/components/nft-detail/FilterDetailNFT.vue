<template>
  <div class="filter-collection jc-space-between be-flex align-center">
    <div class="filter-collection__left">
      <el-form class="be-flex form-filter">
        <el-form-item class="mr-16">
          <el-select
            @click.native="closePopper"
            v-model="filter.transactionType"
            :placeholder="$t('placeholder.trans-type')"
            clearable
            popper-class="text-base-nft"
            @change="handleChangeType"
          >
            <el-option v-for="item in arrType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="mr-16">
          <el-select @click.native="closePopper" v-model="time" :placeholder="$t('placeholder.time')" clearable popper-class="text-base-nft" @change="handleChangeTime">
            <el-option v-for="item in arrTime" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
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

            <el-form-item class="price" slot="reference">
              <el-select @click.native="isVisible = !isVisible" v-model="price" popper-class="d-none" @clear="handleClearPrice" :placeholder="$t('placeholder.price')" clearable>
                <!-- @visible-change="handleFocusPrice" -->
              </el-select>
            </el-form-item>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <div class="be-flex align-center filter-collection__right">
      <div class="cursor mr-16 wrap-sort">
        <el-dropdown trigger="click" @command="handleSort">
          <span class="be-flex align-center">
            <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="24" class="d-iflex" />
            <span class="nft-body-base" style="color: #0a0b0d">{{ $t('nft.sort.title') }}</span></span
          >
          <el-dropdown-menu class="dropdown-sort-nft" slot="dropdown">
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
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import FilterPriceNft from '@/mixins/filterPriceNft'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  const beAuth = namespace('beAuth')

  interface IFilter {
    transactionType?: string
    orderBy?: string
    fromPrice?: number | null
    fromDate?: number | null | string
    toPrice?: number | null
    toDate?: number | null | string
    [x: string]: any
  }
  @Component
  export default class FilterNftDetail extends Mixins(FilterPriceNft) {
    @Prop({ required: true, type: Object, default: () => ({}) }) query!: Record<string, any>
    @Prop({ required: true, type: String, default: 'ACTIVITY' }) changeTabAcitve!: string
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @beAuth.Getter('isBid') isBid!: boolean
    @beAuth.Getter('isOffer') isOffer!: boolean

    numOfProperties = 0
    statusArrow = false
    sortActive = 0

    isVisible = false
    price = ''
    valueRange = [0, 0]
    fromPrice = ''
    toPrice = ''
    isErrorFrom = false
    maxPrice = 100000

    filter: IFilter = {
      transactionType: '',
      orderBy: 'CREATED_AT_DESC'
    }

    time = ''

    selectProperties: any = ''

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
    arrPrice: Array<Record<string, any>> = [
      {
        id: 0,
        key: '0_to_25k',
        value: '0 - 25k'
      },
      {
        id: 1,
        key: '25k_to_50k',
        value: '25k - 50k'
      }
    ]

    objPrice: Record<string, any> = {
      '0 - 25k': {
        fromPrice: 0,
        toPrice: 25000
      },
      '25k - 50k': {
        fromPrice: 25000,
        toPrice: 50000
      }
    }

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
    // get arrTypeCover():void{
    //   return arrType
    // }
    get arrType(): Array<Record<string, any>> {
      if (this.query.activityTab === 'BIDS') {
        return [
          {
            id: 1,
            title: this.$t('nft.filter.bid'),
            value: 'BID'
          },
          {
            id: 2,
            title: this.$t('nft.filter.cancel-bid'),
            value: 'CANCEL_BID'
          }
        ]
      } else if (!this.isBid || this.nftItem?.totalSupply > 1) {
        if (!this.isOffer) {
          return [
            {
              id: 2,
              title: this.$t('nft.filter.list'),
              value: 'LIST,UNLIST'
            },
            {
              id: 0,
              title: this.$t('nft.filter.sale'),
              value: 'SALE'
            },
            {
              id: 1,
              title: this.$t('nft.filter.transfer'),
              value: 'TRANSFER,MINT'
            },
            {
              id: 5,
              title: this.$t('nft.filter.used'),
              value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
            }
          ]
        }
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
            id: 2,
            title: this.$t('nft.filter.list'),
            value: 'LIST,UNLIST'
          },
          {
            id: 0,
            title: this.$t('nft.filter.sale'),
            value: 'SALE'
          },
          {
            id: 1,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT'
          },
          {
            id: 3,
            title: this.$t('nft.filter.bid'),
            value: 'BID'
          },
          {
            id: 5,
            title: this.$t('nft.filter.used'),
            value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
          }
        ]
      }
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

    handleChangeTime(time: string | number): void {
      if (time === 'all' || time === '') {
        this.filter.fromDate = null
        this.filter.toDate = null
      } else {
        this.filter.fromDate = this.checkTime(+time)
        this.filter.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      }
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

    handleChangePrice(_price: string): void {
      if (_price !== '') {
        this.filter = Object.assign(this.filter, this.objPrice[_price])
      } else {
        this.filter.toPrice = null
        this.filter.fromPrice = null
      }
      this.$emit('filter', this.filter)
    }

    handleChangeType(): void {
      // this.filter.transactionType= '',
      this.$emit('filter', this.filter)
    }

    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }
    // @Watch('changeTabAcitve') watchTabActive(valueNew): void {
    //   if (valueNew === 'ACTIVITY') {
    //     ;(this.time = ''),
    //       (this.valueRange = [0, 0]),
    //       (this.filter = {
    //         transactionType: '',
    //         orderBy: 'CREATED_AT_DESC'
    //       }),
    //       (this.fromPrice = ''),
    //       (this.toPrice = '')
    //     this.price = ''

    //     this.$emit('filter', this.filter)
    //   }
    //   if (valueNew === 'BID') {
    //     ;(this.time = ''),
    //       (this.valueRange = [0, 0]),
    //       (this.filter = {
    //         transactionType: '',
    //         orderBy: 'CREATED_AT_DESC'
    //       }),
    //       (this.fromPrice = '')
    //     ;(this.toPrice = ''), (this.price = '')

    //     this.$emit('filter', this.filter)
    //   }
    // }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-collection {
    margin-top: 24px;
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
    }
  }
</style>
