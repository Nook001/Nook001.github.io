---
title: "国行机连不上 Pixel Watch？我用安卓模拟器解决了配对问题"
description: "国行手机无法完成 Pixel Watch 首次配对？这篇文章介绍失败原因，以及用 Android 模拟器完成初始化配对的方法。"
lang: zh-CN
sample: false
published: true
---

## 前言

买了 Pixel Watch，却发现国行 Android 手机怎么也配对不上？

这里的“配对”不是蓝牙设备列表里显示已连接，而是手表的首次初始化、账号关联与服务启用。仅仅扫描到手表，并不能完成这些步骤。

我在国行 vivo X300 Pro（OriginOS）上遇到了这个问题。即使 Google Play services 和网络都正常，Pixel Watch App 仍然无法完成初始化。

为了弄清原因，我反编译了 Pixel Watch App，并检查相关服务的日志与代码，发现两道障碍：**国行 ROM 触发了异常的初始化流程；即使修改 App 绕过这一步，应用身份校验和 Google Play services 的平台检查仍会阻止后续流程。**

使用另一台非国行 Android 手机配对当然是一条路，但为此专门买一台手机，成本未免太高。

**既然问题出在国行 Android 的系统环境上，为什么不直接构建另一套 Android 环境来完成配对？**

最后，我用带 Google Play 的 **Android Emulator** 作为配对主机，让它通过电脑的物理蓝牙控制器与 Pixel Watch 通信，成功完成了手表的初始化配对。这篇文章简要介绍原因、实现思路和实际操作。

## 1. 为什么国行手机无法配对？

以下分析来自我的 vivo X300 Pro、Pixel Watch App 5.x 和 Google Play services 26.x 测试环境。不同 ROM 与应用版本的表现可能不同。

### 1.1 App 初始化异常

排查 Logcat 时，我发现了一个关键异常：

```text
npv: Unsupported step zpe
    at oka.h(PG:1516)
```

反编译后发现，国行 ROM 声明的 `cn.google.services`、`com.google.android.feature.services_updater` 等系统 Feature，加上中国版 Wear OS 应用的版本条件，会让 Pixel Watch App 选择 `CHINA_PERSISTENT_SERVICE` 初始化步骤。

问题是，后续 UI 没有正确处理这一类型，流程最终在 `Unsupported step zpe` 处中断。

这解释了为什么**修改手机语言、地区，或仅仅确保 Google 服务可用，并不能解决本次配对失败**：真正影响流程选择的是 ROM 暴露的系统环境。

### 1.2 App 之外的限制

我也尝试修改 Pixel Watch App 的相关判断。实验 APK 确实跳过了原来的异常步骤，配对流程得以继续，却又遇到了：

```text
GoogleCertificatesRslt: not allowed
Wear is not available on this device: UNSUPPORTED_PLATFORM
```

前者涉及重新签名后的应用身份校验；后者来自 Google Play services 自身的平台检查。进一步分析 GMS 代码也证实，它会根据设备的系统 Feature 拒绝启动 Wearable 服务。

**也就是说，问题不只在 Pixel Watch App。修改 App 能绕过一处判断，却不能让整套底层服务接受当前设备。** 继续修补 ROM 或系统服务当然可以研究，但对于只想把手表配对起来的人，代价太大。

## 2. 解决思路：Android 模拟器

既然手机本身的系统环境不被接受，我选择直接换掉**配对主机**，而不是继续改手机。

方案很简单：在 Windows 上运行带 Google Play 的 Android Emulator，让 Pixel Watch App 和相关服务运行在模拟器里；再把模拟器的蓝牙通信转发到电脑的真实蓝牙控制器，由它与实体手表配对。

```text
Android Emulator（Pixel Watch App + Google Play services）
             │
             ▼
       Bluetooth HCI
             │
             ▼
        Bumble Bridge
             │
             ▼
    电脑的实体蓝牙控制器
             │
             ▼
          Pixel Watch
```

其中，[Bumble](https://github.com/google/bumble) 负责蓝牙 HCI 数据桥接；普通网络请求仍通过模拟器的宿主机网络连接 Google 服务。

**模拟器不是在“模拟手表”，而是在充当一台可以执行完整配对流程的 Android 手机。** 这才是整个方案的核心。

## 3. 如何配对？

### 3.1 准备环境

我实际使用的环境如下：

| 项目 | 环境 |
|---|---|
| 电脑 | Windows 11 |
| Android | Android 15 Google Play AVD（x86_64） |
| Python | 3.12 |
| 蓝牙 | Intel 控制器（`8087:0037`） |
| 工具 | Android Emulator、ADB、Bumble、WinUSB |

先通过 Android Studio 的 Device Manager 创建 **Android 15 / Google Play** 虚拟设备。本例将 AVD 命名为 `PixelWatch_Android15_Play`。

Bumble 可以安装在独立的 Python 环境中：

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install "bumble[android]"
```

这里不要求安装与我完全一致的每个补丁版本，但需要有支持相应 Android Emulator 蓝牙端点的 Bumble，以及可正常运行的 Google Play 系统镜像。

### 3.2 接管蓝牙

在我的 Windows 环境中，Bumble 需要通过 WinUSB 直接访问 Intel 蓝牙控制器。切换之前，先确认设备硬件 ID，并备份可恢复的原厂驱动。

**注意：同一个控制器交给 WinUSB 后，Windows 原生蓝牙将暂时无法使用它。** 如果鼠标、耳机依赖这块蓝牙芯片，请提前做好准备。部分 Intel 控制器还需要由原厂驱动先完成固件初始化，必要时需恢复驱动并重启。

我将驱动切换、固件检查和错误恢复封装在 PowerShell 脚本 `Start-Android15-Watch.ps1` 中。该脚本针对我的 Intel 控制器编写，其他型号不能直接照搬硬件 ID 或驱动操作。

### 3.3 启动模拟器

驱动与固件就绪后，先启动 Bumble Bridge：

```powershell
.\.venv\Scripts\python.exe -m bumble.apps.hci_bridge `
  "android-netsim:_:8877,mode=controller" `
  "usb:8087:0037"
```

这里的 `8087:0037` 是**我自己蓝牙控制器的 VID/PID**，不是通用参数。

再启动 Android Emulator：

```powershell
emulator -avd PixelWatch_Android15_Play `
  -port 5556 `
  -change-country GB `
  -packet-streamer-endpoint localhost:8877 `
  -feature -WiFiPacketStream `
  -no-snapshot -no-boot-anim
```

其中，`-packet-streamer-endpoint` 将模拟器蓝牙连接到 Bumble；`-feature -WiFiPacketStream` 让 Wi-Fi 继续使用常规 NAT。我的实验中，缺少后一个参数会导致蓝牙可用、网络却不正常。

`-change-country GB` 是本次采用的模拟器配置之一，**不是修改原手机地区就能配对成功**的意思。

### 3.4 完成配对与验证

在模拟器中运行 Pixel Watch App，按照应用引导对真实手表完成初始化。手表此时的配对对象是 **Android Emulator**，而不是 Windows 的普通蓝牙设备列表，也不是原来的国行手机。

最初的实验 AVD 记录了初始化结束状态：

```text
ExitSetupStep
FINISHED
```

后来换成稳定的 Android 15 Google Play AVD，又多次验证了 Wearable 服务连接与数据活动。可以通过 ADB 查看：

```powershell
adb -s emulator-5556 shell dumpsys activity service `
  com.google.android.gms/.wearable.service.WearableService
```

成功记录中包含：

```text
1 connected out of 1
Status: CONNECTED
Last read was 00:01s ago
```

这比仅仅看到 Bluetooth ON 更有意义：初始化完成记录与 Wearable 服务的数据通信，共同构成了本次配对成功的证据。

目前使用的驱动管理和自动启动脚本尚未整理成公开的通用下载包。上面是方案的核心命令；驱动切换部分请勿在未确认型号和恢复方式时直接照搬。

## 4. 注意事项

这套方法解决的是**通过模拟器完成 Pixel Watch 配对**，并没有修复 vivo 国行 ROM 的原生配对环境。后续让原手机直接承担通知等 Companion 功能，是另一个问题。

Windows 蓝牙控制器被 WinUSB 接管时，原生蓝牙不可同时使用；恢复原厂驱动有时还需要重启。此外，其他蓝牙芯片的兼容性，以及健康同步、支付等具体功能，需要单独验证，不能仅凭配对成功一概而论。

## 结语

这次排查让我发现，真正卡住配对的不是蓝牙本身，而是国行 ROM 触发的初始化流程和底层平台检查。

与其继续逐层修改原手机，不如直接用 Android Emulator 构建一套能够正常运行 Pixel Watch 配对服务的环境，再把真实蓝牙硬件接进来。

**换掉受限制的配对环境，而不是更换整台手机。** 这就是这次方案最重要的思路。
