<template>
  <base-popup name="popup-tour-details" class="popup-tour-details" width="1000px" :open="handleCommand" :close="handleClose">
    <p slot="title" class="header-popup">{{ metaName }}</p>
    <div class="content color-primary">
      <!-- <div class="header-4 text-semibold" v-if="this.metaDetail[0]">{{ this.metaDetail[0].metaName }}</div> -->
      <div class="content-header body-base text-regular" id="text-details" v-html="textTourDetail">Hello</div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'

  @Component({
    components: { EmptyBlock }
  })
  export default class PopupTourDetail extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: [] }) metaDataTour!: Array<Record<string, any>>

    textTourDetail = ''
    metaName = ''

    handleCommand(): void {
      const language = window.localStorage.getItem('bc-lang')!
      if (this.metaDataTour.length) {
        const objDesc = JSON.parse(this.metaDataTour[0].metaValue)
        this.textTourDetail = objDesc[language].replace(/\\n/g, '<br>')
        const objName = JSON.parse(this.metaDataTour[0].metaTypeName)
        this.metaName = objName[language].replace(/\\n/g, '<br>')
      }
    }

    handleClose(): void {
      this.textTourDetail = ''
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    // padding: 24px;
  }
  .popup-tour-details {
    h1 {
      font-size: 30px;
      font-weight: 700;
      line-height: 50px;
    }
  }
</style>
