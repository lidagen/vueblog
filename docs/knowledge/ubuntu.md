## Ubuntu 下Linux 命令

+ **sudo**
允许当前用户以root权限执行

+ **apt-get**
Ubuntu从互联网仓库中搜索、安装、升级、卸载软件。（CentOS中用yum）

#### 更新软件仓库源列表
````sh
sudo apt-get update
````
#### 更新本地已安装的软件
````sh
sudo apt-get upgrade
````

#### 查看被占用的端口号以及终止
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

### 修改文件
````sh
#编辑settings.xml文件
sudo gedit /opt/software/maven/conf/settings.xml
````

### 新建文件
````sh
sudo touch /opt/1.md
````


