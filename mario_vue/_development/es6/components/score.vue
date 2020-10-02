<template>
  <div class="score">{{ Math.round(gameState.score) }}</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { FETCH_ARTICLES } from "../mutation-types.js";

export default {
  computed: {
    ...mapState({ gameState: "gameState" }),
  },
  methods: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.score {
  z-index: 1;
  position: fixed;
  right: 0.5em;
  top: 0.5em;
  color: #853;
  font-size: 1.5em;
  font-weight: bold;
}
</style>
