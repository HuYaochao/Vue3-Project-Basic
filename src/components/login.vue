<template>
  <!-- 表单组件 -->
  <div class="form-container">
    <el-card class="card">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <h1>vue考试系统</h1>
        <!-- 账号输入框 -->
        <el-form-item label="账&nbsp&nbsp&nbsp号" prop="username" class="el-input">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item label="密&nbsp&nbsp&nbsp码" prop="password" class="el-input">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off"/>
        </el-form-item>
        <!-- 验证码输入框 -->
        <el-form-item label=" &nbsp&nbsp验证码" prop="captcha" class="el-input">
          <el-input v-model="ruleForm.captcha"   style="width: 160px;"/>
          <img :src="captchaUrl" @click="fetchCaptcha" alt="验证码" class="captcha-img" style="margin-left: 25px;"/>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item style="text-align: center;margin-left: 120px;" >
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
          <el-button @click="registerForm(ruleFormRef)">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const $http = inject('$http')
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const captchaUrl = ref<string>('')
const captchaCode = ref<string>('')
// 获取验证码
const fetchCaptcha = async () => {
  try {
    const imageResponse = await $http.get('/util/getCodeImg', { responseType: 'blob' })
    captchaUrl.value = URL.createObjectURL(imageResponse.data)
    const textResponse = await $http.get('/util/getCode')
    captchaCode.value = textResponse.data.message
  } catch (error) {
    console.error('获取验证码失败', error)
  }
}

// 初始化时获取验证码
onMounted(fetchCaptcha)

// 验证账号
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

// 验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

// 验证验证码
const validateCaptcha = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else if (value.toLowerCase() !== captchaCode.value.toLowerCase()) {
    callback(new Error('验证码错误'))
    console.log(captchaCode.value);
    
  } else {
    callback()
  }
}
const ruleForm = reactive({
  username: '',
  password: '',
  captcha: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 使用 FormData 创建表单数据
        const formData = new FormData()
        formData.append('username', ruleForm.username)
        formData.append('password', ruleForm.password)

        // 调试：输出请求数据
        console.log('提交数据:', {
          username: ruleForm.username,
          password: ruleForm.password,
        })

        const response = await $http.post('/common/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log('登录成功!', response.data)

        // 保存 authorization 到 localStorage
        localStorage.setItem('authorization', response.data.data)

        // 跳转到 /home/dashboard
        router.push('/home/dashboard')
      } catch (error) {
        console.error('登录失败!', error)
        if (error.response) {
          // 调试：输出后端返回的错误信息
          console.error('后端返回错误信息:', error.response.data)
        }
      }
    } else {
      console.log('登录失败!')
    }
  })
}

const registerForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  router.push('/register') 
}
</script>

<style scoped lang="less">
h1{
  text-align: center;
  font-family: 'ZCOOLYaoYao', sans-serif;
  font-size: 3rem; /* 根据需要调整字体大小 */
  font-weight: bold; /* 设置粗体 */
  background: linear-gradient(45deg, #f06, #ff9); /* 渐变色背景 */
  -webkit-background-clip: text; /* 使背景颜色应用到文本 */
  color: transparent; /* 使文本本身透明 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 可选：增加阴影效果 */

}


.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../img/bg.jpeg'); /* 设置背景图片的路径 */
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中显示 */
}
.el-input{
   background: rgba(255, 255, 255, 0.3);
   backdrop-filter: blur(10px); /* 模糊效果 */
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 可选：增加阴影 */
   border-radius: 5px;
}

.card {
  width: 400px;
  padding: 20px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.3); /* 半透明背景色 */
  backdrop-filter: blur(10px); /* 模糊效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 可选：增加阴影 */
}

.captcha-img {
  cursor: pointer;
}
</style>
