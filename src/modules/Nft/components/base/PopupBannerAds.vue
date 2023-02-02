<template>
  <base-popup name="popup-banner-ads" class="popup-banner-ads" width="753px" :close="handleClose">
    <div class="content" @click="handleClick(objectBannerAds)">
      <img v-if="objectBannerAds.objectAvatarType === 'IMAGE'" :src="objectBannerAds.objectAvatar" class="media-banner-ads" alt="" />
      <video
        v-if="objectBannerAds.objectAvatarType === 'VIDEO'"
        :src="objectBannerAds.objectAvatar"
        class="media-banner-ads"
        style="width: 753px"
        autoplay="autoplay"
        loop="loop"
        muted="muted"
      ></video>
    </div>
  </base-popup>
</template>
<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  @Component
  export default class PopupBannerAds extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) objectBannerAds!: Record<string, any>
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-banner-ads',
        isOpen: false
      })
    }
    handleClick(item: Record<string, any>): void {
      this.setOpenPopup({
        popupName: 'popup-banner-ads',
        isOpen: false
      })
      if (item.objectId) {
        if (item.objectType === 'NFT') {
          this.$router.push({ name: 'DetailNftItem', params: { id: item.objectId + '' } })
        } else {
          this.$router.push({ name: 'DetailCollection', params: { id: item.objectId + '' } })
        }
      } else {
        window.open(item.objectUrl, '_blank')
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep.popup-banner-ads {
    .media-banner-ads {
      border-radius: 12px;
      width: 100%;
      height: 500px;
      cursor: pointer;
      object-fit: cover;
    }
    .el-dialog {
      box-shadow: unset;
      background: inherit;
    }
    .el-dialog__header {
      height: 0 !important;
      border: none !important;
      .el-dialog__headerbtn {
        position: absolute !important;
        top: 16px !important;
        right: 16px !important;
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        z-index: 9;
        &:hover {
          .el-dialog__close {
            color: var(--bc-icon-close-popup);
          }
        }
        .el-dialog__close {
          color: var(--bc-color-white);
        }
      }
    }
    .popup-content {
      padding: 0 !important;
      overflow: hidden !important;
    }
    .el-dialog__footer {
      display: none;
    }
    @media screen and (max-width: 768px) {
      .el-dialog {
        width: auto !important;
      }
      .media-banner-ads {
        height: 222px;
        width: 335px !important;
      }
    }
  }
</style>
