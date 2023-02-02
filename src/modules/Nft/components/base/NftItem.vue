<template>
  <div class="nft-item" @mouseover="handleHoverItem" @mouseleave="handleLeaveMouse">
    <div class="avatar cursor" @click="handleClickItem">
      <!-- <img :src="itemNft.avatar" alt="" /> -->
      <bc-media ref="bc-media" :isShow="isShow" :autoplay="false" :url="url" :class="checkClassImage" />
    </div>
    <div v-if="coinMain === 'CLM'" class="list-tags">
      <div class="tag-item" v-if="itemNft.isTrending === 'YES'">
        <p class="title-tag nft-body-caption text-regular">Trending 💥</p>
      </div>
      <div class="tag-item" v-if="itemNft.isHot === 'YES'">
        <p class="title-tag nft-body-caption text-regular">Hot 🔥</p>
      </div>
      <div class="tag-item" v-if="itemNft.isNew === 'YES'">
        <p class="title-tag nft-body-caption text-regular">New ⭐</p>
      </div>
    </div>

    <div class="count-irr" :class="$route.name === 'MarketPlace' ? 'marketplace' : ''">
      <div class="count-irr__item be-flex align-center jc-space-center nft-body-caption text-regular" v-if="coinMain === 'CLM' && itemNft.irr">
        <base-icon class="icon-up" icon="up" size="16" />
        <span>{{ itemNft.irr }}% IRR</span>
      </div>
      <div v-if="isShowCountDown && !tabUsed" class="nft-body-caption be-flex align-center time-left">
        <div class="text-medium time-item">{{ day }} <span>:</span></div>
        <div class="text-medium time-item">{{ hour }} <span>:</span></div>
        <div class="text-medium time-item">{{ minute }} <span>:</span></div>
        <div class="text-medium time-item">{{ second }}</div>
        <span> left</span>
        <img src="../../../../assets/images/nft/fire.png" class="d-block" alt="" style="margin-left: 2px; width: 16px; height: 16px; margin-top: -3px" />
      </div>
    </div>
    <div class="content">
      <!-- height: 121px -->
      <div class="content--wrap" :class="tabUsed ? 'content--wrap-used' : ''">
        <div class="be-flex align-center title">
          <span class="nft-body-small text-desc cursor text-overflow-1" @click="handleViewCollection(itemNft.collectionId)">{{ itemNft.collectionName }} </span>
          <base-icon v-if="itemNft.collectionIsVerified === 'YES'" icon="icon-verified" size="12" class="d-iflex" style="padding-left: 2px" />
          <el-popover
            v-model="isVisible"
            class="be-flex align-center jc-space-center ml-auto cursor"
            placement="bottom-end"
            trigger="click"
            popper-class="popper-share-nft"
            v-if="!tabUsed"
          >
            <div class="content-popper">
              <!-- <div class="nft-body-base cursor element">
                {{ $t('nft.report') }}
              </div> -->
              <div class="nft-body-base cursor element" @click="handleShare">
                {{ $t('nft.share') }}
              </div>
            </div>
            <div slot="reference">
              <base-icon icon="icon-3dot" size="16" class="d-iflex" />
            </div>
          </el-popover>
        </div>
        <div class="nft-header6 text-semibold cursor text-overflow-1" @click="handleClickItem">
          {{ itemNft.itemName }}
        </div>

        <div class="be-flex align-center price" v-if="!tabUsed">
          <div class="icon"><base-icon :icon="getIcon" alt="" class="d-block" size="16" /></div>
          <span class="nft-body-small">
            <span class="text-desc">{{ text }}</span>
            <span class="text-price" v-if="!statusTextComingSoon"> ${{ price | convertAmountDecimal('USD') }}</span>
            <!-- <span v-if="coinMain === 'LYNK'" class="text-desc"> ({{ itemNft.totalListing | abbreviateNumber(0) }}/{{ itemNft.totalSupply | abbreviateNumber(0) }})</span> -->
            <!-- <span v-if="coinMain === 'CLM' && itemNft.totalSupply > 1" class="text-desc nft-body-caption"> (120 sales)</span> -->
          </span>
        </div>
        <div class="tag mt-16" v-if="!tabUsed">
          <span v-if="itemNft.totalSupply > 1" class="tag-quanti">
            <div class="be-flex align-center jc-space-center">
              <base-icon style="line-height: 24px; padding-bottom: 1px" icon="layers-stacked" size="14" />
              <span class="nft-body-caption text-regular" style="margin-left: 4px; color: #8557e7; line-height: 24px">{{ itemNft.totalListing }}/{{ itemNft.totalSupply }}</span>
            </div>
          </span>
          <span v-if="itemNft.totalSupply <= 1 && coinMain === 'LYNK'" class="tag-quanti be-flex align-center jc-space-center">
            <div class="be-flex align-center jc-space-center">
              <base-icon style="line-height: 24px; padding-bottom: 1px" icon="layers-stacked" size="14" />
              <span class="nft-body-caption text-regular" style="margin-left: 4px; color: #8557e7; line-height: 24px"
                >{{ itemNft.totalListing | abbreviateNumber(0) }}/{{ itemNft.totalSupply }}</span
              >
            </div>
          </span>
          <span class="tag-nft" :class="!itemNft.categoryName ? 'd-none' : null" v-if="coinMain === 'CLM'">
            <span class="nft-body-caption text-regular tag-nft__item1"> {{ itemNft.categoryName }}</span>
            <!-- <span class="nft-body-caption text-regular" :class="getClass(itemNft.categroyName)"> {{ itemNft.categroyName }}</span> -->
          </span>
        </div>
        <div class="tag mt-8" v-else>
          <span v-if="itemNft.totalSupply > 1" class="tag-quanti">
            <div class="be-flex align-center jc-space-center">
              <base-icon style="line-height: 24px; padding-bottom: 1px" icon="layers-stacked" size="14" />
              <span class="nft-body-caption text-regular" style="margin-left: 4px; color: #8557e7; line-height: 24px">{{ itemNft.usedQuantity }}</span>
            </div>
          </span>
          <span v-if="itemNft.totalSupply <= 1 && coinMain === 'LYNK'" class="tag-quanti be-flex align-center jc-space-center">
            <div class="be-flex align-center jc-space-center">
              <base-icon style="line-height: 24px; padding-bottom: 1px" icon="layers-stacked" size="14" />
              <span class="nft-body-caption text-regular" style="margin-left: 4px; color: #8557e7; line-height: 24px">{{ itemNft.usedQuantity | abbreviateNumber(0) }}</span>
            </div>
          </span>
          <span class="tag-nft" :class="!itemNft.categoryName ? 'd-none' : null" v-if="coinMain === 'CLM'">
            <span class="nft-body-caption text-regular tag-nft__item1"> {{ itemNft.categoryName }}</span>
            <!-- <span class="nft-body-caption text-regular" :class="getClass(itemNft.categroyName)"> {{ itemNft.categroyName }}</span> -->
          </span>
        </div>
      </div>
      <div class="line"></div>

      <div
        v-if="otherType"
        class="be-flex align-center footer"
        :class="showBtnBuyNow || showBtnPlaceABid || showBtnEditBid || showBtnMakeOffer || showBtnEditOffer || isShowText ? ' jc-space-between' : ' jc-flex-end'"
      >
        <div
          v-if="showBtnBuyNow || showBtnPlaceABid || showBtnEditBid || showBtnMakeOffer || showBtnEditOffer"
          class="text-hyperlink nft-header6 text-semibold cursor"
          @click="handleSubmit"
        >
          {{ getTextButton }}
        </div>
        <div v-if="isShowText">
          <span class="nft-body-small text-desc">{{ $t('text-nft.not-for-sale') }}</span>
        </div>
        <div class="be-flex align-center" @click="handleClickFavourite">
          <span v-if="itemNft.isFavourite === 'YES'" class="cursor" style="height: 28px"><base-icon icon="icon-heart-red" size="28" class="d-iflex" /></span>
          <span v-else class="cursor" style="height: 28px"><base-icon icon="icon-heart-white" size="28" class="d-iflex" /></span>
          <span class="nft-body-small text-desc" :class="itemNft.isFavourite === 'YES' ? 'color-favourite' : null">{{ itemNft.numOfFavourites | formatNumber }} </span>
        </div>
      </div>

      <div v-if="!otherType && !tabUsed" class="be-flex align-center footer" :class="isShowABtn || isShowText ? ' jc-space-between' : ' jc-flex-end'">
        <div v-if="isShowABtn" class="text-hyperlink nft-header6 text-semibold cursor text-action" @click="handleSubmit">
          {{ getTextButton }}
        </div>
        <div v-if="isShowText">
          <span class="nft-body-small text-desc">{{ $t('text-nft.not-for-sale') }}</span>
        </div>
        <div class="be-flex align-center" @click="handleClickFavourite">
          <span v-if="itemNft.isFavourite === 'YES'" class="cursor" style="height: 28px"><base-icon icon="icon-heart-red" size="28" class="d-iflex" /></span>
          <span v-else class="cursor" style="height: 28px"><base-icon icon="icon-heart-white" size="28" class="d-iflex" /></span>
          <span class="nft-body-small text-desc" :class="itemNft.isFavourite === 'YES' ? 'color-favourite' : null">{{ itemNft.numOfFavourites | formatNumber }} </span>
        </div>
      </div>
      <div v-if="tabUsed" class="be-flex align-center footer jc-space-between">
        <div>
          <span class="nft-body-small text-desc text-use">{{ $t('text-nft.used') }}</span>
        </div>
        <div class="be-flex align-center" @click="handleClickFavourite" v-if="!tabUsed">
          <span v-if="itemNft.isFavourite === 'YES'" class="cursor" style="height: 28px"><base-icon icon="icon-heart-red" size="28" class="d-iflex" /></span>
          <span v-else class="cursor" style="height: 28px"><base-icon icon="icon-heart-white" size="28" class="d-iflex" /></span>
          <span class="nft-body-small text-desc" :class="itemNft.isFavourite === 'YES' ? 'color-favourite' : null">{{ itemNft.numOfFavourites | formatNumber }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import PopupMixin from '@/mixins/popup'
  import ActionNftMixin from '@/mixins/actionNft'

  import getRepository from '@/services/index'
  import filter from 'lodash/filter'
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')
  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')

  import firebase from '@/utils/firebase'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  import { String } from 'lodash'

  @Component({
    components: {}
  })
  export default class NftItem extends Mixins(PopupMixin, ActionNftMixin) {
    @Prop({
      required: false,
      type: Object,
      default: () => ({})
    })
    itemNft!: Record<string, any>

    // true khi ở tab onsale, created, owner màn account detail
    @Prop({ required: false, type: Boolean, default: false }) otherType!: boolean
    @Prop({ required: false, type: Boolean, default: false }) tabUsed!: boolean

    @bcAuth.State('access_token') access_token!: string
    @bcNft.Action('setLinkShare') setLinkShare!: (link: string) => void
    @bcNft.Mutation('SET_LIST_ACCEPT_CURRENCY') setListAcceptCurrency!: (list: Array<Record<string, any>>) => void

    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    infoLynkey: Record<string, any> = {}
    infoBid: Record<string, any> = {}
    urlShare = ''
    url = ''
    isShow = true

    text = ''
    statusTextComingSoon = false
    price = ''
    day: string | number = 0
    hour: string | number = 0
    minute: string | number = 0
    second: string | number = 0
    timing: any = null
    isShowCountDown = false
    isEditOffer = false
    isShowHot = false
    isShowNew = false
    isShowTrending = false
    isShowCategory = false
    isShowTags = false

    currentTime = 0
    timingCurrentTime: any = null

    isVisible = false
    listCoin: Array<Record<string, any>> = [
      {
        id: 0,
        symbol: 'BTC',
        icon: 'icon-btc'
      },
      {
        id: 1,
        symbol: 'ETH',
        icon: 'icon-eth'
      },
      {
        id: 2,
        symbol: 'USDT',
        icon: 'icon-usdt'
      },
      {
        id: 3,
        symbol: 'USDC',
        icon: 'icon-usdc'
      },
      {
        id: 4,
        symbol: 'BNB',
        icon: 'icon-bnb'
      },
      {
        id: 5,
        symbol: 'BUSD',
        icon: 'icon-busd'
      },
      {
        id: 6,
        symbol: 'LYNK',
        icon: 'icon-lynk'
      },
      {
        id: 7,
        symbol: 'CLM',
        icon: 'icon-clm'
      }
    ]
    get getIcon(): string {
      // const filterCoin = filter(this.listCoin, (elm: Record<string, any>) => elm.symbol === this.itemNft.currency)
      // if (filterCoin.length) {
      //   return filterCoin[0].icon
      // }
      if (this.itemNft?.baseCurrency) {
        const baseCurrency = (this.itemNft?.baseCurrency as string).toLowerCase()
        return baseCurrency === 'eth' ? `icon-${baseCurrency}` : 'icon-network-bnb'
      }
      return ''
    }

    get exchangeRate(): number {
      if (this.itemNft?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.itemNft?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }

    getClass(index: string): string {
      let className = 'disabled-category'
      if (index == 'Residential') {
        className = 'tag-nft__item1'
      }
      if (index == 'Commercial') {
        className = 'tag-nft__item2'
      }
      if (index == 'Mixed fund') {
        className = 'tag-nft__item3'
      }
      return className
    }

    created(): void {
      if (this.itemNft.isHot === 'YES' && (this.itemNft.isTrending === 'NO' || this.itemNft.isTrending === null)) {
        this.isShowHot = true
        this.isShowTags = false
      } else if (this.itemNft.isHot === 'YES' && this.itemNft.isTrending === 'YES') {
        this.isShowTags = true
        this.isShowHot = false
      }

      this.timingCurrentTime = setInterval(() => {
        this.currentTime = Date.now()
      }, 1000)
      // if (this.itemNft.isNew == 'YES') {
      //   this.isShowNew = true
      // }
      // if (this.itemNft.isTrending == 'YES') {
      //   this.isShowTrending = true
      // }
    }

    get getNull(): string {
      return this.itemNft.categroyName
    }

    get checkClassImage(): string {
      if (this.itemNft.displayType === 'PADDED') {
        return 'img-padded'
      } else if (this.itemNft.displayType === 'COVERED') {
        return 'img-cover'
      } else {
        return 'img-contain'
      }
    }
    itemId = ''

    get getLink(): string {
      const origin = process.env.VUE_APP_URL
      if (this.coinMain == 'LYNK') {
        this.urlShare = 'metamart/nft/' + this.itemNft.id
      }
      if (this.coinMain == 'CLM') {
        this.urlShare = 'marketplace/nft/' + this.itemNft.id
      }
      return origin + this.urlShare
    }

    get isShowText(): boolean {
      const totalSupply = this.itemNft?.totalSupply
      const saleStatus = this.itemNft?.saleStatus
      const isAccountOnSale = this.itemNft?.isAccountOnSale
      const minListingPrice = this.itemNft?.minListingPrice
      const isOwner = this.itemNft?.isOwner
      const myOfferId = this.itemNft?.myOfferId
      if (this.otherType) {
        if (!this.isBid && !this.isBuy) {
          return true
        }
        if (this.isBuy) {
          return (
            (saleStatus === 'ON_SALE' && isAccountOnSale === 'NO') ||
            (saleStatus === 'ON_SALE' && isAccountOnSale === 'YES' && totalSupply > 1 && !minListingPrice) ||
            (saleStatus === 'ON_SALE' && isOwner === 'NO' && myOfferId === 0 && !minListingPrice)
          )
        }
        if (!this.itemNft?.saleType) {
          return true
        }
        if (this.itemNft?.saleType) {
          return this.itemNft?.saleStatus === 'NOT_FOR_SALE'
        }
        return false
      } else {
        if (!this.isBid && !this.isBuy) {
          return true
        }
        if (!this.isOffer) {
          return !this.itemNft?.saleType && this.itemNft?.isOwner === 'NO'
        }
        if (this.itemNft?.saleType) {
          return this.itemNft?.saleStatus && this.itemNft?.saleStatus === 'NOT_FOR_SALE' && this.itemNft?.isOwner === 'NO'
        }
        if (!this.itemNft?.saleType) {
          return this.itemNft?.isOwner === 'NO' && this.itemNft.totalSupply > 1
        }
        return false
      }
    }

    get showBtnPutOnSale(): boolean {
      const isOwner = this.itemNft?.isOwner
      const isOwnerOnSale = this.itemNft?.isOwnerOnSale
      const saleType = this.itemNft?.saleType
      const hasOffer = this.itemNft?.hasOffer
      const myQuantity = this.itemNft?.myQuantity
      if (this.otherType) {
        return false
      } else {
        if (this.itemNft?.saleType) {
          if (this.isBuy) {
            return saleType === 'BUY' && isOwner === 'YES' && isOwnerOnSale === 'NO' && myQuantity
          }
        }
        return (this.isBuy || this.isBid) && isOwner === 'YES' && hasOffer === 'NO' && myQuantity
      }
    }

    get showBtnRemoveOnSale(): boolean {
      if (this.itemNft?.saleType) {
        const saleType = this.itemNft.saleType
        const isOwner = this.itemNft?.isOwner
        const isOwnerOnSale = this.itemNft?.isOwnerOnSale
        const hasOffer = this.itemNft?.hasOffer
        const numOfBids = this.itemNft?.numOfBids
        if (this.otherType) {
          return false
        } else {
          if (saleType === 'BUY') {
            return this.isBuy && isOwner === 'YES' && isOwnerOnSale === 'YES' && hasOffer === 'NO'
          }
          if (saleType === 'BID') {
            return this.isBid && isOwner === 'YES' && !numOfBids
          }
        }
      }
      return false
    }

    get showBtnPlaceABid(): boolean {
      const saleStatus = this.itemNft.saleStatus
      const isOwner = this.itemNft?.isOwner
      const myOfferId = this.itemNft?.myOfferId
      if (this.otherType) {
        return this.isBid && saleStatus === 'ON_AUCTION' && !myOfferId
      } else {
        if (!this.isBid) {
          return false
        }
        if (this.isBid) {
          return saleStatus === 'ON_AUCTION' && isOwner === 'NO' && !myOfferId
        }
        return false
      }
    }

    get showBtnEditBid(): boolean {
      const saleStatus = this.itemNft.saleStatus
      const isOwner = this.itemNft?.isOwner
      const myOfferId = this.itemNft?.myOfferId
      if (this.otherType) {
        return this.isBid && saleStatus === 'ON_AUCTION' && myOfferId !== 0
      } else {
        return this.isBid && saleStatus === 'ON_AUCTION' && isOwner === 'NO' && !!myOfferId
      }
    }
    get showBtnAcceptBid(): boolean {
      const saleStatus = this.itemNft.saleStatus
      const isOwner = this.itemNft?.isOwner
      const numOfBids = this.itemNft?.numOfBids
      const endDate = this.itemNft?.endDate
      const startDate = this.itemNft?.startDate
      const startDateTime = new Date(startDate).getTime()
      const saleType = this.itemNft?.saleType
      if (this.otherType) {
        return false
      } else {
        return (
          this.isBid &&
          ((saleStatus === 'ON_AUCTION' && isOwner === 'YES' && numOfBids && !endDate) ||
            (saleType === 'BID' && isOwner === 'YES' && numOfBids && startDateTime <= this.currentTime))
        )
      }
    }

    get showBtnBuyNow(): boolean {
      const saleStatus = this.itemNft.saleStatus
      const isOwner = this.itemNft?.isOwner
      const isAccountOnSale = this.itemNft?.isAccountOnSale
      const minListingPrice = this.itemNft?.minListingPrice
      if (this.otherType) {
        return this.isBuy && saleStatus === 'ON_SALE' && isAccountOnSale === 'YES' && !!minListingPrice
      } else {
        return this.isBuy && saleStatus === 'ON_SALE' && isOwner === 'NO' && !!minListingPrice
      }
    }

    get showBtnMakeOffer(): boolean {
      const isOwner = this.itemNft?.isOwner
      const saleType = this.itemNft?.saleType
      const saleStatus = this.itemNft?.saleStatus
      const totalSupply = this.itemNft?.totalSupply
      const myOfferId = this.itemNft?.myOfferId
      const minListingPrice = this.itemNft?.minListingPrice
      const isAccountOnSale = this.itemNft?.isAccountOnSale
      if (this.isOffer) {
        if (this.otherType) {
          return (
            (!saleType && isOwner === 'NO' && totalSupply === 1 && !myOfferId) ||
            (saleStatus === 'ON_SALE' && isAccountOnSale === 'YES' && totalSupply === 1 && !minListingPrice && !myOfferId)
          )
        } else {
          return (
            (!saleType && isOwner === 'NO' && totalSupply === 1 && !myOfferId) ||
            (saleStatus === 'ON_SALE' && isOwner === 'NO' && totalSupply === 1 && !minListingPrice && !myOfferId)
          )
        }
      }
      return false
    }

    get showBtnEditOffer(): boolean {
      const isOwner = this.itemNft?.isOwner
      const saleType = this.itemNft?.saleType
      const saleStatus = this.itemNft?.saleStatus
      const totalSupply = this.itemNft?.totalSupply
      const myOfferId = this.itemNft?.myOfferId
      const minListingPrice = this.itemNft?.minListingPrice
      const isAccountOnSale = this.itemNft?.isAccountOnSale
      if (this.isOffer) {
        if (this.otherType) {
          return (
            (!saleType && isOwner === 'NO' && totalSupply === 1 && !!myOfferId) ||
            (saleStatus === 'ON_SALE' && isAccountOnSale === 'YES' && totalSupply === 1 && !minListingPrice && !!myOfferId)
          )
        } else {
          return (
            (!saleType && isOwner === 'NO' && totalSupply === 1 && !!myOfferId) ||
            (saleStatus === 'ON_SALE' && isOwner === 'NO' && totalSupply === 1 && !minListingPrice && !!myOfferId)
          )
        }
      }
      return false
    }
    get showBtnAcceptOffer(): boolean {
      const isOwner = this.itemNft?.isOwner
      const isOwnerOnSale = this.itemNft?.isOwnerOnSale
      const saleType = this.itemNft?.saleType
      const totalSupply = this.itemNft?.totalSupply
      const hasOffer = this.itemNft?.hasOffer
      if (this.otherType) {
        return false
      }
      if (this.isOffer) {
        return (
          (!saleType && isOwner === 'YES' && hasOffer === 'YES' && totalSupply === 1) ||
          (saleType === 'BUY' && isOwner === 'YES' && isOwnerOnSale === 'YES' && hasOffer === 'YES' && totalSupply === 1)
        )
      }
      return false
    }

    get isShowABtn(): boolean {
      return (
        this.showBtnRemoveOnSale ||
        this.showBtnBuyNow ||
        this.showBtnPlaceABid ||
        this.showBtnPutOnSale ||
        this.showBtnEditBid ||
        this.showBtnMakeOffer ||
        this.showBtnEditOffer ||
        this.showBtnAcceptBid ||
        this.showBtnAcceptOffer
      )
    }

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.itemNft.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    // get isShowCountDown(): boolean {
    //   const saleType = this.itemNft.saleType
    //   const saleStatus = this.itemNft.saleStatus
    //   const numOfBids = this.itemNft.numOfBids
    //   const endDate = this.itemNft.endDate
    //   if (saleType === 'BID' && saleStatus === 'ON_AUCTION' && numOfBids >= 0) {
    //     if (endDate) {
    //       return true
    //     }
    //     return false
    //   }
    //   return false
    // }

    destroyed(): void {
      clearInterval(this.timing)
      clearInterval(this.timingCurrentTime)
    }

    async handleSubmit(): Promise<void> {
      if (this.showBtnBuyNow) {
        await this.getListTokenAccept(false, true)
        await this.setCurrencySelectBuy(this.listAcceptCurrencyBuy[0].currency)
        await this.buyNow(this.itemNft, this.walletAddress, this.contractAddress)
      }
      if (this.showBtnPlaceABid) {
        if (this.itemNft.minListingId) {
          await this.getListTokenAccept()
          await this.setTokenNeedGetBalance(this.listAcceptCurrency[0].currency)
          await this.placeBid(this.itemNft, this.contractAddress)
        } else {
          let message = (this.itemNft.itemName + ' ' + this.$t('notify.transaction-is-pending')) as string
          this.$message.error({ message, duration: 5000 })
        }
      }
      if (this.showBtnRemoveOnSale) {
        this.removeSale(this.itemNft)
      }
      if (this.showBtnPutOnSale) {
        this.putOnSale(this.itemNft)
      }
      if (this.showBtnEditBid) {
        if (this.itemNft.minListingId) {
          await this.getListTokenAccept()
          await this.setTokenNeedGetBalance(this.itemNft.myLastOfferCurrency)
          await this.handleEditBid(this.itemNft, this.contractAddress)
        } else {
          let message = (this.itemNft.itemName + ' ' + this.$t('notify.transaction-is-pending')) as string
          this.$message.error({ message, duration: 5000 })
        }
      }
      if (this.showBtnMakeOffer) {
        const owner = [
          {
            ownerId: this.itemNft?.ownerId
          }
        ]
        if (this.itemNft.saleType == 'BUY' && this.itemNft.minListingId == null) {
          let message = (this.itemNft.itemName + ' ' + this.$t('notify_transaction-pending-blockchain')) as string
          this.$message.error({ message, duration: 5000 })
        } else {
          await this.getListTokenAccept(true)
          await this.setTokenNeedGetBalance(this.listAcceptCurrency[0].currency)
          await this.makeOffer(this.itemNft, owner, this.contractAddress)
        }
      }
      if (this.showBtnEditOffer) {
        const owner = [
          {
            ownerId: this.itemNft?.ownerId
          }
        ]
        if (this.itemNft.saleType == 'BUY' && this.itemNft.minListingId == null) {
          let message = (this.itemNft.itemName + ' ' + this.$t('notify_transaction-pending-blockchain')) as string
          this.$message.error({ message, duration: 5000 })
        } else {
          await this.getListTokenAccept(true)
          await this.setTokenNeedGetBalance(this.itemNft.myLastOfferCurrency)
          await this.handleEditOffer(this.itemNft, owner, this.contractAddress)
        }
      }
      if (this.showBtnAcceptOffer) {
        this.handleAcceptOffer(this.itemNft)
      }
      if (this.showBtnAcceptBid) {
        this.handleAcceptBid(this.itemNft)
      }
    }

    @Watch('itemNft', { deep: true, immediate: true }) handleWatchItemNft(item: Record<string, any>): void {
      this.url = item.thumb
      clearInterval(this.timing)
      this.isShowCountDown = false
      // console.log(this.itemNft.endDate)

      this.handleCheckPrice()
      this.handleSetCountDown()
    }
    @Watch('listExchangeRate', { deep: true, immediate: true }) handleWatchListExchangeRate(): void {
      this.handleCheckPrice()
    }

    handleShare(): void {
      // this.isVisible = false
      this.setLinkShare(this.getLink)
      this.setOpenPopup({
        popupName: 'popup-share',
        isOpen: true
      })
      // this.$emit('share', this.itemNft.id)
    }

    get getTextButton(): string {
      if (this.showBtnPutOnSale && !this.otherType) {
        return this.$t('text-nft.put-on-sale') as string
      }
      if (this.showBtnPlaceABid) {
        return this.$t('text-nft.place-a-bid') as string
      }
      if (this.showBtnRemoveOnSale && !this.otherType) {
        return this.$t('text-nft.remove-from-sale') as string
      }
      if (this.showBtnBuyNow) {
        return this.$t('text-nft.buy-now') as string
      }
      if (this.showBtnEditBid) {
        return this.$t('text-nft.edit-bid') as string
      }
      if (this.showBtnMakeOffer) {
        return this.$t('text-nft.make-offer') as string
      }
      if (this.showBtnEditOffer) {
        return this.$t('text-nft.edit-offer') as string
      }
      if (this.showBtnAcceptBid) {
        return this.$t('text-nft.accept-bid') as string
      }
      if (this.showBtnAcceptOffer) {
        return this.$t('text-nft.accept-offer') as string
      }
      return ''
    }

    handleCheckPrice(): void {
      const saleType = this.itemNft.saleType
      const saleStatus = this.itemNft?.saleStatus
      const numOfBids = this.itemNft?.numOfBids
      const minListingPrice = this.itemNft?.minListingPrice
      const highestBid = this.itemNft?.highestBid
      const endDate = this.itemNft?.endDate
      const highestBidCurrency = this.itemNft?.highestBidCurrency

      if (this.itemNft.totalSupply === 1) {
        if (saleType) {
          if (saleStatus === 'NOT_FOR_SALE') {
            this.text = this.$t('coming-soon') as string
            this.statusTextComingSoon = true
          }
          if (saleType === 'BUY' && saleStatus === 'ON_SALE') {
            this.text = this.$t('nft.price') as string

            this.price = (minListingPrice * this.exchangeRate).toString()
            this.statusTextComingSoon = false
          }
          if (saleType === 'BID' && saleStatus === 'ON_AUCTION' && !numOfBids) {
            this.text = this.$t('nft.minimum') as string
            this.price = (minListingPrice * this.exchangeRate).toString()
            this.statusTextComingSoon = false
            if (endDate) {
              this.isShowCountDown = true
            }
          }
          if (saleType === 'BID' && numOfBids) {
            this.text = this.$t('nft.highest') as string
            this.price = (highestBid * this.getExchangeRateCurrency(highestBidCurrency)).toString()
            this.statusTextComingSoon = false
            if (endDate) {
              this.isShowCountDown = true
            }
          }
        } else {
          this.price = ''
          this.text = this.$t('coming-soon') as string
          this.statusTextComingSoon = true
        }
      } else {
        if (saleType) {
          if (saleStatus === 'NOT_FOR_SALE') {
            this.text = this.$t('coming-soon') as string
            this.statusTextComingSoon = true
          }
          if (saleType === 'BUY' && saleStatus === 'ON_SALE') {
            this.text = this.$t('nft.from') as string
            this.price = (minListingPrice * this.exchangeRate).toString()
            this.statusTextComingSoon = false
          }
        } else {
          this.price = ''
          this.text = this.$t('coming-soon') as string
          this.statusTextComingSoon = true
        }
      }
    }

    getExchangeRateCurrency(currency: string): number {
      if (this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === currency)[0]
        return coin.exchangeRate
      }
      return 0
    }

    handleSetCountDown(): void {
      if (this.isShowCountDown) {
        const endDate = new Date(this.itemNft.endDate).getTime()
        this.timing = setInterval(() => {
          let now = new Date().getTime()

          let distance = endDate - now

          if (distance > 0) {
            this.day =
              Math.floor(distance / (1000 * 60 * 60 * 24)) >= 10
                ? Math.floor(distance / (1000 * 60 * 60 * 24))
                : Math.floor(distance / (1000 * 60 * 60 * 24)) === 0
                ? '00'
                : '0' + Math.floor(distance / (1000 * 60 * 60 * 24))
            this.hour =
              Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) >= 10
                ? Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) === 0
                ? '00'
                : '0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            this.minute =
              Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) >= 10
                ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) === 0
                ? '00'
                : '0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            this.second =
              Math.floor((distance % (1000 * 60)) / 1000) >= 10
                ? Math.floor((distance % (1000 * 60)) / 1000)
                : Math.floor((distance % (1000 * 60)) / 1000) === 0
                ? '00'
                : '0' + Math.floor((distance % (1000 * 60)) / 1000)
          } else {
            clearInterval(this.timing)
            this.isShowCountDown = false
          }
        }, 1000)
      }
    }

    handleClickItem(): void {
      this.$router
        .push({
          name: 'DetailNftItem',
          params: { id: this.itemNft.id }
        })
        .catch(() => {
          console.log('loi')
        })
    }

    handleClickFavourite(): void {
      if (!this.isLogin && !this.access_token) {
        const message: any = this.$t('notify.must-login')
        this.$message.error({ message, duration: 5000 })
        const detail = {
          isBack: 'nft',
          id: this.itemNft.id! as string,
          name: 'DetailNftItem'
        }
        setTimeout(() => {
          this.$router.push({
            name: 'login',
            query: { ...detail }
          })
        }, 1000)
        return
      }
      const data = {
        objectType: 'NFT',
        objectId: this.itemNft.id,
        actionType: this.itemNft.isFavourite === 'YES' ? 'UN_FAVOURITE' : 'FAVOURITE'
      }
      this.$emit('favourite', data)
      if (this.itemNft.isFavourite === 'YES') {
        this.itemNft.numOfFavourites -= 1
        this.itemNft.isFavourite = 'NO'
      } else {
        this.itemNft.numOfFavourites += 1
        this.itemNft.isFavourite = 'YES'
      }
    }
    handleHoverItem(): void {
      if (this.itemNft.mediaType !== 'VIDEO') return
      this.url = this.itemNft.avatar
      this.isShow = false
      //@ts-ignore
      this.$refs['bc-media']?.handleActionVideo('play')
      this.$forceUpdate()
    }
    handleLeaveMouse(): void {
      if (this.itemNft.mediaType !== 'VIDEO') return
      this.url = this.itemNft.thumb
      this.isShow = true
      //@ts-ignore
      this.$refs['bc-media']?.handleActionVideo('pause')
      this.$forceUpdate()
    }

    handleViewCollection(id: number): void {
      this.$router.push({ name: 'DetailCollection', params: { id: id + '' } })
    }

    async getListTokenAccept(isOffer = false, isBuy = false): Promise<void> {
      try {
        let params = {}
        if (isOffer) {
          params = {
            listingId: this.itemNft.minListingPrice ? this.itemNft.minListingId : null,
            itemId: !this.itemNft.minListingPrice ? this.itemNft.id : null,
            notCurrency: true
          }
        } else {
          params = { listingId: this.itemNft.minListingId, itemId: this.itemNft.id }
        }
        const result = await apiNftV2.getListAcceptPayment(params)

        if (!result.length) {
          const message = this.$t('notify_empty-list-accept-currency') as string
          this.$message.error({ message, duration: 5000 })
          return Promise.reject()
        }

        if (isBuy) {
          this.setListCurrenciesBuy(result)
        } else {
          this.setListAcceptCurrency(result)
        }
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.nft-item {
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    // &:hover {
    //   box-shadow: rgba(4, 17, 29, 0.25) 0px 0px 8px 0px;
    //   transition: all 0.1s ease 0s;
    // }
    .list-tag {
      width: 130px;
      position: absolute;
      top: 16px;
      right: 10px;
      // display: flex;
      .tag-item:first-child {
        position: absolute;
        top: 0;
        right: 88px;
        z-index: 10;
        text-align: center;
        max-width: 61px;
        width: 100%;
        height: 24px;
        // background-color: #151718;
        border-radius: 4px;
        color: #fafafa;
      }
      .tag-item:nth-child(3) {
        position: absolute;
        top: 0;
        right: -4px;
        max-width: 85px;
        width: 100%;
        border-radius: 4px;
        z-index: 10;
        text-align: center;
        overflow: hidden;
        margin: 0 4px;
        color: #fafafa;
      }
      .overlay {
        max-width: 85px;
        width: 100%;
        height: 24px;
        position: absolute;
        top: -4px;
        right: 2px;
        background-color: #151718;
        opacity: -0.3;
        border-radius: 4px;
      }
      .overlay1 {
        max-width: 61px;
        width: 100%;
        height: 24px;
        position: absolute;
        top: -4px;
        right: 92px;
        background-color: #151718;
        opacity: 0.7;
        border-radius: 4px;
      }
    }
    .top-tag {
      font-family: Open Sans;
      max-width: 85px;
      width: 100%;
      // height: 24px;
      position: absolute;
      top: 16px;
      right: 10px;
      border-radius: 4px;
      z-index: 10;
      text-align: center;
      overflow: hidden;
      // backdrop-filter: blur(5.2px);
      .title-tag {
        color: #fafafa;
      }
    }
    .overlay {
      max-width: 85px;
      width: 100%;
      height: 24px;
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: #151718;
      opacity: 0.7;
      border-radius: 4px;
    }
    .overlay1 {
      max-width: 61px;
      width: 100%;
      height: 24px;
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: #151718;
      opacity: 0.7;
      border-radius: 4px;
    }
    .top-tag1 {
      font-family: Open Sans;
      max-width: 61px;
      width: 100%;
      // height: 24px;
      position: absolute;
      top: 16px;
      right: 10px;
      border-radius: 4px;
      z-index: 10;
      text-align: center;
      overflow: hidden;
      // backdrop-filter: blur(5.2px);
      .title-tag {
        color: #fafafa;
      }
    }

    .list-tags {
      display: flex;
      position: absolute;
      top: 12px;
      right: 12px;
      .tag-item {
        margin-right: 4px;
        padding: 4px 10px;
        background: rgba(21, 23, 24, 0.7);
        color: #fff;
        border-radius: 4px;
      }
      .tag-item:last-child {
        margin: 0;
      }
    }

    .count-irr {
      display: flex;
      flex-direction: row;
      &__item {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: inherit;
        padding: 8px 10px;
        color: #151718;
        border: 1px solid var(--bc-input-hover-border);
        margin-right: 4px;
      }
      .icon-up {
        padding-bottom: 2px;
      }
      // padding: 1px;
      position: absolute;
      top: 261px;
      left: 16px;

      min-width: 93px;
      // width: 100%;
      border-radius: 30px;
      // border: 1px solid var(--bc-input-hover-border);
      // background-image: linear-gradient(90deg, #51c1b0 0.08%, #4fc1b4 20.41%, #4bc1be 45.75%, #42c2cf 73.63%, #2bafcc 100%);
    }
    .time-left {
      // position: absolute;
      // top: -20px;
      background: #fff;
      // width: fit-content;
      // margin-left: 4px;
      padding: 8px 10px;
      border: 1px solid var(--bc-input-hover-border);
      border-radius: 40px;
      .time-item {
        padding-right: 2px;
        display: flex;
        span {
          padding-left: 3px;
        }
      }
    }
    .tag {
      display: flex;
    }
    .tag-nft {
      background-color: #ececec;
      padding: 0px 10px;
      max-width: 120px;
      text-align: center;
      border-radius: 4px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .tag-nft__item1 {
        color: #151718;
        line-height: 24px !important;
      }
      .tag-nft__item2 {
        color: #0151fc;
      }
      .tag-nft__item2 {
        color: #dd7d00;
      }
    }
    .tag-quanti {
      min-width: 32px;
      background-color: #ececec;
      border-radius: 4px;
      margin-right: 6px;
      padding: 0px 8px;
    }

    .avatar {
      width: 285px;
      height: 285px;
      .wrap-media {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img,
      video {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        // object-fit: contain;
        display: block;
      }
      .empty {
        width: 285px;
        height: 285px;
      }
      .img-cover {
        img,
        video {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      .img-contain {
        img {
          object-fit: contain;
        }
      }
      .img-padded {
        img,
        video {
          padding: 16px;
          object-fit: contain;
        }
      }
    }

    .text-use {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #89909e !important;
    }
    .content {
      position: relative;
      padding: 16px;
      &--wrap {
        height: 121px;
      }

      &--wrap-used {
        height: auto;
      }
      .title {
        margin-bottom: 4px;
      }
      .price {
        margin-top: 4px;
        .icon {
          width: 24px;
          height: 24px;
          background: #f3f2f1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }
      }
      .line {
        margin: 16px 0;
        width: 100%;
        height: 1px;
        background: #dbdbdb;
      }

      .footer {
        .text-action {
          padding: 10px;
          margin: -10px;
        }
      }
    }
    .text-price {
      color: var(--bc-text-market-primary-nft);
    }
    .disabled-category {
      display: none;
    }
  }

  @media (max-width: 767px) {
    .count-irr {
      top: 310px !important;
    }
    .marketplace {
      top: 261px !important;
    }
  }
</style>
