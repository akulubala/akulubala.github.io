---
title: 十位用户唯一ID生成策略
layout: post
category: php
---
新浪微博和twitter 等系统都有一窜数字ID来标示一个唯一的用户,这篇文章就是记录如何实现这种唯一数字ID
    
>原理：使用MYSQL 自增ID 拼接任意字符..然后使用进制转换打乱规则
>一般来说实现唯一性可以使用uniqid 或者time之类的方式生成，
>但是考虑到多台系统，也就是分布式系统。这种方式就不准确了。


实现：

新建一个数据库：
{% highlight php %}
    CREATE TABLE `user_number_id` (
      `id` bigint(20) unsigned NOT NULL auto_increment,
      `stub` char(1) NOT NULL default '',
      PRIMARY KEY  (`id`),
      UNIQUE KEY `stub` (`stub`)
    ) ENGINE=MyISAM
{% endhighlight %}    
使用replace into 来取得生成的ID

{% highlight php %}
    REPLACE INTO Tickets64 (stub) VALUES ('a');
    SELECT LAST_INSERT_ID() as number_id;
{% endhighlight %}

取得number_id后生成十位数字ID
{% highlight php %}

    function auID($autoID)
    {
        $autoID = $autoID;
        $autoCharacter = array("1","2","3","4","5","6","7","8","9","A","B","C","D","E");
        $len = 7-((int)log10($autoID) + 1);
        $i=1;
        $numberID = mt_rand(1, 2).mt_rand(1, 4);
        for($i;$i<=$len-1;$i++)
        {
            $numberID .= $autoCharacter[mt_rand(1, 13)];
        }
    
        return base_convert($numberID."E".$autoID, 16, 10);--->这里因为autoid永远不可能为E所以使用E来分割保证不会重复
    }
{% endhighlight %}
base_convert 转换16进制到10进制，只要16进制不同那么10进制就一定不同，因为10位十进制最大可取范围：9999999999转换成16进制是2540BE3FF所以前两位可取值是固定的mt_rand(1, 2).mt_rand(1, 4)

以下是测试用例表明没有重复(内存问题只测到55万)：

{% highlight php %}

        static $array=array();
        for($j=1;$j<=550000;$j++)
        {
            $array[] = auID($j);
        }
        
        
        print_r(count(array_unique($array)));
        
        function array_repeat($arr) 
        { 
           if(!is_array($arr)) return $arr; 
              
           $arr1 = array_unique($arr); 
              
           $arr3 = array_diff_key($arr,$arr1);  
           
           return array_unique($arr3); 
        }
        
        print_r(array_repeat($array));
{% endhighlight %}

考虑到可能会有主从需求,id生成应该去取同一个数据表的数据，或者设置好自增id，如主服务器1357，从服务器2468

参考：[http://code.flickr.net/2010/02/08/ticket-servers-distributed-unique-primary-keys-on-the-cheap/][1]


  [1]: http://code.flickr.net/2010/02/08/ticket-servers-distributed-unique-primary-keys-on-the-cheap/