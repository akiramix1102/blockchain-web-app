<template>
  <div class="list-category">
    <div class="nft-header3 text-semibold text-center mb-40">{{ $t('nft.home.category') }}</div>
    <div class="be-flex list">
      <div class="cursor list-item" @click="handleViewDetail(item.id)" v-for="item in listCategories" :key="item.id">
        <!-- <img :src="item.avatar" alt="" class="d-block" /> -->
        <bc-media :url="item.avatar" />
        <div class="nft-header6 text-semibold text-center content">
          <span>{{ item.categoryName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')

  @Component
  export default class ListCategory extends Vue {
    listCategories: Array<Record<string, any>> = []
    async handleViewDetail(value: any): Promise<void> {
      await window.scroll(0, 0)
      this.$router.push({ name: 'DetailCategory', params: { id: value } })
    }
    async created(): Promise<void> {
      try {
        this.listCategories = await apiNft.getListCategory()
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.list-category {
    margin-bottom: 80px;
    .list {
      .list-item {
        border-radius: 8px;
        width: calc(1 / 4 * 100% - (1 - 1 / 4) * 20px);
        margin: 20px 20px 0 0;
        border: 1px solid #dbdbdb;

        &:hover {
          // transform: translateY(-2px);
          // box-shadow: rgba(4, 17, 29, 0.25) 0px 0px 8px 0px;
          // transition: linear 0.1s;
        }
        .wrap-media {
          height: auto;
          img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-top-left-radius: 8px !important;
            border-top-right-radius: 8px !important;
          }
          .empty {
            height: 200px;
            border-top-left-radius: 8px !important;
            border-top-right-radius: 8px !important;
          }
        }

        .content {
          padding: 16px 0;
        }
      }
      .list-item:nth-child(4n) {
        margin-right: 0;
      }
      .list-item:nth-child(-n + 4) {
        margin-top: 0;
      }
    }
  }
</style>
