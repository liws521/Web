// 把代码放在块里, 用let声明块作用域的变量
// 避免与其他js中的变量重名
{
    // 球坐标系的半径radius
    let radius = 150;
    // 为每一个超链接a创建一个oTag对象, 存储在这个mcList数组里
    let mcList = [];
    // 球是否处于激活状态
    let active = false;
    // 存储上次的旋转角度, 形成渐渐停止效果
    let lasta = 1;
    let lastb = 1;
    // distribution, 决定是否按球形均匀分布, 不然会随机成一个分布
    let distr = true;
    // 控制球的旋转速度, 鼠标轻微动一点对旋转角度的影响大不大
    let tspeed = 10;
    // 把鼠标实际物理坐标 -> 相对oDiv正中心的x/y的值
    let mX = 0;
    let mY = 0;
    // tagsList对象和里面的多个超链接对象
    let oDiv = null;
    let aA = null;

    window.onload = function() {
        var i = 0;
        var oTag = null;
        // 拿到tagsList
        oDiv = document.getElementById('tagsList');
        // 所有超链接a
        aA = oDiv.getElementsByTagName('a');
        // 为每一个超链接创建一个oTag对象, 添加到mcList数组中
        for (i = 0; i < aA.length; i++) {
            oTag = {};
            oTag.offsetWidth = aA[i].offsetWidth;
            oTag.offsetHeight = aA[i].offsetHeight;
            mcList.push(oTag);
        }
        // sineCosine(0, 0, 0);
        // 给每个超链接一个初始分布, 球坐标系
        positionAll();

        // 鼠标移入移出
        oDiv.onmouseover = function() {
            active = true;
        };
        oDiv.onmouseout = function() {
            active = false;
        };
        // 鼠标在元素上移动
        oDiv.onmousemove = function(ev) {
            var oEvent = window.event || ev;
            // 把鼠标实际物理坐标 -> 相对oDiv正中心的x/y的值
            // 比如oDiv中点在(100, 100), 这里把鼠标(98, 103)转为(-2, 3)
            mX = oEvent.clientX - (oDiv.offsetLeft + oDiv.offsetWidth / 2);
            mY = oEvent.clientY - (oDiv.offsetTop + oDiv.offsetHeight / 2);
            // 再把实际像素的比例尺缩小5倍
            mX /= 5;
            mY /= 5;
        };
        // 每30ms更新一次
        setInterval(update, 30);
    };

    function update() {
        // abc分别为绕xyz轴旋转的角度
        var a;
        var b;
        // 如果active, 计算旋转角度, 否则逐渐停止运动
        // size是一个边界, 让mX/mY别太过分, 一般踩不到
        var size = 250;
        if (active) {
            a = (-Math.min(Math.max(-mY, -size), size) / radius) * tspeed;
            b = (Math.min(Math.max(-mX, -size), size) / radius) * tspeed;
        } else {
            a = lasta * 0.98;
            b = lastb * 0.98;
        }
        lasta = a;
        lastb = b;
        // 低于0.01不要动了
        if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
            return;
        }
        var c = 0;
        // abc是角度制下的度数, 计算其sin/cos
        sineCosine(a, b, c);
        for (var j = 0; j < mcList.length; j++) {
            // 球坐标旋转, https://www.cnblogs.com/skybdemq/archive/2011/11/24/2262375.html
            // 绕x轴旋转, 角度为a
            var rx1 = mcList[j].cx;
            var ry1 = mcList[j].cy * ca + mcList[j].cz * (-sa);
            var rz1 = mcList[j].cy * sa + mcList[j].cz * ca;
            // 绕y轴旋转, 角度为b
            var rx2 = rx1 * cb + rz1 * sb;
            var ry2 = ry1;
            var rz2 = rx1 * (-sb) + rz1 * cb;
            // 绕z轴旋转, 角度为c, 我们默认为0
            var rx3 = rx2 * cc + ry2 * (-sc);
            var ry3 = rx2 * sc + ry2 * cc;
            var rz3 = rz2;
            // 将变换后的坐标赋值给oTag
            mcList[j].cx = rx3;
            mcList[j].cy = ry3;
            mcList[j].cz = rz3;
            // 根据z坐标调节穿透效果
            var d = 300;
            per = d / (d + rz3);
            // 这里没什么用
            // var howElliptical = 1;
            // mcList[j].x = (howElliptical * rx3 * per) - (howElliptical * 2);
            // mcList[j].y = ry3 * per;
            mcList[j].scale = per;

            // mcList[j].alpha = per;
            // mcList[j].alpha = (mcList[j].alpha - 0.6) * (10 / 6);
            mcList[j].alpha = (per - 0.6) * (10 / 6);
        }

        doPosition();
        // depthSort();
    }

    // 这里原来的思想是通过cz属性递减排序, 然后根据顺序赋予不同的zIndex值
    // 但是代码有问题, cz是oTag对象的属性, aA中的a和mcList中的oTag并没有建立
    // 起一一对应的关系, a并没有cz属性, 排序失败
    // 目前从效果上看来这个zIndex不动也行
    function depthSort() {
        var i = 0;
        var aTmp = [];
        for (i = 0; i < aA.length; i++) {
            aTmp.push(aA[i]);
        }

        console.log(aTmp)
        aTmp.sort(
            function (vItem1, vItem2) {
                if (vItem1.cz > vItem2.cz) {
                    return -1;
                } else if (vItem1.cz < vItem2.cz) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
        console.log(aTmp)
        for (i = 0; i < aTmp.length; i++) {
            aTmp[i].style.zIndex = i;
        }
    }

    // 给每个超链接一个初始分布 -> 球坐标系
    function positionAll() {
        var theta = 0;
        var phi = 0;
        var max = mcList.length;
        var i = 0;

        var aTmp = [];
        var oFragment = document.createDocumentFragment();

        // 把所有超链接a插入临时数组aTmp中
        for (i = 0; i < aA.length; i++) {
            aTmp.push(aA[i]);
        }
        // 随机排序
        aTmp.sort(
            function () {
                return Math.random() < 0.5 ? 1 : -1;
            }
        );
        // 把随机排序后的超链接们插入oFragment, 然后插入oDiv
        for (i = 0; i < aTmp.length; i++) {
            oFragment.appendChild(aTmp[i]);
        }
        oDiv.appendChild(oFragment);

        for (var i = 1; i < max + 1; i++) {
            if (distr) {
                // 数学公式法, 把max个点均匀分布到球上
                theta = Math.acos(-1 + (2 * i - 1) / max);
                phi = Math.sqrt(max * Math.PI) * theta;
            }
            else {
                // 球坐标系, theta in [0, pi], phi in [0, 2*pi]
                // 每个标签随机分配一个位置
                theta = Math.random() * (Math.PI);
                phi = Math.random() * (2 * Math.PI);
            }
            // 坐标变换, 球坐标系 -> 直角坐标系
            mcList[i - 1].cx = radius * Math.sin(theta) * Math.cos(phi);
            mcList[i - 1].cy = radius * Math.sin(theta) * Math.sin(phi);
            mcList[i - 1].cz = radius * Math.cos(theta);
            // 根据oDiv和每个超链接的offset计算出在界面上显示的位置
            // 这个直角坐标系建立的是向右为x, 向下为y, 向我为z
            aA[i - 1].style.left = mcList[i - 1].cx + oDiv.offsetWidth / 2 - mcList[i - 1].offsetWidth / 2 + 'px';
            aA[i - 1].style.top = mcList[i - 1].cy + oDiv.offsetHeight / 2 - mcList[i - 1].offsetHeight / 2 + 'px';
        }
    }

    function doPosition() {
        // offsetWidth属性是一个只读属性, 它返回该元素的像素宽度, 
        // 宽度包含内边距(padding）和边框(border), 
        // 不包含外边距(margin)是一个整数，单位是像素px
        var l = oDiv.offsetWidth / 2;
        var t = oDiv.offsetHeight / 2;
        // 改变每一个tag的平面坐标和style
        for (var i = 0; i < mcList.length; i++) {
            aA[i].style.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
            aA[i].style.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';
            aA[i].style.fontSize = Math.ceil(12 * mcList[i].scale / 2) + 8 + 'px';
            aA[i].style.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
            aA[i].style.opacity = mcList[i].alpha;
        }
    }

    // 计算abc的sin/cos, e.g. a=30, sa=sin(a * pi / 180)=0.5
    // 这里的变量为什么可以不声明直接赋值?
    // https://www.cnblogs.com/Walker-lyl/p/5262698.html
    // https://www.jianshu.com/p/41c2f8f6b80a
    function sineCosine(a, b, c) {
        // degree to radian, 角度制 -> 弧度制
        var dtr = Math.PI / 180;
        sa = Math.sin(a * dtr);
        ca = Math.cos(a * dtr);
        sb = Math.sin(b * dtr);
        cb = Math.cos(b * dtr);
        sc = Math.sin(c * dtr);
        cc = Math.cos(c * dtr);
    }
}