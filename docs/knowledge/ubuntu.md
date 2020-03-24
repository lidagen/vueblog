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

### 移动、拷贝、删除
````sh
#移动
sudo mv /opt/1.png   media/ws/disk1
#拷贝
sudo cp /opt/1.png   media/ws/disk1
# 删除(-rf 递归强制删除文件及其子目录)
sudo rm -rf /opt/test
````

### systemctl
````sh
#foobar表示伪变量
#打开服务:
sudo systemctl start foobar
#关闭服务:
sudo systemctl stop foobar
#重启服务:
sudo systemctl restart foobar
#不中断正常功能下重新加载服务:
sudo systemctl reload foobar
#设置服务的开机自启动:
sudo systemctl enable foobar
#关闭服务的开机自启动:
sudo systemctl disable foobar
#查看活跃的单元:
systemctl list-units
#查看某个服务的状态:
systemctl status foobar
#查看已启动的服务列表：
 systemctl list-unit-files|grep enabled
#查看启动失败的服务列表：
systemctl --failed
````


