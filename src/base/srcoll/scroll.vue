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
      data:{
        type:Array,
        default:null
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
            click:this.click
        })

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
