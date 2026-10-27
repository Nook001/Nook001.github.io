---
title: "国行机连不上 Pixel Watch？我用安卓模拟器解决了配对问题"
description: "一次从国行 Android ROM 的兼容性问题出发，最终通过 Android Emulator 连接真实 Pixel Watch 的技术实践。"
lang: zh-CN
sample: false
published: true
---
## 前言

买了一块 Google Pixel Watch，却发现自己的国行 Android 手机根本无法完成配对，怎么办？

这并不是简单的蓝牙连接问题。对于 Pixel Watch 而言，配对不仅意味着让手机发现手表、建立蓝牙连接，还涉及设备初始化、Google 账户关联以及相关服务的启用。如果无法完成这一流程，即使手表能够被蓝牙扫描到，也无法正常完成首次设置。

更麻烦的是，问题并不只是 Google 服务或网络环境。以我使用的国行 vivo X300 Pro 为例，即使安装了 Google Play services，并确保网络能够正常访问 Google 服务，Pixel Watch App 仍然无法完成配对。

为了弄清楚原因，我反编译了 Pixel Watch App，并深入分析了相关底层服务的日志和代码，最终发现了两个主要障碍：

1. **应用层的兼容性问题**：国行 ROM 的系统配置会触发一套无法正常完成的初始化流程，导致配对失败。
2. **底层服务的校验限制**：即使修改 App 绕过前面的障碍，仍然会受到应用身份校验和 Google Play services 平台检查的限制，无法完成整个配对流程。

一种直观的解决办法是使用非国行 Android 手机进行初始化配对，但如果为此专门购买另一台手机，成本显然太高了。

**既然问题出在国行 Android 的系统环境上，那么我们能不能直接构建一套国际版 Android 环境来完成配对？**

沿着这个思路，我最终找到了一种基于 **Android Emulator（安卓模拟器）** 的解决方案：让运行在 Windows 上的 Android 模拟器代替国行手机完成 Pixel Watch 配对，并通过电脑的实体蓝牙控制器与真实手表通信。

最终，我成功完成了 Pixel Watch 的初始化配对，并建立了正常的 Wearable 服务连接与数据通信。这不只是让模拟器能够扫描或连接手表，而是真正走通了原本在国行手机上失败的初始化流程。

---

## 1. 为什么国行手机无法配对？

为了确定配对失败的真正原因，我首先使用 ADB 和 Logcat 分析 Pixel Watch App 的初始化过程，随后通过 JADX 反编译应用，追踪相关逻辑。

### 1.1 Pixel Watch App 初始化异常

最初，在 Pixel Watch App 的运行日志中发现了这样一条异常：

```text
npv: Unsupported step zpe
    at oka.h(PG:1516)
```

`zpe` 是经过混淆的类名，仅凭异常信息无法直接判断发生了什么。

通过反编译并追踪相关调用，我发现这个类对应的是配对初始化过程中的 `CHINA_PERSISTENT_SERVICE` 步骤。

检查手机的 `/product/etc/sysconfig/cn_feature.xml`，可以看到：

```xml
<config>
    <feature name="cn.google.services" />
    <feature name="com.google.android.feature.services_updater" />
</config>
```

这两个 Feature 是国行系统环境的重要特征。其中，`com.google.android.feature.services_updater` 会影响 Pixel Watch App 对初始化流程的选择。

结合反编译结果，可以将失败过程简化为：

```text
检查系统 Feature 和 Wear OS 应用版本
                 ↓
     选择中国版初始化流程
                 ↓
       CHINA_PERSISTENT_SERVICE
                 ↓
        构造 zpe 初始化步骤
                 ↓
     Pixel Watch UI 无法处理该步骤
                 ↓
         Unsupported step zpe
```

也就是说，Pixel Watch App 在当前设备环境下选择了一条特殊的初始化路径，但后续 UI 没有正确处理对应的步骤类型，最终导致配对流程中断。

这也解释了为什么单纯修改系统语言、地区显示设置，甚至确保 Google Play services 可以正常使用，都不能解决这次遇到的问题。

### 1.2 App 之外的限制

既然已经找到了导致初始化流程异常的判断条件，一个直观的想法就是：修改 Pixel Watch App，使其跳过这套中国版初始化流程。

为了验证这一思路，我使用 Apktool 修改了两个相关的判断函数，并重新构建、签名和安装实验 APK。

原本导致异常的初始化步骤不再阻止流程继续，日志中出现了：

```text
WatchPairingSetupStep(
    available=false,
    status=Success
)
```

这说明我们已经越过了之前的应用层障碍。

然而，后续的连接初始化依然失败，并出现了新的错误：

```text
GoogleCertificatesRslt:
not allowed:
pkg=com.google.android.apps.wear.companion
```

以及：

```text
Wearable Services not starting.
Wear is not available on this device:
UNSUPPORTED_PLATFORM
```

**首先，修改后的 APK 无法直接继承原始应用的可信身份。** 重新签名的实验应用受到了 Google 服务的应用身份校验限制。

**其次，Google Play services 自身也会检查设备的平台环境。** 即使能够让 Pixel Watch App 继续执行后续步骤，也不代表底层 Wearable 服务一定允许在当前设备上运行。

这意味着，即使我们绕过 Pixel Watch App 的初始化判断，底层 Google Play services 仍可能主动拒绝启动 Wearable 服务。

既然问题集中在国行 ROM 的 Android 运行环境，那么是否真的有必要继续修改这台手机？

**如果我们能够提供另一套正常运行 Google 服务的 Android 系统，让它代替国行手机完成初始化配对，就有机会从根本上避开这些限制。**

---

## 2. Android 模拟器方案

因此，我们可以选择带有 Google Play 的 Android 系统镜像，在不修改原始手机 ROM 的情况下，创建一套独立的配对环境。

### 2.1 蓝牙桥接

解决这个问题的关键，是将 Android Emulator 的蓝牙通信与电脑上的物理蓝牙控制器连接起来。

Android 的蓝牙协议栈通过 HCI（Host Controller Interface）与底层蓝牙控制器进行通信。

如果我们能够将模拟器中的 HCI 数据流转发给电脑上的真实蓝牙硬件，就可以让模拟器通过物理蓝牙链路发现、配对并与 Pixel Watch 通信。

这里使用的是 Google 开源的 [Bumble](https://github.com/google/bumble) 项目。

利用其中的 `hci_bridge`，我们可以将 Android Emulator 的蓝牙端点与电脑上的 USB 蓝牙控制器连接起来。

最终，整个系统的通信关系如下：

```text
Windows Host
│
├── Android Emulator (Android 15)
│   ├── Pixel Watch App
│   ├── Google Play services
│   └── Android Bluetooth Stack
│          │
│          ▼
│     HCI Packet Stream
│          │
│          ▼
├── Bumble HCI Bridge
│          │
│          ▼
├── Physical Bluetooth Controller
│          │
│          ▼
└── Google Pixel Watch
```

在这个架构中，模拟器运行真正的 Pixel Watch 配对应用和相关 Android 服务，而 Bumble 仅负责把蓝牙通信传递给物理控制器。

**我们真正做的是让 Android Emulator 成为手表的配对主机，由它执行完整的初始化流程。**

### 2.2 网络

Pixel Watch 的初始化过程还需要与 Google Play services 及相关网络服务进行交互，因此模拟器必须同时具备正常的互联网连接。

- **蓝牙通信**：通过 Bumble HCI Bridge，使用电脑的实体蓝牙控制器。
- **网络通信**：通过 Android Emulator 的网络环境，由 Windows 主机提供互联网访问。

这里曾经遇到一个问题：在启用蓝牙 Packet Stream 后，模拟器的 Wi-Fi 通信没有正常工作。

经过排查，我最终通过关闭 Emulator 的 Wi-Fi Packet Streaming 功能，使其恢复使用原有的 NAT 网络路径，同时保留蓝牙 HCI 桥接。

---

## 3. 配对步骤

以下以我的 Windows 11 + Intel 蓝牙控制器环境为例。核心桥接方案已经通过实际测试，但不同型号的蓝牙控制器可能需要不同的驱动配置。

### 3.1 环境

需要特别注意两个条件。

**首先，Android 系统镜像必须包含 Google Play。** 本文使用的是 `google_apis_playstore` 镜像，而不是普通 AOSP 镜像。

**其次，电脑上的蓝牙控制器需要支持底层 USB HCI 访问。** 本次通过 WinUSB 接管 Intel 控制器实现这一点。其他型号不能保证使用完全相同的配置。

#### 安装模拟器

最方便的方法是安装 Android Studio，并通过 SDK Manager 安装 Android Emulator 和 Android 15 对应的 Google Play 系统镜像。

在 Device Manager 中创建一个新的虚拟设备：

- 设备类型：支持 Google Play 的 Pixel 手机配置。
- 系统版本：Android 15（API 35）。
- 系统镜像：Google Play，x86_64。
- 内存：4 GB。
- CPU：4 核。

我使用的 AVD 名称为：

```text
PixelWatch_Android15_Play
```

如果使用其他名称，需要在后面的启动命令中同步替换。

完成创建后，建议先正常启动一次模拟器，确认 Android 系统能够运行、Google Play services 已安装，且模拟器可以访问网络。

之后关闭模拟器，准备配置蓝牙桥接。

### 3.2 安装 Bumble

[Bumble](https://github.com/google/bumble) 是 Google 开源的蓝牙协议栈与测试工具集。我们使用其中的 `hci_bridge`，将 Android Emulator 的蓝牙 HCI 端点连接到电脑的物理蓝牙控制器。

建议为 Bumble 单独创建 Python 虚拟环境，避免与系统中的其他 Python 项目产生依赖冲突。

例如，在 PowerShell 中执行：

```powershell
py -3.12 -m venv .venv

.\.venv\Scripts\python.exe -m pip install `
  "bumble[android]"
```

### 3.3 蓝牙驱动

默认情况下，Windows 通过原厂驱动管理蓝牙控制器。而 Bumble 需要通过 USB HCI 直接访问控制器，因此在本次 Intel 硬件配置中，需要将设备驱动切换为 WinUSB。

这里可以使用 [Zadig](https://zadig.akeo.ie/) 等工具安装 WinUSB 驱动，也可以通过 Windows 驱动安装 API 完成绑定。

**切换驱动后，Windows 原生蓝牙功能将暂时无法使用这块控制器。**

在执行任何驱动修改之前，应该确认准确的 USB VID/PID，并准备好恢复原厂驱动的方法。不要对不认识的 USB 设备直接安装 WinUSB。

可以在设备管理器中查看蓝牙控制器的硬件 ID。

我的控制器对应：

```text
USB\VID_8087&PID_0037
```

在实际测试中，Intel 控制器有时会处于 Bootloader 模式。即使 WinUSB 驱动已经安装成功，Bumble 仍然无法正常使用它。

如果控制器没有进入 Operational 模式，单纯重启 Bumble 并不能解决问题。

在我的设备上，恢复方法是先切换回 Intel 原厂驱动，让原厂驱动完成固件初始化，再切换到 WinUSB。

为了减少手动操作，我后来通过 PowerShell 脚本自动管理驱动选择、固件检查和部分错误恢复过程。

相关脚本将在整理脱敏后随本文提供。

### 3.4 蓝牙桥接

确认蓝牙控制器可以被 Bumble 访问后，就可以启动桥接程序。

打开 PowerShell，执行：

```powershell
python -m bumble.apps.hci_bridge `
  "android-netsim:_:8877,mode=controller" `
  "usb:8087:0037"
```

桥接程序启动后，保持该进程运行，再启动 Android Emulator。

### 3.5 启动模拟器

接下来使用命令行启动刚才创建的虚拟设备。

我实际使用的启动参数如下：

```powershell
emulator -avd PixelWatch_Android15_Play `
  -port 5556 `
  -timezone Europe/London `
  -change-country GB `
  -packet-streamer-endpoint localhost:8877 `
  -feature -WiFiPacketStream `
  -no-snapshot `
  -no-boot-anim
```

`-packet-streamer-endpoint` 告诉 Emulator 使用本地 Bumble Bridge 提供的蓝牙端点。

`-feature -WiFiPacketStream` 则关闭 Wi-Fi Packet Streaming，让模拟器通过原有的 Legacy NAT 方式访问网络。

在实验过程中，如果没有第二个参数，曾出现蓝牙桥接可以建立，但模拟器网络无法正常工作的情况。

加入该参数后，模拟器可以同时通过物理蓝牙控制器与手表通信，并通过 Windows 主机网络访问 Google 服务。

### 3.6 完成配对

接下来就可以在模拟器中使用 Pixel Watch App，按照正常的配对流程设置手表。

与原先的国行 vivo 手机不同，模拟器使用的是另一套 Android 系统镜像，因此不会直接继承 OriginOS 中触发原先配对失败的系统配置。

在我的实际实验中，初期开发版 AVD 的初始化日志最终出现：

```text
ExitSetupStep
FINISHED
```

这说明初始化流程已经执行到结束阶段。

后续使用稳定的 Android 15 Google Play AVD 时，也多次验证了 Wearable 服务的成功连接和数据通信。

### 3.7 验证结果

最后，我们需要确认的不只是蓝牙控制器工作正常，而是 Android 的 Wearable 服务确实建立了与 Pixel Watch 的通信。

首先检查模拟器是否完成启动：

```powershell
adb -s emulator-5556 shell getprop sys.boot_completed
```

正常启动后，应返回：

```text
1
```

再检查 Google Play services 的 Wearable 服务：

```powershell
adb -s emulator-5556 shell dumpsys activity service `
  com.google.android.gms/.wearable.service.WearableService
```

在成功连接的记录中，可以观察到：

```text
1 connected out of 1
Status: CONNECTED
Last read was 00:01s ago
```

其中，`1 connected out of 1` 表示 Wearable 层已有一个连接的节点，`Last read` 则说明最近存在数据读取活动。

### 3.8 自动化脚本

虽然前面可以通过命令行分别启动 Bumble 和 Android Emulator，但手动管理 Windows 蓝牙驱动并不方便。

因此，我最终编写了一个 PowerShell 启动脚本：

```powershell
.\Start-Android15-Watch.ps1
```

它负责检查 AVD 状态、识别蓝牙控制器、管理驱动切换、检查固件状态，并按正确顺序启动 Bumble 和 Android Emulator。

如果控制器需要恢复到 Windows 原厂蓝牙驱动，也准备了对应的恢复脚本：

```powershell
.\Initialize-Intel-Bluetooth.ps1 -KeepIntelDriver
```

这些脚本依赖事先准备好的、与硬件匹配的驱动备份，并且可能需要管理员权限。不能直接在不匹配的蓝牙设备上运行。