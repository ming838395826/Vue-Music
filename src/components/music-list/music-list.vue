<template>

  <div class="music-list">
    <div class="back">
        <i class="icon-back" @click="back()"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" ref="list" class="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>

      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>

  </div>

</template>

<script>
  import Scroll from 'base/srcoll/scroll'
  import SongList from 'components/song-list/song-list'
  import Loading from 'base/Loading/Loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'

  const RESERVED_HEIGHT = 40 //头部高度
  const transform = prefixStyle('transform')//生成属于该浏览器的属性
  const filter = prefixStyle('filter')//生成属于该浏览器的属性
  const backdrop = prefixStyle('backdrop-filter')

  export default{
    props: {
      title: {
        type: String,
        default:""
      },
      songs:{
        type:Array,
        default:{}
      },
      bgImage: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created(){
      this.probeType = 3
      this.listenScroll = true
    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight //背景图标高度
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT //加头部 等于背景图最大滑动的距离 不然会透明
      this.$refs.list.$el.style.top = `${this.imageHeight}px`  //设置背景层的一开始距离顶部的高度
    },
    components: {
      Scroll,
      SongList,
      Loading
    },
    methods: {
      back() {
         this.$router.back();
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(song,index){
        this.selectPlay({
          list: this.songs,
          index
        })
        // selectPlay(songs,index)
      },
      random(){
        console.log('数组传入'+this.songs)
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    computed: {
      //生成背景
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch: {
      scrollY(newValue) {
        let translateY=Math.max(this.minTransalteY, newValue)
        let zIndex=0
        let blur = 0
        let scale=1//默认不放大
        let percent= Math.abs(newValue / this.imageHeight)//得到比例
        if(newValue>0){//向下滑动 进行放大特效
          scale=1+percent
          zIndex = 10
        }else {
          //设置背景虚化
          blur = Math.min(20, percent * 20)
        }
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)` //设置背景层跟随滑动
        this.$refs.layer.style[filter] = `blur(${blur}px)`
        this.$refs.bgImage.style[backdrop] = `blur(${blur}px)`
        if(newValue < this.minTransalteY){//如果大于移动高度 就是已经超出 将背景层覆盖在上面 这样字就不会出去
            zIndex=10
            this.$refs.bgImage.style.paddingTop = '0%'
            this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px` //设置为标题高度
            this.$refs.playBtn.style.display = 'none'
        }else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`  //放大特效
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      top:30%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
