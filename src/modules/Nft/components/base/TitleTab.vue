<template>
  <div class="title-tab" :class="{ russian: selectLanguage() === 'ru' }">
    <div
      v-for="(item, index) in arrTab"
      :key="index"
      :class="{ 'tab-active': tabActive === index, 'text-desc': tabActive !== index }"
      class="tab-item cursor nft-body-small"
      @click="handleClickTab(index, item.type)"
    >
      <span v-if="trending">{{ item.title }}</span>
      <span v-else>{{ $t(`nft.tab.${item.title}`) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TitleTab extends Vue {
    @Prop({ required: true, type: Array, default: () => [] }) arrTab!: Array<Record<string, any>>
    @Prop() trending!: any
    tabActive = 0

    handleClickTab(index: number, type: string | number): void {
      if (index === this.tabActive) return
      this.tabActive = index
      this.$emit('clickTab', type)
    }

    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
  }
</script>

<style scoped lang="scss">
  .title-tab {
    display: flex;
    align-items: center;
    height: 48px;
    border: 1px solid #dbdbdb;
    border-radius: 32px;
    width: fit-content;
    padding: 8px;
    &.russian {
      height: auto;
      padding: 0;
      .tab-item {
        text-align: center;
        padding: 4px 16px !important;
      }
    }
    .tab-item {
      padding: 4px 16px;
      border-radius: 16px;
    }
    .tab-active {
      background: var(--bc-tab-active);
      color: var(--bc-color-white);
    }
  }
</style>
