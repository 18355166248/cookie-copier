# Cookie Copier Chrome 扩展

一个用于将喜马测试环境中的 Cookie 复制到 localhost 的 Chrome 扩展。

## 功能特性

- 🔄 自动复制指定域名的 Cookie 到本地开发环境
- 🎯 支持多个域名：`ops.test.ximalaya.com`、`.ximaoa.com`、`.ximalaya.com`
- 🛡️ 只复制必要的认证 Cookie（JSESSIONID、\_const_cas_ticket 等）
- ⚡ 一键操作，简单快捷
- 🔧 支持自定义本地开发地址

## 安装方法

### 方法一：开发者模式安装（推荐）

1. 打开 Chrome 浏览器，进入扩展管理页面：

   - 在地址栏输入：`chrome://extensions/`
   - 或者点击菜单 → 更多工具 → 扩展程序

2. 开启"开发者模式"（右上角开关）

3. 点击"加载已解压的扩展程序"

4. 选择本项目的文件夹

5. 扩展安装成功，会在工具栏显示图标

### 方法二：打包安装

1. 在扩展管理页面点击"打包扩展程序"
2. 选择项目根目录
3. 生成.crx 文件后拖拽安装

## 使用方法

### 基本使用

1. 访问喜马测试环境网站（如：`https://ops.test.ximalaya.com`）
2. 确保已经登录并获取到相关 Cookie
3. 点击浏览器工具栏中的 Cookie Copier 图标
4. 在弹出窗口中输入本地开发地址（默认：`http://localhost:3000`）
5. 点击"一键复制 cookie"按钮
6. 看到"复制成功"提示后，Cookie 已复制到本地环境

### 支持的 Cookie 类型

- **JSESSIONID**: 会话 ID
- **\_const_cas_ticket**: CAS 票据
- **CAS-TOKEN-BUSINESS**: 业务令牌
- **4&\_token**: 认证令牌

## 技术说明

### 兼容性

- ✅ Chrome 88+ (Manifest V3)
- ✅ Edge 88+ (基于 Chromium)
- ❌ Firefox (不支持 Chrome 扩展 API)

### 权限说明

- `cookies`: 读取和设置 Cookie
- `storage`: 保存用户设置
- `tabs`: 获取当前标签页信息
- `webNavigation`: 监听页面导航事件

### 域名权限

- `*://*.test.ximalaya.com/*`
- `*://*.ximaoa.com/*`
- `*://*.ximalaya.com/*`
- `*://localhost/*`

## 故障排除

### 扩展无法加载

1. 检查 Chrome 版本是否支持 Manifest V3
2. 确认所有文件都存在且完整
3. 查看扩展管理页面的错误信息

### Cookie 复制失败

1. 确保已登录目标网站
2. 检查本地开发服务器是否运行
3. 验证输入的本地地址格式正确
4. 查看浏览器控制台的错误信息

### 图标不显示

1. 确认`images/icon.png`文件存在
2. 检查图标文件是否为有效的 PNG 格式
3. 重新加载扩展

## 开发说明

### 项目结构

```
cookie-copier/
├── manifest.json          # 扩展配置文件
├── popup.html             # 弹出窗口
├── popup.js               # 弹出窗口逻辑
├── background.js          # 后台脚本
├── content_script.js      # 内容脚本
├── options.html           # 选项页面
├── options.js             # 选项页面逻辑
├── style.css              # 样式文件
├── images/                # 图标文件夹
│   └── icon.png           # 扩展图标
└── test.html              # 测试页面
```

### 修改配置

如需修改支持的域名或 Cookie 类型，请编辑以下文件：

- `manifest.json`: 修改权限和匹配规则
- `js/popup.js`: 修改 Cookie 复制逻辑
- `js/background.js`: 修改域名匹配规则

## 更新日志

### v0.1.1

- 升级到 Manifest V3
- 修复权限配置问题
- 优化错误处理
- 改进用户界面反馈

### v0.1.0

- 初始版本发布
- 支持基本的 Cookie 复制功能

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个扩展。
