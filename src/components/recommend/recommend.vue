<template>
	<div>推荐</div>
</template>

<script>
	import getRecommend from 'api/recommend.js'
	import {
		ERR_OK
	} from 'api/config'
	export default {
		created() {
			_getRecommend();
		},
		methods: {
			_getRecommend() {
				getRecommend().then((res) => {
					console.log(res);
					if (res.code === ERR_OK) {
						// this.recommends = res.data.slider
					}
				})
			}
		}
	}
</script>

<style>
</style>
