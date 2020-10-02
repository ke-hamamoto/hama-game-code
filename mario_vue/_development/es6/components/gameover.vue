<template>
  <div class="gameover" v-if="gameState.result === 'renderGameOver'">
    <div>
      <p>残念です。あなたは死にました。</p>
      <p class="restart" data-game-mode="normal" @click="clickRestart">
        リスタート
      </p>
      <p class="restart" data-game-mode="hard" @click="clickRestart">
        難しくリスタート
      </p>
      <p class="restart" data-game-mode="inferno" @click="clickRestart">
        凄むずリスタート
      </p>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import { FETCH_ARTICLES } from "../mutation-types.js";

export default {
  computed: {
    ...mapState({
      gameState: "gameState",
      cliboEnv: "cliboEnv",
      marioState: "marioState",
    }),
  },
  methods: {
    ...mapMutations({ SET_CLIBOENV: "SET_CLIBOENV", PUSH_CLIBO: "PUSH_CLIBO" }),
    ...mapActions({ initMarioState: "initMarioState" }),
    clickRestart: function (e) {
      if (e.currentTarget.getAttribute("data-game-mode") == "normal") {
        this.gameState.spd = 30;
        this.gameState.spawnSpd = 2000;
      } else if (e.currentTarget.getAttribute("data-game-mode") == "hard") {
        this.gameState.spd = 45;
        this.gameState.spawnSpd = 1000;
      } else if (e.currentTarget.getAttribute("data-game-mode") == "inferno") {
        this.gameState.spd = 60;
        this.gameState.spawnSpd = 500;
      }

      this.gameState.renderTimer = null;
      this.gameState.score = 0;
      this.gameState.result = "continue";

      this.cliboEnv.cliboArr = [];

      this.initMarioState({
        posX: 0, //マリオの存在X軸
        tempPosX: 0, //マリオの直前の存在X軸
        posY: 0, //マリオの存在Y軸
        jumpVec: "over", //マリオのジャンプ方向
        jumpSpd: 7.5, //マリオのジャンプ速度
        jumpLimit: 100, //マリオのジャンプ高さ上限
        jumpFlg: false, //マリオがジャンプ中であるかのフラグ
        marioHeight: 48, //マリオの高さ
        marioWidth: 52, //マリオの幅
      }) //マリオインスタンス生成
        .then(() => {
          this.marioState.styleObj.left = `${this.marioState.posX}px`;
          this.marioState.styleObj.bottom = `${this.marioState.posY}px`;
          this.marioState.attrObj.dataMarioStts = "alive";
        });

      this.cliboEnv.addTimer = null;
      this.cliboEnv.Class.cliboArr = [];
      this.cliboEnv.cliboId = 1;

      setTimeout(() => {
        this.cliboEnv.Class.add({ vm: this });
      }, this.gameState.spawnSpd);

      this.gameState.Class.render({ vm: this });
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.gameover {
  z-index: 3;
  height: 100%;
  width: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
}

.gameover > div {
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 2em;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.restart {
  background: #999;
  border-radius: 50px;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 8px;
}
</style>
