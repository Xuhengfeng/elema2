<template>
	<!--这是app入口组件(总组件)-->
  <div>
		<v-header :seller="seller"></v-header>
		<div class="tab">
			<div class="tab-item"><router-link to="/goods">商品</router-link></div>
			<div class="tab-item"><router-link to="/ratings">评论</router-link></div>
			<div class="tab-item"><router-link to="/seller">商家</router-link></div>
		</div>
		<router-view :seller="seller">
			<!--这块	区域相当于每个路由下面存放每个大的子组件的区域-->
			<!--大的子组件下面又可以创建小的子组件 无限下去-->
		</router-view>
  </div>
</template>

<script>
	//导入组件
	import header from './components/header/header.vue';
	export default {//导出组件 到 视图index.html
			data:function(){
				return {
					seller:{},
				}
			},
			created:function(){//创建 的 钩子函数 成功实例之后触发第一个函数
				console.log(this)
				this.$http.get('/api/seller').then(response=>{
					this.someData=response.body;	
					this.seller=this.someData.data;					
				},response=>{
					//error callback
				});
			},
			components:{
				'v-header':header
			}
	}
</script>

<style lang="scss">
	@import "./common/scss/base.scss";
.tab{
	display:flex;
	width:100%;
	height:40px;
	line-height:40px;
	.tab-item{
		flex:1;
		text-align:center;
		&>a{
			display:block;
			font-size:14px;
			color:rgb(77,85,93);
			&.active{
				color:rgb(240,20,20);
			}
		}
	}
}

</style>
