document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  if (!token || !userInfo.id) {
    alert("请先登录");
    location.href = "login.html";
    return;
  }

  // 获取DOM
  const usernameInput = document.querySelector(".username");
  const ageInput = document.querySelector(".age");
  const genderSelect = document.querySelector(".gender");
  const nicknameInput = document.querySelector(".nickname");
  const formInfo = document.querySelector("#formInfo");

  // 1. 获取用户信息并填充表单
  axios
    .get(`http://localhost:8888/users/info/${userInfo.id}`, {
      headers: { authorization: token },
    })
    .then((res) => {
      if (res.data.code === 1) {
        const info = res.data.info;
        if (usernameInput) usernameInput.value = info.username || "";
        if (ageInput) ageInput.value = info.age || "";
        if (genderSelect) genderSelect.value = info.gender || "";
        if (nicknameInput) nicknameInput.value = info.nickname || "";
      } else {
        alert(res.data.message);
        location.href = "login.html";
      }
    })
    .catch((err) => {
      console.error(err);
      alert("获取用户信息失败");
      location.href = "login.html";
    });

  // 2. 提交修改个人信息
  if (formInfo) {
    formInfo.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        id: userInfo.id,
        age: ageInput.value.trim(),
        gender: genderSelect.value,
        nickname: nicknameInput.value.trim(),
      };

      axios
        .post("http://localhost:8888/users/update", data, {
          headers: { authorization: token },
        })
        .then((res) => {
          if (res.data.code === 1) {
            alert("修改个人信息成功");
            location.href = "index.html";
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("修改失败");
        });
    });
  }

  // 3. “返回首页”按钮
  const backHomeBtn = document.querySelector("#backHomeBtn");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      location.href = "index.html";
    });
  }

  // 4. “修改密码”按钮 —— 跳转到 rpwd.html
  const changePwdBtn = document.querySelector("#changePwdBtn");
  if (changePwdBtn) {
    changePwdBtn.addEventListener("click", () => {
      location.href = "rpwd.html";
    });
  }
});
