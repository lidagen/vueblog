### 廖雪峰 GIT教程

#### git 常用命令
````
git init 初始化仓库
git add <fileName> add文件
git commit <fileName> -m "commit content" 提交文件
git push 'https://xxx.git' master 推送master

git log 查看提交记录
git reset --hard HEAD^ 回退上一个版本
git reset --hard HEAD~100 回退上100个版本
git reset --hard <版本号> 回退回到某个未来版本
git reflog 查看命令历史
git checkout  --<fileName> 丢弃工作去修改
git rm <fileName> 删除文件(还需要commit)
````

#### 创建分支和合并分支
````
git checkout -b dev 创建dev分支并切换到dev分支 -b 表示创建并切换,等于 git branch dev + git checkout dev 两条命令
git branch 查看本地分支
git branch -r 查看远程分支
git checkout <分支名> 切换分支
git merge <需要合并的分支名> 合并分支到当前分支 Fast Forword模式
````

#### 解决冲突思路
````
1.git merge,先merge两个版本
2.手动解决冲突(git 用<<<<<<< , =======, <<<<<<<标记不同分支的内容,手动选择解决行冲突的地方)
3.然后add、commit提交
4.git log --graph --pretty=oneline --abbrev-commit可以看分支合并情况
````

#### 分支管理策略no-ff模式
````
1.通常合并分支,GIT用的是fast forword模式,这种模式下,删除分支后,会丢弃分支信息。
2.git merge --no-f -m "commit content" <分支名>    no ff合并
3.合并分支时，加上--no-ff参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，
  而fast forward合并就看不出来曾经做过合并。
````

#### bug分支
````
1.场景：当前dev分支工作未完成,不想要提交代码,但是此时有个bug分支需要你紧急处理
2.git stash 暂存dev目前修改未提交的代码,这时可以切换bug分支进行bug修复
3.bug修复完提交合并,切回dev分支，git stash list命令可查看暂存的工作现场
4.恢复：1.git stash apply 恢复,恢复后stash内容并不删除，你需要git stash drop来删除  2.git stash pop 
  恢复的同时删除暂存
5.如果你有多次暂存,恢复的时候git stash list查看,指定恢复的stash,git stash apply <暂存号>如:stash@{0}
````

#### feature分支
````
1.场景：添加一个实验性新功能,你不希望把主分支搞乱了,这时候最好新建一个feature分支,在上面开发。
2.开发完未合并的情况下,新功能取消,需要删除分支,这时git branch -d <分支名>删除分支会因为未合并失败,更改命令 
  git branch -D <分支名> 强行删除
````

#### 多人协作
````
1.远程库clone时,实际GIT是把本地master分支与远程master对应起来了,并且远程库默认名称是origin
2.git remote -v 查看远程库信息,并查看权限
3.推送分支,就是把该分支所有本地提交推送到远程库 git push origin master
4.抓取分支,默认的 git clone 克隆的是master分支,你需要在dev开发,git checkout -b dev origin/dev,
  创建远程origin的dev分支到本地。
````

#### 多人协作工作模式
````
1.首先，可以试图用git push origin <branch-name>推送自己的修改；
2.如果推送失败，则因为远程分支比你的本地更新，需要先用git pull试图合并；
3.如果合并有冲突，则解决冲突，并在本地提交；
4.没有冲突或者解决掉冲突后，再用git push origin <branch-name>推送就能成功！
  如果git pull提示no tracking information，则说明本地分支和远程分支的链接关系没有创建，
  用命令git branch --set-upstream-to <branch-name> origin/<branch-name>。
````


#### 搭建GIT服务器
````
1.搭建Git服务器需要准备一台运行Linux的机器，强烈推荐用Ubuntu或Debian，这样，通过几条简单的apt命令就可以完成安装。
2.假设你已经有sudo权限的用户账号，下面，正式开始安装。
    第一步，安装git：sudo apt-get install git
    第二步，创建一个git用户，用来运行git服务： sudo adduser git
    第三步，创建证书登录：收集所有需要登录的用户的公钥，就是他们自己的id_rsa.pub文件，把所有公钥导入到/home/git/.ssh/authorized_keys文件里，一行一个。
    第四步，初始化Git仓库：先选定一个目录作为Git仓库，假定是/srv/sample.git，在/srv目录下输入命令： sudo git init --bare sample.git
    Git就会创建一个裸仓库，裸仓库没有工作区，因为服务器上的Git仓库纯粹是为了共享，所以不让用户直接登录到服务器上去改工作区，并且服务器上的Git仓库通常都以.git结尾。然后，把owner改为git：
    $ sudo chown -R git:git sample.git
    第五步，禁用shell登录：出于安全考虑，第二步创建的git用户不允许登录shell，这可以通过编辑/etc/passwd文件完成。找到类似下面的一行git:x:1001:1001:,,,:/home/git:/bin/bash 改为：
    git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell 这样，git用户可以正常通过ssh使用git，但无法登录shell，因为我们为git用户指定的git-shell每次一登录就自动退出。
    第六步，克隆远程仓库：现在，可以通过git clone命令克隆远程仓库了，在各自的电脑上运行：$ git clone git@server:/srv/sample.git
3.管理公钥：如果团队很小，把每个人的公钥收集起来放到服务器的/home/git/.ssh/authorized_keys文件里就是可行的。如果团队有几百号人，就没法这么玩了，这时，可以用Gitosis来管理公钥。
4.权限管理：因为Git是为Linux源代码托管而开发的，所以Git也继承了开源社区的精神，不支持权限控制。不过，因为Git支持钩子（hook），所以，可以在服务器端编写一系列脚本来控制提交等操作，达到权限控制的目的。Gitolite就是这个工具。
````