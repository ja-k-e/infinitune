<template>
  <Controller />
</template>

<script>
import Controller from "@/components/Controller.vue";

export default {
  name: "home",
  components: {
    Controller
  }
};
</script>

<style lang="scss">
$border: 2px;
$radius: 4px;

$font-family: Roboto, Helvetica, Arial, sans-serif;
$font-weight-bold: 900;
$font-weight-normal: 300;

body {
  font-family: $font-family;
  font-weight: $font-weight-normal;
  color: white;
  background: black;
}

a {
  // text-decoration-style: double;
  color: white;
}

$button-color: white;
$button-bg: transparent;
$button-bg-focus: rgba(255, 255, 255, 0.5);
$button-border-dark: $button-color;

$button-solid-color: var(--color);
$button-solid-bg: white;
$button-solid-bg-focus: white;
$button-solid-border-dark: white;

button {
  appearance: none;
  user-select: none;
  border: none;
  font-family: $font-family;
  font-weight: $font-weight-normal;
  font-size: 16px;
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 2px 1px;
  border-radius: $radius;
  cursor: pointer;
  vertical-align: middle;
  outline: none;
  color: $button-color;
  background: $button-bg;
  border: $border solid $button-border-dark;
  &:hover:not(:disabled) {
    transform: translateY(1px);
  }
  &:focus:not(:disabled) {
    text-decoration: underline;
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    border: $border solid $button-border-dark;
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--color-light);
    border-color: var(--color-light);
  }
  &.block {
    display: block;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  @keyframes animate {
    from {
      transform: translateZ(0) scale(1);
    }
    to {
      transform: translateZ(0) scale(1.05);
    }
  }
  &.animate {
    animation: animate 500ms ease-in-out alternate infinite;
  }

  &.solid {
    color: $button-solid-color;
    background: $button-solid-bg;
    border: $border solid $button-solid-border-dark;
    &:active:not(:disabled) {
      border: $border solid $button-solid-border-dark;
    }
    &:disabled {
      color: $button-solid-color;
      border-color: var(--color-light);
      background: var(--color-light);
    }
  }
}

.button-list {
  width: auto;
  display: inline-block;
  margin: 2px 1px;
  border-radius: $radius;
  overflow: hidden;
  vertical-align: middle;
  border: $border solid $button-border-dark;
  button {
    box-shadow: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
    border: none !important;
    transform: none !important;
    + button {
      border-left: $border solid $button-border-dark !important;
    }
  }
  .option {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

h1,
h2 {
  text-align: center;
  margin: 1rem 0;
  line-height: 1;
  font-weight: $font-weight-normal;
}
h1 {
  font-size: 1.4rem;
  @media (min-width: 700px) {
    font-size: 2rem;
  }
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
  .icon {
    fill: white;
    height: 16px;
    width: 16px;
    @media (min-width: 700px) {
      height: 24px;
      width: 24px;
    }
    @media (min-width: 1024px) {
      height: 36px;
      width: 36px;
    }
  }
}
h2 {
  font-size: 1rem;
  @media (min-width: 700px) {
    font-size: 1.4rem;
  }
  @media (min-width: 1024px) {
    font-size: 1.8rem;
  }
}
.container {
  margin: 0 auto;
  width: 95%;
  max-width: 1200px;
}

.counter-wrapper {
  text-align: center;
  user-select: none;
  .counter {
    display: inline-block;
    font-size: 28px;
    vertical-align: middle;
  }
}
</style>
