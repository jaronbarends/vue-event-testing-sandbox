<template>
  <button @click="$emit('click', $event)">Click me!</button>
</template>

<script>
export default {
  name: 'EventTestingSandboxChild',
};
</script>
