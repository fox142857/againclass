const BASE_URL = "http://localhost:8888/";

$(function () {
  let maxPage = 0;
  const query = {
    current: 1,
    pagesize: 12,
    filter: "",
    saleType: 10,
    sortType: "id",
    sortMethod: "ASC",
    search: "",
    category: "",
  };

  // 分页按钮状态处理
  function handlePage() {
    $(".first, .prev, .next, .last").removeClass("disable");
    if (query.current === 1) {
      $(".first, .prev").addClass("disable");
    }
    if (query.current === maxPage) {
      $(".next, .last").addClass("disable");
    }
  }

  // 获取商品列表
  function getList() {
    handlePage();
    axios.get(`${BASE_URL}goods/list`, { params: query })
      .then(response => {
        if (response.data.code === 1) {
          maxPage = response.data.total;
          $(".total").text(`${query.current} / ${maxPage}`);
          updateList(response.data.list || []);
        } else {
          alert(response.data.message);
        }
      })
      .catch(() => {
        alert("获取商品列表失败");
      });
  }

  // 更新列表
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
          const goodsId = $(this).data("id");
          localStorage.setItem("goodId", goodsId);
          location.href = "detail.html";
        });
        listElement.append(li);
      });
    } else {
      listElement.append($(`<img src="../img/nothing.jpg" alt="暂无商品">`));
    }
  }

  // 初次获取数据
  getList();

  // 获取分类
  axios.get(`${BASE_URL}goods/category`)
    .then(response => {
      if (response.data.code === 1) {
        const categoryList = $("ul.category");
        response.data.list.forEach(item => {
          categoryList.append($("<li>", { text: item }));
        });
        $("ul.category li").click(function () {
          $(this).addClass("active").siblings().removeClass("active");
          query.category = $(this).text() === "全部" ? "" : $(this).text();
          query.current = 1;
          getList();
        });
      }
    })
    .catch(() => {
      alert("获取分类失败");
    });

  // 分页器事件
  $(".prev").click(handlePrevPage);
  $(".first").click(handleFirstPage);
  $(".last").click(handleLastPage);
  $(".next").click(handleNextPage);
  $(".go").click(handleGoPage);
  $(".pagesize").change(handlePageSizeChange);

  // 条件筛选事件
  $("ul.filterBox.typeBox li").click(handleTypeFilter);
  $("ul.filterBox.saleBox li").click(handleSaleTypeFilter);
  $("ul.filterBox.sortBox li").click(handleSortFilter);

  // 搜索框事件
  $(".search").on("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      query.search = $(this).val().trim();
      query.current = 1;
      getList();
    }
  });
  $(".cancelBtn").click(function() {
    $(".search").val("");
    query.search = "";
    query.current = 1;
    getList();
  });

  // 分页函数
  function handlePrevPage() {
    if (query.current === 1) return;
    query.current--;
    getList();
  }
  function handleFirstPage() {
    if (query.current === 1) return;
    query.current = 1;
    getList();
  }
  function handleLastPage() {
    if (query.current === maxPage) return;
    query.current = maxPage;
    getList();
  }
  function handleNextPage() {
    if (query.current === maxPage) return;
    query.current++;
    getList();
  }
  function handleGoPage() {
    const val = parseInt($(".jump").val());
    if (val > maxPage) {
      alert(`最大跳转至${maxPage}页`);
      return;
    }
    if (val < 1 || isNaN(val)) {
      alert(`请输入有效的页码`);
      return;
    }
    query.current = val;
    getList();
  }
  function handlePageSizeChange() {
    const val = $(this).val();
    query.pagesize = val;
    query.current = 1;
    getList();
  }

  // 热销/折扣/全部
  function handleTypeFilter() {
    $(this).addClass("active").siblings().removeClass("active");
    const type = $(this).data("type");
    query.filter = type || "";
    query.current = 1;
    getList();
  }

  // 折扣5折~9折
  function handleSaleTypeFilter() {
    $(this).addClass("active").siblings().removeClass("active");
    const saleType = $(this).data("type");
    query.saleType = saleType;
    query.current = 1;
    getList();
  }

  // 排序
  function handleSortFilter() {
    $(this).addClass("active").siblings().removeClass("active");
    const sortType = $(this).data("type");
    const sortMethod = $(this).data("method");
    query.sortType = sortType;
    query.sortMethod = sortMethod;
    query.current = 1;
    getList();
  }
});
