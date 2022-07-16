// 平台属性管理模块的请求文件
import request from '@/utils/request'

//sku列表的接口    /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'GET' })

// 产品上架的接口  /admin/product/onSale/{skuId}  GET
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'GET' })

// 产品下架的接口  /admin/product/cancelSale/{skuId}  GET
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'GET' })

// 获取sku详情的接口  /admin/product/getSkuById/{skuId}   GET
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'GET' })