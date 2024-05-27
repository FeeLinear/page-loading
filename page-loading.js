/*
 *
 * @Name: pageLoading
 * @Description: 页面加载loading进度插件
 * @Version: v1.0.0
 * @Date: 2024-05-23 09:34:53
 * @Author: FeeLinear 444730413@qq.com
 * @LastEditors: FeeLinear 444730413@qq.com
 * @LastEditTime: 2024-05-27 15:44:57
 */
;(function () {
  
  function PageLoading(param1, param2) {
    let options = null;
    if(typeof param1 === "object"){
      options = param1;
    }else if(typeof param1 === "function"){
      this.callback = param1;
    }
    if(typeof param2 === "function"){
      this.callback = param2;
    }
    if(options){
      Object.keys(options).forEach(key => { // 二级拷贝
        if(typeof options[key] === "object"){
          options[key] = Object.assign(this.defaultOptions[key], options[key])
        }
      })
    }
    this.options = Object.assign(this.defaultOptions, options);
    if(this.options.bgColor === undefined){
      this.options.bgColor = this.options.theme === "dark" ? "#060000" : "#cfecfe";
    }
    if(this.options.bgUrl === undefined){
      this.options.bgUrl = `https://feelinear.github.io/page-loading/images/loading-bg-${this.options.theme}.jpg`;
    }
    if(this.options.logo.url  === undefined){
      this.options.logo.url = "https://feelinear.github.io/page-loading/images/logo.png";
    }
    if(this.options.animation.url  === undefined){
      this.options.animation.url = `https://feelinear.github.io/page-loading/images/loading-${this.options.animation.type}.png`;
    }
    if(this.options.container.url  === undefined){
      this.options.container.url = `https://feelinear.github.io/page-loading/images/loading-ball-${this.options.theme}.png`;
    }
    this.options.animation.height = parseInt(this.options.container.height) * 6 / 5 + "px";
    this.init();
  }
  PageLoading.prototype = {
    defaultOptions: {
      theme: "light", // dark 
      bgUrl: undefined,
      bgColor: undefined,
      logo: {
        url: undefined,
        width: "100px",
        height: "100px",
        opacity: 1,
      },
      animation: {
        type: "wave", // ring
        url: undefined,
        opacity: 1,
        speed: 50,
        flatness: 4,
      },
      container: {
        url: undefined,
        width: "256px",
        height: "256px",
        top: "45%",
        left: "50%"
      },
      process: {
        type: "bar", // number
        width: "588px",
        height: "14px",
        left: "50%",
        bottom: "25%",
        color: "#0066FF",
        bgColor: "#CCD8E9",
        activeColor1: "#88DBFF",
        activeColor2: "#0066FF",
        fontSize: "20px",
        labelFontSize: "16px",
      }
    },
    process: 0,
    timerProcess: 0,
    sourceNum: 0,
    styleHtml() {
      return `
      .loading-container{
        pointer-events: none;
      }
      .loading-bg-container {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url(${this.options.bgUrl}) no-repeat center ${this.options.bgColor};
        background-size: 100% 100%;
      }
      .loading-box{
        width: ${this.options.container.width};
        height: ${this.options.container.height};
        position: absolute;
        left: ${this.options.container.left};
        top: ${this.options.container.top};
        transform: translate(-50%, -50%);
        background: url(${this.options.container.url}) no-repeat center;
        background-size: 100% 100%;
        border-radius: 50%;
        overflow: hidden;
        z-index: 2;
      }
      .ring-box{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(${this.options.animation.url}) no-repeat center;
        background-size: 100% 100%;
        animation: rotate ${5.1 - this.options.animation.speed / 20}s linear infinite;
      }
      .ball-center{
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        top: 0;
        left:0;
        opacity: ${this.options.logo.opacity};
        ${this.options.logo.url ? "background: url(" + this.options.logo.url + ") no-repeat center;":""}
        background-size: ${this.options.logo.width} ${this.options.logo.height};
        z-index: 3;
      }
      .bar-color{
        color: ${this.options.process.color};
      }
      .process-box{
        display: ${this.options.logo.url?"none":"block"};
        margin: auto;
        white-space: nowrap;
      }
      .process-value{
        font-size: ${this.options.process.fontSize};
      }
      .percent-label{
        font-size: ${this.options.process.labelFontSize};
      }
      .wave-container{
        position: relative;
        width: ${this.options.animation.flatness * 500}px;
        height: ${this.options.animation.height};
        opacity: ${this.options.animation.opacity};
        transition: all 100ms linear;
        transform: translateY(${this.options.container.height});
      }
      .wave-move{
        position: absolute;
        height: 100%;
        width: 100%;
        top: -6%;
        left: 0;
        animation: move ${10.1 - this.options.animation.speed / 10}s linear infinite;
      }
      .wave-move::before{
        content: "";
        position: absolute;
        width: 50%;
        height: 100%;
        top:0;
        left: 0;
        background: url(${this.options.animation.url}) no-repeat center;
        background-size: 100% 100%;
      }
      .wave-move::after{
        content: "";
        position: absolute;
        width: 50%;
        height: 100%;
        background: rgba(0, 255, 0, 0.2);
        top:0;
        left: 50%;
        background: url(${this.options.animation.url}) no-repeat center;
        background-size: 100% 100%;
      }
      .process-bar{
        position: absolute;
        width: ${this.options.process.width};
        height: ${this.options.process.height};
        left: ${this.options.process.left};
        bottom: ${this.options.process.bottom};
        transform: translate(-50%, -50%);
        z-index: 3;
      }
      .process-bar .bar-active{
        position: relative;
        height: 100%;
        background: linear-gradient(to right, ${this.options.process.activeColor1}, ${this.options.process.activeColor2});
        border-radius: ${parseInt(this.options.process.height)/2}px;
        overflow: hidden;
      }
      .bar-active .bar-cover{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: radial-gradient(circle at left, transparent 7px, ${this.options.process.bgColor} 0);
        transition: all 100ms linear;
        transform: translateX(0);
        border-radius: ${parseInt(this.options.process.height)/2}px;
      }
      .process-bar .bar-value{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(130%, -50%);
        color: ${this.options.process.color};
        font-size: ${this.options.process.fontSize};
        font-family: MicrosoftYaHei;
      }
      @keyframes move {
        0%{
          transform: translateX(0);
        }
        100%{
          transform: translateX(-50%);
        }
      }
      @-webkit-keyframes move {
        0%{
          transform: translateX(0);
        }
        100%{
          transform: translateX(-50%);
        }
      }
      
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      @-webkit-keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;
    },
    domHtml() {
      let animationDom = `
        <div class="wave-container" id="wave-container">
          <div class="wave-move"></div>
        </div>
      `;
      let processDom1 = "";
      let processDom2 = "";
      if(this.options.animation.type === "ring"){
        animationDom = `
          <div class="ring-box"></div>
        `
      }
      if(this.options.process.type === "bar"){
        processDom2 = `
          <div class="process-bar">
            <div class="bar-active">
              <div class="bar-cover" id="bar-cover"></div>
            </div>
            <div class="bar-value bar-color">
              <span class="process-value" id="process-value">0</span>%
            </div>
          </div>
        `;
      }else if(!this.options.logo.url){
        processDom1 = `
          <div class="process-box bar-color">
            <span class="process-value" id="process-value">0</span>
            <span class="percent-label">%</span>
          </div>
        `;
      }
      return `
      <div class="loading-container" id="loading-container">
        <div class="loading-bg-container">
          <div style="display:none;">
            <img src="${this.options.animation.url}" importance="high" />
            <img src="${this.options.container.url}" importance="high" />
            <img src="${this.options.bgUrl}" importance="high" />
            <img src="${this.options.logo && this.options.logo.url}" importance="high" />
          </div>
        </div>
        <div class="loading-box">
          ${animationDom}
          <div class="ball-center" id="ball-center">
            ${processDom1}
          </div>
        </div>
        ${processDom2}
      </div>
    `;
    },
    init() {
      this.appendStyle();
      this.appendDom();
      this.observerFun(); // 监听资源条目
      this.startLoadingTimer();
    },
    appendStyle() {
      this.styleEle = document.createElement("style");
      this.styleEle.innerHTML = this.styleHtml();
      document.querySelector("head").appendChild(this.styleEle);
    },
    appendDom() {
      this.containerEle = document.createElement("div");
      document.querySelector("body").appendChild(this.containerEle);
      this.containerEle.outerHTML = this.domHtml();
    },
    calculateProcess(maxNum) {
      if(!this.processDom) this.processDom = document.querySelector("#process-value");
      if(!this.barCover) this.barCover = document.querySelector("#bar-cover");
      if(!this.waveContainer) this.waveContainer = document.querySelector("#wave-container");
      this.process = Math.max(0, (this.sourceNum - 1)) * 10 + this.timerProcess;
      this.process = Math.min(this.process, 100);
      this.waveContainer && (this.waveContainer.style.transform = `translateY(${parseInt(this.options.container.height) / 100 * (100-this.process)}px)`);
      this.processDom && (this.processDom.innerHTML = this.process);
      this.barCover && (this.barCover.style.transform = `translateX(${this.process}%)`);
      if (this.timerProcess >= maxNum) {
        window._clearInterval(this.timer);
      }
      if (this.process >= 100) {
        this.endLoadingTimer();
      }
      this.callback && this.callback(this.process);
    },
    observerFun() {
      const self = this;
      self.observer = new window.PerformanceObserver(function (list) {
        // 计算加载进度
        self.sourceNum += 1;
        if(self.sourceNum > 1){
          self.calculateProcess(100);
        }
      });
      self.observer.observe({ entryTypes: ["resource"] }); // 开始监听资源条目
      window.addEventListener("load", function() {
        window._clearInterval(self.timer);
        if (self.process < 100) {
          self.startLoadingTimer(21, 40, 100);
        }
        self.observer.disconnect(); // 结束监听
      });
    },
    startLoadingTimer(num, time = 50, maxNum = 51) {
      const self = this;
      self.timer = window._setInterval(function () {
        const jump = num ? num : Math.random() < 0.5 ? 1 : 2;
        self.timerProcess += jump;
        self.timerProcess = Math.min(maxNum, self.timerProcess);
        self.calculateProcess(maxNum);
      }, time);
    },
    endLoadingTimer() {
      window._clearInterval(this.timer);
      window._setTimeout(function () {
        const loadingContainer = document.querySelector("#loading-container");
        loadingContainer && document.body.removeChild(loadingContainer);
      }, 100);
    },
  };

  window.PageLoading = PageLoading;
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
})();
