#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# 进入生成的文件夹


git init
git add -A
git commit -m 'commit vueblog'

# 如果发布到 https://<USERNAME>.github.io
git push -f https://github.com/lidagen/vueblog.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
