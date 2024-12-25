# 仿站电商项目 — 前端用户交互实现

> 本项目为基于 **JavaScript** 与后端提供的接口进行用户交互的电商前端示例，涵盖登录注册、个人中心、修改密码、商品列表、商品详情等典型功能模块。

## 一、项目简介

本项目主要是为了演示前端与后端的数据交互，以及常见的前端开发技能点综合运用。通过此项目，您可以熟悉以下内容：

- **表单处理**（注册、登录、修改信息、修改密码等）
- **localStorage** 存储与读取（实现登录状态管理）
- **Axios** 发起异步请求（实现前后端交互）
- **Swiper** 轮播图插件使用
- **jQuery** 处理列表分页、筛选等操作
- **原生 JavaScript** 和 **DOM** 操作

后端接口由 `server.rar`（或相应文件夹）提供，解压并启动后即可访问 `http://localhost:8888` 进行交互。

------

## 二、项目运行与目录结构

### 1. 本地运行

1. **解压并启动本地服务器**
   - 解压 `server.rar`
   - 双击 `win点我启动.bat`或者使用命令行 `node app.js 8888` 
   - 默认为 `http://localhost:8888` 提供后端接口服务
2. **启动前端页面**
   - 直接在浏览器打开 views/ 目录下的 .html 文件进行访问。如：
     - `index.html` -> 首页
     - `list.html` -> 商品列表
     - `detail.html` -> 商品详情
     - `login.html` -> 登录
     - `register.html` -> 注册
     - `self.html` -> 个人中心
     - `rpwd.html` -> 修改密码
   - 确保你的浏览器支持 ES6 语法，或者用 VSCode 的 Live Server 插件等工具打开，也可保持与后端相同的端口域名跨域访问。

### 2. 目录结构

```
againclass/
├── css/          // 项目中CSS样式文件
│   ├── detail.css
│   ├── index.css
│   ├── list.css
│   ├── login.css
│   ├── register.css
│   ├── rpwd.css
│   ├── self.css
│   └── uni.css   // 通用样式，包括重置、头部样式等
├── img/          // 图片资源
│   ├── img1.jpg
│   ├── img2.jpg
│   ├── img3.jpg
│   ├── img4.jpg
│   ├── img5.jpg
│   └── nothing.jpg
├── js/           // 核心交互JS文件
│   ├── detail.js
│   ├── index.js
│   ├── list.js
│   ├── login.js
│   ├── register.js
│   ├── rpwd.js
│   └── self.js
├── lib/          // 第三方库
│   ├── axios.min.js
│   └── swiper/
│       ├── swiper-bundle.min.css
│       └── swiper-bundle.min.js
└── views/        // 项目各页面HTML文件
    ├── detail.html
    ├── index.html
    ├── list.html
    ├── login.html
    ├── register.html
    ├── rpwd.html
    └── self.html

```

------

## 三、核心功能与实现

### 1. 用户模块

1. **注册 (register.html + register.js)**
   - **页面**：`register.html`
   - **逻辑**：`register.js`
   - **功能**：
     1. 获取表单的 `username`、`password`、`rpassword`、`nickname`。
     2. 进行**非空校验**、**正则校验**（用户名格式、密码格式等）。
     3. 通过 `axios.post('http://localhost:8888/users/register', data)` 调用后端注册接口。
     4. 成功后保存必要信息或直接跳转登录页面；失败则提示错误信息。
2. **登录 (login.html + login.js)**
   - **页面**：`login.html`
   - **逻辑**：`login.js`
   - **功能**：
     1. 登录表单提交，通过正则/非空校验后，调用 `axios.post('http://localhost:8888/users/login')`。
     2. 将返回的 `token` 及 `userInfo` 存储于 `localStorage`。
     3. 登录成功后跳转 `index.html`。
3. **首页 (index.html + index.js)**
   - **页面**：`index.html`
   - **逻辑**：`index.js`
   - **功能**：
     1. **登录状态校验**：若已有 token & userInfo，则显示「欢迎您，xx」，否则显示「请登录」。
     2. **退出登录**：通过 `axios.get('http://localhost:8888/users/logout/:id')` 通知后端退出，并清除本地 token、userInfo。
     3. **轮播图**：使用 `Swiper` 插件实现自动轮播、左右按钮、分页器的交互。
4. **个人中心 (self.html + self.js)**
   - **页面**：`self.html`
   - **逻辑**：`self.js`
   - **功能**：
     1. **登录校验**：若未登录则跳转到登录页。
     2. **信息回显**：访问后端 `GET /users/info/:id` 获取用户信息，显示在表单中。
     3. **修改个人信息**：向 `POST /users/update` 发送最新数据，后端成功更新后给予提示。
5. **修改密码 (rpwd.html + rpwd.js)**
   - **页面**：`rpwd.html`
   - **逻辑**：`rpwd.js`
   - **功能**：
     1. **登录校验**。
     2. 输入原密码、新密码、确认密码，进行非空、正则及两次新密码一致性校验。
     3. 调用 `axios.post('http://localhost:8888/users/rpwd')`。若成功，弹窗后清除 token、userInfo 并跳转到登录页。

### 2. 商品模块

1. **商品列表 (list.html + list.js)**
   - **页面**：`list.html`
   - **逻辑**：`list.js`
   - **功能**：
     1. 进入列表页后，默认发起 `GET /goods/list` 请求，获取商品数据并渲染到 `<ul class="list">` 中。
     2. **分页器**：支持首页、上一页、下一页、末页、输入跳转页、改变 pagesize；每次点击后发起新的请求并渲染最新数据。
     3. **筛选/排序**：切换 “热销/折扣”、“分类”、“折扣5折~9折” 以及价格正序倒序等，都是通过改变 `query` 参数后重新请求并渲染列表。
     4. **点击商品跳转详情**：在 `<li>` 点击事件中，将 `goodId` 存储到 `localStorage`，然后跳转 `detail.html`。
2. **商品详情 (detail.html + detail.js)**
   - **页面**：`detail.html`
   - **逻辑**：`detail.js`
   - **功能**：
     1. 从 `localStorage` 中获取 `goodId`。若不存在，提示并返回列表页。
     2. 通过 `GET /goods/item/:id` 获取商品详情数据，如图片、标题、折扣、是否热销等。
     3. 动态插入 DOM 进行展示；若有折扣或热销，显示相应标签。

------

## 四、关键代码示例

下面给出部分关键代码段示例（完整代码请查看 `js/` 文件夹）：

1. 登录状态校验（index.js / detail.js / self.js等多个页面都会用到）：

   ```
   function checkLoginStatus() {
     const token = localStorage.getItem("token");
     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
     if (token && userInfo.id) {
       // 已登录
       welcomeText.textContent = `欢迎您, ${userInfo.nickname || userInfo.username}`;
       loginLink.style.display = "none";
       logoutBtn.style.display = "inline-block";
       userCenter.style.display = "inline-block";
     } else {
       // 未登录
       welcomeText.textContent = "您好!";
       loginLink.style.display = "inline-block";
       logoutBtn.style.display = "none";
       userCenter.style.display = "none";
     }
   }
   ```

2. 商品列表渲染（list.js）：

   ```
   function updateList(list) {
     const listElement = $("ul.list");
     listElement.empty();
     if (list.length > 0) {
       list.forEach(item => {
         const li = $(`
           <li data-id="${item.goods_id}">
             <div class="show">
               <img src="${item.img_big_logo}" alt="${item.title}">
               ${item.is_hot ? `<span class="hot">热销</span>` : ""}
               ${item.is_sale ? `<span>折扣</span>` : ""}
             </div>
             <div class="info">
               <p class="title">${item.title}</p>
               <p class="price">
                 <span class="curr">¥ ${item.current_price}</span>
                 <span class="old">¥ ${item.price}</span>
               </p>
             </div>
           </li>
         `);
         li.click(function () {
           localStorage.setItem("goodId", $(this).data("id"));
           location.href = "detail.html";
         });
         listElement.append(li);
       });
     } else {
       listElement.append($(`<img src="../img/nothing.jpg" alt="暂无商品">`));
     }
   }
   ```

3. 退出登录（index.js或其他页面）：

   ```
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
   ```

更多细节可查看各 `js` 文件的源码。

------

## 五、项目总结

1. **前端交互**：
   - 使用 **Axios** 统一进行异步请求，编码简洁、易维护。
   - 表单输入检查在前端完成，能有效减少后端压力与无意义请求。
   - 通过 **localStorage** 管理登录态，简化客户端状态存储。
2. **UI 及用户体验**：
   - 采用 **Swiper** 做轮播图，提供自动轮播、手动翻页、分页器等常用效果。
   - 分类、筛选、分页等交互，实现了常见的电商列表交互场景。
3. **可扩展性**：
   - 若要集成更多功能，如购物车、订单系统等，可遵循相同的接口规范和前端结构进行拓展。
   - 样式层面上可以在 `uni.css` 中进一步抽离公共组件和 Mixins（如使用 SCSS 等）。

------

**感谢您阅读此 README！**
如有疑问，可在 issue 中提出或通过其他联系方式与我沟通。祝使用愉快！
