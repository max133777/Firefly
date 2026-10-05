---
title: "stm32c5软件开发教程"
published: 2026-10-05 12:57:59
description: "stm32c5系列MCU是ST今年新出的，最近做了一个stm32c542cct6最小系统板玩，主频高达144MHZ，stm32c542cct6的flash高达256kb，而且立创商城价格现在18一片，极具性价比，可以完全上位替代stm32f"
image: "./cover.jpg"
tags: ["投稿", "技术分享"]
category: "教程"
categories: ["教程", "技术分享"]
author: "max1337"
slug: "stm32c5"
draft: false
---

stm32c5系列MCU是ST今年新出的，最近做了一个stm32c542cct6最小系统板玩，主频高达144MHZ，stm32c542cct6的flash高达256kb，而且立创商城价格现在18一片，极具性价比，可以完全上位替代stm32f103c8t6

![](./image-9.jpg)

自制打板一遍过

此外stm32c5使用cubemx2+HAL2库，可以说是大变天了，不过整体和过去的那些经典ST的MCU没什么区别，我来讲讲软件环境怎么安装，以及简单讲讲怎么开发

## 一、开发环境安装及工程创建

首先我们去官网下载cubemx2,cubemx2是ST为新一代芯片推出的cubemx最新版，不过目前只有c5的芯片

网址：[STM32CubeMX | Software - STMicroelectronics](https://link.zhihu.com/?target=https%3A//www.st.com/en/development-tools/stm32cubemx.html%23overview)

![](./image-1.jpg)

我们向下滑，找到这个，点下载，网站可能要开梯子才能进去，下载的时候顺便注册填点信息就行

![](./image-36.jpg)

![](./image-3.jpg)

安装的时候就一路同意确认，然后自定义一下安装路径即可

![](./image-10.jpg)

![](./image-24.jpg)

![](./image-31.jpg)

安装完成

然后我们启动cubemx2,旧版 STM32CubeMX 基于 Java 运行，常被吐槽启动慢、资源占用高。STM32CubeMX2 则完全转向了 **Electron** 框架。

Electron 内置[浏览器引擎](https://zhida.zhihu.com/search?content_id=284828599&content_type=Article&match_order=1&q=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E&zhida_source=entity)，能带来更现代、流畅的界面（类似 VS Code 的体验）。这本质上是一次**技术栈的换代**，从 Java 换成了 Web 技术栈。

所以启动速度贼快，而且画面流畅，第一次启动会慢一点点

![](./image-59.jpg)

![](./image-41.jpg)

目前只有c5的芯片

首页，由于我们是自制板，所以选择从MCU创建工程，如果你用官方的评估板，就可以选第二个从开发板启动，区别就是从官方开发板启动会有配置模板，已经帮你把板子上的一些东西比如[时钟树](https://zhida.zhihu.com/search?content_id=284828599&content_type=Article&match_order=1&q=%E6%97%B6%E9%92%9F%E6%A0%91&zhida_source=entity)配置好

![](./image-22.jpg)

我们选择对应的MCU，我这里是stm32c542cct6

![](./image-20.jpg)

点继续

![](./image-49.jpg)

我们创建一个点灯的工程，取名为led

工程管理：务必要先创建好led这个工程的文件夹，这个和cubemx不一样，旧版你只要指定工程路径，然后就会自动生成一个以工程名字命名的文件夹在这个路径。cubemx2你指定路径和名字如led,那个路径下是不会出现led这个文件夹的，只会有led.ioc2以及其它代码文件或者文件夹，没有一个大的led文件夹包含它们

所以我们先创建一个led文件夹

![](./image-56.jpg)

然后我们写工程名字，指定工程路径，并点右下角创建工程

![](./image-12.jpg)

可以看到cubemx2用的是.ioc2了

![](./image-34.jpg)

![](./image-35.jpg)

第一次会慢一点，创建完成我们点launch project打开

可以看到界面大变天了，不过和之前没有什么区别，界面其实还更好看了

![](./image-37.jpg)

和之前cubemx一样，还是那些老东西

侧边栏从上到下，第一个是首页，第二个是芯片总览视图，就是上面那张图片的画面

第三个是时钟树，第四个是外设配置，就是cubemx里左侧栏那些东西，第五个是配置rtos等相关内容

最后一个是自定义配置模块，比如你可以写点led配置(引脚、GPIO配置)，然后以后你想配置led直接导进来就行

先配置debug,我们点侧边栏的第四个外设,打开cortex,找到debug

![](./image-40.jpg)

点activate激活debug,我们选择serial wire

![](./image-2.jpg)

然后我们配置RCC,打开system,找到RCC，可以看到主频144MHZ是固定的，我们找到HSE，选择外部晶振

![](./image-51.jpg)

然后我们来配置时钟树

点左侧第三个配置时钟树

![](./image-54.jpg)

时钟树这边比之前简化了很多，之前配置时钟树主要是三步：1.设置输入[时钟频率](https://zhida.zhihu.com/search?content_id=284828599&content_type=Article&match_order=1&q=%E6%97%B6%E9%92%9F%E9%A2%91%E7%8E%87&zhida_source=entity)(外部晶振频率)2.设置时钟源3.设置主频 然后很多分频或者倍频参数需要自己算或者系统帮你配

现在很多分频或者倍频参数需要自己算或者系统帮你配这部分没了，软件内部自己找到最合适的数，所以简单的很多

先配置HSE OSC=8MHZ(我的板子设计的时候是8MHZ),然后PSI MUX选择倍频时钟源是HSE,然后倍频到PSI，我们PSI就选最高的144MHZ,然后我们选择系统时钟源，看图，显然选PSIS,这样系统时钟就有144MHZ了，后面各外设总线频率就默认配置，无需动

![](./image-14.jpg)

我们还可以看到左下角HSI也是144MHZ，所以这个板子如果没有HSE，用内部HSI也能144MHZ

![](./image-6.jpg)

最后我们看右下角这里，会有红点报错，我们把DAX1SH MUX选下面这个LSI即可

![](./image-43.jpg)

配置时钟树完成，我们回到首页，点侧边第二个pinout,可以看到被标绿的引脚，我们的时钟和debug已经配置完成，如果是半透明绿，就说明配置了，但是没有配置完整

![](./image-18.jpg)

我们顺便看看侧边栏的东西，这是第四个

![](./image-48.jpg)

![](./image-53.jpg)

然后我们配置一下LED,我这里是PC13,右键PC13,把GPIO勾上

![](./image-58.jpg)

然后我们点设置进入引脚配置，当然你也可以从侧边栏外设那边进去

![](./image-8.jpg)

我们看一下原理图，高电平点亮

![](./image-45.jpg)

所以我们这样配置，输出模式，无上下拉，高速，推挽输出，初始低电平，无EXTI

这里有个新的active state,就是说什么时候引脚激活，这个不用管，用不上，不影响我们程序功能编写

![](./image-16.jpg)

然后我们开始工程的配置，我们点击侧边栏的倒数第二个，配置如下

这里和cubemx不一样，不需要再选什么固件包了，也不用选什么.c/.h文件打包生成和copy necessart files,因为软件全部会给我们搞好

![](./image-25.jpg)

开发环境我们选的cmake,cmake配套只能GCC,名字led\_cmake我们就不动，过会就会在led文件夹下生成led\_cmake这个文件夹，里面存放代码，所以这也是为什么要先创建led这个文件夹，这和之前的工程生成规则不一样！

开发环境有几种，如下：

![](./image-13.jpg)

其中第一个就是keil的环境，但是完全不推荐，因为ST官方就是推荐的CMake,而且配套工具极其成熟，接AI、代码提示补全、编译烧录debug都非常齐全好用，而且用的vscode.而keil比较老，不好说对这种新的芯片支持怎么样，可能有一堆bug,第三个那个open-cmsis我们用不到，不用管

我使用了cmake后，st的芯片开发可以完全抛弃keil了，就连vscode那些适配keil的插件都不需要了，直接vscode ST插件+cubemx/cubemx2+cmake插件+AI，而且根本不需要装什么环境，插件全部帮你配置完，而且cmake只是编译工具链不一样，根本不需要懂什么具体cmake的知识

对了注意一下cubeide现在是用不了开发c5的，没有这个选项

我们点击生成project

![](./image-7.jpg)

搞定cubemx2,然后我们先安装vscode的环境，vscode怎么安装，基本的配置这里不再阐述

我们需要安装stm32cubeide for vscode和cmake两个插件，右下角跳出来的东西全部点击安装即可

![](./image-44.jpg)

![](./image-52.jpg)

这些就是前置工作了

然后我们回到刚才生成的工程的文件夹，右键打开vscode,注意一定要回到led\_cmake文件夹，到这个根目录，这样打开vscode就会被自动识别到cmake和stm32cube工程，这样就很方便，不需要手动导入了

![](./image-23.jpg)

打开后等一会，右下角就有了，我们点是（其实顶部那个debug配置会更快出现，我们点即可）

![](./image-26.jpg)

然后我们配置debug

![](./image-57.jpg)

选第一个

![](./image-46.jpg)

这样工程就导进来了，终端打印这些就说明没问题了

![](./image-32.jpg)

## 二、开发入门教程

接下来我们就可以开始写代码了，先介绍一下cmake工程结构

build文件夹下存放编译产物，默认是.elf

cmakelists.txt可以用来添加在工程中新增的文件夹如hardware，用于工程管理

![](./image-17.jpg)

![](./image-21.jpg)

generated文件夹下存放cubemx2生成的内容，就是那些配置的外设的基本代码，每次去修改配置，更新工程后只会更新这个文件夹下的文件，所以老版cubemx之前的没有写在begin..end之间的代码重新生成工程文件后被覆盖的问题也得以解决了，而且不会再有begin..end这种东西了，马上我们就会在main.c里看到

![](./image-28.jpg)

然后stm32c5xx\_drivers下存放了c5的库文件，和cubemx一样，可以在这里找到最新的库函数写法

为什么是最新呢？因为c5用的是HAL2了，HAL2相比HAL优化了很多地方，当然很多语句写法也变了，不过你读过HAL的写法相信HAL2也是很容易看得懂的，实在找不到函数名字可以问AI，顺便推荐一个不错的c5 skill:

[cubemx2\_skills: STM32CubeMX2 命令行 Skill](https://link.zhihu.com/?target=https%3A//gitee.com/keysking/cubemx2_skills)

![](./image-33.jpg)

比如GPIO，现在变成这样了

![](./image-55.jpg)

现在我们来看main.c:

```c
/**
  ******************************************************************************
  * file           : main.c
  * brief          : Main program body
  *                  Calls target system initialization then loop in main.
  ******************************************************************************
  *
  * Copyright (c) 2025 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private typedef -----------------------------------------------------------*/
/* Private define ------------------------------------------------------------*/
/* Private macro -------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/
/* Private functions prototype -----------------------------------------------*/

/**
  * brief:  The application entry point.
  * retval: none but we specify int to comply with C99 standard
  */
int main(void)
{
  /** System Init: this code placed in targets folder initializes your system.
    * It calls the initialization (and sets the initial configuration) of the peripherals.
    * You can use STM32CubeMX to generate and call this code or not in this project.
    * It also contains the HAL initialization and the initial clock configuration.
    */
 if (mx_system_init() != SYSTEM_OK)
  {
 return (-1);
  }
 else
  {
    /*
      * You can start your application code here
      */
 while (1) {

    }
  }
} /* end main */
```

可以看到只有main.h了，这是因为生成的.h文件全部放在main.h了，以后我们只需要include我们自己的.h文件

其次main函数也变了，以前生成的初始化函数如mx\_gpio\_init()也没了，全部放在system\_init里面了。此外在else里，while1的前面我们放一些只需要执行一次的代码如初始化变量，while1里面和之前一样

最后就是没有begin...end了这个不多说了，前面提到了

system\_init这个函数可以自己点进去看看，这里不再阐述

接下来我们来写点灯代码，自己查阅stm32c5xx\_hal\_gpio.h或者问AI很容易写出来

![](./image-29.jpg)

其实这个插件的代码提示非常强，完全没有bug,你输入GPIO\_PIN\_的时候就会发现有HAL开头的提示了，这个比keil还好用

然后我们来编译代码，点最下面生成按钮，可以看到终端打印，生成了led.elf可执行文件，无报错

如果有报错，点终端输出左边那个问题查看报错日志

![](./image-47.jpg)

然后我们开始烧录，如图点击配置，我们用stlink

![](./image-39.jpg)

我们点击全速运行即可

![](./image-38.jpg)

可以看到灯成功点亮

![](./image-5.jpg)

但是这个时候断电再插回来，或者按一下板载reset,发现LED不亮了，程序掉电丢失了，这是怎么回事呢？

因为c5的BOOT问题，如图，这是我们最熟悉的F103的BOOT配置及其对应功能

![](./image-50.jpg)

F1有两个BOOT,但是C5只有一个，那么C5的BOOT是什么功能呢？

![](./image-30.jpg)

可以看到它是配合BOOT\_SEL的

当BOOT\_SEL=0时,若芯片里无程序，无论BOOT按键是否按下，都不起作用，芯片上电直接进bootloader(引导启动部分)，不进flash

若芯片里有程序，那就正常进flash

当BOOT\_SEL=1时，BOOT按键起作用，芯片里有没有程序没关系，我设计的板子BOOT按键按下BOOT0=1,这样就进入了BOOT模式(bootloader),不按下BOOT按键,BOOT=0,按一下RESET按键reset=0后才能正常进flash

那么芯片初始是什么状态呢？

答案是无程序，BOOT\_SEL=0，所以永远都进bootloader,程序自然烧不进去

所以我们需要把BOOT\_SEL改成1，然后烧个程序进去，再把BOOT\_SEL改回0，这样就不用按reset而且能进flash了

打开cubeprg，注意必须2.22版本以上，可以去官网下或者软件内点更新

插好stlink,点连接

![](./image-27.jpg)

连接成功，右下角可以看到信息

![](./image-15.jpg)

如图，找到BOOT\_SEL并将其配置为1，点APPLY应用一下

![](./image-11.jpg)

然后我们右上角断开连接，cubeprg用完要关，不能占stlink！否则vscode那边下载不了

我们回到vscode和刚才一样下载一下程序，下载完后点停止debug

然后回到cubeprg,把BOOT\_SEL改回来

![](./image-42.jpg)

cubeprg用完要关，不能占stlink！

然后我们我们回到vscode和刚才一样下载一下程序，这次程序就进flash了，掉电不会丢失！

最后就是c5把VBAT引脚砍掉了，这样就无法外接纽扣电池给RTC供电做掉电走时了，使RTC持续运行了，可惜了

## 三、其它外设的变化简介

我以定时器为例

现在在配置界面就可以看到生成的时钟频率了，注意分频系数默认是hex,要改成int十进制！

![](./image-19.jpg)

记得滑到底下把NVIC那边中断开一下

原来的&htim也没了，现在是这个，可以去system\_init里找mx\_tim1\_init,在里面可以找到这个

![](./image-4.jpg)

[定时器中断](https://zhida.zhihu.com/search?content_id=284828599&content_type=Article&match_order=1&q=%E5%AE%9A%E6%97%B6%E5%99%A8%E4%B8%AD%E6%96%AD&zhida_source=entity)和之前一样仍然要手动开启，就是函数变了，没有“BASE“了，之前是HAL\_TIM\_BASE\_Start\_IT(&hTIM1);

```c
/**
  ******************************************************************************
  * file           : main.c
  * brief          : Main program body
  *                  Calls target system initialization then loop in main.
  ******************************************************************************
  *
  * Copyright (c) 2025 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private typedef -----------------------------------------------------------*/
/* Private define ------------------------------------------------------------*/
/* Private macro -------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/
/* Private functions prototype -----------------------------------------------*/

/**
  * brief:  The application entry point.
  * retval: none but we specify int to comply with C99 standard
  */
int main(void)
{
  /** System Init: this code placed in targets folder initializes your system.
    * It calls the initialization (and sets the initial configuration) of the peripherals.
    * You can use STM32CubeMX to generate and call this code or not in this project.
    * It also contains the HAL initialization and the initial clock configuration.
    */
 if (mx_system_init() != SYSTEM_OK)
  {
 return (-1);
  }
 else
  {
    /*
      * You can start your application code here
      */
    /* 启动 TIM1 并开启更新中断 */
 HAL_TIM_Start_IT(mx_tim1_gethandle());
 while (1) {
 
    }
  }
} /* end main */

void HAL_TIM_UpdateCallback(hal_tim_handle_t *htim)
{
 if (htim == mx_tim1_gethandle())
    {
 HAL_GPIO_TogglePin(HAL_GPIOC, HAL_GPIO_PIN_13);
    }
}
```

回调函数也有所变化，没有htim->instance了，不过这些都可以通过阅读库函数或者问AI来得到答案

其它外设和之前cubemx配置上没什么区别，就是界面改了别漏了，这里不再阐述了

我自己写了点例程，仅供参考[stm32c5\_project:stm32c5\_project - AtomGit](https://link.zhihu.com/?target=https%3A//gitcode.com/max1337/stm32c5_project)

ST官方示例：[https://dev.st.com/stm32-example-library/](https://link.zhihu.com/?target=https%3A//dev.st.com/stm32-example-library/)

希望这个文档对你有帮助！

再说一句，cmake真的好用！
