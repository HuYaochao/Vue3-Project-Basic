<template>
  <el-col :span="24">
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
      text-color="#fff" @open="handleOpen" @close="handleClose" :collapse="collapsed">
      <el-menu-item index="0">
        <router-link :to="{ path: '/home/dashboard' }" class="custom-router-link" style="font-weight: 600">
          <el-icon>
            <DocumentCopy />
          </el-icon></router-link>
        <span>
          <router-link :to="{ path: '/home/dashboard' }" class="custom-router-link" style="font-weight: 600">考 试 管 理 系
            统</router-link>
        </span>
      </el-menu-item>
      <!-- Menu Items -->
      <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
        <router-link :to="item.path" class="custom-router-link" style="font-weight: 600">
          <el-icon>
            <!-- 使用具体的图标组件 -->
            <component :is="item.icon" />
          </el-icon>
        </router-link>
        <span>
        <router-link :to="item.path" class="custom-router-link" style="font-weight: 600">
          {{ item.title }}
        </router-link>
        </span>
      </el-menu-item>

      <!-- Sub Menus -->
      <el-sub-menu v-for="submenu in subMenus" :key="submenu.index" :index="submenu.index">
        <template #title>
          <el-icon>
            <!-- 使用具体的图标组件 -->
            <component :is="submenu.icon" />
          </el-icon>
          <span>{{ submenu.title }}</span>
        </template>
        <el-menu-item v-for="subitem in submenu.items" :key="subitem.index" :index="subitem.index">
          <router-link :to="subitem.path" class="custom-router-link">{{
            subitem.title
          }}</router-link>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-col>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  DocumentCopy,
  Menu as IconMenu,
  Tickets,
  Basketball,
  Histogram,
  Tools,
  Bell,
} from "@element-plus/icons-vue";

import $http from "../stores/http";

const isCollapse = ref(true);

const router = useRouter();

const defaultActive = ref("1");
const menuItems = ref([]);
const subMenus = ref([]);

// 定义父组件传递过来数据
defineProps({
  collapsed: {
    type: Boolean,
  },
});

const fetchCurrentUser = async () => {
  try {
    const response = await $http.get("/common/getCurrentUser");
    return response.data.data;
  } catch (error) {
    console.error("获取用户信息失败", error);
    return null;
  }
};

const fetchMenu = async () => {
  try {
    const response = await $http.get("/common/getMenu");
    // console.log('API 响应:', response)  // 添加调试信息

    // 解析字符串为 JSON 对象
    const menuData = JSON.parse(response.data.data);
    // console.log('解析后的菜单数据:', menuData)  // 添加调试信息

    // 确保返回的是数组
    return Array.isArray(menuData) ? menuData : [];
  } catch (error) {
    console.error("获取菜单权限失败", error);
    return [];
  }
};

const buildMenu = (menuData) => {
  const items = [];
  const subMenusArray = [];

  menuData.forEach((item) => {
    const pathPrefix = "/home"; // 添加路径前缀

    if (item.submenu && item.submenu.length > 0) {
      subMenusArray.push({
        index: `submenu-${item.topMenuName}`,
        title: item.topMenuName || "考 试 管 理 系 统", // 如果没有标题，使用默认值
        icon: getIcon(item.topIcon),
        items: item.submenu.map((subItem) => ({
          index: subItem.url,
          path: `${pathPrefix}${subItem.url}`, // 添加路径前缀
          title: subItem.name,
          icon: getIcon(subItem.icon),
        })),
      });
    } else {
      items.push({
        index: item.url,
        path: `${pathPrefix}${item.url}`, // 添加路径前缀
        title: item.topMenuName || "考 试 管 理 系 统", // 如果没有标题，使用默认值
        icon: getIcon(item.topIcon),
      });
    }
  });

  menuItems.value = items;
  subMenus.value = subMenusArray;
};
const getIcon = (iconName) => {
  switch (iconName) {
    case "el-icon-menu":
      return Bell;
    case "el-icon-bangzhu":
      return Tickets;
    case "el-icon-pie-chart":
      return Basketball;
    case "el-icon-data-line":
      return Histogram;
    case "el-icon-setting":
      return Tools;
    // Add cases for other icons as needed
    default:
      return IconMenu;
  }
};

onMounted(async () => {
  const currentUser = await fetchCurrentUser();
  if (currentUser) {
    const menuData = await fetchMenu();
    // console.log('fetchMenu 返回的数据:', menuData)  // 添加调试信息
    if (Array.isArray(menuData)) {
      buildMenu(menuData);
    } else {
      console.error("获取的菜单数据不是数组:", menuData);
      console.log("menuData 的类型:", typeof menuData); // 添加调试信息
    }
  } else {
    router.push("/login");
  }
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu {
  background-color: @menuBg;
  min-height: 400px;
  height: 100vh;
  border-right: none;
}

.logo {
  width: 100%;
  height: 60px;
  background-color: @menuBg;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
}

.custom-router-link {
  text-decoration: none;
  /* 去除下划线 */
  color: inherit;
  /* 继承父元素的颜色 */
}

/* 如果需要设置特定的颜色 */
.custom-router-link:hover {
  color: #ffd04b;
  /* 悬停时的颜色 */
}
</style>
