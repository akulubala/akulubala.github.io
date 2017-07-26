---
layout: post
title : ubuntu 环境搭建初始化
category : system
---		
##删除IBUS
`sudo apt-get autoremove ibus`

##[install fcitx](https://fcitx-im.org/wiki/Install_%28Ubuntu%29)
    sudo add-apt-repository ppa:fcitx-team/nightly->add source ->then /etc/apt/source.d/ will come up with one file fcitx-team-stable-saucy.list
    after this need:sudo apt-get update
    sudo apt-get install fcitx
    im-config -s fcitx(13.10 use im-config not im-switch) //use fcitx
    sudo apt-get install fcitx-googlepinyin //install googlepinyin
    fcitx -r //restart it then can configue

##delete useless icon from panel 
`sudo apt-get auremove indicator-keyboard`

##log out command
`gnome-session-quit`

##安装flash player
`sudo apt-get install flashplugin-installer`
##安装chromium
`sudo apt-get install chromium-browser`

##[安装goagent](https://code.google.com/p/goagent/wiki/GoAgent_Linux)
安装完成后chromim里面配置switch proxy， ps aux | grep proxy.py 查看进程，然后可以用kill杀死进程或者直接在goagnet命令行界面Ctrl+C退出proxy
证书设置：[http://blog.netsh.org/posts/goagent-https-ssl-error_1013.netsh.html](http://blog.netsh.org/posts/goagent-https-ssl-error_1013.netsh.html)

##安装vim
    sudo apt-get install vim
    vim .vimrc
    mkdir .vim
    git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle
进入vim BundleInstall安装完成

##安装jekyll
1.安装rvm：ruby版本管理器[https://rvm.io/](https://rvm.io/)
`curl -L https://get.rvm.io | bash -s stable`
检查安装：`rvm list known`
安装ruby：`rvm install 2.0.0`
让gnome-terminal以登录模式使用命令：`https://rvm.io/integration/gnome-terminal`
`ruby -v` 检查版本
`ruby -e "print 'hello ruby'"` 运行ruby
irb 进入命令行ruby模式
2.安装bundler:
`gem install bundler`
`gem install jekyll` //这里遇到问题：Unable to download data from https://rubygems.org/ - no such name (https://rubygems.org/latest_specs.4.8.gz)
说是ruby-head什么原因。
运行`gem update --system` 后成功按照jekyll


##项目权限及配置ssh
权限问题一直很烦，又一直很懒，懒的去看怎么弄的，今天小看了一下就设置了一下
在/var/ 下面用root帐号建立了一个www权限，这时候而已看到www目录所有者和组都是root
linux组在/etc/group里面设置的（http://linux.vbird.org/linux_basic/0410accountmanager.php#passwd_file）里面有个www-data,末尾添加ray,向组里添加用户就直接在这个后面添加就可以了用，分割
    sudo chown ray www->更改所有者
    sudo chgrp ray www
完了之后www就是属于ray的并且组为www-data，如果有其他用户需要使用 就更改权限即可

## 添加ssh并和git关联
[https://help.github.com/articles/generating-ssh-keys](https://help.github.com/articles/generating-ssh-keys)
按照上面的步骤其中有一步我没有做
ssh-add id_rsa，这个是将密钥添加到ssh-gen，我目前的理解是ssh-gen是作为ssh的服务的时候使用的，而我目前只是要作为客户端，所以不需要这个

##刚刚找到一个很好用vim的命令

    df$char--->删除当前字符到$char,包括$char
    dt$char--->删除当前字符到$char,不包括$char

同样的 yf 和 yt 也是同样的道理

