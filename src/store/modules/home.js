import mockRequest from '@/utils/mockRequest'
const state = {
    list: {},
}
const actions = {
    // 发请求获取首页多的mock的模拟数据
    async getData({ commit }) {
        let result = await mockRequest.get('./home/list')

        if (result.code == 200) {
            commit('GETDATA', result.data)
        }
    }
}
const mutations = {
    GETDATA(state, list) {
        state.list = list;
    }
}
const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}