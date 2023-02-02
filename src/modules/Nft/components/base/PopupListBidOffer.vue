<template>
  <base-popup name="popup-list-bid-offer" class="popup-list-bid-offer" width="600px" :isShowFooter="false" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <p v-if="typePopup === 'offer'">
        {{ $t('detail-nft.popup-accept.title-list-offer') }}
      </p>
      <p v-else>{{ $t('accept-bid.title-list-bid') }}</p>
    </div>

    <div class="content" v-loading="isLoading">
      <div v-if="bids.length" class="list-owner">
        <div v-for="(item, index) in bids" :key="index" class="be-flex align-center owner">
          <span class="nft-body-base text-semibold index quanti" style="width: 30px">{{ index + 1 }}</span>
          <div class="be-flex align-center info">
            <div class="avatar cursor" @click="handleAcount(item.fromId)">
              <bc-media v-if="item.fromAvatar" :url="item.fromAvatar" :radius="100" :size="12" />
              <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />

              <div v-if="item.fromIsVerified === 'YES'" class="verified">
                <base-icon icon="icon-verified" size="14" class="d-iflex" />
              </div>
              <div v-if="item.fromIsNew === 'YES'" class="new-circle"></div>
            </div>
            <div class="name">
              <div class="nft-header6 text-semibold text-overflow-1 cursor" @click="handleAcount(item.fromId)">{{ item.fromName }}</div>
              <p class="text-desc nft-body-small text-overflow-1 price">
                {{ getDescription(item) }}
              </p>
            </div>
          </div>
          <div class="btn-action" style="display: none">
            <div class="btn-default nft-header6 text-semibold text-center text-desc bid mr-16" @click="handleWarning">{{ $t('accept-bid.deny') }}</div>
          </div>
          <div class="btn-action">
            <!-- <div class="btn-default nft-header6 text-semibold text-center text-desc bid">{{ $t('accept-bid.deny') }}</div> -->
            <div class="btn-default nft-header6 text-semibold text-center bid btn-save" @click="handleAcceptBid(item)">{{ $t('detail-nft.button.accept') }}</div>
            <!-- <div v-if="showBtnPutOnSale(item)" class="btn-default nft-header6 text-semibold text-center text-desc bid">{{ $t('nft.put-on-sale') }}</div> -->
          </div>
        </div>
      </div>
      <empty-block v-else :show="true" class="empty" />
    </div>
    <PopupWarningAccept />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  import PopupMixin from '@/mixins/popup'
  import PopupWarningAccept from './PopupWarningAccept.vue'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  import filter from 'lodash/filter'
  import firebase from '@/utils/firebase'
  const apiNft: NftRepository = getRepository('nft')

  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  @Component({ components: { EmptyBlock, PopupWarningAccept } })
  export default class PopupListBidOffer extends Mixins(PopupMixin) {
    @bcNft.State('typePopup') typePopup!: string
    @bcNft.State('listAccount') listAccount!: Array<Record<string, any>>
    @bcNft.State('isBtnOffer') isBtnOffer!: boolean
    @bcNft.State('nftItem') nftItem!: Record<string, any>
    @bcNft.State('listExchangeRate') listExchangeRate!: Array<Record<string, any>>

    listOwner: Array<Record<string, any>> = []
    exchangeRateRef: any = null
    query: Record<string, any> = {
      page: 1,
      limit: 20,
      transactionType: 'BID',
      status: 'SUCCESS'
    }
    query2: Record<string, any> = {
      transactionType: 'OFFER',
      status: 'SUCCESS',
      page: 1,
      limit: 20
    }
    isEnd = false
    isLoading = false
    bids: Array<Record<string, any>> = []
    itemBid = {}
    itemOwer = {
      creatorFee: 0,
      id: 0,
      ownerIdMinPrice: 0,
      minListingId: 0,
      minListingPrice: 0,
      itemName: '',
      currency: ''
    }

    handleAcount(id) {
      this.$router.push({ path: `/metamart/account/${id}` })
    }
    getDescription(item: Record<string, any>): string {
      return (
        this.$options.filters?.convertAmountDecimal(item.price, item.currency) +
        ' ' +
        item.currency +
        ' ~ $' +
        this.$options.filters?.convertAmountDecimal(item.price * this.getExchangeRate(item.currency), 'USD')
      )
      // return item.price + ' ' + item.currency
    }

    getExchangeRate(currency: string): number {
      const coin = filter(this.listExchangeRate, elm => elm.currency === currency)

      return coin.length ? coin[0].exchangeRate : 0
    }

    async handleOpen(): Promise<void> {
      this.isLoading = true
      this.bids = this.listAccount
      this.isLoading = false
      if (this.bids.length < this.query.limit) {
        this.isEnd = true
      }
      if (this.bids.length < this.query2.limit) {
        this.isEnd = true
      }
      this.$nextTick(() => {
        const elm = document.querySelector('.popup-content')
        elm?.addEventListener('scroll', this.handleScroll)
      })

      // const exchangeRateRef = firebase.database().ref('exchange_rates')
      // this.exchangeRateRef = exchangeRateRef.on('value', snapshot => {
      //   this.listExchangeRate = snapshot.val()
      // })
      // console.log('hello', this.exchangeRate)
      // console.log('hello1', this.nft)
    }
    get exchangeRate(): number {
      if (this.nftItem?.currency && this.listExchangeRate.length) {
        const coin = filter(this.listExchangeRate, elm => elm.currency === this.nftItem?.currency)[0]
        return coin.exchangeRate
      }
      return 0
    }
    async handleAcceptBid(item: any) {
      // this.itemBid = item
      this.$emit('accept', item)
    }
    async handleWarning(item: any) {
      console.log('hello')
      this.setOpenPopup({
        popupName: 'popup-warning',
        isOpen: true
      })
    }
    handleClose(): void {
      if ('openBid' in this.$route.query || 'openOffer' in this.$route.query) {
        this.$router.replace({ query: undefined }).catch(error => {
          if (error.name != 'NavigationDuplicated') throw error
        })
      }
      this.isEnd = false
      this.query = {
        page: 1,
        limit: 20,
        transactionType: 'BID',
        status: 'SUCCESS'
      }
      this.query2 = {
        transactionType: 'OFFER',
        status: 'SUCCESS',
        page: 1,
        limit: 20
      }

      this.setOpenPopup({
        popupName: 'popup-accept-bid',
        isOpen: false
      })
    }

    async handleScroll(): Promise<void> {
      const elm = document.querySelector('.popup-content') as HTMLElement
      if (elm.scrollTop >= elm.scrollHeight - elm.offsetHeight && !this.isEnd) {
        this.query.page += 1
        this.query2.page += 1
        if (this.isBtnOffer) {
          const result = await apiNft.getAcceptBidOffer(this.nftItem?.id, this.query2)
          this.bids = [...this.bids, ...result.content]
          this.isEnd = result.content.length <= 0
        } else {
          const result = await apiNft.getAcceptBidOffer(this.nftItem?.id, this.query)
          this.bids = [...this.bids, ...result.content]
          this.isEnd = result.content.length <= 0
        }

        // console.log('result', result.content)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-list-bid-offer {
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
                }
                .btn-action {
                  margin-left: auto;
                  display: flex;
                  .bid {
                    max-width: 120px;
                    // margin-bottom: 10px;
                    &:hover {
                      background: var(--bc-theme-primary-gradient);
                      color: #fff !important;
                      -webkit-text-fill-color: unset;
                    }
                  }
                  .btn-save {
                    background: var(--bc-theme-primary-gradient);
                    color: #fff;
                    &:hover {
                      // border: none !important;
                    }
                  }
                  .bid:first-child {
                    // margin-right: 16px;
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
    ::v-deep.popup-list-bid-offer {
      .el-dialog {
        width: 335px !important;
        .header-popup {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .owner {
          padding: 16px 0 !important;
        }
        .owner:first-child {
          padding-top: 0 !important;
        }
        .owner:last-child {
          padding-bottom: 24px !important;
        }
        .quanti {
          display: none;
        }
        .info {
          margin-left: 0 !important;
          .avatar {
            width: 40px !important;
            height: 40px !important;
            margin-right: 12px !important;
          }
          .price {
            line-height: 20px !important;
          }
        }
        .btn-action {
          .bid {
            min-width: 75px;
            width: 100%;
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
          }
        }
      }
    }
  }
  ::v-deep.wrap-media {
    width: 40px !important;
  }
</style>
