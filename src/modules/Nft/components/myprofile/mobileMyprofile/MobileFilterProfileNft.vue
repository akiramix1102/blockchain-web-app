<template>
  <div class="be-flex align-center jc-space-between container-nft filter-profile-nft">
    <div class="filter-profile-nft__left">
      <el-form class="be-flex form-filter">
        <el-form-item v-if="tabActive === 'ON_SALE' || tabActive === 'OWNED' || tabActive === 'USED'" class="mr-12">
          <el-select
            class="w-100"
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
        <!-- <el-form-item v-if="isBuy && isBid && tabActive !== 'ACTIVITIES' && filter.listType === 'NFT'" class="mr-16" style="width: 275px">
          <el-select style="width: 100%" v-model="filter.saleType" @change="handleChangeFilter" :placeholder="$t('placeholder.sale-type')" clearable>
            <el-option v-for="item in getArrFilterSaleStatus" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="tabActive === 'CREATED' || tabActive === 'FAVOURITE'" class="mr-12">
          <el-select class="w-100" v-model="filter.listType" popper-class="text-base-nft" @click="handleResetFilter" @change="handleChangeFilter">
            <el-option v-for="item in listType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabActive === 'ACTIVITIES'" class="mr-12">
          <el-select class="w-100" v-model="filter.transactionType" @change="handleChangeFilter" :placeholder="$t('placeholder.all-event')" clearable>
            <el-option v-for="item in arrTransactionType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="cursor button" @click="handleSetOpenDrawer">
      <base-icon icon="icon-filter" class="d-iflex" />
    </div>
    <base-drawer class="drawer" name="filter-profile" title="Filter" size="100%" :reset="handleResetFilter">
      <div class="blockchain">
        <!-- <div v-if="tabActive !== 'ACTIVITIES'">
          <span class="text-semibold nft-body-base-small">Category</span>
          <el-form>
            <el-form-item class="mr-16" style="width: 100%; margin-top: 8px">
              <el-select class="w-100" v-model="filter.categoryId" 
              popper-class="text-base-nft popper-explore-select-category" 
              :placeholder="$t('nft.place-holder.category')" @change="handleChangeFilter">
                <el-option
                  v-for="item in listCategory"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                  :class="!item.levelDepth ? 'item-parent' : item.levelDepth > 1 ? 'item-child-last' : 'item-child'"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div> -->

        <!-- <el-form-item class="mr-16">
          <el-select class="text-dropdown text-base-nft">Action 1</el-select>
        </el-form-item> -->
      </div>
      <div v-if="tabActive === 'ACTIVITIES'">
        <span class="text-semibold nft-body-base-small">Event</span>

        <el-form>
          <el-form-item class="mr-16" style="width: 100%">
            <el-select
              style="width: 100%; margin-top: 8px"
              v-model="filter.transactionType"
              popper-class="text-base-nft popper-explore-select-category "
              :placeholder="$t('placeholder.all-event')"
            >
              <el-option v-for="item in arrTransactionType" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="tabActive === 'ACTIVITIES'">
        <span class="text-semibold nft-body-base-small">Time</span>

        <el-form>
          <el-form-item class="mr-16" style="width: 100%">
            <el-select
              style="width: 100%; margin-top: 8px"
              v-model="time"
              popper-class="text-base-nft popper-explore-select-category "
              :placeholder="$t('placeholder.all-time')"
              @change="handleChangeTime"
            >
              <el-option v-for="item in arrTime" :key="item.id" :label="item.title" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="sale_type" v-if="tabActive !== 'ACTIVITIES' && query.listType === 'NFT'">
        <span class="text-semibold nft-body-base-small">Blockchain</span>
        <div>
          <el-row style="margin-top: 8px" class="button_saletype">
            <el-select class="w-100" v-model="filter.network" clearable placeholder="Blockchain" popper-class="text-base-nft" @change="handleChangeFilter">
              <el-option label="Ethereum" value="ERC20" />
              <el-option label="BSC" value="BEP20" />
            </el-select>
          </el-row>
        </div>
      </div>

      <div class="sale_type" v-if="isBuy && isBid && tabActive !== 'ACTIVITIES' && tabActive !== 'USED' && query.listType === 'NFT'">
        <span class="text-semibold nft-body-base-small">{{ $t('placeholder.sale-type') }}</span>
        <div>
          <el-row style="margin-top: 8px" class="button_saletype">
            <el-button
              :class="idClass === item.id ? 'active' : null"
              v-model="filter.saleType"
              class="saletype_item"
              v-for="item in getArrFilterSaleStatus"
              :key="item.id"
              @click="handleSelectSaleType(item)"
              >{{ item.title }}</el-button
            >
          </el-row>
        </div>
      </div>

      <div class="sale_type" v-if="query.listType === 'Collections'">
        <span class="text-semibold nft-body-base-small">{{ $t('placeholder.verify-status') }}</span>
        <div>
          <el-row style="margin-top: 8px" class="button_saletype">
            <!-- <el-button class="saletype_item" v-for="item in arrIsVerified" :key="item.id"  :value="item.value">{{item.title}}<el-button/> -->
            <el-button :class="idClass === item.id ? 'active' : null" class="saletype_item" v-for="item in arrIsVerified" :key="item.id" @click="handleVerified(item)">{{
              item.title
            }}</el-button>
          </el-row>
        </div>
      </div>

      <div v-if="((tabActive !== 'ACTIVITIES' && query.listType === 'NFT') || filter.listType === 'NFT') && tabActive !== 'USED'" class="price">
        <span class="text-semibold nft-body-base-small">Price</span>
        <div class="wrap-inside">
          <div class="wrap-form">
            <el-form class="be-flex jc-space-between" style="height: 24px; margin-bottom: 24px">
              <el-form-item class="mr-16" style="border: none">
                <el-input
                  v-model="getFromPrice"
                  :placeholder="'$0 '"
                  disabled
                  clearable
                  @keypress.native="onlyNumber($event, 'fromPrice')"
                  @keyup.native="numberFormat($event)"
                  class="price-inputs"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  class="price-to"
                  :placeholder="'$5,000,000+ '"
                  v-model="getToPrice"
                  disabled
                  clearable
                  @keypress.native="onlyNumber($event, 'toPrice')"
                  @keyup.native="numberFormat($event)"
                />
              </el-form-item>
              <div v-if="isErrorFrom" class="error-amount">
                <p>{{ $t('nft.error-from') }}</p>
              </div>
            </el-form>
            <el-slider v-model="valueRange" range :max="maxPrice" :format-tooltip="formatTooltip" tooltip-class="tooltip-price" @change="changeSlider" ref="rangeSlider">
            </el-slider>
          </div>
        </div>
      </div>

      <div class="sort">
        <span class="text-semibold nft-body-base-small">Sort by</span>
        <el-form>
          <el-form-item class="mr-16" style="width: 100%">
            <el-select style="width: 100%; margin-top: 8px" v-model="filter.orderBy" popper-class="text-base-nft popper-explore-select-category " placeholder="Sort">
              <!-- <el-option
                v-for="(value, index) in arrSorts"
                :key="index"
                :label="value.label"
                :class="filter.orderBy === value.command ? 'active' : null"
                :command="value.command"
              /> -->
              <el-option v-for="(value, index) in arrSorts" :key="index" :label="value.label" :value="value.command"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="apply-btn">
        <el-button
          class="el-button nft-header6 text-semibold text-center bid el-button-custom el-button--default btn-apply"
          :value="isVisible"
          @show="handleShowPopper"
          @hide="isVisible = false"
          @click="handleApplyFilter"
          @change="changeSlider"
          >Apply</el-button
        >
      </div>
    </base-drawer>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import DrawerMixin from '@/mixins/drawer'
  import find from 'lodash/find'

  import FilterPriceNft from '@/mixins/filterPriceNft'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const base = namespace('beBase')
  @Component
  export default class FilterProfileNft extends Mixins(FilterPriceNft, DrawerMixin) {
    @Prop({ required: false, type: Array, default: () => [] }) listCategory!: Array<Record<string, any>>
    @Prop({ required: false, type: String, default: 'ON_SALE' }) tabActive!: string
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>

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
    isAddClass = false
    idClass = 0

    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }
    handleChangeVerified(): void {
      this.$emit('filter', this.filter)
    }
    handleChangeFilter(): void {
      this.$forceUpdate()
      this.$emit('filter', this.filter)
    }

    handleApplyFilter(): void {
      this.handleApply()
      this.setOpenDrawer({
        drawerName: 'filter-profile',
        isOpen: false
      })
      // this.$emit('filter', this.filter)
    }

    get setFrom(): any {
      return '$' + this.fromPrice
    }
    get setTo(): any {
      return '$' + this.toPrice
    }
    @Watch('filter.listType') handleWatchRoute(valueNew): void {
      console.log('changelistType')
      this.idClass = 0
      if (valueNew === 'NFT') {
        console.log('NFT filter')
        this.filter = {
          orderBy: 'CREATED_AT_DESC',
          categoryId: '',
          listType: 'NFT',
          transactionType: ''
        }
        this.query.isVerified = ''
        this.query.saleType = ''
        this.price = ''
        this.fromPrice = ''
        this.toPrice = ''
        ;(this.valueRange = [0, 0]), (this.time = '')
        this.idClass = 0
      } else if (valueNew === 'Collections') {
        console.log('Collections filter')
        this.filter = {
          orderBy: 'CREATED_AT_DESC',
          categoryId: '',
          listType: 'Collections',
          transactionType: ''
        }
        this.query.listType = 'Collections'
        this.query.isVerified = ''
        this.query.saleType = ''

        this.idClass = 0
      }
    }
    handleResetFilter(): void {
      if ((this.tabActive !== 'ACTIVITIES' && this.query.listType === 'NFT') || this.filter.listType === 'NFT') {
        this.filter = {
          saleType: '',
          orderBy: 'CREATED_AT_DESC',
          categoryId: '',
          listType: 'NFT',
          transactionType: '',
          isVerified: ''
        }

        this.price = ''
        this.fromPrice = ''
        this.toPrice = ''
        ;(this.valueRange = [0, 0]), (this.time = '')
        this.idClass = 0
      }

      //this.$emit('filter', this.filter)
      if ((this.tabActive !== 'ACTIVITIES' && this.query.listType === 'Collections') || this.filter.listType === 'Collections') {
        console.log('pipidoncy')
        this.filter = {
          saleType: '',
          orderBy: 'CREATED_AT_DESC',
          categoryId: '',
          listType: 'Collections',
          transactionType: '',
          isVerified: ''
        }
        this.query.listType = 'Collections'
        this.idClass = 0

        // this.query = {
        //   page: 1,
        //   limit: 12,
        //   listType: 'Collections',
        //   orderBy: 'CREATED_AT_DESC',
        //   total: 0
        // }
      }
      this.isErrorFrom = false
      this.fromPrice = ''
      this.toPrice = ''
      this.price = ''
      this.filter.toPrice = null
      this.filter.fromPrice = null
      this.$emit('filter', this.filter)
      this.$set(this.valueRange, 0, 0)
      this.$set(this.valueRange, 1, 0)
      console.log('refs', this.$refs.rangeSlider)
      //@ts-ignore
      this.$refs.rangeSlider.setValues()
    }
    drawer = false
    direction = 'ltr'
    handleSetOpenDrawer(): void {
      this.setOpenDrawer({
        drawerName: 'filter-profile',
        isOpen: true
      })
    }
    handleSelectSaleType(item): void {
      this.filter.saleType = item.value
      this.idClass = item.id
      // if (this.idClass !== item.id) {
      //   this.idClass = 0
      // }
    }
    handleVerified(item): void {
      this.filter.isVerified = item.value
      this.idClass = item.id
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
    get getFromPrice(): string {
      return this.fromPrice === '' ? '$ 0' : '$ ' + this.fromPrice
    }
    get getToPrice(): string {
      return this.toPrice === '' ? '$5,000,000+' : '$ ' + this.toPrice
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
      ;(this.valueRange = [0, 0]), (this.time = '')
      this.idClass = 0
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-profile-nft {
    margin-bottom: 24px;

    &__left {
      width: 100%;
      .form-filter {
        .el-form-item {
          width: 100%;
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

        .el-form-item.price {
          .el-input__inner {
            padding-left: 44px;
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
    .price-to {
      .el-input__inner {
        border: none;
        background-color: #fff;
        padding: 0;
        color: #5b616e;
        text-align: right;
        &::placeholder {
          font-size: 16px;
          line-height: 24px;
          color: #5b616e;
        }
      }
    }
    .price {
      .el-input__inner {
        border: none;
        background-color: #fff;
        padding: 0;
        color: #5b616e;

        &::placeholder {
          font-size: 16px;
          line-height: 24px;
          color: #5b616e;
        }
      }
      .to-price {
        .el-input__inner {
          text-align: right;
        }
      }
      .el-slider__bar {
        background: var(--bc-theme-primary-gradient);
      }
      .el-slider__button {
        border-color: var(--bc-theme-primary-gradient-hover);
        width: 20px;
        height: 20px;
      }
    }
    .apply-btn {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 32px;
      bottom: 0;
      .btn-apply {
        font-size: 16px;
        line-height: 24px;
        padding: 8px 20px !important;
        font-weight: 600;
        border-radius: 6px;
        outline: none;
        cursor: pointer;
        background: var(--bc-theme-primary-gradient);
        color: var(--bc-color-white);
      }
      .el-button {
        width: 335px;
      }
    }
    .sale_type {
      margin-bottom: 32px;
      .el-row {
        display: flex;
        justify-content: space-between;
        .el-button {
          width: 161px;
          // &:hover {
          //   border: 1px solid;
          //   border-color: var(--bc-text-footer-about);
          //   color: #0a0b0d !important;
          //   background-color: #fff;
          // }
        }
        .active {
          border: 1px solid;

          border-color: var(--bc-text-footer-about);
          color: #0a0b0d !important;
          background-color: #fff;
        }
      }
      // .el-radio-group {
      //   display: flex;
      //   width: 100%;
      //   justify-content: space-between;
      //   .el-radio-button {
      //     width: 161px;
      //     .el-radio-button__inner {
      //       width: 100%;
      //       border: 1px solid;
      //     }
      //     .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      //       border-color: var(--bc-text-footer-about);
      //       color: #0a0b0d !important;
      //       background-color: #fff;
      //     }
      //   }
      // }
    }
    .button {
      border: 1px solid #dbdbdb;
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      padding: 16px;
      .span-icon {
        line-height: 1rem;
        .svg-icon {
          vertical-align: 0 !important;
        }
      }
    }
    &__right {
      .wrap-sort {
        &:hover {
          .span-icon {
            color: var(--bc-color-dropdown) !important;
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
</style>
