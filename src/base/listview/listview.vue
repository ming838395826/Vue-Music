<template>
  <scroll :data="data" class="listview" ref="listview" :listen-scroll="true" @scroll="scroll" :probeType="3">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li  @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>

    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"  class="item" :class="{'current':currentIndex===index}" :data-index="index">{{item}}
        </li>
      </ul>
    </div>

    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/srcoll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const TITLE_HEIGHT = 30 //置顶头部高度
  const ANCHOR_HEIGHT = 18//字母块高度

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll,
      Loading
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle(){
        if (this.scrollY > 0) {//到最头部 还在那
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data(){
        //检测data变化计算高度
        setTimeout(() => {
          this.listHeight = []
          let height=0
          let itemList=this.$refs.listGroup
          this.listHeight.push(height);//第一个0
          for(let i=0;i<itemList.length;i++){
              let item = itemList[i]
              height += item.clientHeight //获取每一个的高度
              this.listHeight.push(height)
          }
          console.log(this.listHeight)
        }, 20)
      },
      scrollY(newY) {
        //检测Y变化
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for(let i=0;i<listHeight.length-1;i++){
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
           if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
         // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {//在中间 无需要变化
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    data() {
      return {
        currentIndex: 0,
        scrollY:-1,
        diff:-1
      }
    },
    created(){
       this.touch = {}
       this.listHeight = []
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY  //记录第一触碰的坐标
        this.touch.anchorIndex=anchorIndex
        // this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta  //防止相加变字符串
        this.currentIndex=anchorIndex
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        // 指定滑动到的位置
        if (!index && index !== 0) {//点击头尾没触发的位置
          return
        }
        if (index < 0) {//头部
          index = 0
        } else if (index > this.listHeight.length - 2) {//超出 等于最后一个
          index = this.listHeight.length - 2
        }
        this.currentIndex=index
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll(pos) {
        //传递滑动事件
        this.scrollY = pos.y
      },
      selectItem(item){
        this.$emit("selectItem",item)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
