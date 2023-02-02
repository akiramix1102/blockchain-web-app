<template>
  <div class="sort-header" @click="handleClick">
    <slot></slot>
    <div class="group-sort" v-if="useIcon">
      <base-icon v-if="!sortHeader" icon="sort-header"></base-icon>
      <base-icon v-else-if="sortHeader == 'up'" icon="sort-header-up"></base-icon>
      <base-icon v-else icon="sort-header-down"></base-icon>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

  @Component({
    components: {}
  })
  export default class SortHeader extends Vue {
    sortHeader: string | null = null
    @Prop({ required: false, default: true, type: Boolean }) useIcon!: boolean

    @Watch('sortHeader') changeSortHeader() {
      this.$emit('state', this.sortHeader)
    }

    handleClick() {
      if (this.sortHeader == 'up') {
        this.sortHeader = 'down'
      } else if (this.sortHeader == 'down') {
        this.sortHeader = null
      } else {
        this.sortHeader = 'up'
      }
    }

    resetSortHeader() {
      this.sortHeader = null
    }
  }
</script>

<style scoped lang="scss">
  .sort-header {
    color: var(--color-text-secondary);
    display: flex;
    cursor: pointer;
  }
</style>
