<template>
  <div>
    <div class="header-collection-detail">
      <div class="banner">
        <!-- <img class="d-block banner__img" :src="collection.banner" alt="" /> -->
        <div class="sack-banner">
          <div v-if="collectionMedias.length > 0">
            <bc-media class="banner__img" :isShow="isShow" :url="collectionMedias && collectionMedias[currentImg].mediaUrl" :size="32" :radius="8" />
          </div>
          <div v-else>
            <bc-media class="banner__img" :isShow="isShow" url="" :size="32" :radius="8" />
          </div>
          <div class="btn-crousel cursor prev" v-if="collectionMedias.length > 1" @click="handleClickArrow('prev')">
            <base-icon v-if="coinMain === 'LYNK'" icon="icon-prev" size="20" class="d-iflex" />
            <base-icon v-else icon="icon-prev-clm" size="20" class="d-iflex" />
          </div>
          <div class="btn-crousel cursor next" v-if="collectionMedias.length > 1" @click="handleClickArrow('next')">
            <base-icon v-if="coinMain === 'LYNK'" icon="icon-next" size="20" class="d-iflex" />
            <base-icon v-else icon="icon-next-clm" size="20" class="d-iflex" />
          </div>
        </div>
        <div class="banner__avatar">
          <!-- <img class="img-fluid" :src="collection.avatar" alt="" /> -->
          <bc-media :url="collection.avatar" :size="18" :radius="80" />
        </div>
        <div class="be-flex banner__action">
          <div
            class="btn-action be-flex align-center cursor favourite"
            :class="collection && (collection.website || collection.twitter) ? 'mr-16' : 'favourite--border'"
            @click="handleClickFavourite"
          >
            <base-icon v-if="isFavourite === 'YES'" icon="icon-heart-red" size="28" class="d-iflex" />
            <base-icon v-else icon="icon-heart-white" size="28" class="d-iflex" />
            <span class="nft-body-base" :class="isFavourite === 'YES' ? 'color-favourite' : null">{{ collectionStat && collectionStat.numOfFavourites | formatNumber }}</span>
          </div>
          <div class="be-flex wrap">
            <div
              v-if="collection && collection.website"
              :class="collection && collection.twitter ? 'is-none-border-right' : null"
              class="btn-action be-flex align-center cursor border-part"
              @click="handleClickSocial('website')"
            >
              <base-icon icon="icon-earth" size="24" class="d-iflex" />
            </div>
            <div
              v-if="collection && collection.twitter"
              :class="collection && collection.website ? null : 'border-left'"
              class="btn-action be-flex align-center cursor border-part"
              @click="handleClickSocial('twitter')"
            >
              <base-icon icon="icon-twetter" size="24" class="d-iflex" />
            </div>

            <div class="be-flex align-center cursor">
              <el-dropdown class="be-flex align-center jc-space-center ml-auto btn-action pd-dot cursor btn-share" trigger="click" style="height: 24px; display: flex">
                <base-icon icon="icon-3dot" size="24" class="d-iflex" />
                <el-dropdown-menu slot="dropdown" class="dropdown-collection-item">
                  <el-dropdown-item>
                    <div @click="handleShare()">
                      {{ $t('nft.share') }}
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-24 info">
        <div class="info__title">
          <div class="be-flex align-center jc-space-center mb-8 name">
            <span class="nft-header3 text-bold text-center">{{ collection.collectionName }}</span>
            <base-icon v-if="collection.isVerified === 'YES'" icon="icon-verified" size="36" class="d-iflex" style="padding-left: 8 px" />
          </div>
          <div class="be-flex align-center jc-space-center creator">
            <div v-if="collection && collection.contractAddress" class="be-flex align-center cursor right mr-24">
              <div class="icon">
                <img v-if="coinMain === 'LYNK'" src="@/assets/images/nft/icon-lynkey.jpg" alt="" class="d-block" />
                <base-icon v-else icon="icon-clm" />
              </div>
              <span v-if="isShowAddress" class="nft-body-small text-desc text-center" @click="handleCopyAddress">{{
                collection.contractAddress | formatTransactionCode(5, 5)
              }}</span>
              <span v-else class="nft-body-small text-desc text-center">{{ $t('nft.copy') }}</span>
            </div>
            <div class="be-flex align-center">
              <span class="text-desc nft-body-base">{{ $t('nft.created-by') }}</span>
              <span class="text-medium nft-header5 text-hyperlink cursor" style="padding-left: 4px" @click="handleViewProfileNft(creator.id)">{{
                creator && creator.accountName
              }}</span>
              <base-icon v-if="creator && creator.isVerified === 'YES'" icon="icon-verified" size="16" class="d-iflex" style="padding-left: 4px" />
            </div>
          </div>
        </div>
      </div>

      <div class="be-flex jc-space-center mb-24 list" :class="{ russian: selectLanguage() === 'ru', japanese: selectLanguage() === 'jp' }">
        <div class="list-item is-none-border-right">
          <div class="nft-body-small text-desc">{{ $t('nft.item') }}</div>
          <div class="nft-header5 text-medium">{{ collectionStat && collectionStat.numOfItems | abbreviateNumber(0) }}</div>
        </div>
        <div class="list-item is-none-border-right">
          <div class="nft-body-small text-desc">{{ $t('nft.owner') }}</div>
          <div class="nft-header5 text-medium">{{ collectionStat && collectionStat.numOfOwners | abbreviateNumber(0) }}</div>
        </div>
        <div class="list-item is-none-border-right">
          <div class="nft-body-small text-desc">{{ $t('nft.lowest-sale') }}</div>
          <div class="nft-header5 text-medium">${{ (collectionStat && collectionStat.floorPrice) | abbreviateNumber }}</div>
        </div>
        <div class="list-item is-none-border-right">
          <div class="nft-body-small text-desc">{{ $t('nft.total-volume') }}</div>
          <div class="nft-header5 text-medium">${{ (collectionStat && collectionStat.totalTrade) | abbreviateNumber }}</div>
        </div>
        <div class="list-item is-none-border-right">
          <div class="nft-body-small text-desc">{{ $t('nft.highest-sale') }}</div>
          <div class="nft-header5 text-medium">${{ (collectionStat && collectionStat.highestSale) | abbreviateNumber }}</div>
        </div>
        <div class="list-item">
          <div class="nft-body-small text-desc">{{ $t('nft.market-cap') }}</div>
          <div class="nft-header5 text-medium">${{ (collectionStat && collectionStat.marketCap) | abbreviateNumber }}</div>
        </div>
      </div>
      <div class="desc">
        <p id="text-description" class="nft-body-base text-desc text-center" :class="showClass ? 'text-overflow-3' : null" style="line-height: 24px" v-html="textDescription"></p>
        <div v-if="numOfLine > 3" style="margin-top: 16px" :class="!showClass ? 'text-rotate' : null" @click="showClass = !showClass">
          <div class="be-flex jc-space-center align-center">
            <span class="body-small text-hyperlink cursor text-medium">{{ showClass ? $t('market-detail.read-more') : $t('market-detail.hide-more') }}</span>
            <base-icon v-if="coinMain === 'LYNK'" icon="icon-down" class="icon-rotate" style="padding-left: 4px" />
            <base-icon v-else icon="icon-down-clm" class="icon-rotate" style="padding-left: 4px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import PopupMixin from '@/mixins/popup'
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')

  @Component({
    components: {}
  })
  export default class HeaderCollectionDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) collection!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) collectionStat!: Record<string, any>
    @Prop({ required: false, type: Object, default: () => ({}) }) creator!: Record<string, any>
    @Prop({ required: false, type: String, default: '' }) isFavourite!: string
    @Prop({ required: true, type: Array, default: () => [] }) collectionMedias!: Array<Record<string, any>>
    @bcNft.Action('setLinkShare') setLinkShare!: (link: string) => void
    @bcNft.Action('setShareType') setShareType!: (type: string) => void

    @bcAuth.Getter('isLogin') isLogin!: boolean
    @beBase.State('coinMain') coinMain!: string
    @bcNft.State('isDesktop') isDesktop!: boolean
    numOfLine = 0
    showClass = false
    isShowAddress = true
    textDescription = ''
    idCollection = 0
    url = ''
    currentImg = 0
    get getBanner(): string {
      if (this.collection && this.collection.id) {
        const objParse = JSON.parse(this.collection?.mediaUrls)
        return objParse?.bannerDetail
      }
      return ''
    }
    get isShow(): boolean {
      return this.collectionMedias[this.currentImg]?.mediaType === 'IMAGE'
    }

    mounted(): void {
      setTimeout(() => {
        const language = window.localStorage.getItem('bc-lang')!
        if (this.collection.description) {
          const objDesc = JSON.parse(this.collection.description)
          this.textDescription = objDesc[language].replace(/\\n/g, '<br>')
          // setTimeout(() => {
          //   this.checkLengthText()
          // }, 300)
          this.$nextTick(() => {
            this.checkLengthText()
          })
        }
      }, 400)
    }
    @Watch('collection', { deep: true, immediate: true }) handleWatchMedias(item: Record<string, any>): void {
      console.log('collection', this.collection)
    }
    created(): void {
      console.log('cretor', this.creator)
    }
    checkLengthText(): void {
      let el = document.getElementById('text-description') as HTMLElement
      let divHeight = el.offsetHeight
      let lineHeight = parseInt(el.style.lineHeight)
      let lines = divHeight / lineHeight
      if (lines > 3) {
        this.showClass = true
        this.numOfLine = lines
      }
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }

    get getLink(): string {
      const origin = process.env.VUE_APP_URL
      if (this.coinMain == 'LYNK') {
        this.url = 'metamart/collection/' + this.collection.id
      }
      if (this.coinMain == 'CLM') {
        this.url = 'marketplace/collection/' + this.collection.id
      }
      return origin + this.url
    }
    handleShare(): void {
      // this.idCollection = this.collection.id
      this.setLinkShare(this.getLink)
      this.setShareType('COLLECTION')
      this.setOpenPopup({
        popupName: 'popup-share',
        isOpen: true
      })
    }
    handleViewProfileNft(id: string): void {
      let id1 = id
      this.$router.push({ name: 'UserProfile', params: { id: id1 } })
    }
    handleClickSocial(type: string): void {
      window.open(this.collection[type], '_blank')
    }
    handleCopyAddress(): void {
      this.isShowAddress = false
      setTimeout(() => {
        this.isShowAddress = true
      }, 500)
      const el = document.createElement('input')
      el.value = this.collection.contractAddress
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    handleClickArrow(type: 'prev' | 'next', value: string): void {
      // this.$refs[`${value}`]
      if (type === 'prev') {
        //@ts-ignore
        // this.$refs[`${value}`]?.prev()
        if (this.currentImg == 0) {
          this.currentImg = this.collectionMedias?.length - 1
        } else {
          this.currentImg -= 1
        }
      } else {
        //@ts-ignore
        // this.$refs[`${value}`]?.next()
        if (this.currentImg == this.collectionMedias?.length - 1) {
          this.currentImg = 0
        } else {
          this.currentImg += 1
        }
      }
    }

    handleClickFavourite(): void {
      if (!this.isLogin) {
        const message: any = this.$t('notify.must-login')
        this.$message.error({ message, duration: 5000 })
        const detail = {
          isBack: 'nft',
          id: this.$route.params.id! as string,
          name: this.$route.name as string
        }
        setTimeout(() => {
          this.$router.push({ name: 'login', query: { ...detail } })
        }, 1000)
        return
      }
      const data = {
        objectType: 'COLLECTION',
        objectId: this.collection.id,
        actionType: this.isFavourite === 'YES' ? 'UN_FAVOURITE' : 'FAVOURITE'
      }
      this.$emit('favourite', data)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.header-collection-detail {
    .banner {
      height: 364px;
      position: relative;
      margin-bottom: 16px;
      &__img {
        width: 1200px;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
        img {
          object-fit: cover;
        }
      }
      &__avatar {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 128px;
        height: 128px;
        border: 4px solid #fff;
        border-radius: 100%;
        img {
          border-radius: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &__action {
        position: absolute;
        bottom: 0;
        right: 0;
        .btn-action {
          height: 48px;
          border: 1px solid #dbdbdb;
        }
        .btn-share {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }

        .favourite {
          padding: 0 10px;
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
          border-right: none;
        }
        .favourite--border {
          // border-top-right-radius: 0;
          // border-bottom-right-radius: 0;
          // border-right: none;
        }
        .wrap {
          .btn-action {
            padding: 12px;
          }
          .border-part:first-child {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }
          .border-part:last-child {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
          .border-right {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
          .border-left {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }
        }
      }
    }
    .pd-dot {
      padding: 23px 11px !important;
    }
    .info {
      &__title {
        .creator {
          .right {
            padding: 4px 16px 4px 4px;
            border-radius: 16px;
            background: #f3f2f1;
            .icon {
              width: 24px;
              height: 24px;
              background: #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 8px;
            }
          }
        }
      }
    }

    .list {
      &.russian {
        .list-item {
          width: 200px !important;
        }
      }
      &.japanese {
        .list-item {
          width: 130px !important;
        }
      }
      .list-item {
        width: 120px;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid #dbdbdb;
        div:last-child {
          margin-top: 4px;
        }
      }
      .list-item:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
      .list-item:last-child {
        min-width: 120px;
        width: auto;
        padding: 0 10px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }

    .desc {
      max-width: 800px;
      margin: 0 auto;
      .text-rotate {
        .icon-rotate {
          transform: rotate(180deg);
          padding-right: 4px;
        }
      }
    }
  }
  .sack-banner {
    position: relative;
    display: flex;
    overflow: hidden;
  }
  .btn-crousel {
    top: 32px;
    z-index: 2;
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
    transform: translateY(-50%);
  }
  .prev {
    right: 56px;
  }
  .next {
    right: 16px;
  }
</style>
