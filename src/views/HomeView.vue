<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧方导航栏 -->
      <el-aside :style="'width:' + autowidth">
        <Menu :collapsed="collapsed" />
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <!-- 侧方导航栏搜索展开 -->
          <el-icon
            style="font-size: 30px;display: inline-block;float: left;margin-top: 15px;"
            @click="
              () => {
                collapsed = !collapsed;
              }
            "
          >
            <component :is="collapsed ? CaretRight : CaretLeft"></component>
          </el-icon>
          <!-- 头部步骤页 -->
          <Bar style="display: inline-block;margin-left: 20px;float: left;margin-top:19px;"></Bar>

          <!-- admin下拉列表 -->
           <el-dropdown @command="handleCommand" class="drop-list">
           <span class="el-dropdown-link">
            {{ username }}
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
           </span>
           <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile"  @click="openProfileDialog">个人资料</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
           </template>
           </el-dropdown>

          <!-- 头部-全屏按钮 -->
          <button @click="toggleFullscreen " class="Fullscreen">
            <el-icon style="font-size: 20px;"><FullScreen /></el-icon>
          </button>
          <!-- 通知 -->
           <el-button @click="visible = true" class="icon-button">
           <el-icon style="font-size: 20px;"><Bell /></el-icon>
           </el-button>
          

        </el-header>
        <!-- main -->
        <el-main><RouterView /></el-main>
        <!-- footer -->
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </div>

  <!-- Dialog with customized header -->
           <el-dialog v-model="visible" :show-close="false" width="500">
            <template #header="{ close, titleId, titleClass }">
              <div class="my-header">
                <h4 :id="titleId" :class="titleClass">最新公告</h4>
                <el-button type="danger" @click="close">
                  <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
                  Close
                </el-button>
              </div>
            </template>
            <div>
              最新公告 注意不可以删除管理员账号,也就是admin
            </div>
            
           </el-dialog>
           
<!-- 更新用户信息 -->
    <el-dialog v-model="dialogVisible" title="更新用户信息" style="width: 500px;border-radius: 3%;">
    <el-form
      ref="profileFormRef"
      :model="profileForm"
      status-icon
      :rules="profileRules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profileForm.username" readonly />
      </el-form-item>
      <el-form-item label="真实姓名" prop="trueName">
        <el-input v-model="profileForm.trueName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="profileForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="profileForm.checkPassword" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left: 45%;">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitProfileForm">确定</el-button>
    </div>
  </el-dialog>
  
</template>

<script setup lang="ts">
import Menu from "../components/Menu.vue";
import Bar from "../components/bar.vue";
import { CaretLeft, CaretRight } from "@element-plus/icons-vue";
import { ref, computed , onMounted,reactive } from "vue";
import { Bell, CircleCloseFilled, ArrowDown } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import $http from '../stores/http'

const visible = ref(false)
// 定义菜单按钮收缩展开效果
const collapsed = ref<boolean>(false);
// 创建一个响应式变量用于存储用户名
const username = ref<string>('');
// 用户信息表单
const dialogVisible = ref(false)
const profileFormRef = ref<FormInstance>()

const profileForm = reactive({
  username: '',
  trueName: '',
  password: '',
  checkPassword: ''
})

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (profileForm.checkPassword !== '') {
    if (!profileFormRef.value) return
    profileFormRef.value.validateField('checkPassword')
  }
  callback()
}

const validateCheckPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== profileForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const profileRules = reactive<FormRules<typeof profileForm>>({
  trueName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }]
})

const openProfileDialog = async () => {
  try {
    const response = await $http.get('/common/getCurrentUser')
    const userData = response.data.data
    
    
    profileForm.username = userData.username
    profileForm.trueName = userData.trueName
    console.log(profileForm);
    
    dialogVisible.value = true
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
}


const submitProfileForm = async () => {
  if (!profileFormRef.value) return
  profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await $http.post('/common/updateCurrentUser', {
          trueName: profileForm.trueName,
          password: profileForm.password
        })
        dialogVisible.value = false
        console.log('User info updated successfully')
      } catch (error) {
        console.error('Failed to update user info:', error)
      }
    } else {
      console.log('Form validation failed')
    }
  })
}
// 定义侧边栏宽度
const autowidth = computed(() => {
  if (collapsed.value) {
    return "64px";
  } else {
    return "200px";
  }
});

// 全屏模式
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏模式
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("无法进入全屏模式:", err)
    })
  } else {
    // 退出全屏模式
    document.exitFullscreen().catch((err) => {
      console.error("无法退出全屏模式:", err)
    })
  }
}

onMounted(async() => {
  // 页面加载后自动显示对话框
  visible.value = true;
  try {
    const response = await $http.get('/common/getCurrentUser');
    // console.log('API 响应:', response); // 打印完整的响应对象
    username.value = response.data.data.username;
    // console.log('当前用户名:', username.value); // 打印获取的用户名
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
})

// 用户
const router = useRouter()

const handleCommand =async (command: string) => {
  if (command === 'profile') {
    // Handle profile action here
     await openProfileDialog()
  } else if (command === 'logout') {
    // Remove authorization from local storage
    localStorage.removeItem('authorization')
    // Redirect to login page
    router.push('/login')
  }
}

</script>

<style scoped lang="less">
.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.el-container {
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  // text-align: center;
  line-height: 80px;
}

.el-aside {
  background-color: @menuBg;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  overflow: hidden;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
// 全屏
.Fullscreen{
  float:right;
  margin-top: 20px;
  border: none; 
  background: none; 
  padding: 0; 
  cursor: pointer;
  outline: none; 
}
// 通知

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.icon-button {
  float:right;
  margin-top: 15px;
  margin-right: 20px;
  border: none; 
  background: none; 
  padding: 0; 
  cursor: pointer;
  outline: none; 
}

.icon-button .el-icon {
  width: 24px; 
  height: 24px;
}

// 下拉列表
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  float: right;
}
.drop-list{
  float:right;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 20px;
  border: none; 
  background: none; 
  padding: 0; 
  cursor: pointer;
  outline: none; 
}
</style>
