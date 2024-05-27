/*
 *
 * @Name: pageLoading
 * @Description: 页面加载水波loading进度插件
 * @Version: v1.0.0
 * @Date: 2024-05-23 09:34:53
 * @Author: FeeLinear 444730413@qq.com
 * @LastEditors: FeeLinear 444730413@qq.com
 * @LastEditTime: 2024-05-27 09:37:47
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
    if(!this.options.bgColor){
      this.options.bgColor = this.options.theme === "dark" ? "#060000" : "#cfecfe";
    }
    if(!this.options.bgUrl){
      this.options.bgUrl = `https://feelinear.github.io/page-loading/images/loading-bg-${this.options.theme}.jpg`;
    }
    if(this.options.logo.show && !this.options.logo.url){
      this.options.logo.url = "https://feelinear.github.io/page-loading/images/logo.png";
    }
    if(!this.options.wave.url){
      this.options.wave.url = "https://feelinear.github.io/page-loading/images/wave-mixin.png";
    }
    if(!this.options.container.url){
      this.options.container.url = `https://feelinear.github.io/page-loading/images/loading-ball-${this.options.theme}.png`;
    }
    this.options.wave.height = parseInt(this.options.container.height) * 6 / 5;
    this.init();
  }
  PageLoading.prototype = {
    defaultOptions: {
      theme: "light", // dark
      bgUrl: "",
      bgColor: "",
      logo: {
        show: true,
        url: "",
        width: "100px",
        height: "100px",
        opacity: 1,
      },
      wave: {
        url: "",
        opacity: 1,
        speed: 50,
        flatness: 4,
      },
      container: {
        url: "",
        width: "250px",
        height: "250px",
        top: "50%",
        left: "50%"
      },
      process: {
        color: "#fff",
        fontSize: "48px",
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
      .ball-center{
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        top: 0;
        left:0;
        opacity: ${this.options.logo.opacity};
        color: ${this.options.process.color};
        ${this.options.logo.url ? "background: url(" + this.options.logo.url + ") no-repeat center;":""}
        background-size: ${this.options.logo.width} ${this.options.logo.height};
        z-index: 3;
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
        width: ${this.options.wave.flatness * 500}px;
        height: ${this.options.wave.height}px;
        opacity: ${this.options.wave.opacity};
        transition: all 100ms linear;
        transform: translateY(${this.options.wave.height}px);
      }
      .wave-move{
        position: absolute;
        height: 100%;
        width: 100%;
        top: -6%;
        left: 0;
        animation: move ${10.1 - this.options.wave.speed / 10}s linear infinite;
      }
      .wave-move::before{
        content: "";
        position: absolute;
        width: 50%;
        height: 100%;
        top:0;
        left: 0;
        background: url(${this.options.wave.url}) no-repeat center;
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
        background: url(${this.options.wave.url}) no-repeat center;
        background-size: 100% 100%;
      }
      @keyframes move {
        0%{
          transform: translateX(0);
        }
        100%{
          transform: translateX(-50%);
        }
      }
    `;
    },
    domHtml() {
      return `
      <div class="loading-container" id="loading-container">
        <div class="loading-bg-container">
          <div style="display:none;">
            <img src="${this.options.wave.url}" importance="high" />
            <img src="${this.options.container.url}" importance="high" />
            <img src="${this.options.logo && this.options.logo.url}" importance="high" />
            <img src="${this.options.bgUrl}" importance="high" />
          </div>
        </div>
        <div class="loading-box">
          <div class="wave-container" id="wave-container">
            <div class="wave-move"></div>
          </div>
          <div class="ball-center" id="ball-center">
            <div class="process-box">
              <span class="process-value" id="process-value">0</span>
              <span class="percent-label">%</span>
            </div>
          </div>
        </div>
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
      if(!this.waveContainer) this.waveContainer = document.querySelector("#wave-container");
      this.process = Math.max(0, (this.sourceNum - 1)) * 10 + this.timerProcess;
      this.process = Math.min(this.process, 100);
      this.waveContainer && (this.waveContainer.style.transform = `translateY(${this.options.wave.height / 100 * (100-this.process)}px)`);
      this.processDom && (this.processDom.innerHTML = this.process);
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
