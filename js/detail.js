document.addEventListener("DOMContentLoaded", () => {
  const goodId = localStorage.getItem("goodId");
  if (!goodId) {
    alert("商品ID不存在");
    location.href = "list.html";
    return;
  }

  // 获取商品详情
  axios
    .get(`http://localhost:8888/goods/item/${goodId}`)
    .then((res) => {
      const data = res.data;
      if (data.code === 1) {
        renderDetail(data.info);
      } else {
        alert(data.message);
        location.href = "list.html";
      }
    })
    .catch(() => {
      alert("获取商品详情失败");
      location.href = "list.html";
    });

  // 渲染商品信息
  function renderDetail(info) {
    const goodsDetail = document.querySelector("#goodsDetail");
    if (!goodsDetail) return;
    goodsDetail.innerHTML = `
      <div class="goods-preview">
          <img src="${info.img_big_logo}" alt="${info.title}" class="goods-image">
      </div>
      <div class="goods-info">
          <h1 class="goods-title">${info.title}</h1>
          <div class="goods-price">
              <div class="price-box">
                  <span class="price-label">价格：</span>
                  <span class="current-price">￥${info.current_price}</span>
                  ${
                    info.is_sale
                      ? `
                        <span class="original-price">￥${info.price}</span>
                        <span class="discount">${info.sale_type}</span>
                      `
                      : ""
                  }
              </div>
          </div>
          <div class="goods-meta">
              <div class="meta-item">
                  <span class="meta-label">商品分类：</span>
                  <span class="meta-value">${info.category}</span>
              </div>
              <div class="meta-item">
                  <span class="meta-label">库存数量：</span>
                  <span class="meta-value">${info.goods_number}</span>
              </div>
              ${
                info.is_hot
                  ? '<div class="hot-tag">热销商品</div>'
                  : ""
              }
          </div>
      </div>
      <div class="goods-detail-content">
          <h2>商品详情</h2>
          <div class="detail-content">
              ${info.goods_introduce}
          </div>
      </div>
    `;
    document.title = `${info.title} - 仿站电商平台`;
  }

  checkLoginStatus();

  // 检查登录状态
  function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const welcomeText = document.querySelector("#welcome-text");
    const loginLink = document.querySelector("#login-link");
    const userCenter = document.querySelector("#user-center");
    const logoutBtn = document.querySelector("#logout-btn");

    if (token && userInfo.id) {
      welcomeText.textContent = `欢迎您, ${userInfo.nickname || userInfo.username}`;
      logoutBtn.style.display = "inline-block";
      userCenter.style.display = "inline-block";
      loginLink.style.display = "none";
    } else {
      welcomeText.textContent = "您好!";
      logoutBtn.style.display = "none";
      userCenter.style.display = "none";
      loginLink.style.display = "inline-block";
    }
  }

  // 退出登录
  const logoutButton = document.querySelector("#logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  function handleLogout() {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    axios
      .get(`http://localhost:8888/users/logout/${userInfo.id}`, {
        headers: {
          authorization: token
        }
      })
      .then((res) => {
        if (res.data.code === 1) {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          alert("退出成功");
          location.href = "index.html";
        } else {
          alert(res.data.message);
        }
      })
      .catch(() => {
        alert("退出失败");
      });
  }
});
