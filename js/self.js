document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  if (!token || !userInfo.id) {
    alert("请先登录");
    location.href = "login.html";
    return;
  }

  // 获取表单DOM元素
  const usernameInput = document.querySelector(".username");
  const ageInput = document.querySelector(".age");
  const genderSelect = document.querySelector(".gender");
  const nicknameInput = document.querySelector(".nickname");
  const formInfo = document.querySelector("#formInfo");

  // 获取用户信息并填充表单
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
    .catch(() => {
      alert("获取用户信息失败");
      location.href = "login.html";
    });

  // 提交修改个人信息
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
            // 更新 localStorage 中的昵称等信息后，再跳转到首页
            userInfo.nickname = data.nickname;
            userInfo.age = data.age;
            userInfo.gender = data.gender;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            alert("修改个人信息成功");
            location.href = "index.html";
          } else {
            alert(res.data.message);
          }
        })
        .catch(() => {
          alert("修改失败");
        });
    });
  }

  // 返回首页按钮
  const backHomeBtn = document.querySelector("#backHomeBtn");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      location.href = "index.html";
    });
  }

  // 修改密码按钮，跳转到 rpwd.html
  const changePwdBtn = document.querySelector("#changePwdBtn");
  if (changePwdBtn) {
    changePwdBtn.addEventListener("click", () => {
      location.href = "rpwd.html";
    });
  }
});
