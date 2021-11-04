var audio = document.getElementById("myAudio");
var currentTime = $(".mplayer_curtime");
var durationTime = $(".mplayer_durtime");
var circle = $(".m-circle .a")[0];
var circumference = 2 * Math.PI * 160;
var timer_audio;

$(function(){
        // setInterval("play2()", 100)
        setTimeout("play2()", 2000)
    }
)

function play2() {
  if (audio.paused) {
    audio.paused = false;
    audio.play();
    $(".music-box").addClass("mplaying");
    timer_audio = setInterval(() => {
      if (audio.ended) {
        $(".music-box").removeClass("mplaying");
        currentTime.text("00:00");
        circle.setAttribute("stroke-dasharray", "0 999");
      } else {
        currentTime.text(formatTime(audio.currentTime));
        durationTime.text(formatTime(audio.duration));
        var step = circumference / audio.duration;
        var timeDisplay = Math.floor(audio.currentTime);
        circle.setAttribute(
          "stroke-dasharray",
          "" + timeDisplay * step + " " + circumference
        );
      }
    }, 100);
  }
  // } else {
  //   audio.pause();
  //   $(".music-box").removeClass("mplaying");
  // }
}

function play() {
  if (audio.paused) {
    audio.paused = false;
    audio.play();
    $(".music-box").addClass("mplaying");
    timer_audio = setInterval(() => {
      if (audio.ended) {
        $(".music-box").removeClass("mplaying");
        currentTime.text("00:00");
        circle.setAttribute("stroke-dasharray", "0 999");
      } else {
        currentTime.text(formatTime(audio.currentTime));
        durationTime.text(formatTime(audio.duration));
        var step = circumference / audio.duration;
        var timeDisplay = Math.floor(audio.currentTime);
        circle.setAttribute(
          "stroke-dasharray",
          "" + timeDisplay * step + " " + circumference
        );
      }
    }, 100);
  } else {
    audio.pause();
    $(".music-box").removeClass("mplaying");
  }
}

// 把一个数字time变为格式化后的字符串
function formatTime(time) {
    // console.log(time);
    // 操作符~, 是按位取反的意思，
    // 表面上~~(取反再取反)没有意义，
    // 实际上在js中可以将浮点数变成整数
    time = ~~time;
    var formatTime;
    if (time < 10) {
    formatTime = "00:0" + time;
    } else if (time < 60) {
    formatTime = "00:" + time;
    } else {
    var m = ~~(time / 60);
    if (m < 10) {
        m = "0" + m;
    }
    var s = time % 60;
    if (s < 10) {
        s = "0" + s;
    }
    formatTime = m + ":" + s;
    }
    return formatTime;
}
