<template>
  <div id="app">
    <!-- <condition /> -->
    <!-- <create /> -->
    <advanced />
  </div>
</template>

<script>
import condition from '@/components/condition' //我的自定义vue组件
import create from './views/create/index.vue'
import advanced from './views/advanced/index.vue'

export default {
  name: 'App',
  components: {
    condition,
    create,
    advanced,
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
