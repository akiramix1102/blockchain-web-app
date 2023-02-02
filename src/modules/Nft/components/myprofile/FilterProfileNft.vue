<template>
  <div class="be-flex align-center jc-space-between filter-profile-nft">
    <div class="filter-profile-nft__left">
      <el-form class="be-flex form-filter">
        <el-form-item v-if="tabActive !== 'ACTIVITIES' && filter.listType === 'NFT'" class="mr-16">
          <el-select @click.native="closePopper" v-model="filter.network" clearable placeholder="Blockchain" popper-class="text-base-nft" @change="handleChangeFilter">
            <el-option label="Ethereum" value="ERC20" />
            <el-option label="BSC" value="BEP20" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="tabActive === 'CREATED' || tabActive === 'FAVOURITE'" class="mr-16">
          <el-select @click.native="closePopper" v-model="filter.listType" popper-class="text-base-nft" @change="handleChangeFilter">
            <el-option v-for="item in listType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabActive !== 'ACTIVITIES'" class="mr-16">
          <el-select
            @click.native="closePopper"
            v-model="filter.categoryId"
            popper-class="text-base-nft popper-explore-select-category"
            :placeholder="$t('nft.place-holder.category')"
            @change="handleChangeFilter"
            clearable
          >
            <el-option
              v-for="item in listCategory"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
              :class="!item.levelDepth ? 'item-parent' : item.levelDepth > 1 ? 'item-child-last' : 'item-child'"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="isBuy && isBid && tabActive !== 'ACTIVITIES' && filter.listType === 'NFT' && tabActive !== 'USED'" class="mr-16">
          <el-select @click.native="closePopper" v-model="filter.saleType" @change="handleChangeFilter" :placeholder="$t('placeholder.sale-type')" clearable>
            <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="mr-16" v-if="filter.listType === 'Collections'">
          <el-select @click.native="closePopper" v-model="filter.isVerified" @change="handleChangeVerified" :placeholder="$t('placeholder.verify-status')" clearable>
            <el-option v-for="item in arrIsVerified" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabActive === 'ACTIVITIES'" class="mr-16 all-event" :class="{ russian: selectLanguage() === 'ru' }">
          <el-select @click.native="closePopper" v-model="filter.transactionType" @change="handleChangeFilter" :placeholder="$t('placeholder.all-event')" clearable>
            <el-option v-for="item in arrTransactionType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabActive === 'ACTIVITIES'" class="mr-16 all-time" :class="{ russian: selectLanguage() === 'ru' }">
          <el-select @click.native="closePopper" v-model="time" :placeholder="$t('placeholder.all-time')" clearable popper-class="text-base-nft" @change="handleChangeTime">
            <el-option v-for="item in arrTime" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabActive !== 'USED'">
          <el-popover
            :value="isVisible"
            placement="bottom"
            width="384"
            trigger="click"
            popper-class="popper-price-slider"
            class="wrap-property"
            @show="handleShowPopper"
            @hide="isVisible = false"
            v-if="filter.listType === 'NFT' || tabActive === 'ACTIVITIES'"
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
                <!-- @focus="handleFocusPrice" -->
              </el-select>
            </el-form-item>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <div class="be-flex align-center filter-profile-nft__right">
      <div class="cursor wrap-sort">
        <el-dropdown trigger="click" @command="handleSort">
          <span class="be-flex align-center">
            <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="24" class="d-iflex" />
            <span class="nft-body-base" style="color: #0a0b0d">{{ $t('nft.sort.title') }}</span></span
          >
          <el-dropdown-menu class="dropdown-sort-nft" :class="{ russian: selectLanguage() === 'ru' }" slot="dropdown">
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
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import FilterPriceNft from '@/mixins/filterPriceNft'
  import { debounce, includes, trim } from 'lodash'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class FilterProfileNft extends Mixins(FilterPriceNft) {
    @Prop({ required: false, type: Array, default: () => [] }) listCategory!: Array<Record<string, any>>
    @Prop({ required: false, type: String, default: 'ON_SALE' }) tabActive!: string

    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @bcAuth.Getter('isOffer') isOffer!: boolean

    filter: Record<string, any> = {
      // saleType: '',
      orderBy: 'CREATED_AT_DESC',
      // categoryId: '',
      listType: 'NFT',
      transactionType: ''
    }
    time = ''
    listType: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'NFT',
        value: 'NFT'
      },
      {
        id: 2,
        title: 'Collection',
        value: 'Collections'
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
    get arrTransactionType(): Array<Record<string, any>> {
      if (!this.isBid && !this.isOffer) {
        return [
          {
            id: 0,
            title: this.$t('nft.filter.list'),
            value: 'LIST,UNLIST'
          },
          {
            id: 1,
            title: this.$t('nft.filter.buy'),
            value: 'BUY'
          },
          {
            id: 2,
            title: this.$t('nft.filter.sell'),
            value: 'SELL'
          },
          {
            id: 3,
            title: this.$t('nft.filter.earn-transfer'),
            value: 'EARN_TRANSFER'
          },
          {
            id: 4,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT,BURN'
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
            title: this.$t('nft.filter.buy'),
            value: 'BUY'
          },
          {
            id: 2,
            title: this.$t('nft.filter.sell'),
            value: 'SELL'
          },
          {
            id: 3,
            title: this.$t('nft.filter.earn-transfer'),
            value: 'EARN_TRANSFER'
          },
          {
            id: 4,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT'
          },
          {
            id: 5,
            title: this.$t('nft.filter.offer'),
            value: 'OFFER,CANCEL_OFFER'
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
            title: this.$t('nft.filter.buy'),
            value: 'BUY'
          },
          {
            id: 2,
            title: this.$t('nft.filter.sell'),
            value: 'SELL'
          },
          {
            id: 3,
            title: this.$t('nft.filter.earn-transfer'),
            value: 'EARN_TRANSFER'
          },
          {
            id: 4,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT,BURN'
          },
          {
            id: 5,
            title: this.$t('nft.filter.bid'),
            value: 'BID,CANCEL_BID'
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
            title: this.$t('nft.filter.buy'),
            value: 'BUY'
          },
          {
            id: 2,
            title: this.$t('nft.filter.sell'),
            value: 'SELL'
          },
          {
            id: 3,
            title: this.$t('nft.filter.earn-transfer'),
            value: 'EARN_TRANSFER'
          },
          {
            id: 4,
            title: this.$t('nft.filter.transfer'),
            value: 'TRANSFER,MINT,BURN'
          },
          {
            id: 5,
            title: this.$t('nft.filter.bid'),
            value: 'BID,CANCEL_BID'
          },
          {
            id: 6,
            title: this.$t('nft.filter.offer'),
            value: 'OFFER,CANCEL_OFFER'
          },
          {
            id: 7,
            title: this.$t('nft.filter.used'),
            value: 'USE_COMPLETED,USE_PENDING,USE_CANCELLED'
          }
        ]
      }
    }
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

    get getArrFilterSaleStatus(): Array<Record<string, any>> {
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

    get arrSorts(): Array<Record<string, any>> {
      if (this.filter.listType === 'Collections' || this.tabActive === 'USED') {
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
      } else {
        return this.sorts
      }
    }
    async created(): Promise<void> {
      this.listCategory = await apiNft.getListCategoryFilter()

      this.filter = {
        ...this.filter,
        ...this.$route.query
      }

      if (this.$route.query.saleStatus === 'undefined') {
        this.filter.saleStatus = ''
      }
      if (this.$route.query.saleType === 'undefined') {
        this.filter.saleType = ''
      }
      if (this.$route.query.network === 'undefined') {
        this.filter.network = ''
      }
      if (this.$route.query.categoryId === 'undefined' || !this.$route.query.categoryId) {
        this.filter.categoryId = ''
      } else {
        this.filter.categoryId = +this.$route.query.categoryId
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
    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }
    handleChangeVerified(): void {
      this.$emit('filter', this.filter)
    }
    handleChangeFilter(id: string): void {
      this.$forceUpdate()
      this.$emit('filter', this.filter)
    }

    resetFilter(): void {
      this.filter = {
        saleType: '',
        orderBy: 'CREATED_AT_DESC',
        categoryId: '',
        listType: 'NFT',
        transactionType: '',
        fromPrice: null,
        toPrice: null,
        price: null,
        network: ''
      }
      this.price = ''
      this.fromPrice = ''
      this.toPrice = ''
      this.valueRange = [0, 0]
      this.time = ''
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-profile-nft {
    margin: 40px 0;
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
              width: 72vw;
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
  }
  ::v-deep.el-form-item {
    &.russian {
      &.all-time,
      &.all-event {
        width: 220px !important;
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
