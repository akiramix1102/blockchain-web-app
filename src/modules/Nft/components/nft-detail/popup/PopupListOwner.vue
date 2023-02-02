<template>
  <base-popup name="popup-list-owner" class="popup-list-owner" width="600px" :isShowFooter="false" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <span>{{ $t('detail-nft.owner-by') }} </span>
    </div>
    <div class="content" v-loading="isLoading">
      <div v-if="listOwner.length" class="list-owner">
        <div v-for="(item, index) in listOwner" :key="item.id" class="be-flex align-center owner">
          <span class="nft-body-base text-semibold index">{{ index + 1 }}</span>
          <div class="be-flex align-center info">
            <div class="avatar click" @click="handleViewOwner(item.ownerId)">
              <div>
                <bc-media v-if="item.ownerAvatar" :url="item.ownerAvatar" :radius="100" :size="12" />
                <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
              </div>

              <div v-if="item.ownerIsVerified === 'YES'" class="verified">
                <base-icon icon="icon-verified" size="14" class="d-iflex" />
              </div>
              <div v-if="item.ownerIsNew === 'YES'" class="new-circle"></div>
            </div>
            <div class="name">
              <div class="name-item">
                <div class="nft-header6 text-semibold text-overflow-1 click" @click="handleViewOwner(item.ownerId)">
                  <span v-if="item.isOwner === 'YES'">{{ $t('you') }}</span>
                  <span v-else>{{ item.ownerName }}</span>
                </div>
                <p class="text-desc nft-body-small text-overflow-1">{{ getDescription(item) }}</p>
              </div>
              <div class="name-item">
                <span class="name-item__price text-regular text-base1">{{ dolaExchange(item) }} </span>
                <!-- <span class="name-item__usd text-regular text-base1"> ~ ${{ dolaExchange(item) }}</span> -->
              </div>
            </div>
          </div>
          <div class="btn-action" v-if="type == 'OWNER'">
            <div v-if="showBtnBuyNow(item)" class="btn-default nft-header6 text-semibold text-center text-desc bid" @click="handleBuy(item)">{{ $t('text-nft.buy-now') }}</div>
            <div v-if="showBtnRemove(item)" class="btn-default nft-header6 text-semibold text-center text-desc bid" @click="handleRemoveFromSale">
              {{ $t('text-nft.remove-from-sale') }}
            </div>
            <div v-if="showBtnPutOnSale(item)" class="btn-default nft-header6 text-semibold text-center text-desc bid" @click="handlePutOnsale(item)">
              {{ $t('text-nft.put-on-sale') }}
            </div>
          </div>
          <div class="btn-action" v-else>
            <div v-if="showBtnMakeOffer(item)" class="btn-default nft-header6 text-semibold text-center text-desc bid" @click="handleMakeOffer(nftItem, item)">
              {{ $t('text-nft.make-offer') }}
            </div>
          </div>
        </div>
      </div>
      <empty-block v-else :show="true" class="empty" />
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import OnChainMixin from '@/mixins/onchain'
  import ActionNftMixin from '@/mixins/actionNft'
  import filter from 'lodash/filter'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import { namespace } from 'vuex-class'

  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')
  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import EventBus from '@/utils/eventBus'

  @Component({ components: { EmptyBlock } })
  export default class PopupListOwnisEnders extends Mixins(PopupMixin, OnChainMixin, ActionNftMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @Prop({ required: true, type: String, default: 'OWNER' }) type!: string

    // @Prop({ required: true, type: Array, default: () => [] }) owners!: Array<Record<string, any>>
    @bcAuth.Getter('isBuy') isBuy!: boolean
    @bcAuth.Getter('isBid') isBid!: boolean
    @bcAuth.Getter('isExternalWallet') isExternalWallet!: boolean

    @bcNft.Action('setInfoNft') setInfoNft!: (nft: Record<string, any>) => void
    @bcNft.Mutation('SET_TYPE_ACTION') setTypeAction!: (type: string) => void
    @bcNft.Mutation('SET_LIST_ACCEPT_CURRENCY') setListAcceptCurrency!: (list: Array<Record<string, any>>) => void
    @bcNft.Action('setListCurrenciesBuy') setListCurrenciesBuy!: (list: Array<Record<string, any>>) => void
    @bcNft.Mutation('SET_CURRENCY_SELECT_BUY') setCurrencySelectBuy!: (currency: string) => void

    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    listOwner: Array<Record<string, any>> = []
    exchangeRateRef: any = null
    query: Record<string, any> = {
      page: 1,
      limit: 20
    }
    isEnd = false
    isLoading = false
    infoLynkey = ''
    itemOwer = {
      creatorFee: 0,
      id: 0,
      ownerIdMinPrice: 0,
      minListingId: 0,
      minListingPrice: 0,
      itemName: '',
      currency: '',
      minListingPriceWei: 0
    }
    itemMakeOffer = {
      id: 0,
      minListingId: 0,
      minListingPrice: 0,
      itemName: '',
      currency: '',
      collectionName: '',
      totalSupply: 0,
      idOwnerOffer: 0
    }

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.nftItem.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    dolaExchange(item: Record<string, any>): any {
      const listingQuantity = this.$options.filters?.formatNumber(item.listingQuantity)
      const listingPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice, item.currency)
      const dolarPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice * this.exchangeRate, 'USD')
      if (this.showBtnBuyNow(item) || this.showBtnRemove(item)) {
        return `${listingPrice}` + ` ` + item.currency + ` ` + this.$t('detail-nft.popup-owner.each') + ` ~ $` + `${dolarPrice}`
      }
      if (this.showBtnPutOnSale(item)) {
        return this.$t('text-nft.not-for-sale')
      }
      if ((this.isBuy && item.isOnSale === 'NO' && item.isOwner === 'NO') || !this.isBuy) {
        return this.$t('text-nft.not-for-sale')
      }
    }

    async handleViewOwner(id: string): Promise<void> {
      let id2 = id
      this.$router.push({ name: 'UserProfile', params: { id: id2 } })
      console.log('ownerID', id)
      this.setOpenPopup({
        popupName: 'popup-list-owner',
        isOpen: false
      })
    }
    showBtnBuyNow(item: Record<string, any>): boolean {
      if (this.isBuy) {
        // this.isShowBtn = true
        return item.isOnSale === 'YES' && item.isOwner === 'NO'
      }
      return false
    }
    showBtnRemove(item: Record<string, any>): boolean {
      if (this.isBuy) {
        return item.isOnSale === 'YES' && item.isOwner === 'YES'
      }
      return false
    }
    showBtnPlaceBid(item: Record<string, any>): boolean {
      if (this.isBuy) {
        return item.isOnSale === 'YES' && item.isOwner === 'YES'
      }
      return false
    }
    showBtnPutOnSale(item: Record<string, any>): boolean {
      if (this.isBuy) {
        return item.isOnSale === 'NO' && item.isOwner === 'YES'
      }
      return false
    }
    showBtnMakeOffer(item: Record<string, any>): boolean {
      if (this.isBuy) {
        // return item.isOnSale === 'NO' && item.isOwner === 'NO'
        return true
      }
      return false
    }

    getDescription(item: Record<string, any>): string {
      const listingQuantity = this.$options.filters?.formatNumber(item.listingQuantity)

      const originQuantity = this.$options.filters?.formatNumber(item.originQuantity)
      const listingPrice = this.$options.filters?.convertAmountDecimal(item.listingPrice, item.currency)

      if (listingQuantity > 1 && (this.showBtnBuyNow(item) || this.showBtnRemove(item))) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('for-sale')
        //  + `, ${listingPrice} ${item.currency}/` + this.$t('detail-nft.popup-owner.each')
      } else if (listingQuantity <= 1 && (this.showBtnBuyNow(item) || this.showBtnRemove(item))) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-sale-for')
      }
      if (this.showBtnPutOnSale(item)) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-sale-for')
      }
      if ((this.isBuy && item.isOnSale === 'NO' && item.isOwner === 'NO') || !this.isBuy) {
        return `${listingQuantity}/${originQuantity} ` + this.$t('text-nft.on-sale-for')
      }
      return ''
    }

    async handleOpen(): Promise<void> {
      // EventBus.$on('reload-list-owner', async () => {
      //   this.isEnd = false
      //   this.query = {
      //     page: 1,
      //     limit: 20
      //   }
      //   this.listOwner = await apiNft.getListOwners(this.$route.params.id, this.query)
      // })
      // this.$route.params.isPopupOwner = 'YES'

      this.isLoading = true
      this.listOwner = await apiNft.getListOwners(this.$route.params.id, this.query)
      this.isLoading = false
      if (this.listOwner.length < this.query.limit) {
        this.isEnd = true
      }
      this.$nextTick(() => {
        const elm = document.querySelector('.popup-content')
        elm?.addEventListener('scroll', this.handleScroll)
      })
      console.log('list owners', this.listOwner)
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }
    created() {
      EventBus.$on('reload-list-owner', this.handleReloadList)
    }
    destroyed() {
      EventBus.$off('reload-list-owner')
    }
    async handleBuy(item: Record<string, any>): Promise<void> {
      this.itemOwer = {
        creatorFee: item.creatorFee,
        id: item.itemId,
        ownerIdMinPrice: item.ownerId,
        minListingId: item.listingId,
        minListingPrice: item.listingPrice,
        minListingPriceWei: item.listingPriceWei,
        itemName: item.itemName,
        currency: item.currency
      }
      const result = await this.getListTokenAccept(item)
      this.setCurrencySelectBuy(result[0].currency)
      this.setListCurrenciesBuy(result)
      this.setInfoNft({ ...this.nftItem, ...this.itemOwer })
      if (!this.isLogin) {
        if (this.isExternalWallet) {
          if (this.walletAddress) {
            this.setTypeAction('buy')
            this.actionWhenLogged({ ...this.nftItem, ...this.itemOwer }, this.contractAddress, 'buy')
          } else {
            if ((this.isExternalWalletMobile && !this.isDesktop) || this.isDesktop) {
              this.setOpenPopup({
                popupName: 'popup-payment-method',
                isOpen: true
              })
            } else {
              this.redirectLogin(this.nftItem)
            }
          }
        } else {
          this.redirectLogin(this.nftItem)
        }
      } else {
        await this.getLynkeyInfo(item)
      }
    }

    redirectLogin(nftItem: Record<string, any>): void {
      const message: any = this.$t('notify.must-login')
      this.$message.error({ message, duration: 5000 })
      const detail = {
        isBack: 'nft',
        id: nftItem.id! as string,
        name: 'DetailNftItem'
      }
      setTimeout(() => {
        this.$router.push({ name: 'login', query: { ...detail } })
      }, 1000)
    }

    async getListTokenAccept(item: Record<string, any>): Promise<any> {
      try {
        const params = { listingId: item.listingId, itemId: item.itemId }

        const result = await apiNftV2.getListAcceptPayment(params)

        if (!result.length) {
          const message = this.$t('notify_empty-list-accept-currency') as string
          this.$message.error({ message, duration: 5000 })
          return Promise.reject()
        }

        this.setListAcceptCurrency(result)
        return Promise.resolve(result)
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    }

    handlePutOnsale(item: Record<string, any>): void {
      const nftItem = {
        ...this.nftItem,
        ...item,
        creatorFee: item.creatorFee,
        id: item.itemId,
        ownerIdMinPrice: item.ownerId,
        minListingId: item.listingId,
        minListingPrice: item.listingPrice,
        minListingPriceWei: item.listingPriceWei,
        itemName: item.itemName,
        currency: this.nftItem.currency
      }
      this.putOnSale(nftItem)
      // this.setInfoNft(this.nftItem)
      // if (this.isBuy && this.isBid) {
      //   this.setOpenPopup({
      //     popupName: 'popup-put-on-sale',
      //     isOpen: true
      //   })
      // }
      // if (this.isBuy && !this.isBid) {
      //   this.setOpenPopup({
      //     popupName: 'popup-fixed-price',
      //     isOpen: true
      //   })
      // }
    }

    handleRemoveFromSale(): void {
      this.removeSale(this.nftItem)
    }

    // async handleRemove(item: Record<string, any>): Promise<void> {
    //   if (!this.isLogin) {
    //     if (this.isExternalWallet) {
    //       this.setOpenPopup({
    //         popupName: 'popup-payment-method',
    //         isOpen: true
    //       })
    //     } else {
    //       this.redirectLogin(this.nftItem)
    //     }
    //   } else {
    //     this.getRemove(item)
    //   }
    // }
    getOwnerId = ''
    async handleMakeOffer(nftItem: Record<string, any>, item: Record<string, any>): Promise<void> {
      this.itemMakeOffer = {
        id: item.itemId,
        minListingId: item.listingId,
        minListingPrice: item.listingPrice,
        itemName: item.itemName,
        collectionName: nftItem.collectionName,
        currency: item.currency,
        totalSupply: item.quantity,
        idOwnerOffer: item.ownerId
      }
      this.setInfoNft({ ...this.nftItem, ...this.itemMakeOffer })
      await this.getListTokenAccept(item)
      if (!this.isLogin) {
        this.setOpenPopup({
          popupName: 'popup-make-offer',
          isOpen: true
        })
      } else {
        this.getLynkeyInfo1(item)
        this.setOpenPopup({
          popupName: 'popup-list-owner',
          isOpen: true
        })
      }
    }
    async getLynkeyInfo(nftItem): Promise<void> {
      try {
        const params = {
          listingId: nftItem?.listingId
        }
        const result = await apiNft.getLynkeyInfo(this.currencySelectBuy, params)
        this.infoLynkey = result || []
        this.setInfoActivity(result)
        this.setOpenPopup({
          popupName: 'popup-buy-nft',
          isOpen: true
        })
      } catch (error) {
        let message = this.$t('notify.error-info') as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject()
      }
    }
    async getLynkeyInfo1(nftItem): Promise<void> {
      try {
        const params = {
          listingId: nftItem?.listingId
        }
        const result = await apiNft.getLynkeyInfo(nftItem.currency, params)
        this.infoLynkey = result || []
        this.setInfoActivity(result)
        this.setOpenPopup({
          popupName: 'popup-make-offer',
          isOpen: true
        })
      } catch (error) {
        let message = this.$t('notify.error-info') as string
        this.$message.error({ message, duration: 5000 })
        return Promise.reject()
      }
    }
    // async getRemove(nftItem): Promise<void> {
    //   try {
    //     const params = {
    //       listingId: nftItem?.listingId
    //     }
    //     const result = await apiNft.getListOwners(nftItem.listingId, params)
    //     // const result = await apiNft.getLynkeyInfo(nftItem.listingId, params)
    //     // console.log('ngu', result);
    //     this.infoLynkey = result || []
    //     this.setInfoActivity(result)
    //     // item.isOnSale === 'NO' && item.isOwner === 'YES'
    //     // this.listOwner[nftItem.id]
    //     this.setOpenPopup({
    //       popupName: 'popup-remove',
    //       isOpen: true
    //     })
    //   } catch (error) {
    //     let message = this.$t('notify.error-info') as string
    //     this.$message.error({ message, duration: 5000 })
    //     return Promise.reject()
    //   }
    // }
    handleClose(): void {
      // delete this.$route.params.isPopupOwner
      // EventBus.$off('reload-list-owner')
      this.isEnd = false
      this.query = {
        page: 1,
        limit: 20
      }
    }

    async handleScroll(): Promise<void> {
      const elm = document.querySelector('.popup-content') as HTMLElement
      if (elm.scrollTop >= elm.scrollHeight - elm.offsetHeight && !this.isEnd) {
        this.query.page += 1
        const result = await apiNft.getListOwners(this.$route.params.id, this.query)
        this.listOwner = [...this.listOwner, ...result]
        this.isEnd = result.length <= 0
      }
    }
    async handleReloadList(): Promise<void> {
      this.query = {
        page: 1,
        limit: 20
      }
      this.listOwner = await apiNft.getListOwners(this.$route.params.id, this.query)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-list-owner {
    .click {
      cursor: pointer;
    }
    .el-dialog {
      &__header {
        .header-popup {
          color: #0a0b0d;
        }
        .el-dialog__close {
          color: #0a0b0d;
        }
      }

      &__body {
        color: var(--bc-text-market-primary-nft);
        .popup-content {
          .content {
            .list-owner {
              .owner {
                padding: 24px 0;
                border-bottom: 1px solid #dbdbdb;

                .info {
                  margin-left: 16px;
                  width: 63%;
                  .avatar {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    margin-right: 16px;
                    img {
                      object-fit: cover;
                      height: 48px;
                    }
                    .verified {
                      position: absolute;
                      bottom: 0;
                      right: 0;
                      height: 14px;
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
                  }
                  .name {
                    flex: 1;
                    .name-item:first-child {
                      display: flex;
                      gap: 6px;
                    }
                    .name-item:last-child {
                      color: var(--bc-text-color-tab-item);
                    }
                  }
                }
                .btn-action {
                  margin-left: auto;
                  .bid {
                    width: 160px;
                    margin-bottom: 10px;
                    &:hover {
                      background: var(--bc-theme-primary-gradient);
                      color: #fff !important;
                      -webkit-text-fill-color: unset;
                    }
                  }
                  .bid:last-child {
                    margin-bottom: 0;
                  }
                }
              }
              .owner:first-child {
                padding-top: 0;
              }
              .owner:last-child {
                border: none;
              }
            }
            .empty-block.empty {
              padding-top: 0 !important;
              padding-bottom: 24px;
              text-align: center;
              .span-icon {
                font-size: 150px !important;
                display: inline-flex;
              }
              .empty-text {
                color: #8f8f8f;
              }
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    ::v-deep.popup-list-owner {
      .el-dialog {
        width: 450px !important;
      }
      .btn-action {
        .bid {
          width: 140px !important;
        }
      }
    }
  }
</style>
