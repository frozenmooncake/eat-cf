<script setup>
import GlobalHeader from '../../components/GlobalHeader.vue';
</script>

<template>
  <GlobalHeader />
  <main class="page page-add">
    <header class="page-heading">
      <span class="page-kicker">添加到桌面</span>
      <h1>手机网页创建桌面书签指南</h1>
      <p>两步把华水美食盲盒-江淮放到手机桌面，随时抽取。</p>
    </header>

    <section class="card guide-section">
      <h2>iOS</h2>
      <p>iPhone 想要创建桌面书签，很简单，只需要 2 步。</p>
      <ol>
        <li>用 Safari 打开你要创建桌面书签的网页</li>
        <li>点击网页底部的「分享按钮」，再点击「添加到主屏幕」就行了</li>
      </ol>
      <img src="https://picx.zhimg.com/v2-e313c05d01dd1043e94d43906a23308f_1440w.jpg" alt="iOS 手机操作演示" loading="lazy" />
    </section>

    <section class="card guide-section">
      <h2>Android</h2>
      <p>Android 机型太多，浏览器也繁杂，不过一般手机自带的浏览器都支持把网页放到桌面。</p>

      <h3>手机自带浏览器</h3>

      <h4>小米</h4>
      <p>一共 4 步</p>
      <img src="https://pic2.zhimg.com/v2-1c44b0b05ee69f3539c0c885982449bf_b.gif" alt="小米手机操作演示" loading="lazy" />
      <small>GIF 图片内容取自网上。</small>

      <h4>华为</h4>
      <p>一共 5 步</p>
      <img src="https://pica.zhimg.com/v2-a678b0443a3f879ea683e0b9c8a05cb0_b.gif" alt="华为手机操作演示" loading="lazy" />
      <small>GIF 图片内容取自网上。</small>

      <h4>魅族</h4>
      <p>一共 5 步</p>
      <img src="https://pic1.zhimg.com/v2-a7d5d98329a9a71c5ecc9d829dd3a21e_b.gif" alt="魅族手机操作演示" loading="lazy" />
      <small>GIF 图片内容取自网上。</small>

      <h3>其他浏览器</h3>
      <p>其他诸如 UC 浏览器、百度浏览器、QQ 浏览器也都是可以通过类似上面的方法把网页放到桌面。</p>
      <p>一般在书签、工具箱、分享页面就能找到把网站发送到桌面的按钮。</p>
    </section>

    <div class="add-actions">
      <a href="../index.html" class="btn return-home">返回首页</a>
    </div>
  </main>
</template>

<style scoped>
.page-heading {
  margin-bottom: var(--spacing-xl);
  text-align: left;
}

.page-heading h1 {
  margin: 0.15rem 0 0.35rem;
  text-align: left;
}

.page-heading p {
  color: var(--color-text-secondary);
  font-size: 0.92rem;
}

.page-kicker {
  color: var(--color-accent-strong);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.guide-section {
  margin-bottom: var(--spacing-lg);
}

.guide-section h2 {
  color: var(--color-primary);
  font-size: 1.3rem;
  border-bottom: 2px solid var(--color-accent-border);
  padding-bottom: var(--spacing-sm);
  margin: 0 0 var(--spacing-md);
}

.guide-section h3 {
  color: var(--color-text);
  font-size: 1.15rem;
  margin-top: var(--spacing-lg);
}

.guide-section h4 {
  color: var(--color-text);
  font-size: 1.05rem;
  margin: var(--spacing-md) 0;
}

.guide-section p {
  margin: var(--spacing-md) 0;
  line-height: 1.8;
}

.guide-section ol {
  padding-left: 1.5rem;
  margin: var(--spacing-md) 0;
}

.guide-section li {
  margin-bottom: var(--spacing-sm);
  line-height: 1.8;
}

.guide-section img {
  max-width: 100%;
  height: auto;
  margin: var(--spacing-lg) 0;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.guide-section small {
  display: block;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin-top: calc(-1 * var(--spacing-md));
}

.add-actions {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.return-home {
  padding: 0.7rem 2rem;
  font-size: 1rem;
}
</style>
