## 功能列表
    1.SPU的分页列表
    2.添加SPU
    3.修改SPU
    4.删除指定SPU
    5.给某个SPU添加SKU
    6.查看SPU下的SKU列表
    7.SKU的分页列表
    8.对SKU进行上架/下架处理
    9.查看SKU详情

## 理解区别2组业务概念
    1. SPU与SKU
      SPU: 某个商品所有相关信息的集合, 包括所有可选择的图片, 可选择的平台属性与销售属性
      SKU: SPU下确定了图片列表/平台属性与销售属性数据的信息集合, 商品唯一标识
      关系: 一个SPU下可以对应多个SKU
    2. 平台属性与销售属性
      平台属性: 用于(出现)商品搜索的商品描述信息, 包含属性名与一系列的属性值
      销售属性: 出现在商品详情界面的商品描述信息, 包含属性名与一系列的属性值

## SPU与SKU相关接口请求函数

## SPU的分页列表界面
	界面布局: Card / CategorySelector / Button / Table / HintButton / Pagination 
	异步获取分页列表数据显示

## SpuForm组件布局界面
	界面布局: Form / Input / Select / Upload / Table / Button / Tag
	控制SpuForm的显示隐藏
		在父组件中定义标识数据: isShowSpuForm=true/false
		通过子组件更新父组件的数据 ==>从而实现SpuForm的显示隐藏
			使用$parent ===> 不太好, 需要多次取$parent
			使用.sync
				父组件: <SpuForm :visible.sync="isShowSpuForm"></SpuForm>
				子组件: 
					props: {visible: Boolean}
					this.$emit('update:visible', false)

## SpuForm组件: 动态获取数据
    修改SPU
		1). 根据spuId请求获取spuInfo  spu.get(spuId)
		2). 根据spuId请求获取spuImageList  sku.getSpuImageList (spuId)
		3). 获取所有品牌的列表trademarkList trademark.getList()
		4). 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    添加SPU
    	1). 获取所有品牌的列表trademarkList trademark.getList()
		2). 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
	在父组件中通知子组件请求获取数据
		使用ref技术得到子组件对象, 并调用父组件对象方法

## SpuForm组件: 显示动态数据
	注意: 请求获取的数据可能不能直接用于显示, 需要先进行一定整理来再显示

	品牌下拉列表
		trademarkList: 所有品牌的数组
		spuInfo.tmId: 当前SPU的品牌id

	SPU图片列表: spuImageList
		请求返回的数据结构
			{
			    "id": 333,
			    "spuId": 26,
			    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
			 }
		upload组件需要的数据结构:
			{
				name: 'food.jpg', 
				url: 'https://xxx.cdn.com/xxx.jpg'
			}
		如何处理/整理:
			给spuImageList中每个图片对象都添加name和url属性, 属性值为对应的属性值

	销售属性:
		SPU销售属性列表
			目标数组: spuInfo.spuSaleAttrList
			数据结构: 
				{
				  "id": 133,
				  "spuId": 26,
				  "baseSaleAttrId": 2,
				  "saleAttrName": "选择版本",
				  "spuSaleAttrValueList": [
				    {
				      "id": 225,
				      "spuId": 26,
				      "baseSaleAttrId": 2,
				      "saleAttrValueName": "aa",
				      "saleAttrName": "选择版本",
				      "isChecked": null
				    }
				  ]
					// 添加属性
					edit: true/false,
					saleAttrValueName: 'aa'
				}

		还未使用的销售属性列表
			相关数据1: 所有销售属性列表 saleAttrList
				[
				  {
				    "id": 1,
				    "name": "选择颜色"
				  },
				  {
				    "id": 2,
				    "name": "选择版本"
				  },
				  {
				    "id": 3,
				    "name": "选择套装"
				  }
				]
			相关数据2: spu中已有销售属性列表 spuInfo.spuSaleAttrList
				{
					"saleAttrName": "选择版本",
				}
			未使用的销售属性的数组:
				对saleAttrList进行过滤, 去掉已经在spuInfo.spuSaleAttrList存在的
				判断的依据是: name与saleAttrName就否相同
				定义计算属性: unUsedSaleAttrList
		

## SpuForm: 交互收集数据
	spu图片列表收集
		从后台获取的图片文件对象的结构
			{
			    "id": 333,
			    "spuId": 26,
			    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
				 "name": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
				 "url":  "http://47.93.148.192:8080/xxx.jpg"
			}
		新上传的图片文件对象的结构
			{
				name: "e814ec6fd86c5a8c.jpg"
				response: {
					data: "http://182.92.128.115:8080/group1/xxx.jpg"
				}
				url: "blob:http://localhost:9529/a5199d82-0811-442d-9ec2-dafae83d9ed9"
			}
		提交保存/更新SPU请求的图片对象的结构(目标):
			 {
			    "imgName": "下载 (1).jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
			 }

	spu销售属性数据收集
		收集选择销售属性: v-model="attrIdAttrName"  / :value="attr.id+':'+attr.name" 
			销售属性的id
			销售属性的name

		添加SPU销售属性
			向spuInfo.spuSaleAttrList数组中添加一个对象
				{
			      "baseSaleAttrId": "1",
			      "saleAttrName": "选择颜色",
			      "spuSaleAttrValueList": []
			    }
			清除选择收集的数据: attrIdAttrName = ''

		添加SPU销售属性值
			是否显示输入框的标识: 是spu销售属性对象上的edit
			输入框输入的属性值名称:是spu销售属性对象上的saleAttrValueName
			从查看模式变为编辑模式:
				给当前行的属性对象添加edit属性为true: $set()
				输入框自动获得焦点: $nextTick() + $refs + focus()
			从编辑模式变为查看模式(确定添加属性值对象)
				向当前属性对象的spuSaleAttrValueList中添加一个属性值对象
				 {
		          saleAttrValueName: '',
		          baseSaleAttrId: "1"
		         }
		删除SPU销售属性
		删除SPU销售属性值

## SpuForm: 请求添加/更新
	在发请求需要进行必要数据整理  => 发请求添加/更新  ==> 根据请求的结果做相应处理
	整理1: SPU图片列表 spuImageList
		{
		    "imgName": "下载 (1).jpg",
		    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
		 }
	整理2: SPU销售属性列表 spuSaleAttrList
      	过滤掉没有属性值的属性对象
      	删除一些不必要的属性数据(为了界面显示而添加: saleAttrValueName/edit)

## 删除SPU
	显示小确定框
	点击确定后, 请求删除, 删除成功后重新显示列表

## 显示spu下对应的SKU列表
	请求获取指定spu的SKU列表: sku.getListBySpuId(spuId)
	Dialog / Table

## SkuForm
	1) 布局界面: Form / Input / Select / Table / Button / Tag

	2) 请求获取初始显示需要的数据
		根据3个级别的分类ID获取所有平台属性列表: attr.getList (category1Id, category2Id, category3Id) 
		根据spuId获取SPU图片列表: sku.getSpuImageList(spuId)
		根据spuId获取spu销售属性列表: sku.getSpuSaleAttrList(spuId)

		条件数据从父组件传递过来

	3) 动态显示数据(可能需要整理请求得到的数据)
		平台属性列表: attrList
			 {
			    "id": 1,
			    "attrName": "价格",
			    "categoryId": 61,
			    "categoryLevel": 3,
			    "attrValueList": [
			      {
			        "id": 207,
			        "valueName": "500-999",
			        "attrId": 1
			      }
			    ]
			  }
		SPU销售属性列表: spuSaleAttrList
			{
			    "id": 136,
			    "spuId": 30,
			    "baseSaleAttrId": 1,
			    "saleAttrName": "选择颜色",
			    "spuSaleAttrValueList": [
			      {
			        "id": 258,
			        "spuId": 30,
			        "baseSaleAttrId": 1,
			        "saleAttrValueName": "a",
			        "saleAttrName": "选择颜色",
			        "isChecked": null
			      }
			    ]
			 }
		SPU图片列表: spuImageList
			{
			    "id": 333,
			    "spuId": 26,
			    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
			}
	
	4). 交互收集数据
		最终的目标数据: skuInfo对象
			{
			  "category3Id": 61,
			  "spuId": 30,
			  "tmId": 2,
			  "skuName": "aa",
			  "skuDesc": "aa描述",
			  "price": "12",
			  "weight": "2",
			  "skuDefaultImg": "http://47.93.148.192:8080/xxx.jpg",
			  "skuAttrValueList": [
			    {
			      "attrId": "2",
			      "valueId": "9"
			    }
			  ],
			  "skuSaleAttrValueList": [
			    {
			      "saleAttrValueId": 258
			    }
			  ],
			  "skuImageList": [
			    {
			      "imgName": "下载 (1).jpg",
			      "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
			      "spuImgId": 337, // 当前Spu图片的id
			      "isDefault": "1"   // 默认为"1", 非默认为"0"
			    }
			  ]
			}
		简单的:
			父组件传入
			v-model直接收集好
		平台属性: 
			现有的: attrList
				 {
				    "id": 1,
				    "attrName": "价格",
				    "categoryId": 61,
				    "categoryLevel": 3,
				    "attrValueList": [
				      {
				        "id": 207,
				        "valueName": "500-999",
				        "attrId": 1
				      }
				    ]
				 }
			目标: spuInfo.skuAttrValueList
				{
			      "attrId": "2",
			      "valueId": "9"
			    }
			收集: 给attrList中的属性对象添加一个attrIdValueId的属性
				{
					attrIdValueId: '2:9'
				}
		销售属性:
			现有的: spuSaleAttrList
				{
				    "id": 136,
				    "spuId": 30,
				    "baseSaleAttrId": 1,
				    "saleAttrName": "选择颜色",
				    "spuSaleAttrValueList": [
				      {
				        "id": 258,
				        "spuId": 30,
				        "baseSaleAttrId": 1,
				        "saleAttrValueName": "a",
				        "saleAttrName": "选择颜色",
				        "isChecked": null
				      }
				    ]
				 }
			目标: spuInfo.skuSaleAttrValueList
				{
			      "saleAttrValueId": 258  
			    }
				
			收集: 给spuSaleAttrList中的属性对象添加一个saleAttrValueId属性
				{
					...
					saleAttrValueId: 258
				}
		图片:
			现有: spuImageList
				{
				    "id": 333,
				    "spuId": 26,
				    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
				    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
				}
			目标: 
				spuInfo.skuDefaultImg: "http://47.93.148.192:8080/xxx.jpg",
				spuInfo.skuImageList数组
					{
				      "imgName": "下载 (1).jpg",
				      "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
				      "spuImgId": 337, // 当前Spu图片的id
				      "isDefault": "1"   // 默认为"1", 非默认为"0"
				    }
				
			收集:
				在请求得到spuImageList数据后需要对数据进行整理: 每个元素对象添加一个isDefault='0'
				spuInfo.skuDefaultImg: 通过点击按钮收集
				selectedSpuImageList数组: selection-change事件监听来收集
				

	5). 发ajax请求前, 整理需要提交的数据
		整理1: 平台属性
			目标数据: skuInfo.skuAttrValueList
				{
			      "attrId": "2",
			      "valueId": "9"
			    }
			现有数据: attrList
				{
					attrIdValueId: '2:9' // 可能没有
				}

		整理2: 销售属性
			目标数据: spuInfo.skuSaleAttrValueList
				{
			      "saleAttrValueId": 258  
			    }
			现有数据: spuSaleAttrList
				{
					saleAttrValueId: 258 // 可能没有
				}

		整理3: 图片列表
			目标数据: spuInfo.skuImageList
				{
			      "imgName": "下载 (1).jpg",
			      "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
			      "spuImgId": 337, // 当前Spu图片的id
			      "isDefault": "1"   // 默认为"1", 非默认为"0"
			    }
			现有数据: selectedSpuImageList
				{
				    "id": 333,
				    "spuId": 26,
				    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
				    "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
					"isDefault": "1" / "0"
				}

	6). 提交请求, 并根据结果进行界面更新
		发送保存的ajax请求
		提示成功
		重置数据
		通知父组件
			$emit()
			函数props

## 作用域样式与深度样式选择器 (面试说)
		不声明scoped, 样式是全局的, 可以匹配影响所有的组件
		声明scoped, 就不会影响到子组件内部样式(根标签除外)
				标签的变化:
					当前组件的所有标签都增加一个data自定义属性: data-v-2e8d0da5 => 用来标识当前组件的
					子组件的根标签也会有此data属性, 子标签没有
				样式的选择器变化: 选择器的最右边添加了当前组件data属性的选择  
					.test2 .t2[data-v-2e8d0da5] {
						color: red;
					}
					==> 能匹配当前组件的所有元素
					==> 还能匹配子组件根标签, 但不可能匹配其子标签
		使用深度选择器, 修改子组件内部任意标签的样式
			编码: 
				.test2 >>> .t22 {
					font-size: 30px;
				}
				.test2 {
					/deep/ .t22 {
						color: hotpink;
					}
				}
			没用深度
				.test2 .t2[data-v-2e8d0da5] {
					color: red;
				}
			用了深度
				.test2[data-v-2e8d0da5] .t22 {
					font-size: 30px;
				}
			==> 属性选择从最右边转移到了左边  ==> 此选择对目标元素没有当前data属性的要求 ==> 可以子组件任意标签
		修改第三方组件库内部的样式: 使用deep选择器
	
## 编码任务列表
	1--实现: 定义SPU与SKU相关接口请求函数
	2--实现: SPU列表界面的布局和动态显示
	3--实现: SpuForm界面的布局
	4--实现: SpuForm显示隐藏的控制--使用.sync
	5--实现: 初始动态获取SpuForm添加/更新界面需要的数据
	6--实现: 动态显示品牌列表与SPU图片列表
	7--实现: 动态显示销售属性列表与未使用的属性列表
	8--实现: 添加spu销售属性
	9--实现: 添加spu销售属性值
	10--实现: 删除spu销售属性与spu销售属性值
	11--实现: spu图片的上传与删除
	12--实现: 请求添加/更新SPU
	
	13--实现: 删除SPU
	14--实现: 显示spu下对应的SKU列表
	15--实现: SkuForm-界面布局
	16--实现: SkuForm-动态获取要显示的数据
	17--实现: SkuForm-动态显示数据
	18--使用: 数组声明式系列方法
	19--实现: SkuForm-收集数据
	20--实现: SkuForm-请求添加
	21--实现: Sku分页列表
	22--实现: Sku上架与下架
	23--实现: Sku删除
	24--实现: SKU详情--scoped与deep
	25--实现: 对项目进行生产环境打包并使用nginx运行
