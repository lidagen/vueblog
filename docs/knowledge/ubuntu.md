## Ubuntu 下Linux 命令

#### 查看被占用的端口号以及中止
````sh
# 根据端口号找到进程
sudo losf -i:端口号

# 杀掉进程
sudo kill PID号
````
#### 给文件夹读写权限
````sh
# zookeeper目录下拥有读写权限
sudo chmod -R 777 /opt/software/zookeeper
````
#### 解压tar.gz包
````sh
# 把xxx.tar.gz 解压到绝对目录/opt/software下
sudo tar -zxvf  xxx.tar.gz -C  /opt/software
````
