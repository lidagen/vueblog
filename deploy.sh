#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io 
# git push -f https://github.com/lidagen/lidagen.github.io.git master
git push -f git@github.com:lidagen/lidagen.github.io.git master

current_time=$(date "+%Y-%m-%d %H:%M:%S")

cli push --title "vueblog deploy" --content "Deploy time is $current_time"

# git push -f https://gitee.com/GENDALI/lidagen.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
