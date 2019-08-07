import * as types from './mutation-types'

export const selectPlay=function({commit, state}, {list, index}){
  commit(types.SET_SEQUENCE_LIST, list)// 设置播放数组
  commit(types.SET_PLAYLIST, list)//设置数组
  commit(types.SET_PLAY_MODE, list)// 设置数组
  commit(types.SET_FULL_SCREEN, true) //设置全屏
  commit(types.SET_CURRENT_INDEX, index) //设置当前播放位置
  commit(types.SET_PLAYING_STATE, true) //设置播放
}
