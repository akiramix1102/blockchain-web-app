<template>
  <div class="collection-item">
    <div class="cursor above" @click="handleViewAccount(userItem.id)">
      <bc-media class="banner" :url="userItem.banner" :size="32" />
      <div class="avatar">
        <bc-media class="avatar-collection" :url="userItem.avatar" :size="18" :radius="80" />
        <div v-if="userItem.isNew == 'YES'" class="is-new"></div>
        <!-- <div class="verified"><base-icon v-if="userItem.isVerified == 'YES'" icon="icon-verified" size="20" class="d-iflex" /></div> -->
      </div>
    </div>
    <div class="text-center below">
      <div class="account-name-verifi">
        <div class="nft-header5 text-medium text-overflow-1 cursor name text-overflow-1" @click="handleViewAccount(userItem.id)">{{ userItem.accountName }}</div>
        <div class="nft-header5 text-medium text-overflow-1 cursor name text-overflow-1" @click="handleViewAccount(userItem.id)" v-if="userItem.accountName == null">
          {{ userItem.address | formatTransactionCode(5, 5) }}
        </div>
        <base-icon v-if="userItem.isVerified === 'YES'" icon="icon-verified" size="16" class="d-iflex style-verifi" style="padding-left: 2px" />
      </div>
      <div class="description">
        <p class="text-desc nft-body-base text-overflow-3" v-if="userItem.numOfFollowers == 1 || userItem.numOfFollowers == 0">
          {{ userItem.numOfFollowers }} {{ $t('user-follower') }}
        </p>
        <p class="text-desc nft-body-base text-overflow-3" v-if="userItem.numOfFollowers > 1">{{ userItem.numOfFollowers }} {{ $t('user-followers') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'

  @Component
  export default class CollectionItem extends Vue {
    @Prop({ required: true, type: Object, default: () => ({}) }) userItem!: Record<string, any>

    get getDescription(): string {
      try {
        const language = window.localStorage.getItem('bc-lang')!
        if (this.userItem.shortDescription) {
          const objDesc = JSON.parse(this.userItem.shortDescription)
          return objDesc[language].replace(/\\n/g, '<br>')
        }
        return ''
      } catch (error) {
        return ''
      }
    }

    created(): void {
      EventBus.$emit('emitCurrency', this.userItem.currency)
    }

    handleViewAccount(id: number): void {
      this.$router.push({ name: 'UserProfile', params: { id: id + '' } })
    }
    // handleViewCreator(id: number): void {
    //   this.$router.push({ name: 'UserProfile', params: { id: id + '' } })
    // }
  }
</script>

<style scoped lang="scss">
  ::v-deep.collection-item {
    height: 276px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    overflow: hidden;
    .above {
      height: 192px;
      position: relative;
      .banner {
        width: 285px;
        height: 160px;
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
    }
    .below {
      padding: 8px 16px 0;
      .name {
        // margin-bottom: 4px;
      }
      .by {
        margin-bottom: 16px;
        .left {
          max-width: calc(100% - 32px);
        }
      }
    }
    .account-name-verifi {
      display: flex;
      align-items: center;
      justify-content: center;
      .style-verifi {
        margin-left: 4px;
      }
    }
  }
  .description {
    margin-top: 4px;
  }
  // @media (max-width: 768px) {
  //   .verified {
  //     display: none;
  //   }
  // }
</style>
