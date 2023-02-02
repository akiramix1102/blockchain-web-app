<template>
  <div class="table-round">
    <h3 class="text-bold mb-24" style="font-size: 20px">{{ $t('crowd-sale.round') }}</h3>
    <div class="container" v-for="data in listRound" :key="data.created">
      <div class="column-1">
        <p class="round-name">
          <span style="float: left" class="text-semibold">{{ $t('crowd-sale.round') }} {{ data.id }} </span>
          <span style="float: left"> &nbsp;(${{ data.price }}) </span>
        </p>

        <p class="date">{{ data.fromDate.time | formatMMDDYYWithoutHours }} - {{ data.toDate.time | formatMMDDYYWithoutHours }}</p>
      </div>
      <div class="column-2">
        <p class="price text-semibold">{{ data.totalSold }} LYNK</p>
        <p class="progress">{{ ((data.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import firebase from '@/utils/firebase'

  @Component
  export default class TableRoundMobile extends Vue {
    listRound: Record<string, any>[] = []
    listener: any = null

    created(): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      const crowdSaleRef = firebase.database().ref('crowd-sales')
      this.listener = crowdSaleRef.on('value', function (snapshot) {
        console.log('data', snapshot.val())

        _this.listRound = snapshot.val()
        console.log(_this.listRound)
      })
    }

    destroyed(): void {
      const crowdSaleRef = firebase.database().ref('crowd-sales')
      crowdSaleRef.off('value', this.listener)
    }
  }
</script>

<style scoped lang="scss">
  .table-round {
    padding: 20px;
    background: #fff;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
  }

  .container {
    margin: 18px 0;
    display: flex;
    flex-direction: row;
  }

  .column-1 {
    display: flex;
    flex-direction: column;
    width: 60%;
    border-bottom: 1px solid #dbdbdb;

    .round-name {
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      float: left;
      color: #0a0b0d;
    }

    .date {
      width: 100%;
      font-size: 12px;
      color: #5b616e;
      line-height: 16px;
      margin: 3.5px 0 18px 0;
    }
  }

  .column-2 {
    display: flex;
    flex-direction: column;
    margin: 0 0 0 auto;
    text-align: right;
    border-bottom: 1px solid #dbdbdb;
    width: 55%;

    .progress {
      font-size: 12px;
      color: #5b616e;
      line-height: 16px;
      margin-top: 4px;
    }

    .price {
      color: #0a0b0d;
    }
  }

  .line {
    width: 300px;
    opacity: 60%;
    margin-top: 18px;
  }
</style>
