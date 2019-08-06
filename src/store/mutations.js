import * as types from './mutation-types'

const mutations ={
     //设置当前歌手
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    }
}

export default mutations
