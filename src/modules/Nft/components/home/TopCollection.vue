<template>
  <div class="top-collection">
    <div class="be-flex align-center jc-space-between mb-40 title">
      <div class="nft-header3 text-semibold be-flex align-center">
        <span> {{ $t('nft.home.top-collec') }}</span>
        <base-icon icon="icon-gold-medal" size="48" class="lh-default" />
      </div>
      <title-tab :arrTab="arrTab" @clickTab="handleChangeTab" />
    </div>
    <div class="top-list">
      <collection-item-child v-if="arrItem.length" :arrItem="arrItem" @click="handleClickBtn" :showBtn="false" :lastTime="query.lastTime" />
      <empty-block v-else :show="true" class="empty" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import TitleTab from '../base/TitleTab.vue'
  import CollectionItemChild from '../base/CollectionItemChild.vue'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  @Component({ components: { TitleTab, CollectionItemChild, EmptyBlock } })
  export default class TopCollection extends Vue {
    arrTab: Array<Record<string, any>> = [
      {
        title: 'last-24h',
        type: 'LAST_24_HOURS'
      },
      {
        title: 'last-7day',
        type: 'LAST_7_DAYS'
      },
      {
        title: 'last-30day',
        type: 'LAST_30_DAYS'
      }
    ]
    arrItem: Array<Record<string, any>> = []
    query: Record<string, any> = {
      page: 1,
      limit: 12,
      lastTime: 'LAST_24_HOURS',
      collectionType: 'TOP'
    }

    async created(): Promise<void> {
      this.getListCollection()
    }
    async getListCollection(): Promise<void> {
      const result = await apiNft.getListCollection(this.query)
      this.arrItem = result.content || []
    }

    handleChangeTab(tab: string): void {
      this.query.lastTime = tab
      this.getListCollection()
    }

    handleClickBtn(): void {
      this.$router.push({ name: 'TopCollection', query: { lastTime: this.query.lastTime } })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.empty-block.empty {
    text-align: center;
    padding: 0 !important;
    height: 192px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .span-icon {
      font-size: 150px !important;
    }
    .empty-text {
      color: #8f8f8f;
    }
  }
</style>
