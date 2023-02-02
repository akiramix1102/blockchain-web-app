<template>
  <div class="filter-collection">
    <div class="be-flex align-center jc-space-between isPcFilter">
      <div class="filter-collection__left">
        <el-form class="be-flex form-filter" @submit.prevent.native="handleSubmit">
          <el-form-item class="mr-16 input-search" v-if="isShowSearch">
            <el-input v-model="filter.search" :placeholder="$t('placeholder.search')" @input="handleSearch"> </el-input>
            <div class="icon">
              <base-icon icon="icon-search-gray" size="16" class="d-iflex"></base-icon>
            </div>
          </el-form-item>

          <el-form-item class="mr-16" v-if="tabActive !== 'NFT'">
            <el-select
              @click.native="closePopper"
              v-model="filter.isVerified"
              popper-class="text-base-nft popper-select-category"
              :placeholder="$t('nft.place-holder.verify-status')"
              @change="handleChangeStatus"
              clearable
            >
              <el-option v-for="item in arrStatus" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isBuy && isBid && tabActive === 'NFT'" class="mr-16">
            <el-select @click.native="closePopper" v-model="filter.saleType" @change="handleChangeStatus" :placeholder="$t('placeholder.sale-type')" clearable>
              <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="tabActive === 'NFT'">
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
                </el-select>
                <!-- @focus="handleFocusPrice" -->
              </el-form-item>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <div class="be-flex align-center filter-collection__right">
        <div class="cursor wrap-sort">
          <el-dropdown trigger="click" @command="handleSort">
            <span class="be-flex align-center">
              <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="24" class="d-iflex" />
              <span class="nft-body-base" style="color: #0a0b0d">{{ $t('nft.sort.title') }}</span></span
            >
            <el-dropdown-menu class="dropdown-sort-nft" :class="tabActive !== 'NFT' ? 'dropdown-sort-collection' : null" slot="dropdown">
              <el-dropdown-item v-for="(value, index) in arrSorts" :key="index" :class="filter.orderBy === value.command ? 'active' : null" :command="value.command">
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
    <filter-explore-mobile class="isMobileFilter" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import FilterPriceNft from '@/mixins/filterPriceNft'
  import FilterExploreMobile from '../home/mobile/FilterExploreMobile.vue'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import { debounce, includes, trim } from 'lodash'
  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')

  interface IFilter {
    roundId?: number
    status?: number
    price?: number
    orderBy?: string
    toPrice?: number | null | string
    fromPrice?: number | null | string
    search: string
    [x: string]: any
  }
  @Component({ components: { FilterExploreMobile } })
  export default class FilterNftClm extends Mixins(FilterPriceNft) {
    @Prop({ required: false, type: Boolean, default: false }) isShowSearch!: boolean
    @Prop({ required: false, type: String, default: 'NFT' }) tabActive!: string
    @Prop({ required: false, type: Boolean, default: false }) isNft!: boolean

    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @beBase.State('coinMain') coinMain!: string

    numOfProperties = 0
    statusArrow = false
    sortActive = 0

    filter: IFilter = {
      saleType: '',
      orderBy: 'CREATED_AT_DESC',
      categoryId: '',
      search: '',
      isVerified: ''
    }

    selectProperties: any = ''

    viewType = 'grid'

    arrStatus: Array<Record<string, any>> = [
      {
        id: 0,
        title: this.$t('nft.select.verified'),
        value: 'YES'
      },
      {
        id: 1,
        title: this.$t('nft.select.unverified'),
        value: 'NO'
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

    @Watch('$route.params.id') changeRouteId(id: string): void {
      if (this.$route.name === 'DetailCategory') {
        if (id !== 'all') {
          this.filter.categoryId = +id
        }
      }
    }

    get getArrFilterSaleStatus(): Array<Record<string, any>> {
      if (this.isNft) {
        if (this.isBid) {
          return [
            {
              id: 1,
              title: this.$t('nft.filter.buy'),
              value: 'BUY'
            },
            {
              id: 2,
              title: this.$t('nft.filter.bid'),
              value: 'BID'
            }
          ]
        } else {
          return [
            {
              id: 1,
              title: this.$t('nft.filter.buy'),
              value: 'BUY'
            }
          ]
        }
      }
      return []
    }

    get arrSorts(): Array<Record<string, any>> {
      if (this.tabActive === 'NFT') {
        return this.sorts
      }
      return [
        {
          command: 'CREATED_AT_DESC',
          label: this.$t('nft.sort.latest')
        },
        {
          command: 'CREATED_AT_ASC',
          label: this.$t('nft.sort.oldest')
        }
      ]
    }

    async created(): Promise<void> {
      if (this.$route.name === 'DetailCategory') {
        if (this.$route.params.id !== 'all') {
          this.filter.categoryId = +this.$route.params.id
        }
      }
      this.filter = {
        ...this.filter,
        ...this.$route.query
      }
      const arrFalse = ['null', 'undefined', '0', undefined]
      const queryFromPrice = this.$route.query.fromPrice as string | undefined
      const queryToPrice = this.$route.query.toPrice as string | undefined

      this.fromPrice = !includes(arrFalse, queryFromPrice as string | undefined) ? this.$options.filters?.numberWithCommas(queryFromPrice) : '0'
      this.toPrice = !includes(arrFalse, queryToPrice as string | undefined) ? this.$options.filters?.numberWithCommas(queryToPrice) : '0'

      const fromPrice = +this.fromPrice.replaceAll(',', '')
      const toPrice = +this.toPrice.replaceAll(',', '')

      this.$set(this.valueRange, 1, toPrice)
      this.$set(this.valueRange, 0, fromPrice)
      //@ts-ignore
      this.$refs.rangeSlider.setValues()

      if (!includes(arrFalse, queryFromPrice) && !includes(arrFalse, queryToPrice)) {
        this.price = this.$options.filters?.numberWithCommas(this.fromPrice.replaceAll(',', '')) + ' - ' + this.$options.filters?.numberWithCommas(this.toPrice.replaceAll(',', ''))
      } else if (!includes(arrFalse, queryFromPrice) && includes(arrFalse, queryToPrice)) {
        this.price = '> ' + this.$options.filters?.numberWithCommas(this.fromPrice.replaceAll(',', ''))
      } else if (includes(arrFalse, queryFromPrice) && !includes(arrFalse, queryToPrice)) {
        this.price = '< ' + this.$options.filters?.numberWithCommas(this.toPrice.replaceAll(',', ''))
      } else {
        this.price = ''
      }
    }

    handleSearch(value: string): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      this.debounceSearch(value, _this)
    }

    debounceSearch = debounce((value: string, _this: any) => {
      _this.filter.search = trim(value)
      _this.$emit('filter', _this.filter)
    }, 500)

    handleChange(item: number, event: any): void {
      console.log(item, event)
    }

    handleChangeStatus(): void {
      this.$emit('filter', this.filter)
    }
    handleChangeVerified(): void {
      this.$emit('filter', this.filter)
    }

    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }

    handleSubmit(): void {
      this.$emit('filter', this.filter)
    }

    resetFilter(): void {
      this.filter = {
        saleStatus: '',
        orderBy: 'CREATED_AT_DESC',
        categoryId: '',
        fromPrice: null,
        toPrice: null,
        search: ''
      }
      this.price = ''
      this.fromPrice = ''
      this.toPrice = ''
      this.valueRange = [0, 0]
      if (this.$route.name === 'DetailCategory') {
        if (this.$route.params.id !== 'all') {
          this.filter.categoryId = +this.$route.params.id
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-collection {
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
        .input-search {
          width: 320px;
          position: relative;

          .el-input {
            .el-input__inner {
              height: 48px;
              padding-right: 36px;
            }
          }
          .icon {
            position: absolute;
            top: 16px;
            right: 16px;
            display: inline-flex;
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
    .isPcFilter {
      display: flex;
    }
    .isMobileFilter {
      display: none;
    }
    @media (max-width: 767px) {
      .isMobileFilter {
        display: block;
      }
      .isPcFilter {
        display: none;
      }
    }
  }
</style>
