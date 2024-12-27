document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.querySelector("#registerBtn");
  if (!registerBtn) return;

  registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const rpassword = document.getElementById("rpassword").value.trim();
    const nickname = document.getElementById("nickname").value.trim();

    if (!username || !password || !rpassword || !nickname) {
      alert("所有字段都必须填写");
      return;
    }
    if (password !== rpassword) {
      alert("两次密码输入不一致");
      return;
    }
    if (!/^[a-z0-9]\w{3,11}$/.test(username)) {
      alert("用户名格式不正确(需字母或数字开头, 长度4~12, 可包含下划线)");
      return;
    }
    if (!/\w{6,12}/.test(password)) {
      alert("密码格式不正确(需6~12位)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8888/users/register", {
        username,
        password,
        rpassword,
        nickname
      });
      if (res.data.code === 1) {
        alert("注册成功");
        location.href = "login.html";
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("注册失败");
    }
  });
});
