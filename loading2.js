// 替代定时器、延时器
function RAF() {}
RAF.prototype = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout(cb, interval) {
    // 实现setTimeout功能
    let now = Date.now;
    let stime = now();
    let etime = stime;
    let loop = () => {
      this.timeoutTimer = window.requestAnimationFrame(loop);
      etime = now();
      if (etime - stime >= interval) {
        cb();
        window.cancelAnimationFrame(this.timeoutTimer);
      }
    };
    this.timeoutTimer = window.requestAnimationFrame(loop);
    return this.timeoutTimer;
  },
  clearTimeout() {
    window.cancelAnimationFrame(this.timeoutTimer);
  },
  setInterval(cb, interval) {
    // 实现setInterval功能
    let now = Date.now;
    let stime = now();
    let etime = stime;
    let loop = () => {
      this.intervalTimer = window.requestAnimationFrame(loop);
      etime = now();
      if (etime - stime >= interval) {
        stime = now();
        etime = stime;
        cb();
      }
    };
    this.intervalTimer = window.requestAnimationFrame(loop);
    return this.intervalTimer;
  },
  clearInterval() {
    window.cancelAnimationFrame(this.intervalTimer);
  },
};

window._setInterval = function (fn, time) {
  const timer = new RAF();
  timer.setInterval(fn, time);
  return timer;
};
window._clearInterval = function (timer) {
  timer && timer.clearInterval && timer.clearInterval();
};
window._setTimeout = function (fn, time) {
  const timer = new RAF();
  timer.setTimeout(fn, time);
  return timer;
};
window._clearTimeout = function (timer) {
  timer && timer.clearTimeout && timer.clearTimeout();
};

function setloadingBgClass(loadingBgContainer) {
  const winWidth = document.body.clientWidth || window.innerWidth;
  const winHeight = document.body.clientHeight || window.innerHeight;
  const ratio = winWidth / winHeight;
  if (ratio < 1.78) {
    loadingBgContainer.classList.add("vertical");
  }
}

let sourceNum = 0,
  processNum = 0,
  hadSetloadingBg = false, // 是否设置过背景元素类名"vertical"
  loadingTimer = null;
const observerFun = new window.PerformanceObserver(function (list) {
  const processNumDom = document.querySelector("#process-num");
  // 计算加载进度
  sourceNum += 1;
  if (sourceNum > 1) {
    processNum += 10;
  }
  if (processNum >= 100) {
    processNumDom && (processNumDom.innerHTML = 100);
    endLoadingTimer();
  } else {
    processNumDom && (processNumDom.innerHTML = processNum);
  }
});

function startLoadingTimer(num, time = 50, maxNum = 51) {
  loadingTimer = window._setInterval(function () {
    const loadingBgContainer = document.querySelector(".loading-bg-container");
    if(loadingBgContainer && !hadSetloadingBg){
      hadSetloadingBg = true;
      setloadingBgClass(loadingBgContainer);
    }
    const processNumDom = document.querySelector("#process-num");
    const jump = num ? num : Math.random() < 0.5 ? 1 : 2;
    processNum += jump;
    if (processNum <= maxNum) {
      processNumDom && (processNumDom.innerHTML = processNum);
    } else {
      processNumDom && (processNumDom.innerHTML = Math.min(maxNum, processNum));
      if (maxNum === 100) {
        return endLoadingTimer();
      }
      window._clearInterval(loadingTimer);
    }
  }, time);
}
function endLoadingTimer() {
  window._clearInterval(loadingTimer);
  window._setTimeout(function () {
    // const loadingContainer = document.querySelector("#loading-container");
    // loadingContainer && document.body.removeChild(loadingContainer);
  }, 100);
}
observerFun.observe({ entryTypes: ["resource"] }); // 开始监听资源条目
startLoadingTimer();

window.addEventListener("load", function() {
  window._clearInterval(loadingTimer);
  if (processNum < 100) {
    startLoadingTimer(21, 40, 100);
  }
  observerFun.disconnect(); // 结束监听
});
