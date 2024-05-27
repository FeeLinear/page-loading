<!--
 * @Author: FeeLinear 444730413@qq.com
 * @Date: 2024-05-22 18:44:48
 * @LastEditors: FeeLinear 444730413@qq.com
 * @LastEditTime: 2024-05-27 16:46:16
 * @FilePath: \page-loading\README.md
 * @Description:
-->

# Preview:

## loading: https://feelinear.github.io/page-loading/index.html

# 引用说明

1，直接下载 page-loading.js 文件；

2, 将需要的图片资源文件下载项目本地，使用配置地址替换默认引用；默认的引用是 github 上的资源 (外网资源不稳定)；

3，引用请放在 body 标签最顶部，否则不能达到预想效果；

```html
<body>
  <script src="./page-loading.js" type="text/javascript"></script>
  <script>
    const options = {};
    new PageLoading(options, function (process) {
      console.log(process);
    });
  </script>
</body>
```

4，配置：

```js
const options = {
  theme: "light", // dark 光亮跟黑夜两种主题
  bgUrl: undefined, // 大背景图片, 无需背景请设置为""
  bgColor: undefined, // 大背景颜色, 无需背景请设置为""
  logo: {
    url: undefined, // logo图片, 无需logo请设置为""
    width: "100px",
    height: "100px",
    opacity: 1,
  },
  animation: {
    type: "wave", // ring loading效果有波纹跟圆环两种效果
    url: undefined, 
    opacity: 1, // 透明度  0.1 ~ 1
    speed: 50, // 动画速度 0 ~ 100
    flatness: 4, // 波纹平展度 1 ~ 5
  },
  container: {
    url: undefined, // loading容器背景图片, 无需图片请设置为""
    width: "256px",
    height: "256px",
    top: "45%",
    left: "50%",
  },
  process: {
    type: "bar", // number  进度类型， 支持条形进度条， 跟居中数字
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
  },
};
```
