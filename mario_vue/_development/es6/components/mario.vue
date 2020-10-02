<template>
  <div
    id="mario"
    :data-mario-stts="marioState.attrObj.dataMarioStts"
    :style="marioState.styleObj"
  >
    <img src="./images/mario_01.png" />
  </div>
</template>

<script>
import $ from "jquery";
import { mapActions, mapGetters, mapState } from "vuex";
import { FETCH_ARTICLES } from "../mutation-types.js";

export default {
  computed: { ...mapState({ marioState: "marioState" }) },
  methods: {
    ...mapActions({ initMarioState: "initMarioState" }),
  },
  data() {
    return {
      MARIO: class {
        //マリオクラス

        constructor(c) {
          this.posX = c.posX; //マリオの存在X軸
          this.tempPosX = c.posX; //マリオの直前の存在X軸
          this.posY = c.posY; //マリオの存在Y軸
          this.jumpVec = "over"; //マリオのジャンプ方向
          this.jumpSpd = 7.5; //マリオのジャンプ速度
          this.jumpLimit = 100; //マリオのジャンプ高さ上限
          this.jumpFlg = false; //マリオがジャンプ中であるかのフラグ
          this.marioHeight = 48; //マリオの高さ
          this.marioWidth = 52; //マリオの幅
          this.styleObj = {
            left: null,
            bottom: null,
            transform: "rotateY(0deg)",
          };
          this.attrObj = {
            dataMarioStts: "alive",
          };
        }

        move({ vm, e }) {
          //マウス移動によるX座標の算出

          vm.marioState.posX = e.pageX;
          vm.marioState.styleObj.left = `${vm.marioState.posX}px`;
          if (vm.marioState.posX < vm.marioState.tempPosX)
            vm.marioState.styleObj.transform = `rotateY(180deg)`;
          else if (vm.marioState.posX >= vm.marioState.tempPosX)
            vm.marioState.styleObj.transform = `rotateY(0deg)`;
          vm.marioState.tempPosX = vm.marioState.posX;
        }

        jump({ e }) {
          //マウスクリックによるジャンプイベントの発火

          if (this.jumpFlg == false && this.posY <= 0) this.jumpFlg = true;
        }

        jumpMov({ vm }) {
          //上がって落ちるというジャンプの挙動を制御するメソッド

          if (this.jumpFlg) {
            if (this.jumpVec == "over" && this.posY < this.jumpLimit) {
              this.posY += this.jumpSpd;
              vm.marioState.styleObj.bottom = `${this.posY}px`;
            } else if (this.jumpVec == "over" && this.posY >= this.jumpLimit)
              this.jumpVec = "under";

            if (this.jumpVec == "under" && this.posY > 0) {
              this.posY -= this.jumpSpd;
              vm.marioState.styleObj.bottom = `${this.posY}px`;
            } else if (this.jumpVec == "under" && this.posY <= 0) {
              this.jumpVec = "over";
              this.jumpFlg = false;
              this.posY = 0;
              vm.marioState.styleObj.bottom = `${this.posY}px`;
            }
          }
        }
      },
    };
  },
  created() {
    this.initMarioState(new this.MARIO({ posX: 0, posY: 0 })) //マリオインスタンス生成
      .then(() => {
        this.marioState.styleObj.left = `${this.marioState.posX}px`;
        this.marioState.styleObj.bottom = `${this.marioState.posY}px`;
        //this.marioState.move({ vm: this }); //移動用にマウスムーブの受付
        //this.marioState.jump({ vm: this }); //ジャンプ用にマウスクリックの受付
      });
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
#mario {
  z-index: 2;
  height: 48px;
  position: absolute;
  transition: transform 0.5s, opacity 1s, margin 1s;
}

[data-mario-stts="death"] {
  opacity: 0;
  margin-bottom: 200px;
}
</style>
