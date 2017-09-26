<template>
	<div class="cartcontrol">
		<transition name="slide-fade">
			<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart">
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart">
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';
	export default{
		props:{
			food:{
				type:Object
			},		
		},
		methods:{
			addCart:function(event){//点击添加
				this.$emit("cartAdd",event.target);//当前的子组件发射一个事件我们自定义叫做cartAdd事件,之后在父组件上绑定一个监听回调函数drop方法掉落小球
				//去派发父组件上调用方法,父组件再调用其他子组件方法;
				if(!event._constructed){
					return;
				}
				if(!this.food.count){
					Vue.set(this.food,'count',1);
				}else{
					this.food.count++;
				}
			},
			decreaseCart:function(event){//点击减少
				if(!event._constructed){
					return;
				}
				if(this.food.count){
					this.food.count--;
				}
			},

		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";
	@import "../../common/scss/icon.scss";

	.cartcontrol{
		font-size:0;
		.slide-fade-enter-active {
		  transition: all .3s ease;
		}
		.slide-fade-leave-active {
		  opacity:1;
		  transform:translate3D(0,0,0) rotate(360deg);
		  transition: all .8s linear;
		}
		.slide-fade-enter,.slide-fade-leave-to
		 {
		  transform:translate3D(10px,0,0) rotate(360deg);
		  opacity: 0;
		}
		.cart-decrease{
			display:inline-block;
			line-height:24px;
			font-size:24px;
			padding:6px;
			color:rgb(0,160,220);
			transition:all 0.4s linear;
		}
		.cart-count{
			display:inline-block;
			vertical-align:top;
			padding-top:6px;
			line-height:24px;
			font-size:10px;
			color:rgb(147,153,159);
		}
		.cart-add{
			display:inline-block;
			line-height:24px;
			font-size:24px;
			padding:6px;
			color:rgb(0,160,220);
		}
	}
</style>