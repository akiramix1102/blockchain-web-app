<template>
  <div class="be-flex align-center jc-space-between filter-collection">
    <div class="filter-collection__left">
      <el-form class="be-flex form-filter form-collection">
        <el-form-item class="mr-16">
          <el-select v-model="filter.type" popper-class="text-base-nft popper-select-category" disabled>
            <el-option v-for="item in arrType" :key="item.id" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item class="mr-16">
          <el-select v-model="filter.roundId" popper-class="text-base-nft popper-select-category" clearable :placeholder="$t('nft.place-holder.sale-status')">
            <el-option v-for="item in arrRound" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item class="mr-16">
          <el-select v-model="filter.status" popper-class="text-base-nft popper-select-category" :placeholder="$t('nft.place-holder.verify-status')" clearable>
            <el-option v-for="item in arrStatus" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <!--  loc price -->
        <!-- <el-form-item class="mr-16">
          <el-select v-model="filter.price">
            <el-option v-for="item in arrPrice" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item> -->

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
      <div class="cursor mr-16 wrap-sort">
        <el-dropdown trigger="click" @command="handleSort">
          <span class="be-flex align-center">
            <base-icon icon="icon-sort" style="color: #0a0b0d; margin-right: 10px" size="24" class="d-iflex" />
            <span class="nft-body-base" style="color: #0a0b0d">{{ $t('nft.sort.title') }}</span></span
          >
          <el-dropdown-menu class="dropdown-sort-nft" slot="dropdown">
            <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="sortActive === value.command ? 'active' : null" :command="value.command">
              <div class="be-flex">
                <p class="be-flex-item label" :class="sortActive === value.command ? 'label-active' : null">
                  {{ value.label }}
                </p>
                <base-icon v-if="sortActive === value.command && coinMain === 'LYNK'" icon="icon-tick-dropdown" size="16" />
                <base-icon v-if="sortActive === value.command && coinMain === 'CLM'" icon="icon-tick-dropdown-clm" size="16" />
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="be-flex view-type">
        <!-- <div class="cursor item" :class="viewType === 'list' ? 'active' : null" @click="viewType = 'list'">
          <base-icon icon="icon-bullet-list" size="24" class="d-iflex" />
        </div>
        <div class="cursor item" :class="viewType === 'grid' ? 'active' : null" @click="viewType = 'grid'">
          <base-icon icon="icon-view-grid" size="24" class="d-iflex" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const beBase = namespace('beBase')

  interface IFilter {
    type?: string
    roundId?: string
    status?: string
    price?: number
    orderBy?: number
    sortActive?: number
    [x: string]: any
  }
  @Component
  export default class FilterCategory extends Vue {
    @beBase.State('coinMain') coinMain!: string

    numOfProperties = 0
    statusArrow = false
    sortActive = 0
    isVisible = false

    filter: IFilter = {
      type: 'blockchain',
      roundId: '',
      status: '',
      price: 0,
      sortActive: 0
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
    arrRound: Array<Record<string, any>> = [
      {
        id: 0,
        title: 'New',
        value: this.$t('nft.select.new')
      },
      {
        id: 1,
        title: 'ONSALE',
        value: this.$t('nft.select.on-sale')
      },
      {
        id: 2,
        title: 'UPCOMING ',
        value: this.$t('nft.select.up-coming')
      },
      {
        id: 3,
        title: 'CLOSED',
        value: this.$t('nft.select.close')
      }
    ]
    arrStatus: Array<Record<string, any>> = [
      {
        id: 0,
        title: this.$t('nft.select.verify')
      },
      {
        id: 1,
        title: this.$t('nft.select.not-verify')
      }
    ]
    arrPrice: Array<Record<string, any>> = [
      {
        id: 0,
        title: '$0 - $25,000'
      },
      {
        id: 1,
        title: '$25,000 - $50,000'
      }
    ]

    sorts: Array<Record<string, any>> = [
      {
        command: 0,
        label: this.$t('nft.sort.latest')
      },
      {
        command: 1,
        label: this.$t('nft.sort.oldest')
      }
      // ,
      // {
      //   command: 2,
      //   label: this.$t('nft.sort.price-high')
      // },
      // {
      //   command: 3,
      //   label: this.$t('nft.sort.price-low')
      // }
    ]
    @Watch('filter.status') watchStatus(value: string): void {
      console.log('status', value)
      this.$emit('filterChange', { ...this.filter })
    }
    @Watch('filter.roundId') watchStatusSale(value: string): void {
      console.log('status', value)
      this.$emit('filterChange', { ...this.filter })
    }
    handleChange(item: number, event: any): void {
      console.log(item, event)
    }

    handleShowPopper(): void {
      this.isVisible = true
      this.statusArrow = true
      console.log(this.statusArrow)
    }

    handleSort(command: number): void {
      this.sortActive = command
      this.filter.sortActive = command
      this.$emit('filterChange', { ...this.filter })
      console.log('filter', this.filter)
    }

    handleApply(): void {
      this.isVisible = false
    }
    handleReset(): void {
      this.isVisible = false
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.filter-collection {
    .form-collection {
      .el-select {
        width: 240px;
      }
    }
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
