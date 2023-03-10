<template>
  <div class="setting-activity-mobile">
    <div class="box-mobile-app">
      <div class="title-box">{{ $t('setting.activity.title1') }}</div>
      <div class="discription">{{ $t('setting.activity.discript3') }}</div>
      <base-table :data="dataTableMobile" :showPagination="false">
        <el-table-column label="#" type="index" align="center" width="40" />
        <el-table-column :label="$t('setting.activity.signedIn')" prop="createdAt" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | timeAgo }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('setting.activity.ipAddress')" prop="ipAddress" min-width="145px" />
        <el-table-column :label="$t('setting.activity.source')" prop="deviceName" width="150" />
        <el-table-column :label="$t('setting.activity.location')" prop="metaDescription" min-width="250" />
        <el-table-column :label="$t('setting.activity.current')" width="164" align="center">
          <template slot-scope="scope">
            <div class="action">
              <base-icon v-if="scope.row.id === activityMobileCurent.id" icon="iconSuccess"></base-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="40" align="right">
          <template align="right" slot-scope="scope">
            <div class="action" @click="handleDeleteActivity(scope.row, 'mobile')">
              <el-tooltip class="item" effect="dark" content="Sign out" placement="bottom">
                <base-icon icon="iconDelete"></base-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <div class="hr" />
    <div class="box-sessions">
      <div class="title-box">{{ $t('setting.activity.title2') }}</div>
      <div class="discription">
        {{ $t('setting.activity.discript4') }} <span class="link" @click="handleOpenPopup">{{ $t('setting.activity.discript5') }}</span>
      </div>
      <base-table :data="activityWeb" :showPagination="false">
        <el-table-column label="#" type="index" align="center" width="40" />
        <el-table-column :label="$t('setting.activity.signedIn')" prop="createdAt" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | timeAgo }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('setting.activity.ipAddress')" prop="ipAddress" min-width="145px" />
        <el-table-column :label="$t('setting.activity.source')" prop="deviceName" width="150" />
        <el-table-column :label="$t('setting.activity.location')" prop="metaDescription" min-width="250" />
        <el-table-column :label="$t('setting.activity.current')" width="164" align="center">
          <template align="right" slot-scope="scope">
            <div class="action">
              <base-icon v-if="scope.row.id === activityWebCurent.id" icon="iconSuccess"></base-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="40" align="right">
          <template align="right" slot-scope="scope">
            <div class="action" @click="handleDeleteActivity(scope.row)">
              <el-tooltip class="item" effect="dark" :content="$t('setting.activity.sign-out')" placement="bottom">
                <base-icon icon="iconDelete"></base-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <popup-confirm @confirm="handleDeleteAllActivity" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { ActivityRepository } from '@/services/repositories/activity'
  import filter from 'lodash/filter'
  import PopupMixin from '@/mixins/popup'
  import PopupConfirm from '../../components/popup/PopupConfirm.vue'

  const apiActivity: ActivityRepository = getRepository('activity')
  @Component({ components: { PopupConfirm } })
  export default class MobileActivity extends Mixins(PopupMixin) {
    dataTable: Array<Record<string, any>> = []
    activityWebCurent: Record<string, any> = {}
    activityMobileCurent: Record<string, any> = {}
    dataTableMobile: Array<Record<string, any>> = []
    get activityMobiLe(): Array<Record<string, any>> {
      return filter(this.dataTable, elm => elm.sourceType === 'MOBILE')
    }

    get activityWeb(): Array<Record<string, any>> {
      return filter(this.dataTable, elm => elm.sourceType === 'WEB')
    }

    created(): void {
      apiActivity.getListActivity({ sourceType: 'WEB' }).then(res => {
        this.dataTable = res.content
        this.activityWebCurent = filter(this.dataTable, elm => elm.sourceType === 'WEB')[0]
      })
      apiActivity.getListActivity({ sourceType: 'MOBILE' }).then(res => {
        this.dataTableMobile = res.content
        this.activityMobileCurent = filter(this.dataTableMobile, elm => elm.sourceType === 'MOBILE')[0]
      })
    }

    handleDeleteActivity(row: Record<string, any>, type = 'web'): void {
      apiActivity.deleteActivity(row.id).then(() => {
        let message: any = this.$i18n.t('notify.delete-success')
        this.$message.success({ message, duration: 5000 })
        if (type === 'web') {
          this.dataTable = filter(this.dataTable, elm => elm.id !== row.id)
        } else {
          this.dataTableMobile = filter(this.dataTableMobile, elm => elm.id !== row.id)
        }
      })
    }

    handleOpenPopup(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-activity',
        isOpen: true
      })
    }

    handleDeleteAllActivity(): void {
      apiActivity.deleteAllActivity().then(() => {
        let message: any = this.$i18n.t('notify.delete-success')
        this.$message.success({ message, duration: 5000 })
        this.dataTable = filter(this.dataTable, elm => elm.sourceType !== 'WEB')
        this.dataTable.push(this.activityWebCurent)
      })
    }
  }
</script>

<style scoped lang="scss">
  .setting-activity-mobile {
    background: var(--bc-color-white);
    padding: 24px 20px;
    box-shadow: var(--bc-box-shadow);
    border-radius: 0 0 4px 4px;
    .title-box {
      color: var(--bc-text-primary);
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }
    .discription {
      color: var(--bc-text-discript);
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      margin-top: 12px;
      margin-bottom: 24px;
    }

    ::v-deep.base-table .el-table__header-wrapper .el-table__header thead th {
      padding: 14px 0;
    }

    ::v-deep.base-table .el-table__header-wrapper .el-table__header thead th .cell {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: #0a0b0d;
    }
    ::v-deep.base-table td {
      padding: 14px 0 !important;
    }
    ::v-deep.el-table td.el-table__cell .cell {
      white-space: nowrap;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #0a0b0d;
    }
    ::v-deep.el-table--scrollable-x .el-table__body-wrapper {
      overflow-x: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    ::v-deep.el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar {
      display: none;
    }
    .link {
      color: var(--bc-btn-bg-default-hover);
      cursor: pointer;
    }
    .hr {
      width: 100%;
      border-top: 1px solid var(--bc-input-border);
      margin: 32px 0;
    }
    .box-mobile-app,
    .box-sessions {
      .action {
        color: var(--bc-text-discript);
        &:hover {
          color: var(--bc-btn-bg-default);
        }
        &:focus {
          color: var(--bc-btn-bg-default);
        }
        &:active {
          color: var(--bc-btn-bg-default);
        }
      }
    }
  }
</style>
