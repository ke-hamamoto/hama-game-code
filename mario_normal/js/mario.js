class GAME {//ゲームクラス

  constructor() { }

  static render() {//ゲーム画面レンダリングメソッド

    MARIO.char.jumpMov();//マリオの座標計算（マリオのスタティックオブジェクトより）

    CLIBO.cliboArr.forEach(clibo => {//クリボーのインスタンス格納配列を走査（クリボーのスタティック配列より）
      clibo.move(clibo);//クリボーの座標計算
      if (GAME.atariHantei(clibo) == "clibo-death") {//当たり判定を行った結果、クリボーが死んだかどうか？
        $("#clibo-" + clibo.id).attr("data-clibo-stts", "death");
      }
    });

    CLIBO.cliboArr = CLIBO.cliboArr.filter(clibo => clibo.stts == "alive");//クリボーのインスタンス配列から生きているクリボーだけ選別

    if (GAME.result != "gameover") GAME.renderTimer = setTimeout(GAME.render, 1000 / GAME.spd);//ゲームオーバーになっていない場合、画面の再レンダリング
    else {//ゲームオーバーの時

      $(".clibo").addClass("cliboVic");
      let animated = document.querySelector('.cliboVic');

      animated.addEventListener('animationend', () => {//ゲームオーバー画面描画

        $("body").prepend(`<div class="gameover"><div>
        <p>残念です。あなたは死にました。</p>
        <p class="restart" data-game-mode="normal">リスタート</p>
        <p class="restart" data-game-mode="hard">難しくリスタート</p>
        <p class="restart" data-game-mode="inferno">凄むずリスタート</p>
        </div></div>`);

      });
    }

  }

  static atariHantei(clibo) {//当たり判定を行う静的メソッド

    if (GAME.result == "gameover") return;//ゲームオーバー時は処理中断

    if (MARIO.char.posX + MARIO.char.marioWidth / 2 < clibo.posX + clibo.cliboWidth &&
      MARIO.char.posX + MARIO.char.marioWidth / 2 > clibo.posX) {//互いのX軸が範囲内かどうか
      if (MARIO.char.posY >= clibo.cliboHeight && MARIO.char.posY < clibo.cliboHeight + 10) {//互いのY軸が範囲内かどうか

        let point = Math.pow(MARIO.char.posX + MARIO.char.marioWidth / 2 - clibo.posX + clibo.cliboWidth, 2);//スコアの算出
        GAME.score += point;
        $(".score").text(GAME.score);//スコアの描画

        clibo.stts = "death";
        $("#clibo-" + clibo.id).attr("data-clibo-stts", "death");
        return "clibo-death";//クリボーの死を知らせる

      }
      else if ($("#clibo-" + clibo.id).attr("data-clibo-stts") != "death" &&
        MARIO.char.posY < clibo.cliboHeight) {

        GAME.result = "gameover";
        $("#mario").attr("data-mario-stts", "death");

      }
    }
    return true;
  }

}

class MARIO {//マリオクラス

  constructor(c) {

    this.posX = c.posX;//マリオの存在X軸
    this.tempPosX = c.posX;//マリオの直前の存在X軸
    this.posY = c.posY;//マリオの存在Y軸
    this.jumpVec = "over";//マリオのジャンプ方向
    this.jumpSpd = 7.5;//マリオのジャンプ速度
    this.jumpLimit = 100;//マリオのジャンプ高さ上限
    this.jumpFlg = false;//マリオがジャンプ中であるかのフラグ
    this.marioHeight = 48;//マリオの高さ
    this.marioWidth = 52;//マリオの幅

  }

  move() {//マウス移動によるX座標の算出

    let _this = this;//thisの退避
    let $id = $("#mario");
    $(window).on('mousemove', function (e) {

      _this.posX = e.pageX;
      $id.css({ "left": _this.posX });
      if (_this.posX < _this.tempPosX) $id.css({ "transform": "rotateY(180deg)" });
      else if (_this.posX >= _this.tempPosX) $id.css({ "transform": "rotateY(0deg)" });
      _this.tempPosX = _this.posX;

    });

  }

  jump() {//マウスクリックによるジャンプイベントの発火

    let _this = this;
    let $id = $("#mario");
    $(window).on('click', function (e) {
      if (_this.jumpFlg == false && _this.posY <= 0) _this.jumpFlg = true;
    });

  }

  jumpMov() {//上がって落ちるというジャンプの挙動を制御するメソッド

    if (this.jumpFlg) {

      if (this.jumpVec == "over" && this.posY < this.jumpLimit) {
        this.posY += this.jumpSpd;
        $("#mario").css({ "bottom": this.posY });
      }
      else if (this.jumpVec == "over" && this.posY >= this.jumpLimit) this.jumpVec = "under";

      if (this.jumpVec == "under" && this.posY > 0) {
        this.posY -= this.jumpSpd;
        $("#mario").css({ "bottom": this.posY });
      }
      else if (this.jumpVec == "under" && this.posY <= 0) {
        this.jumpVec = "over";
        this.jumpFlg = false;
        this.posY = 0;
        $("#mario").css({ "bottom": this.posY });
      }
    }
  }

}

class CLIBO {//クリボークラス

  constructor(c) {

    this.id = c.id;//クリボーの個体識別子
    this.stts = "alive";//クリボーの生存状況
    this.muki = "right";//クリボーの移動向き
    this.movSpd = 5;//クリボーの移動速度
    this.posX = c.posX;//クリボーの存在X座標
    this.cliboHeight = 46;//クリボーの高さ
    this.cliboWidth = 48;//クリボーの幅

  }

  move(clibo) {//クリボーの移動メソッド

    if (clibo.muki == "right" && clibo.posX + clibo.movSpd + clibo.cliboWidth > $(".move_area").width()) clibo.muki = "left";
    else if (clibo.muki == "left" && clibo.posX - clibo.movSpd < 0) clibo.muki = "right";

    if (clibo.muki == "right") clibo.posX += clibo.movSpd;
    else if (clibo.muki == "left") clibo.posX -= clibo.movSpd;

    $("#clibo-" + clibo.id).css({ "left": clibo.posX + "px" });

  }

  static add() {//クリボーの追加メソッド

    if (GAME.result == "gameover") {//ゲームオーバーの時は増やさない
      return;
    }

    if (CLIBO.cliboArr.length < GAME.maxEnem) {//クリボーの存在上限にたっしているかどうか

      let clibo = new CLIBO({ id: CLIBO.cliboId, posX: ($(".move_area").width() / 2 - 24) });//クリボーインスタンス生成
      CLIBO.cliboArr.push(clibo);//インスタンスをスタティック配列に格納

      clibo.movSpd = Math.ceil(Math.random() * 10);
      clibo.muki = Math.ceil(Math.random() * 2) == 2 ? "left" : "right";

      $(".move_area").append(`<div class="clibo" id="clibo-${CLIBO.cliboId}" data-clibo-stts="alive"><img src="./images/mario_03.png" /></div>`);
      $("#clibo-" + CLIBO.cliboId).css({ "left": clibo.posX + "px" });

      CLIBO.cliboId++;//クリボー識別子更新
      CLIBO.addTimer = setTimeout(CLIBO.add, GAME.spawnSpd);//数秒後に追加

    }
    else CLIBO.addTimer = setTimeout(CLIBO.add, GAME.spawnSpd);//数秒後に追加

  }

}

$(() => {

  GAME.maxEnem = 20;//クリボーの上限数
  GAME.spd = 30;//ゲームのスピード
  GAME.spawnSpd = 2000;//クリボーの出現頻度
  GAME.score = 0;//初期スコア
  GAME.result = "continue";
  GAME.renderTimer = null;

  $(".score").text(GAME.score);

  let mario = new MARIO({ posX: 0, posY: 0 });//マリオインスタンス生成
  $("#mario").css({ "left": mario.posX + "px", "bottom": mario.posY + "px" });
  MARIO.char = mario;
  mario.move();//移動用にマウスムーブの受付
  mario.jump();//ジャンプ用にマウスクリックの受付

  CLIBO.addTimer = null;
  CLIBO.cliboArr = [];
  CLIBO.cliboId = 1;
  CLIBO.add();//クリボーの追加

  GAME.render();//画面レンダリング開始

  $(document).on("click", ".restart", function () {//リスタートの場合

    clearTimeout(GAME.renderTimer);
    clearTimeout(CLIBO.addTimer);
    if ($(this).attr("data-game-mode") == "normal") {
      GAME.spd = 30;
      GAME.spawnSpd = 2000;
    }
    else if ($(this).attr("data-game-mode") == "hard") {
      GAME.spd = 45;
      GAME.spawnSpd = 1000;
    }
    else if ($(this).attr("data-game-mode") == "inferno") {
      GAME.spd = 60;
      GAME.spawnSpd = 500;
    }
    GAME.score = 0;
    GAME.result = "continue";
    GAME.renderTimer = null;

    $(".score").text(GAME.score);
    $(".gameover").remove();
    $("#mario").remove();
    $(".clibo").remove();
    $(".move_area").append(`<div id="mario" data-mario-stts="alive"><img src="./images/mario_01.png" /></div>`);

    let mario = new MARIO({ posX: 0, posY: 0 });
    $("#mario").css({ "left": mario.posX + "px", "bottom": mario.posY + "px" });
    MARIO.char = mario;
    mario.move();
    mario.jump();

    CLIBO.addTimer = null;
    CLIBO.cliboArr = [];
    CLIBO.cliboId = 1;
    CLIBO.add();

    GAME.render();

  });

});