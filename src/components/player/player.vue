<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
          <div class="background">
            <img width="100%" height="100%" :src="currentSong.image">
          </div>

          <div class="top">
            <div class="back" @click="back">
              <i class="icon-back"></i>
            </div>
            <h1 class="title"  v-html="currentSong.name"></h1>
            <h2 class="subtitle"  v-html="currentSong.singer"></h2>
          </div>

          <div class="middle">
             <div class="middle-l" ref="middleL">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="this.playing ? 'play' : 'play pause'">
                    <img class="image" :src="currentSong.image">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric"></div>
                </div>
             </div>
          </div>

          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot"></span>
              <span class="dot"></span>
            </div>

            <div class="progress-wrapper">
              <span class="time time-l">{{formatTime(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :percent="percent" @percentChange="setPercent"></progress-bar>
              </div>
              <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
            </div>

            <div class="operators" >
              <div class="icon i-left" @click="changeMode">
                <i :class="iconMode"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i class="icon-prev" @click="prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i @click="togglePlaying" :class="this.playing ? 'icon-pause' : 'icon-play'"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i class="icon-next" @click="next"></i>
              </div>
              <div class="icon i-right">
                <i class="icon" ></i>
              </div>
            </div>
          </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
          <div class="icon">
            <img width="40" height="40" :src="currentSong.image">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control">
            <progress-circle :radius="radius" :percent="percent">
              <i @click.stop="togglePlaying" class="icon-mini" :class="this.playing ? 'icon-pause-mini' : 'icon-play-mini'"></i>
            </progress-circle>
          </div>
          <div class="control" >
            <i class="icon-playlist"></i>
          </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @end="end" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>

  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import progressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'

  const transform = prefixStyle('transform')
  export default{
    components: {
      progressBar,
      ProgressCircle
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      disableCls(){
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      iconMode(){
        let className=''
        switch (this.mode){
          case playMode.sequence:
            className='icon-sequence'
            break;
          case playMode.loop:
            className='icon-loop'
            break;
          case playMode.random:
            className='icon-random'
            break;
          default:
            className='icon-sequence'
            break;
        }
        return className
      },
      ...mapGetters([
        'currentIndex',
        'fullScreen',
        'playing',
        'currentSong',
        'playlist',
        'mode',
        'sequenceList'
      ])
    },
    watch:{
      playing(newPlaying){
        const audio = this.$refs.audio //获取播放器
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause()
        })
      },
      currentSong(newSong, oldSong){
        if (newSong.id === oldSong.id) {
          return
        }
        //歌曲改变播放
        const audio = this.$refs.audio //获取播放器
        this.$nextTick(()=>{
          audio.play();
          this.getLyric()
        })
      }
    },
    data(){
      return{
          songReady: false,
          currentTime: 0,
          radius:32,
          currentLyric:null 
      }
    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open(){
        this.setFullScreen(true)
      },
      setPercent(percent){
        this.currentTime=this.currentSong.duration*percent
        this.$refs.audio.currentTime=this.currentTime
      },
      formatTime(interval){
        //格式化日期
        interval = interval | 0
        const minute = interval / 60 | 0  //取整数
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        // if (this.currentLyric) {
        //   this.currentLyric.seek(0)
        // }
      },
      togglePlaying() {
        //控制播放暂停
        if (!this.songReady) {//还没准备好 就没反应
          return
        }
        this.setPlayingState(!this.playing)
      },
      changeMode(){
        //切换播放状态
        const currentMode=(this.mode+1)%3
        this.setPlayMode(currentMode)
        let list=this.sequenceList
        if(this.mode===playMode.random){//随机
            list=shuffle(this.playlist)
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){
        console.log('切换模式'+list)
        let index=list.findIndex((item)=>{
          return item.id===this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      prev(){
        if (!this.songReady) {//还没准备好 就没反应
          return
        }
        if (this.playlist.length === 1) {//如果没播放 点击下一首上一首 实现播放
          this.loop()
          return
        }
        let index = this.currentIndex - 1
        if(index<0){
          index=this.playlist.length-1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {//如果没播放 点击下一首上一首 实现播放
            this.togglePlaying()
        }
      },
      next(){
        if (!this.songReady) {//还没准备好 就没反应
          return
        }
        if (this.playlist.length === 1) {//只有一条
          this.loop()
          return
        }
        let index = this.currentIndex + 1
        if(this.playlist<index){
           index=0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {//如果没播放 点击下一首上一首 实现播放
            this.togglePlaying()
        }
      },
      ready(){
          this.songReady=true
      },
      error(){
           //加载完毕,可以点击
          this.songReady=true;
      },
      end(){
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      enter(el, done){
         const {x, y, scale} = this._getPosAndScale() //返回坐标 和缩放比例
         let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 1000,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done){
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
          const targetWidth = 40  //小图标大小
          const paddingLeft = 40  //左边距
          const paddingBottom = 30  //地边距
          const paddingTop = 80
          const width = window.innerWidth * 0.8  //大圆宽度
          const scale = targetWidth / width  //计算出缩放比例
          const x = -(window.innerWidth / 2 - paddingLeft)  //从左到右
          const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
          return {
             x,
             y,
             scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode:'SET_PLAY_MODE',
        setPlayList:'SET_PLAYLIST'
      })
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
