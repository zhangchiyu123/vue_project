// 平台属性管理模块的请求文件
import request from '@/utils/request'

// 获取商品一级分类接口   /admin/product/getCategory1  GET
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'GET' });

// 获取商品二级分类接口   /admin/product/getCategory2/{category1Id}  GET
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'GET' });

// 获取商品三级分类接口   /admin/product/getCategory3/{category2Id}  GET
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'GET' });

// 获取商品基础属性接口(展示三级联动选中的对应商品)  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  GET
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'GET' })

// 添加属性与属性值的接口  /admin/product/saveAttrInfo  POST
// attrInfo: {
//     attrName: "", //属性名
//     attrValueList: [
//       //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
//     ],
//     categoryId: 0, //三级分类的id
//     categoryLevel: 3, //因为服务器也需要区分几级id
//   },
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'POST', data })