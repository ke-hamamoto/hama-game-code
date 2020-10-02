<template>
  <div>
    <Gameover />
    <div
      class="field"
      @mousemove="mouseMov({ e: $event })"
      @click="mouseClick({ e: $event })"
    >
      <Score />
      <MoveArea />
      <Ground />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { SET_GAMESTATE } from "../mutation-types.js";

import $ from "jquery";
import Score from "./score";
import MoveArea from "./move_area";
import Ground from "./ground";
import Gameover from "./gameover";

export default {
  components: {
    Score,
    MoveArea,
    Ground,
    Gameover,
  },
  computed: {
    ...mapState({
      gameState: "gameState",
      cliboEnv: "cliboEnv",
      marioState: "marioState",
    }),
  },
  methods: {
    ...mapActions({ initGameState: "initGameState", renderAct: "renderAct" }), //マッピング
    mouseMov: function ({ e }) {
      this.marioState.move({ vm: this, e: e });
    },
    mouseClick: function ({ e }) {
      this.marioState.jump({ e: e });
    },
  },
  data() {
    return {
      GAME: class {
        //ゲームクラス

        constructor() {}

        static render({ vm }) {
          //ゲーム画面レンダリングメソッド
          vm.marioState.jumpMov({ vm: vm }); //マリオの座標計算（マリオのスタティックオブジェクトより）

          vm.cliboEnv.cliboArr.forEach((clibo) => {
            //クリボーのインスタンス格納配列を走査（クリボーのスタティック配列より）
            if (clibo.stts == "alive") clibo.move(clibo); //クリボーの座標計算
            if (
              vm.gameState.Class.atariHantei({ vm: vm, clibo: clibo }) ==
              "clibo-death"
            ) {
              //当たり判定を行った結果、クリボーが死んだかどうか？
              clibo.attrObj.dataCliboStts = "death";

              document
                .querySelector(".clibo")
                .addEventListener("transitionend", () => {
                  vm.cliboEnv.cliboArr = vm.cliboEnv.cliboArr.filter(
                    (clibo) => clibo.stts == "alive"
                  ); //クリボーのインスタンス配列から生きているクリボーだけ選別
                });
            }
          });

          if (vm.gameState.result != "gameover")
            vm.gameState.renderTimer = setTimeout(
              vm.gameState.Class.render,
              1000 / vm.gameState.spd,
              { vm: vm }
            );
          //ゲームオーバーになっていない場合、画面の再レンダリング
          else {
            //ゲームオーバーの時

            clearTimeout(vm.gameState.renderTimer);
            clearTimeout(vm.cliboEnv.addTimer);

            $(".clibo").addClass("cliboVic");
            let animated = document.querySelector(".cliboVic");

            animated.addEventListener("animationend", () => {
              //ゲームオーバー画面描画
              vm.gameState.result = "renderGameOver";
            });
            setTimeout(() => {
              if (
                vm.gameState.result == "gameover" &&
                vm.gameState.result != "renderGameOver"
              )
                vm.gameState.result = "renderGameOver";
            }, 3000);
          }
        }

        static atariHantei({ vm, clibo }) {
          //当たり判定を行う静的メソッド

          if (vm.gameState.result == "gameover") return; //ゲームオーバー時は処理中断

          if (
            vm.marioState.posX + vm.marioState.marioWidth / 2 <
              clibo.posX + clibo.cliboWidth &&
            vm.marioState.posX + vm.marioState.marioWidth / 2 > clibo.posX
          ) {
            //互いのX軸が範囲内かどうか
            if (
              vm.marioState.posY >= clibo.cliboHeight &&
              vm.marioState.posY < clibo.cliboHeight + 10
            ) {
              //互いのY軸が範囲内かどうか

              let point = Math.pow(
                vm.marioState.posX +
                  vm.marioState.marioWidth / 2 -
                  clibo.posX +
                  clibo.cliboWidth,
                2
              ); //スコアの算出

              vm.gameState.score += point;
              clibo.stts = "death";
              return "clibo-death"; //クリボーの死を知らせる
            } else if (
              $("#clibo-" + clibo.id).attr("data-clibo-stts") != "death" &&
              vm.marioState.posY < clibo.cliboHeight
            ) {
              vm.gameState.result = "gameover";
              $("#mario").attr("data-mario-stts", "death");
              vm.marioState.attrObj.dataMarioStts = "death";
            }
          }
          return true;
        }
      },
    };
  },
  created() {
    this.initGameState({
      maxEnem: 20, //クリボーの上限数
      spd: 30, //ゲームのスピード
      spawnSpd: 2000, //クリボーの出現頻度
      score: 0, //初期スコア
      result: "continue",
      renderTimer: null,
      Class: this.GAME,
    }).then(() => {
      this.GAME.render({ vm: this });
    });
  },
  mounted() {},
  destroyed() {},
};
</script>
