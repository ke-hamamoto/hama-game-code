# 1.Vue と Vuex でゲームを作った

マリオを模したシンプルで素朴なゲームです。vue を使ったら、拡張性の高いゲーム作りが可能となりました。<br>
活用したモノは主に Vue と Vuex です。今回は Vuex をメインに取り上げシンプルなゲームプログラムをなぞっていきます。

## 1-1.Vuex とは？

大雑把に言うと、コンポーネント間で共有する値を扱うルールを提供してくれる。
下のような `store.js` というファイルを作ってそこで管理する。

```js
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {}; //状態(state)の定義
const mutations = {}; //同期的に状態(state)の変更を管理
const actions = {}; //非同期処理を管理(promiseを返す)
const getters = {}; //状態(state)などを加工して返す

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
});
```

`Vue`ではコンポーネント間の値のやり取りに`props`を使っていたが、それと同じようなニュアンスで自分は使ってます。

## 1-2. ゲームの構造（ js 部分 ）

**/store.js** …ゲームの状態を持つ<br>
**/components/index.vue** …ゲームのメイン処理用<br>
**/components/mario.vue** …マリオの動きなど<br>
**/components/clibo.vue** …クリボーの動きなど<br>
**/components/gameover.vue** …スコアの表示<br>
**/components/score.vue** …ゲームオーバー画面の表示<br>

# 2.さわろう

コードを触って動きを見ていきます。

## 2-1．マリオを横に動かす

現状、マリオは動かないと思います。
マリオの横の動きは、`index.vue`で扱われます。

```html
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
```

`@mousemove="mouseMov({ e: $event })"`<br>
これは Vue 的な書き方でマウスを動かすたびに呼ばれます。<br>
`$event`は特殊な変数でメソッドにマウスに関するいろいろな値を渡せます。

```js
  methods: {
    ...mapActions({ initGameState: "initGameState", renderAct: "renderAct" }), //マッピング
    mouseMov: function ({ e }) {
      //this.marioState.move({ vm: this, e: e });//ハンズオン
    },
    mouseClick: function ({ e }) {
      this.marioState.jump({ e: e });
    },
  },
```

`//this.marioState.move({ vm: this, e: e });//ハンズオン`<br>
↑ の部分のコメントアウト外せばマリオ動くようになります<br>
ちなみに`this.marioState.move({ vm: this, e: e });`は`mario.vue`の以下の部分で定義されます。

```js
  created() {
    this.initMarioState(new this.MARIO({ posX: 0, posY: 0 })) //マリオインスタンス生成
      .then(() => {
        this.marioState.styleObj.left = `${this.marioState.posX}px`;
        this.marioState.styleObj.bottom = `${this.marioState.posY}px`;
      });
  },
```

そしてこの`this.initMarioState(new this.MARIO({ posX: 0, posY: 0 }))`は Vuex によって扱われます。同じく`mario.vue`の以下の部分でマッピングされています。

```js
  methods: {
    ...mapActions({ initMarioState: "initMarioState" }),
  },
```

こうすることで`mario.vue`内にて`store.js`の以下の部分に対して

```js
const actions = {
  //非同期処理を管理(promiseを返す)
  //以下、第一引数context={ state, rootState, commit, dispatch, getters, rootGetters }、第二引数payload
  initMarioState(
    { state, rootState, commit, dispatch, getters, rootGetters }, //context
    pl //ペイロード
  ) {
    commit(SET_MARIOSTATE, pl);
  },
};
```

`this.initMarioState()`として呼び出せるようになります。

### 2-1-1.コミットについて

さきほど上で`commit(SET_MARIOSTATE, pl);`という一文が出ました。<br>
これは Vuex が結構強めに強いるステート（state）の更新方法です。<br>
Vuex はその思想？からステートの更新は mutations を介して行うことをルールにしています。<br>
実際にルールを破ることでエラーにはならないっぽいですが、それがルールらしいので守ったほうがいいと思います。<br>
なので`commit()`は state を更新するものです。

## 2-2．クリボーを出そう

```js
  mounted() {
    setTimeout(() => {
      //this.CLIBO.add({ vm: this });//ハンズオン
    }, this.gameState.spawnSpd);
  },
```

コメントアウトの部分を外せばクリボーが湧くようになります。
ちなみにこの`this.CLIBO.add()`は`clibo.vue`の`data()`部分に定義された CLIBO クラスのスタティックメソッドです。
Vue において、コンポーネントの data 部や methods 部に定義されたキー値に対しては、そのコンポーネントから`this.キー`でアクセスできます。

## 2-3．画面を動かそう

今、クリボーは動いていません。マリオも横にしか動きません。<br>
今のゲームはどうか知りませんが、昔のゲームは一秒間に何度も画面を書き換えてあたかも、動画のように見せていたらしいです。<br>
なので、これも 1 秒間に 30 回程度書き換えて動いている感を出していきます。<br>
`index.vue`の以下の部分のコメントアウトを外してください。

```js
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
      //this.GAME.render({ vm: this });//ハンズオン
    });
  },
```

`this.GAME.render()`もさきほどのクリボーの部分と同じ理屈です。<br>
そして`this.initGameState()`は上の`this.initMarioState()`と同じ理屈です。
一つ注意できるのが、`this.initGameState()`は`index.vue`の

```js
methods: {
    ...mapActions({ initGameState: "initGameState", renderAct: "renderAct" }), //マッピング
  }
```

の部分にて`store.js`のアクションをマッピングしているので、`then()`で受けることができます。
このプログラムでは非同期通信は行われませんが、もしも API を叩くときがあれば上の性質は有効な働きをすると思われます。

## 2-4．リトライできるようにする

今の状態だと、マリオが死んだらゲームがとまります。なのでリトライ画面が出るようにします。
`index.vue`の以下の部分のコメントアウトを外してください。

```js
setTimeout(() => {
  if (
    vm.gameState.result == "gameover" &&
    vm.gameState.result != "renderGameOver"
  ) {
    //ゲームオーバー画面描画
    //vm.gameState.result = "renderGameOver"; //ハンズオン
  }
}, 1000);
```

`vm.gameState.result = "renderGameOver";`<br>
これは store.js のステートの更新です。本来はミューテーションを介して変更するべきらしいですが、気持ちの問題でできませんでした。
とりあえず値を`renderGameOver`にすることで、`gameover.vue`の以下が作用します。

```html
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
```

`v-if`の部分が肝です。Vue の基本的な構文です。
そしてこのコンポーネント内で`gameState.result`を定義するためには、
Vuex の力を借りて、

```js
  computed: {
    ...mapState({
      gameState: "gameState",
    }),
  }
```

以上のようにします。

# 3.Vuex の利点

props を使うより記述は冗長になりがちだけど、コンポーネントとコンポーネントの間で共通の値を使いまわしやすい。
例えば今回は index.vue から各コンポーネントに対して多くの要求ができたように感じました。

# 4.最後に

今回は nuxt を使わずに、Vue/Vuex を使ってコードを書きました。なので気づいたこともあります。<br>
nuxt は開発環境の構築に必要なものが勝手に気前よく動いてくれる。<br>
今回のような形だ、細かいところで環境の調整を自分でする必要があるのでそういった部分でも nuxt は良いように感じました。<br>
日々、勉強して頭の中をでかくしていきたいです。<br>

---

補足ですが、ゲームつながりで過去にもこんなものを作っていました。これからも何か作っていこうと思います。<br>
ありがとうございました。<br>
[自作サイト](https://www.ainsys.work/chat_node)<br>
id test1~8<br>
pass 00000<br>
