import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import Dashboard from "../components/dashboard.vue";
import Login from "../components/login.vue";
import Register from "../components/register.vue";

import StaticOverview from "../views/staticOverview.vue";

import ExamOnline from "../views/examOnline/examOnline.vue";
import MyGrade from "../views/examOnline/myGrade.vue";
import MyQuestionBank from "../views/examOnline/myQuestionBank.vue";

import QuestionBankManage from "../views/examManage/questionBankManage.vue";
import QuestionManage from "../views/examManage/questionManage.vue";
import ExamManage from "../views/examManage/examManage.vue";
import MarkManage from "../views/examManage/markManage.vue";

import NoticeManage from "../views/system/noticeManage.vue";
import RoleManage from "../views/system/roleManage.vue";
import UserManage from "../views/system/userManage.vue";
import NotFound from "./NotFound.vue";
import AddExam from "../components/AddExam.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/home",
      component: Home,
      redirect: "/home/dashboard",
      children: [
        {
          path: "dashboard",
          component: Dashboard,
          props: true,
          meta: { title: "产品介绍" },
        },
        {
          path: "staticOverview",
          component: StaticOverview,
          props: true,
          meta: { title: "统计总览" },
        },
        {
          path: "examOnline",
          component: ExamOnline,
          props: true,
          meta: { title: "在线考试" },
        },
        {
          path: "myGrade",
          component: MyGrade,
          props: true,
          meta: { title: "我的成绩" },
        },
        {
          path: "myQuestionBank",
          component: MyQuestionBank,
          props: true,
          meta: { title: "我的题库" },
        },
        {
          path: "questionBankMange",
          component: QuestionBankManage,
          props: true,
          meta: { title: "题库管理" },
        },
        {
          path: "questionManage",
          component: QuestionManage,
          props: true,
          meta: { title: "试题管理" },
        },
        {
          path: "examManage",
          component: ExamManage,
          props: true,
          meta: { title: "考试管理" },
        },
        {
          path: "examManage/addExam",
          component: AddExam,
          props: true,
          meta: { title: "添加考试" },
        },
        {
          path: "markManage",
          component: MarkManage,
          props: true,
          meta: { title: "阅卷管理" },
        },
        {
          path: "noticeManage",
          component: NoticeManage,
          props: true,
          meta: { title: "公告管理" },
        },
        {
          path: "roleManage",
          component: RoleManage,
          props: true,
          meta: { title: "角色管理" },
        },
        {
          path: "userManage",
          component: UserManage,
          props: true,
          meta: { title: "用户管理" },
        },
      ],
    },

    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

export default router;
