# Test App Automation

使用 [Midscene.js](https://midscenejs.com/) 对 Android App 进行主流程自动化验证 —— 由 AI 驱动的 vision-driven UI 自动化框架。

## 工作原理

Midscene.js 对手机屏幕截图，发送给视觉大模型（Qwen-VL），AI 识别界面元素并自动执行操作。**原生 Android UI 和嵌入式 H5 页面无需区分**，统一通过视觉识别处理。

## 前置条件

1. **Node.js**（v20 或更高版本）
2. **ADB** 已安装并加入 PATH
3. **Android 手机** 通过 USB 连接并开启 USB 调试
4. **AI 模型 API Key**（推荐 DashScope / Qwen-VL）

## 安装

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

复制环境模板并填入你的 API Key：

```bash
cp .env.example .env
```

编辑 `.env`，将 `sk-your-api-key-here` 替换为实际的 API Key：

```env
MIDSCENE_MODEL_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MIDSCENE_MODEL_API_KEY=sk-你的真实APIKey
MIDSCENE_MODEL_NAME=qwen3-vl-plus
MIDSCENE_MODEL_FAMILY=qwen3-vl
```

在 [DashScope 控制台](https://dashscope.console.aliyun.com/) 获取 API Key。

### 3. 连接 Android 设备

```bash
# 确认 ADB 已识别设备
adb devices

# 应显示类似：
# List of devices attached
# ABC123DEF    device
```

如果未显示设备：
- 手机设置中连续点击「版本号」7 次开启开发者选项
- 在开发者选项中开启 USB 调试
- 用 USB 连接手机，接受调试授权弹窗

### 4. 自定义你的 App 流程

**JavaScript（`src/main-flow.js`）：**
- 修改 `APP_PACKAGE` 为你的 App 包名（如 `com.tencent.mm`）
- 更新 `aiAct()` 和 `aiAssert()` 中的描述以匹配你的 App 界面

**YAML（`src/main-flow.yaml`）：**
- 修改 `launch:` 为你的 App 包名或 URL
- 更新 `aiAct:` 和 `aiAssert:` 以匹配你的 App 流程

## 运行

### JavaScript 方式（编程控制）

```bash
npm run test:js
```

### YAML 方式（声明式）

```bash
npm run test:yaml
```

两种方式都会：
1. 连接你的 Android 设备
2. 启动 App
3. 执行登录 → 导航 → 交互 → 验证流程
4. 在 `midscene-run/` 中生成 HTML 报告，可视觉回放查看每一步操作

## 项目结构

```
src/
  main-flow.js      -- JavaScript 自动化脚本（编程控制）
  main-flow.yaml    -- YAML 自动化脚本（声明式）
.env.example        -- API Key 模板
package.json        -- 依赖和运行脚本
midscene-run/       -- 自动生成的 HTML 报告
```

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| `未找到 Android 设备` | 运行 `adb devices`，确认 USB 调试已开启 |
| `API Key 错误` | 检查 `.env` 中 `MIDSCENE_MODEL_API_KEY` 是否正确 |
| `输入框文字被清除` | 保持 `autoDismissKeyboard: false` 配置 |
| 脚本运行太快 | 增大 `sleep()` 等待时间 |

## 参考

- [Midscene.js 文档](https://midscenejs.com/)
- [Android 快速上手](https://midscenejs.com/android-getting-started)
- [Android 集成介绍](https://midscenejs.com/android-introduction)
- [YAML 脚本](https://midscenejs.com/automate-with-scripts-in-yaml)
- [示例仓库](https://github.com/web-infra-dev/midscene-example)
