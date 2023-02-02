<template>
  <div>
    <div>
      <div v-if="getProperty">
        <div class="sack-map" v-for="(item, index) in getProperty" :key="index">
          <div class="sack-map-content">
            <div class="sack-map-title">{{ item.propertyName }}</div>
            <div class="sack-map-code">{{ item.propertyData }}</div>
          </div>
          <div class="sack-map-des" v-if="item.description">({{ item.description }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import filter from 'lodash/filter'
  @Component({
    components: {}
  })
  export default class TabPolices extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array, default: () => [] }) policies!: Array<Record<string, any>>
    get getProperty() {
      if (this.policies && this.policies.length) {
        const property = filter(this.policies, elm => elm.propertyData != 'TIME_SHARE' && elm.propertyData != 'PROPERTY')
        return property
      } else {
        return false
      }
    }

    // get getProperty() {
    //   if (this.policies && this.policies.length) {
    //     const property = filter(this.policies, elm => elm.propertyData === 'PROPERTY')[0]
    //     return property.propertyData
    //   } else {
    //     return false
    //   }
    // }
  }
</script>

<style scoped lang="scss">
  .sack-map {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    margin-bottom: 16px;

    &:first-child {
      margin-top: 20px;
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

      &-title {
        &-sup {
          color: var(--bc-text-disabled);
        }
      }
      &-code {
        color: var(--bc-text-discript);
      }
      &-des {
        color: var(--bc-text-disabled);
      }
    }
  }
</style>
