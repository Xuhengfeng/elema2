<template>
<div class="goods-wrapper">
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="item,$index in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index,$event)">
					<!--  :class="{'current':currentIndex===$index}" 表示绑定样式类名 current,  当他的属性值为真的时候,current类名被绑定上,否则不会绑定上去-->
					<span class="text">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li  @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" />
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">¥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
								</div>
							</div>
							<div class="cartcontrol-wrapper">			
								<!--安装按钮子组件(一般外层再嵌套一层包裹层用于布局)--v-on:cartAdd="_drop"用来监听按钮子组件发射过来的自定义事件cartAdd,回调函数_drop-->
								<cartcontrol :food="food" @cartAdd="_drop"></cartcontrol>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!--安装购物车子组件-ref="shopcart"用来给父组件访问子组件的dom元素和方法---->
		<shopcart  ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
	</div>
	<!--商品详情页-->
	<food :food="seeFoodinfo" ref="food" @addFood="_drop"></food>
</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from "better-scroll";//导入node_modules的依赖模块,直接写,不需要一层一层的文件夹查找;
	import shopcart from "../shopcart/shopcart";//导入购物车组件
	import cartcontrol from "../cartcontrol/cartcontrol";//导入控制按钮组件
	import food from "../food/food";//导入控制按钮组件
	const ERR_OK=0;//表示没有错误信息，即获取数据成功

	export default {
		props:{
			seller:{
				type:Object,
			},
		},
		data:function(){
			return {
				goods:[],//存放api调取的数据对象,用于遍历生成内容; 表示每一组的food集合的类数组对象;
				listHeight:[],//存放每一个foodList高度,用右侧对应的高度区间,去判断左侧对应的索引对象高亮.
				scrollY:0,//用于跟踪高度的变量
				seeFoodinfo:{},//选择的查看food详情页
			};
		},
		computed:{
			currentIndex:function(){//当前索引
				for(let i=0;i<this.listHeight.length;i++){
					let height1=this.listHeight[i];
					let height2=this.listHeight[i+1];//!height2 是undefined ,最后一个的i+1 是不存在的;
					if(!height2||(this.scrollY>=height1&&this.scrollY<height2)){
						return i;//返回对应需要高亮的索引,当他和v-for遍历的索引一致时候 ,显示高亮的样式:class;
					}
				}
				return 0;
			},
			selectFoods:function(){//遍历所有的foods商品数据
				let foods=[];
				this.goods.forEach((good,index)=>{
					good.foods.forEach((food,index)=>{
						if(food.count){
							foods.push(food);
						}
					})
				})
				return foods;
			}
		},
		created:function(){//实例vue之后,开始vue-resources里面的ajax请求数据,填写的地址参数就是我们常说的api接口;
			this.classMap=['decrease','discount','special','invoice','guarantee'];//控制小icon显示
			this.$http.get('/api/goods').then((response,errno)=>{
				response=response.body;
				if(response.errno===ERR_OK){
					this.goods=response.data;
					this.$nextTick(() => {//vm.$nextTick()延迟在下一个DOM更新周期后执行的回调。在更改了一些数据以等待DOM更新后立即使用它
						this._initScroll();	//出现这种现象是因为better-scroll插件是严格基于DOM的，数据是采用异步传输的，页面刚打开，DOM并没有被渲染，所以，要确保DOM渲染了，才能使用better-scroll	
						this._calculateHeight();
					})
				}
			})
		},
		methods:{
			selectMenu:function(index,event){//选择点击的左侧菜单
				if(!event._constructed){//BScroll的事件对象有一个_constructed属性,当在网页端的时候,event的事件对象
					//没有这个属性,通过这个属性是否有这个属性,return阻止掉BScroll的一个事件,网页端的event原生事件是阻止不了的;
					return;
				}
				let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el=foodList[index];//对应的内容
				this.foodsScroll.scrollToElement(el,300);//滚动到对应的内容;
			},
			selectFood:function(food,event){//选择点击商品的详情页
				if(!event._constructed){
					return;
				}
				this.seeFoodinfo=food;
				this.$refs.food.show();//父组件去调用子组件的方法
			},
			_drop:function(el){//掉落的小球
				this.$refs.shopcart.drop(el);//利用$refs接口去调用子组件drop()的方法;
			},
			_initScroll:function(){//左右两栏的滚动
				console.log(this.$refs)//$refs 是vue2.0里面获取dom元素的集合对象
				this.menuScroll=new BScroll(this.$refs.menuWrapper,{
					click:true,//初始化实例的时候会阻止掉默认事件,所以要重新开启click:true,让其重新开始,回调函数
				});
				this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{
					 probeType:3,
					 click:true,
				});
				this.foodsScroll.on('scroll',(pos) => {//监听滚动的高度
					this.scrollY=Math.abs(Math.round(pos.y));
				})
			},
			_calculateHeight:function(){//计算每组food的高度
				let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height=0;
				this.listHeight.push(height);
				for(let i=0;i<foodList.length;i++){
					let item=foodList[i];
					height+=item.clientHeight;//每一个对象的显示高度(内容高度);
					this.listHeight.push(height);
				}
			}
		},
		components:{//注册组件
			shopcart:shopcart,
			cartcontrol:cartcontrol,
			food:food

		},	
	};
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";

	.goods{
		display:flex;
		position:absolute;
		top:174px;
		bottom:46px;
		width:100%;
		overflow:hidden;
		.menu-wrapper{
			flex:0 0 80px;
			width:80px;
			background:#f3f5f7;
			.menu-item{
				display:table;
				height:54px;
				width:56px;
				padding:0 12px;
				line-height:14px;
				&.current{
					position:relative;
					z-index:10;
					margin-top:-1px;
					background:#fff;
					font-weight:900;
					/*color:red;*/
					.text{
						@include border-none();
					}
				}
				.icon{
					display:inline-block;
				    vertical-align:top;
				    width:12px;
				    height:12px;
				    margin-right:4px;
				    background-size:12px 12px;
				    background-repeat:no-repeat;
				    &.decrease{
						@include bg-image('decrease_1');
					}
					&.discount{
						@include bg-image('discount_1');	
					}
					&.guarantee{
						@include bg-image('guarantee_1');
					}
					&.invoice{
						@include bg-image('invoice_1');
					}
					&.special{
						@include bg-image('special_1');
					}
				}
				.text{
					display:table-cell;
					width:56px;
					vertical-align:middle;
					@include border-1px(rgba(7,17,27,0.1));
					font-size:12px;
				}
			}
		}
		.foods-wrapper{
			flex:1;
			.title{
				padding-left:14px;
				height:26px;
				line-height:26px;
				border-left:2px solid #d9dde1;
				font-size:12px;
				color:rgb(147,153,159);
				background:#f3f5f7;
			}
			.food-item{
				display:flex;
				margin:18px;
				padding-bottom:18px;
				@include border-1px(rgba(7,17,27,0.1));
				&:last-child{
					@include border-none();
					margin-bottom:0;
				}
				.icon{
					flex:0 0 57px;
					margin-right:10px;
				}
				.content{
					flex:1;
					.name{
						margin:2px 0 8px 0;
						height:14px;
						line-height:14px;
						font-size:14px;
						color:rgb(7,17,27);
					}
					.desc,.extra{
						line-height:10px;
						font-size:10px;
						color:rgb(147,153,159);
					}
					.desc{
						line-height:12px;
						margin-bottom:8px;
					}
					.extra{
						.count{
							margin-right:12px;
						}
					}
					.price{
						font-weight:700;
						line-height:24px;
						.now{
							margin-right:18px;
							font-size:14px;
							color:rgb(240,20,20);
						}
						.old{
							text-decoration:line-through;
							font-size:10px;							
							color:rgb(147,153,159);
						}
					}
				}
				.cartcontrol-wrapper{
					position:absolute;
					right:0;
					bottom:12px;
				}
			}
		}
	}

</style>