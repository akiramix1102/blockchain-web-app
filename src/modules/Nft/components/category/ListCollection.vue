<template>
  <div>
    <div v-if="isDesktop" class="be-flex list-collection">
      <div v-for="item in listNft" :key="item.id" class="item">
        <collection-item :collectionItem="item" />
      </div>
    </div>
    <div v-else class="be-flex list-collection-mobi">
      <div class="mb-24" style="width: 100%">
        <div v-for="item in listNft" :key="item.id" class="item">
          <collection-item :collectionItem="item" />
        </div>
      </div>
      <div v-if="this.listNft.length < this.query.total" style="width: 100%">
        <button @click="handleLoadMore" class="load_more cursor">Load more</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
  import CollectionItem from '../base/CollectionItem.vue'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component({ components: { CollectionItem } })
  export default class ListCollection extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: () => [] }) listNft!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @bcNft.State('isDesktop') isDesktop!: boolean

    loadmore = true

    // created(): void {
    //   console.log('listdata length', this.listNft.length)
    //   console.log('total ', this.query.total)

    //   // if (this.listNft.length === this.query.total || this.listNft.length < this.query.total) {
    //   //   this.loadmore = false
    //   // }
    // }

    handleLoadMore(val: number): void {
      // if (this.query.total > this.query.limit) {
      //   this.loadmore = true
      // }
      if (this.listNft.length >= this.query.total) {
        this.loadmore = false
      }

      this.$emit('loadmore', val)
    }
  }
</script>

<style scoped lang="scss">
  .list-collection {
    flex-wrap: wrap;
    .item {
      width: calc(1 / 4 * 100% - (1 - 1 / 4) * 20px);
      margin: 28px 20px 0 0;
      transition: all 0.2s ease;
      &:hover {
        transform: translateY(-5px);
      }
    }
    .item:nth-child(4n) {
      margin-right: 0;
    }
    .item:nth-child(-n + 4) {
      margin-top: 0;
    }
  }
  ::v-deep.list-collection-mobi {
    flex-wrap: wrap;
    .collection-item {
      // height: 380px;
      .above {
        // height: 255px;
        .banner {
          width: 100%;
          // height: 223px;
        }
      }
    }
    .content-media {
      width: 100%;
    }
    .item {
      width: calc(1 / 1 * 100% - (1 - 1 / 1) * 20px);
      margin: 28px 20px 0 0;
    }
    .item:nth-child(1n) {
      margin-right: 0;
    }
    .item:nth-child(-n + 1) {
      margin-top: 0;
    }
  }

  @media (max-width: 375px) {
    ::v-deep.list-collection-mobi {
      flex-wrap: wrap;
      .collection-item {
        height: 430px;
        .above {
          height: 255px;
          .banner {
            width: 100%;
            height: 223px;
          }
        }
      }
      .load_more {
        width: 100%;
        /* border: none; */
        height: 48px;
        background: #fff;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        margin-top: 24px;
        margin-bottom: 40px;
        color: #5b616e;
        line-height: 24px;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
</style>
