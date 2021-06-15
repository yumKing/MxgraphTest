import router from './router';
import store from './store';

// 路由前
router.beforeEach(async (to, from, next) => {
  // if(to.path !== '/login' && store.getters['permission/getRoleMenus'].length === 0){
  //     await store.dispatch('permission/loadRoleMenus')
  //     next()
  // }else{
  //     next()
  // }
  // console.log("to: ", to, "from: ", from)
  next();
});

// 路由后
// router.afterEach()
