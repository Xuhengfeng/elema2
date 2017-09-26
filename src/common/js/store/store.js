//存储
//传入三个参数,seller的id,要存储的key和value值
export function saveToLocal(id,key,value){
	//在node里面,没有默认全局window对象,所以需要指定加上才能使用window 的相关方法和属性;
	//需要加上window对象来使用localstorage
	let seller=window.localStorage._seller_;//使用__只是一种标记写法,标记是自定义的某种编码规范,这里代表这只是seller的数据
	if(!seller){//第一次生成seller的时候初始化
		seller={};
		seller[id]={};
	}else{
		seller=JSON.parse(seller);//解析json字符串;
		if(!seller[id]){
			seller[id]={};
		}
	}
	seller[id][key]=value;//生成当前的seller对象
	//localStorage只能存储字符串,需要转成json字符串
	window.localStorage._seller_=JSON.stringify(seller);//转成json字符串
}


//读取
//三个参数,seller的id,之前的存储的key,和一个value
export function loadFromLocal(id,key,def){
	let seller=window.localStorage._seller_;
	if(!seller){//读取不到返回默认值
		return def;
	}
	seller=JSON.parse(seller)[id];//json解析
	if(!seller){//解析失败返回默认值
		return def;
	}
	let ret=seller[key];
	return ret||def;//解析成功但是没有这个seller的id的页返回默认值
}
