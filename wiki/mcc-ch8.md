# 第八章 计分板


## 8.1 计分板的概念

计分板是Minecraft中基于命令的系统工具，用于存储和显示游戏世界中的各项数据。

核心概念：
- **计分项**：要追踪什么信息（如"金币"）
- **分数持有者**：分数绑定的对象（玩家、实体或假玩家）
- **分数**：存储的具体数值


## 8.2 计分板的创建与删除

### 创建计分项

/scoreboard objectives add <计分项名> dummy [显示名称]

### 删除计分项

/scoreboard objectives remove <计分项名>

### 列出所有计分项

/scoreboard objectives list


## 8.3 计分板的玩家数据操作

### 基本数值操作

/scoreboard players <set|add|remove|reset> <玩家> <计分项> [数值]

示例：

/scoreboard players set @s money 100 # 设为100

/scoreboard players add @a money 10 # 加10

/scoreboard players reset Steve money # 重置

### 假玩家与虚拟分数

计分板可以为"假玩家"记录数据，用于存储中间数据：

/scoreboard players set #total_score 0

以`#`开头的名称不会显示在侧边栏。

### 分数运算

/scoreboard players operation <目标> <计分项> <操作符> <源> <源计分项>

支持的操作符：`=`（赋值）、`+=`（加法）、`-=`（减法）、`*=`（乘法）、`/=`（除法）


## 8.4 计分板的显示方式

/scoreboard objectives setdisplay <list|sidebar|belowname> [计分项]

- **sidebar**：显示在屏幕右侧
- **belowname**：显示在玩家名称下方
- **list**：显示在Tab玩家列表中


## 8.5 计分板的条件检测

### 使用scores参数

精确匹配100分
[scores={money=100}]

100分及以上
[scores={money=100..}]

50分及以下
[scores={money=..50}]

10到50分之间
[scores={money=10..50}]


## 8.6 计分板在方块狂想曲服务器中的应用

- **在线时长记录**：配合循环命令方块统计玩家在线时间
- **方块币系统**：服务器核心经济体系
- **击杀榜**：记录玩家PVP击杀数
- **权限晋升判定**：根据在线时长自动晋升权限等级
