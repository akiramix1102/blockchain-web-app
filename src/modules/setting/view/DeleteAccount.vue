<template>
  <div class="main-content">
    <transition name="el-fade-in-linear">
      <base-page-loading v-if="isLoading" />
    </transition>
    <div class="delete-account" v-if="!isLoading">
      <div class="logo cursor" @click="redirect">
        <div v-if="coinMain === 'LYNK'" style="display: inline-flex" class="logo-main">
          <img src="@/assets/image/logo-lin.png" alt="" />
        </div>
        <base-icon v-if="coinMain === 'CLM'" icon="icon-clm" size="60" style="display: inline-flex" />
        <!-- <img v-if="coinMain === 'CLM'" src="@/icons/svg/icon-clm.svg" alt="" style="width: 160px; height: 48px; object-fit: contain" />  -->
      </div>
      <div class="status" :class="deleteStatus ? 'success' : 'failure'">
        <base-icon v-if="deleteStatus" icon="icon-info-success" size="20" style="display: inline-flex; padding-right: 8px" />
        <base-icon v-else icon="icon-info-failure" size="20" style="display: inline-flex; padding-right: 8px" />
        <span class="text-base text-bold">{{ getMessage }}</span>
      </div>
      <div class="support mt-24">
        <span class="text-body-small text-regular"
          >If you have any questions regarding this message, please contact our support team at <a :href="emailSupport">{{ emailSupport }}</a
          >.</span
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import PopupMixin from '@/mixins/popup'
  import PopupConfirm from '../components/popup/PopupConfirm.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  import BasePageLoading from '@/components/page-loading/BasePageLoading.vue'
  const api: SettingRepository = getRepository('setting')
  const beBase = namespace('beBase')

  @Component({ components: { PopupConfirm, BasePageLoading } })
  export default class DeleteAccount extends Mixins(PopupMixin) {
    @beBase.State('coinMain') coinMain!: string
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    forceDeleteData: Record<string, any> = {
      email: '',
      code: ''
    }
    deleteStatus = false
    isLoading = true

    get emailSupport(): string {
      return this.urlSystem['system.token.support_email']
    }

    get coinName(): string {
      return this.coinMain === 'LYNK' ? 'Lynkey' : 'Cleverme'
    }

    get getMessage(): string {
      return this.deleteStatus ? `Your ${this.coinName} Account was deleted sucessfully.` : `${this.coinName} Account deletion request has expired.`
    }

    async forceDelete(data: Record<string, any>): Promise<any> {
      await api
        .forceDeleteAccount(data)
        .then(() => {
          this.deleteStatus = true
          this.isLoading = false
        })
        .catch(err => {
          const { status } = err.response.data
          if (status === 'INVALID_VERIFICATION') {
            this.isLoading = false
            this.deleteStatus = false
            // const message = this.$t('This link is invalid or has expired.') as string
            // this.$message.error(message)
          } else {
            console.log(err)
          }
        })
    }
    created(): void {
      this.getForceDeleteData()
      this.forceDelete(this.forceDeleteData)
      setTimeout(() => {
        this.isLoading = false
      }, 15000)
    }
    getForceDeleteData(): void {
      const { email, code } = this.$route?.query
      this.forceDeleteData = {
        email,
        code
      }
    }
    redirect(): void {
      if (this.$route.name === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  }
</script>
<style scoped lang="scss">
  .delete-account {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 336px !important;
    width: 632px;
    left: 50%;
    transform: translateX(-50%);
    padding: 40px;

    .logo {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: var(--bc-color-grey20);
      overflow: hidden;
      img {
        position: relative;
        width: 65px;
        height: 65px;
        object-fit: contain;
      }
    }

    .status {
      position: relative;
      width: 100%;
      height: 48px;
      padding: 12px;
      margin-top: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .success {
      color: var(--bc-status-success);
      background: var(--bc-bg-success);
    }
    .failure {
      color: var(--bc-status-error);
      background: var(--bc-bg-error);
    }
  }

  @media screen and (max-width: 632px) {
    .delete-account {
      width: 100%;
      height: unset !important;
    }
    .status {
      height: unset !important;
    }
  }
</style>
