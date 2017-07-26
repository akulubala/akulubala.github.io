---
title: php 添加mogodb扩展+PHP点击图片上传并实现预览效果
layout: post
category: php
---
####PHP添加扩展MongoDB
PHP添加扩展的方式大致都是一致的，这里记录下今天安的这个，免得改天又忘了。

		tar zxvf mongo-1.5.1.tgz -C ../
		cd mongo-1.5.1/
		phpize
		./configure --with-php-config=/usr/local/php/bin/php-config
		make clean->这里有时候会报错所以需要这步，看情况来吧
		make
		make install
		extension=mongo.so

####PHP点击图片上传并实现预览效果（主要记录这个）

客户端代码：

        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="content-type" content="text/html; charset=UTF-8">
          <title>click image upload</title>  
          <script type='text/javascript' src='http://code.jquery.com/jquery-1.6.3.js'></script>  
          <style type='text/css'>
            #picture {
                opacity: 0;
                filter: alpha(opacity=0);
                position: absolute;
                height: 220px;
                width: 220px;
            }
            /**
            上面这段CSS的目的是将file input 按钮覆盖在图片上面以便让人觉的点击的是图片，其实关键也就是这里
            **/
          </style>
        </head>
        <body>
            <form id="fileform" action="./progress.php" method="POST" enctype="multipart/form-data" target="xxx">
                <input type="file" name="file" onchange="upload();" id="picture">
                <span id="filename"></span>
            </form>  
          <img id="images" src="./test.jpg" alt="img">
          <iframe id="xxx" name="xxx"></iframe>
          -->如果想要实现无刷新上传，直接写Iframe IE下会报错，所以还是建议用jquery插件来实现
          <script type="text/javascript">
            function upload(){
              $("#fileform").submit();
            }
          </script>
        </body> 
        </html>
        
服务端代码：

        <?php
        $fp = fopen($_FILES['file']['tmp_name'], 'rb', 0);
        $image = base64_encode(fread($fp,filesize($_FILES['file']['tmp_name'])));
        fclose($fp);
        $src = "data:image/png;base64,".$image;
        -->注意ie8以下不支持data:image/png;base64这样的数据，所以如果需要IE8以下浏览器，请直接使用图片地址
        echo '<script>window.top.document.getElementById("images").src="'.$src.'";</script>';