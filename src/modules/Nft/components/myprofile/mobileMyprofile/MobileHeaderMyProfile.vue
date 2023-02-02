<template>
  <div>
    <div class="header-collection-detail-mobile">
      <div class="banner">
        <!-- //<img :url="dataMyprofile.banner" src="" alt="" /> -->
        <bc-media class="banner__img" :url="dataMyprofile.banner" />

        <div class="banner__avatar">
          <!-- <img class="img-fluid" :src="collection.avatar" alt="" /> -->

          <base-icon v-if="!dataMyprofile.avatar" icon="default-avatar" size="80" style="display: inline-flex; position: absolute; left: -4px; top: -4px" />

          <bc-media v-else :url="dataMyprofile.avatar" :size="18" :radius="80" />
        </div>
        <!-- <div class="be-flex banner__action">
          <div class="action_item">
            
            <el-dropdown
              :class="dataMyprofile && (dataMyprofile.website || dataMyprofile.twitter) ? null : 'border-left'"
              class="be-flex align-center jc-space-center ml-auto btn-action pd-dot cursor btn-share ml-8"
              trigger="click"
              style="display: flex"
            >
              <base-icon icon="icon-3dot" size="24" class="d-iflex" />
              <el-dropdown-menu
                slot="dropdown"
                class="dropdown-collection-item dropdown"
                style="transform-origin: center top; z-index: 2003; position: absolute; top: 113px; left: 205px; right: 20px; padding: 16px 105px 16px 16px"
              >
                <el-dropdown-item class="cursor">
                  <div @click="handleShare()">
                    {{ $t('nft.share') }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div> -->
        <div class="mb-16 info">
          <div class="info__title">
            <div class="be-flex align-center jc-space-center mb-8 name">
              <span class="nft-header5 text-bold">{{ dataMyprofile.accountName }}</span>
              <base-icon v-if="dataMyprofile.isVerified === 'YES'" icon="icon-verified" size="16.28" class="d-iflex" style="padding-left: 8px" />
            </div>
            <div class="be-flex align-center jc-space-center creator">
              <div class="be-flex align-center cursor right">
                <div class="icon">
                  <img v-if="coinMain === 'LYNK'" src="@/assets/images/nft/icon-lynkey.jpg" alt="" class="d-block" />
                  <base-icon v-else icon="icon-clm" />
                </div>
                <span v-if="isShowAddress" class="nft-body-small text-desc text-center" @click="handleCopyAddress">{{ dataMyprofile.address | formatTransactionCode(5, 5) }}</span>
                <span v-else class="nft-body-small text-desc text-center">{{ $t('nft.copy') }}</span>
              </div>
              <div v-if="$route.name === 'MyProfileNft' || +$route.params.id === userNft.id" class="text-body-small mt-8">
                {{ userNft.totalItem | formatNumber }} NFT {{ userNft.totalItem > 1 ? 'items' : 'item' }} ~ ${{ userNft.totalProperty | convertAmountDecimal('USD') }}
              </div>
            </div>
          </div>
        </div>

        <div class="desc">
          <div>
            <p
              id="text-description"
              class="nft-body-base-small text-desc text-center container-nft"
              :class="showClass ? 'text-overflow-2' : null"
              style="line-height: 20px; word-wrap: break-word"
              v-html="textDescription"
            ></p>
            <div v-if="numOfLine > 2" style="margin-top: 16px" :class="!showClass ? 'text-rotate' : null" @click="showClass = !showClass">
              <div class="be-flex jc-space-center align-center">
                <span class="body-small text-hyperlink cursor text-medium">{{ showClass ? $t('market-detail.read-more') : $t('market-detail.hide-more') }}</span>
                <base-icon icon="icon-down" class="icon-rotate" style="padding-left: 4px" />
              </div>
            </div>
          </div>
        </div>
        <div class="follow mt-16">
          <div v-if="dataMyprofile.numOfFollowers > 1" class="cursor follow_item" @click="handleOpenPopupFollower('FOLLOWER')">
            {{ dataMyprofile.numOfFollowers | formatNumber }} {{ $t('nft.followers') }}
          </div>
          <div v-else class="cursor follow_item" @click="handleOpenPopupFollower('FOLLOWER')">{{ dataMyprofile.numOfFollowers | formatNumber }} {{ $t('nft.follower') }}</div>
          <div class="dot"></div>
          <div class="cursor follow_item" @click="handleOpenPopupFollower('FOLLOWING')">{{ dataMyprofile.numOfFollowing | formatNumber }} {{ $t('nft.following') }}</div>
        </div>
        <popup-follow :type="typePopup" :id="dataMyprofile.id" />
        <div class="be-flex banner__action">
          <div
            v-if="dataMyprofile.isMine === 'NO' && dataMyprofile.isFollower === 'NO'"
            class="btn text-center btn-action be-flex align-center cursor favourite follow-myprofile mr-16"
            @click="handleClickFollow"
          >
            <span>{{ $t('nft.text-follow') }}</span>
          </div>

          <div
            v-if="dataMyprofile.isMine === 'NO' && dataMyprofile.isFollower === 'YES'"
            class="btn-default be-flex align-center cursor favourite follow-myprofile follow-myprofile--hover"
            @click="handleClickFollow"
          >
            <span class="following">{{ $t('nft.text-following') }}</span>
            <span class="unfollow">{{ $t('nft.unfollow') }}</span>
          </div>

          <!-- <div class="be-flex wrap">
            <div
              v-if="dataMyprofile && dataMyprofile.website"
              :class="dataMyprofile && dataMyprofile.twitter ? 'is-none-border-right' : null"
              class="btn-action be-flex align-center cursor border-part is-none-border-right"
              @click="handleClickSocial('website')"
            >
              <base-icon icon="icon-earth" size="24" class="d-iflex" />
            </div>
            <div
              v-if="dataMyprofile && dataMyprofile.twitter"
              :class="dataMyprofile && dataMyprofile.website ? null : 'border-left'"
              class="btn-action be-flex align-center cursor border-part is-none-border-right"
              @click="handleClickSocial('twitter')"
            >
              <base-icon icon="icon-twetter" size="24" class="d-iflex" />
            </div>
            <el-dropdown
              :class="dataMyprofile && (dataMyprofile.website || dataMyprofile.twitter) ? null : 'border-left'"
              class="be-flex align-center jc-space-center ml-auto btn-action pd-dot cursor btn-share"
              trigger="click"
              style="display: flex"
            >
              <base-icon icon="icon-3dot" size="24" class="d-iflex" />
              <el-dropdown-menu slot="dropdown" class="dropdown-collection-item">
                <el-dropdown-item>
                  <div @click="handleShare()">
                    {{ $t('nft.share') }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
           
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  import PopupFollow from '../PopupFollow.vue'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('beAuth')
  const bcNft = namespace('bcNft')
  const beBase = namespace('beBase')
  @Component({ components: { PopupFollow } })
  export default class HeaderProfileNftDetail extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) dataMyprofile!: Record<string, any>
    @bcNft.State('isDesktop') isDesktop!: boolean
    @bcAuth.Getter('isLogin') isLogin!: boolean
    @bcAuth.State('userNft') userNft!: Record<string, any>
    @beBase.State('coinMain') coinMain!: string
    @bcNft.Action('setLinkShare') setLinkShare!: (link: string) => void

    numOfLine = 0
    showClass = false
    isShowAddress = true
    textDescription = ''
    typePopup = ''
    idNft = 0
    url = ''

    get getBanner(): string {
      if (this.dataMyprofile && this.dataMyprofile.id) {
        const objParse = JSON.parse(this.dataMyprofile?.mediaUrls)
        return objParse?.bannerDetail
      }
      return ''
    }

    mounted(): void {
      // console.log(' this.nftItem', this.nftItem)
      // console.log(' this.nftItem?.itemId', this.nftItem?.id)

      setTimeout(() => {
        if (this.dataMyprofile.description) {
          this.textDescription = this.dataMyprofile.description.replace(/\\n/g, '<br>')
          this.$nextTick(() => {
            this.checkLengthText('text-description')
          })
        }
      }, 400)
    }

    get getLink(): string {
      const origin = process.env.VUE_APP_URL
      if (this.coinMain == 'LYNK') {
        this.url = 'metamart/account/' + this.dataMyprofile.id
      }
      if (this.coinMain == 'CLM') {
        this.url = 'marketplace/account/' + this.dataMyprofile.id
      }
      return origin + this.url
    }
    handleShare(): void {
      this.setLinkShare(this.getLink)
      console.log('ab', this.idNft)
      console.log('this.dataMyprofile.id', this.dataMyprofile.id)
      this.setOpenPopup({
        popupName: 'popup-share',
        isOpen: true
      })
    }
    checkLengthText(text): void {
      let el = document.getElementById('text-description') as HTMLElement
      let divHeight = el.offsetHeight
      let lineHeight = parseInt(el.style.lineHeight)
      let lines = divHeight / lineHeight
      if (lines > 2) {
        this.showClass = true
        this.numOfLine = lines
      }
    }
    myprofile: Array<Record<string, any>> = []

    handleClickSocial(type: string): void {
      window.open(this.dataMyprofile[type], '_blank')
    }
    handleCopyAddress(): void {
      this.isShowAddress = false
      let message: any = ''
      setTimeout(() => {
        this.isShowAddress = true
      }, 500)
      const el = document.createElement('input')
      el.value = this.dataMyprofile.address
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success({ message, duration: 5000 })
    }

    handleClickFollow(): void {
      if (!this.isLogin) {
        const message: any = this.$t('notify.must-login')
        this.$message.error({ message, duration: 5000 })
        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 1000)
        return
      }
      const data = {
        toAccountId: this.dataMyprofile.id,
        action: this.dataMyprofile.isFollower === 'YES' ? 'UN_FOLLOW' : 'FOLLOW'
      }
      this.$emit('follow', data)
    }

    handleOpenPopupFollower(type: 'follower' | 'followings'): void {
      this.typePopup = type
      this.setOpenPopup({
        popupName: 'popup-list-follow',
        isOpen: true
      })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.header-collection-detail-mobile {
    .banner {
      position: relative;
      margin-bottom: 16px;
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
        top: 111px;
        transform: translateX(-50%);
        width: 80px;
        height: 80px;
        border: 4px solid #fff;
        border-radius: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &__action {
        right: 0px;
        display: flex;
        width: 100%;
        justify-content: center;
        // padding-bottom: 24px;
        //padding-top: 16px;
        .action_item {
          display: flex;
          position: absolute;
          top: 14px;
          right: 0;
          margin-right: 20px;
          .dropdown {
            transform-origin: center top;
            z-index: 2003;
            position: absolute;
            top: 113px;
            left: 205px;
            right: 20px;
            padding: 16px 105px 16px 16px;
          }
          .dropdown-collection-item {
            transform-origin: center top;
            z-index: 2003;
            position: absolute;
            top: 113px;
            left: 201px;
            right: 20px;
            padding: 16px 105px 16px 16px;
          }
        }

        .btn-action {
          height: 32px;
          width: 32px;
          border-radius: 100%;
          background-color: #151718;
          opacity: 0.7;

          .nft-body-base {
            color: #5b616e;
          }
        }
        .edit {
          width: 100px;
          display: flex;
          justify-content: center;
        }
        .follow-myprofile {
          width: 120px;
          font-size: 16px;
          display: flex;
          justify-content: center;
          font-weight: 600;
          height: 32px;
        }
        .follow-myprofile--hover {
          &:hover {
            .following {
              display: none;
            }
            .unfollow {
              display: block;
            }
          }
          .unfollow {
            display: none;
          }
        }
        .favourite {
          // padding: 0 10px;
          border-radius: 6px;
          margin-top: 16px;
        }
        .button--border {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: none;
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
        }
      }
    }
    .info {
      margin-top: 36px;
      &__title {
        .creator {
          display: flex;
          flex-direction: column;
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
    .follow {
      display: flex;
      justify-content: center;
      align-items: center;
      //margin-top: 16px;
      .follow_item {
        font-size: 14px;
        font-weight: 600;
      }
      .dot {
        width: 4px;
        height: 4px;
        background: #dbdbdb;
        border-radius: 50%;
        margin: 0 8px;
      }
    }
  }
</style>
