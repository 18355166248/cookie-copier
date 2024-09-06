专用于喜马前端内部的 Chrome 扩展，将 `ops.test.ximalaya.com` domain 下的 `JSESSIONID` cookie 和 `.ximalaya.com` domain 下的 `4&_token` cookie 复制至本地 domain 下。

## 安装方法

- 1. clone 或下载项目至本地

```shell
git@gitlab.ximalaya.com:wukai/cookie-copier.git
```

- 2. 进入 Chrome 的扩展管理页面

地址栏输入：[chrome://extensions/](chrome://extensions/)

- 3. 打开开发者模式，加载已解压的扩展程序

![guide](./images/guide.png)

## 使用方法

安装完成后，点击扩展的图标，会出现如下窗口。

![guide2](./images/guide2.png)

填写本地的开发路径 `http://localhost:3000`、`http://127.0.0.1:3000`、`http://xxx.test.ximalaya.com:3000` 等（因为 cookie 不区分端口，这里路径上的端口实际上可任意填写）。

然后点击按钮即可。


## 问题

Chrome 扩展在匿名模式下不能写入 cookie？