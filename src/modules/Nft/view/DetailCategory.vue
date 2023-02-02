/* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <div class="top-collection">
      <div class="container-nft wrapper">
        <div class="be-flex align-center jc-space-between mb-40 header">
          <div class="nft-header2 text-semibold cursor" style="display: flex">
            <el-dropdown trigger="click" class="dropdown-top-seller" @command="handleCommand">
              <div class="el-dropdown-link text-semibold be-flex align-center">
                <span style="color: #0a0b0d" class="nft-header2">{{ $t('nft.home.explore') }}</span>
                <span style="padding-left: 12px" class="nft-header2 text-hyperlink"></span>
                <!-- <base-icon icon="icon-arrow-down" size="24" style="padding-left: 11px" /> -->
              </div>

              <el-dropdown-menu slot="dropdown" class="dropdown-seller">
                <!-- <el-dropdown-item command="collection">{{ $t('nft.home.collection') }} </el-dropdown-item>
              <el-dropdown-item command="seller">{{ $t('nft.home.seller') }}</el-dropdown-item>
              <el-dropdown-item command="buyer">{{ $t('nft.home.buyer') }}</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>

            <div class="select-categor">
              <el-popover
                :value="isVisible"
                placement="bottom"
                width="200"
                popper-class="popper-detail-category"
                trigger="click"
                @show="handleShowPopper"
                @hide="isVisible = false"
              >
                <div class="popper-category">
                  <div
                    class="cursor category-item"
                    :class="dataFilters.categoryId === item.id ? 'cate-active' : null"
                    v-for="item in listSelectCategory"
                    :key="item.id"
                    @click="handleCliclCategory(item.id)"
                  >
                    <div class="flex wrap-option">
                      <div v-if="item.levelDepth" class="item-name-child nft-header6 text-regular">
                        <span>{{ item.categoryName }}</span>
                      </div>
                      <div v-else class="item-name item-parent nft-header6 text-bold">
                        <span>{{ item.categoryName }} </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="be-flex align-center value-category" slot="reference">
                  <p class="text-bg text-overflow-1">{{ getNameCategory }}</p>
                  <base-icon icon="icon-arrow-bg" size="28" class="d-iflex" style="padding-left: 12px" :class="isVisible ? 'rotate' : null" />
                </div>
              </el-popover>
            </div>
          </div>
        </div>

        <!-- <div class="filter mb-40">
        <el-form class="be-flex form-collection">
          <el-form-item class="mb-0 mr-16">
            <el-select v-model="filter.category">
              <el-option :label="$t('nft.filter.all-category')" :value="1" />
              <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-0 mr-16">
            <el-select v-model="filter.time">
              <el-option v-for="item in time" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-0 mr-16">
            <el-select v-model="filter.category">
              <el-option :label="$t('nft.filter.all-category')" :value="1" />
              <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-0 mr-16">
            <el-select v-model="filter.time">
              <el-option v-for="item in time" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div> -->
        <filter-category @filterChange="handleFilter" style="margin-top: -13px" />

        <div v-if="this.listCategoryDetail.length > 0" id="hot-collection" class="item image-product">
          <swiper-slide class="one-collection" style="cursor: pointer" v-for="item in listCategoryDetail" :key="item.id" @click="hanldeViewCollection(item.id)">
            <img v-if="item.featured" style="object-fit: cover" :src="item.featured" @click="hanldeViewCollection(item.id)" class="one-collection-banner" alt="" />
            <bc-media v-else style="object-fit: cover" class="one-collection-banner" @click="hanldeViewCollection(item.id)" :url="item.featured" :size="32" />
            <div class="sack-avatar" style="cursor: pointer" @click="hanldeViewCollection(item.id)">
              <div v-if="item.isNew == 'YES'" class="sack-avatar-active"></div>
              <bc-media :url="item.avatar" class="sack-avatar-img" :size="18" :radius="80" @click="hanldeViewCollection(item.id)" />
              <!-- <img :src="item.avatar" class="sack-avatar-img" alt="" /> -->
              <base-icon v-if="item.isVerified == 'YES'" icon="icon-verified" size="20" class="d-iflex sack-avatar-tick" />
            </div>
            <div class="one-collection-content" style="cursor: pointer" @click="hanldeViewCollection(item.id)">
              <div style="color: #0a0b0d" class="one-collection-heading text-overflow-1">{{ item.collectionName }}</div>
              <div class="one-collection-by">
                <span class="one-collection-by-title">{{ $t('nft.home.by') }}</span>
                <span class="one-collection-by-name">{{ item.creatorName }}</span>
                <base-icon v-if="item.creatorIsVerified == 'YES'" icon="icon-verified" size="14" class="d-iflex" style="padding-left: 4px" />
              </div>
              <div class="one-collection-des text-overflow-3"><p v-html="item.textDescription"></p></div>
            </div>
          </swiper-slide>
        </div>

        <div v-else style="min-height: 340px">
          <empty-block :show="true" style="min-height: 340px" class="empty" />
        </div>

        <base-pagination
          style="margin-top: -30px"
          :sizeChangeCustom="sizeChange"
          :table="query"
          :info="paginationInfo"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        />
        <!-- <base-pagination :table="query" :info="paginationInfo" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" /> -->

        <!-- <base-pagination :table="query" :info="paginationInfo" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" /> -->
      </div>
    </div>
    <footer-market />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import Hotcollecttion from '../components/HotCollection.vue'
  import FooterMarket from '../components/Footer.vue'
  import FilterCategory from '../components/collection/FilterCategory.vue'
  import { forEach } from 'lodash'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import filter from 'lodash/filter'
  const apiNft: NftRepository = getRepository('nft')

  @Component({ components: { FooterMarket, Hotcollecttion, FilterCategory, EmptyBlock } })
  export default class DetailCategory extends Vue {
    textTitle = this.$t('nft.home.collection')
    projectName = 'Real Estate'
    filter: Record<string, any> = {
      category: 1,
      time: 2
    }
    textDescription = ''
    checkId = true
    sizeChange = true
    language = ''
    query: Record<string, any> = {
      categoryId: 0,
      orderBy: 'CREATED_AT_DESC',
      isVerified: null,
      statusSale: null,
      page: 1,
      limit: 12,
      total: 100
    }
    selected = ''
    categoryName = ''
    isVisible = false

    dataFilters: any = {
      categoryId: null
    }

    categories: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'All categories'
      },
      {
        id: 2,
        title: 'Ethereum'
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

    dataCollection: Array<Record<string, any>> = []

    // @Watch('dataFilters.categoryId') changeCategoryId(id: string | number): void {
    //   const resetParams = { categoryId: id, orderBy: 'CREATED_AT_DESC', isVerified: null, statusSale: null, page: 1, limit: 20, total: 100 }
    //   this.query = resetParams
    //   this.getListCategoryDetail()
    // }
    changeCategoryId(id: string | number): void {
      console.log('id', id)
      if (id == 8) {
        this.checkCss = 8
      } else if (id == 10) {
        this.checkCss = 10
      } else if (id == 3) {
        this.checkCss = 3
      } else if (id == 9) {
        this.checkCss = 9
      } else if (id == 4) {
        this.checkCss = 4
      } else {
        this.checkCss = 0
      }
      console.log('this', this.checkCss)
      // const resetParams = {
      //     ...this.query,
      //     categoryId: id
      //   }
      this.query = { ...this.query, categoryId: id, page: 1, limit: 12 }
      const a = id.toString()
      this.$router.push({ name: 'DetailCategory', params: { id: a } })
      this.getListCategoryDetail()
    }

    hanldeViewCollection(idCollect: string | number): void {
      console.log('id', idCollect)
      window.scroll(0, 0)
      const id1 = idCollect.toString()
      this.$router.push({ name: 'DetailCollection', params: { id: id1 } })
    }
    get paginationInfo(): string {
      return this.$t('paging.collection') as string
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    get getNameCategory(): string {
      if (this.dataFilters.categoryId && this.listSelectCategory.length) {
        //@ts-ignore
        const cate = filter(this.listSelectCategory, elm => elm.id === this.dataFilters.categoryId)[0]
        return cate.categoryName
      }
      return ''
    }

    handleClickLabel(value: any): void {
      console.log('value', value)
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
    listSelectCategory: Array<Record<string, any>> = []
    listCategoryDetail: Array<Record<string, any>> = []

    async getListCategoryDetail(): Promise<void> {
      const params = {
        ...this.query,
        total: null
      }
      try {
        const result = await apiNft.getListDetailCategory(params)
        this.listCategoryDetail = result.content
        this.query.total = result.totalElements

        const language = window.localStorage.getItem('bc-lang')!
        for (let i = 0; i < this.listCategoryDetail.length; i++) {
          const objDesc = JSON.parse(this.listCategoryDetail[i].shortDescription)
          const textDescription = objDesc[language].replace(/\\n/g, '<br>')
          this.listCategoryDetail[i] = {
            ...this.listCategoryDetail[i],
            textDescription: textDescription
          }
        }
      } catch (error: any) {
        const { data } = error.response
        if (data.statusCode === 400) {
          const urlString = this.$route.path
          this.$router.push({ name: 'notFound', params: { urlString } })
        }
      }
      // this.query.total = result.totalElements || 0
      // console.log('result', result.content)
    }
    handleFilter(value: any): void {
      console.log('value', value)
      if (value.sortActive === 0) {
        this.query.orderBy = 'CREATED_AT_DESC'
      } else if (value.sortActive === 1) {
        this.query.orderBy = 'CREATED_AT_ASC'
      } else if (value.sortActive === 2) {
        this.query.orderBy = 'PRICE_DESC'
      } else if (value.sortActive === 3) {
        this.query.orderBy = 'PRICE_ASC'
      }
      if (value.status === 0) {
        this.query.isVerified = 'YES'
      } else if (value.status === 1) {
        this.query.isVerified = 'NO'
      } else {
        this.query.isVerified = ''
      }
      if (value.roundId === 0) {
        this.query.statusSale = 'NEW'
      } else if (value.roundId === 1) {
        this.query.statusSale = 'ONSALE'
      } else if (value.roundId === 2) {
        this.query.statusSale = 'UPCOMING'
      } else if (value.roundId === 3) {
        this.query.statusSale = 'CLOSED'
      } else {
        this.query.statusSale = ''
      }
      this.query.page = 1
      this.getListCategoryDetail()
    }
    handleSizeChange(val: number): void {
      this.query.page = 1
      this.query.limit = val
      this.getListCategoryDetail()
      console.log('size change', val)
    }

    handleCurrentChange(val: number): void {
      console.log('currenchange', val)
      this.query.page = val
      this.getListCategoryDetail()
    }
    // beforeCreate(): void {
    //   window.scroll(0, 0)
    // }
    checkCss = 0
    async created(): Promise<void> {
      if (localStorage.getItem('bc-lang')) {
        this.language = localStorage.getItem('bc-lang')?.toString() as string
      }
      this.query.categoryId = this.$route.params.id

      this.getListCategoryDetail()
      try {
        this.dataFilters.categoryId = +this.$route.params.id
        this.listSelectCategory = await apiNft.getListCategoryFilter()

        // for (let i = 0; i < this.listSelectCategory.length; i++) {
        //   this.listSelectCategory[i].categoryName = this.listSelectCategory[i].categoryName + ' ｖ'
        // }
        console.log('list', this.listSelectCategory)
      } catch (error) {
        console.log(error)
      }
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

    handleCliclCategory(id: number): void {
      this.isVisible = false
      this.dataFilters.categoryId = id
      this.query = { ...this.query, categoryId: id, page: 1, limit: 12 }
      this.getListCategoryDetail()
    }

    handleShowPopper(): void {
      this.isVisible = true
    }
  }
</script>

<style scoped lang="scss">
  .select-category-dropdown {
    .el-input__suffix {
      right: -7px;
      // display: none;
      right: 140px;
      top: -4px;
      transition: all 0.3s;
    }
  }
  ::v-deep.img.d-block {
    object-fit: cover !important;
  }
  .empty-block.empty {
    text-align: center;
    .span-icon {
      font-size: 150px !important;
    }
    .empty-text {
      color: #8f8f8f;
    }
  }
  ::v-deep.base-pagination {
    padding-bottom: 38px !important;
    border: none !important;
    // margin-top: -90px;
    /* border-top: 1px solid #dbdbdb; */
  }
  ::v-deep.dropdown-menu {
    left: 1243px !important;
  }
  ::v-deep.el-select-dropdown.el-popper {
    width: 256px !important;
  }
  .hide-option {
    display: none;
  }
  .wrap-option {
    margin-top: 10px;
    .item-name {
      display: block;
      width: 285px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 5px;
      color: #0a0b0d;
    }
    .item-name:hover {
      display: block;
      width: 285px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 5px;
      color: #0a0b0d;
      background: var(--bc-menu-active);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  ::v-deep .el-popper.popper-detail-category .popper-category .category-item .wrap-option .item-name-child {
    padding-left: 35px;
    padding-right: 35px;

    .item-name-child {
      font-size: 14px;
      display: block;
      width: 285px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 35px;
      color: #0a0b0d;
    }
    .item-name-child:hover {
      font-size: 14px;
      display: block;
      width: 285px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 5px;
      color: #0a0b0d;
      background: var(--bc-menu-active);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .item-parent {
      color: #0a0b0d;
    }
  }
  .child-option {
    margin-left: 15px;
  }
  ::v-deep.base-pagination .info {
    color: #5b616e !important;
  }
  .pagination {
    margin-left: auto;
    order: 2;
  }
  ::v-deep.button.btn-next {
    transform: rotate(90deg) !important;
  }
  ::v-deep.el-pagination .btn-next .el-icon,
  .el-pagination .btn-prev .el-icon {
    display: block;
    font-size: 12px;
    font-weight: 700;
    transform: rotate(90deg) !important;
  }
  .el-select-dropdown.el-popper {
    min-width: 130px;
    transform-origin: center top;
    z-index: 2011;
    position: absolute;
    top: 2031px;
    left: 979px;
  }
  .image-product {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    // max-width: 840px;
    flex-wrap: wrap;
    margin-top: 40px;
    margin-bottom: 28px;
    // min-height: 500px;
  }
  ::v-deep .button.btn-next {
    transform: rotate(90deg) !important;
  }
  #hot-collection {
    .one-collection.swiper-slide {
      margin-right: 20px;
      margin-bottom: 28px;
    }
    .one-collection.swiper-slide:hover {
      // transform: translateY(-2px);
      // box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      // transition: linear 0.1s;
    }
    // margin-bottom: 46px;
    position: relative;
    .wrap-top-collection {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      overflow: hidden;
      padding-bottom: 40px;
    }
    .one-collection {
      width: 285px;
      height: 380px;
      position: relative;
      border: 1px solid #dbdbdb;
      // box-shadow: 0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13);
      border-radius: 8px;
      background: #ffffff;
      overflow: hidden;
      &-banner {
        width: 285px;
        height: 160px;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover !important;
      }
      .sack-avatar-tick {
        position: absolute;
        right: 0px !important;
        bottom: 0px !important;
      }
      .one-collection-des {
        margin-top: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;

        margin-left: 16px !important;
        margin-right: 16px !important;
        align-items: left;
        // height: 70px;
        // overflow: hidden;
        // text-overflow: ellipsis !important;
      }
      .sack-avatar-active {
        position: absolute;
        top: 5px !important;
        right: 7px !important;
        background: #129961;
        width: 10px;
        height: 10px;
        z-index: 10;
        border-radius: 50%;
        border: 1px solid #fff;
        box-shadow: 0px 0.6px 1.8px rgb(0 0 0 / 10%), 0px 3.2px 7.2px rgb(0 0 0 / 13%);
      }
      .sack-avatar-img {
        position: relative;
        width: 64px;
        height: 64px;
        object-fit: contain;
        border-radius: 40px !important;
        border: 3px solid #fff !important;
        filter: drop-shadow(0px 0.6px 1.8px rgba(0, 0, 0, 0.1)) drop-shadow(0px 3.2px 7.2px rgba(0, 0, 0, 0.13));
      }
      .sack-avatar {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-40%, -40%);
        &-img {
          position: relative;
        }
        &-tick {
          position: absolute;
          right: 7px;
          bottom: 17px;
        }
        &-active {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #129961;
          width: 10px;
          height: 10px;
          z-index: 10;
          border-radius: 50%;
          border: 1px solid #fff;
          box-shadow: 0px 0.6px 1.8px rgb(0 0 0 / 10%), 0px 3.2px 7.2px rgb(0 0 0 / 13%);
        }
      }
      &-content {
        width: 100%;
        position: absolute;
        z-index: 1;
        top: 52%;
        left: 0;
        text-align: center;
      }
      &-heading {
        font-size: 20px;
        line-height: 24px;
        font-weight: 500;
        color: var(--bc-text-market-primary);
        padding: 0 16px;
      }
      &-by {
        margin-top: 4px;
        &-title {
          font-size: 14px;
          line-height: 24px;
          font-weight: 400;
          color: #5b616e;
          margin-right: 5px;
        }
        &-name {
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
          color: #5087fd;
        }
      }
      &-des {
        margin-top: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
      }
    }
    .btn-crousel {
      top: 45%;
      z-index: 2;
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
    }
    .prev {
      left: -29px;
    }
    .next {
      right: -29px;
    }
  }
  ::v-deep.top-collection {
    margin-top: 80px;
    .wrapper {
      padding-top: 40px;
      .header {
        .text-first {
          color: var(--bc-text-market-primary);
        }
      }
      .form-collection {
        .el-select {
          width: 160px;
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
                color: var(--bc-text-market-primary);
                .content {
                  color: var(--bc-text-market-primary);
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
          // margin-top: -40px;
          padding: 40px 0 60px;
          .info {
            color: var(--bc-text-discript);
          }
        }
      }
    }
    .value-category {
      transition: transform 0.3s;
      .svg-icon {
        transition: transform 0.3s;
      }
      .rotate {
        transition: linear 0.3s;

        .svg-icon {
          transition: transform 0.3s;
          transform: rotate(-180deg);
        }
      }
    }
  }
</style>
