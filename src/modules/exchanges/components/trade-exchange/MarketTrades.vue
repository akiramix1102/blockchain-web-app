<template>
  <div class="container">
    <div class="content">
      <div class="header-content">
        <sort-header :use-icon="false">Price (USDT)</sort-header>
        <sort-header :use-icon="false">Amount (LYNK)</sort-header>
        <sort-header :use-icon="false">Time</sort-header>
      </div>
      <div class="table-content">
        <div class="item" v-for="item in data" :key="item.time + '_trade_' + Math.random()">
          <div class="top">
            <span :class="item.status == 'up' ? 'trade-text-success' : 'trade-text-error'">{{ item.price }}</span>
            <span class="text-normal">{{ item.amount }}</span>
            <span class="text-normal">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Component, Vue } from 'vue-property-decorator'
  import BaseTab from '@/modules/exchanges/components/base/TradeTab.vue'
  import SortHeader from '../base/SortHeader.vue'

  @Component({ components: { BaseTab, SortHeader } })
  export default class MarketTrades extends Vue {
    search = ''
    focus = false
    data = [
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'down'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'down'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'down'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'down'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'down'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      },
      {
        price: '20,158.82',
        amount: '0.157858',
        time: '17:45:02',
        status: 'up'
      }
    ]

    inputState(text) {
      this.focus = text == 'focus'
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

  ::v-deep::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  /* Track */
  ::v-deep::-webkit-scrollbar-track {
    background: var(--color-background);
  }

  /* Handle */
  ::v-deep::-webkit-scrollbar-thumb {
    background: rgb(94, 102, 115);
    border-radius: 3px;
    height: 90px;
  }
  .container {
    width: 100%;
    height: 100%;

    ::v-deep.base-tab {
      .carousel-wrapper {
        margin: 0;
      }
    }

    .content {
      .header-content {
        margin: 0 16px 9px 16px;
        display: flex;

        > * {
          flex: 1;

          &:not(:first-child) {
            justify-content: flex-end;
          }
        }
      }

      .table-content {
        height: 300px;
        overflow-y: auto;

        .item {
          margin: 0 16px;
          color: var(--color-text-secondary);
          cursor: pointer;

          .top,
          .bottom {
            display: flex;

            > * {
              flex: 1;

              &:not(:first-child) {
                text-align: right;
              }
            }
          }

          .bottom {
            font-size: 12px;
            line-height: 16px;
          }

          .top {
          }

          margin-bottom: 8px;

          &:hover {
            opacity: 0.9 !important;
          }

          &:last-child {
            margin-bottom: 4px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .container {
      margin-top: 24px;
      .content {
        .header-content {
          margin: 0 0 12px 0;
          .sort-header {
            @include text(12px, 16px, 400, var(--color-text-secondary));
          }
        }
        .table-content {
          min-height: 356px;
          .item {
            margin: 0 0 8px 0;
            .top {
              .text-normal,
              .trade-text-error,
              .trade-text-success {
                @include text(12px, 16px, 400, var(--color-text-primary));
              }
            }
          }
        }
      }
    }
  }
</style>
