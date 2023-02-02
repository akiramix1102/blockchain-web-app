<template>
  <section class="sack-banner-clm">
    <div name="el-fade-in-linear">
      <div class="sack-baner-back isHiddeen_662">
        <img src="../../../../assets/images/maketCLM/BannerLeft.png" alt="" class="banner-left effect-content" />
        <img src="../../../../assets/images/maketCLM/BannerCenter.png" alt="" class="banner-center effect-content" />
        <img src="../../../../assets/images/maketCLM/BannerRight.png" alt="" class="banner-right effect-content" />
      </div>
    </div>
    <div class="container-banner">
      <div class="sack-banner-clm-swaper">
        <div class="sack-banner-clm-title">Invest in real estate with crypto, cleverly</div>
        <!-- <div class="sack-banner-clm-description">Join the world's first NFT marketplace to make money on US real estate and beyond</div> -->
        <div class="wrap-select">
          <div class="banner-select" @click="handleActive('nft')" :class="Active === 'nft' ? 'isActive' : null">NFT</div>
          <div class="banner-select" @click="handleActive('collection')" :class="Active === 'collection' ? 'isActive' : null">Collection</div>
          <!-- <div class="banner-select" @click="Active = 'people'" :class="Active === 'people' ? 'isActive' : null">People</div> -->
        </div>
        <div class="wrap-search" v-if="Active === 'nft'">
          <el-select
            v-model="searchNft"
            filterable
            remote
            reserve-keyword
            :placeholder="$t('enter-nft')"
            popper-class="select-banner-clm"
            :remote-method="handleFilterNft"
            :loading="loading"
            @change="handleDetail"
            @blur="handleBlur"
          >
            <div v-infinite-scroll="loadMore" infinite-scroll-delay="500">
              <el-option v-for="(item, index) in options" :key="index" :label="item.itemName" :value="item.id">
                <div class="be-flex align-center">
                  <img :src="item.avatar" alt="" style="width: 48px; height: 48px; border-radius: 4px" />
                  <div class="flex-column banner-clm-information">
                    <p class="information-name">{{ item.itemName }}</p>
                    <div class="information-detail">
                      <p v-if="item.totalListing">{{ item.totalListing }}</p>
                      <p v-else>0</p>
                      /
                      <p>{{ item.totalSupply }}</p>
                      <p v-if="item.totalSupply == 1" style="margin-left: 5px">for sale</p>
                      <p v-else style="margin-left: 5px">for sales</p>
                      <div v-if="item.categoryName" class="saletype">{{ item.categoryName }}</div>
                    </div>
                  </div>
                </div>
              </el-option>
            </div>
          </el-select>
          <!-- <input type="text" v-if="Active === 'people'" class="input-search" :placeholder="$t('enter-wallet-email')" v-model="searchEmail" @keyup.enter="handleSearch" />
          <input type="text" v-if="Active === 'nft'" class="input-search" :placeholder="$t('enter-nft')" v-model="searchNft" @keyup.enter="handleSearch" />
          <input type="text" v-if="Active === 'collection'" class="input-search" :placeholder="$t('enter-collection')" v-model="searchCollection" @keyup.enter="handleSearch" /> -->
          <button class="btn btn-search" @click="handleSearch">
            <base-icon icon="search-clm" size="24" />
          </button>
        </div>
        <div class="wrap-search" v-if="Active === 'collection'">
          <el-select
            v-model="searchCollection"
            filterable
            remote
            reserve-keyword
            :placeholder="$t('enter-collection')"
            popper-class="select-banner-clm"
            :remote-method="handleFilterCollection"
            :loading="loading"
            @change="handleDetailCollection"
            @blur="handleBlur"
          >
            <div v-infinite-scroll="loadMore" infinite-scroll-delay="500">
              <el-option v-for="(item, index) in optionsCollection" :key="index" :label="item.collectionName" :value="item.id">
                <div class="be-flex align-center">
                  <img :src="item.avatar" alt="" style="width: 48px; height: 48px; border-radius: 50%" />
                  <div class="flex-column banner-clm-information">
                    <p class="information-name">{{ item.collectionName }}</p>
                    <div class="information-detail">
                      <p v-if="item.numOfItems">{{ item.numOfItems }}</p>
                      <p v-else>0</p>
                      <p style="margin-left: 5px">items</p>
                      <!-- /
                      <p>{{ item.totalSupply }}</p>
                      <p v-if="item.totalSupply == 1" style="margin-left: 5px">for sale</p>
                      <p v-else style="margin-left: 5px">for sales</p>
                      <div v-if="categryName" class="saletype">{{ item.categryName }}</div> -->
                    </div>
                  </div>
                </div>
              </el-option>
            </div>
          </el-select>

          <button class="btn btn-search" @click="handleSearch">
            <base-icon icon="search-clm" size="24" />
          </button>
        </div>
        <div class="wrap-search" v-if="Active === 'people'">
          <el-select
            v-model="searchPeople"
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            popper-class="select-banner-clm"
            :remote-method="handleFilterPeople"
            :loading="loading"
            @change="handleDetailPeople"
          >
            <div v-infinite-scroll="loadMore" infinite-scroll-delay="500">
              <el-option v-for="(item, index) in optionsPeople" :key="index" :label="item.itemName" :value="item.id">
                <div class="be-flex align-center">
                  <img :src="item.avatar" alt="" style="width: 48px; height: 48px; border-radius: 4px" />
                  <div class="flex-column banner-clm-information">
                    <p class="information-name">{{ item.itemName }}</p>
                    <div class="information-detail">
                      <p v-if="item.totalListing">{{ item.totalListing }}</p>
                      <p v-else>0</p>
                      /
                      <p>{{ item.totalSupply }}</p>
                      <p v-if="item.totalSupply == 1" style="margin-left: 5px">for sale</p>
                      <p v-else style="margin-left: 5px">for sales</p>
                      <div v-if="categryName" class="saletype">{{ item.categryName }}</div>
                    </div>
                  </div>
                </div>
              </el-option>
            </div>
          </el-select>

          <button class="btn btn-search" @click="handleButtonFilterNft">
            <base-icon icon="search-clm" size="24" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  import { trim, includes, debounce } from 'lodash'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  const apiNft2: NftRepositoryV2 = getRepository('nftv2')
  @Component({ components: {} })
  export default class TheBanner extends Vue {
    Active = 'nft'
    searchNft = ''
    checkSearch = ''
    searchCollection = ''
    searchPeople = ''
    options: Array<Record<string, any>> = []
    optionsCollection: Array<Record<string, any>> = []
    optionsPeople: Array<Record<string, any>> = []
    value: Array<Record<string, any>> = []
    valueCollection: Array<Record<string, any>> = []
    list: Array<Record<string, any>> = []
    loading = false
    query = {
      page: 1,
      limit: 10
    }
    limit = 10

    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.loading = false
    //       this.options = this.list.filter(item => {
    //         console.log('item', item)
    //         return item.itemName.toLowerCase().indexOf(query.toLowerCase()) > -1
    //       })
    //     }, 200)
    //   } else {
    //     this.options = []
    //   }
    // }
    handleDetail(item): void {
      this.$router.push({
        name: 'DetailNftItem',
        params: { id: item }
      })
    }
    handleDetailCollection(item): void {
      this.$router.push({
        name: 'DetailCollection',
        params: { id: item }
      })
    }
    handleDetailPeople(item): void {
      this.$router.push({
        name: 'UserProfile',
        params: { id: item }
      })
    }
    loadMore(): void {
      if (this.Active === 'collection') {
        this.limit += 20
        const params = {
          search: this.searchCollection,
          limit: this.limit
        }
        apiNft.getListDetailCategory(params).then(res => {
          this.optionsCollection = res.content
        })
      }
      if (this.Active === 'people') {
        this.limit += 20
        const params = {
          search: this.searchPeople,
          limit: this.limit
        }
        apiNft2.getListAccount(params).then(res => {
          this.optionsPeople = res.content
        })
      } else {
        this.limit += 20
        const params = {
          search: this.searchNft,
          limit: this.limit
        }
        apiNft.getListItemInCollection(params).then(res => {
          this.options = res.content
        })
      }
    }
    handleBlur(): void {
      this.searchNft = ''
      this.searchCollection = ''
    }
    // handleClear(): void {
    //   this.options = []
    //   this.limit = 20
    //   this.searchNft = ''
    // }

    // handleDebounceFilter = debounce((query: string) => {
    //   if (this.Active === 'collection') {
    //     console.log('collection')
    //     this.handleFilterCollection(query)
    //   }
    //   if (this.Active === 'nft') {
    //     console.log('nft')
    //     this.handleFilterNft(query)
    //   }
    // }, 500)
    handleFilterNft(query) {
      if (query !== '') {
        this.loading = true
        this.searchNft = trim(query)
        this.checkSearch = trim(query)
        this.limit = 20
        const params = {
          search: this.searchNft,
          limit: 20
        }
        apiNft.getListItemInCollection(params).then(res => {
          this.loading = false
          this.options = res.content
        })
      } else {
        this.options = []
        this.searchNft = ''
      }
    }
    handleFilterPeople(query) {
      if (query !== '') {
        this.loading = true
        this.searchPeople = trim(query)
        this.limit = 20
        const params = {
          search: this.searchPeople,
          limit: 20
        }
        apiNft2.getListAccount(params).then(res => {
          this.loading = false
          this.optionsPeople = res.content
        })
      } else {
        this.optionsPeople = []
        this.searchNft = ''
      }
    }
    // handleButtonFilter(item) {
    //   console.log('ab', item)
    //   const valueSearchNft = this.searchNft
    //   // console.log('searcha', this.searchNft)
    //   this.handleFilterNft(valueSearchNft)
    // }
    // handleFilterNft(query: string, isFirst = false): void {
    //   if (query !== '') {
    //     this.searchNft = trim(query)
    //     this.limit = 20
    //     const params = {
    //       search: this.searchNft,
    //       limit: 20
    //     }
    //     apiNft.getListItemInCollection(params).then(res => {
    //       console.log('res', res)
    //       this.options = res.content
    //       if (isFirst) {
    //         this.options = res.content
    //       }
    //     })
    //   } else {
    //     this.limit = 20
    //     this.searchNft = ''
    //     this.options = [...this.options]
    //   }
    // }

    handleFilterCollection(query) {
      if (query !== '') {
        this.loading = true
        this.searchCollection = trim(query)
        this.limit = 20
        const params = {
          search: this.searchCollection,
          limit: 20
        }
        apiNft.getListDetailCategory(params).then(res => {
          this.optionsCollection = res.content
          this.loading = false
        })
      } else {
        // this.limit = 20
        this.searchCollection = ''
        this.optionsCollection = []
      }
    }
    handleActive(item) {
      if (item === 'nft') {
        this.Active = 'nft'
        this.searchCollection = ''
      }
      if (item === 'collection') {
        this.Active = 'collection'
        this.searchNft = ''
      }
    }
    // id = 'all'
    handleSearch() {
      if (this.searchNft) {
        this.$router.push({
          name: 'DetailCategory',
          params: { id: 'all' },
          query: { search: this.searchNft, saleType: '', orderBy: 'CREATED_AT_DESC', isVerified: '', tabActive: 'NFT' }
        })
      }
      if (this.searchCollection) {
        this.$router.push({
          name: 'DetailCategory',
          params: { id: 'all' },
          query: { search: this.searchCollection, saleType: '', orderBy: 'CREATED_AT_DESC', isVerified: '', tabActive: 'Collection' }
        })
      } else {
        console.log('bc')
      }
    }
  }
</script>

<style lang="scss">
  .sack-banner-clm {
    height: 700px;
    width: 100%;
    position: relative;
    overflow: hidden;
    .banner-left {
      position: absolute;
      left: 0px;
      top: 0;
      z-index: 10;
      height: 700px;
    }
    .banner-center {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
      right: 0;
      max-width: 1920px;
    }
    .banner-right {
      position: absolute;
      bottom: 0px;
      right: 0px;
      z-index: 10;
      max-width: 100%;
      height: 700px;
    }
    .container-banner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      max-width: 1240px;
      padding: 0 20px;
      margin: 0 auto;
      width: 100%;
    }
    .sack-banner-clm-swaper {
      max-width: 590px;
      width: 100%;
      position: relative;
      z-index: 20;
    }
    .sack-banner-clm-title {
      font-weight: 600;
      font-size: 56px;
      line-height: 64px;
      letter-spacing: -0.02em;
      color: #151718;
    }
    .sack-banner-clm-description {
      line-height: 24px;
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 40px;
    }

    .wrap-search {
      display: flex;
      align-items: center;
      .input-search {
        height: 48px;
        width: 448px;
        border: none;
        padding: 0 20px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: var(--bc-text-disabled);
      }
      .btn-search {
        outline: none;
        border: none;
        padding: 12px 12px;
        border-radius: 8px;
        border-top-left-radius: unset;
        border-bottom-left-radius: unset;
      }
    }
    .wrap-select {
      display: flex;
      .banner-select {
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        color: var(--bc-text-disabled);
        margin-right: 24px;
        margin-top: 40px;
        margin-bottom: 27px;
        cursor: pointer;
      }
    }
    .isActive {
      border-bottom: 1px solid var(--bc-text-discript);
      color: var(--bc-text-discript) !important;
    }

    @media all and (max-width: 1024px) {
      .sack-banner-clm-title {
        font-weight: 600;
        font-size: 40px;
        line-height: 48px;
      }
      .sack-banner-clm-description {
        line-height: 32px;
        margin: 24px 0 40px 0px;
        font-weight: 500;
      }
    }

    @media (max-width: 767px) {
      background: url(../../../../assets/images/maketCLM/back-mobile-clm.png) no-repeat;
      background-size: 100%;
      top: -8px;
      .mt20_662 {
        margin-top: 20px;
      }
      .isHiddeen_662 {
        display: none;
      }
      .sack-banner-clm-title {
        font-weight: 600;
        font-size: 32px;
        line-height: 40px;
        text-align: center;
      }
      .sack-banner-clm-swaper {
        margin: 0 auto;
      }
      .wrap-search {
        margin-top: 20px;
        justify-content: center;
        width: 100%;

        .el-select {
          width: calc(100% - 48px);
          .el-input--suffix {
            .el-input__inner {
              width: 100% !important;
            }
          }
        }
      }

      .container-banner {
        top: 19%;
      }
      .mr0 {
        margin-right: 0px;
      }
      .sack-banner-clm-description {
        font-size: 24px;
        line-height: 28px;
        display: none;
      }
      .wrap-select {
        justify-content: center;
        .banner-select {
          margin-top: 30px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
