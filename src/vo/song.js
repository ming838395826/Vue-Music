export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C400003YYX4K3gTZBT.m4a?guid=4396599684&vkey=F427ACFB2DB8F64ACCBFB61AFBF5B726ED5B2F6A3D0C881CCD2FDA2C76CA5C61C755B842CA071ABFF43A7F64FF4E55E10AB669A1032E51A9&uin=0&fromtag=66`
  })
}

function filterSinger(singer){
    let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
