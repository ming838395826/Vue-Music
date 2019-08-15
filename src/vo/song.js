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
    url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400002TRY4a3zfxC8.m4a?guid=4396599684&vkey=FEF02BE93140957A168337C06DA0B8A12BBDADD98D4978823C68CD4092EB917A400E125D5546D23D14CDB2F08968B0F5DB81B696F1459D3F&uin=0&fromtag=38`
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
