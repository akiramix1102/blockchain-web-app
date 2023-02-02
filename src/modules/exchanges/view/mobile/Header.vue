<template>
  <div class="container">
    <ExchangeHeader @visible="$emit('visible')" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import ExchangeHeader from '../../components/header/ExchangeHeader.vue'
  @Component({ components: { ExchangeHeader } })
  export default class Header extends Vue {}
</script>

<style scoped lang="scss">
  .container {
    height: 100%;
  }
</style>
