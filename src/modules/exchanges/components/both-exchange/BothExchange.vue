<template>
  <div class="container">
    <div class="group-search">
      <div class="search">
        <base-icon icon="icons_search"></base-icon>
        <input v-model="search" @focus="inputState('focus')" @blur="inputState('blur')" type="text" placeholder="Search" />
        <base-icon icon="clear" class="remove" @click.native="search = null"></base-icon>
      </div>
      <span v-show="!search && focus" class="cancel exchange-text-active">Cancel</span>
    </div>
    <trade-tab class="base-tab" :arrayTab="tabsCoin" :isShowUnderline="false" type="scroll"> </trade-tab>
    <div class="content">
      <div class="header-content">
        <sort-header>Pair</sort-header>
        <sort-header>Price</sort-header>
        <sort-header>Change</sort-header>
      </div>
      <div class="table-content">
        <div class="item" v-for="item in data" :key="item.pairDown">
          <div class="top">
            <span
              ><span class="trade-text-white">{{ item.currency }}</span
              >/{{ item.bothCurrency }}</span
            >
            <span :class="item.status == 'up' ? 'trade-text-success' : 'trade-text-error'">{{ item.priceUp }}</span>
            <span :class="item.status == 'up' ? 'trade-text-success' : 'trade-text-error'">{{ item.status == 'up' ? '+' : '-' }} {{ item.changeUp }}</span>
          </div>
          <div class="bottom">
            <span class="nowrap">{{ item.pairDown }}</span>
            <span>{{ item.priceDown }}</span>
            <span>{{ item.changeDown }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import SortHeader from '../base/SortHeader.vue'

  @Component({ components: { SortHeader } })
  export default class BothExchange extends Vue {
    search = ''
    focus = false
    tabsCoin = [
      {
        id: 0,
        tabName: 'BUSD',
        component: ''
      },
      {
        id: 1,
        tabName: 'USDT',
        component: ''
      },
      {
        id: 2,
        tabName: 'BNB',
        component: ''
      },
      {
        id: 3,
        tabName: 'BTC',
        component: ''
      },
      {
        id: 4,
        tabName: 'ETH',
        component: ''
      },
      {
        id: 5,
        tabName: 'ABC',
        component: ''
      },
      {
        id: 6,
        tabName: 'HUB',
        component: ''
      },
      {
        id: 7,
        tabName: 'LYNK',
        component: ''
      },
      {
        id: 8,
        tabName: 'CLM',
        component: ''
      }
    ]
    data = [
      {
        currency: 'LYNK',
        bothCurrency: 'BTC',
        pairDown: 'Lynkey',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'up'
      },
      {
        currency: 'KLAY',
        bothCurrency: 'BTC',
        pairDown: 'Kakao',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'up'
      },
      {
        currency: 'ETC',
        bothCurrency: 'BTC',
        pairDown: 'Etherium Classic',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'up'
      },
      {
        currency: 'WOO',
        bothCurrency: 'BTC',
        pairDown: 'Wootrade Network',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'up'
      },
      {
        currency: 'RVN',
        bothCurrency: 'BTC',
        pairDown: 'RavenCoin',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      },
      {
        currency: 'KNC',
        bothCurrency: 'BTC',
        pairDown: 'Kyber Network',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      },
      {
        currency: 'ETH',
        bothCurrency: 'BTC',
        pairDown: 'Ethereum 1',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      },
      {
        currency: 'ETH',
        bothCurrency: 'BTC',
        pairDown: 'Ethereum 2',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      },
      {
        currency: 'ETH',
        bothCurrency: 'BTC',
        pairDown: 'Ethereum 5',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      },
      {
        currency: 'ETH',
        bothCurrency: 'BTC',
        pairDown: 'Ethereum 4',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      },
      {
        currency: 'ETH',
        bothCurrency: 'BTC',
        pairDown: 'Ethereum 3',
        priceUp: '0.0157858',
        priceDown: '~ $0.0039',
        changeUp: '1.71%',
        changeDown: '926.014',
        status: 'down'
      }
    ]

    inputState(text) {
      this.focus = text == 'focus'
    }
  }
</script>
<style lang="scss" scoped>
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
    padding: 16px;
    width: 100%;
    height: 100%;
    font-size: 12px;

    .group-search {
      display: flex;
      align-items: center;

      .search {
        flex: 1;
        height: 32px;
        display: flex;
        border-radius: 8px;
        align-items: center;
        padding-left: 13px;
        background-color: var(--color-background-element);

        .remove {
          cursor: pointer;
          margin-right: 10px;
          display: block;
        }

        input {
          caret-color: var(--color-text-primary);
          font-size: 12px;
          line-height: 22px;
          border-radius: 8px;
          flex: 1;
          box-sizing: border-box;
          margin: 0;
          margin-left: 10px;
          min-width: 0px;
          padding: 0px;
          outline: none;
          border: none;
          background-color: inherit;
          opacity: 1;
          color: var(--color-text-secondary);

          &:placeholder-shown ~ .remove {
            display: none;
          }
        }
      }

      .cancel {
        cursor: pointer;
        margin-left: 8px;
      }
    }

    ::v-deep .base-tab {
      margin: 16px 0;

      .carousel-wrapper {
        margin: 0;

        .tab-item {
          font-size: 14px;
        }
      }
    }

    .content {
      margin: 0 -16px;

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
    ::v-deep.container {
      padding-top: 0;
      .table-content {
        height: 377px !important;
      }
      .carousel {
        width: calc(100% - 24px) !important;
        & ~ .right-arrow {
          right: 0;
        }
      }
    }
  }
</style>
