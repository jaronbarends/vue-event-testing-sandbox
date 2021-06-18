<template>
  <div>
    <event-testing-sandbox-child
      ref="with-handler-name"
      @click="clickHandler"
    />

    <event-testing-sandbox-child
      ref="with-handler-expression"
      @click="clickHandler()"
    />

    <event-testing-sandbox-child
      ref="with-handler-wrapper-name"
      @click="clickHandlerWrapper"
    />

    <event-testing-sandbox-child
      ref="with-handler-from-props"
      @click="clickHandlerProp"
    />

    <button data-qa="button-with-handler-name" @click="clickHandler">
      Click me (please)
    </button>

    <button data-qa="button-with-handler-expression" @click="clickHandler()">
      Click me (please)
    </button>
  </div>
</template>

<script>
import EventTestingSandboxChild from "./EventTestingSandboxChild.vue";

export default {
  name: "ReplaceUploadedProductButton",
  components: {
    EventTestingSandboxChild,
  },

  props: {
    clickHandlerProp: {
      type: Function,
      default: () => {
        console.log("default clickHandlerProp function");
      },
    },
  },

  methods: {
    clickHandler() {
      console.log("clickHandler in EventTestingSandbox.vue");
      this.$emit("child-click");
    },

    clickHandlerWrapper() {
      console.log("clickHandlerWrapper in EventTestingSandbox.vue");
      this.clickHandler();
    },
  },
};
</script>
