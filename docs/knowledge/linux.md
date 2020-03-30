### Linux常用命令

#### 日志查找
+ cat关键字查找 
````sh
cat xxx.log |grep '关键字' --color

// (显示日志里匹配字串那行以及前后5行)
cat xxx.log | grep -C 5 '关键字'

//全局搜索关键字
find ./ ! -name "*[0-9]*" | xargs grep --color '关键字'
//去除注释查看redis.conf 
cat redis.conf | grep -v "#" |grep -v "^$"
//去除注释并复制redis-6379.conf
cat redis.conf | grep -v "#" |grep -v "^$" > redis-6329.conf
````

+ tail查看日志
````
//查看实时日志
tail -f xxx.log

//最后20行日志
tail -n 20 xxx.log

//查看磁盘空间
df -h
````