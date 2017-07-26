---
title : PHP 上传进度条..
layout : post
category : php
---
####准备工作：

 1. PHP5.4以上
 2. php.ini 开启session.upload_progress.enable
 3. 更改这两个参数以适应大文件上传：post_max_size,upload_max_filesize

####开始代码部分（直接贴了）：

 1. HTML(PHP copy上传文件，就在这里了省的再建个文件):

        <?php
        
        function help()
        {
                foreach(func_get_args() as $v)
                {
                    echo "<pre>";
                    var_dump($v);
                    echo "</pre>";
                }
        
            die();
        }
        if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_FILES["userfile"])) {
            move_uploaded_file($_FILES['userfile']['tmp_name'], "./a");
        }
        ?>  
        <html>
        <head>
        <title>File Upload Progress Bar</title>
        <style>
        ...add css here
        </style>
        </head>
        <body>
        <div id="bar_blank">
        <div id="bar_color"></div>
        </div>
        <div id="status"></div>
        <form action="" method="POST"   id="myForm" enctype="multipart/form-data">
        <input type="hidden" value="myForm"    name="<?php echo ini_get("session.upload_progress.name"); ?>">
        <input type="file" name="userfile"><br>
        <input type="submit" value="Start Upload">
        </form>
        <iframe id="hidden_iframe" name="hidden_iframe" src="about:blank"></iframe>
        <script>
        ...add javascript here
        </script>
        </body>
        </html>
        
 
      上面这段需要解释一下，1)Form里面有个隐藏域这个是必不可少的，用来带上上传session名称的，2)还有个IFrame     用来做类似无刷新上传的，3)div bar_blank这里是用来显示上传进度的

 2. Javascript:

        function toggleBarVisibility() {
            var e = document.getElementById("bar_blank");
            e.style.display = (e.style.display == "block") ? "none" : "block";
        }
        
        function createRequestObject() {
            var http;
            if (navigator.appName == "Microsoft Internet Explorer") {
            http = new ActiveXObject("Microsoft.XMLHTTP");
            }
            else {
            http = new XMLHttpRequest();
            }
            return http;
        }
        
        function sendRequest() {
            var http = createRequestObject();
            http.open("GET", "progress.php");
            http.onreadystatechange = function () { handleResponse(http); };
            http.send(null);
        }
        
        function handleResponse(http) {
            var response;
            if (http.readyState == 4) {
            response = http.responseText;
            document.getElementById("bar_color").style.width = response + "%";
            document.getElementById("status").innerHTML = response + "%";
            
            if (response < 100) {
            setTimeout("sendRequest()", 1000);
            }
            else {
            toggleBarVisibility();
            document.getElementById("status").innerHTML = "Done.";
            }
            }
        }
        
        function startUpload() {
            toggleBarVisibility();
            setTimeout("sendRequest()", 1000);
        }
        
        (function () {
        document.getElementById("myForm").onsubmit = startUpload;
        })();
        
     以上Javascript主要是做了发送周期性的发送数据到progress.php,这个php返回上传进度然后javascript 更新div样式来反应上传的进度，可以用Jquery来做，理解了原理怎么样都可以

 3. Progress.php:

        session_start();
        $key = ini_get("session.upload_progress.prefix") . "myForm";
        if (!empty($_SESSION[$key])) 
        {    
            $current = $_SESSION[$key]["bytes_processed"];
            $total = $_SESSION[$key]["content_length"];
            echo $current < $total ? ceil($current / $total * 100) : 100;
        }
        else 
        {
            echo 100;
        }
        
     这个文件就是简单的计算上传比例然后返回给客户端。

####脚本跑过没有问题，原文来源：[http://www.sitepoint.com/tracking-upload-progress-with-php-and-javascript/][1]
  

   

 
 


  [1]: http://www.sitepoint.com/tracking-upload-progress-with-php-and-javascript/