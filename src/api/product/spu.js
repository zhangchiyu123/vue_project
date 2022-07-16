// 平台属性管理模块的请求文件
import request from '@/utils/request'

// 商品SPU列表数据的展示接口  /admin/product/{page}/{limit}  GET  catrgory3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });

// 获取某一个SPU的信息接口 /admin/product/getSpuById/{spuId}  GET
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'GET' })

// 获取品牌的数据接口 /admin/product/baseTrademark/getTrademarkList  GET
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'GET' })

// 获取SPU图片的接口  /admin/product/spuImageList/{spuId}   GET
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'GET' })


// 获取平台全部销售属性的接口 整个平台销售属性一共三个 /admin/product/baseSaleAttrList  GET
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'GET' })

// 修改SPU或者是添加SPU  对于修改或者是添加 携带给服务器的参数大致是一样的，唯一的区别就是携带的参数是否带id   /admin/product/updateSpuInfo   /admin/product/saveSpuInfo
export const reqAdd_UpdateSpu = (spuInfo) => {
    // 携带的参数带有id，就是修改
    if (spuInfo.id) {
        return request({ url: `/admin/product/updateSpuInfo`, method: 'POST', data: spuInfo })
    } else {
        // 携带的参数是不带id的
        return request({ url: `/admin/product/saveSpuInfo`, method: 'POST', data: spuInfo })
    }
}

// 删除SPU的接口 /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// *************  sku

// 获取skuform图片的接口 /admin/product/spuImageList/{spuId}   GET
export const reqSpuImageList1 = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'GET' })

// 获取销售属性列表  /admin/product/spuSaleAttrList/{spuId}  GET
export const reqSpuSaveAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'GET' })

// 获取平台属性的数据  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'GET' })

// 添加sku
// /admin/product/saveSkuInfo   post
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'POST', data: skuInfo })

// 获取sku列表详细数据的接口
// /admin/product/findBySpuId/{spuId}   GET
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'GET' })