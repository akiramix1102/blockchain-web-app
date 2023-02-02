<template>
  <div class="collection-item">
    <div class="cursor above" @click="handleViewCollection(collectionItem.id)">
      <bc-media class="banner" :url="collectionItem.featured" :size="32" />
      <div class="avatar">
        <bc-media class="avatar-collection" :url="collectionItem.avatar" :size="18" :radius="80" />
        <div v-if="collectionItem.isNew == 'YES'" class="is-new"></div>
        <div class="verified"><base-icon v-if="collectionItem.isVerified == 'YES'" icon="icon-verified" size="20" class="d-iflex" /></div>
      </div>
    </div>
    <div class="text-center below">
      <div class="nft-header5 text-medium text-overflow-1 cursor name" @click="handleViewCollection(collectionItem.id)">{{ collectionItem.collectionName }}</div>
      <div class="be-flex align-center jc-space-center by">
        <div class="left text-overflow-1" @click="handleViewCreator(collectionItem.creatorId)">
          <span class="nft-body-small text-desc">{{ $t('nft.home.by') }}</span> <span class="text-hyperlink nft-body-small cursor"> {{ collectionItem.creatorName }}</span>
        </div>
        <base-icon v-if="collectionItem.creatorIsVerified == 'YES'" icon="icon-verified" size="12" class="d-iflex" style="padding-left: 4px" />
      </div>
      <div class="description">
        <p class="text-desc nft-body-base text-overflow-3" v-html="getDescription"></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'

  @Component
  export default class CollectionItem extends Vue {
    @Prop({ required: true, type: Object, default: () => ({}) }) collectionItem!: Record<string, any>

    get getDescription(): string {
      try {
        const language = window.localStorage.getItem('bc-lang')!
        if (this.collectionItem.shortDescription) {
          const objDesc = JSON.parse(this.collectionItem.shortDescription)
          return objDesc[language].replace(/\\n/g, '<br>')
        }
        return ''
      } catch (error) {
        return ''
      }
    }

    created(): void {
      EventBus.$emit('emitCurrency', this.collectionItem.currency)
    }

    handleViewCollection(id: number): void {
      this.$router.push({ name: 'DetailCollection', params: { id: id + '' } })
    }
    handleViewCreator(id: number): void {
      this.$router.push({ name: 'UserProfile', params: { id: id + '' } })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.collection-item {
    height: 394px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    overflow: hidden;
    .above {
      height: 222px;
      position: relative;
      .banner {
        width: 285px;
        height: 190px;
        display: block;
        object-fit: cover;
      }
      .avatar-collection {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border: 2px solid #fff;
      }
      img {
        object-fit: cover;
      }
      .is-new {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #129961;
        border: 1px solid #fff;
        position: absolute;
        bottom: 50px;
        left: 157px;
      }
      .verified {
        position: absolute;
        bottom: 0;
        left: 152px;
        height: 20px;
      }
    }
    .below {
      padding: 8px 16px 0;
      .name {
        margin-bottom: 4px;
      }
      .by {
        margin-bottom: 16px;
        .left {
          max-width: calc(100% - 32px);
        }
      }
    }
  }
  @media (max-width: 768px) {
    .verified {
      display: none;
    }
  }
</style>
