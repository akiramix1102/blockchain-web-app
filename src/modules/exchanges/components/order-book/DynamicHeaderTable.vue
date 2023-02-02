<template>
  <div class="dynamic-table">
    <div class="dynamic-table__header">
      <div class="dynamic-row dynamic-row--header">
        <span class="dynamic-col--owner" v-if="isShowOwner"> </span>
        <!-- <span class="dynamic-col dynamic-col--first-item">Price (USDT)</span>
      <span class="dynamic-col">Amount (LYNK)</span>
      <span class="dynamic-col">Total</span> -->
        <span class="dynamic-col" v-for="(label, index) in headerArr" :key="index" :class="index == 0 && 'dynamic-col--first-item'">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  @Component({ components: {} })
  export default class DynamicHeaderTable extends Vue {
    @Prop({ required: true, type: Array }) headerArr!: Array<string>
    @Prop({ required: false, type: Boolean, default: true }) isShowOwner!: boolean
  }
</script>

<style scoped lang="scss"></style>
