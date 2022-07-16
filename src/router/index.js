import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
// 引入最外层骨架的一级路由组件
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 为什么不同的用户登录我们的项目，菜单(路由)都是一样的
// 因为路由不是动态的，不管登录的用户是谁，你能看见的，操作的菜单都是一样的
// 需要把项目中的路由进行拆分

// 常量路由:不管用户是什么角色，都可以看见的路由
// 任何角色 都能看到登录以及404、首页
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout, // 和模板一样的写法  直接展示Layout组件
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'dashboard' }
        }]
    }, {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
]

// 异步路由:不同的角色，需要过滤筛选出的路由
export const asyncRoutes = [{
        path: '/product',
        name: 'Product',
        component: Layout, // 和模板一样的写法  直接展示Layout组件
        redirect: '/dashboard',
        meta: { title: '商品管理', icon: 'el-icon-goods' },
        children: [{
                path: 'trandmark',
                name: 'trandMark',
                component: () =>
                    import ('@/views/product/tradeMark'),
                meta: { title: '品牌管理' },
            },
            {
                path: 'attr',
                name: 'Attr',
                component: () =>
                    import ('@/views/product/Attr'),
                meta: { title: '属性管理' },
            },
            {
                path: 'spu',
                name: 'Spu',
                component: () =>
                    import ('@/views/product/Spu'),
                meta: { title: 'Spu管理' },
            },
            {
                path: 'sku',
                name: 'Sku',
                component: () =>
                    import ('@/views/product/Sku'),
                meta: { title: 'Sku管理' },
            },

        ]
    },
    // 权限管理的路由
    {
        path: '/acl',
        name: 'Acl',
        component: Layout, // 和模板一样的写法  直接展示Layout组件,
        redirect: '/acl/user/list',
        meta: {
            title: '权限管理',
            icon: 'el-icon-lock',
        },
        children: [{
            name: 'User',
            path: 'user/list',
            component: () =>
                import ('@/views/acl/user/list'),
            meta: {
                title: '用户管理',
            },
        }, {
            path: 'permission/list',
            name: 'Permission',
            component: () =>
                import ('@/views/acl/permission/list'),
            meta: { title: '菜单管理' },
        }, {
            name: 'Role',
            path: 'role/list',
            component: () =>
                import ('@/views/acl/role/list'),
            meta: { title: '角色管理' },
        }, {
            name: 'RoleAuth',
            path: 'role/auth/:id',
            component: () =>
                import ('@/views/acl/role/roleAuth'),
            meta: {
                activeMenu: '/acl/role/list',
                title: '角色授权',
            },
            hidden: true,
        }, ]
    },
]

// 任意路由: 当路径发生错误的时候，重定向到404
export const anyRoutes = [
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true },
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    // 滚动行为  返回的y：0，代表滚动条在最上方
    scrollBehavior: () => ({ y: 0 }),
    // 因为注册的路由是死的，不是活的，路由如果根据不同的用户(角色)，可以展示不同的菜单
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router