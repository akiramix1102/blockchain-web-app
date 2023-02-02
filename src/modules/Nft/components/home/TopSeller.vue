<template>
  <div class="top-seller">
    <div class="be-flex align-center jc-space-between mb-40 title">
      <div class="nft-header3 text-semibold cursor">
        <el-dropdown trigger="click" class="dropdown-top-seller" @command="handleCommand">
          <div class="el-dropdown-link text-semibold be-flex align-center">
            <span class="nft-header3 text-first">{{ $t('nft.home.top') }}</span> <span style="padding-left: 12px" class="nft-header3 text-hyperlink">{{ textTitle }}</span
            ><base-icon icon="icon-arrow-down" style="padding-left: 11px" size="24" />
          </div>
          <el-dropdown-menu slot="dropdown" class="dropdown-seller">
            <el-dropdown-item command="seller">{{ $t('nft.home.seller') }}</el-dropdown-item>
            <el-dropdown-item command="buyer">{{ $t('nft.home.buyer') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <title-tab :arrTab="arrTab" />
    </div>
    <div class="top-list">
      <collection-item-child :arrItem="arrItem" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import TitleTab from '../base/TitleTab.vue'
  import CollectionItemChild from '../base/CollectionItemChild.vue'
  @Component({ components: { TitleTab, CollectionItemChild } })
  export default class TopSeller extends Vue {
    textTitle = this.$t('nft.home.seller')
    arrTab: Array<Record<string, any>> = [
      {
        title: 'last-24h',
        type: 1
      },
      {
        title: 'last-7day',
        type: 1
      },
      {
        title: 'last-30day',
        type: 1
      }
    ]
    arrItem: Array<Record<string, any>> = []

    created(): void {
      this.arrItem = new Array(12).fill({
        avatar: 'https://lh3.googleusercontent.com/x6hvOIWMQoPlIGwDAhpZCm4NesFGCwtrF6tv7UNu6vDasx6WxqW80WZ7w_vvMd6rVil6orhfeBmCk9GDGVUCYfP78gzFDb30usxWOA=s130',
        collectionName: 'MariRandy_Ortan',
        totalVolume: 24000,
        exchangeRate: 0.01,
        isNew: 'YES',
        isVerified: 'YES'
      })
    }

    handleCommand(command: string): void {
      if (command === 'buyer') {
        this.textTitle = this.$t('nft.home.buyer')
      } else {
        this.textTitle = this.$t('nft.home.seller')
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.top-seller {
    .title {
      .dropdown-top-seller {
        height: 40px;
        line-height: 40px;
        .text-first {
          color: var(--bc-text-market-primary-nft);
        }
      }
    }
  }
</style>
