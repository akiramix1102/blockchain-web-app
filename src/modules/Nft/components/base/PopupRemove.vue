<template>
  <base-popup name="popup-remove" class="popup-remove" width="480px" :open="handleCommand" :close="handleClose">
    <p slot="title" class="header-popup">{{ $t('text-nft.remove-from-sale') }}</p>
    <div class="content">
      <div class="text-content">
        <span
          ><p>
            {{ $t('detail-nft.pop-remove.content') }}
            {{ $t('detail-nft.pop-remove.contentBreak') }}
          </p></span
        >
      </div>
    </div>
    <div slot="footer" class="footer">
      <!-- <button class="btn-cancel">
        <p class="text-cancel" @click="handleClose">{{ $t('detail-nft.pop-remove.cancel') }}</p>
      </button>
      <button @click="removeItem" class="btn-remove el-button btn">
        <p class="text-remove">{{ $t('detail-nft.pop-remove.remove') }}</p>
      </button> -->
      <button class="btn-default mr-15 text-regular btn-h40" @click="handleClose">
        <p>{{ $t('button.cancel') }}</p>
      </button>
      <el-button :loading="isLoading" class="btn is-none-border cursor btn-h40 btn-default-bg btn-theme" @click="debounceConfirm">{{
        $t('detail-nft.pop-remove.remove')
      }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services/index'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import { debounce } from 'lodash'
  import { namespace } from 'vuex-class'
  import EventBus from '@/utils/eventBus'
  const bcNft = namespace('bcNft')

  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')

  @Component({ components: {} })
  export default class PopupRemove extends Mixins(PopupMixin) {
    // @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.Mutation('SET_TYPE_OF_ACTION') setTypeOfAction!: (type: string) => void

    isLoading = false

    handleCommand(): void {
      this.setOpenPopup({
        popupName: 'remove',
        isOpen: true
      })
    }

    mounted(): void {
      this.setOpenPopup({
        popupName: 'popup-remove',
        isOpen: false
      })
    }

    // nftItem:{
    //   myListingId = this.datadetail.id
    // }
    debounceConfirm(): void {
      this.isLoading = true
      this.removeItem(this)
    }
    removeItem = debounce(async _this => {
      try {
        const params = {
          lastListingId: _this.nftItem.myListingId
        }

        _this.setOpenPopup({
          popupName: 'popup-list-owner',
          isOpen: false
        })
        await apiNftV2.removeFromSale(params)
        this.setTypeOfAction('put-remove')
        _this.isLoading = false
        _this.setOpenPopup({
          popupName: 'popup-notify-success',
          isOpen: true
        })
        EventBus.$emit('reload-list-owner')
      } catch (error: any) {
        _this.isLoading = false
        const { data } = error.response
        let message = ''
        switch (data.status) {
          case 'SALE_PENDING':
            message = (_this.nftItem.itemName + ' ' + _this.$t('notify.sale-pending')) as string
            break
        }
        if (message) {
          _this.$message.error({ message, duration: 5000 })
        }
      }
    }, 500)

    handleClose(): void {
      this.isLoading = false
      this.setOpenPopup({
        // command: 'a',
        popupName: 'popup-remove',
        isOpen: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    color: black;
    .text-content {
      padding-bottom: 24px;
      p {
        width: 436px;
        font-size: 16px;
        line-height: 24px;
        word-break: break-word;
        color: #0a0b0d;
      }
    }
  }
  .footer {
    .btn {
      font-size: 16px !important;
      font-weight: 600;
    }
    .btn-default {
      font-size: 16px !important;
      font-weight: 600;
      color: #5b616e;
    }

    max-width: 452px;
    width: 100%;
    .btn-remove {
      background: var(--bc-theme-primary-gradient);
      margin-left: 16px;
    }
    button {
      max-width: 150px;
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-remove {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .text-content {
          p {
            width: 287px;
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
          }
        }
        .footer {
          button {
            max-width: 100px;
            width: 100%;
            font-size: 14px !important;
            line-height: 20px !important;
          }
        }
      }
    }
  }
</style>
