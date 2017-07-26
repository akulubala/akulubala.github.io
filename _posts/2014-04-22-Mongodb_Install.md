---
title: Mongodb 安装过程
layout: post
category: mongodb
---

官方文档在这里：http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/

首先需要知道,mongod是服务进程,mongo是客户端进程

1.下载解压（可以自由发挥）

    curl -O http://downloads.mongodb.org/linux/mongodb-linux-x86_64-2.6.0.tgz
    tar -zxvf mongodb-linux-x86_64-2.6.0.tgz -C /usr/local/
    mv mongodb-linux-x86_64-2.6.0.tgz mongodb
    
2.建立配置文件及数据存放目录：

    /usr/local/mongodb/bin/mongodb.conf->配置文件
    /usr/local/mongodb/db->数据存放目录
    /usr/local/mongodb/log/mongodb.log->log 文件
    
3.配置文件内容：

    dbpath=/usr/local/mongodb/db
    logpath=/usr/local/mongodb/log/mongodb.log
    logappend=true
    fork=true->后台demon运行

4.启动..

需要配置环境变量
以何种身份运行mongod，root的话切换到root 编辑~/.bashrc
export PATH=$PATH:/usr/local/mongod/bin

    mongod->启动命令

5.测试安装状况:

    mongo
    db.version();
    