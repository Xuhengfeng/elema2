<template>
<div class="shopcart-wrapper">
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}" ></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}</div>
				<div class="desc">另需配送费¥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
		</div>
		<!-- 小球容器 -->
		<div class="ball-container">
			 <div v-for="ball in balls">
	  			<!-- 过度钩子函数 -->
				<transition name="drop"
				    v-on:before-enter="beforeDrop" 		 
	  				v-on:enter="dropping"
	  				v-on:after-enter="afterDrop"
	  			>
					<div v-show="ball.show" class="ball">
					    <!--  外层纵向运动，内层横向运动-->
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>
		<transition name="fold">
			<!--购物车详情-->
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>¥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">			
								<!--安装按钮子组件(一般外层再嵌套一层包裹层用于布局)-->
								<cartcontrol :food="food" @cartAdd="drop"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
	</div>
	<transition name="move">	
		<!--背景阴影层-->
		<div class="list-mask" v-show="listShow"></div>
	</transition>
</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from "better-scroll";//导入node_modules的依赖模块,直接写,不需要一层一层的文件夹查找;
	import cartcontrol from "../cartcontrol/cartcontrol";//导入控制按钮组件
	
	export default{
		props:{
			selectFoods:{
				type:Array,
				default:function(){
					return [
						{
							price:10,
							count:0,
						}
					];
				}
			},
			deliveryPrice:{
				type:Number,
				default:0,
			},
			minPrice:{//配送价
				type:Number,
				default:0,
			}
		},
		data:function(){
			return {
				// 创建5个小球用于动画
                balls:[{show:false},{show:false},{show:false},{show:false},{show:false}],
                dropBalls:[], // 存储下落小球
				fold:true,//折叠
			}
		},
		computed:{
			totalPrice:function(){
				let total=0;
				this.selectFoods.forEach((food,index)=>{//food 代表的是每一个子对象
					total+=food.price*food.count;
				});
				return total;
			},
			totalCount:function(){
				let count=0;
				this.selectFoods.forEach((food)=>{
					count+=food.count;
				})
				return count;
			},
			payDesc:function(){
				if(this.totalPrice===0){
					return '¥'+this.minPrice+'元起送';
				}else if(this.totalPrice<this.minPrice){
					let diff=this.minPrice-this.totalPrice;
					return '还差¥'+diff+'元起送';
				}else{
					return '去结算'
				}
			},
			payClass:function(){
				if(this.totalPrice<this.minPrice){
					return 'not-enough';
				}else{
					return 'enough';
				}
				
			},
			listShow:function(){
				if(!this.totalCount){
					this.fold=true;
					return false;
				}
				let show=!this.fold;
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll){
							this.scroll=new BScroll(this.$refs.listContent,{
								click:true,
							});
						}else{
							this.scroll.refresh();
						}
					})
				}
				return show;
			}
		},
		methods:{
			drop:function(el){ //触发一次事件就会将所有小球进行遍历
				console.log(el)
				for(let i=0;i<this.balls.length;i++){
					let ball=this.balls[i];
					if(!ball.show){//将false的小球放到dropBalls
						ball.show=true;
						ball.el=el;//设置小球的el属性为一个dom对象
						this.dropBalls.push(ball);
						return console.log(this.dropBalls);
					}
				}
			},
			beforeDrop:function(el){ //这个方法的执行是因为这是一个vue的监听事件
		        let count=this.balls.length;
		        while(count--){
		          let ball=this.balls[count];
		          if (ball.show){
		            let rect=ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
		            let x=rect.left-32;
		            let y=-(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
		            el.style.display=''; //清空display
		            el.style.webkitTransform=`translate3d(0,${y}px,0)`; 
		            el.style.transform=`translate3d(0,${y}px,0)`;
		            //处理内层动画
		            let inner=el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
		            inner.style.webkitTransform=`translate3d(${x}px,0,0)`;
		            inner.style.transform=`translate3d(${x}px,0,0)`;
		          }
		        }
		     },
			dropping:function(el,done){//这个方法的执行是因为这是一个vue的监听事件
				let rf=el.offestHeight;//触发重绘html
				this.$nextTick(()=>{//让动画效果异步执行,提高性能
			   		el.style.webkitTransform='translate3d(0,0,0)';
			   		el.style.transform='translate3d(0,0,0)';
			   		//处理内层动画
			   		let inner=el.getElementsByClassName('inner-hook')[0];//使用inner-hook类来单纯被js操作
					inner.style.webkitTransform='translate3d(0,0,0)';
			   		inner.style.transform='translate3d(0,0,0)';	
			   		el.addEventListener('transitionend', done);//Vue为了知道过渡的完成，必须设置相应的事件监听器。
				})
				console.log(2)
			},
			afterDrop:function(el){//这个方法的执行是因为这是一个vue的监听事件
				let ball=this.dropBalls.shift();//完成一次动画就删除一个dropBalls的小球
				if(ball){
					ball.show=false;
					el.style.display='none';//隐藏小球
					el.style.background='';//隐藏小球颜色
				}
				console.log(3)
			},
			toggleList:function(){
				if(!this.totalCount){
					return;
				}
				this.fold=!this.fold;
			},
			empty:function(){
				this.selectFoods.forEach((food)=>{
					food.count=0;
				})
			},
			pay:function(){
				if(this.totalPrice<this.minPrice){
					return;
				}
				window.alert(`支付${this.totalPrice}元`)
			}
		},
		components:{
			cartcontrol:cartcontrol,
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";
	@import "../../common/scss/icon.scss";
	.shopcart{
		position:fixed;
		left:0;
		bottom:0;
		z-index:50;
		width:100%;
		height:48px;
		.content{
			display:flex;
			background:#141d27;
			font-size:0;
			color:rgba(255,255,255,0.4);	
			.content-left{
				flex:1;
				.logo-wrapper{
					display:inline-block;
					position:relative;
					vertical-align:top;
					top:-10px;
					margin:0 12px;
					padding:6px;
					width:56px;
					height:56px;
					box-sizing:border-box;
					border-radius:50%;
					background:#141d27;
					.logo{
						text-align:center;
						width:100%;
						height:100%;
						border-radius:50%;
						background:#2b343c;
						.icon-shopping_cart{
							line-height:44px;
							font-size:24px;
							color:#80858a;
							&.highlight{
								color:#fff;
							}
						}
						&.highlight{
							background:rgb(0,160,220);
						}
					}
					.num{
						position:absolute;
						top:0;
						right:0;
						width:24px;
						height:16px;
						line-height:16px;
						text-align:center;
						border-radius:16px;
						font-size:9px;
						font-weight:700;
						color:#fff;
						box-shadow:0 4px 8px 0 rgba(0,0,0,0.4);
						background:rgb(240,20,20);
					}
				}
				.price{
					display:inline-block;
					vertical-align:top;
					box-sizing:border-box;
					margin-top:12px;
					line-height:24px;
					padding-right:12px;
					border-right:1px solid rgba(255,255,255,0.1);
					font-size:16px;
					font-weight:700;		
					&.highlight{
						color:#fff;
					}		
				}
				.desc{
					display:inline-block;
					vertical-align:top;
					margin:12px 0 0 12px;
					line-height:24px;
					font-size:10px;
				}
			}
			.content-right{
				flex:0 0 105px;
				width:105px;
				.pay{
					height:48px;
					line-height:48px;
					text-align:center;
					font-size:12px;
					font-weight:700;
					&.not-enough{
						background:#2b333b;
					}
					&.enough{
						background:#00b43c;
						color:#fff;
					}
				}
			}
		}
		.ball-container{
			.ball{
				position:fixed;
				left:32px;
				bottom:22px;
				z-index:200;
				/* y 轴 贝塞尔曲线*/
				transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
				/*内从做横向运动*/
				.inner{
					width:16px;
					height:16px;
					border-radius:50%;
					background:rgb(0,160,220);
					/*x 轴只需要线性缓动*/
					transition:all 0.4s linear;
				}
			}
		}
		.shopcart-list{
			position:absolute;
			transform:translate3d(0,-100%,0);
			left:0;
			top:0;
			z-index:-1;
			width:100%;
			&.fold-enter-active,&.fold-leave-active{
			  transition: all .5s linear;
			  opacity:1;
			}
			&.fold-enter,&.fold-leave-to{
			  transform:translate3d(0,0,0);
			  opacity: 0;
			}
			.list-header{
				height:40px;
				line-height:40px;
				padding:0 18px;
				background:#f3f5f7;
				border-bottom:1px solid rgba(7,17,27,0.1);
				.title{
					float:left;
					color:rgb(7,17,27);
					font-size:14px;
				}
				.empty{
					float:right;
					font-size:12px;
					color:rgb(0,160,220);
				}
			}
			.list-content{
				padding:0 18px;
				max-height:217px;
				overflow:hidden;
				background:#fff;
				.food{
					position:relative;
					padding:12px 0;
					box-sizing:border-box;
					@include border-1px(rgba(7,17,27,0.1));
					.name{
						line-height:24px;
						font-size:14px;
						color:rgb(7,17,27);
					}
					.price{
						position:absolute;
						right:90px;
						bottom:12px;
						line-height:24px;
						font-size:14px;
						font-weight:700;
						color:rgb(240,20,20)
					}
					.cartcontrol-wrapper{
						position:absolute;
						right:0;
						bottom:6px;
					}
				}
			}
		}
	}
	.list-mask{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		z-index:40;
		background:rgba(7,17,27,0.6);

	}
</style>