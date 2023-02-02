<template>
  <div class="wrapper">
    <div class="be-flex nft-item">
      <div v-for="(item, index) in arrItem" :key="index" class="be-flex align-center item" @click="handleClickItem(item.id)">
        <span class="nft-body-base text-semibold index">{{ index + 1 }}</span>
        <div class="be-flex align-center info">
          <div class="avatar">
            <!-- <img :src="item.avatar" class="d-block" /> -->
            <bc-media :url="item.avatar" :size="12" />
            <div v-if="item.isNew === 'YES'" class="new-circle"></div>
            <div v-if="item.isVerified === 'YES'" class="item-verifed">
              <base-icon icon="icon-verified" size="16" class="d-iflex" />
            </div>
          </div>
          <div class="content">
            <div class="nft-header6 text-semibold text-overflow-1">{{ item.collectionName }}</div>
            <div class="nft-body-small text-desc" v-if="lastTime === 'LAST_24_HOURS'">${{ item.oneDayTrade | convertAmountDecimal('USD') }}</div>
            <div class="nft-body-small text-desc" v-if="lastTime === 'LAST_7_DAYS'">${{ item.sevenDayTrade | convertAmountDecimal('USD') }}</div>
            <div class="nft-body-small text-desc" v-if="lastTime === 'LAST_30_DAYS'">${{ item.thirtyDayTrade | convertAmountDecimal('USD') }}</div>
          </div>
        </div>
      </div>
    </div>
    <button v-if="showBtn" type="button" class="nft-header6 text-semibold text-desc cursor btn-more" @click="handleClickBtn">
      <p>{{ $t('button.more-rank') }}</p>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class CollectionItemChild extends Vue {
    @Prop({ required: true, type: Array, default: [] }) arrItem!: Array<Record<string, any>>
    @Prop({ required: false, type: Boolean, default: true }) showBtn!: boolean
    @Prop({ required: false, type: String, default: 'LAST_24_HOURS' }) lastTime!: string
    handleClickBtn(): void {
      this.$emit('click')
    }
    handleClickItem(id: number): void {
      this.$router.push({ name: 'DetailCollection', params: { id: id + '' } })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 80px;
    .nft-item {
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 120px;
      width: 100%;
      overflow: hidden;
      @media (max-width: 1200px) {
        overflow: auto;
      }
      .item {
        width: 33.333%;
        margin-bottom: 24px;
        cursor: pointer;
        .info {
          margin-left: 16px;
          .avatar {
            position: relative;
            margin-right: 16px;
            height: 48px;
            width: 48px;
            background: #dbdbdb;
            border-radius: 50%;
            img {
              width: 48px;
              height: 48px;
              border-radius: 100% !important;
              display: block;
              object-fit: cover;
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
              height: 16px;
            }
            .wrap-media {
              .empty {
                border-radius: 50% !important;
              }
            }
          }
        }
      }
      .item:nth-child(2n) {
        margin-bottom: 0;
      }
    }
    .btn-more {
      margin-top: 40px;
      width: 160px;
      padding: 11px 0;
      border-radius: 6px;
      background: transparent;
      border: 1px solid #dbdbdb;
      &:hover {
        border-color: var(--bc-btn-default-border-hover);
        p {
          background: var(--bc-btn-default-text-hover);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 transparent;
        }
      }
    }
  }
</style>
