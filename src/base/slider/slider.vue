<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
		  <slot>
		  </slot>
		</div>
		<div class="dots">
		  <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {addClass} from 'common/js/dom'
	import BScroll from 'better-scroll'
	export default {
		name: 'slider',
		props: {
			loop: {
				type: Boolean,
				default: true
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 4000
			}
		},
		data() {
			 return {
				dots: [],
				currentPageIndex: 0
			 }
		},
		mounted() {
			setTimeout(() => {
				this._setSliderWidth()
				this._initDots()
				this._initSlider()
				if (this.autoPlay) {
				  this._play()
				}
			 }, 20)
			 //监听窗口改变的大小
			 window.addEventListener('resize', () => {
				if (!this.slider) {
				  return
				}
				this._setSliderWidth(true)
				this.slider.refresh()
			 })
		},
		deactivated() {
			clearTimeout(this.timer)
		},
		beforeDestroy() {
			clearTimeout(this.timer)
		},
		methods:{
			_setSliderWidth(isResize){
				this.children = this.$refs.sliderGroup.children
				let width = 0  //测量轮播图宽度
				let sliderWidth = this.$refs.slider.clientWidth
				for (let i = 0; i < this.children.length; i++) {
				  let child = this.children[i]
				  addClass(child, 'slider-item') //添加样式

				  child.style.width = sliderWidth + 'px' //设定宽度
				  width += sliderWidth
				}
				
				if(this.loop&& !isResize){//循环会字段头尾加多2个位置
					width += 2 * sliderWidth
				}
				this.$refs.sliderGroup.style.width = width + 'px'//设定宽度
			},
			_initDots() {
				this.dots=new Array(this.children.length)
			},
			_initSlider() {
				this.slider = new BScroll(this.$refs.slider, {
					  scrollX: true,
					  scrollY: false,
					  momentum: false,
					  snap: true,
					  snapLoop: this.loop,
					  snapThreshold: 0.3,
					  snapSpeed: 400
				})
				this.slider.on("scrollEnd",()=>{
					let pageIndex=this.slider.getCurrentPage().pageX
					if(this.loop){//如果循环 头尾会相加 所以要减一
						pageIndex=pageIndex-1
					}
					this.currentPageIndex=pageIndex;
					clearTimeout(this.timer);
					if(this.autoPlay){
						this._play()
					}
				})
				this.slider.on('beforeScrollStart', () => {
				  if (this.autoPlay) {
					clearTimeout(this.timer)
				  }
				})
			},
			_play(){
				let pageIndex = this.currentPageIndex + 1
				if (this.loop) {
				  pageIndex += 1
				}
				this.timer = setTimeout(() => {
				  this.slider.goToPage(pageIndex, 0, 400)
				}, this.interval)
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
