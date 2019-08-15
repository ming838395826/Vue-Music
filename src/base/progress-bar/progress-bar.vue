<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16 //按钮宽度
  const transform = prefixStyle('transform')

  export default{
    props: {
      percent: {
        type: Number,
        default: 0
      },
    },
    created() {
      this.touch = {}
    },
    methods:{
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX  //记录按下去的X坐标
        this.touch.left = this.$refs.progress.clientWidth  //记录按下去的长
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX  //拖动距离
        //拖到距离加 原先的进度 得到现在 限制大小 在此区间内
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        // console.log('测试')
        this.touch.initiated = false
        this._triggerPercent()
      },
       _triggerPercent() {
         //获取总长
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent(newValue, oldValue) {
        if(newValue>0&&!this.touch.initiated){ //加判断 避免拖到滑动 又闪回去以前
          const barWidth=this.$refs.progressBar.clientWidth - progressBtnWidth //总长度
          const offsetWidth = newValue * barWidth  //得到应该展示的长度
          this._offset(offsetWidth)
        }
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
