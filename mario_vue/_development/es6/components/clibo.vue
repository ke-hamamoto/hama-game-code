<template>
  <div>
    <div
      v-for="clibo in cliboEnv.cliboArr"
      :key="clibo.id"
      :id="makeCliboId(clibo.id)"
      :style="clibo.styleObj"
      :data-clibo-stts="clibo.attrObj.dataCliboStts"
      class="clibo"
    >
      <img src="./images/mario_03.png" />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import {} from "../mutation-types.js";

export default {
  computed: {
    ...mapState({
      cliboEnv: "cliboEnv",
      gameState: "gameState",
    }),
  },
  methods: {
    ...mapMutations({ SET_CLIBOENV: "SET_CLIBOENV", PUSH_CLIBO: "PUSH_CLIBO" }),
    ...mapActions({}),
    makeCliboId: function (id) {
      return `clibo-${id}`;
    },
  },
  data() {
    return {
      CLIBO: class {
        constructor(c) {
          this.id = c.id; //クリボーの個体識別子
          this.stts = "alive"; //クリボーの生存状況
          this.muki = "right"; //クリボーの移動向き
          this.movSpd = 5; //クリボーの移動速度
          this.posX = c.posX; //クリボーの存在X座標
          this.cliboHeight = 46; //クリボーの高さ
          this.cliboWidth = 48; //クリボーの幅
          this.styleObj = { left: `${c.posX}px` };
          this.attrObj = { dataCliboStts: "alive" };
        }

        move(clibo) {
          //クリボーの移動メソッド

          if (
            clibo.muki == "right" &&
            clibo.posX + clibo.movSpd + clibo.cliboWidth >
              $(".move_area").width()
          )
            clibo.muki = "left";
          else if (clibo.muki == "left" && clibo.posX - clibo.movSpd < 0)
            clibo.muki = "right";

          if (clibo.muki == "right") clibo.posX += clibo.movSpd;
          else if (clibo.muki == "left") clibo.posX -= clibo.movSpd;

          clibo.styleObj.left = `${clibo.posX}px`;
        }

        static add({ vm }) {
          if (vm.gameState.result == "gameover") {
            //ゲームオーバーの時は増やさない
            return;
          }
          if (vm.cliboEnv.cliboArr.length < vm.gameState.maxEnem) {
            //クリボーの存在上限にたっしているかどうか

            let clibo = new vm.cliboEnv.Class({
              id: vm.cliboEnv.cliboId,
              posX: $(".move_area").width() / 2 - 24,
            }); //クリボーインスタンス生成
            vm.PUSH_CLIBO(clibo);

            clibo.movSpd = Math.ceil(Math.random() * 10);
            clibo.muki = Math.ceil(Math.random() * 2) == 2 ? "left" : "right";

            vm.cliboEnv.addTimer = setTimeout(
              vm.cliboEnv.Class.add,
              vm.gameState.spawnSpd,
              { vm }
            ); //数秒後に追加
            vm.SET_CLIBOENV({ cliboId: vm.cliboEnv.cliboId + 1 });
          } else
            vm.cliboEnv.addTimer = setTimeout(
              vm.cliboEnv.Class.add,
              vm.gameState.spawnSpd,
              { vm }
            ); //数秒後に追加
        }
      },
    };
  },
  created() {
    this.SET_CLIBOENV({ Class: this.CLIBO });
  },
  mounted() {
    setTimeout(() => {
      this.CLIBO.add({ vm: this });
    }, this.gameState.spawnSpd);
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.clibo {
  z-index: 1;
  height: 46px;
  position: absolute;
  bottom: 0;
  transition: transform 0.25s, opacity 1s;
}

[data-clibo-stts="death"] {
  transform: rotateZ(-180deg);
  opacity: 0;
}

.cliboVic {
  animation: cliboVic 1s;
}

@keyframes cliboVic {
  0% {
    margin-bottom: 0;
  }

  25% {
    margin-bottom: 10px;
  }

  50% {
    margin-bottom: 0;
  }

  75% {
    margin-bottom: 10px;
  }

  100% {
    margin-bottom: 0;
  }
}
</style>
