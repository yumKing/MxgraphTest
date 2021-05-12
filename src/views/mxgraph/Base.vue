<template>
  <div id="base-route">
    <router-link to="/graph/baseGraph">基础例子</router-link> |
    <router-link to="/graph/anchors">连线锚点</router-link> |
    <router-link to="/graph/animation">基础动画</router-link> |
    <router-link to="/graph/boundary">边界</router-link> |
    <router-link to="/graph/clipboard">粘贴板</router-link> |
    <router-link to="/graph/codec">XML构建图形</router-link> |
    <router-link to="/graph/myflow">myflow</router-link> |
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
