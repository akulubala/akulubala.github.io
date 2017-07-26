---
title : PHP 获取字符串长度，字节数...
layout : post
category : php
---
PHP获取字符串长度有两个函数：mb_strlen 和strlen,mb_strlen在安装的时候加上--enable-mbstring 以支持国际化字符.
用两个个文件来说明：

 1. 首先建一个文件，文件默认编码为：ANSI格式，也就是平常建项目的时候建GBK编码的项目
    
        $string = "测试用的字符串abcdefg";
        
        1).  var_dump(mb_detect_encoding($string))."<br />";//布尔值false
        
        2).  echo mb_strlen($string)."<br />";//21
        
        3).  echo mb_strlen($string,"gbk")."<br />";//14
        
        4).  echo mb_strlen($string,"utf-8")."<br />";//16
        
        5).  echo strlen($string)."<br />";21
上面的例子中1)中不给第二个参数的情况下为false,因为mbstring 里面mb_detect_order默认是没有检查中文的，所以改为：  
`var_dump(mb_detect_encoding($string,"gbk"))`,这样的话结果就为CP936，说明确实是中文了，从2),3),4),5)中可以看出,正确的结果是3),2)和5)是把一个中文当两个字符处理，也就是在gbk下的字节数，gbk编码下中文字符是占两个字节，所以这两个  
结果是将算出了字节数，也就是所谓的内部编码(文件的编码)，二第四个完全错了,这个是指定编码错误的情况下，具体怎么算了我也不清楚，

 2. 再建一个文件使用UTF-8无BOM头部的文件，同样是上面的例子  

        $string = "测试用的字符串abcdefg";  
        
        1.var_dump(mb_detect_encoding($string,"gbk,UTF-8"))."<br />";//结果是CP936  
        
        2.echo mb_strlen($string)."<br />";  //结果是28
        
        3.echo mb_strlen($string,"gbk")."<br />";  //17
        
        4.echo mb_strlen($string,"utf-8")."<br />";  //14
        
        5.echo strlen($string)."<br />";//28

上面例子1中结果错误,文件编码是utf-8，却检查出是cp936,说明检查的顺序有问题，这串字符串GBK可以通过，UTF-8也可以通过，所以正确的检查方式应该是`var_dump(mb_detect_encoding($string,"UTF-8,gbk"))`这样就对了。
后面几个获取长度的例子中4是正确的，1，5是以文件编码来获取长度了也就是其实算的是字节数，3同样是 混乱出错

所以检查字符串长度的正确方式应该是

mb_strlen($string,mb_detect_encoding($string,"UTF-8,gbk")),仅限中文和英文

有些情况下喜欢 把一个中文当两个英文字符处理来算，可以用以下方式：

`(mb_strlen(trim($input[$field]),"UTF-8")+  strlen(trim($input[$field])))/2`

如果是GBK的直接 strlen就可以算出中文算两英文的长度了

 

         
