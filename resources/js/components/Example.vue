<template>
  <div class="example-component">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, Vue in Laravel!'
    };
  }
};
</script>

<style scoped>
.example-component {
  color: blue;
}
</style>
