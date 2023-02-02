<template>
  <div class="setting-profile">
    <el-form class="form-profile" ref="profile" :rules="rules" :model="form">
      <div class="box1">
        <div class="change-avatar">
          <div class="left avatar">
            <base-icon v-if="!form.avatar" icon="default-avatar" size="80" style="display: inline-flex; margin-right: 24px" />
            <img v-else :src="form.avatar" />
            <div class="box-text">
              <span class="title">{{ $t('setting.profile.title1') }}</span>
              <span class="discript">{{ $t('setting.profile.discript1') }}</span>
              <span class="remove" @click="remove">{{ $t('setting.profile.remove') }}</span>
            </div>
          </div>
          <div class="right">
            <el-upload
              ref="avatarUpload"
              :action="form.avatar ? form.avatar : ''"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleChangeFile"
              class="upload-demo mb-2 text-center skills"
              accept=".jpg, .jpeg, .png, .bmp"
            >
              <div class="btn-action btn-upload cursor">{{ $t('setting.profile.upload') }}</div>
            </el-upload>
            <!-- <div class="btn-action btn-upload">{{ $t('setting.profile.upload') }}</div> -->
          </div>
        </div>
        <div class="change-password" v-if="isLogin">
          <div class="left">
            <div class="title">{{ $t('setting.profile.title2') }}</div>
            <div class="discript">
              {{ $t('setting.profile.discript2') }}
              <span class="link" @click="handleLink">{{ $t('setting.profile.link') }}</span>
            </div>
          </div>
          <div class="right btn-action btn-change-password cursor" @click="handleChangePassword">
            {{ $t('setting.profile.changePassword') }}
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="be-flex content">
        <div class="mt-24 side-bar">
          <div class="cursor mb-24 side-bar__item" :class="tabActive === 'my-profile' ? 'tab-active' : null" @click="tabActive = 'my-profile'">
            <span class="text-base text-desc">{{ $t('setting.profile.my-profile') }}</span>
          </div>
          <div class="cursor mb-24 side-bar__item" :class="tabActive === 'profile-nft' ? 'tab-active' : null" @click="tabActive = 'profile-nft'">
            <span class="text-base text-desc">{{ $t('setting.profile.profile-nft') }}</span>
          </div>
          <div class="cursor side-bar__item" :class="tabActive === 'social-info' ? 'tab-active' : null" @click="tabActive = 'social-info'">
            <span class="text-base text-desc">{{ $t('setting.profile.social-info') }}</span>
          </div>
        </div>
        <div v-if="tabActive === 'my-profile'" class="my-profile">
          <div class="be-flex jc-space-between align-center cursor big-title" @click="isShowInfoAccount = !isShowInfoAccount">
            <span>{{ $t('setting.profile.bigTitle1') }}</span>
            <base-icon icon="icon-arrow-down-black" size="24" class="d-iflex" :class="!isShowInfoAccount ? 'rotate' : null" />
          </div>
          <div class="wrap" :class="isShowInfoAccount ? 'show' : null">
            <div class="label">{{ $t('setting.profile.label1') }}</div>
            <el-form-item prop="displayName" class="box-input">
              <el-input v-model="form.displayName" :placeholder="$t('setting.profile.label1')" clearable></el-input>
            </el-form-item>

            <div class="label">
              <span v-if="isLogin">{{ $t('setting.profile.label2') }}</span>
              <span v-else>{{ $t('setting.profile.label-address') }}</span>
            </div>
            <el-form-item v-if="isLogin" prop="email" class="box-input">
              <el-input v-model="form.email" :placeholder="$t('setting.profile.label2')" disabled></el-input>
            </el-form-item>
            <el-form-item v-else prop="email" class="box-input">
              <el-input v-model="address" :placeholder="$t('setting.profile.label-address')" disabled></el-input>
            </el-form-item>

            <!--------------------VERIFY MAIL EXTERNAL WALLET--------------->
            <div class="label" v-if="walletAddress">
              <span v-if="walletAddress">{{ $t('setting.profile.label2') }}</span>
            </div>
            <el-form-item v-if="walletAddress" prop="email" class="box-input">
              <!--              <el-input v-model="form.email" :placeholder="$t('setting.profile.label2')"></el-input>-->
              <el-input v-if="form.emailVerified === 1" disabled v-model="emailLength" type="email" :placeholder="$t('setting.profile.label2')">
                <template v-slot:suffix>{{ $t('setting.profile.verified-icon') }}</template>
              </el-input>
              <el-input v-if="form.emailVerified === 0" v-model="form.email" type="email" :placeholder="$t('setting.profile.label2')" clearable></el-input>
            </el-form-item>
            <span class="validate-email" v-if="msg">{{ msg }}</span>
            <!-------------------------------------------------------------->
            <!-------------------------------------------------------------->
          </div>
          <div class="line" style="border-color: transparent"></div>
          <div v-if="isLogin" class="be-flex jc-space-between align-center cursor big-title mt-60" @click="isShowPersonalDetail = !isShowPersonalDetail">
            <span>{{ $t('setting.profile.bigTitle2') }}</span>
            <base-icon icon="icon-arrow-down-black" size="24" class="d-iflex" :class="!isShowPersonalDetail ? 'rotate' : null" />
          </div>
          <div v-if="isLogin" class="wrap" :class="isShowPersonalDetail ? 'show' : null">
            <div class="box-left inline" style="margin-right: 16px">
              <div class="label">{{ $t('setting.profile.label3') }} <span class="required">*</span></div>
              <el-form-item prop="firstName" class="box-input mini-box">
                <el-input v-model="form.firstName" :placeholder="$t('setting.profile.label3')" clearable :disabled="disable"></el-input>
              </el-form-item>
            </div>
            <div class="box-right inline">
              <div class="label">{{ $t('setting.profile.label4') }} <span class="required">*</span></div>
              <el-form-item prop="lastName" class="box-input mini-box">
                <el-input v-model="form.lastName" :placeholder="$t('setting.profile.label4')" clearable :disabled="disable"></el-input>
              </el-form-item>
            </div>

            <div class="label">{{ $t('setting.profile.label5') }}</div>
            <el-form-item prop="birthday">
              <el-date-picker
                class="box-input"
                :class="errorBirhday ? 'input-birthday' : null"
                v-model="form.birthday"
                value-format="yyyy-MM-dd"
                format="MM/dd/yyyy"
                type="date"
                :placeholder="$t('setting.profile.label5')"
                clearable
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <div class="error" v-if="errorBirhday">{{ $t('setting.profile.errorDate') }}</div>
            <div class="label">{{ $t('setting.profile.label6') }}</div>
            <el-form-item prop="address" class="box-input">
              <el-input v-model="form.address" :placeholder="$t('setting.profile.label6')" clearable></el-input>
            </el-form-item>
            <div class="box-left inline" style="margin-right: 16px">
              <div class="label">{{ $t('setting.profile.label7') }}</div>
              <el-form-item prop="cityName" class="box-input mini-box">
                <el-input v-model="form.cityName" :placeholder="$t('setting.profile.label7')" clearable></el-input>
              </el-form-item>
            </div>
            <div class="box-right inline">
              <div class="label">{{ $t('setting.profile.label8') }}</div>
              <el-form-item prop="stateName" class="box-input mini-box">
                <el-input v-model="form.stateName" :placeholder="$t('setting.profile.label8')" clearable></el-input>
              </el-form-item>
            </div>
            <br />
            <div class="box-left inline" style="margin-right: 16px">
              <div class="label">{{ $t('setting.profile.label10') }}</div>
              <el-form-item prop="country" class="box-input mini-box">
                <el-select v-model="form.country" filterable reserve-keyword :filter-method="remoteCountry" clearable @change="handleSelectCountry">
                  <el-option v-for="country in listCountry" :key="country.code" :label="country.name" :value="country.name" />
                </el-select>
              </el-form-item>
            </div>
            <div class="box-right inline">
              <div class="label">{{ $t('setting.profile.label9') }} <span class="required">*</span></div>
              <el-form-item prop="nationality" class="box-input mini-box">
                <el-select v-model="form.nationality" filterable reserve-keyword :filter-method="remoteCountry2" clearable @change="handleSelectNationality" :disabled="disable">
                  <el-option v-for="country in listCountry2" :key="country.code" :label="country.name" :value="country.name" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="box-btn btn-action-bottom">
            <div class="btn-action btn-reset cursor" @click="handleReload">{{ $t('setting.profile.reset') }}</div>
            <el-button
              class="btn-action btn-save jc-space-center align-center custom-btn-external cursor"
              @click="handleSavePersonal"
              :disabled="isDisabled"
              :style="{ opacity: isDisabled ? '0.7' : '' }"
            >
              {{ $t('setting.profile.save') }}
            </el-button>
          </div>
          <div v-if="typeLogin === 'WEB'" class="wrap-delete" @click="handleOpenDeleteAccount">
            <h3 class="text-1xl text-semibold">{{ $t('setting_delete-account') }}</h3>
            <p class="body-small text-desc">{{ $t('setting_delete-account-des') }}</p>
            <div class="btn-action btn-delete-account cursor">{{ $t('button__delete-account') }}</div>
          </div>
        </div>

        <!-- nft profile -->

        <div v-if="tabActive === 'profile-nft'" class="mt-24 nft-profile">
          <div class="text-body-small text-des">{{ $t('setting.profile.des-banner-img') }}</div>
          <div class="mb-24 banner-img">
            <el-upload
              :action="item.banner ? item.banner : ''"
              :on-change="handleChangeBanner"
              :auto-upload="false"
              :show-file-list="false"
              list-type="picture"
              class="avatar-uploader"
              accept=".jpg, .jpeg, .png, .bmp, .pdf"
            >
              <bc-media shape="square" :url="socialInfo.banner" :radius="8" class="avatar" />
              <div class="overlay">
                <base-icon icon="icon-pen" size="24" class="d-iflex" />
              </div>
            </el-upload>
          </div>
          <div class="text-body-small text-des">{{ $t('setting.profile.des-bio') }}</div>
          <el-form-item class="des-input">
            <el-input class="des-border-input" v-model="socialInfo.description" type="textarea" :rows="4" maxlength="200" show-word-limit :placeholder="$t('placeholder.bio')">
            </el-input>
          </el-form-item>
          <div class="box-btn btn-action-bottom">
            <div class="btn-action btn-reset cursor">{{ $t('setting.profile.reset') }}</div>
            <div @click="handleSaveNftProfile" class="btn-action btn-save cursor">{{ $t('setting.profile.save') }}</div>
          </div>
        </div>

        <!-- social info -->

        <div v-if="tabActive === 'social-info'" class="mt-24 social-info">
          <!-- 1 web -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-web') }}</div>
            <el-form-item>
              <el-input placeholder="https://" v-model="socialInfo.website" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-earth-black" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 2 twitter -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-twitter') }}</div>
            <el-form-item>
              <el-input placeholder="https://twitter.com/" v-model="socialInfo.twitter" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-twitter" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 3 youtube -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-youtube') }}</div>
            <el-form-item>
              <el-input placeholder="https://www.youtube.com/" v-model="socialInfo.youtube" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-youtube" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 4 instagram -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-instagram') }}</div>
            <el-form-item>
              <el-input placeholder=" https://www.instagram.com/" v-model="socialInfo.instagram" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-instagram" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 5 reddit -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-reddit') }}</div>
            <el-form-item>
              <el-input placeholder="https://www.reddit.com/" v-model="socialInfo.reddit" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-reddit" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>
          <!-- 6 telegram -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-telegram') }}</div>
            <el-form-item>
              <el-input placeholder="http://www.t.me/" v-model="socialInfo.telegram" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-telegram" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 7 discord -->
          <div class="w-100 social-item">
            <!-- <div v-if="index > 0" class="text-body-small des text-cap">{{ item.label }}</div> -->
            <div class="text-body-small des">{{ $t('setting.profile.per-discord') }}</div>
            <el-form-item>
              <el-input placeholder="https://www.discord.gg/" v-model="socialInfo.discord" clearable>
                <template slot="prepend">
                  <base-icon icon="icon-discord" size="24" class="d-iflex" />
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="box-btn btn-action-bottom">
            <div class="btn-action btn-reset cursor">{{ $t('setting.profile.reset') }}</div>
            <div @click="handleSaveSocial" class="btn-action btn-save cursor">{{ $t('setting.profile.save') }}</div>
          </div>
        </div>
      </div>
    </el-form>
    <popup-change-password />
    <popup-confirm-delete-account :type2Fa="type2Fa" @delete="handleDeleteAccount" />
    <popup-verified :action="type2Fa" type="delete-account" @resendCode="handleDeleteAccount" />
    <popup-verify-mail-external :data="form" @reload="reload" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import PopupChangePassword from '../components/popup/PopupChangePassword.vue'
  import PopupConfirmDeleteAccount from '../components/popup/PopupConfirmDeleteAccount.vue'
  import PopupVerified from '../components/popup/PopupVerified.vue'
  import PopupMixin from '@/mixins/popup'
  import PopupVerifyMailExternal from '@/modules/setting/components/popup/PopupVerifyMailExternal.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  import UploadRepository from '@/services/repositories/upload'
  import countryJson from '@/utils/country/index.json'

  import debounce from 'lodash/debounce'
  import filter from 'lodash/filter'
  import trim from 'lodash/trim'
  import EventBus from '@/utils/eventBus'
  import forEach from 'lodash/forEach'
  import NftRepository from '@/services/repositories/nft'

  const apiNft: NftRepository = getRepository('nft')
  const api: SettingRepository = getRepository('setting')
  import { namespace } from 'vuex-class'

  const bcAuth = namespace('beAuth')
  const bcBase = namespace('beBase')

  interface IListCountry {
    name: string
    dial_code: string
    code: string
  }

  @Component({ components: { PopupVerifyMailExternal, PopupChangePassword, PopupConfirmDeleteAccount, PopupVerified } })
  export default class Profile extends Mixins(PopupMixin) {
    @bcAuth.Getter('isLogin') isLogin!: boolean
    @bcAuth.State('user') user!: Record<string, any>
    @bcAuth.State('typeLogin') typeLogin!: string
    @bcBase.State('urlSystem') urlSystem!: Record<string, any>
    @bcAuth.State('walletAddress') walletAddress!: string
    @bcBase.State('isDesktop') isDesktop!: boolean

    apiUpload!: UploadRepository
    api?: SettingRepository
    apiNft?: NftRepository

    disable = false
    userId = this.$store.state.beAuth.user.userId
    listCountry: IListCountry[] = countryJson
    listCountry2: IListCountry[] = countryJson
    phoneDefault = '+84'
    type2Fa: any = ''
    fileList3 = ''
    imgBanner: any = []
    selfiePhoto = ''
    isUpload: any = false
    file: any
    idPhoto1 = ''
    dataDetail: Record<string, any> = {}
    // isUpdate = false
    dataInput = {
      idcard: '',
      // firstName: '',
      // lastName: '',
      // nation: '',
      // idNuidentificationNumbermber: '',
      // nationality: '',
      // identificationNumber: '',
      userId: ''
      // userGroupId: ''
    }
    form: Record<string, any> = {
      email: '',
      firstName: '',
      lastName: '',
      confirm: false,
      id: '',
      avatar: '',
      displayName: '',
      birthday: '',
      address: '',
      cityName: '',
      stateName: '',
      country: '',
      nationality: '',
      nationalityCode: ''
    }
    address = ''
    item: Record<string, any> = {
      value: '',
      banner: ''
    }
    dataUpdate: Record<string, any> = {
      selfiePhoto: ''
    }
    //   @Watch('item.value') saveTabSocial(value: string): void {
    //     this.saveSocial(value)
    //   }
    //  saveSocial = debounce((value: string) => {
    //     this.query.total = trim(value)
    //     console.log('nguuuuu');

    //  })
    data: any = {}
    tabActive = 'my-profile'
    query = {
      total: ''
    }
    // imageUrl = ''
    // bio = ''
    isShowInfoAccount = true
    isShowPersonalDetail = true
    socialInfo: any = {
      website: '',
      twitter: '',
      instagram: '',
      youtube: '',
      discord: '',
      telegram: '',
      description: '',
      banner: '',
      reddit: ''
    }
    msg: any = ''
    isDisabled: any = false
    abc: any = []
    socialList: Array<Record<string, any>> = [
      {
        label: 'Personal website',
        placeholder: 'https://',
        url: '',
        value: '',
        key: 'website'
      },
      {
        label: 'google',
        placeholder: 'https://plus.google.com/lynkey',
        url: '',
        size: '18',
        value: '',
        key: 'google'
      },
      {
        label: 'twitter',
        placeholder: 'https://twitter.com/',
        url: '',
        size: '20',
        value: '',
        key: 'twitter'
      },
      {
        label: 'facebook',
        placeholder: ' https://www.facebook.com/',
        url: '',
        value: '',
        key: 'facebook'
      },
      {
        label: 'youtube',
        placeholder: 'https://www.youtube.com/',
        url: '',
        value: '',
        key: 'youtube'
      },
      {
        label: 'linkedin',
        placeholder: 'https://www.linkedin.com/',
        url: '',
        value: '',
        key: 'linkedin'
      },
      {
        label: 'telegram',
        placeholder: 'https://www.telegram.com/',
        url: '',
        size: '20',
        value: '',
        key: 'telegram'
      }
    ]

    rules: any = {
      firstName: [
        {
          required: true,
          message: this.$t('setting.profile.wrong-firstName'),
          trigger: 'blur'
        }
      ],
      lastName: [
        {
          required: true,
          message: this.$t('setting.profile.wrong-lastname'),
          trigger: 'blur'
        }
      ],
      nationality: [
        {
          required: true,
          message: this.$t('setting.profile.wrong-nationality'),
          trigger: 'blur'
        }
      ]
    }

    @Watch('tabActive') watchTabActive(tab: string): void {
      if (!this.walletAddress && tab !== 'my-profile' && !this.dataSocialProfile?.id) {
        this.showTabSocial()
      }
    }

    pickerOptions = {
      disabledDate(time: any) {
        return time.getTime() > Date.now()
      }
    }

    dataSocialProfile: Record<string, any> = {}

    async showTabSocial(): Promise<void> {
      this.imgBanner = []
      const result = await api.showTabSocial()
      this.address = result.data.address
      this.socialInfo = result.data
      const a = result.data.banner

      this.imgBanner = a

      // this.abc =[...this.socialInfo, this.idPhoto1]
      this.dataSocialProfile = result.data
      forEach(this.socialList, elm => {
        elm.value = result.data[elm.key]
      })
      this.query.total = result.totalElements
      this.socialInfo.description = this.socialInfo.description.replaceAll(/\\n/g, '\n')
      // this.socialInfo.description.replace(/\\n/g, '<br>')
    }

    created(): void {
      // console.log('ngu');
      const currentCountry = filter(this.listCountry, country => country.code === 'VN')[0]
      this.form.country = currentCountry.name
      const currentCountry2 = filter(this.listCountry2, country => country.code === 'VN')[0]
      this.form.nationality = currentCountry2.name
      this.apiUpload = getRepository('upload')
      if (this.walletAddress) {
        this.showTabSocial()
      }
      this.init()
    }

    // mounted(){
    //    console.log("this.daf",this.idPhoto1)
    //

    get emailLength(): string {
      let mailSlice = this.form.email
      if (mailSlice !== null && mailSlice.length > 15 && !this.isDesktop) {
        mailSlice = mailSlice.slice(0, 15) + '...'
      }
      return mailSlice
    }

    remoteCountry(query: string): void {
      // console.log(query)

      if (query) {
        this.listCountry = filter(
          countryJson,
          country => trim(country.code).toUpperCase().includes(query.toUpperCase()) || trim(country.name).toUpperCase().includes(query.toUpperCase())
        )
        // if (currentCountry.length > 0) {
        //   this.listCountry = currentCountry
        // }
      } else if (!query) {
        this.listCountry = countryJson
      }
    }

    handleSelectCountry(): void {
      setTimeout(() => {
        this.listCountry = countryJson
      }, 1000)
    }

    handleSelectNationality(name: string): void {
      const country = filter(countryJson, elm => elm.name === name)[0]
      if (country) {
        this.form.nationalityCode = country.code
      }
      setTimeout(() => {
        this.listCountry2 = countryJson
      }, 1000)
    }

    remoteCountry2(query: string): void {
      if (query) {
        const currentCountry = filter(
          this.listCountry2,
          country => trim(country.code).toUpperCase().includes(query.toUpperCase()) || trim(country.name).toUpperCase().includes(query.toUpperCase())
        )
        if (currentCountry.length > 0) {
          this.listCountry2 = currentCountry
        }
      } else if (!query) {
        this.listCountry2 = countryJson
      }
    }

    validateForm(): boolean {
      let profile: any = this.$refs.profile
      let valid = false
      profile.validate((_valid: boolean) => {
        valid = _valid
      })
      return valid
    }

    validateMail(email: string): boolean {
      return /^[a-z][a-z0-9_.]{0,50}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm.test(email)
    }

    @Watch('form.email') watchMail(email: string): void {
      if (email) {
        if (this.validateMail(this.form.email)) {
          this.msg = ''
          this.isDisabled = false
        } else {
          this.msg = this.$i18n.t('notify.email-validation-input')
          this.isDisabled = true
        }
      } else {
        this.msg = ''
        this.isDisabled = false
      }
    }

    // debounce chan doble click
    debounceFilter = debounce((nameAction: any) => {
      if (nameAction == 'handleReload') {
        this.init()
      }
      if (nameAction == 'handleSavePersonal') {
        this.updateProfile()
      }
      if (nameAction == 'handleChangePassword') {
        this.changePassword()
      }
    }, 400)

    handleSavePersonal(): void {
      const valid = this.validateForm()
      if (this.isLogin) {
        if (valid && !this.errorBirhday) {
          this.debounceFilter('handleSavePersonal')
        }
      } else {
        if (valid) {
          this.debounceFilter('handleSavePersonal')
        }
      }
    }

    handleOpenDeleteAccount(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-delete-account',
        isOpen: true
      })
    }

    async handleDeleteAccount(): Promise<void> {
      const tokenMinDelete = this.urlSystem['system.token.min.delete.user']
      let accountValidated = false
      await api
        .validateAccount()
        .then(() => {
          accountValidated = true
        })
        .catch((error: any) => {
          const { status } = error.response.data
          let message = ''
          if (status === 'INVALID_BALANCE') {
            // message = `Your total balance is more than ${tokenMinDelete}, you can't do this function`
            message = this.$t('notify_check-INVALID_BALANCE', { money: tokenMinDelete }) as string
            this.$message.error({ message, duration: 5000 })
          } else if (status === 'OWNING_NFT') {
            message = this.$tc('notify_check-OWNING_NFT') as string
            this.$message.error({ message, duration: 5000 })
          }
          this.setOpenPopup({
            popupName: 'popup-confirm-delete-account',
            isOpen: false
          })
        })
      if (accountValidated) {
        const data = {
          type: 'EMAIL',
          email: this.user.email
        }
        await api
          .resendCode(data)
          .then(() => {
            this.type2Fa = 'EMAIL'
            this.setOpenPopup({
              popupName: 'popup-verified',
              isOpen: true
            })
          })
          .catch(err => {
            console.log('>>> / file: Profile.vue / line 636 / err', err.response)
          })
      }
    }

    handleSaveSocial(): void {
      const params = {
        ...this.socialInfo
      }
      apiNft
        .updateSocialInfo(params)
        .then(() => {
          let message: any = this.$t('setting.profile.messSaveProfile')
          this.$message.success({ message, duration: 5000 })
        })
        .catch(err => {
          console.log(err)
        })
    }

    reload(): void {
      this.init()
    }

    updateProfile(): void {
      console.log('updateProfile')
      if (this.walletAddress) {
        if (this.form.email && this.validateMail(this.form.email) && this.form.emailVerified === 0) {
          const payload = {
            type: 'EMAIL',
            email: this.form.email
          }
          api.securityCode(payload).then(() => {
            this.setOpenPopup({
              popupName: 'popup-verify-mail-external',
              isOpen: true
            })
          })
        } else {
          const data = {
            displayName: this.form.displayName
          }
          api.updateProfileExternalWallet(data).then(() => {
            let message: any = this.$t('setting.profile.messSaveProfile')
            this.$message.success(message)
            this.init()
          })
        }
      } else {
        api.updateProfile(this.form).then(() => {
          let message: any = this.$t('setting.profile.messSaveProfile')
          this.$message.success({ message, duration: 5000 })
          this.init()
        })
      }
    }

    // saveTabSocial(): void {
    //   api.saveTabSocial(this.item.value).then(() => {
    //     let message: any = this.$t('setting.profile.messSaveProfile')
    //     this.$message.success(message)
    //     this.init()
    //   })
    //   console.log('value', this.dataSocialProfile)
    // }

    handleReload(): void {
      this.debounceFilter('handleReload')
    }

    handleChangePassword(): void {
      this.debounceFilter('handleChangePassword')
    }

    changePassword(): void {
      const data = {
        email: this.$store.state.beAuth.user.email,
        type: 'EMAIL',
        reason: 'PROFILE_RESET_PASSWORD'
      }
      api.resendCode(data).then(() => {
        this.setOpenPopup({
          popupName: 'popup-change-password',
          isOpen: true
        })
      })
    }

    // setInterval(): void{
    //   setInterval(this.handleSaveNftProfile, 5000);
    // }
    async handleChangeFile(file: any): Promise<any> {
      if (file) {
        const formData = new FormData()
        if (file.status == 'ready') {
          formData.append('files', file.raw)
          formData.append('userId', this.userId)
          formData.append('type', 'AVATAR')
          this.apiUpload.updateAvatar(formData).then((res: any) => {
            this.form.avatar = res.success[0].url
            api
              .updateProfileAvatar(this.form)
              .then((res: any) => {
                let message: any = this.$t('setting.profile.messSaveProfile')
                this.$message.success({ message, duration: 5000 })
                this.init()
              })
              .catch((error: any) => {
                this.$message.error(error.message)
              })
          })
        }
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (isLt2M) {
        this.form.avatar = URL.createObjectURL(file.raw)
        EventBus.$emit('pushAvatar', URL.createObjectURL(file.raw))
      }
    }

    async handleChangeBanner(file: Record<string, any>): Promise<void> {
      const formData = new FormData()
      this.socialInfo.banner = file.url
      if (file.status === 'ready') {
        this.isUpload = true
        file.type = file.raw.type
        // this.fileList3 = []
        // this.fileList3.push(file)
        formData.append('files', file.raw)
        formData.append('userId', this.userId)
        formData.append('type', 'BANNER')
        file.percentage = 1
        const data: Record<string, any> = {}
        data.data = formData
        const uid = file.uid
        const result: any = await this.apiUpload.uploadFile(data)
        this.fileList3 = result.success[0].url
        // const index = findIndex(this.fileList3, (item: Record<string, any>) => item.uid === uid)
        // this.fileList3[index].url = result.success[0].url
        this.isUpload = false
      }
    }

    remove(): void {
      this.form.avatar = ''
      api
        .updateProfileAvatar(this.form)
        .then(() => {
          EventBus.$emit('pushAvatar', '')
          let message: any = this.$t('setting.profile.messDelete')
          this.$message.success({ message, duration: 5000 })
          this.init()
        })
        .catch((error: any) => {
          this.$message.error(error.message)
        })
    }

    async handleSaveNftProfile(file: Record<string, any>): Promise<void> {
      // this.isUpload = false
      console.log('this.isUpload', this.isUpload)
      if (this.isUpload == true) {
        return
      } else {
        if (this.imgBanner === '') {
          this.socialInfo.banner = ''
        } else {
          if (this.socialInfo.banner === this.imgBanner) {
            this.socialInfo.banner = this.imgBanner
          } else {
            this.socialInfo.banner = this.fileList3
            this.socialInfo = this.dataSocialProfile
          }
        }
        const params = {
          ...this.socialInfo,
          banner: this.socialInfo.banner && this.socialInfo.banner.length > 0 ? this.socialInfo.banner : null
        }
        apiNft
          ?.updateNftProfile(params)
          .then(() => {
            // this.socialInfo.description = this.socialInfo.description.replace(/\\n/g, '<br>')
            let message: any = this.$t('setting.profile.messSaveProfile')
            this.$message.success({ message, duration: 5000 })
          })
          .catch(err => {
            console.log(err)
          })
        // this.socialInfo.description.replace('/\\n/g')
        // console.log('test2222', this.socialInfo.description)
      }

      // const formData = new FormData()
      // // this.loading = true
      // formData.append('file', this.file)
      // if (this.file) {
      //   await this.apiNft
      //     ?.updateNftProfile(params)
      //     .then(res => {
      //       this.dataDetail = res
      //       this.$message.success('Lưu thành công')
      //       // setTimeout(() => {
      //       //   this.isStopDbClick = false
      //       // }, 1000)
      //     })
      //     .catch(() => {
      //       // this.form.avatar = this.user.avatar
      //       // this.isStopDbClick = false
      //       this.$message.warning('Lưu thất bại')
      //     })
      // }
    }

    handleLink(): void {
      this.$router.push({ name: 'Security' })
    }

    async handleDetail(): Promise<void> {
      await api.getProfile().then((res: any) => {
        this.form = res.data
        if (!res.data.kycStatus || res.data.kycStatus == 'REJECTED') {
          this.disable = false
        } else {
          this.disable = true
        }
      })
    }

    async get2fa(): Promise<void> {
      const params = {
        email: this.$store.state.beAuth.user.email
      }
      await api.get2fa(params).then((res: any) => {
        this.type2Fa = res
      })
    }

    async init(): Promise<void> {
      await this.handleDetail()
      if (this.isLogin) {
        await this.get2fa()
      }
    }

    errorBirhday = false

    @Watch('form.birthday')
    checkBirthday(birthday: any): void {
      if (new Date().getFullYear() - new Date(birthday).getFullYear() >= 18) {
        this.errorBirhday = false
      } else {
        this.errorBirhday = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .setting-profile {
    background: var(--bc-color-white);
    min-height: 500px;
    padding: 24px;

    .inline {
      display: inline-block;
    }

    .required {
      color: var(--bc-required);
    }

    .btn-action {
      width: 100px;
      height: 40px;
      background: var(--bc-color-white);
      color: var(--bc-btn-text);
      font-weight: 400;
      font-size: 14px;
      border: 1px solid var(--bc-btn-border);
      border-radius: 6px;
      text-align: center;
      line-height: 40px;
      //cursor: pointer;

      &:hover {
        color: var(--bc-btn-default-text-hover);
        border: 1px solid var(--bc-btn-default-border-hover);
      }
    }

    .title {
      color: var(--bc-text-primary);
      font-weight: 600;
      font-size: 18px;
    }

    .discript {
      font-weight: 400;
      font-size: 14px;
      color: var(--bc-text-discript);
    }

    .box1 {
      display: flex;

      .change-avatar {
        display: flex;
        padding-right: 24px;

        .left {
          display: flex;

          img {
            width: 80px;
            height: 80px;
            margin-right: 24px;
            border-radius: 50%;
            object-fit: cover;
          }

          .box-text {
            min-width: 160px;
            margin-right: 16px;

            span {
              display: block;
            }

            .remove {
              color: var(--bc-btn-bg-default-hover);
              cursor: pointer;
              font-size: 14px;
              font-weight: 400;
            }
          }
        }

        .right {
          .btn-upload {
            line-height: 38px !important;

            &:hover {
              background: var(--bc-btn-default-text-hover);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              // border-color: var(--bc-btn-default-border-hover);
            }
          }
        }
      }

      .change-password {
        border-left: 1px solid var(--bc-btn-border);
        display: flex;
        padding-left: 24px;

        .left {
          width: 240px;
          margin-right: 24px;

          .link {
            color: var(--bc-btn-bg-default-hover);
            cursor: pointer;
          }
        }

        .right {
          display: inline-block;
        }

        .btn-change-password {
          width: 142px;

          &:hover {
            background: var(--bc-btn-default-text-hover);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }

    .line {
      margin-top: 24px;
      border-top: 1px solid var(--bc-btn-border);
    }

    .big-title {
      margin-top: 24px;
      color: var(--bc-text-primary);
      font-weight: 600;
      font-size: 24px;
    }

    .label {
      margin-top: 24px;
      color: var(--bc-text-primary);
      font-weight: 400;
      font-size: 14px;
    }

    .box-input {
      margin-top: 8px;
      width: 540px;
      height: 48px;

      ::v-deep.el-input__suffix {
        margin-right: 8px;

        .el-input__suffix-inner {
          color: var(--bc-status-success);
          line-height: 46px;
        }
      }
    }

    .validate-email {
      color: #ff0000;
    }

    .mini-box {
      width: 262px;

      .el-select {
        width: 100% !important;
        height: 46px !important;
      }
    }

    .box-btn {
      display: flex;

      .btn-reset {
        margin-right: 16px;
        min-width: 120px;

        &:hover {
          background: var(--bc-btn-default-text-hover);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .btn-save {
        color: var(--bc-color-white);
        background: var(--bc-theme-primary-gradient);
        min-width: 120px;
        border: none;

        &:hover {
          background: var(--bc-theme-primary-gradient-hover);
        }
      }

      .custom-btn-external {
        display: flex !important;
      }
    }

    .btn-action-bottom {
      margin-top: 24px;
    }
  }

  .error {
    color: #f56c6c;
    font-size: 12px;
  }

  ::v-deep.content {
    .side-bar {
      margin-right: 125px;

      .tab-active {
        background: var(--bc-menu-active);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
      }

      &__item {
        &:hover {
          background: var(--bc-menu-active);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    .my-profile {
      .span-icon {
        transition: linear 0.15s;
      }

      .rotate {
        transform: rotate(-180deg);
      }

      .wrap {
        max-height: 0;
        transition: max-height 0.3s ease-out;
        overflow: hidden;
      }

      .show {
        max-height: 900px;
        transition: max-height 0.3s ease-in;
      }

      .wrap-delete {
        margin-top: 24px;
        padding: 24px 0 0;
        border-top: 1px solid #dbdbdb;

        h3 {
          margin-bottom: 12px;
        }

        .btn-delete-account {
          margin-top: 24px;
          width: max-content;
          padding: 0 10px;
          border-color: var(--bc-status-error);
          color: var(--bc-status-error);
        }
      }
    }

    .nft-profile {
      max-width: 540px;
      width: 100%;

      .text-des {
        margin-bottom: 8px;
      }

      .banner-img {
        height: 143px;

        .avatar-uploader {
          height: 100%;

          .el-upload {
            position: relative;
            width: 100%;
            height: 100%;

            .avatar {
              object-fit: cover;
              // background-image: ;
              image-rendering: -webkit-optimize-contrast;
            }

            .overlay {
              border-radius: 8px;
              transition: linear 0.1s;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
              opacity: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            &:hover {
              .overlay {
                opacity: 1;
              }
            }
          }
        }
      }

      .banner-input {
        border-color: #dbdbdb !important;
      }
    }

    .social-info {
      max-width: 540px;
      width: 100%;

      .social-item {
        margin-bottom: 24px;

        .des {
          margin-bottom: 8px;
        }

        .text-cap {
          text-transform: capitalize;
        }

        .el-input-group__prepend {
          padding: 0;
          width: 48px;

          .span-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      .social-item:last-child {
        margin-bottom: 0;
      }
    }
  }

  ::v-deep.nft-profile {
    .des-input {
      .des-border-input {
        .el-textarea__inner {
          border-color: #dbdbdb;
        }
      }
    }

    .avatar {
      color: red;

      .content-media {
        color: red;

        img {
          object-fit: cover;
        }
      }
    }
  }
</style>
