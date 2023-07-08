const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
	autoplay: true, //自动播放
    audio: [
	{
        name: "Blind faith",
        artist: 'LinG',
        url: 'http://music.163.com/song/media/outer/url?id=1426572175.mp3',
        cover: 'https://p1.music.126.net/zRR00_u7IY2h52YxiTXdKA==/109951164748120892.jpg',	
    },
	]
});
