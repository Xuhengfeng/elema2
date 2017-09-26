<template>
	<div class="ratingselect">
		<!--有使用一个border-1px的mixin-->
		<div class="rating-type border-1px">
			 <!--绑定一个select方法控制切换,绑定class控制切换之后的按钮样式显示 根据类型来确定显示的class,实现不同类型显示不同样式的目的--> 
			<span @click="select(2,$event)" class="block all" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negaitives.length}}</span></span>
		</div>
		 <!--绑定一个toggleContent方法来控制有内容和无内容的显示-->
		<div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	const positive=0;
	const negative=1;
	const all=2;//设置常量,比较好的代码风格,代替直接写数字到代码里面去
	export default{
		props:{
			ratings:{ //传入ratings数组,跟food.ratings关联
				type:Array,
				default:function(){
					return [];
				}
			},
			selectType:{//跟selectType关联,通过在父组件里面设置这3个值来实现控制子组件的操作
				type:Number,
				default:all
			},
			onlyContent:{//跟onlyContent关联
				type:Boolean,
				default:false
			},
			desc:{//跟desc关联
				type:Object,
				default:function(){
					return{
						all:'全部',
						positive:'满意',
						negative:'不满意',
					}
				}
			}
				
		},
		computed:{
			positives:function(){
				return this.ratings.filter((ratings)=>{
					return ratings.rateType===positive;
				})				
			},
			negaitives:function(){
				return this.ratings.filter((ratings)=>{
					return ratings.rateType===negative;
				})
			}
		},
		methods:{
			select:function(type,event){
				if(!event._constructed){
					return;
				}
				this.$emit('select',type);//这里是通过父组件去修改this.selectType=type;
				//v-model是默认双向的 ,把type传到外面的父组件重新赋值; 内部组件就不需要自己再重新定义this.selectType=type;
			},
			toggleContent:function(event,onlyContent){
				if(!event._constructed){
					return;
				}
				this.$emit('onlyContent',onlyContent);
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";
	.ratingselect{
		.rating-type{
			padding:18px 0;
			margin:0 18px;
			@include border-1px(rgba(7,17,27,0.1));
			font-size:0;
			.block{
				display:inline-block;
				margin-right:8px;
				padding:8px 12px;
				border-radius:1px;
				line-height:16px;
				font-size:12px;
				color:rgb(77,85,93);
				.count{
					margin-left:2px;
					font-size:8px;
				}
				&.all{
					background:rgba(0,160,220,0.2);
					&.active{
						color:#fff;
						background:rgb(0,160,220);
					}
				}
				&.positive{
					background:rgba(0,160,220,0.2);
					&.active{
						color:#fff;
						background:rgb(0,160,220);
					}
				}
				&.negative{
					background:rgba(77,85,93,0.2);
					&.active{
						color:#fff;
						background:rgb(77,85,93);
					}
				}
			}
		}
		.switch{
			padding:12px 18px;
			line-height:24px;
			border-bottom:1px solid rgba(7,17,27,0.1);
			color:rgb(147,153,159);
			font-size:0;
			&.on{
				.icon-check_circle{
					color:#00c850;
				}
			}
			.icon-check_circle{
				display:inline-block;
				vertical-align:top;
				margin-right:4px;
				font-size:24px;
			}
			.text{
				font-size:12px;
			}
		}
	}
</style>