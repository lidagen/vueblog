## Linxu Shell 

### shell脚本编写
+ vim helloworld.sh
````sh
#! /bin/bash
echo "hello world"

echo $uname

````
+ 赋予可执行权限
````sh
chmod u+x helloword.sh
````

### 脚本编写和三种执行方式
+ 数据脚本的绝对路径或者相对路径 `必须是可执行文件`
````sh
/root/helloword.sh

./helloword.sh
````
+ bash或者sh +脚本 `普通文件脚本文件都可以`
````sh
sh helloword.sh
````

+ 在脚本路径前加 `.`或souce `普通文件脚本文件都可以`
````sh
source helloword.sh
````

'''
区别:
1. 第一种和第二种会新开一个bash,不同bash中的变量无法共享
2. 第三种 是在同一个shell里执行 
	- 打开shell 执行 uname=admin
	- 分别三种方式执行hellworld.sh,第三种会打印admin
'''

'''
export:可以将当前进程变量传递给子进程使用
 - 配置profile的时候 所有变量前必须加export
'''

'''
sh脚本增加ping www.baidu.com,三种方式执行脚本
ps -ef 查看ping结果,会发现source 也可以体现source不会打开新进程执行ping
'''

+ export 
 - shell 脚本执行,默认从当前进程查询变量
 - 当期进程查不到,会查询父进程
 - export修饰变量,这个变量对子进程可见(不加export对子进程不可见)
````sh
export uname=admin

# 三种方式都可以打印uname值
````

### shell 操作
#### 变量的操作
- 变量名定义
	+ 定义变量时,变量名不加$
	+ 中间不可有空格,可以使用下划线
	+ 不能使用标点符号
	+ 不能使用bash关键字(可用help查看保留关键字)
- 变量类型
	+ 局部变量: 在脚本或命令中定义,仅当前shell实例中有效,其它shell启动不能访问局部变量
	+ 环境变量: 所有程序,包括shell启动程序,都可访问,有些程序需要环境变量保证正常运行
	+ shell变量: shell变量是由shell程序设置的特殊变量,shell变量中有一部分是环境变量,有一部分局部变量
````sh
# 变量声明
name="zhangsan"

# 变量的调用
echo $name
echo ${name}

# 删除变量
unset name

# 只读变量(变量不可更改,删除)

url="www.baidu.com"
readonly url
````

#### 字符串的操作
+ 字符串是shell编程中最有用的数据类型,字符串可以用单引号,也可以用双引号,也可以不用引号
+ 单引号
	- 单引号中任何字符都会原样输出,单引号中的变量引用无效
	- 单引号字符串中,不可再出现一个单引号,单可成对出现,作为字符串拼接使用
+ 双引号
	- 可以有变量
	- 双引号中可以出现转义字符	
````sh

# 声明字符串
str1 = hello world !

# 字符串拼接 双引号
name = sunwukong
name1 = "hello, "$name"!"

# 字符串拼接,单引号
name = sunwukong
name1 = 'hello, '$name'!'
name1 = 'hello, $name!' # 这个无法获取变量,因为上一个,前两个单引号一组,后两个一组,不影响$name

#字符串
email=proton1206.name
echo ${#email} #字符串长度
echo ${email:1:4} #字符串截取
````
#### 数组
+ bash支持一维数组,并没有限定数组大小
+ 数组元素下标从0开始,获取数组元素利用下标,下标可以是正整数或算术表达式
````sh
#定义数组
arr=("篮球" "足球" "羽毛球")

#读取
arr_1=${arr[1]}

#获取所有数组元素
echo ${arr[@]}

#获取数组长度
length=${#arr[@]}
length=${#arr[*]}
````

#### shell注释
+ 以`#`开头的行就是注释,会被解释器忽略
+ 特殊的多行注释
````sh
:<<EOF
注释内容...
注释内容...
EOF

:<<!
注释内容...
注释内容...
!

````

#### 运算符
+ 运算符分类
	- 算术运算符
'''
`+` 加法 `expr $a + $b` 结果为30
`-` 减法 `expr $a - $b` 结果为10
`*` 乘法 `expr $a\$b`
`/` 除法 `expr $a/$b`
`%` 取余 `expr $a%$b`
`=` 赋值 `a=$b`
`==` 相等,比较两个数字返回布尔值`[$a==$b]`
`!=` 不等,比较两个数字返回布尔值`[$a!=$b]`
'''	
````sh
#! /bin/bash

a=10
b=20

val = `expr $a + $b`
echo $val

if [ $a != $b ]
then
	echo "budengyu"
fi	
````


	- 关系运算符
'''
`-eq` 检查是否相等,返回布尔值 `[ $a -eq $b ]`
`-ne` 检查是否不相等
`-gt` 大于
`-lt` 小于
`-ge` 大于
``
'''	

````sh
#! /bin/bash
a=10
b=20

if [ $a -lt $b ]
then
	echo "$a xiaoyu $b"
fi	
````
	- 布尔运算符
'''
`!` 非运算,表达式为true则返回false `[ !false ]`返回true
`-o` 或运算,相当于 || , [ $a -lt 20 -o $b -gt 100 ]
`-a` 与运算,相当于 && , [ $a -lt 20 -a $b -gt 100]
'''	

	- 字符串运算符
'''
`==` 检查字符串是否相等 [ $a == $b ]
`!=` 检查字符串不等 [ $a != $b ]
`-z` 检查字符串长度是否为0,为0返回true [ -z $a ]
`-n` 检查字符串长度是否不为0 [-n $a ]
`$` 检查字符串是否为空  [ $a ]
'''	
	- 文件测试运算符
'''
`-r` 是否是可读的
`-w` 是否是可写的 
`-x` 是否是可执行的
`-f` 是不是一个文件
`-d` 是不是一个目录
`-s` 是否不为空
`-e` 文件是否存在
'''

````sh
file="/var/node/test.sh"
if [ -r file ]
then
	echo "可读"
else
	echo "不可读"
fi			
````

#### echo打印数据
````sh
echo "hello wrold"
# 转义字符
echo "\"hello world "\"

# 显示变量
a=zhangsan
echo " hello, $a"

# 显示换行
echo -e "OK! \n"

# 显示不换行
echo -e "OK! \c"

# 显示结果定向至文件(覆盖)
echo "hello world" > myfile

# 原样输出字符串
echo '$name\"'

# 显示命令执行结果
echo `date`
````

### shell 流程控制
#### 分支if case
````sh
if condition1
then 
	command1
elif condition2
then
	command2
else
	command3
fi				
````

#### case 为多选择语句,可以用case匹配一个值与一个模式
````sh
# ;;相当于break 不加会穿透
case 值 in
模式1)
	command1
	command2
	;;
模式2)
	command1
	command2
	;;
esac		

````

````sh
# read 监控键盘输入
echo '输入1到2之间数字'
echo '你输入的数字为:'
read num
case $num in
	1) echo "你选择了1"
	;;
	2) echo "你选择了2"
	;;
	*) echo "你没有选择1或2"
esac
````

#### 循环 for 
````sh
for loop in 1 2 3 4
do
	echo "this value is $loop"
done	
````

````sh
for str in "This is a string","hello moto"
do
	echo $str
done	

````

#### 循环while
````sh
#let命令,用于执行一个或多个表达式,变量计算中不需要加$来表示变量
int=1
while(($int<=5))
do
	echo $int
	let "int++"
done

#无线循环
while true
do
	command
done	

````

#### break 跳出循环 continue 跳出本次循环
````sh
#! /bin/bash

while:
do
	echo -n "输入1到5之间数字"
	read num
	case $num in
		1|2|3|4|5) 
		echo "你输入的数字是$num"
		;;
		*) 
		echo "输入的不是1到5,游戏结束"
		break
		;;
	esac
done

````		

#### 函数
+ linux shell 可以用户定义函数,然后在shell中调用
+ 可以带function fun()定义,也可以直接fun()定义,不带任何参数
+ 参数返回,可以显式加return,如果不加,将以最后一条命令结束的结果作为返回值
````sh
#! /bin/bash
demoFun(){
	echo "这是我第一个shell 函数"
	echo "输入一个数字"
	read aNum
	return $aNum
}

echo "执行函数开始"
demoFun
echo "执行函数结束"
echo $?


# 函数参数
funwithparam(){
	echo "第一个参数 $1"
	echo "第二个参数 $2"
	echo "参数总数 $#"
	echo "字符串输出所有参数 $*"

}
funwithparam 1 2 3 4 5
````

### linxu开机顺序

#### 基于开机自启动rc_local

````sh
touch /usr/local/my_init.sh

cd /etc/rc.d/

vi rc.local
# 添加执行脚本

source /usr/local/my_init.sh
````

+ 创建脚本存放文件夹,创建脚本
````sh
mkdir -p /usr/local/script

touch /usr/local/script/my_init.sh
# 编写脚本
# 设置执行权限
chmod u+x /usr/local/script/my_init.sh
# 脚本copy到/etc/init.d/目录下
cp my_init.sh /etc/init.d/
# 添加到服务
chkconfig -add /etc/init.d/my_init.sh
# 重启
reboot

````
#### 基于开机自启动chkconfig

+ `vim /usr/local/dateservice.sh`

+ 脚本需要加`#chkconfig: 35 66 88`
````sh
#! /bin/bash
#chkconfig: 35 66 88

netpdate cn.ntp.rog.cn
`````
+ `chmod ug+x /usr/local/dateservice.sh`

+ `mv dateservice.sh /etc/rc.d/init.d/`

+ `chkconfig --add /etc/init.d/dateservice.sh`


#### 定时执行任务crontab
+ 在系统服务中,crond负责周期任务`systemctl status crond.service`
+ 添加任务,编辑当前用户任务列表`crontab -e`
+ cron表达式 `分 时 日 月 周 命令`
'''
30 21 * * * /usr/local/etc/rc.d/lighttpd restart
'''


+ 重启crontab,配置生效 `systemctl restart crond.service`
+ 通过`crontab -l`查看定时任务
+ 查看历史任务`vim /var/spool/mail/root`
+ 清除任务 `crontab -r`

#### 服务器免密
