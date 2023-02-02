<template>
  <base-popup name="popup-list-follow" class="popup-list-follow" width="480px" :isShowFooter="false" :open="handleOpen" :close="handleClose">
    <div slot="title" class="header-popup">
      <span v-if="type === 'FOLLOWER'">{{ $t('nft.followers') }}</span>
      <span v-else>{{ $t('nft.following') }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <div v-if="listFollow.length" class="list-owner">
        <div v-for="item in listFollow" :key="item.id" class="be-flex align-center owner">
          <div class="be-flex align-center info">
            <div class="avatar" @click="handleViewProfile(item.accountId)">
              <bc-media v-if="item.avatar" :url="item.avatar" :radius="100" :size="12" />
              <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />

              <div v-if="item.isVerified === 'YES'" class="verified">
                <base-icon icon="icon-verified" size="14" class="d-iflex" />
              </div>
              <div v-if="item.isNew === 'YES'" class="new-circle"></div>
            </div>
            <div class="name">
              <div class="nft-header6 text-semibold text-overflow-1 click" @click="handleViewProfile(item.accountId)">{{ item.accountName }}</div>
              <p class="nft-header6 text-overflow-1 text-follow">
                <span class="text-semibold">{{ item.numOfFollower | formatNumber }}</span>
                <span v-if="item.numOfFollower > 1" class="text-desc"> {{ $t('nft.followers') }}</span>
                <span v-else class="text-desc"> {{ $t('nft.follower') }}</span>
              </p>
            </div>
          </div>
          <div class="btn-action" v-if="item.isMine !== 'YES'">
            <div v-if="item.iFollowThis === 'YES'" class="btn-default nft-header6 text-semibold text-center btn-follow" @click="handleActionFollow(item)">
              <span class="following">{{ $t('nft.text-following') }}</span>
              <span class="unfollow">{{ $t('nft.unfollow') }}</span>
            </div>
            <div v-else class="btn nft-header6 text-semibold text-center btn-follow btn-follow--hover follow" @click="handleActionFollow(item)">
              {{ $t('nft.text-follow') }}
            </div>
          </div>
        </div>
      </div>
      <empty-block v-else :show="true" class="empty" />
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'

  import getRepository from '@/services/index'
  import NftRepository from '@/services/repositories/nft'

  const apiNft: NftRepository = getRepository('nft')

  import { namespace } from 'vuex-class'
  const bcAuth = namespace('beAuth')

  import filter from 'lodash/filter'

  @Component({ components: { EmptyBlock } })
  export default class PopupFollow extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String, default: 'FOLLOWER' }) type!: string
    @Prop({ required: true, type: Number, default: 0 }) id!: number

    @bcAuth.Getter('isLogin') isLogin!: boolean

    listFollow: Array<Record<string, any>> = []
    isLoading = false
    query: Record<string, any> = {
      page: 1,
      limit: 20
    }
    isEnd = false
    isFollowOrUnfollow = false
    async handleOpen(): Promise<void> {
      try {
        this.isFollowOrUnfollow = false
        this.query = {
          page: 1,
          limit: 20
        }
        this.isLoading = true
        const result = await apiNft.getListFollow(this.id, { ...this.query, followType: this.type })
        this.listFollow = result.content
        if (this.listFollow.length < this.query.limit) {
          this.isEnd = true
        }
        this.$nextTick(() => {
          const elm = document.querySelector('.popup-content')
          elm?.addEventListener('scroll', this.handleScroll)
        })
        console.log('list-follow', this.listFollow)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
    myProfile: Record<string, any> = {}

    async handleViewProfile(id: string): Promise<void> {
      // let id2 = id
      // await apiNft.getUserprofile(this.$route.params.id)
      this.$router.push({ name: 'UserProfile', params: { id: id } })
      console.log('profile', id)
      this.setOpenPopup({
        popupName: 'popup-list-follow',
        isOpen: false
      })
    }

    handleClose(): void {
      this.listFollow = []
      this.isEnd = false
      if (this.isFollowOrUnfollow) {
        this.$emit('reload')
      }
    }

    async handleScroll(): Promise<void> {
      const elm = document.querySelector('.popup-content') as HTMLElement
      if (elm.scrollTop >= elm.scrollHeight - elm.offsetHeight && !this.isEnd) {
        this.query.page += 1
        const result = await apiNft.getListFollow(this.id, { ...this.query, followType: this.type })
        this.listFollow = [...this.listFollow, ...result.content]
        this.isEnd = result.content.length <= 0
      }
    }

    async handleActionFollow(item: Record<string, any>): Promise<void> {
      try {
        if (!this.isLogin) {
          const message: any = this.$t('notify.must-login')
          this.$message.error({ message, duration: 5000 })
          setTimeout(() => {
            this.$router.push({
              name: 'login'
            })
          }, 1000)
          return
        }
        this.isFollowOrUnfollow = true
        const data = {
          toAccountId: item.accountId,
          action: item.iFollowThis === 'YES' ? 'UN_FOLLOW' : 'FOLLOW'
        }
        await apiNft.actionFollow(data)
        const user = filter(this.listFollow, elm => elm.accountId === item.accountId)[0]
        user.iFollowThis = user.iFollowThis === 'YES' ? 'NO' : 'YES'
        user.numOfFollower = user.iFollowThis === 'YES' ? user.numOfFollower + 1 : user.numOfFollower - 1
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-list-follow {
    .el-dialog {
      &__header {
        .header-popup {
          color: #0a0b0d;
          font-size: 16px;
        }
        .el-dialog__close {
          color: #0a0b0d;
        }
      }

      &__body {
        color: var(--bc-text-market-primary-nft);
        .popup-content {
          .content {
            min-height: 200px;
            .list-owner {
              .owner {
                padding: 24px 0;
                border-bottom: 1px solid #dbdbdb;

                .info {
                  width: 58%;
                  .avatar {
                    cursor: pointer;
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
                  .name {
                    .click {
                      cursor: pointer;
                    }
                    width: calc(100% - 64px);
                  }
                }
                .btn-action {
                  margin-left: auto;
                  .btn-follow {
                    width: 160px;
                    margin-bottom: 10px;
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
                  .btn-follow--hover {
                    background: var(--bc-theme-primary-gradient);
                    color: #fff !important;
                    -webkit-text-fill-color: unset;
                  }
                  .btn-follow:last-child {
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
    ::v-deep.popup-list-follow {
      .el-dialog {
        width: 335px !important;
        .owner {
          padding: 16px 0 !important;
        }
        .owner:first-child {
          padding-top: 0 !important;
        }
        .owner:last-child {
          padding-bottom: 24px !important;
        }
        .avatar {
          width: 40px !important;
          height: 40px !important;
        }
        .text-follow {
          font-size: 14px !important;
          line-height: 20px !important;
          font-weight: 400 !important;
        }
        .btn-action {
          margin-left: 42px !important;
          .btn-follow {
            width: 75px !important;
            font-size: 14px !important;
            line-height: 20px !important;
            font-weight: 400 !important;
            padding: 6px 5.5px !important;
          }
          .follow {
            padding: 6px 16px !important;
          }
        }
      }
    }
  }
</style>
