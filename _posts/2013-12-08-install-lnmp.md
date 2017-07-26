---
layout : post
title : LNMP 编译安装
category : system
---
首先安装PCRE 来支持rewrite
----
 - 下载地址：ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/ 
 - 解压缩：sudo tar -zxvf pcre-8.30.tar.gz  -C /usr/local/src
 - 建立安装目录：cd /usr/local  && sudo mkdir pcre
 - 安装：./configure --prefix=/usr/local/pcre<br />
    make&&sudo make install
 - 安装完成之后测试!!!
再安装Zlib
----
1.下载地址：http://prdownloads.sourceforge.net/libpng/zlib-1.2.8.tar.gz?download<br />
2.cd /usr/local/src然后：ln -s ~/Downloads Downloads 将Downloads目录做个软链接<br />
3.tar -zxvf zlib-1.2.8.tar.gz -C /usr/local/src<br />
4.安装：./configure --prefix=/usr/local/zlib<br />
  make&&sudo make install<br />
5.用whereis zlib 检查安装成功（是函数库非可执行文件）
安装nginx
---
1.解压缩这里就不废话了，直接放到src下<br />
2.cd /usr/local/<br >
sudo mkdir lnmp<br/>
sudo chown ray lnmp<br/>
sudo chgrp www-data lnmp<br/>
编译：./configure --prefix=/usr/local/lnmp/nginx --with-pcre=/usr/local/src/pcre-8.30 --with-zlib=/usr/local/src/zlib-1.2.8 --with-http_ssl_module<br />
**这里注意：**pcre和zlib的路径是源文件路径，所以前面我做了两步都是无用功了ngnix自己编译，我遇的到啊～:<strong>--with-pcre=path — sets the path to the sources of the PCRE library.</strong><br />
3.安装：
make&&make install
安装Mysql
---
1.下载地址：http://dev.mysql.com/downloads/file.php?id=450353<br />
2.解压到src目录<br />
3.建立mysql用户:
sudo /usr/sbin/groupadd mysql<br />
sudo /usr/sbin/useradd -g mysql mysql<br />
将自己当前帐号加入mysql 组：usermod -a -G mysql ray <br />
4.cd /usr/local/<br />
sudo mkdir mysql <br />
cd mysql<br />
sudo mkdir mysql_data<br />
4.切换到源文件根目录：sudo cmake -DCMAKE_INSTALL_PREFIX=/usr/local/lnmp/mysql -DMYSQL_UNIX_ADDR=/usr/local/lnmp/mysql/mysql.sock -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci -DWITH_EXTRA_CHARSETS:STRING=utf8,gbk -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DENABLED_LOCAL_INFILE=1 -DMYSQL_DATADIR=/usr/local/lnmp/mysqldata
<br />
详细配置说明地址：http://dev.mysql.com/doc/refman/5.6/en/source-configuration-options.html<br />
5.sudo make && sudo make install<br />
6.sudo cp my-default.cnf /usr/local/lnmp/mysqldata/my.cnf  (注意:my-large.cnf适用于1G内存左右的服务器，可以根据自己配置情况选用my-large.cnf 或 my-huge.cnf 等不同配置)<br />
sudo cp mysql.server /etc/init.d/mysqld<br />
编辑mysqld,basedir=/usr/local/lnmp/mysql;datadir=/usr/local/lnmp/mysqldata
 - sudo ./mysql_install_db --defaults-file=/usr/local/lnmp/mysqldata/my.cnf --basedir=/usr/local/lnmp/mysql datadir=/usr/local/lnmp/mysqldata --user=mysql<br />
 - 将mysqld加入服务，直接重启也可以：sudo apt-get install sysv-rc-conf<br />sudo sysv-rc-conf mysqld on
 - 测试：service mysqld restart<br />
10.缺省安装的mysql是没有密码的，所以我们要修改，以防万一。下面采用三种方式来修改root的口令。 <br />
cd /usr/local/lnmp/mysql/bin/mysqladmin -uroot password test 
·
更多安全参考](http://www.cnblogs.com/xh831213/archive/2011/10/13/2210194.html)
PHP 安装
---
1.安装[libxml](ftp://xmlsoft.org/libxml2/)
  用于解析xml的：<br />下载完成后解压缩到/usr/local/libxml<br />
2.jpeg安装,下载[http://www.ijg.org/files/jpegsrc.v9.tar.gz](http://www.ijg.org/files/jpegsrc.v9.tar.gz)<br />
解压缩到/usr/local/src/目录<br />
./configure --prefix=/usr/local/jpeg-9->make&&sudo make install<br />
3.安装PNG支持下载:[libpng](http://sourceforge.net/projects/libpng/files/libpng12/1.2.50/libpng-1.2.50.tar.gz/download?use_mirror=nchc&download=)<br />
./configure --prefix=/usr/local/libpng->make&&sudo make install<br />
4.Freetype安装，[下载](http://download.savannah.gnu.org/releases/freetype/freetype-2.4.0.tar.gz),安装:./configure --prefix=/usr/local/freetype->make&&sudo make install<br />
5.libmcrypt安装,[下载](http://sourceforge.net/projects/mcrypt/files/Libmcrypt/2.5.8/libmcrypt-2.5.8.tar.gz/download)<br />安装：./configure --prefix=/usr/local/libmcrypt-2.5.8->make&&sudo make install<br />
6.mhash 安装,[下载](http://sourceforge.net/projects/mhash/files/mhash/0.9.9.9/mhash-0.9.9.9.tar.gz/download)<br />安装：./configure --prefix=/usr/local/libmcrypt-2.5.8->make&&sudo make install<br />
7.mcrypt[下载](http://sourceforge.net/projects/mcrypt/files/MCrypt/2.6.8/mcrypt-2.6.8.tar.gz/download)<br />
*注意第七条依赖于5,6*<br />
直接编译出错
然后执行以下操作：
>1.~/.profile 里面加入export      LD_LIBRARY_PATH=/usr/local/libmcrypt-2.5.8/lib:/usr/local/mhash-0.9.9.9/lib 配置前面两个库的lib地址<br />
>2../configure --prefix=/usr/local/mcrypt-2.6.8 --with-libmcrypt-prefix=/usr/local/libmcrypt-2.5.8

可惜又报另一个错误
[参考这里](http://segmentfault.com/q/1010000000094627)
export CFLAGS="-I /usr/local/mhash-0.9.9.9/include/"<br />
export LDFLAGS="-L /usr/local/mhash-0.9.9.9/lib -I /usr/local/mhash-0.9.9.9/include/"
再次执行configure 通过,但是make&&sudo make install 却报错<br />
结果再参考[make file 选项](http://www.cnblogs.com/taskiller/archive/2012/12/14/2817650.html)
发现**上面两条export 是不正确的**<br />
正确的应该是：
>export LDFLAGS="-L/usr/local/libmcrypt-2.5.8/lib -L/usr/local/mhash-0.9.9.9/lib";<br />
>export CFLAGS="-I/usr/local/libmcrypt-2.5.8/include -I/usr/local/mhash-0.9.9.9/include"

注：/etc/ld.so.conf,关于.so动态库的载入参考鸟哥(http://linux.vbird.org/linux_basic/0520source_code_and_tarball.php)<br />

最终编译安装mcrypt 成功,以上PHP 依赖库安装完毕
####接下来正式PHP 安装
1.下载并加压后<br />
>export LIBS="-lm -ltermcap -lresolv"(注：这句我不晓得是什么意思所以没用)<br/>
>export LD_LIBRARY_PATH="/usr/local/lnmp/mysql/lib:/lib:/usr/lib/:/usr/local/lib/:/usr/local/libmcrypt-2.5.8/lib/:/usr/local/mhash-0.9.9.9/lib/:/lib64/:/usr/lib64/:/usr/local/lib64/" (参考不同操作系统设置:http://blog.chinaunix.net/uid-14504139-id-3867128.html)

.<code>./configure<br />
--prefix=/usr/local/lnmp/php<br />
--with-config-file-path=/usr/local/lnmp/php/etc <br />
--with-mysql=/usr/local/lnmp/mysql<br /> --with-mysqli=/usr/local/lnmp/mysql/bin/mysql_config <br />
--with-freetype-dir=/usr/local/freetype<br /> --with-jpeg-dir=/usr/local/jpeg-9<br />
--with-png-dir=/usr/local/libpng<br />
--with-zlib<br />
--with-libxml-dir=/usr/local/libxml2<br /> 
--enable-xml <br />
--disable-rpath <br />
--enable-bcmath <br />
--enable-shmop[消息队列](http://wizardmin.com/2012/08/php-ipc-sysvmsg/)<br /> 
--enable-sysvsem<br />
--enable-inline-optimization(使用更多内存加快程序结果)<br />
--with-curl<br />
--enable-mbregex<br />
--enable-fpm<br />
--enable-mbstring<br />
--with-mcrypt=/usr/local/mcrypt<br />
--with-gd<br />
--enable-gd-native-ttf<br />
--with-openssl<br />
--with-mhash <br />
--enable-pcntl（打开进程控制支持）<br />
--enable-sockets<br />
--with-xmlrpc<br />
--enable-zip<br />
--enable-soap <br />
--enable-fpm(开始没有加这个NGINX 就没办法解析PHP 有些作者真是肯跌啊)</code>

出错啦：
解决方法：sudo apt-get install libcurl4-gnutls-dev 就不编译安装啦
再次错错：error: mcrypt.h not found. Please reinstall libmcrypt<br />
解决方法：sudo apt-get install libmcrypt-dev很纳闷
再次错误：找不到mysql_config 这次是打字错误，更郁闷

完整configure：<code> ./configure<br />
--prefix=/usr/local/lnmp/php  <br />
--with-config-file-path=/usr/local/lnmp/php/etc  <br />
--with-mysql=/usr/local/lnmp/mysql  <br />
--with-mysqli=/usr/local/lnmp/mysql/bin/mysql_config  <br />
--with-pdo-mysql=/usr/local/lnmp/mysql  <br />
--with-mysql-sock=/usr/local/lnmp/mysql/mysql.sock  <br />
--with-freetype-dir=/usr/local/freetype  <br />
--enable-fpm  <br />
--with-fpm-user=ray  <br />
--with-fpm-group=www-data  <br />
--with-jpeg-dir=/usr/local/jpeg-9  <br />
--with-png-dir=/usr/local/libpng  <br />
--with-zlib  <br />
--with-libxml-dir=/usr/local/libxml2  <br />
--enable-xml  <br />
--enable-bcmath  <br />
--enable-shmop  <br />
--enable-sysvsem  <br />
--enable-inline-optimization  <br />
--with-curl  <br />
--enable-mbregex  <br />
--enable-mbstring  <br />
--with-mcrypt=/usr/local/mcrypt  <br />
--with-gd  <br />
--enable-gd-native-ttf  <br />
--with-openssl  <br />
--with-mhash  <br />
--enable-pcntl  <br />
--enable-sockets  <br />
--enable-zip  <br />
--enable-soap</code>
make&&make test&&make install
启动php-fpm,cd /usr/local/lnmp/php/sbin/php-fpm
