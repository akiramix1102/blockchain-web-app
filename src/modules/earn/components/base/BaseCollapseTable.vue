<template>
  <div class="base-collapse-table" :style="!data.length ? 'min-height:unset' : null">
    <div v-for="item in data" :key="item.id" class="collapse-item" :class="item.isShow ? 'row-active' : null">
      <div
        class="top"
        @click="
          item.isShow = !item.isShow
          $forceUpdate()
        "
      >
        <slot name="top" v-bind="item"></slot>
      </div>
      <div class="bottom">
        <slot name="bottom" v-bind="item"></slot>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class BaseCollapseTable extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) data!: Array<Record<string, any>>
  }
</script>

<style scoped lang="scss">
  .base-collapse-table {
    padding: 0;
    // min-height: 200px;
    .collapse-item {
      margin-top: 16px;
      .top {
        padding-bottom: 16px;
        border-bottom: 1px solid #dbdbdb;

        .wrap-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .right {
            display: flex;
            .square-icon {
              margin-left: 24px;
              transition: all 0.3s;
            }
          }
        }
      }

      .bottom {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
        .list {
          padding-bottom: 16px;
          border-bottom: 1px solid #dbdbdb;

          .list-item {
            display: flex;
            justify-content: space-between;
            padding-bottom: 12px;
            .title {
              width: 35%;
            }
          }
          .list-item:last-child {
            padding-bottom: 0;
          }
          .list-item:first-child {
            padding-top: 16px;
          }
        }
      }
    }
    .row-active {
      .top {
        .square-icon {
          transform: rotate(-180deg);
        }
      }
      .bottom {
        max-height: 500px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .base-collapse-table {
      .collapse-item {
        .top {
          .wrap-top {
            .right .text-right p {
              font-weight: 500;
            }
          }
        }
        .bottom {
          .list .list-item {
            .text-ec {
              font-weight: 400;
            }
          }
        }
      }
    }
  }
</style>
