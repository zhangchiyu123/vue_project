// 这个模块主要获取的是平拍管理的数据的模块
// 引入axios (axios的二次封装)
import request from '@/utils/request'


// 获取品牌列表的接口 /admin/product/baseTrademark/{page}/{limit}  get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// (俩接口写一起了)
// 处理添加品牌的操作  /admin/product/baseTrademark/save  POST  携带两个参数  品牌名称和logo
// 切记:对于新增的品牌，给服务器传数据，不需要传递ID，因为ID是由服务器生成的
// 处理修改品牌的操作    /admin/product/baseTrademark/update  PUT  携带三个参数:id 名称。logo
// 切记:对于修改某个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 带给服务器数据携带有id----修改
    if (tradeMark.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'PUT', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: `/admin/product/baseTrademark/save`, method: 'POST', data: tradeMark })
    }
}

// 删除品牌logo的接口  /admin/product/baseTrademark/remove/{id}   DELETE
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'DELETE' })