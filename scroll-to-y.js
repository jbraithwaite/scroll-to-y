// http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
var setTimeout = global.setTimeout;
var requestAnimFrame = global.requestAnimationFrame       ||
                       global.webkitRequestAnimationFrame ||
                       global.mozRequestAnimationFrame    ||
                       function( callback ){
                           return setTimeout(callback, 1000 / 60);
                       };

var cancelAnimFrame = global.cancelAnimationFrame       ||
                      global.webkitCancelAnimationFrame ||
                      global.mozCancelAnimationFrame    ||
                      global.clearTimeout;

var easingEquations = {
    easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
    },
    easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },
    easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
    }
};

var wheelEvent;
if ('onwheel' in global.document.createElement('a')) {
    wheelEvent = 'wheel';
} else if ('onmousewheel' in global.document.createElement('a')) {
    wheelEvent = 'mousewheel';
}

// main function
var scrollToY = function(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollTo = global.scrollTo,
        scrollY = global.scrollY,
        currentTime = 0,
        animId;

    scrollTargetY = scrollTargetY || 0;
    speed = speed || 2000;
    easing = easingEquations[easing] || easingEquations['easeOutSine'];

    // min time .1, max time .8 seconds
    var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2;

    // add animation loop
    function tick() {
        currentTime += 1 / 60;

        var p = currentTime / time;
        var t = easing(p);

        if (p < 1) {
            animId = requestAnimFrame(tick);

            scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            scrollTo(0, scrollTargetY);
        }
    }

    // call it once to get started
    tick();

    // Stop on wheel or keydown
    global.addEventListener(wheelEvent, function wheelListener(e) {
        global.removeEventListener(wheelEvent, wheelListener);
        cancelAnimFrame(animId);
    });

    global.addEventListener('keydown', function wheelListener(e) {
        if ([ 38, 40, 32, 33, 34, 35, 36 ].indexOf(e.keyCode) !== -1) {
            global.removeEventListener('keydown', wheelListener);
            cancelAnimFrame(animId);
        }
    });
};

module.exports = scrollToY;
