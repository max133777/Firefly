/**
 * 阅读数：卡片只读展示，文章页自增一次（同一浏览器每会话只 +1）。
 * 用法：<script src="/assets/js/view-count.js" defer data-api="https://..."></script>
 * 依赖结构：卡片/文章容器带 data-view-slug="<slug>"，其中的数字占位带 data-view-count。
 * 放在外部文件里而不是内联，是因为内联脚本在 Astro 里会被提前执行（此时卡片还没渲染），
 * 而且会被主题的 minify-inline-scripts 处理；defer 的外部脚本可保证 DOM 就绪。
 */
(function () {
  var self = document.currentScript;
  var API = (self && self.getAttribute("data-api")) || "";
  if (!API) return;

  function getCount(slug) {
    return fetch(API + "/api/views/" + encodeURIComponent(slug))
      .then(function (r) { return r.json(); })
      .then(function (d) { return d && d.ok ? d.views : null; })
      .catch(function () { return null; });
  }

  function fill(slug, n) {
    if (n === null || n === undefined) return;
    var nodes = document.querySelectorAll("[data-view-count]");
    for (var i = 0; i < nodes.length; i++) {
      var owner = nodes[i].closest("[data-view-slug]");
      var own = owner ? owner.getAttribute("data-view-slug") : null;
      // 卡片：按自己的 slug 匹配；文章页没有 slug 祖先的占位由文章 slug 填
      if (own === slug || (own === null && nodes[i].getAttribute("data-view-article") === "1")) {
        nodes[i].textContent = n;
      }
    }
  }

  function boot() {
    var els = document.querySelectorAll("[data-view-slug]");
    var slugs = [];
    for (var i = 0; i < els.length; i++) {
      var s = els[i].getAttribute("data-view-slug");
      if (s && slugs.indexOf(s) < 0) slugs.push(s);
    }
    slugs.slice(0, 50).forEach(function (s) {
      getCount(s).then(function (n) { fill(s, n); });
    });

    var m = location.pathname.match(/^\/posts\/([^/]+)\//);
    if (!m) return;
    var slug = decodeURIComponent(m[1]);
    var key = "cyea-viewed:" + slug;
    if (sessionStorage.getItem(key)) {
      getCount(slug).then(function (n) { fill(slug, n); });
    } else {
      sessionStorage.setItem(key, "1");
      fetch(API + "/api/views/" + encodeURIComponent(slug), { method: "POST" })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (d && d.ok) fill(slug, d.views); })
        .catch(function () {});
    }
  }

  boot();
  document.addEventListener("swup:contentReplaced", boot);
  document.addEventListener("firefly:page:loaded", boot);
})();
