let template = `
<% _.forEach(posts, function(post) { %>
<div class="row search-contents">
	<div class="col s12">
	  <div class="card">
	    <div class="card-image">
	        <img class="responsive-img" src="<%= post.imgSrc %>">
	      </div>
	    <div class="card-content black-text">
	      <span class="card-title"><a href="<%= post.url %>"><%= post.title %></a></span>
	      <div class="post-tags">
	        <span><i class="fa fa-superpowers" aria-hidden="true"></i></span>
	        <span>tags: <%= post.category %></span>
	        <span>post data: <%= post.date %></span>
	        <span>comments:</span>
	      </div>
	      <p><%= _.truncate(post.content, {length: 200}) %></p>
	    </div>
	    <div class="card-action">
    		<a href="#" class="black-text">Continue Reading</a>
    		<a href="#" class="share-action"><i class="material-icons md-dark">share</i></a>
    		<ul class="rrssb-buttons round-format fixed-size rrssb-2">
			  <li class="rrssb-wechat small">
			    <a class="popup" data-url="https://www.npmjs.com/package/responsive-social-buttons" data-title="扫描二维码分享至微信" data-confirm-text="取消">
			      <span class="rrssb-icon">
			          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="36.969" height="29.031" viewBox="0 0 36.969 29.031"><defs><style>.cls-1{fill:#000;fill-rule:evenodd}</style></defs><path d="M32.399 25.866l.985 3.152-3.591-1.894c-1.31.316-2.625.631-3.928.631-6.229 0-11.134-4.099-11.134-9.146 0-5.041 4.905-9.15 11.134-9.15 5.882 0 11.119 4.109 11.119 9.15 0 2.842-1.958 5.359-4.585 7.257zM22.256 14.509c-.652 0-1.309.633-1.309 1.26 0 .638.657 1.262 1.309 1.262.99 0 1.637-.624 1.637-1.262 0-.627-.647-1.26-1.637-1.26zm7.2 0c-.647 0-1.301.633-1.301 1.26 0 .638.654 1.262 1.301 1.262.981 0 1.638-.624 1.638-1.262 0-.627-.657-1.26-1.638-1.26zM13.908 18.76c0 .915.148 1.798.404 2.641-.404.031-.811.05-1.222.05-1.634 0-2.948-.321-4.586-.632l-4.575 2.209 1.309-3.791C1.96 17.031.001 14.187.001 10.726.001 4.728 5.894.004 13.09.004c6.437 0 12.075 3.774 13.208 8.852a12.005 12.005 0 0 0-1.261-.073c-6.219 0-11.129 4.469-11.129 9.977zM8.837 5.365c-.981 0-1.971.624-1.971 1.573 0 .945.99 1.578 1.971 1.578.982 0 1.634-.633 1.634-1.578 0-.949-.652-1.573-1.634-1.573zm9.161 0c-.981 0-1.964.624-1.964 1.573 0 .945.983 1.578 1.964 1.578.986 0 1.638-.633 1.638-1.578 0-.949-.652-1.573-1.638-1.573z" class="cls-1"/>
			      </span>
			      <span class="rrssb-text">Wechat</span>
			    </a>
			  </li>
			  <li class="rrssb-weibo small">
			    <a class="popup" href="http://service.weibo.com/share/share.php?text=测试&title=xxxbb&url=https://www.npmjs.com/package/responsive-social-buttons">
			      <span class="rrssb-icon">
			        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="37" height="30" viewBox="0 0 37 30"><defs><style>.cls-1{fill:#000;fill-rule:evenodd}</style></defs><path d="M36.539 12.806v.006a1.418 1.418 0 0 1-2.698-.875h-.001a6.974 6.974 0 0 0-1.456-6.82 6.965 6.965 0 0 0-6.631-2.147 1.418 1.418 0 0 1-.592-2.775h.001a9.791 9.791 0 0 1 9.327 3.022 9.803 9.803 0 0 1 2.05 9.589zm-9.818-5.3v-.001a1.22 1.22 0 1 1-.509-2.386 4.772 4.772 0 0 1 5.54 6.141 1.222 1.222 0 0 1-1.536.787 1.222 1.222 0 0 1-.785-1.538h-.002a2.332 2.332 0 0 0-2.708-3.003zm.489 2.284c.641.916.579 2.2-.012 3.688-.273.685.085.791.606.948 2.123.658 4.487 2.252 4.487 5.059 0 4.647-6.697 10.5-16.765 10.5-7.679 0-15.529-3.724-15.529-9.85 0-3.202 2.028-6.905 5.519-10.399 4.663-4.664 10.1-6.789 12.145-4.742.902.902.989 2.464.409 4.329-.302.939.881.419.881.421 3.769-1.579 7.057-1.672 8.259.046zm-1.287 9.611c-.397-4.024-5.687-6.796-11.816-6.19-6.127.607-10.774 4.361-10.376 8.386.398 4.026 5.688 6.797 11.816 6.192 6.129-.606 10.773-4.361 10.376-8.388zM11.584 26.06c-2.946-.952-4.193-3.862-2.903-6.484 1.267-2.571 4.562-4.025 7.478-3.266 3.018.78 4.558 3.629 3.325 6.395-1.251 2.831-4.848 4.34-7.9 3.355zm1.664-5.511c-.949-.398-2.175.011-2.761.93-.593.923-.314 2.022.628 2.451.956.437 2.225.022 2.818-.924.582-.956.275-2.048-.685-2.457zm2.339-.97c-.364-.145-.819.03-1.033.389-.207.36-.093.77.272.92.371.153.845-.023 1.059-.39.205-.369.072-.784-.298-.919z" class="cls-1"/>
			      </span>
			      <span class="rrssb-text">Weibo</span>
			    </a>
			  </li>
			  <li class="rrssb-douban small">
			      <a class="popup" href="http://shuo.douban.com/!service/share?href=https://github.com/akulubala/responsive-social-buttons&name=响应式分享按钮bb&text=响应式分享按钮&starid=0&aid=0&style=11">
			        <span class="rrssb-icon">
			          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="32" height="28" viewBox="0 0 32 28"><defs><style>.cls-1{fill:#000;fill-rule:evenodd}</style></defs><path d="M9.731 18.328c1.303 1.777 2.478 4.013 3.507 6.521h6.323c1.23-1.935 2.18-4.173 3.108-6.521l3.568 1.199c-.933 1.98-2.068 3.817-3.135 5.322h8.853L32 28H0v-3l9.697-.151a41.574 41.574 0 0 0-3.248-5.322l3.282-1.199zM1 0h30v3H1V0zm3.132 5.882L28 6v12H4l.132-12.118zM25 15l.126-6.162L7 9v6h18z" class="cls-1"/>
			        </span>
			        <span class="rrssb-text">Douban</span>
			      </a>
			  </li>
			  <li class="rrssb-facebook small">
			      <!--  Replace with your URL. For best results, make sure you page has the proper FB Open Graph tags in header:
			            https://developers.facebook.com/docs/opengraph/howtos/maximizing-distribution-media-content/ -->
			      <a href="https://www.facebook.com/sharer/sharer.php?u=https://github.com/akulubala/responsive-social-buttons" class="popup">
			        <span class="rrssb-icon">
			          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path d="M26.4 0H2.6C1.714 0 0 1.715 0 2.6v23.8c0 .884 1.715 2.6 2.6 2.6h12.393V17.988h-3.996v-3.98h3.997v-3.062c0-3.746 2.835-5.97 6.177-5.97 1.6 0 2.444.173 2.845.226v3.792H21.18c-1.817 0-2.156.9-2.156 2.168v2.847h5.045l-.66 3.978h-4.386V29H26.4c.884 0 2.6-1.716 2.6-2.6V2.6c0-.885-1.716-2.6-2.6-2.6z"/>
			        </span>
			        <span class="rrssb-text">facebook</span>
			      </a>
			  </li>
			  <li class="rrssb-twitter small">
			      <!-- Replace href with your Meta and URL information  -->
			      <a href="https://twitter.com/intent/tweet?text=https://github.com/akulubala/responsive-social-buttons"
			      class="popup">
			        <span class="rrssb-icon">
			          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M24.253 8.756C24.69 17.08 18.297 24.182 9.97 24.62a15.093 15.093 0 0 1-8.86-2.32c2.702.18 5.375-.648 7.507-2.32a5.417 5.417 0 0 1-4.49-3.64c.802.13 1.62.077 2.4-.154a5.416 5.416 0 0 1-4.412-5.11 5.43 5.43 0 0 0 2.168.387A5.416 5.416 0 0 1 2.89 4.498a15.09 15.09 0 0 0 10.913 5.573 5.185 5.185 0 0 1 3.434-6.48 5.18 5.18 0 0 1 5.546 1.682 9.076 9.076 0 0 0 3.33-1.317 5.038 5.038 0 0 1-2.4 2.942 9.068 9.068 0 0 0 3.02-.85 5.05 5.05 0 0 1-2.48 2.71z"/>
			        </span>
			        <span class="rrssb-text">twitter</span>
			      </a>
			  </li>
		       <li class="rrssb-googleplus small">
		        <!-- Replace href with your meta and URL information.  -->
		        <a href="https://plus.google.com/share?url=https://github.com/akulubala/responsive-social-buttons" class="popup">
		          <span class="rrssb-icon">
		            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 8.29h-1.95v2.6h-2.6v1.82h2.6v2.6H21v-2.6h2.6v-1.885H21V8.29zM7.614 10.306v2.925h3.9c-.26 1.69-1.755 2.925-3.9 2.925-2.34 0-4.29-2.016-4.29-4.354s1.885-4.353 4.29-4.353c1.104 0 2.014.326 2.794 1.105l2.08-2.08c-1.3-1.17-2.924-1.883-4.874-1.883C3.65 4.586.4 7.835.4 11.8s3.25 7.212 7.214 7.212c4.224 0 6.953-2.988 6.953-7.082 0-.52-.065-1.104-.13-1.624H7.614z"/>            </span>
		          <span class="rrssb-text">google+</span>
		        </a>
		      </li>
			</ul>
	    </div>
	    <div class="divider-dash"></div>
	  </div>
	</div>
</div>
<% }); %>`;

export default template;