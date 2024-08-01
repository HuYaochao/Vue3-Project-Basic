<template>
  <div class="static-overview">
    <h1>考试统计</h1>
    <div v-if="dataLoaded">
      <el-card class="chart-card">
        <h2>考试次数 - 条形图</h2>
        <div ref="examNumbersBarChart" style="width: 550px; height: 250px;"></div>
      </el-card>
      <el-card class="chart-card">
        <h2>考试通过率 - 基础面积图</h2>
        <div ref="passRateAreaChart" style="width: 550px; height: 250px;"></div>
      </el-card>
      <el-card class="chart-card">
        <h2>考试次数 - 饼图</h2>
        <div ref="examNumbersPieChart" style="width: 550px; height: 250px;"></div>
      </el-card>
      <el-card class="chart-card">
        <h2>考试通过率 - 散点图</h2>
        <div ref="passRateScatterChart" style="width: 550px; height: 250px;"></div>
      </el-card>
    </div>
    <div v-else>
      <p>数据加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import $http from '../stores/http' // 引入配置好的 Axios 实例

const examItems = ref<string[]>([])
const passRateItems = ref<string[]>([])
const dataLoaded = ref(false)

const examNumbersBarChart = ref(null)
const passRateAreaChart = ref(null)
const examNumbersPieChart = ref(null)
const passRateScatterChart = ref(null)

const fetchData = async () => {
  try {
    // 获取考试次数
    const examNumbersResponse = await $http.get('/teacher/getExamNumbers')
    console.log('examNumbersResponse.data:', examNumbersResponse.data)

    if (examNumbersResponse.data.code === 200) {
      examItems.value = examNumbersResponse.data.data
    } else {
      throw new Error('考试次数获取失败')
    }

    // 获取考试通过率
    const passRateResponse = await $http.get('/teacher/getExamPassRate')
    console.log('passRateResponse.data:', passRateResponse.data)

    if (passRateResponse.data.code === 200) {
      passRateItems.value = passRateResponse.data.data
    } else {
      throw new Error('考试通过率获取失败')
    }

    dataLoaded.value = true

    // 验证 token
    console.log('检查 token 是否有效...')
    await $http.get('/common/checkToken')
    console.log('Token 验证成功')

    // 绘制图表
    await nextTick()
    drawCharts()

  } catch (error) {
    console.error('获取数据失败', error)
    dataLoaded.value = true
  }
}

const drawCharts = () => {
  if (examNumbersBarChart.value && passRateAreaChart.value && examNumbersPieChart.value && passRateScatterChart.value) {
    const examNumbersBarChartInstance = echarts.init(examNumbersBarChart.value)
    const passRateAreaChartInstance = echarts.init(passRateAreaChart.value)
    const examNumbersPieChartInstance = echarts.init(examNumbersPieChart.value)
    const passRateScatterChartInstance = echarts.init(passRateScatterChart.value)

    const examNumbersBarOption = {
      
      tooltip: {},
      xAxis: {
        data: examItems.value[0].split(',')
      },
      yAxis: {},
      series: [{
        name: '次数',
        type: 'bar',
        data: examItems.value[1].split(',').map(Number)
      }]
    }

    const passRateAreaOption = {
      
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: passRateItems.value[0].split(',')
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '通过率',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: passRateItems.value[1].split(',').map(Number)
      }]
    }

    const examNumbersPieOption = {
      
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '次数',
          type: 'pie',
          radius: '50%',
          data: examItems.value[0].split(',').map((name, index) => ({
            name,
            value: examItems.value[1].split(',')[index]
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    const passRateScatterOption = {
      xAxis: {
        type: 'category',
        data: passRateItems.value[0].split(',')
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '通过率',
        type: 'scatter',
        data: passRateItems.value[1].split(',').map(Number)
      }]
    }

    examNumbersBarChartInstance.setOption(examNumbersBarOption)
    passRateAreaChartInstance.setOption(passRateAreaOption)
    examNumbersPieChartInstance.setOption(examNumbersPieOption)
    passRateScatterChartInstance.setOption(passRateScatterOption)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.static-overview {
  padding: 20px;
  display:inline-block;
  gap: 20px;
}

.chart-card {
  width: 600px;
  height: 300px;
  display:inline-block;
  margin-left:100px ;
  margin-top: 30px;
}

.chart-card h2 {
  text-align: center;
}
.box{

}
</style>
