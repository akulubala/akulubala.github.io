---
title : 如何设置SSH的公钥授权
layout : post
category : linux
---   
其实这个问题已经用过好几次了，但是基本上都是用的 时候再去查的，没有一个整体的概念，今天看到篇文章就翻译下来，顺带好好整理下思路：

熟悉并能使用SSH的命令行操作对于web开发者来说是件很好的事情，这篇文章就是理解使用SSH命令行的一个进阶。讲解的内容有：

<table class='table table-bordered table-hover'>
    <tr><td>1</td><td>理解公钥和私钥密码学术语</td></tr>
    <tr><td>2</td><td>隐式的SSH公钥认证和普通密码认证</td></tr>
    <tr><td>3</td><td>创建SSH公钥私钥</td></tr>
    <tr><td>4</td><td>设置好SSH公钥私钥</td></tr>
    <tr><td>5</td><td>不同的方式复制你的公钥到远程服务器</td></tr>
    <tr><td>6</td><td>创建SSH快捷方式</td></tr>
</table>

####什么是密码学的公钥？

>注意：这是个相当简单容易理解的，但是你还是需要明白它具体的细节  

SSH是Secure Shell 的缩写，在Linux系统里面最常用的是OpenSSH,幸运的是，只要你不是从逻辑安装linux，否则OpenSSH通常都是预先安装在你的电脑上的，如果没有的话简单的Google一下安装上就可以了。

Open SSH是个非常好的东西，因为它允许公钥与私钥配对。公、私钥配对可以应用在各种各样的事务上面，通常的例子有：普通加密，服务器认证，已经Git 认证。

公、私钥对从名称来看就知道分公钥和私钥，私钥是不被公开共享的，只有电脑主机拥有。公钥是可以放置在任何一台电脑上，拿来与公钥匹配的。这里有个例子：

![enter image description here][1]


通过查看上面的例子，可以看到你自己的公钥出现在了DigitalOcean，Linode和GitHub上面，这意味着你的笔记本电脑有和这些电脑通讯，它的私钥将要与与之通讯的这些电脑的私钥做匹配验证，只有验证通过后你的笔记本电脑才可以与他们通讯。

这种认证方式只能是但方向的，意味着你的电脑可以访问 Digital Ocean, Linode, 和Github，但是他们却不可以通过匹配公钥访问你的电脑。

最后你应该也看到了Linode和Github也有做公私钥匹配，Linode也可以访问Github。

这是一个简短的介绍，我很建议有兴趣的同学去阅读以下这些比我这个非专业人士解释的更好的资料（PS.原博主比较谦虚和厚道）：

 - Wikipedia: <a href="http://en.wikipedia.org/wiki/Public-key_cryptography">Public-key cryptography</a> 
 - Ubuntu  Docs: <a href="https://help.ubuntu.com/community/SSH/OpenSSH/Keys">Ubuntu  Docs</a>

####公钥认证VS普通密码认证

从安全层面来讲，这两个有被激烈讨论过。他们两都是保证数据安全的策略，但是哪个更好常常是争论的焦点，最终答案得看你对用户信任度有多高。

很多人认为，使用密码认证的时候，用户通常记不住或者不能够被信任，他们认为公、私钥认证的方式比密码认证更安全。但是有些系统管理员却希望禁用公、私钥认证，因为如果用户丢失电脑，那么他们就丢掉了所有在其他电脑上的公钥，除非重新设置公钥。(下面原文有一段比喻。太长了做个简短概况：SSH的公钥认证就类似于你自家的门安装的使用钥匙开门的锁，密码认证就相当于安装了密码锁，使用钥匙开门的锁一旦丢掉了钥匙，很有可能门就不安全了，这时候你得换锁，然后从新给你家人新的钥匙。而密码锁你可以定期的重置密码，做这个比喻的人喜欢密码锁)

####创建SSH 公钥、私钥

#####首先检查是否有设置过公、私钥

    ls -al ~/.ssh

如果有看见id_rsa 和 id_rsa.pub，说明你的电脑已经有过公、私钥了，如果没有则执行：


    ssh-keygen -t rsa -C "your-email-here"
    
具体细节见GitHub：https://help.github.com/articles/generating-ssh-keys

生成好公钥私钥后在~/.ssh目录下面就有了id_rsa 和 id_rsa.pub文件，第一个文件就是私钥,
你永远都没有必要操作它。第二个就是你的公钥了，你可以将它放到其他任何一台电脑上

####确保远程服务器准备好接受公钥

现在我们已经准备好了自己电脑的公钥和私钥，我们需要把公钥复制到远程服务器上用以做匹配，但是首先我们得确保远程服务器上所有东西都准备好了。同样在远程服务器上执行命令：  
    
    ls -al ~/.ssh
    
如果远程服务器没有.ssh文件夹，你可以按照上面讲的步骤来创建它。当创建完毕后你需要创建一个authorized_keys 文件。

    cd ~/.ssh
    touch authorized_keys

接下来确保文件权限设置正确  

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    
OK。完成之后远程服务器就可以接受你的公钥public key了。在authorized_keys文件中每一行就是一个public key

####复制公钥到远程服务器

通常来说复制公钥到远程服务器并没有看起来那么简单，这里有些例子讲如何操作它：

#####老式的复制方式：

如果你有远程服务器权限，你可以直接打开authorized_keys文件然后粘贴你的公钥进去，或者如果你using iTerm on a Mac，你可以通过VIM，vi或者Nano Cli editors 复制粘贴。

如果你在Mac电脑上你可以使用以下命令来复制你的公钥到剪切板：

    pbcopy < ~/.ssh/id_rsa.pub

#####精妙的命令行操作方式：

如果你想很快的完成这项操作，仅仅使用UNIX的CAT 命令就可以了。在MAC上可以直接操作，但是如果是在window上可以使用<a href="http://scotch.io/bar-talk/get-a-functional-and-sleek-console-in-windows">这里的方式</a>(又是一篇博文讲如何操作shell 在window上的),只需要更改user@host就可以了：

    cat ~/.ssh/id_rsa.pub | ssh user@host 'cat >> .ssh/authorized_keys'

你应该会被提示输入访问远程服务器的密码，输入后就完成了，相当简单灵活的方式完成了。现在远程服务器你打开authorized_keys，你会发现你的公钥在这个文件里面了。然后当你通过ssh链接到远程服务器的时候就不需要再输入密码了。你已经成功的设置了SSH公钥认证。

####创建SSH快捷方式

到这里，我们已经对公钥私钥认证有了一个基本的理解，我们通过SSH登录远程电脑不需要密码了，最后一件事件我想分享给你的是如何设置SSH快捷方式

如果你管理着许多在不同服务器上的网站，将会很困难记住所有这些用户名、密码和、IP地址 和主机名。然后呢，这里有种方式可以创建快捷方式对你所有的网站。例如你可以创建一个快捷方式：

    ssh scotch

设置这个是相当简单的，在你本地电脑上创建一个config文件到你的~/.ssh文件夹。然后配置如下config：

    Host scotch
    	HostName scotch.io
    	User nick
    
    Host example2
    	HostName example.com
    	User root
    
    Host myclient
    	HostName 64.233.160.0
    	User user2ab1
    	
    
    Host myotherclient
    	HostName 64.233.160.0
    	User userxyz123
    	Port 56000
    
    Host amazon
    	HostName ec2.amazon.com
    	User ec2-user123
    	Port 12345
    	IdentityFile /path/to/special/privatekey/amazon.pem

 现在如果我们输入以下这些命令就可以登录到对应的服务器了：
 
    ssh scotch
    ssh example2
    ssh myclient
    ssh myotherclient
    ssh amazon
    
####总结：

以上就是全部拉！我相信你们很多人已经有过这些经验了。但是如果是第一次做的话上面的内容还是很有用处的。不是所有人都会对服务器有很深的掌握。这篇文章的目的仅仅是带你入门，所有我鼓励你们去学习更多，不要仅仅局限于这篇文章，并且要乐于学习哦！


原文链接：http://scotch.io/tutorials/how-to-setup-ssh-public-key-authentication

    


    





  [1]: http://akulubala.github.io/public/images/2014/ssh_public_key_authentication.jpg