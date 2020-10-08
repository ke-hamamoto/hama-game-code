<template>
  <div class="move_area">
    <div class="bk_parts" style="left: 15px;">
      <div class="bk_sigemi"></div>
      <div class="bk_dokan"></div>
    </div>
    <div class="bk_parts" style="left: 315px;">
      <div class="bk_sigemi"></div>
      <div class="bk_dokan"></div>
    </div>
    <div class="bk_parts" style="left: 715px;">
      <div class="bk_sigemi"></div>
      <div class="bk_dokan"></div>
    </div>
    <div class="bk_parts" style="left: 1215px;">
      <div class="bk_sigemi"></div>
      <div class="bk_dokan"></div>
    </div>
    <Mario />
    <Clibo />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { FETCH_ARTICLES } from "../mutation-types.js";
import Mario from "./mario";
import Clibo from "./clibo";

export default {
  components: {
    Mario,
    Clibo,
  },
  computed: {},
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
.move_area {
  overflow: hidden;
  position: relative;
  height: calc(100vh - 100px);
  min-height: 500px;
  background: url("./images/mario_06.png");
  background-repeat: repeat-x;
  background-color: #aee;
}

.bk_parts {
  position: absolute;
  bottom: 0;
}

.bk_sigemi {
  position: absolute;
  background: url("./images/mario_05.png");
  background-repeat: no-repeat;
  width: 82px;
  height: 52px;
  bottom: 0;
  transform: rotateY(180deg);
}

.bk_dokan {
  position: absolute;
  background: url("./images/mario_04.png");
  background-repeat: no-repeat;
  width: 106px;
  height: 94px;
  bottom: 0;
  left: 74px;
}
</style>
