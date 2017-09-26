<template>
	<div class="star" :class="starType">
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
	</div>
</template>

<script type="text/ecmascript-6">
	const oLength=5;//星星个数
	const cls_on='on';//有颜色的全星
	const cls_half='half';//有颜色的半星
	const cls_off='off';//灰色的星
	
	export default{
		props:{
			size:{
				type:Number
			},
			score:{
				type:Number
			}
		},
		computed:{
			starType:function(){
				return 'star-'+this.size;
			},
			itemClasses:function(){
				let result=[];//存放星星;
				/*score取0.5的倍数,如果传进来的score不是0.5的倍数,例如4.3,   4.3*2=9.6 取整除以2,永远都是0.5倍数*/
				let score=Math.floor(this.score*2)/2;  
				let hasDecimal=score%1!==0;
				let integer=Math.floor(score);//这里取整计算到底有几个全星;
				for(let i=0;i<integer;i++){
					result.push(cls_on);//放一个全星进去,循环这个动作;结果是全星的都放进去
				}
				if(hasDecimal){
					result.push(cls_half);//放一个半星进去
				}
				while(result.length<oLength){
					result.push(cls_off);//小于星星个数的 ,灰色的星补齐,填满;
				}
				return result;
			}
			
		}
	};
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";
	.star{
		font-size:0;
		.star-item{
			display:inline-block;
			background-repeat:no-repeat;
		}
		&.star-48{
			.star-item{
				width:20px;
				height:20px;
				margin-right:22px;
				background-size:20px 20px;
				&:last-child{margin-right:0}
				&.on{@include bg-image('star48_on')}
				&.half{@include bg-image('star48_half')}
				&.off{@include bg-image('star48_off')}
			}
		}
		&.star-36{
			.star-item{
				width:15px;
				height:15px;
				margin-right:6px;
				background-size:15px 15px;
				&:last-child{margin-right:0}
				&.on{@include bg-image('star36_on')}
				&.half{@include bg-image('star36_half')}
				&.off{@include bg-image('star36_off')}
			}
		}
		&.star-24{
			.star-item{
				width:10px;
				height:10px;
				margin-right:3px;
				background-size:10px 10px;
				&:last-child{margin-right:0}
				&.on{@include bg-image('star24_on')}
				&.half{@include bg-image('star24_half')}
				&.off{@include bg-image('star24_off')}
			}
		}
	}
</style>