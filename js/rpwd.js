document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  if (!token || !userInfo.id) {
    alert("请先登录");
    location.href = "login.html";
    return;
  }

  const btn = document.querySelector("#changePwdBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const oldPassword = document.querySelector("#oldPassword").value.trim();
    const newPassword = document.querySelector("#newPassword").value.trim();
    const rNewPassword = document.querySelector("#rNewPassword").value.trim();

    if (!oldPassword || !newPassword || !rNewPassword) {
      alert("请填写完整信息");
      return;
    }
    if (newPassword !== rNewPassword) {
      alert("两次密码不一致");
      return;
    }
    if (!/\w{6,12}/.test(newPassword)) {
      alert("新密码格式不正确(需6~12位)");
      return;
    }

    const data = {
      id: userInfo.id,
      oldPassword,
      newPassword,
      rNewPassword,
    };

    axios
      .post("http://localhost:8888/users/rpwd", data, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        if (res.data.code === 1) {
          alert("修改成功，请重新登录");
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          location.href = "login.html";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("修改失败");
      });
  });
});
