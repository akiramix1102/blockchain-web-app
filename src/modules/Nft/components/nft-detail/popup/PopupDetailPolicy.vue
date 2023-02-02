<template>
  <base-popup name="popup-detail-policy" class="popup-tour-details" width="580px" :open="handleCommand">
    <p slot="title" class="header-popup">{{ metaName }}</p>
    <div class="content color-primary">
      <div class="sack-map" v-for="(item, index) in arrMeta" :key="index">
        <div class="sack-map-content">
          <div class="sack-map-title">{{ item.metaName }}</div>
          <div class="sack-map-code text-desc">{{ item.metaValue }}</div>
        </div>
        <div class="sack-map-desc" v-if="item.metaDescription">({{ item.metaDescription }})</div>
      </div>
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
  export default class PopupDetailPolicy extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: [] }) arrMeta!: Array<Record<string, any>>

    metaName = ''

    handleCommand(): void {
      const language = window.localStorage.getItem('bc-lang')!
      if (this.arrMeta.length) {
        const objName = JSON.parse(this.arrMeta[0].metaTypeName)
        this.metaName = objName[language].replace(/\\n/g, '<br>')
      }
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

  .sack-map {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    margin-bottom: 16px;

    &:first-child {
      // margin-top: 20px;
    }
    &:last-child {
      padding-bottom: 29px;
      margin-bottom: 0;
    }
    .sack-map-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .sack-map-code {
        color: var(--bc-text-discript);
      }
    }
    .sack-map-desc {
      color: var(--bc-text-disabled);
    }
  }
</style>
