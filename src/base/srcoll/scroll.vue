<template>
	<div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default{
    props: {
      click: {
        type: Boolean,
        default:true
      },
      probeType: {
        type: Number,
        default: 1
      },
      data:{
        type:Array,
        default:null
      },
      listenScroll:{
        type:Boolean,
        default:false
      }
    },
    mounted(){
      setTimeout(()=>{
        this._initScroll()
      },20)
    },
		methods: {
			_initScroll(){
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll=new BScroll(this.$refs.wrapper,{
            click:this.click,
            probeType:this.probeType,
            /* 1 滚动的时候会派发scroll事件，会截流。
               2 滚动的时候实时派发scroll事件，不会截流。
               3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件     */
        })
        if(this.listenScroll){//如果需要监听
            let me=this
            this.scroll.on('scroll', (pos) => {
                me.$emit('scroll', pos)
            })
        }

        this.scroll.refresh();
			},
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
		},
    watch: {
      data(){
        setTimeout(()=>{
          this.refresh()
        },20)
      }
    },
	}
</script>

<style>
</style>
