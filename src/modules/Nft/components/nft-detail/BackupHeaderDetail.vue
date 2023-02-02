<template>
  <div id="sack-detail-nft" class="sack-detail-nft">
    <div class="detail-nft-left">
      <img :src="nftItem && nftItem.avatar" class="content-media-avatar isMobile" alt="" />
      <bc-media :isShow="isShow" :url="mediaLink && mediaLink.mediaUrl" :radius="16" class="content-media-avatar isPc" />
      <div class="slide-scroll-detail isPc">
        <swiper v-if="mediaList.length" :options="swiperOption" class="row-nft" ref="swiperRef">
          <!-- 1 khoi -->
          <swiper-slide v-for="(item, index) in mediaList" :key="index" class="item">
            <div :class="ClickActive === item.id ? 'border-active-img' : null" @click="handleShowMedia(item)">
              <img :src="item.mediaUrl" v-if="item.mediaType == 'IMAGE'" class="img-slide" :alt="item.mediaUrl" />
              <div v-else class="img-slide video-slide">
                <video ref="video" :src="item.mediaUrl"></video>
                <img src="../../../../assets/images/nft/icon-play.png" alt="" />
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div v-if="mediaList.length > 6" class="btn-crousel cursor prev" @click="handleClickArrow('prev')">
          <base-icon v-if="coinMain === 'LYNK'" icon="icon-prev" size="32" class="d-iflex" />
          <base-icon v-else icon="icon-prev-clm" size="32" class="d-iflex" />
        </div>
        <div v-if="mediaList.length > 6" class="btn-crousel cursor next" @click="handleClickArrow('next')">
          <base-icon v-if="coinMain === 'LYNK'" icon="icon-next" size="32" class="d-iflex" />
          <base-icon v-else icon="icon-next-clm" size="32" class="d-iflex" />
        </div>
      </div>
    </div>
    <div class="ml-auto detail-nft-right">
      <div class="be-scroll-custom wrap-fixed-top">
        <div class="detail-heading">
          <div class="detail-heading-address cursor" @click="handleClickCollectionName">{{ nftItem.collectionName }}</div>
          <div class="detail-heading-interative">
            <div class="be-flex wrap">
              <div class="btn-action border-left be-flex align-center cursor favourite" @click="handleClickFavourite">
                <base-icon v-if="nftItem.isFavourite === 'YES'" icon="icon-heart-red" size="28" class="d-iflex" />
                <base-icon v-else icon="icon-heart-white" size="28" class="d-iflex" />
                <span class="nft-body-base text-desc isPc" :class="nftItem.isFavourite === 'YES' ? 'color-favourite' : null">{{ nftItem.numOfFavourites | formatNumber }}</span>
              </div>
              <el-dropdown trigger="click" @command="handleOpen">
                <span class="el-dropdown-link">
                  <div class="btn-action2 btn-action border-right be-flex align-center cursor"><base-icon icon="icon-3dot" size="24" class="d-iflex" /></div>
                </span>
                <el-dropdown-menu class="dropdown-dot-nft" slot="dropdown">
                  <el-dropdown-item v-if="nftItem.myListingId" class="text-drop-nft" style="font-size: 16px; margin-top: 10px" command="change">
                    <p>{{ $t('detail-nft.dot-drop.change') }}</p>
                  </el-dropdown-item>

                  <el-dropdown-item v-if="showBuyNowOption" class="text-drop-nft" style="font-size: 16px; margin-top: 10px" command="buy">
                    <p>{{ $t('detail-nft.dot-drop.buy') }}</p>
                  </el-dropdown-item>

                  <el-dropdown-item v-if="showBtnRemoveOnSale" class="text-drop-nft" style="font-size: 16px" command="remove">
                    <p>{{ $t('detail-nft.dot-drop.remove') }}</p>
                  </el-dropdown-item>

                  <el-dropdown-item v-if="showBtnPutOnSale" class="text-drop-nft" style="font-size: 16px" command="put-on-sale">
                    <p>{{ $t('text-nft.put-on-sale') }}</p>
                  </el-dropdown-item>

                  <!-- <el-dropdown-item class="text-drop-nft" style="font-size: 16px" command="burn"
                  ><p>{{ $t('detail-nft.dot-drop.burn') }}</p></el-dropdown-item
                > -->
                  <el-dropdown-item v-if="showTransfer" class="text-drop-nft" style="font-size: 16px" command="transfer">{{ $t('detail-nft.dot-drop.transfer') }}</el-dropdown-item>

                  <el-dropdown-item class="text-drop-nft" style="font-size: 16px" command="share">
                    <p>{{ $t('detail-nft.dot-drop.share') }}</p>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item class="text-drop-nft" style="font-size: 16px; margin-bottom: 10px" command="open"
                  ><p>{{ $t('detail-nft.dot-drop.open') }}</p>
                </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="detail-nft-folder text-overflow-2">{{ nftItem.itemName }}</div>
        <div class="detail-nft-price">
          <span class="price text-base" v-if="isShowTextBuy"
            >{{ $t('nft.price') }} <span class="price-value text-base text-bg">${{ (nftItem.minPrice * exchangeRate) | convertAmountDecimal('USD') }} </span></span
          >
          <span class="minimum-bid text-base" v-if="isShowTextBid"
            >{{ $t('nft.minium-bid') }} <span class="price-value text-base text-bg">${{ (nftItem.minPrice * exchangeRate) | convertAmountDecimal('USD') }} </span></span
          >
          <span class="dot" v-if="isShowTextBuy || isShowTextBid"></span>
          <div>
            <span v-if="this.nftItem.totalListing === null" class="quantity text-base">0/{{ nftItem.totalSupply | formatNumber }} for sale</span>
            <span v-else class="quantity text-base">{{ nftItem.totalListing | formatNumber }}/{{ nftItem.totalSupply | formatNumber }} for sale</span>
          </div>
        </div>
        <div class="ck-text-description detail-nft-des" v-if="textDescription">
          <div id="text-description" :class="showClass ? 'text-overflow-2' : null" style="line-height: 24px" v-html="textDescription"></div>
          <div v-if="numOfLine > 2" style="margin-top: 5px" :class="!showClass ? 'text-rotate' : null" @click="showClass = !showClass">
            <div>
              <span class="nft-body-base text-hyperlink cursor text-medium read-more">{{ showClass ? $t('market-detail.read-more') : $t('market-detail.hide-more') }}</span>
              <base-icon v-if="coinMain === 'LYNK'" icon="icon-down" class="icon-rotate" style="padding-left: 4px" />
              <base-icon v-else icon="icon-down-clm" class="icon-rotate" style="padding-left: 4px" />
            </div>
          </div>
        </div>

        <div class="isPc">
          <div class="sack-owner-create">
            <div v-if="nftItem.numOfOwners" class="sack-owner">
              <div v-if="nftItem.numOfOwners === 1" class="sack-owner-title text-desc">{{ $t('detail-nft.header.owner') }}</div>
              <div v-else :class="nftItem.isOwner === 'YES' ? 'text-hyperlink cursor' : 'text-desc'" class="sack-owner-title" @click="handleClickViewOwner">
                {{ $t('detail-nft.header.owner') }} ({{ nftItem.numOfOwners }})
              </div>

              <div class="sack-owner-icon" v-if="nftItem.numOfOwners === 1">
                <div @click="handleViewOwner(getOwnerId)">
                  <bc-media v-if="owners[0] && owners[0].ownerAvatar" :url="owners[0] && owners[0].ownerAvatar" :radius="100" :size="12" />
                  <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
                </div>

                <div class="block-name text-hyperlink" @click="handleViewOwner(getOwnerId)">
                  <div class="text-overflow-1 nft-body-base" v-if="owners[0] && owners[0].ownerName && owners[0].ownerName.length > 15">
                    <span v-if="owners[0] && owners[0].isOwner === 'YES'"> {{ $t('you') }}</span>
                    <span v-else> {{ owners[0] && owners[0].ownerName | formatTransactionCode(5, 5) }}</span>
                  </div>
                  <p class="text-overflow-1 nft-body-base" v-else>
                    <span class="ml-0" v-if="owners[0] && owners[0].isOwner === 'YES'"> {{ $t('you') }}</span>
                    <span class="ml-0" v-else>{{ owners[0] && owners[0].ownerName }}</span>
                  </p>
                  <p v-if="nftItem.isOwner === 'YES'" class="nft-body-small text-desc">{{ $t('detail-nft.owned') }} {{ nftItem.myOriginQuantity }}/{{ nftItem.totalSupply }}</p>
                </div>

                <div v-if="owners[0] && owners[0].ownerIsVerified === 'YES'" class="verified">
                  <base-icon icon="icon-verified" size="16" class="d-iflex" />
                </div>

                <div v-if="owners[0] && owners[0].ownerIsNew === 'YES'" class="new-circle"></div>
              </div>

              <div v-else class="sack-owner-icon be-flex align-center">
                <div class="be-flex align-center" v-if="nftItem.isOwner === 'YES'">
                  <div class="block-avt">
                    <bc-media v-if="userNft.avatar" :url="userNft.avatar" :radius="100" :size="12" />
                    <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
                  </div>
                  <div class="block-name">
                    <p class="nft-body-base text-hyperlink" @click="handleClickViewMyProfile">{{ $t('you') }}</p>
                    <p class="nft-body-small text-desc">{{ $t('detail-nft.owned') }} {{ nftItem.myOriginQuantity }}/{{ nftItem.totalSupply }}</p>
                  </div>
                </div>
                <div v-else class="be-flex align-center">
                  <base-icon icon="icon-persion-circle" size="48" class="d-iflex" style="margin-left: 0" />
                  <span class="text-hyperlink nft-body-base cursor" @click="handleClickViewOwner">{{ $t('detail-nft.header.view-owner') }}</span>
                </div>
              </div>
            </div>
            <div class="sack-create">
              <div class="sack-create-title text-desc">
                {{ $t('detail-nft.header.creator') }}
                <!-- <span>({{ nftItem.creatorFee }}% royalties)</span> -->
              </div>
              <div vi class="sack-create-icon">
                <!-- <img :src="creator && creator.avatar" class="one-collection-fire" alt="" /> -->
                <div @click="handleViewCreator(nftItem.creatorId)">
                  <bc-media v-if="nftItem && nftItem.creatorAvatar" :url="nftItem && nftItem.creatorAvatar" :radius="100" :size="12" />
                  <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
                </div>

                <div class="text-overflow-1 text-hyperlink" @click="handleViewCreator(nftItem.creatorId)">
                  <span v-if="nftItem && nftItem.creatorName && nftItem.creatorName.length > 15">{{ nftItem && nftItem.creatorName | formatTransactionCode(5, 5) }}</span>
                  <span v-else>{{ nftItem && nftItem.creatorName }}</span>
                </div>
                <div v-if="nftItem && nftItem.creatorIsVerified === 'YES'" class="verified">
                  <base-icon icon="icon-verified" size="16" class="d-iflex" />
                </div>
                <div v-if="nftItem && nftItem.creatorIsNew === 'YES'" class="new-circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="isMobile">
          <div class="sack-owner-create">
            <div class="sack-create">
              <div vi class="sack-create-icon">
                <!-- <img :src="creator && creator.avatar" class="one-collection-fire" alt="" /> -->
                <div @click="handleViewCreator(nftItem.creatorId)">
                  <bc-media v-if="nftItem && nftItem.creatorAvatar" :url="nftItem && nftItem.creatorAvatar" :radius="100" :size="12" />
                  <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
                </div>

                <div v-if="nftItem && nftItem.creatorIsVerified === 'YES'" class="verified">
                  <base-icon icon="icon-verified" size="16" class="d-iflex" />
                </div>
                <div v-if="nftItem && nftItem.creatorIsNew === 'YES'" class="new-circle"></div>
              </div>
              <div class="sack-create-title text-desc">
                {{ $t('detail-nft.header.creator') }}
                <!-- <span>({{ nftItem.creatorFee }}% royalties)</span> -->
              </div>
              <div class="text-overflow-1 text-hyperlink user-style" @click="handleViewCreator(nftItem.creatorId)">
                <span v-if="nftItem && nftItem.creatorName && nftItem.creatorName.length > 15">{{ nftItem && nftItem.creatorName | formatTransactionCode(5, 5) }}</span>
                <span v-else>{{ nftItem && nftItem.creatorName }}</span>
              </div>
            </div>
          </div>
        </div>
        <tab-info :nftItem="nftItem" :metaType="metaType" :policies="policies" :metaData="metaData" @changeTab="handleChangeTab" @changeTabPolicy="handleChangeTabPolicy" />
      </div>

      <div class="wrap-fixed-bottom">
        <div v-if="nftItem.minListingPrice && !isBuy && !isBid" class="detail-money">
          <div class="one-collection-fire"><base-icon :icon="getIcon" alt="" class="d-block" size="28" /></div>
          <!-- <img src="../../../../assets/images/nft/icon-create.png" alt="" /> -->
          <div class="detail-money-price">{{ nftItem.minListingPrice | convertAmountDecimal(nftItem.currency) }}</div>
          <div class="detail-money-nearly">~ ${{ (nftItem.minListingPrice * nftItem.exchangeRate) | convertAmountDecimal('USD') }}</div>
        </div>

        <div v-if="isShowHighestBid || isShowHighestOffer" class="highest-bid">
          <div class="text-desc nft-body-base highest-bid__title">
            <span v-if="isShowHighestBid">{{ $t('detail-nft.highest-bid-title') }}</span>
            <span v-else>{{ $t('detail-nft.highest-offer-title') }}</span>
          </div>
          <div class="be-flex align-center jc-space-between highest-bid__content">
            <div class="left">
              <bc-media v-if="nftItem && nftItem.highestBidAvatar" :url="nftItem && nftItem.highestBidAvatar" :radius="100" :size="12" />
              <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex; padding-right: 8px" />
              <span class="nft-body-base text-hyperlink cursor text-overflow-1 name" @click="handleShowAccout(nftItem.highestBidId)">{{ nftItem && nftItem.highestBidName }} </span>
              <div v-if="nftItem && nftItem.highestBidIsVerified === 'YES'" class="verified">
                <base-icon icon="icon-verified" size="16" class="d-iflex" />
              </div>
              <div v-if="nftItem && nftItem.highestBidIsNew === 'YES'" class="new-circle"></div>
            </div>
            <div class="right">
              <div class="nft-header5 text-medium highest-bid-price">
                {{ nftItem.highestBid | convertAmountDecimal(nftItem.highestBidCurrency) }} {{ nftItem.highestBidCurrency }}
              </div>
              <div class="text-desc nft-body-small">~${{ (nftItem.highestBid * exchangeRateHighest) | convertAmountDecimal('USD') }}</div>
            </div>
          </div>
        </div>

        <div v-if="isShowCountDown" class="nft-body-base time-sale">
          <div v-if="nftItem.saleStatus === 'ON_AUCTION'">
            {{ $t('detail-nft.sale-end') }} <span class="text-red">{{ day }}d {{ hour }}h {{ minutes }}m {{ second }}s left</span>
          </div>
          <div class="text-desc" v-if="nftItem.saleStatus === 'NOT_FOR_SALE'">
            {{ $t('detail-nft.sale-start') }}<span class="text-red"> {{ day }}d {{ hour }}h {{ minutes }}m {{ second }}s left</span>
          </div>
        </div>
        <div class="nft-body-base time-sale text-desc" v-if="isShowTextAuctionEnd">{{ $t('detail-nft.auction-end') }}</div>

        <!-- <div v-if="showBtnEditCancelOffer" class="text-show">
        <p class="nft-header6 mt-16">
          <span class="text-disabled">{{ $t('nft.current-offer') }}</span> {{ nftItem.myLastOfferPrice | convertAmountDecimal(nftItem.currency) }} {{ nftItem.currency }}
          <span class="text-disabled"> (~${{ (nftItem.myLastOfferPrice * exchangeRate) | convertAmountDecimal('USD') }})</span>
        </p>
      </div> -->

        <div class="detail-button">
          <div v-if="showBtnAcceptBid" class="detail-button-one w-100">
            <div class="btn nft-header6 text-semibold text-center buynow" @click="handleClickAcceptBid">
              {{ $t('text-nft.accept-bid') }}
            </div>
          </div>
          <div v-if="showBtnAcceptOffer" class="detail-button-one w-100">
            <div class="btn nft-header6 text-semibold text-center buynow" @click="handleClickAcceptOffer">
              {{ $t('text-nft.accept-offer') }}
            </div>
          </div>

          <div v-if="showBtnEditCancelBid" class="detail-button-one w-100">
            <el-button :loading="isLoadingBid" class="btn nft-header6 text-semibold text-center buynow el-button-custom" @click="handleClickEditBid">{{
              $t('text-nft.edit-bid')
            }}</el-button>
          </div>
          <div v-if="showBtnEditCancelBid" class="detail-button-one w-100">
            <div class="btn-default nft-header6 text-semibold text-center text-desc bid" @click="handleCancelBid">{{ $t('text-nft.cancel-bid') }}</div>
          </div>
          <div v-if="showBtnEditCancelOffer" class="detail-button-one w-100">
            <el-button :loading="isLoadingOffer" class="btn nft-header6 text-semibold text-center buynow el-button-custom" @click="handleClickEditOffer">{{
              $t('text-nft.edit-offer')
            }}</el-button>
          </div>

          <div v-if="showBtnEditCancelOffer" class="detail-button-one w-100">
            <div class="btn-default nft-header6 text-semibold text-center text-desc bid" @click="handleCancelOffer">{{ $t('text-nft.cancel-offer') }}</div>
          </div>

          <div v-if="showBtnPutOnSale" class="detail-button-one w-100">
            <div :class="classSecondaryPutOnSale ? 'btn-default' : 'btn'" class="nft-header6 text-semibold text-center buynow" @click="handlePutOnSale">
              <p>{{ $t('text-nft.put-on-sale') }}</p>
            </div>
          </div>

          <div v-if="showBtnRemoveOnSale" class="detail-button-one w-100">
            <div :class="classSecondaryRemoveOnSale ? 'btn-default' : 'btn'" class="nft-header6 text-semibold text-center buynow" @click="handleRemoveFromSale">
              <p>{{ $t('text-nft.remove-from-sale') }}</p>
            </div>
          </div>

          <div v-if="showBtnPlaceABid" class="detail-button-one w-100">
            <el-button
              :loading="isLoadingBid"
              :class="disablePlaceABid ? 'btn--disabled' : null"
              class="btn nft-header6 text-semibold text-center buynow el-button-custom"
              @click="handlePlaceABid"
            >
              <span v-if="nftItem.myOfferId">{{ $t('button_waiting-accept') }}</span>
              <span v-else>{{ $t('text-nft.place-a-bid') }}</span>
            </el-button>
          </div>

          <div v-if="showBtnBuyNow && !showBuyNowOption" class="detail-button-one w-100">
            <el-popover ref="popper" placement="bottom" trigger="hover" popper-class="popper-list-token-accept">
              <div class="list-token-accept">
                <div
                  class="be-flex align-center cursor token-item"
                  :value="isVisible"
                  :class="tokenSelect === item.currency ? 'token-active' : null"
                  v-for="item in listTokenAccept"
                  :key="item.currency"
                  @click="handleSelectPaymentToken(item.currency)"
                >
                  <div class="d-iflex left"><base-icon :icon="getIconCurrency(item.currency)" size="24" class="d-iflex" /></div>
                  <div class="nft-body-base text-overflow-1 right">
                    <span>{{ getPriceOfToken(item.currency) }} {{ item.currency }}</span>
                  </div>
                </div>
              </div>
              <el-button
                slot="reference"
                :loading="isLoadingBuy"
                :class="classSecondaryBuyNow ? 'btn-default' : 'btn'"
                class="nft-header6 text-semibold text-center be-flex align-center buynow el-button-custom checkHover"
                @click="handleBuyNow"
              >
                <div class="be-flex align-center">
                  <p>{{ $t('text-nft.buy-now-detail', { amount: getPriceNft, currency: tokenSelect }) }}</p>
                  <div class="be-flex arrow" style="height: 24px; margin-bottom: -2px" v-if="this.coinMain == 'LYNK'">
                    <div class="isNormal">
                      <base-icon :icon="classSecondaryBuyNow ? 'icon-arrow-down-black' : 'icon-arrow-down-white'" class="d-iflex" size="20" />
                    </div>
                    <div class="isLinear">
                      <base-icon :icon="classSecondaryBuyNow ? 'icon-arrow-down-linear-lynkey' : 'icon-arrow-down-white'" class="d-iflex" size="20" />
                    </div>
                  </div>
                  <div class="be-flex arrow" style="height: 24px; margin-bottom: -2px" v-if="this.coinMain == 'CLM'">
                    <div class="isNormal">
                      <base-icon :icon="classSecondaryBuyNow ? 'icon-arrow-down-black' : 'icon-arrow-down-white'" class="d-iflex" size="20" />
                    </div>
                    <div class="isLinear">
                      <base-icon :icon="classSecondaryBuyNow ? 'icon-arrow-down-linear-clm' : 'icon-arrow-down-white'" class="d-iflex" size="20" />
                    </div>
                  </div>
                </div>
              </el-button>
            </el-popover>
          </div>

          <div class="detail-button-one w-100" v-if="showBtnMakeOffer">
            <el-button
              :loading="isLoadingOffer"
              :class="nftItem.saleType === 'BUY' ? 'btn-default' : 'btn'"
              class="nft-header6 text-semibold text-center bid el-button-custom"
              @click="handleMakeOffer"
            >
              <p>{{ $t('text-nft.make-offer') }}</p>
            </el-button>
          </div>
        </div>

        <div
          class="mt-16 be-flex align-center jc-space-center text-pending"
          v-if="statusApproveItem !== 'NONE' && statusApproveItem !== 'FAILED' && statusApproveItem !== 'SUCCESS'"
        >
          <i class="el-icon-loading"></i>
          <p class="nft-header6 text-center text-disabled" @click="handleViewTransactionCode(transactionCodeItem)">
            {{ $t('detail-nft_transaction') }} {{ transactionCodeItem | formatTransactionCode(5, 5) }} {{ $t('detail-nft_is-processing') }}
          </p>
        </div>
        <div class="mt-16 text-pending" v-if="listTransactionNft.length">
          <div class="be-flex align-center jc-space-center" v-for="item in listTransactionNft" :key="item.id">
            <i class="el-icon-loading"></i>
            <p class="nft-header6 text-center text-disabled" @click="handleViewTransactionCode(item.transaction_code)">
              {{ $t('detail-nft_transaction') }} {{ item.transaction_code | formatTransactionCode(5, 5) }} {{ $t('detail-nft_is-processing') }}
            </p>
          </div>
        </div>

        <div v-if="isShowTextNotForSale" class="text-show">
          <p class="nft-header6 text-center mt-16 text-disabled">{{ $t('text-nft.not-for-sale') }}</p>
        </div>

        <div v-if="isShowTextNoBidYet" class="text-show">
          <p class="nft-header6 text-center mt-16">
            <span class="text-disabled">{{ $t('text-nft.no-bid-yet') }}</span> {{ $t('nft.minium-bid') }} {{ getMinListingPrice }} {{ nftItem.currency }}
          </p>
        </div>
      </div>
    </div>
    <popup-change-price :nftItem="nftItem" />
    <popup-burn />
    <popup-transfer :nftItem="nftItem" />
    <popup-open />
    <popup-list-owners :nftItem="nftItem" :type="typePopup" />
    <PopupTourDetail :metaDataTour="metaDataTour" />
    <popup-detail-policy :arrMeta="metaDataPolicy" />
    <popup-cancel-bid-offer :nftItem="nftItem" :isCenterOffer="isCenterOffer" />
  </div>
</template>

<script lang="ts">
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import ActionNftMixin from '@/mixins/actionNft'
  import PopupMixin from '@/mixins/popup'
  import ShowBtnMixin from '@/mixins/showBtn'

  import EventBus from '@/utils/eventBus'

  import filter from 'lodash/filter'
  import includes from 'lodash/includes'

  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import PopupAccept from '../base/PopupAccept.vue'
  import PopupBurn from './popup/PopupBurn.vue'
  import PopupCancelBidOffer from './popup/PopupCancelBidOffer.vue'
  import PopupChangePrice from './popup/PopupChangePrice.vue'
  import PopupListBidOffer from '../base/PopupListBidOffer.vue'
  import PopupListOwners from './popup/PopupListOwner.vue'
  // import PopupMakeOffer from '../base/PopupMakeOffer.vue'
  import PopupOpen from './popup/PopupOpen.vue'
  import PopupTourDetail from './popup/PopupTourDetail.vue'
  import PopupDetailPolicy from './popup/PopupDetailPolicy.vue'
  import PopupTransfer from './popup/PopupTransfer.vue'
  import TabPolices from './componentHeaderDetailNFT/TabPolices.vue'
  import TabInfo from './TabInfo.vue'
  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import NftRepositoryV2 from '@/services/repositories/nftv2'
  const apiNft: NftRepository = getRepository('nft')
  const apiNftV2: NftRepositoryV2 = getRepository('nftv2')

  import { SwiperOptions } from 'swiper'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.css'
  import { Decimal } from 'decimal.js'

  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')
  @Component({
    components: {
      PopupListOwners,
      PopupChangePrice,
      PopupBurn,
      PopupOpen,
      PopupTransfer,
      PopupTourDetail,
      EmptyBlock,
      PopupAccept,
      PopupListBidOffer,
      PopupCancelBidOffer,
      Swiper,
      SwiperSlide,
      TabPolices,
      TabInfo,
      PopupDetailPolicy
    }
  })
  export default class HeaderDetailNFT extends Mixins(PopupMixin, ActionNftMixin, ShowBtnMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) nftItem!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) creator!: Record<string, any>
    @Prop({ required: true, type: Array, default: () => [] }) owners!: Array<Record<string, any>>
    @Prop({ required: true, type: Array, default: () => [] }) medias!: Array<Record<string, any>>
    @Prop({ required: true, type: Array, default: () => [] }) policies!: Array<Record<string, any>>
    // @Prop() medias: any
    @Prop({ required: false, type: Array, default: () => [] }) metaData!: Array<Record<string, any>>
    @Prop({ required: false, type: Array, default: () => [] }) metaType!: Array<Record<string, any>>

    @bcAuth.State('userNft') userNft!: Record<string, any>
    @bcNft.Action('setLinkShare') setLinkShare!: (link: string) => void
    @bcNft.State('listTransactionNft') listTransactionNft!: string
    @bcNft.State('statusApproveItem') statusApproveItem!: string
    @bcNft.State('transactionCodeItem') transactionCodeItem!: string
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>
    @bcNft.Mutation('SET_LIST_ACCEPT_CURRENCY') setListAcceptCurrency!: (list: Array<Record<string, any>>) => void

    isActive = 'schedule'
    // totalListing = 0
    read = false
    typePopup = 'OWNER'
    numOfLine = 0
    showClass = false
    textDescription = ''
    // textTour = ''
    infoLynkey: any = []
    infoBid: any = []
    // infoChangePrice: any = []
    checkValueTour = false
    isTour = true
    title = ''
    titlePrice = ''
    titleOffer = false
    isShowBtn = false
    typeAction = ''
    tabActive = ''
    dataChangePrice: any = []
    listBid: any = []
    oneBid = {}
    isCenterOffer = false
    isBtnOffer = false
    isEditOffer = false
    mediaLink: Record<string, any> = {}
    ClickActive = 0

    day: number | string = '0'
    hour: number | string = '0'
    minutes: number | string = '0'
    second: number | string = '0'
    timing: any = null

    isLoadingBid = false
    isLoadingBuy = false
    isLoadingOffer = false

    query = {
      total: ''
    }
    getOwnerId = ''
    url = ''
    swiperOption: SwiperOptions = {
      slidesPerView: 6,
      spaceBetween: 12,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    }

    isVisible = false
    tokenSelect = ''
    listTokenAccept: Array<Record<string, any>> = []

    metaDataTour: Array<Record<string, any>> = []
    metaDataPolicy: Array<Record<string, any>> = []

    get isShowTextBuy(): boolean {
      return this.isBuy && this.nftItem.saleType === 'BUY' && this.nftItem.saleStatus === 'ON_SALE' && this.nftItem.minPrice
    }

    get isShowTextBid(): boolean {
      return this.isBid && this.nftItem.saleType === 'BID' && this.nftItem.minPrice
    }

    get getLink(): string {
      const origin = process.env.VUE_APP_URL
      if (this.coinMain == 'LYNK') {
        this.url = 'metamart/nft/' + this.nftItem.id
      }
      if (this.coinMain == 'CLM') {
        this.url = 'marketplace/nft/' + this.nftItem.id
      }
      return origin + this.url
    }

    handleViewOwner(id: string): void {
      for (let i = 0; i < this.owners.length; i++) {
        this.getOwnerId = this.owners[i].ownerId
      }
      let id2 = this.getOwnerId
      this.$router.push({ name: 'UserProfile', params: { id: id2 } })
    }

    handleViewCreator(id: string): void {
      let id1 = this.nftItem.creatorId
      this.$router.push({ name: 'UserProfile', params: { id: id1 } })
    }

    arrDownload: Array<Record<string, any>> = [
      {
        id: 0,
        name: 'File PDF',
        icon: 'pdf'
      },
      {
        id: 1,
        name: 'File DOCX',
        icon: 'word'
      },
      {
        id: 2,
        name: 'File EXCEL',
        icon: 'excel'
      }
    ]
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

    exchangeRateRef: any = null

    isShowCountDown = false
    isShowTextAuctionEnd = false

    currentTime = 0
    timingCurrentTime: any = null

    get getIcon(): string {
      const filterCoin = filter(this.listCoin, (elm: Record<string, any>) => elm.symbol === this.nftItem.currency)[0]
      return filterCoin.icon
    }

    get getMinListingPrice(): string {
      if (this.nftItem.minListingPriceWei) {
        const decimal = this.$options.filters?.getDecimalsToken(this.nftItem.currency)
        const minListingPriceWei = new Decimal(this.nftItem.minListingPriceWei)
        const minimumBid = minListingPriceWei.div(Math.pow(10, decimal))
        return this.$options.filters?.roundUpNumberCurrency(minimumBid.toNumber(), this.nftItem.currency)
      }
      return '0'
    }

    get isHoverBuyNow(): boolean {
      if (this.coinMain == 'LYNK') {
        return true
      } else {
        return false
      }
    }

    get isShow(): boolean {
      return this.mediaLink?.mediaType === 'IMAGE'
    }

    get isShowTour(): boolean {
      if (this.metaData && this.metaData.length) {
        const tour = filter(this.metaData, elm => elm.metaType === 'TOUR_SCHEDULE')
        return tour.length > 0
      } else {
        return false
      }
    }

    get isShowTourDetail(): boolean {
      if (this.metaData && this.metaData.length === 0) {
        return false
      } else {
        const tour = filter(this.metaData, elm => elm.metaType === 'TOUR_SCHEDULE')
        if (this.metaData && tour.length && tour[0]?.metaDescription) {
          return true
        } else {
          return false
        }
      }
    }

    get eBrochures() {
      if (this.metaData && this.metaData.length) {
        const ebrochures = filter(this.metaData, elm => elm.metaType === 'EBROCHURES')
        console.log('ebrochures', ebrochures)
        return ebrochures
      } else {
        return []
      }
    }

    get showTransfer(): boolean {
      return this.nftItem.myRemainQuantity
    }

    get textTour(): string {
      const language = window.localStorage.getItem('bc-lang')!
      if (!this.isShowTour) {
        return ''
      } else {
        const tour = filter(this.metaData, elm => elm.metaType === 'TOUR_SCHEDULE')[0]
        const objDesc = JSON.parse(tour.metaDescription)
        return objDesc[language].replace(/\\n/g, '<br>')
      }
    }

    get isShowHighestBid(): boolean {
      const saleType = this.nftItem?.saleType
      const numOfBids = this.nftItem?.numOfBids
      return this.isBid && saleType === 'BID' && numOfBids
    }

    get isShowHighestOffer(): boolean {
      const hasOffer = this.nftItem?.hasOffer
      return this.isOffer && hasOffer === 'YES'
    }

    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get exchangeRateHighest(): number {
      if (this.nftItem?.highestBidCurrency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.highestBidCurrency)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get exchangeRateOfInputPayment(): number {
      if (this.tokenSelect && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.tokenSelect)[0]
        return coin.exchangeRate
      }
      return 0
    }

    get getPriceNft(): number {
      const price = (this.nftItem.minListingPrice * this.exchangeRate) / this.exchangeRateOfInputPayment
      return this.$options.filters?.convertAmountDecimal(price, this.tokenSelect)
    }

    get contractAddress(): string {
      if (this.listAssetNetwork.length) {
        const tokenLynk = filter(this.listAssetNetwork, token => token.currency === this.nftItem.currency)[0]
        return tokenLynk?.contractAddress || ''
      }
      return ''
    }

    get mediaList() {
      return this.medias
    }

    handleClickArrow(type: string): void {
      if (type === 'next') {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slideNext()
      } else {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slidePrev()
      }
    }

    handleShowMedia(item) {
      // const active = filter(this.mediaList, elm => elm.id === item.id)
      // this.mediaList.forEach(elm => {
      //   if (elm.id == item.id) {
      //     this.ClickActive = true
      //     this.mediaList.forEach(elm => {
      //       if (elm) {
      //         this.ClickActive = false
      //       }
      //     })
      //   }
      // })
      if (item.id) {
        this.ClickActive = item.id
        console.log(this.ClickActive)
      }
      this.mediaLink = item
    }

    @Watch('nftItem', { deep: true, immediate: true }) handleWatchItemNft(item: Record<string, any>): void {
      if (item.id) {
        this.getListTokenAccept(false, true, true)
        if (item.description) {
          const language = window.localStorage.getItem('bc-lang')!
          if (item.description) {
            const objDesc = JSON.parse(this.nftItem.description)
            this.textDescription = objDesc[language]
            this.$nextTick(() => {
              this.checkLengthText('text-description')
            })
          }
        }
      }
      // this.tokenSelect = this.nftItem.currency
      clearInterval(this.timing)
      this.checkCountDown()
      this.handleSetCountDown()
    }

    @Watch('medias', { deep: true, immediate: true }) handleWatchMedias(item: Record<string, any>): void {
      this.mediaLink = this.mediaList[0]
      this.ClickActive = this.mediaList[0]?.id
    }

    // @Watch('isShow', { deep: true, immediate: true }) handleWatchmediaType(item: Record<string, any>): void {
    //   this.mediaLink = this.mediaList[0].mediaUrl
    // }

    nftItemsProps: any = {}

    async redirectLinkButtonMail(): Promise<void> {
      console.log('nft', this.nftItem)

      if (this.$route.query.openBid === '1') {
        if (this.nftItem && this.nftItem && this.showBtnAcceptBid) {
          await this.handleAcceptBid(this.nftItem!)
        } else {
          await this.$router.replace({ query: undefined }).catch(error => {
            if (error.name != 'NavigationDuplicated') throw error
          })
        }
      }
      if (this.$route.query.openOffer === '1') {
        if (this.nftItem && this.nftItem && this.showBtnAcceptOffer) {
          await this.handleAcceptOffer(this.nftItem!)
        } else {
          await this.$router.replace({ query: undefined }).catch(error => {
            if (error.name != 'NavigationDuplicated') throw error
          })
        }
      } else {
        await this.$router.replace({ query: undefined }).catch(error => {
          if (error.name != 'NavigationDuplicated') throw error
        })
        // await this.$router.replace({query: {}});
      }
    }
    async created(): Promise<void> {
      await this.redirectLinkButtonMail()
      this.checkTabActive()
      this.setWidthListCurrency()
      this.timingCurrentTime = setInterval(() => {
        this.currentTime = Date.now()
      }, 1000)
    }

    checkTabActive(): void {
      if (this.coinMain == 'LYNK') {
        if (this.metaData.length) {
          const tour = filter(this.metaData, elm => elm.metaType === 'TOUR_SCHEDULE')
          if (!tour.length) {
            this.isActive = 'details'
          }
        }
        this.isActive = 'details'
      } else {
        this.isActive = 'nftInfo'
      }
    }

    setWidthListCurrency(): void {
      const elm = document.querySelector('.popper-list-token-accept') as HTMLElement
      if (this.showBtnBuyNow) {
        const arrBtn: boolean[] = [
          this.showBtnPutOnSale,
          this.showBtnPlaceABid,
          this.showBtnAcceptBid,
          this.showBtnEditCancelBid,
          this.showBtnRemoveOnSale,
          this.showBtnMakeOffer,
          this.showBtnAcceptOffer,
          this.showBtnEditCancelOffer
        ]
        if (includes(arrBtn, true)) {
          elm.style.width = '250px'
        }
      }
    }

    destroyed(): void {
      clearInterval(this.timing)
      clearInterval(this.timingCurrentTime)
    }

    checkCountDown(): void {
      const saleStatus = this.nftItem?.saleStatus
      const saleType = this.nftItem?.saleType
      const endDate = this.nftItem?.endDate
      const endDateTime = new Date(endDate).getTime()
      const startDate = this.nftItem?.startDate
      const startDateTime = new Date(startDate).getTime()
      const now = Date.now()

      if (this.isBid) {
        if ((saleStatus === 'ON_AUCTION' && endDateTime > now) || (saleType === 'BID' && saleStatus === 'NOT_FOR_SALE' && startDateTime > now)) {
          this.isShowCountDown = true
        } else {
          this.isShowCountDown = false
        }
      } else {
        this.isShowCountDown = false
      }
    }

    handleSetCountDown(): void {
      let endDate = 0
      let startDate = 0
      const saleStatus = this.nftItem.saleStatus

      if (this.isShowCountDown) {
        if (saleStatus === 'NOT_FOR_SALE') {
          startDate = new Date(this.nftItem.startDate).getTime()
        }
        if (saleStatus === 'ON_AUCTION') {
          endDate = new Date(this.nftItem.endDate).getTime()
        }
        this.timing = setInterval(() => {
          let now = new Date().getTime()
          let distance = saleStatus === 'NOT_FOR_SALE' ? startDate - now : endDate - now

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
            this.minutes =
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
            if (saleStatus === 'ON_AUCTION') {
              this.isShowTextAuctionEnd = true
            }
            setTimeout(() => {
              this.$emit('reload')
            }, 10 * 1000)
          }
        }, 1000)
      } else {
        this.isShowTextAuctionEnd = false
      }
    }

    handleShowAccout(id: number): void {
      this.$router.push({ name: 'UserProfile', params: { id: id + '' } })
    }

    checkLengthText(text): void {
      let el = document.getElementById(`${text}`) as HTMLElement
      let divHeight = el.offsetHeight
      let lineHeight = parseInt(el.style.lineHeight)
      let lines = divHeight / lineHeight
      if (lines > 3) {
        this.showClass = true
        this.numOfLine = lines
      }
    }
    handleClose(): void {
      console.log('close')
    }

    async handleBuyNow(): Promise<void> {
      try {
        await this.getListTokenAccept(false, false, true)
        this.setCurrencySelectBuy(this.tokenSelect)
        //@ts-ignore
        this.$refs.popper?.doClose()
        const contractOfToken = this.getContractAddressOfCurrency(this.tokenSelect)
        await this.buyNow(this.nftItem, this.walletAddress, contractOfToken)
      } catch (error) {
        console.log(error)
      }
    }
    async handlePlaceABid(): Promise<void> {
      try {
        if (this.nftItem.minListingId) {
          if (this.statusApproveItem !== 'NONE' && this.statusApproveItem !== 'FAILED' && this.statusApproveItem !== 'SUCCESS') {
            const hash = this.$options.filters?.formatTransactionCode(this.transactionCodeItem)
            let message = this.$t('notify_transaction-approve-pending', { hash }) as string
            this.$message.error({ message, duration: 5000 })
          } else {
            await this.getListTokenAccept()
            await this.setTokenNeedGetBalance(this.listAcceptCurrency[0].currency)
            await this.placeBid(this.nftItem, this.contractAddress)
          }
        } else {
          let message = (this.nftItem.itemName + ' ' + this.$t('notify.transaction-is-pending')) as string
          this.$message.error({ message, duration: 5000 })
        }
      } catch (error) {
        console.log(error)
      }
    }

    handleRemoveFromSale(): void {
      this.removeSale(this.nftItem)
    }

    handlePutOnSale(): void {
      this.putOnSale(this.nftItem)
    }
    async handleMakeOffer(): Promise<void> {
      try {
        if (this.statusApproveItem !== 'NONE' && this.statusApproveItem !== 'FAILED' && this.statusApproveItem !== 'SUCCESS') {
          const hash = this.$options.filters?.formatTransactionCode(this.transactionCodeItem)
          let message = this.$t('notify_transaction-approve-pending', { hash }) as string
          this.$message.error({ message, duration: 5000 })
          return
        }
        if (this.nftItem.saleType == 'BUY' && this.nftItem.minListingId == null) {
          let message = (this.nftItem.itemName + ' ' + this.$t('notify_transaction-pending-blockchain')) as string
          this.$message.error({ message, duration: 5000 })
        } else {
          await this.getListTokenAccept(true)
          await this.setTokenNeedGetBalance(this.listAcceptCurrency[0].currency)
          await this.makeOffer(this.nftItem, this.owners, this.contractAddress)
        }
      } catch (error) {
        console.log(error)
      }
    }
    async handleClickEditOffer(): Promise<void> {
      try {
        if (this.statusApproveItem !== 'NONE' && this.statusApproveItem !== 'FAILED' && this.statusApproveItem !== 'SUCCESS') {
          const hash = this.$options.filters?.formatTransactionCode(this.transactionCodeItem)
          let message = this.$t('notify_transaction-approve-pending', { hash }) as string
          this.$message.error({ message, duration: 5000 })
          return
        }
        if (this.nftItem.saleType == 'BUY' && this.nftItem.minListingId == null) {
          let message = (this.nftItem.itemName + ' ' + this.$t('notify_transaction-pending-blockchain')) as string
          this.$message.error({ message, duration: 5000 })
        } else {
          await this.getListTokenAccept(true)
          await this.setTokenNeedGetBalance(this.nftItem.myLastOfferCurrency)
          await this.handleEditOffer(this.nftItem, this.owners, this.contractAddress)
        }
      } catch (error) {
        console.log(error)
      }
    }
    handleClickAcceptBid(): void {
      if (this.statusApproveItem !== 'NONE' && this.statusApproveItem !== 'FAILED' && this.statusApproveItem !== 'SUCCESS') {
        const hash = this.$options.filters?.formatTransactionCode(this.transactionCodeItem)
        let message = this.$t('notify_transaction-approve-pending', { hash }) as string
        this.$message.error({ message, duration: 5000 })
      } else {
        this.handleAcceptBid(this.nftItem)
      }
    }

    handleClickAcceptOffer(): void {
      this.handleAcceptOffer(this.nftItem)
    }
    async handleClickEditBid(): Promise<void> {
      try {
        if (this.nftItem.minListingId) {
          if (this.statusApproveItem !== 'NONE' && this.statusApproveItem !== 'FAILED' && this.statusApproveItem !== 'SUCCESS') {
            const hash = this.$options.filters?.formatTransactionCode(this.transactionCodeItem)
            let message = this.$t('notify_transaction-approve-pending', { hash }) as string
            this.$message.error({ message, duration: 5000 })
          } else {
            await this.getListTokenAccept()
            await this.setTokenNeedGetBalance(this.nftItem.myLastOfferCurrency)
            await this.handleEditBid(this.nftItem, this.contractAddress)
          }
        } else {
          let message = this.nftItem.itemName + ' ' + this.$t('notify.transaction-is-pending')
          this.$message.error({ message, duration: 5000 })
        }
      } catch (error) {
        console.log(error)
      }
    }

    async handleCancelBid(): Promise<void> {
      if (this.statusApproveItem !== 'NONE' && this.statusApproveItem !== 'FAILED' && this.statusApproveItem !== 'SUCCESS') {
        const hash = this.$options.filters?.formatTransactionCode(this.transactionCodeItem)
        let message = this.$t('notify_transaction-approve-pending', { hash }) as string
        this.$message.error({ message, duration: 5000 })
      } else {
        const params = {
          listingId: this.nftItem?.minListingId
        }
        const result = await apiNft.getLynkeyInfo(this.nftItem.currency, params)
        this.setInfoActivity(result)
        this.isCenterOffer = false
        this.setOpenPopup({
          popupName: 'popup-cancel-bid-offer',
          isOpen: true
        })
      }
    }
    async handleCancelOffer(): Promise<void> {
      const params = {
        listingId: this.nftItem?.minListingId,
        itemId: this.nftItem.id,
        ownerId: this.owners[0].ownerId
      }
      const result = await apiNft.getLynkeyInfo(this.nftItem.currency, params)
      this.setInfoActivity(result)
      this.isCenterOffer = true
      this.setOpenPopup({
        popupName: 'popup-cancel-bid-offer',
        isOpen: true
      })
    }

    handleClickCollectionName(): void {
      this.$router.push({ name: 'DetailCollection', params: { id: this.nftItem.collectionId } })
    }

    async handleOpen(command: string): Promise<void> {
      if (command === 'change') {
        this.setOpenPopup({
          popupName: 'popup-change-price',
          isOpen: true
        })
      }
      if (command === 'remove') {
        this.removeSale(this.nftItem)
      }
      if (command === 'put-on-sale') {
        this.putOnSale(this.nftItem)
      }
      if (command === 'burn') {
        this.setOpenPopup({
          popupName: 'popup-burn',
          isOpen: true
        })
      }
      if (command === 'transfer') {
        this.setOpenPopup({
          popupName: 'popup-transfer-nft',
          isOpen: true
        })
      }
      if (command === 'share') {
        // console.log('item.id', this.nftItem.id)
        this.setLinkShare(this.getLink)
        this.setOpenPopup({
          popupName: 'popup-share',
          isOpen: true
        })
      }
      if (command === 'open') {
        this.setOpenPopup({
          popupName: 'popup-open',
          isOpen: true
        })
      }
      if (command === 'buy') {
        this.handleBuyNow()
      }
      // this.listOwner = await apiNft.getChangePrice(this.$route.params.id, this.query)
    }

    handleClickFavourite(): void {
      if (!this.isLogin) {
        const message: any = this.$t('notify.must-login')
        this.$message.error({ message, duration: 5000 })
        const detail = {
          isBack: 'nft',
          id: this.nftItem.id! as string,
          name: this.$route.name as string
        }
        setTimeout(() => {
          this.$router.push({ name: 'login', query: { ...detail } })
        }, 1000)
        return
      }
      const data = {
        objectType: 'NFT',
        objectId: this.nftItem.id,
        actionType: this.nftItem.isFavourite === 'YES' ? 'UN_FAVOURITE' : 'FAVOURITE'
      }
      this.$emit('favourite', data)
      if (this.nftItem.isFavourite === 'YES') {
        this.nftItem.numOfFavourites -= 1
        this.nftItem.isFavourite = 'NO'
      } else {
        this.nftItem.numOfFavourites += 1
        this.nftItem.isFavourite = 'YES'
      }
    }
    // centerDialogChangePrice():void{
    //   this.setOpenPopup({
    //     popupName: 'popup-change-price',
    //     isOpen: true
    //   })
    //   console.log('vao')
    // }

    handleClickViewOwner(): void {
      this.typePopup = 'OWNER'
      this.setOpenPopup({
        popupName: 'popup-list-owner',
        isOpen: true
      })
      EventBus.$emit('getOwnerId', this.getOwnerId)
    }

    handleClickViewMyProfile(): void {
      this.$router.push({ name: 'MyProfileNft' })
    }

    handleViewTransactionCode(code: string): void {
      const currency = this.nftItem.currency
      const path = currency === 'BNB' || currency === 'BUSD' ? process.env.VUE_APP_URL_SCAN_TX_BNB : process.env.VUE_APP_URL_SCAN_TX_ETH
      window.open(`${path}${code}`, '_blank')
    }

    getIconCurrency(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : ''
    }

    handleSelectPaymentToken(token: string): void {
      this.tokenSelect = token
      this.$forceUpdate()
      this.handleBuyNow()
    }

    getPriceOfToken(token: string): string {
      let exchangeRateOfToken = 0
      if (this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === token)[0]
        exchangeRateOfToken = coin.exchangeRate
      }
      const amount = (this.nftItem.minListingPrice * this.exchangeRate) / exchangeRateOfToken
      return this.$options.filters?.convertAmountDecimal(amount, token)
    }

    async getListTokenAccept(isOffer = false, isFirst = false, isBuy = false): Promise<void> {
      try {
        let params = {}
        if (isOffer) {
          params = {
            listingId: this.nftItem.minListingPrice ? this.nftItem.minListingId : null,
            itemId: !this.nftItem.minListingPrice ? this.nftItem.id : null,
            notCurrency: true
          }
        } else {
          params = { listingId: this.nftItem.minListingId, itemId: this.$route.params.id }
        }
        const result = await apiNftV2.getListAcceptPayment(params)
        if (!isBuy) {
          this.listTokenAccept = filter(result, elm => elm.currency !== 'USDT')
          this.setListAcceptCurrency(this.listTokenAccept)
        } else {
          this.listTokenAccept = result
          this.setListCurrenciesBuy(this.listTokenAccept)
        }

        if (isFirst) {
          this.tokenSelect = (this.listTokenAccept.length && this.listTokenAccept[0]?.currency) || ''
        }

        return Promise.resolve()
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    }
    handleChangeTab(metaData: Array<Record<string, any>>): void {
      this.metaDataTour = metaData
      this.setOpenPopup({
        popupName: 'popup-tour-details',
        isOpen: true
      })
    }
    handleChangeTabPolicy(metaData: Array<Record<string, any>>): void {
      this.metaDataPolicy = metaData
      this.setOpenPopup({
        popupName: 'popup-detail-policy',
        isOpen: true
      })
    }
  }
</script>

<style lang="scss" scoped>
  .sack-detail-nft {
    display: flex;
    justify-content: space-between;
  }
  ::v-deep.detail-nft-left {
    width: 630px;
    // height: 630px;
    video {
      height: auto;
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
      width: auto;
      border-radius: 8px !important;
    }
    img {
      // width: 630px;
      // height: 630px;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: 8px !important;
      @media (max-width: 767px) {
        border-radius: unset !important;
      }
    }
    .img-slide {
      width: 85px;
      height: 85px;
      margin: 4px;
    }
    .video-slide {
      position: relative;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
      }
    }
    .wrap-media {
      .empty {
        width: 630px;
        height: 630px;
      }
    }
    .el-dropdown-menu__item {
      p {
        font-size: 16px !important;
      }
    }
    .el-dropdown-menu__item--divided {
      padding: 0 15px;
    }
  }
  .dropdown-dot-nft {
    .text-drop-nft {
      color: #000;
      font-weight: 400;
    }
    .line-drop {
      text-align: center;
    }
  }
  .one-collection-fire {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f2f1;
  }
  .detail-nft-right {
    max-width: 508px;
    width: 100%;
    position: relative;

    .wrap-fixed-top {
      height: 636px;
      overflow: auto;
      border-bottom: 1px solid #dbdbdb;

      &::-webkit-scrollbar-thumb {
        background: rgb(22 22 26 / 27%);
      }

      @media screen and (max-width: 375px) {
        height: auto;
        overflow: hidden;
      }
    }
    .detail-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-address {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: var(--bc-theme-dark);
      }
    }
    .detail-nft-folder {
      font-size: 40px;
      line-height: 56px;
      font-weight: 600;
      margin-top: 12px;
      margin-bottom: 8px;
    }
    .detail-nft-des {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;

      margin-bottom: 24px;
      .btn-change {
        color: #115bfc;
        cursor: pointer;
      }
    }

    .sack-owner-create {
      display: flex;
    }
    .sack-owner-title,
    .sack-create-title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      margin-bottom: 12px;
    }
    .sack-owner,
    .sack-create {
      width: 50%;
    }
    ::v-deep.sack-owner-icon,
    ::v-deep.sack-create-icon {
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;
      span {
        margin-left: 12px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
      }
      img {
        width: 48px;
        height: 48px;
        border-radius: 100%;
        object-fit: cover;
      }
      .wrap-media {
        width: 48px;
        height: 48px;
        .span-icon {
          margin-left: 0;
        }
      }
      .verified {
        position: absolute;
        height: 14px;
        bottom: 0;
        left: 32px;

        span {
          margin-left: 0;
        }
      }
      .new-circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #129961;
        border: 1px solid #ffffff;
        position: absolute;
        left: 36px;
        top: 2px;
      }
      .span-icon {
        margin-left: 0;
      }
      .block-name {
        margin-left: 12px;
      }
    }

    .detail-nft-bottom {
      display: flex;
      &-left {
        width: 50%;
      }
      &-right {
        width: 50%;
        .time-sales {
          display: flex;
          .time-sales1 {
            width: 25%;
            &-number {
              font-size: 16px;
              line-height: 24px;
              font-weight: 600;
              color: #0e0b23;
            }
            &-des {
              font-size: 14px;
              line-height: 24px;
              font-weight: 400;
              color: #5b616e;
            }
          }
        }
      }
      .sack-avatar-monney {
        display: flex;
        img {
          margin-right: 12px;
        }
        .sack-monney {
          .sack-money1 {
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
            color: var(--bc-text-market-primary);
          }
          .sack-money2 {
            font-size: 14px;
            line-height: 24px;
            font-weight: 400;
            color: var(--bc-text-discript);
          }
        }
      }
      .detail-nft-by {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: var(--bc-text-discript);
        margin-bottom: 12px;
        border-top: 3px solid #0151fc;
        padding-top: 20px;
        span {
          color: #0151fc !important;
        }
      }
    }
    .detail-money {
      margin-top: 28px;
      // margin-bottom: 16px;
      display: flex;
      align-items: center;
      img {
        width: 48px;
        height: 48px;
        border: 10px solid #f3f2f1;
        border-radius: 50%;
        margin-right: 8px;
      }
      &-price {
        font-size: 32px;
        line-height: 48px;
        font-weight: 600;
        margin-right: 8px;
      }
      &-nearly {
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
        transform: translateY(4px);
      }
    }

    ::v-deep.highest-bid {
      margin-top: 24px;
      &__title {
        margin-bottom: 12px;
      }
      &__content {
        border-radius: 8px;
        border: 1px solid #dbdbdb;
        padding: 16px;
        .left {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 54%;
          .wrap-media {
            width: 48px;
            height: 48px;
            margin-right: 8px;
            img {
              object-fit: cover;
            }
          }
          .name {
            flex: 1;
          }

          .verified {
            height: 16px;
            position: absolute;
            bottom: -1px;
            left: 32px;
          }
          .new-circle {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #129961;
            border: 1px solid #ffffff;
            position: absolute;
            left: 36px;
            top: 2px;
          }
        }
        .right {
          text-align: right;
        }
      }
    }

    .time-sale {
      margin-top: 12px;
      .text-red {
        color: var(--bc-required);
      }
    }

    .detail-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // margin-bottom: 56px;
      margin-top: 16px;
      &-one {
        // width: calc((100% - 24px) / 2);
        margin-right: 24px;
      }
      &-one:last-child {
        margin-right: 0;
      }
      &-default {
        cursor: pointer;
        width: 242px;
        height: 48px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        color: #5b616e;
        border: 1px solid #dbdbdb;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .buynow {
        padding: 12px 0 !important;
        width: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
        .arrow {
          margin-left: 16px;
        }
      }
      .bid {
        padding: 11px 0 !important;
        width: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .el-button-custom {
        font-size: 16px !important;
        line-height: 24px !important;
        padding: 11px 6px !important;
      }
    }

    .text-pending {
      p {
        margin-left: 5px;
        color: #dd7d00;
        cursor: pointer;
      }
    }
  }
  .btn-action {
    height: 48px;
    padding: 12px;
    border: 1px solid #dbdbdb;
  }
  .border-right {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .border-left {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  .color-code {
    color: #0151fc !important;
  }
  .favourite {
    border-right: none;
    // border-top-right-radius: 6px;
    // border-bottom-right-radius: 6px;
  }
  ::v-deep.text-rotate {
    .icon-rotate {
      padding-right: 4px;
      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }

  .isPc {
    display: block !important;
  }
  .isMobile {
    display: none !important;
  }
  .asking-price-title {
    display: flex;
    margin-bottom: 8px;
    justify-content: space-around;
    .title-one {
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 2px;
        bottom: -10px;
        opacity: 0.8;
        left: 50%;
        background: var(--bc-menu-active);
        border-radius: 50%;
        transform: translateX(-50%);
      }
      &::after {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        bottom: -13px;
        left: 50%;
        background: var(--bc-menu-active);
        border-radius: 50%;
        transform: translateX(-50%);
        opacity: 0.3;
      }
    }
  }
  .asking-price-line {
    width: 100%;
    height: 2px;
    background: var(--bc-menu-active);
    opacity: 0.2;
  }
  .isNormal {
    display: block;
  }
  .isLinear {
    display: none;
  }
  .checkHover:hover {
    .isNormal {
      display: none;
    }
    .isLinear {
      display: block;
    }
  }
  @media (max-width: 767px) {
    .isPc {
      display: none !important;
    }
    .isMobile {
      display: block !important;
    }
    .border-left,
    .border-right {
      border-radius: 4px;
    }
    .favourite {
      border-right: 1px solid #dbdbdb;
    }
    .btn-action {
      height: 27px;
      padding: unset;
      margin-left: 10px;
    }
  }

  ::v-deep.sack-detail-nft {
    @media screen and (max-width: 767px) {
      flex-direction: column;
      .detail-nft-left {
        width: 100%;
        height: 100%;
        .wrap-media {
          .content-media {
            img {
              border-radius: 0 !important;
            }
          }
        }
      }
      .detail-nft-right {
        // max-width: calc(100% - 40px);
        margin: 16px auto 0;
        .detail-heading {
          &-address {
            font-size: 14px;
            line-height: 20px;
            color: var(--bc-theme-primary);
          }
          &-interative {
            // display: none;
          }
        }
        .detail-nft-folder {
          margin: 18px 0 8px;
          font-size: 20px;
          line-height: 24px;
        }
        .detail-nft-des {
          margin-bottom: 12px;
          #text-description {
            font-size: 14px;
          }
          .read-more {
            font-size: 14px;
          }
        }
        .sack-owner-create {
          flex-direction: column;
          .sack-owner,
          .sack-create {
            width: 100%;
            .sack-owner-title,
            .sack-create-title {
              font-size: 14px;
              line-height: 20px;
              margin-bottom: -9px;
              margin-right: 3px;
              margin-left: 12px;
            }
            .user-style {
              margin-bottom: -9px;
            }
            .sack-owner-icon,
            .sack-create-icon {
              .wrap-media {
                width: 34px;
                height: 34px;
                .content-media {
                  img {
                    width: 34px;
                    height: 34px;
                  }
                }
              }
              .verified {
                left: 20px;
                .span-icon {
                  font-size: 14px !important;
                }
              }
              .new-circle {
                left: 25px;
              }
            }
          }
          .sack-create {
            margin-top: 12px;
            display: flex;
            align-items: center;
          }
        }

        .list-item {
          .item {
            font-size: 14px;
            line-height: 20px;
          }
        }
        .content-about {
          // height: 160px;
          .content-about1 {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 12px;
            &:last-child {
              padding-bottom: 24px;
              margin-bottom: 0;
            }
          }
        }
        .highest-bid {
          &__content {
            padding: 15px 16px;
            .left {
              .wrap-media {
                width: 34px;
                height: 34px;
              }
              .span-icon {
                font-size: 34px !important;
              }
              .verified {
                left: 20px;
                .span-icon {
                  font-size: 14px !important;
                }
              }
              .new-circle {
                left: 25px;
              }
            }
            .right {
              .highest-bid-price {
                font-size: 14px;
                line-height: 20px;
              }
              .nft-body-small {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
        }

        .time-sale {
          font-size: 14px;
          line-height: 20px;
        }
        .detail-button {
          margin-top: 12px;
        }
      }
      .detail-nft-price {
        padding-bottom: 12px;
        align-items: center;
        .minimum-bid {
          font-size: 14px;
          line-height: 20px;
        }
        .dot {
          margin: 10px 8px;
        }
        .quantity {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  .detail-nft-price {
    display: flex;
    // justify-content: space-between;
    // max-width: 400px;
    width: 100%;
    // padding-top: 8px;
    padding-bottom: 16px;
    .price-value {
      font-weight: 600;
    }
    .price {
      // margin-right: -100px;
      color: #5b616e;
    }
    .minimum-bid {
      // margin-right: -100px;
      color: #5b616e;
      font-weight: 400;
    }
    .quantity {
      // margin-left: -100px;
      color: #5b616e;
    }
    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c4c4c4;
      margin: 10px 12px;
    }
  }
  .content-media-avatar {
    .content-media {
      display: unset !important;
    }
  }
  .slide-scroll-detail {
    position: relative;
  }
  .btn-crousel {
    top: 50%;
    z-index: 2;
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
    transform: translateY(-50%);
  }
  .prev {
    left: -22px;
  }
  .next {
    right: -22px;
  }
  .border-active-img {
    border: 2px solid;
    // border-image-source: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
    // border-image-slice: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    position: relative;

    // padding: 30% 2em;
    box-sizing: border-box;
    color: #fff;
    background: #fff;
    background-clip: padding-box;
    border: solid 2px transparent;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      margin: -2px;
      border-radius: 12px;
      background: var(--bc-tab-active);
    }
  }
  @media (max-width: 1200px) {
    .detail-nft {
      padding-top: 90px;
    }
    .sack-detail-nft {
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .detail-nft-right {
      max-width: 630px;
      width: 100%;
      position: relative;
      margin: 0 auto;
      margin-top: 40px;
    }
  }
</style>
