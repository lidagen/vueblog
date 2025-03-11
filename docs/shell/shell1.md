## Shell解析器
### Linux 提供的解析器
```
~ cat /etc/shells                              
# /etc/shells: valid login shells
/bin/sh
/bin/bash
/usr/bin/bash
/bin/rbash
/usr/bin/rbash
/usr/bin/sh
/bin/dash
/usr/bin/dash
/bin/zsh
/usr/bin/zsh
```

#### 查询默认解析器
```
➜  ~ echo $SHELL                                                
/usr/bin/zsh

```

### Shell入门
#### 声明 编写helloworld
```
#!/bin/bash

echo "hello world"
```

#### 赋权
```
chmod +x helloworld.sh 
```
#### 执行
```
# bash 或者sh都性

bash helloworld.sh #也可绝对路径
```


### Shell  多命令处理
```
#!/bin/bash

touch xx/readme.txt

echo "create and write txt" >> readme.txt
```

## Shell中的变量
### 系统变量(环境变量) 
+ 作用域是整个操作系统或整个用户
#### 常用系统变量
```
$HOME 、$PWD 、$SHELL 、$USER 等
```
#### 查看系统变量值
```
echo $HOME
```

#### 显示当前Shell中所有变量 set
```
set
```
### 自定义变量
+ 自定义普通变量 
	+  作用域为当前shell（当前解释器）
```
#!/bin/bash

A=100
B="hello world"

echo $A
echo $B     
```

```
# 命令行
export PATH=${GRADLE_HOME}/bin:${PATH}
```
+ 自定义环境变量
```
vi /etc/profile
export PATH=${GRADLE_HOME}/bin:${PATH}

```
#### 普通变量基本语法
+ 定义变量： 变量= 值
+ 撤销变量： unset 变量
+ 声明静态变量： readonly变量， 注意不能unset,也不可reset
#### 变量定义规则
+ 变量名称可以字母、数字、下划线组成，但不能数字开头，环境变量建议大写
+ 等号两侧不可以有空格
+ 在bash中，变量默认都是字符串类型，不能进行数值运算
+ 变量的值如果有空格，需要用双引号或单引号括起来

### 特殊变量
#### 特殊变量 $n
+ 基本语法： n为数字，$0代表该脚本名称，$1-$9代表第一到第9个参数，10个以上参数需要用大括号，如${10}
+ 举例
```
#!/bin/bash

# 给脚本传入三个参数

echo $1
echo $2
echo $3
```

```
bash _04_.sh 111 abc AAA
```

#### 特殊变量 $#
+ 基本语法： 获取所有输入参数个数，常用于循环
+ 举例
```
#!/bin/bash
echo "$0 $1 $2"
echo $#

```

```
bash _05_.sh 11 aa BB 

```

#### 特殊变量 $* 和 $@
+ 基本语法：
```
+  $* 这个变量代表命令行中所有参数，$*把所有参数看称一个整体
+  $@ 这个变量也代表命令行中所有参数，不过$@把每个参数区分对待 
```
	
+ 举例 for循环中都加了双引号,如果不加，两者一样
```
#/bin/bash

# 测试%*

for i in "$*";do
        echo "传入参数是：$i"
done


echo "----------------------------------------"
# 测试$@

for j in "$@";do
        echo "传入参数是：$j"
done

```
```
output
bash _forEach4.sh abc 123
传入参数是：abc 123
----------------------------------------
传入参数是：abc
传入参数是：123
```
#### 特殊变量 $?
+ 基本语法： 最后一次执行命令返回状态，如果变量值为0,证明上一个命令正确，如果非0,证明上一个命令执行不正确


### 运算符

#### 基本语法
```
+ $((运算式)) 或 $[运算式]
+  expr + 、- 、*、/、%
```

+ 举例
```
# terminat
# 计算加空格，赋值加反引号
➜  shRepo D=`expr 2 + 8` 
➜  shRepo echo $D   
10

```

```
# 脚本, 计算有三种写法
#!/bin/bash

A=100
B=20

#写法1
C=$((A+B))

#写法2
C=$[A+B]

#写法3
C=`expr $A + $B`


#综合运算 （2+3）*5

D=$[(2+3)*5]
echo $C
echo $D       

```

### 条件判断
#### 【condition】 condition前后都有空格

```
+ 整数比较
== 字符串比较
-lt 小于(less than)    -le 小于或等于（less equal）
-eq 等于               -gt 大于
-ge 大于等于            -ne 不等于

+ 文件权限判断
-r 只读权限  -w写权限
-x 执行权限

+ 文件类型判断
-f 文件存在且是一个常规文件（file）
-e 文件存在
-d 文件存在并是一个目录（directry）
```
#### 常用判断条件
+ 两个整数比较
```

#!/bin/bash
# 传入参数 > 2输出 param gt 2
# && 逻辑与
[ $# -gt 2 ] && echo "param gt 2"

```

### if判断
#### 语法
+ 条件判断式中必须有空格
+ if后有空格
```
if [ 条件判断式 ]； then
	程序
fi	
```

```
if [ 条件判断式 ]
	then
		 程序
fi		 
```

 + 举例 （-a 是并且的意思）
 ```
#!/bin/bash

if [ $1 -lt 18 ];then
        echo "未成年"
elif [ $1 -ge 18 -a $1 -le 35 ];then
        echo "青年"
else
        echo "中老年"   
fi

 
```

### case语句
#### 语法
+ case行尾必须为单词in，每个模式匹配必须为）结束
+ 双分号；；表示序列结束，相当java的break
+ *) 相当于java中的daulft
```
case $变量名 in
	"值1"）
	；；
	"值2"）
	；；
esac		
```

+ 举例
```
#!/bin/bash

case $1 in
        "A")
                echo "exec A"
        ;;

        "B")
                echo "exec B"
        ;;
        *)
                echo "exec other"
        ;;
esac

```

### for循环
#### 语法1
```
for((初始值；循环控制条件；变量变化))
do
	程序
done	
```
+ 举例
```
#!/bin/bash

for((i=0;i<=100;i++));do
        s=$[$s+$i]
done

echo "sum 1..100 = $s"
~                        
```

#### 语法2
```
for 变量 in 值1 值2 值3 ...
do
	程序
done	
```
+ 举例 (1..100)代表1-100 ，或者用 seq 1 100
```
#!/bin/bash

#for i in {1..100};do
for i in `seq 1 100`;do
        s=$[$s+$i]
done

echo "sum 1..100 bash 2 = s"

```

+ 操作文件列表
```
#!/bin/bash

for i in `ls /home/wangs/Documents/shRepo`;do
        echo $i
done

```

```
#!/bin/bash

target_dir="/home/wangs/Documents/shRepo"
target_file="readme.sh"

for file in "$target_dir"/*;do
         if [ "$(basename "$file")" = "$target_file" ]; then
                echo "i get the readme file"

        fi
done
```

### while循环
#### 基本语法
```
while [条件判断式]
do
	程序
done	
```
+ 举例
```
#!/bin/bash

i=1
sum=0
while [ $i -le 100 ];do
        let sum=sum+i # 也等于 sum=$[ $sum+$i ]
        let i++
done

echo "sum = $sum"

```

### read读取控制台输入
#### 基本语法
```
read(选项)（参数）
选项：
-p : 指定读取值时的提示符
-t : 制定读取值时等待的时间（秒）

参数
	变量：制定读取值的变量名
```

+ 举例
```
#!/bin/bash

read -t 7 -p "enter input a integer gt 1 within 7 seconds" NUM

for ((i=1;i<=$NUM;i++));do
        s=$[$s+$i]
done

echo $s

```

### 函数
#### 系统函数
##### basename 语法、
+ basename string/pathname ,该命令会删掉所有的前缀包括最后一个‘/’字符，然后将字符串显示出来
+ 选项：
	+ suffix为后缀，如果suffi被制定了，basename将pathname或string中的suffix去掉
+ 举例
```
basename /home/wangs/Documents/shRepo/readme.sh
#输出
readme.sh

basename /home/wangs/Documents/shRepo/readme.sh .sh 
#输出
readme

```
##### dirname语法
+ dirnname文件绝对路径
+ 举例
```
dirname /home/wangs/Documents/shRepo/readme.sh         
# 输出
/home/wangs/Documents/shRepo

```
#### 自定义函数
+ 必须在调用函数地方之前，先声明函数，shell脚本是逐行运行，不会提前编译
+ 函数返回值，只能通过$?系统变量获取，可以显式加 return返回，如果不加，将以最后一行运行结果作为返回值返回。return后跟数值n（0-255）
+ 可以参用标准输出：echo来作为函数返回值
##### 基本语法
```
function functionname(){
	Action;
	[return int;]
}

functionname
```

+ 举例
	+ 100 + 200 超过255了，下列例子会返回44

```
#!/bin/bash

function sum(){
        let s=$1+$2

        return $s
}

sum 100 200

echo "sum= $?"

```

+ 返回300的写法
```
#!/bin/bash

function sum(){
        let s=$1+$2

        echo $s
}

result=`sum 100 200`

echo "sum= $result"

```

### shell工具
#### cut
+ cut工作就是“剪”，具体说就是在文件中负责剪切数据用的，cut命令从文件的每一行剪切字节，字符和字段并将其输出
##### 基本用法

```
cut [选项参数] filename
说明：默认分割符是制表符
```

##### 选项参数说明
```
-f 列号
-d 分割符
```

###### 举例
+ 准备工作 vim cut.txt    
```
dong shen
guan shen
wo wo
lai lai
le le
~       
```
+ 按列分割 
	+ "  "按空格分割
	+ -f1指第一列，可以选-f2或 -f1,2
```
cut -d " " -f1 cut.txt


#输出
dong
guan
wo
lai
le
```

#### sed
+ sed是一种流编辑器，它一次处理一行内容，处理时，把当前处理的行存储在临时缓冲区，称为“模式空间”，接着用sed命令处理缓冲区的内容，处理完成后，把缓冲区内容送往屏幕，接着处理下一行这样不断重复，直到文件末尾，文件内容并没有改变，除非你使用重定向存储输出
##### 基本用法
```
sed [选项参数] ‘command' filename
```
##### 选项参数说明
```
-e 直接在指令模式上进行sed的动作编辑
```
##### 命令功能描述
```
a 新增， a后面可以接字串，在下一行出现
d 删除
s 查找并替换
```
###### 举例
+ 准备工作 vim sed.txt    
```
dong shen
guan shen
wo wo
lai lai
le le
```

+ 使用命令
```
#在第一行后面加入hello world
sed '1a hello world' sed.txt
# 删除第一行
sed '1d' sed.txt
# 查找wo并删除
sed '/wo/d' sed.txt
# 替换wo为 AA,只替换第一个
sed 's/wo/AA/' sed.txt
# 替换所有 g=global
sed 's/wo/AA/g' sed.txt

# 多个操作,删除第一行并把全局wo替换为AA
sed -e '3d' -e 's/wo/AA/g' sed.txt

```


#### awk
+ 一个强大文本分析工具，把文件逐行读入，以空格为默认分割符进行切片，切开部分再进行分析处理
##### 基本用法
```
awk [选项参数] `pattern1{action1} pattern2{action2}...` filname

pattern: 表示awk再数据中查找的内容，就是匹配模式
action: 在找到的匹配内容时所执行的一系列命令
```
##### 参数选项说明
```
-F 指定输入文件拆分分割符
-v 赋值一个用户定义变量
```

###### 举例
+ 准备工作
```
cp /etc/passwd ~/Docu
```

+ 使用命令
```
# 指定：为分割符，打印passwd 第一列 第二列,用，分割
awk -F: '{print $1,$2}' passwd 

# 查询包含wangs的用户，打印1 7列
awk -F: '/^wangs/ {print $1,$7}' passwd



```