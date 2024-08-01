<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    @edit="handleTabsEdit"
    :closable="true"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
      <component :is="item.component" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, watch, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Dashboard from '../components/dashboard.vue'
import StaticOverview from '../views/staticOverview.vue'
import ExamOnline from '../views/examOnline/examOnline.vue'
import MyGrade from '../views/examOnline/myGrade.vue'
import MyQuestionBank from '../views/examOnline/myQuestionBank.vue'
import QuestionBankManage from '../views/examManage/questionBankManage.vue'
import QuestionManage from '../views/examManage/questionManage.vue'
import ExamManage from '../views/examManage/examManage.vue'
import MarkManage from '../views/examManage/markManage.vue'
import NoticeManage from '../views/system/noticeManage.vue'
import RoleManage from '../views/system/roleManage.vue'
import UserManage from '../views/system/userManage.vue'

const route = useRoute()
const router = useRouter()

const getComponentByName = (name: string) => {
  switch (name) {
    case 'dashboard':
      return markRaw(Dashboard)
    case 'staticOverview':
      return markRaw(StaticOverview)
    case 'examOnline':
      return markRaw(ExamOnline)
    case 'myGrade':
      return markRaw(MyGrade)
    case 'myQuestionBank':
      return markRaw(MyQuestionBank)
    case 'questionBankManage':
      return markRaw(QuestionBankManage)
    case 'questionManage':
      return markRaw(QuestionManage)
    case 'examManage':
      return markRaw(ExamManage)
    case 'markManage':
      return markRaw(MarkManage)
    case 'noticeManage':
      return markRaw(NoticeManage)
    case 'roleManage':
      return markRaw(RoleManage)
    case 'userManage':
      return markRaw(UserManage)
    default:
      return
  }
}

const editableTabsValue = ref(route.path)
const editableTabs = ref([
  {
    title: '产品介绍',
    name: '/home/dashboard',
    component: markRaw(Dashboard),
    closable: false
  }
])

const handleTabsEdit = (
  targetName: string | undefined,
  action: 'remove' | 'add'
) => {
  if (action === 'remove') {
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }

    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
    router.push(activeName)
  }
}

watch(
  () => route.path,
  (newPath) => {
    const existingTab = editableTabs.value.find(tab => tab.name === newPath)
    const component = getComponentByName(route.name as string)
    if (existingTab) {
      existingTab.component = component // 更新已有标签页的组件
    } else {
      const newTab = {
        title: route.meta.title || 'New Tab',
        name: newPath,
        component,
        closable: true
      }
      editableTabs.value.push(newTab)
    }
    editableTabsValue.value = newPath
  },
  { immediate: true }
)

watch(editableTabsValue, (newValue) => {
  router.push(newValue)
})
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
