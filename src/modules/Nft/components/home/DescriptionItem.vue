<template>
  <span v-html="getDescription"> </span>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class DescriptionItem extends Vue {
    @Prop({ required: false, type: String, default: '' }) description!: string

    get getDescription(): string {
      const language = window.localStorage.getItem('bc-lang')!
      if (this.description) {
        const objDesc = JSON.parse(this.description)
        return objDesc[language].replace(/\\n/g, '<br>')
      }
      return ''
    }
  }
</script>

<style scoped></style>
