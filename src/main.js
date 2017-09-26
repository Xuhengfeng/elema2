// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//入口文件的 js 逻辑，在 webpack 打包之后将被注入到 index.html 中
//导入js模块或者vue组件
import Vue from 'vue';
import VueRouter from 'vue-router';//导入第三方路由插件
import VueResource from 'vue-resource';//导入第三方api数据交互插件
import App from './App';
import goods from './components/goods/goods';//导入自定义组件
import ratings from './components/ratings/ratings';//导入自定义组件
import seller from './components/seller/seller';//导入自定义组件


Vue.use(VueRouter);//全局安装路由功能
Vue.use(VueResource);//全局安装api数据交互功能

/* eslint-disable no-new */

//路由 
const routes=[
	{
		path:'/',
		redirect:'/goods',//重定向 ,多写一个指向目标组件;
		name:'商品页',
		component:goods
	},
	{
		path:'/goods',
		name:'商品页',
		component:goods
	},
	{
		path:'/ratings',
		name:'评价页',
		component:ratings
	},
	{
		path:'/seller',
		name:'商家页',
		component:seller
	},
]

//创建路由实例
const router=new VueRouter({
	routes:routes,
	linkActiveClass:'active'//自定义 活动的class
});
//router.push('/goods');导航式重定向, 上面已经有啦路由重定向,就不需要再重定向了

const app=new Vue({//根实例
	el:'#app',//挂载对象
	template:'<App/>',//根模板
	components:{ 
		App:App,//根组件(最大的那个组件:其他子组件都 安装到它下面)所有的子组件都将在这里被引用
	},
	router:router,//配置路由对象
})


