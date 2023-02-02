<template>
  <div class="top-collection">
    <div class="be-flex align-center jc-space-between mb-40 title">
      <div class="nft-header3 text-semibold be-flex align-center">
        <span> {{ $t('nft.home.top-collec') }}</span>
        <base-icon icon="icon-gold-medal " size="48" class="lh-default isPc" />
        <base-icon icon="icon-gold-medal " size="23" class="lh-default isMobile" />
      </div>
      <title-tab :arrTab="arrTab" @clickTab="handleChangeTab" class="style-tab" />
    </div>
    <div class="top-list">
      <collection-item-child v-if="arrItem.length" :arrItem="arrItem" @click="handleClickBtn" class="collection-item-child-clm" :showBtn="false" />
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
  .isPc {
    display: block;
  }
  .isMobile {
    display: none;
  }
  @media (max-width: 767px) {
    .isPc {
      display: none !important;
    }
    .isMobile {
      display: block;
    }
    .top-collection {
      .title {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 24px !important;
      }
      .nft-header3 {
        font-size: 24px;
        line-height: 32px;
      }
      .style-tab {
        margin-top: 20px;
        padding: 4px 8px !important;
        font-size: 14px !important;
        line-height: 20px !important;
        height: 44px;
      }
    }

    ::v-deep.title-tab {
      .nft-body-small {
        height: 28px;
        padding: 4px 11.5px;
        line-height: 20px;
      }
    }
    // .collection-item-mobile {
    //   height: 192px;
    //   margin-bottom: 0px !important;
    //   .nft-item {
    //     max-height: 100% !important;
    //     .item {
    //       width: 246px !important;
    //       margin-bottom: 20px !important;
    //       .info {
    //         margin-left: 12px !important;
    //         .avatar {
    //           height: 40px !important;
    //           width: 40px !important;
    //           margin-right: 12px !important;
    //           img {
    //             height: 40px !important;
    //             width: 40px !important;
    //           }
    //         }
    //       }
    //       .index {
    //         color: var(--bc-text-disabled);
    //       }
    //     }
    //   }
    // }
  }

  @media screen and (max-width: 374.999px) {
    ::v-deep.style-tab {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;

      .tab-item {
        white-space: nowrap;
      }
    }
  }
</style>
