<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售({{seller.sellCount}})单</span>
				</div>
				<ul class="remark">
					<!--列表处理remark内容-->
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<!--收藏按钮-->
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul class="supports" v-if="seller.supports">
					<li class="support-item border-1px" v-for="(item,index) in seller.supports">
						使用classMap对应
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="text">{{seller.supports[index].description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
		        <!--两个ref绑定picWrapper,picList-->
		        <div class="pic-wrapper" ref="picWrapper">
		        <!--列表循环输出图片-->
		          <ul class="pic-list" ref="picList">
		            <li class="pic-item" v-for="pic in seller.pics">
		            <!--固定图片尺寸-->
		              <img :src="pic" width="120" height="90">
		            </li>
		          </ul>
		        </div>
			</div>
			<split></split>
			<div class="info">
		        <h1 class="title border-1px">商家信息</h1>
		        <ul>
		          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
		        </ul>
		    </div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from "better-scroll";//导入node_modules的依赖模块,直接写,不需要一层一层的文件夹查找;
	import star from '../star/star';
	import split from '../split/split';
	import {saveToLocal,loadFromLocal} from '../../common/js/store/store';
	
	const ERR_OK=0;
	export default{
		props:{
			seller:{ //app.vue里面router-view会传入一个seller
				type:Object
			}
		},
		data:function(){
			return{
				favorite:(()=>{
					return loadFromLocal(this.seller.id,'favorite',false);
				})()//vue需要返回的data必须是函数,所以加上()
			}
		},
		watch:{
			seller:function(){//当seller变动的时候会触发
				this.$nextTick(() => { 
					this._initScroll();
					this._initPics();
		       })	
	      	}
		},
		computed:{
			favoriteText:function(){
				return this.favorite?'已收藏':'收藏';
			}
		},
		created:function(){//dom渲染完后 异步初始化滚动
			this.classMap=['decrease','discount','special','invoice','guarantee']
			this.$nextTick(() => {
		        this._initScroll();
		        this._initPics();
	      })
		},
		methods:{
			_initScroll:function(){
				if(!this.scroll){
					this.scroll=new BScroll(this.$refs.seller,{
						click:true,
					})
				}else{
					this.scroll.refresh();
				}
			},
			_initPics:function(){
				if(this.seller.pics){
					let picWidth=120;
					let margin=6;
					//这是图片列表的总长度
					let width=(picWidth+margin)*this.seller.pics.length-margin;
					//设置图片列表的宽度等于列表的总长度
					this.$refs.picList.style.width=width+'px';
					//异步绑定滚动
					this.$nextTick(()=>{
						if(!this.picScroll){
							this.picScroll=new BScroll(this.$refs.picWrapper,{
								scrollX:true,//bscroll的横向滚动属性;
								eventPassthrough:'vertical'//bscroll的过滤垂直滚动
							})							
						}else{
							this.picScroll.refresh();
						}
					})
				}
			},
			toggleFavorite:function(event){
				console.log(this.seller.id)
				if(!event._constructed){
					return;
				}
				this.favorite=!this.favorite;
				saveToLocal(this.seller.id,'favorite',this.favorite);
			}
		},
		components:{
			star:star,
			split:split,
		}
	}
</script>


<style lang="scss">
	@import "../../common/scss/mixin.scss";
	
	.seller{
		position:absolute;
		top:174px;/*给header留空间*/
		bottom:0;
		left:0;
		width:100%;
		overflow:hidden;/*隐藏多余部分,因为需要滚动*/
		.overview{
			padding:18px;
			position:relative;
			.title{
				margin-bottom:8px;
				line-height:14px;
				color:rgb(7,17,27);
				font-size:14px;
			}
			.desc{
				padding-bottom:18px;
				@include border-1px(rgba(7,17,27,0.1));
				font-size:0;
				.star{
					display:inline-block;
					margin-right:8px;
					vertical-align:top;/*行内对齐*/
				}
				.text{
					display:inline-block;
					margin-right:12px;
					line-height:18px;
					vertical-align:top;
					font-size:10px;
					color:rgb(77,85,93)
				}
			}
			.remark{
				display:flex;
				padding-top:18px;
				.block{
					flex:1;
					text-align:center;
					border-right:1px solid rgba(7,17,27,0.1);
					&:last-child{
						border:none;
					}
					h2{
						margin-bottom:4px;
						line-height:10px;
						font-size:10px;
						color:rgb(147,153,159);
					}
					.content{
						line-height:24px;
						font-size:10px;
						color:rgb(7,17,27);
						.stress{
							font-size:24px;
						}
					}
				}
			}
			.favorite{
				position:absolute;
				width:50px;
				right:11px;
				top:18px;
				text-align:center;
				.icon-favorite{
					display:block;
					margin-bottom:4px;
					line-height:24px;
					font-size:24px;
					color:#d4d6d9;
					&.active{
						color:rgb(240,20,20)
					}
				}
				.text{
					line-height:10px;
					font-size:10px;
					color:rgb(77,85,93);
				}
			}
		}
		.bulletin{
			padding:18px 18px 0 18px;
			.title{
				margin-bottom:8px;
				line-height:14px;
				color:rgb(7,17,27);
				font-size:14px;
			}
			.content-wrapper{
				padding:0 12px 16px 12px;
				@include border-1px (rgba(7,17,27,0.1));
				.content{
					line-height:24px;
					font-size:12px;
					color:rgb(240,20,20);
				}
			}
			.supports{
				.support-item{
					padding:16px 12px;
					@include border-1px(rgba(7,17,27,0.1));
					font-size:0;
					&:last-child{
						@include border-none();
					}
				}
				.icon{
					display:inline-block;
					width:16px;
					height:16px;
					vertical-align:top;
					margin-right:6px;
					background-size:16px 16px;
					background-repeat:no-repeat;
					&.decrease{
						@include bg-image('decrease_4');
					}
					&.discount{
						@include bg-image('discount_4');
					}
					&.guarantee{
						@include bg-image('guarantee_4');
					}
					&.invoice{
						@include bg-image('invoice_4');
					}
					&.special{
						@include bg-image('special_4');
					}
				}
				.text{
					line-height:16px;
					font-size:12px;
					color:rgb(7,17,27);
				}
			}
		}
		.pics{
			padding:18px;
			.title{
				margin-bottom:12px;
				line-height:14px;
				color:rgb(7,17,27);
				font-size:14px;			
			}
			.pic-wrapper{
				width:100%;/*图片列表区域是屏幕宽度*/
	        	overflow:hidden;/*隐藏多余部分*/
	       	 	white-space:nowrap; /*连续的空白符会被合并*/
			}
			.pic-list{
				font-size:0;/*行内元素取消间隙*/
				.pic-item{          
					display:inline-block;
					margin-right:6px;
					width:120px;
					height:90px;
					&:last-child{/*最后一个图片没有外边距*/
					  margin:0;
					}
				}
			}
						
		}
		.info{
			padding:18px 18px 0 18px;
			color:rgb(7,17,27);
			.title{
				padding-bottom:12px;
				line-height:14px;
				@include border-1px(rgba(7,17,27,0.1));
				font-size:14px;
			}
			.info-item{
				padding:16px 12px;
				line-height:16px;
				@include border-1px(rgba(7,17,27,0.1));
				font-size:12px;
				&:last-child{
					@include border-none();
				}
			}
		}
	        
	}
</style>