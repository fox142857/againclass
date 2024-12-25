document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("用户名和密码不能为空");
      return;
    }

    // 简单正则校验
    if (!/^[a-z0-9]\w{3,11}$/.test(username)) {
      alert('用户名格式不正确(需字母或数字开头, 长度4~12, 可包含下划线)');
      return;
    }
    if (!/\w{6,12}/.test(password)) {
      alert('密码格式不正确(需6~12位)');
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8888/users/login",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.data.code === 1) {
        // 登录成功
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        alert("登录成功");
        location.href = "index.html"; 
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("登录失败");
    }
  });
});
