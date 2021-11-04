num = 10;
$(function() {
  let count = 0
  setInterval(function() {
      if (num < 100) {
          num += 10;
          numT = num + '%';
      } else {
          num = -10;
          /* 背景切换 */
          if (count < 2) {
              count++;
          } else if (count >= 2&&count < 4) {
            /* 背景图 */
            $('div').find('#background').css('background', 'url(bgimg/b01.png) no-repeat');
            count++;
    }
    else if (count >= 4&&count < 6) {
            /* 背景图 */
            count++;
            $('div').find('#background').css('background', 'url(bgimg/b02.png) no-repeat');
    }
    else if (count >= 6&&count< 8) {
            /* 背景图 */
            count++;
            $('div').find('#background').css('background', 'url(bgimg/b03.png) no-repeat');
    }
    else if (count >= 8) {
            /* 背景图 */
        count = 0;
            $('div').find('#background').css('background', 'url(bgimg/bg2.png) no-repeat');
    }

      }
  }, 600);
})