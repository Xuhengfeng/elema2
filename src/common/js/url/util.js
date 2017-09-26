//解析url参数
//www.baidu.com?id=134123&a=b
//return Object {id:134123,a:b}
export function urlParse(){
	let url=window.location.search;//获取到url的所有参数;
	let obj={};
	let reg=/[?&][^?&]+=[^?&]+/g;//正则判断获取
	let arr=url.match(reg);//正则获取后悔保存到一个数组里面
	if(arr){
		arr.forEach((item)=>{
			let tempArr=item.substring(1).split('=');//将第一位去掉,然后用等号分隔
			let key=docodeURIComponent(tempArrp[0]);//URI对于utf8格式会转码,所以这里需要解码
			let val=docodeURIComponent(tempArrp[1]);
			obj[key]=val;
		})
	}
	return obj;
}
