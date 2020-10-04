//import "es6-promise/auto";
import Vue from "vue";
import Vuex from 'vuex';
Vue.use(Vuex);
import {
    PUSH_CLIBO, UPDATE_CLIBO, UPDATE_MARIO, SET_GAMESTATE, SET_MARIOSTATE, SET_CLIBOENV
} from "./mutation-types";

const state = {//状態(state)の定義
    gameState: { Class: null },
    cliboEnv: {
        cliboId: 1, cliboArr: [], addTimer: null, Class: null
    },
    marioState: {}
}

const mutations = {//同期的に状態(state)の変更を管理
    //以下、第一引数state、第二引数payload
    [SET_GAMESTATE]({ gameState }, pl) {
        state.gameState = { ...gameState, ...pl };//オブジェクトの更新
    },
    [SET_CLIBOENV](state, pl) {
        for (let key in pl) {
            Vue.set(state.cliboEnv, key, pl[key]);//キーの更新
        }
    },
    [PUSH_CLIBO](state, clibo) {
        state.cliboEnv.cliboArr.push(clibo);
    },
    [UPDATE_CLIBO]({ cliboEnv }, refreshCliboArr) {//古い配列から新しい配列にする
        state.cliboEnv.cliboArr.splice(0, cliboEnv.cliboArr.length);//配列の更新１
        state.cliboEnv.cliboArr.push(...refreshCliboArr);//配列の更新２
    },
    [SET_MARIOSTATE](state, pl) {

        if (!state.marioState.move) {//メソッドを持つかどうか判別。
            state.marioState = pl;
        }
        else {
            for (let key in pl) {
                Vue.set(state.marioState, key, pl[key]);//キーの更新
            }
        }

    },
    [UPDATE_MARIO]({ marioState }, pl) {//オブジェクトのアップデート
        state.marioState = { ...marioState, ...pl };//オブジェクトの更新
    },
}

const actions = {//非同期処理を管理(promiseを返す)
    //以下、第一引数context={ state, rootState, commit, dispatch, getters, rootGetters }、第二引数payload
    initGameState(
        { state, rootState, commit, dispatch, getters, rootGetters },//context
        pl//ペイロード
    ) {
        commit(SET_GAMESTATE, pl);
    },
    initMarioState(
        { state, rootState, commit, dispatch, getters, rootGetters },//context
        pl//ペイロード
    ) {
        commit(SET_MARIOSTATE, pl);
    },
}

const getters = {//状態(state)などを加工して返す
    //以下、第一引数state、第二引数getters
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
