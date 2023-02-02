<template>
  <div class="mobile">
    <div class="banner">
      <div @click="handleShare">
        <base-icon icon="essential" size="24" class="show-more" />
      </div>
      <div @click="handleClickFavourite">
        <base-icon v-if="isFavourite === 'YES'" icon="icon-heart-red" size="24" class="new-btn" />
        <base-icon v-else icon="icon-heart-border-white" size="24" class="new-btn" />
      </div>
      <!-- <el-dropdown class="be-flex align-center jc-space-center ml-auto btn-action pd-dot cursor" trigger="click" style="display: flex">
        <base-icon icon="dot-vertical" size="24" class="show-more" />
        <el-dropdown-menu slot="dropdown" class="dropdown-dot-collection">
          <el-dropdown-item>Add to favorites</el-dropdown-item>
          <el-dropdown-item>Website</el-dropdown-item>
          <el-dropdown-item>Twitter</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <bc-media class="banner__img" :url="collection.banner" />
      <div class="banner__avatar">
        <!-- <img class="img-fluid" :src="collection.avatar" alt="" /> -->
        <bc-media :url="collection.avatar" :size="18" :radius="80" />
      </div>
    </div>
    <div class="mb-16 info">
      <div class="info__title">
        <div class="be-flex align-center jc-space-center mb-8 name">
          <span class="body-large text-bold text-center">{{ collection.collectionName }}</span>
          <base-icon v-if="collection.isVerified === 'YES'" icon="icon-verified" size="17" class="d-iflex" style="padding-left: 8px" />
        </div>
        <div class="be-flex align-center jc-space-center creator">
          <div v-if="collection && collection.contractAddress" class="be-flex align-center cursor right mr-24">
            <div class="icon">
              <img v-if="coinMain === 'LYNK'" src="@/assets/images/nft/icon-lynkey.jpg" alt="" class="d-block" />
              <base-icon v-else icon="icon-clm" />
            </div>
            <span v-if="isShowAddress" class="nft-body-small text-desc text-center" @click="handleCopyAddress">{{ collection.contractAddress | formatTransactionCode(5, 5) }}</span>
            <span v-else class="nft-body-base-small text-desc text-center">{{ $t('nft.copy') }}</span>
          </div>
          <div class="be-flex align-center">
            <span class="text-desc body-small">{{ $t('nft.created-by') }}</span>
            <span class="text-medium body-small text-hyperlink cursor" style="padding-left: 4px" @click="handleViewProfileNft(creator.id)">{{
              creator && creator.accountName
            }}</span>
            <base-icon v-if="creator && creator.isVerified === 'YES'" icon="icon-verified" size="16" class="d-iflex" style="padding-left: 4px" />
          </div>
        </div>
      </div>
    </div>
    <div class="desc">
      <p
        id="text-description"
        class="nft-body-base-small text-desc text-center"
        :class="showClass ? 'text-overflow-2' : null"
        style="line-height: 24px"
        v-html="textDescription"
      ></p>
      <div v-if="numOfLine > 2" style="margin-top: 16px" :class="!showClass ? 'text-rotate' : null" @click="showClass = !showClass">
        <div class="be-flex jc-space-center align-center">
          <span class="nft-body-base-small text-hyperlink cursor">{{ showClass ? $t('market-detail.read-more') : $t('market-detail.hide-more') }}</span>
          <!-- <base-icon v-if="coinMain === 'LYNK'" icon="icon-down" class="icon-rotate" style="padding-left: 4px" />
          <base-icon v-else icon="icon-down-clm" class="icon-rotate" style="padding-left: 4px" /> -->
        </div>
      </div>
    </div>
    <div class="jc-space-center list" :class="{ russian: selectLanguage() === 'ru' }">
      <div class="list-item is-none-border-right">
        <div class="nft-body-caption amount-lock">{{ $t('nft.item') }}</div>
        <div class="nft-body-base text-bold">{{ collectionStat && collectionStat.numOfItems | abbreviateNumber(0) }}</div>
      </div>
      <div class="list-item is-none-border-right">
        <div class="nft-body-caption amount-lock">{{ $t('nft.owner') }}</div>
        <div class="nft-body-base text-bold">{{ collectionStat && collectionStat.numOfOwners | abbreviateNumber(0) }}</div>
      </div>
      <div class="list-item">
        <div class="nft-body-caption amount-lock">{{ $t('nft.lowest-sale') }}</div>
        <div class="nft-body-base text-bold">${{ (collectionStat && collectionStat.floorPrice) | abbreviateNumber }}</div>
      </div>
      <div class="list-item is-none-border-right">
        <div class="nft-body-caption amount-lock">{{ $t('nft.total-volume') }}</div>
        <div class="nft-body-base text-bold">${{ (collectionStat && collectionStat.totalTrade) | abbreviateNumber }}</div>
      </div>
      <div class="list-item is-none-border-right">
        <div class="nft-body-caption amount-lock">{{ $t('nft.highest-sale') }}</div>
        <div class="nft-body-base text-bold">${{ (collectionStat && collectionStat.highestSale) | abbreviateNumber }}</div>
      </div>
      <div class="list-item">
        <div class="nft-body-caption amount-lock">{{ $t('nft.market-cap') }}</div>
        <div class="nft-body-base text-bold">${{ (collectionStat && collectionStat.marketCap) | abbreviateNumber }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import PopupMixin from '@/mixins/popup'
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')

  @Component({
    components: {}
  })
  export default class MobileHeaderCollectionDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: () => ({}) }) collection!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) collectionStat!: Record<string, any>
    @Prop({ required: false, type: Object, default: () => ({}) }) creator!: Record<string, any>
    @Prop({ required: false, type: String, default: '' }) isFavourite!: string
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
    get getBanner(): string {
      if (this.collection && this.collection.id) {
        const objParse = JSON.parse(this.collection?.mediaUrls)
        return objParse?.bannerDetail
      }
      return ''
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
    created(): void {
      console.log('cretor', this.creator)
    }
    checkLengthText(): void {
      let el = document.getElementById('text-description') as HTMLElement
      let divHeight = el.offsetHeight
      let lineHeight = parseInt(el.style.lineHeight)
      let lines = divHeight / lineHeight
      if (lines > 2) {
        this.showClass = true
        this.numOfLine = lines
      }
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
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.mobile {
    .content-media {
      margin-bottom: 8px;
    }
    // max-width: 375px;
    .new-btn {
      width: 32px;
      height: 32px;
      position: absolute;
      right: 60px;
      top: 14px;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &::before {
        content: '';
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 0;
        background: #151718;
        opacity: 0.7;
        border-radius: 50%;
      }
      .svg-icon {
        z-index: 1;
      }
    }
    .show-more {
      width: 32px;
      height: 32px;
      position: absolute;
      right: 20px;
      top: 14px;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &::before {
        content: '';
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 0;
        background: #151718;
        opacity: 0.7;
        border-radius: 50%;
      }
      .svg-icon {
        z-index: 1;
      }
    }
    .banner {
      position: relative;
      margin-bottom: 38px;
      &__img {
        width: 100%;
        height: 154px;
        object-fit: cover;
        border-radius: 8px;
        img {
          object-fit: cover;
        }
      }
      &__avatar {
        position: absolute;
        left: 50%;
        bottom: -25%;
        transform: translateX(-50%);
        width: 80px;
        height: 80px;
        border: 4px solid #fff;
        border-radius: 100%;
        img {
          border-radius: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .desc {
      max-width: 335px;
      margin: 0 auto 24px auto;
      .text-rotate {
        .icon-rotate {
          transform: rotate(180deg);
          padding-right: 4px;
        }
      }
    }
    .list {
      margin-bottom: 8px;
      display: grid;
      grid-template-columns: auto auto auto;
      &.russian {
        grid-template-columns: 175px 175px;
        .list-item {
          width: 100%;
          border: 1px solid #dbdbdb !important;
          border-radius: 6px;
        }
      }
      .list-item {
        // flex-basis: 33.333333%;
        width: 112px;
        height: 80px;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: center;
        border: 1px solid #dbdbdb;
        div:last-child {
          margin-top: 4px;
        }
      }
      .list-item:first-child {
        border-top-left-radius: 6px;
      }
      .list-item:last-child {
        // min-width: 120px;
        width: auto;
        padding: 0 10px;
        border-bottom-right-radius: 6px;
      }
      .list-item:nth-child(3) {
        border-top-right-radius: 6px;
      }
      .list-item:nth-child(4) {
        border-bottom-left-radius: 6px;
      }
    }
  }
</style>
