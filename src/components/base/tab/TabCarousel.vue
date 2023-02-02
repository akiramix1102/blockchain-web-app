<template>
  <div class="carousel-wrapper">
    <div class="carousel" :style="{ width, height }" v-on:scroll.passive="handleScroll">
      <slot />
    </div>
    <div v-show="isShowPrev" class="left-arrow" ref="left" @click="changeSlide(-1)">
      <base-icon size="24" icon="arrow-left-tab" />
    </div>
    <div v-show="isShowNext" class="right-arrow" ref="right" @click="changeSlide(1)">
      <base-icon size="24" icon="arrow-right-tab" />
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
  import BaseIcon from '@/components/base/icon/BaseIcon.vue'
  @Component({
    components: { BaseIcon }
  })
  export default class TabCarousel extends Vue {
    @Prop({ required: false, type: String, default: '' }) width!: string
    @Prop({ required: false, type: String, default: '' }) height!: string

    isShowPrev = false
    isShowNext = true

    handleScroll(e: any): void {
      this.isShowPrev = e.target.scrollLeft !== 0
      this.isShowNext = e.target.scrollLeft !== e.target.scrollWidth - e.target.offsetWidth
    }
    changeSlide(delta: number): void {
      const carousel = this.$el.querySelector('.carousel') as HTMLElement
      const width = carousel.offsetWidth
      const scroll = carousel.scrollLeft
      const scWidth = carousel.scrollWidth
      const fullWidth = scWidth - width
      carousel.scrollTo(carousel.scrollLeft + 60 * delta, 0)
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  .carousel-wrapper {
    position: relative;
    margin: 0 17px;
  }
  .carousel {
    display: flex;
    align-items: center;
    overflow: scroll;
    white-space: nowrap;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .carousel::-webkit-scrollbar {
    display: none;
  }
  .carousel > * {
    scroll-snap-align: start;
  }

  .left-arrow,
  .right-arrow {
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
    font-size: 40px;
    width: 58px;
  }
  .left-arrow {
    left: 0;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    color: rgb(61, 70, 83);
    background: linear-gradient(to right, rgb(22, 26, 30) 42.24%, transparent 95.69%);
  }

  .right-arrow {
    right: -20px;
    height: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: end;
    justify-content: flex-end;
    color: rgb(61, 70, 83);
    background: linear-gradient(to left, rgb(22, 26, 30) 42.24%, transparent 95.69%);
  }
  .hide {
    display: none;
  }
</style>
