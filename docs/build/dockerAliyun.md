### 配置Docker
+ 登录阿里云找到容器镜像服务
+ 创建命名空间
+ 创建镜像仓库

### 配置阿里云镜像加速器
````sh
# 宿主机docker修改镜像源
$ sudo mkdir -p /etc/docker
$ sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://a8qh6yqv.mirror.aliyuncs.com"]
}
EOF
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
````

### 登录仓库
````sh
$ sudo docker login --username=你的阿里云登录帐号 registry.cn-hangzhou.aliyuncs.com
Password: # aliyun访问凭证中设置密码，不是aliyun登录密码
Login Succeeded
````

### 镜像使用
````sh
$ sudo docker pull registry.cn-hangzhou.aliyuncs.com/空间名/仓库
````

### 提交镜像
````sh
$ sudo docker tag <已存在镜像ID或名称> registry.cn-hangzhou.aliyuncs.com/空间名/仓库
$ sudo docker push registry.cn-hangzhou.aliyuncs.com/空间名/仓库
````