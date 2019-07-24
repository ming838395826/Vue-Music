<template>
 <div class="singer" ref="singer">
    <list-view  :data="singers" ref="list"></list-view>
  </div>
</template>

<script>
  import {
    getSingers
  } from 'api/singer.js'
  import Scroll from 'base/srcoll/scroll'
  import ListView from 'base/listview/listview'
  import Singer from 'vo/singer.js'
	import {
		ERR_OK
	} from 'api/config'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'
  export default {
    created(){
      this._getSingers();
    },
    data() {
      return {
        singers: []
      }
    },
    components: {
      Scroll,
      ListView
    },
    methods: {
      _getSingers() {
          getSingers().then((res) => {
          	if (res.code === ERR_OK) {
          		this.singers = this._initNormSingers(res.data.list)
              console.log(this.singers)
          	}
          })
      },
      _initNormSingers(list){
        //筛选成数组处理
        let map={
          hot:{
            title:HOT_NAME,
             items:[]
          }
        }
        list.forEach((item, index,list) =>{
            if(index<=HOT_SINGER_LEN){//选前几个为热门
              map.hot.items.push(new Singer({name:item.Fsinger_name,id:item.Fsinger_mid}))
            }
            const key = item.Findex  //获取字母排序
            if(!map[key]){//如果不包含 创建对象
              map[key]={title:key,items:[]}
            }
            map[key].items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for(let key in map){
          let item=map[key]
          if (item.title.match(/[a-zA-Z]/)) {
            ret.push(item)
          } else if (item.title === HOT_NAME) {
            hot.push(item)
          }
        }
        ret.sort((a,b)=>{
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
