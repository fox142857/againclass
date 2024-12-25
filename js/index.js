document.addEventListener("DOMContentLoaded", () => {
  // 1. 检查登录状态
  checkLoginStatus();

  // 2. 初始化轮播图
  new Swiper(".swiper", {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    speed: 1000,
    autoHeight: true,
    touchRatio: 1,
    grabCursor: true,
    keyboard: {
      enabled: true
    }
  });

  // 点击退出登录
  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const welcomeText = document.querySelector("#welcome-text");
    const loginLink = document.querySelector("#login-link");
    const userCenter = document.querySelector("#user-center");
    const logoutButton = document.querySelector("#logout-btn");

    if (token && userInfo.id) {
      welcomeText.textContent = `欢迎您, ${userInfo.nickname || userInfo.username}`;
      logoutButton.style.display = "inline-block";
      userCenter.style.display = "inline-block";
      loginLink.style.display = "none";
    } else {
      welcomeText.textContent = "您好!";
      logoutButton.style.display = "none";
      userCenter.style.display = "none";
      loginLink.style.display = "inline-block";
    }
  }

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await axios.get(`http://localhost:8888/users/logout/${userInfo.id}`, {
        headers: {
          authorization: token
        }
      });
      if (res.data.code === 1) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        alert("退出成功");
        location.reload();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("退出失败");
    }
  }
});
