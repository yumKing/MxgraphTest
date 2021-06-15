<template>
  <div id="base-route">
    <router-link to="/test/baseGraph">基础例子</router-link> | <router-link to="/test/anchors">连线锚点</router-link> | <router-link to="/test/animation">基础动画</router-link> |
    <router-link to="/test/boundary">边界</router-link> | <router-link to="/test/clipboard">粘贴板</router-link> | <router-link to="/test/edgeDynStyle">连线动态样式</router-link> |
    <router-link to="/test/autoLayout">自动布局</router-link> | <router-link to="/test/myflow">我的流程</router-link> |
  </div>
</template>

<style lang="scss">
#base-route {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
