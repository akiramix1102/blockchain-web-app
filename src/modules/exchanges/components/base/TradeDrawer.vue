<template>
  <div class="drawer">
    <el-drawer
      ref="tradeDrawer"
      :visible.sync="visible"
      direction="btt"
      :show-close="false"
      :size="height"
      :modal="true"
      @close="close"
      modal-class="drawer-custom"
      custom-class="drawer-custom"
    >
      <slot name="header" slot="title">
        <div v-if="type == 'default'" class="header-drawer">
          <span>{{ title }}</span>
          <base-icon @click.native="close" size="24" icon="trade-close-drawer"></base-icon>
        </div>
        <div v-if="type == 'trade'" class="header-drawer">
          <span>{{ title ? title : 'SPOT TRADING' }}</span>
          <span>
            <el-popover placement="bottom" width="120" trigger="click" popper-class="reference-drawer">
              <div class="reference-item">
                <div>Spot Tutorial</div>
                <div>FAQ</div>
              </div>
              <base-icon size="24" slot="reference" icon="trade-dot-drawer" class="mr-8"></base-icon>
            </el-popover>

            <base-icon @click.native="close" size="24" icon="trade-close-drawer"></base-icon>
          </span>
        </div>
        <div v-if="type == 'filter'" class="header-drawer">
          <base-icon size="24" @click.native="close" icon="trade-close-drawer"></base-icon>
          <span>{{ title ? title : 'Filter' }}</span>
          <span class="reset" @click="$emit('reset')">Reset</span>
        </div>
      </slot>
      <div class="main" :style="type == 'default' ? 'min-height: 100%' : ''">
        <slot></slot>
      </div>
      <slot name="footer">
        <div v-if="type == 'trade' || type == 'filter'" class="footer-drawer">
          <span>{{ textButton }}</span>
        </div>
      </slot>
    </el-drawer>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

  @Component({
    components: {}
  })
  export default class TradeDrawer extends Vue {
    @Prop({ required: true, type: Boolean, default: false }) value!: boolean
    @Prop({ required: false, type: String, default: '' }) title!: string | null
    @Prop({ required: false, type: String, default: '' }) textButton!: string
    @Prop({ required: false, type: [Number, String], default: 100 }) height!: string | number
    @Prop({
      required: false,
      type: String,
      default: 'default',
      validator(value: any): boolean {
        return ['filter', 'default', 'trade'].includes(value)
      }
    })
    type!: string

    get visible() {
      return this.value
    }

    set visible(value) {
      this.$emit('input', value)
    }

    close() {
      this.$emit('close')
      this.$emit('input', false)
    }

    handleClose(done) {
      done()
    }
  }
</script>

<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }

  .drawer {
    .header-drawer {
      @include text(16px, 24px, 600, var(--color-text-primary));
      display: flex;
      justify-content: space-between;
      align-items: center;

      .reset {
        @include text(14px, 20px, 400, var(--color-text-primary));
      }
    }

    ::v-deep .main {
      min-height: calc(100% - 84px);
      border-bottom: 1px solid var(--color-border-primary);

      span {
        @include text(12px, 16px, 400, var(--color-text-secondary));
      }
    }

    .footer-drawer {
      margin: 20px 20px 24px 20px;
      display: flex;
      justify-content: center;

      span {
        text-align: center;
        height: 40px;
        flex: 1;
        background-color: var(--color-buy-primary);
        display: block;
        @include text(16px, 40px, 400, var(--color-text-primary));
        border-radius: 4px;
      }
    }
  }

  ::v-deep .drawer-custom {
    background-color: var(--color-background);

    .el-drawer__header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border-primary);
      margin-bottom: 24px;
    }
  }
</style>
