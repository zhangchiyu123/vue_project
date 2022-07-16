// 引入 登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入路由模块当中重置路由的方法
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'

// 箭头函数
const getDefaultState = () => {
    return {
        // 获取token
        token: getToken(),
        // 存储用户名
        name: '',
        // 存储用户头像
        avatar: '',
        // 服务器返回的菜单信息，[根据不同的角色,返回的标记信息,数组里面的元素是字符串]
        routes: [],
        // 角色信息
        roles: [],
        // 按钮权限的信息,
        buttons: [],
        // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比，最终需要展示的路由】
        resultAsyncRoutes: [],
        // 用户最终需要展示的全部路由
        resultAllRoutes: [],
    }
}

const state = getDefaultState()

const mutations = {
    // 重置state
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    // 存储token
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // // 存储用户名
    // SET_NAME: (state, name) => {
    //     state.name = name
    // },
    // SET_AVATAR: (state, avatar) => {
    //     state.avatar = avatar
    // }
    // 重写存储用户信息
    SET_USERINFO: (state, userInfo) => {
        // 用户名
        state.name = userInfo.name;
        // 头像
        state.avatar = userInfo.avatar;
        // 菜单权限标记
        state.routes = userInfo.routes;
        // 按钮权限标记
        state.buttons = userInfo.buttons;
        // 角色信息
        state.roles = userInfo.roles;
    },
    // 最终计算出来的异步路由
    SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
        // vuex保存当前的异步路由,注意,一个用户需要展示的完整的路由，包含:常量、异步、任意路由
        state.resultAsyncRoutes = asyncRoutes;
        // 计算出当前用户需要展示的所有的路由,进行合并
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
        // 给路由器添加新的路由
        router.addRoutes(state.resultAllRoutes)
    }
}

// 定义一个函数,两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
    // 过滤出当前用户[超级管理|普通员工]需要展示的异步路由
    return asyncRoutes.filter((item) => {
        // 数组当中没有这个元素，返回的索引值是-1，如果有这元素，返回的索引值一定不是-1
        if (routes.indexOf(item.name) !== -1) {
            // 递归:别忘记还有多级路由
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes)
            }
            return true
        }
    })
}


const actions = {
    // user login  
    // 处理登录的业务  await 重构
    async login({ commit }, userInfo) {
        // 结构出用户名与密码
        const { username, password } = userInfo;
        const result = await login({ username: username.trim(), password: password }) //trim() 去掉前后空格
        console.log(result);
        // 注意，当前这个登录现在使用的是mock数据，mock数据的code是20000
        if (result.code == 20000) {
            // 存储token
            commit('SET_TOKEN', result.data.token);
            // 本地持久化存储token
            setToken(result.data.token);
            return Promise.resolve('ok');
        } else {
            return Promise.reject(new Error('fail'));
        }
    },
    // login({ commit }, userInfo) {
    //     // 结构出用户名与密码
    //     const { username, password } = userInfo;
    //     return new Promise((resolve, reject) => {
    //         login({ username: username.trim(), password: password }).then(response => {
    //             const { data } = response
    //             commit('SET_TOKEN', data.token)
    //             setToken(data.token)
    //             resolve()
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },


    // get user info   await 重构
    async getInfo({ commit, state }) {
        let result = await getInfo(state.token);
        console.log(result);
        if (result.code == 20000) {
            // 获取用户信息，返回的数据包含:用户名name、用户的头像avatar、routes[返回的标志，不同的用户应该展示哪些菜单的标记]、roles(用户角色的信息)、buuttons[按钮的信息:按钮权限用的标记]
            // vuex 存储用户全部的信息
            commit('SET_USERINFO', result.data);
            commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, result.data.routes))
                // commit('SET_NAME', result.data.name)
                // commit('SET_AVATAR', result.data.avatar)
            return Promise.resolve('ok');
        } else {
            return Promise.reject(new Error('fail'));
        }
    },

    // getInfo({ commit, state }) {
    //     return new Promise((resolve, reject) => {
    //         getInfo(state.token).then(response => {
    //             const { data } = response
    //             if (!data) {
    //                 return reject('Verification failed, please Login again.')
    //             }
    //             const { name, avatar } = data
    //             commit('SET_NAME', name)
    //             commit('SET_AVATAR', avatar)
    //             resolve(data)
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}