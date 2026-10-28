---
title: "国行机连不上 Pixel Watch？我用安卓模拟器解决了配对问题"
description: "一次从国行 Android ROM 的兼容性问题出发，最终通过 Android Emulator 连接真实 Pixel Watch 的技术实践。"
lang: zh-CN
sample: false
published: true
---
## 前言

买了一块 Google Pixel Watch，却发现自己的国行 Android 手机根本无法完成配对，怎么办？

这并不是简单的蓝牙连接问题。对于 Pixel Watch 而言，配对还涉及设备初始化、Google 账户关联与相关服务的启用。如果无法完成这一流程，即使手表能够被蓝牙扫描到，也无法完成首次设置。

更麻烦的是，问题并不只是 Google 服务或网络环境。以我使用的国行 vivo X300 Pro 为例，即使正确配置了 Google 服务与网络，Pixel Watch App 仍然无法完成配对。

为了弄清原因，我反编译了 Pixel Watch App，并分析了底层服务的日志和代码，发现两个主要障碍：

1. **应用层的兼容性问题**：国行 ROM 的配置会触发无法正常完成的初始化流程，导致配对失败。
2. **底层服务的校验限制**：即使修改 App 绕过前面的障碍，仍会受到应用身份校验和 Google Play services 平台检查的限制，无法完成配对。

一种直观的解决办法是使用非国行 Android 手机配对，但为此专门购买另一台手机，成本显然太高了。

**既然问题出在国行 Android 的系统环境上，那么我们能不能直接构建一套国际版 Android 环境来完成配对？**

沿着这个思路，我最终找到了一种基于 **Android Emulator（安卓模拟器）** 的解决方案：让 Windows 上的模拟器代替国行手机完成 Pixel Watch 配对，并通过电脑的实体蓝牙控制器与真实手表通信。

最终，我成功完成了 Pixel Watch 的初始化配对，并建立了 Wearable 服务连接与数据通信。这不只是让模拟器扫描或连接手表，而是走通了原本在国行手机上失败的初始化流程。

本文将介绍整个问题的定位与解决过程，包括：

1. **为什么国行 Android 手机无法完成 Pixel Watch 配对？** 从应用和底层服务入手，分析导致失败的原因。
2. **为什么 Android Emulator 能够解决这个问题？** 介绍替代 Android 环境的思路与原理。
3. **如何实际完成配对？** 提供环境配置、实现代码和操作步骤。

如果你也遇到了 Pixel Watch 在国行手机上无法配对的问题，希望这篇文章能帮助你省下一台额外手机的钱，也少走一些弯路。

---

## 1. 为什么国行手机无法配对？

为了确定配对失败的原因，我先使用 ADB 和 Logcat 分析 Pixel Watch App 的初始化过程，再通过 JADX 反编译应用，追踪相关逻辑。

实验设备为国行 vivo X300 Pro，Pixel Watch App 版本为 `5.0+`，Google Play services 为 `26.33`。

调查过程中，我发现了两个相互独立的问题。

### 1.1 Pixel Watch App 初始化异常

最初，在 Pixel Watch App 的日志中发现了这样一条异常：

```text
npv: Unsupported step zpe
    at oka.h(PG:1516)
```

`zpe` 是混淆后的类名，仅凭异常信息无法判断发生了什么。

通过反编译并追踪相关调用，我发现这个类对应的是配对初始化过程中的 `CHINA_PERSISTENT_SERVICE` 步骤。

这一流程由系统配置和已安装应用共同决定。

检查手机的 `/product/etc/sysconfig/cn_feature.xml`，可以看到：

```xml
<config>
    <feature name="cn.google.services" />
    <feature name="com.google.android.feature.services_updater" />
</config>
```

这两个 Feature 是国行系统环境的特征。其中，`com.google.android.feature.services_updater` 会影响 Pixel Watch App 对初始化流程的选择。

进一步分析后发现，Pixel Watch App 还会检查中国版 Wear OS 应用的版本；测试手机满足了相关条件。

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

也就是说，Pixel Watch App 在当前环境下选择了特殊的初始化路径，但后续 UI 未正确处理对应步骤，最终导致配对中断。

这也解释了为什么修改系统语言、地区设置，甚至确保 Google Play services 正常，都不能解决这个问题。

**问题并不只是设备位于中国大陆，而是国行 ROM 提供的系统 Feature 和应用环境触发了不同的初始化逻辑。**

### 1.2 App 之外的限制

既然找到了初始化异常的判断条件，一个直观的想法就是：修改 Pixel Watch App，使其跳过中国版初始化流程。

为了验证这一思路，我使用 Apktool 修改了两个判断函数，并重新构建、签名和安装实验 APK。

修改确实产生了效果。

原本的异常步骤不再阻止流程继续，日志中出现了：

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

这里暴露出两个限制。

**首先，修改后的 APK 无法直接继承原始应用的可信身份。** 重新签名的应用受到了 Google 服务的身份校验限制。

**其次，Google Play services 自身也会检查设备的平台环境。** 即使 Pixel Watch App 能继续执行，也不代表 Wearable 服务允许在当前设备上运行。

为了确认第二个问题，我继续分析了 Google Play services 的 DEX 代码。

在本次测试的 GMS 版本中，`gmlx.d(Context)` 包含一组平台检查条件：

- 系统声明 `com.google.android.feature.services_updater`；
- 系统声明 `cn.google.services`；
- 当前 Context 属于 `com.google.android.gms`。

这些条件同时满足时，该函数返回 `false`，随后被映射为 `UNSUPPORTED_PLATFORM`，使 Wearable 服务无法启动。

这意味着，即使绕过 Pixel Watch App 的初始化判断，Google Play services 仍可能拒绝启动 Wearable 服务。

因此，**仅修改 Pixel Watch App 并不足以解决整个配对问题。**

### 1.3 问题的本质

至此，可以确定本次测试中存在两层独立的障碍：

| 层级 | 问题 | 实际结果 |
|---|---|---|
| Pixel Watch App | 国行系统配置触发无法正确处理的初始化步骤 | 配对流程异常中断 |
| Google Play services | 应用身份校验及设备平台检查 | Wearable 服务无法正常启动 |

它们都不是修改网络或系统语言就能消除的问题。

当然，从技术上看，继续修改系统 Feature、Hook 应用逻辑或调整 Google 服务的运行环境，仍然是可以研究的方向。但这需要更深层的系统修改，可能涉及 Root、系统完整性及更新兼容性。

对于一块只是需要完成初始化配对的智能手表来说，这条路线显然不够理想。

既然问题集中在国行 ROM 的 Android 运行环境，那么是否真的有必要继续修改这台手机？

**如果能够提供另一套正常运行 Google 服务的 Android 系统，让它代替国行手机完成配对，就有机会避开这些限制。**

这正是后续选择 Android Emulator 的原因。

---

## 2. Android 模拟器方案

### 2.1 更换配对环境

在确认国行 ROM 存在应用初始化和 Google Play services 平台检查两层限制后，我开始考虑另一种解决思路。

既然限制来自手机的 Android 系统环境，那么我们是否真的需要修改这台手机？

Pixel Watch 的首次配对需要能正常运行 Pixel Watch App、Google Play services 和 Android 蓝牙协议栈的环境。如果在电脑上构建这样一套 Android 系统，并接入真实蓝牙硬件，就可以尝试让它代替国行手机完成初始化。

这正是 Android Emulator 能够发挥作用的地方。

Android Emulator 不只是模拟手机界面，还能运行包含系统服务与 Google Play 组件的 Android 镜像。

因此，我们可以选择带有 Google Play 的 Android 系统镜像，无需修改手机 ROM，就能创建独立的配对环境。

不过，这里还有一个关键问题：

**Android Emulator 如何与真实的 Pixel Watch 进行蓝牙通信？**

### 2.2 蓝牙桥接

关键是将 Android Emulator 的蓝牙通信与电脑的物理蓝牙控制器连接起来。

Android 通过 HCI（Host Controller Interface）与蓝牙控制器通信。

如果将模拟器的 HCI 数据流转发给真实蓝牙硬件，就可以让模拟器通过物理蓝牙与 Pixel Watch 配对、通信。

这里使用的是 Google 开源的 [Bumble](https://github.com/google/bumble) 项目。

Bumble 提供了连接不同 HCI Transport 的桥接程序。

利用 `hci_bridge`，我们可以将模拟器蓝牙端点与电脑的 USB 蓝牙控制器连接。

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

在这个架构中，模拟器运行 Pixel Watch App 和相关服务，而 Bumble 负责将蓝牙通信传给物理控制器。

因此，这并不是简单地从电脑上扫描到一只蓝牙手表，也不是模拟 Pixel Watch 的行为。

**我们真正做的是让 Android Emulator 成为手表的配对主机，由它执行完整的初始化流程。**

这样，原本需要一台非国行 Android 手机才能完成的操作，就有机会在现有电脑上实现。

### 2.3 网络环境

当然，蓝牙通信只是其中一部分。

Pixel Watch 初始化还需要与 Google Play services 和网络服务交互，因此模拟器必须正常联网。

在实际实现中，我将这两部分通信分开处理：

- **蓝牙通信**：通过 Bumble HCI Bridge，使用电脑的实体蓝牙控制器。
- **网络通信**：通过 Android Emulator 的网络环境，由 Windows 主机提供互联网访问。

这里遇到过一个问题：启用蓝牙 Packet Stream 后，模拟器的 Wi-Fi 无法正常工作。

经过排查，我关闭 Emulator 的 Wi-Fi Packet Streaming，让它继续使用 NAT 网络，同时保留蓝牙 HCI 桥接。

对应的关键启动参数是：

```text
-packet-streamer-endpoint localhost:8877
-feature -WiFiPacketStream
```

前者指定模拟器的蓝牙桥接端点，后者关闭 Wi-Fi Packet Streaming。

这样一来，模拟器便能够同时使用真实蓝牙硬件和宿主机提供的网络连接。

### 2.4 配对结果

我最初使用 Android 17 开发版镜像实验，并成功走完了 Pixel Watch 的初始化流程。在保存的设置日志中，可以看到最终的 `ExitSetupStep` 和 `FINISHED` 状态。

不过，开发版镜像在 Google 服务认证及登录方面也出现过问题。

为了获得更稳定的环境，我后来转向了 **Android 15 Google Play 镜像**。

在这套环境中，我多次验证了蓝牙初始化、模拟器网络及 Pixel Watch 的 Wearable 服务连接。

例如，实际的服务状态中可以看到：

```text
1 connected out of 1
Status: CONNECTED
Last read was 00:01s ago
```

这表明我们获得的不只是底层蓝牙连接，还包括 Wearable 服务层的正常连接和数据活动。

至此，原先在国行手机上失败的初始化配对，已通过另一套 Android 环境完成。

不过需要强调的是，**这个方案并没有修改或修复 vivo 原有的系统限制**。手表的配对主机是 Android Emulator，而不是原来的国行手机。二者不能混为一谈。

另外，电脑上的蓝牙控制器需要交给桥接程序使用。在我的 Windows 环境中，需要将 Intel 蓝牙驱动切换到 WinUSB，必要时处理固件初始化。

这部分可以通过 PowerShell 脚本管理。

接下来，我会介绍具体如何搭建这套环境、配置蓝牙控制器，并通过 Android Emulator 完成 Pixel Watch 的实际配对。

---

## 3. 配对步骤

前面介绍了方案原理。接下来搭建环境，让 Android Emulator 通过电脑蓝牙与 Pixel Watch 配对。

整个过程分为三部分：创建 Android 虚拟设备、接入物理蓝牙，以及在模拟器内完成初始化。

以下以 Windows 11 + Intel 蓝牙控制器为例。方案已实测，但其他型号可能需要不同驱动。

### 3.1 环境准备

首先需要支持硬件虚拟化的 Windows 电脑，以及 Bumble 可访问的蓝牙控制器。

本次成功使用的环境如下：

| 组件 | 测试环境 |
|---|---|
| 操作系统 | Windows 11 |
| Android Emulator | 36.x |
| Android 系统镜像 | Android 15 / Google Play / x86_64 |
| Python | 3.12 |
| Bumble | 已安装 |
| 蓝牙控制器 | Intel BE201，USB `8087:0037` |
| 虚拟设备 | 4 核 / 4 GB |

需要特别注意两个条件。

**首先，Android 系统镜像必须包含 Google Play。** 本文使用的是 `google_apis_playstore` 镜像，而不是普通 AOSP 镜像。

**其次，电脑上的蓝牙控制器需要支持底层 USB HCI 访问。** 本次通过 WinUSB 接管 Intel 控制器实现这一点。其他型号不能保证使用完全相同的配置。

#### 安装模拟器

最方便的方法是安装 Android Studio，并通过 SDK Manager 安装 Android Emulator 和 Android 15 Google Play 系统镜像。

在 Device Manager 中创建一个新的虚拟设备：

- 设备：支持 Google Play 的 Pixel 手机。
- 系统：Android 15，Google Play，x86_64。
- 内存 / CPU：4 GB / 4 核。

我使用的 AVD 名称为：

```text
PixelWatch_Android15_Play
```

对应的系统镜像是：

```text
system-images;android-35;google_apis_playstore;x86_64
```

如果使用其他名称，需要在后面的启动命令中同步替换。

完成创建后，建议先正常启动一次模拟器，确认 Android 系统能够运行、Google Play services 已安装，且模拟器可以访问网络。

之后关闭模拟器，准备配置蓝牙桥接。

> 本节 AVD 创建操作基于 Android 官方安装流程整理。原实验保留了成功使用的 AVD 配置，但没有完整记录首次创建时每一步的操作；这部分仍需进行一次全新环境复现，当前操作说明尚未完成从零复现验证。

### 3.2 安装 Bumble

[Bumble](https://github.com/google/bumble) 是 Google 的开源蓝牙工具。这里使用 `hci_bridge` 连接模拟器与物理蓝牙控制器。

建议为 Bumble 创建独立 Python 环境，避免依赖冲突。

例如，在 PowerShell 中执行：

```powershell
py -3.12 -m venv .venv

.\.venv\Scripts\python.exe -m pip install `
  "bumble[android]"
```

`[android]` 安装模拟器通信所需的 gRPC、Protobuf 等依赖。

安装完成后，可以检查 Bumble 是否成功安装：

```powershell
.\.venv\Scripts\python.exe -m pip show bumble
```

本次实验使用 Python 3.12 环境，以上安装方式依据 Bumble 的依赖声明整理。

### 3.3 蓝牙驱动

这是 Windows 环境下最需要注意的一步。

Windows 默认通过原厂驱动管理蓝牙，而 Bumble 需要访问 USB HCI，因此本次 Intel 控制器需要切换到 WinUSB。

这里可以使用 [Zadig](https://zadig.akeo.ie/) 等工具安装 WinUSB 驱动，也可以通过 Windows 驱动安装 API 完成绑定。

但需要提前说明：

**切换驱动后，Windows 原生蓝牙功能将暂时无法使用这块控制器。**

所以，如果电脑只有一个蓝牙适配器，原来连接的蓝牙鼠标、耳机等设备也可能断开。

修改驱动前，先确认 USB VID/PID 并备份原厂驱动。不要给未知 USB 设备安装 WinUSB。

#### 控制器型号

可以在设备管理器中查看蓝牙控制器的硬件 ID。

我的控制器对应：

```text
USB\VID_8087&PID_0037
```

因此，Bumble 后续使用：

```text
usb:8087:0037
```

作为 USB Transport 地址。

不同蓝牙设备的 VID/PID 可能完全不同，需要根据实际硬件修改。

#### Intel 固件

这里还存在一个比较特殊的情况。

测试中，Intel 控制器有时处于 Bootloader 模式。即使已安装 WinUSB，Bumble 仍无法使用。

因此，我增加了一个固件状态检查程序，通过 Bumble 的 Intel Driver 接口读取当前运行模式：

```python
from bumble import transport
from bumble.host import Host
from bumble.drivers.intel import Driver, ValueType, ModeOfOperation

async with await transport.open_transport(
    "usb:8087:0037"
) as (source, sink):
    driver = Driver(Host(source, sink))
    info = await driver.read_device_info()

    mode = info.get(
        ValueType.CURRENT_MODE_OF_OPERATION
    )

    print("Firmware mode:", mode)

    assert mode == ModeOfOperation.OPERATIONAL
```

这是实际检查程序的核心逻辑摘录，需要放在异步函数中运行。

如果控制器没有进入 Operational 模式，单纯重启 Bumble 并不能解决问题。

在我的设备上，恢复方法是先切回 Intel 原厂驱动完成固件初始化，再切换到 WinUSB。

为了减少手动操作，我用 PowerShell 脚本管理驱动、固件检查和错误恢复。

相关脚本将在整理脱敏后随本文提供。

### 3.4 启动蓝牙桥接

确认 Bumble 可以访问蓝牙控制器后，就可以启动桥接程序。

打开 PowerShell，执行：

```powershell
python -m bumble.apps.hci_bridge `
  "android-netsim:_:8877,mode=controller" `
  "usb:8087:0037"
```

使用独立 Python 环境时，将 `python` 换成对应解释器路径。

这条命令包含两个端点。

第一个端点：

```text
android-netsim:_:8877,mode=controller
```

负责与 Android Emulator 的蓝牙协议栈交互。

第二个端点：

```text
usb:8087:0037
```

对应真实的 Intel 蓝牙控制器。

Bumble 会在两个端点之间转发 HCI 数据，使 Android Emulator 能够通过真实蓝牙硬件与手表通信。

不要同时启动多个桥接实例争用同一个控制器。

桥接程序启动后，保持该进程运行，再启动 Android Emulator。

### 3.5 启动模拟器

接下来启动刚才创建的虚拟设备。

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

其中最重要的是两个参数：

```text
-packet-streamer-endpoint localhost:8877
-feature -WiFiPacketStream
```

`-packet-streamer-endpoint` 指定 Bumble 的蓝牙端点。

`-feature -WiFiPacketStream` 关闭 Wi-Fi Packet Streaming，保留 NAT 网络。

实验中，缺少后一个参数曾导致蓝牙可用、模拟器网络异常。

加入该参数后，模拟器可以同时通过物理蓝牙控制器与手表通信，并通过 Windows 主机网络访问 Google 服务。

至于：

```text
-timezone Europe/London
-change-country GB
```

它们对应我的测试环境。重点不是修改地区，而是在另一套支持 Google Play 的 Android 环境中配对。

如果需要使用其他地区或时区，可以在后续验证中调整这些参数。

### 3.6 完成配对

到这里，我们已经具备了一台运行 Android 15 的虚拟手机，以及一条连接真实蓝牙硬件的通信路径。

接下来在模拟器中使用 Pixel Watch App，按正常流程设置手表。

整个过程中，Pixel Watch Companion 运行在 Android Emulator 内，手表通过电脑的物理蓝牙控制器与之通信。

模拟器使用另一套 Android 镜像，不会继承国行手机中触发配对失败的系统配置。

在初期实验中，开发版 AVD 的初始化日志出现：

```text
ExitSetupStep
FINISHED
```

这说明初始化流程已执行完毕。

后续使用 Android 15 Google Play AVD，也多次验证了 Wearable 服务连接和数据通信。

首次配对的界面操作、账号登录与手表提示，将在整理记录后补充。

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

随后检查 Bluetooth 状态：

```powershell
adb -s emulator-5556 shell dumpsys bluetooth_manager
```

确认蓝牙处于 ON 状态，并检查是否出现反复崩溃。

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

`1 connected out of 1` 表示 Wearable 节点已连接，`Last read` 表示最近有数据活动。

相比 Bluetooth ON 或绑定状态，这些信息更能证明 Wearable 通信已经建立。

首次初始化还需结合 Pixel Watch App 的设置结束状态，不能仅凭 Wearable 连接判断全部步骤成功。

### 3.8 自动化脚本

虽然可以分别启动 Bumble 和模拟器，但手动管理 Windows 蓝牙驱动并不方便。

特别是 Intel 控制器可能先要加载固件再切 WinUSB；残留桥接进程也可能造成 USB 冲突。

因此，我最终编写了一个 PowerShell 启动脚本：

```powershell
.\Start-Android15-Watch.ps1
```

它负责检查 AVD、控制器和固件，切换驱动，并依次启动 Bumble 与模拟器。

如果控制器需要恢复到 Windows 原厂蓝牙驱动，也准备了对应的恢复脚本：

```powershell
.\Initialize-Intel-Bluetooth.ps1 -KeepIntelDriver
```

这些脚本依赖事先准备好的、与硬件匹配的驱动备份，并且可能需要管理员权限。不能直接在不匹配的蓝牙设备上运行。

完整脚本将在公开前整理并脱敏。

至此，我们已经完成了基于 Android Emulator 的 Pixel Watch 配对环境搭建。

后续将补充逐步配对记录、整理后的脚本，以及不同 Android 系统镜像和蓝牙控制器状态下的测试结果。
