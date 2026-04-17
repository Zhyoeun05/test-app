// src/main-flow.js
// Main flow verification script for Android app using Midscene.js
// Uses vision-driven AI to interact with both native UI and embedded H5 pages

import { AndroidAgent, AndroidDevice, getConnectedDevices } from '@midscene/android';
import 'dotenv/config';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ===================== 配置区域（替换为你自己的 App 信息） =====================
const APP_PACKAGE = 'com.example.yourapp';       // FIXME: 替换为你的 App 包名
const APP_ACTIVITY = '.MainActivity';            // FIXME: 替换为你的主 Activity，如果是网页可留空

const DEVICE_UDID = process.env.MIDSCENE_ANDROID_DEVICE_ID || null;

// 上下文提示：告诉 AI 自动处理常见的弹窗
const AI_CONTEXT_HINT =
  '如果遇到定位、权限、用户协议、版本更新等弹窗，点击同意或允许以关闭弹窗。' +
  '如果出现登录页面，走登录流程。';
// =========================================================================

async function main() {
  // 1. 发现并连接设备
  const devices = await getConnectedDevices();
  if (devices.length === 0) {
    console.error('未找到 Android 设备。请通过 USB 连接手机并开启 USB 调试。');
    process.exit(1);
  }

  const udid = DEVICE_UDID || devices[0].udid;
  console.log(`使用设备: ${udid}`);

  const device = new AndroidDevice(udid, {
    autoDismissKeyboard: false,
  });
  const agent = new AndroidAgent(device, {
    aiActContext: AI_CONTEXT_HINT,
  });

  await device.connect();

  // 2. 启动 App
  console.log(`启动 App: ${APP_PACKAGE}`);
  await device.launch(APP_PACKAGE + APP_ACTIVITY);
  await sleep(5000); // 等待 App 加载完成

  // 3. 主流程验证

  // 步骤 A：登录
  console.log('--- 步骤 A：登录 ---');
  await agent.aiAct(
    '在首页找到登录入口并点击。' +
    '然后在用户名输入框中输入 "testuser"，在密码输入框中输入 "password123"，' +
    '最后点击登录或提交按钮。'
  );
  await sleep(3000);

  // 步骤 B：验证登录成功
  console.log('--- 步骤 B：验证登录成功 ---');
  await agent.aiAssert(
    '登录成功后应显示主页或仪表盘页面，登录表单不再可见。'
  );

  // 步骤 C：导航到功能页面
  console.log('--- 步骤 C：导航到功能页面 ---');
  await agent.aiAct(
    '在屏幕上找到主要功能入口并点击，' +
    '例如菜单项、标签页或卡片。'
  );
  await sleep(3000);

  // 步骤 D：与功能交互
  console.log('--- 步骤 D：与功能交互 ---');
  await agent.aiAct(
    '在当前页面执行主要操作，例如填写表单、点击按钮或选择选项。'
  );
  await sleep(3000);

  // 步骤 E：验证操作结果
  console.log('--- 步骤 E：验证操作结果 ---');
  await agent.aiAssert(
    '操作完成后应有可见的反馈，例如成功提示、更新的内容或确认弹窗。'
  );

  // 步骤 F：提取页面信息（可选）
  console.log('--- 步骤 F：提取页面信息 ---');
  const screenInfo = await agent.aiQuery(
    '{pageTitle: string, hasSuccessMessage: boolean, visibleItems: string[]}, ' +
    '提取当前页面标题、是否有成功提示信息、以及页面上可见的文本项或标签列表'
  );
  console.log('页面信息:', JSON.stringify(screenInfo, null, 2));

  console.log('\n=== 主流程验证通过 ===');
  await device.disconnect();
}

main().catch((err) => {
  console.error('流程失败:', err);
  process.exit(1);
});
