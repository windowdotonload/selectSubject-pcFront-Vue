<!--
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
-->

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    alert("modify");
    console.log("123123");
    console.log("------------------");
  },
};
</script>
<style lang="scss">
</style>
