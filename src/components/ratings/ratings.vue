<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
						
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>	
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>	
				</div>
			</div>
			<split></split>
			<ratingselect @select="selectRating" @onlyContent="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
			<div class="rating-wrapper">
		        <ul>
		        <!--使用needShow方法控制显示-->
		          <li  v-show="needShow(rating.rateType, rating.text)"  v-for="rating in ratings"  class="rating-item">
		            <div class="avatar">
		              <img width="28" height="28" :src="rating.avatar">
		            </div>
		            <div class="content">
		              <h1 class="name">{{rating.username}}</h1>
		              <div class="star-wrapper">
		              <!--引入star组件-->
		                <star class="star" :size="24" :score="rating.score"></star>
		                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
		              </div>
		              <p class="text">{{rating.text}}</p>
		              <!--recommend的处理,尤其注意class跟布局的使用-->
		              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
		                <span class="icon-thumb_up"></span>
		                <span class="item" v-for="item in rating.recommend">{{item}}</span>
		              </div>
		              <!--过滤时间格式-->
		              <div class="time">
		                {{rating.rateTime | formatDate}}
		              </div>
		            </div>
		          </li>
		        </ul>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import star from '../star/star';
	import split from '../split/split';
	import ratingselect from '../ratingselect/ratingselect';
	import {formatDate} from '../../common/js/date/formatDate'; //导入自定义的date模块(js组件就叫模块) 函数加{}括号
	import BScroll from "better-scroll";//导入node_modules的依赖模块,直接写,不需要一层一层的文件夹查找;
	
	
	const all=2;
	const ERR_OK=0;
	export default{
		props:{
			seller:{
				type:Object
			}
		},
		data:function(){
			return{
				ratings:[],//这里的ratings组件 就相当于goods组件 已经是祖祖先了,没有子组件引用到父组件而言,所以这里的ratings也就没有什么父组件传递子组件props数据;只能用api去调数据;
				selectType:all, //默认所有rate
				onlyContent:true,//默认只显示有内容的rate
			}
		},
		created:function(){//初始化数据,从api那里获取
			this.$http.get('/api/ratings').then((response,errno)=>{
				response=response.body;
				if(response.errno===ERR_OK){
					this.ratings=response.data;
					this.$nextTick(() => { //异步初始化滚动
			            this.scroll = new BScroll(this.$refs.ratings, {
			              click: true
			            })
			        })
				}
			})
		},
		methods:{
			needShow:function(type,text){//控制显示是否有内容的rate评价;
				if(this.onlyContent&&!text){//没有内容
					return false;
				}
				if(this.selectType===all){
					return true;
				}else{
					return type===this.selectType;
				}
			},
			selectRating:function(type){//在 父组件 methods 对象中 用 selectRating 方法接收子组件 emit 过来的值，赋值给 父组件 selectType 然后在通过 props传递给子组件，从而实现改变
				this.selectType=type;//设置rate的类型
				this.$nextTick(()=>{//切换的时候需要重新刷新bscroll
					this.scroll.refresh();
				})
			},
			toggleContent:function(onlyContent){//切换内容,只看有内容的 评价 
				console.log(onlyContent)
				this.onlyContent=!this.onlyContent;
				this.$nextTick(()=>{
					this.scroll.refresh();
				})
			}
		},
		components:{
			star:star,
			split:split,
			ratingselect:ratingselect
		},
		filters:{
			 formatDate:function(time){
		       let date = new Date(time);
		       //调用date模块的formatDate函数来解析时间
		       return formatDate(date, 'yyyy-MM-dd hh:mm');
		    }
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";
	
	.ratings{
		position:absolute;
		left:0;
		top:174px;
		bottom:0;
		width:100%;
		overflow:hidden;
		.overview{
			display:flex;
			padding:18px 0;
			.overview-left{
				flex:0 0 137px;
				padding:6px 0;
				width:137px;
				border-right:1px solid rgba(7,17,27,0.2);
				text-align:center;
				@media only screen and (max-width:320px){
					flex:0 0 120px;
					width:120px;
				}
				.score{
					margin-bottom:6px;
					line-height:28px;
					font-size:24px;
					color:rgb(255,153,0);
				}
				.title{
					margin-bottom:8px;
					line-height:12px;
					font-size:12px;
					color:rgb(7,17,27);	
				}
				.rank{
					font-size:10px;
					color:rgb(147,153,159);
					line-height:20px;
				}
			}
			.overview-right{
				flex:1;
				padding-left:24px;
				@media only screen and (max-width:320px){
					padding-left:6px;
				}
				.score-wrapper{
					margin-bottom:8px;
					font-size:0;
					.title{
						display:inline-block;
						line-height:18px;
						vertical-align:top;
						font-size:12px;
						color:rgb(7,17,27);
					}
					.star{
						display:inline-block;
						margin:0 12px;
						vertical-align:top;
					}
					.score{
						display:inline-block;
						vertical-align:top;
						font-size:12px;
						color:rgb(255,153,0);
					}
				}
				.delivery-wrapper{
					font-size:0;
					.title{
						line-height:18px;
						font-size:12px;
						color:rgb(7,17,27);
					}
					.delivery{
						margin-left:12px;
						font-size:12px;
						color:rgb(147,153,159);
					}
				}
			}
		}
		.rating-wrapper{
			padding:0 18px;
			.rating-item{
				display:flex;
				padding:18px 0;
				@include border-1px(rgba(7,17,27,0.1));
				.avatar{
					flex:0 0 28px;
					width:28px;
					margin-right:12px;
					img{
						border-radius:50%;
					}
				}
				.content{
					position:relative;
					flex:1;
					.name{
						margin-bottom:4px;
						line-height:12px;
						font-size:10px;
						color:rgb(7,17,27);
					}
					.star-wrapper{
						margin-bottom:6px;
						font-size:0;
						.star{
							display:inline-block;
							margin-right:12px;
							vertical-align:top;
							line-height:12px;
							font-size:10px;
							color:rgb(147,153,159);
						}
						.delivery{
							display:inline-block;
							vertical-align:top;
							line-height:12px;
							font-size:10px;
							color:rgb(147,153,159);
						}
					}
					.text{
						margin-bottom:8px;
						line-height:18px;
						color:rgb(7,17,27);
						font-size:12px;
						
					}
					.recommend{
						line-height:16px;
						font-size:0;
						.icon-thumb_up,.item{
							display:inline-block;
							margin:0 8px 4px 0;
							font-size:9px;
						}
						.icon-thumb_up{
							color:rgb(0,160,220);
						}
						.item{
							padding:0 6px;
							border:1px solid rgba(7,17,27,0.1);
							border-radius:1px;
							color:rgb(147,153,159);
							background:#fff;
						}
					}
					.time{
						position:absolute;
						top:0;
						right:0;
						line-height:12px;
						font-size:10px;
						color:rgb(147,153,159);
					}
				}
			}
		}
	}

</style>