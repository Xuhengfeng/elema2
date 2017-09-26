export function formatDate(date,fmt){//在es6 导出一个函数
	//对一个或多个y进行匹配,匹配到就进行年的替换(年有四位,所以需要特殊处理)
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
	}
	let o={
		"M+":date.getMonth()+1,//js的月是从0开始算的,所以要加1;
		"d+":date.getDate(),
		"h+":date.getHours(),
		"m+":date.getMinutes(),
		"s+":date.getSeconds()
	};
	 //对月,日,时,分,秒进行匹配替换(这些都是两位,可以一起处理)
	for(let k in o){
		if(new RegExp(`(${k})`).test(fmt)){//匹配到key例如MM
			let str=o[k]+'';//然后o['MM'] 就是date.getMonth() + 1
			fmt=fmt.replace(RegExp.$1,(RegExp.$1.length === 1)?str:padLeftZero(str)); 
		}
	}
	return fmt;
}
//先加两个0,然后再根据长度截取(因为最长也就2个0的长度)
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}