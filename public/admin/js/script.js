//Button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      // console.log(url.href);
      window.location.href = url.href;
    });
  });
}
//End button status

// Search keyword
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target[0].value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
// End search keyword

// Pagination
const allBtnPagination = document.querySelectorAll("[btn-pagination]");
if (allBtnPagination) {
  const url = new URL(window.location.href);
  for (let btn of allBtnPagination) {
    btn.addEventListener("click", (e) => {
      const page = btn.getAttribute("btn-pagination");

      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    });
  }
}
// End pagination

//Upload Image Preview
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const closeImagePreview = document.querySelector("[close-image-preview]");
  closeImagePreview.style.display = "none";
  closeImagePreview.addEventListener("click", () => {
    uploadImagePreview.src = "";
    uploadImageInput.value = "";
    closeImagePreview.style.display = "none";
  });

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      closeImagePreview.style.display = "block";
    }
  });
}
//End upload image preview

// Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
//End alert

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  let url = new URL(window.location.href);

  sortSelect.addEventListener("change", (e) => {
    const optionValue = e.target.value;
    const sortKey = optionValue.split("-")[0];
    const sortValue = optionValue.split("-")[1];
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });

  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });

  //selected option
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(
      `option[value="${stringSort}"]`
    );
    optionSelected.selected = true;
  }
}
// End sort

// Chart
const ChartTotal = document.getElementById("ChartTotal");
const statistic = JSON.parse(ChartTotal.dataset.statistic);

new Chart(ChartTotal, {
  type: "bar",
  data: {
    labels: [
      "Danh mục",
      "Sản phẩm",
      "Số quyền",
      "Tài khoản Admin",
      "Tài khoản Client",
      "Số đơn hàng",
    ],
    datasets: [
      {
        label: "Số lượng",
        data: [
          statistic.categoryProduct.total,
          statistic.product.total,
          statistic.role.total,
          statistic.account.total,
          statistic.user.total,
          statistic.order.total,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// char product
const ChartProduct = document.getElementById("ChartProduct");
const statisticProduct = JSON.parse(ChartProduct.dataset.statisticProduct);

new Chart(ChartProduct, {
  type: "pie",
  data: {
    labels: ["Hoạt động", "Dừng hoạt động"],
    datasets: [
      {
        label: "Số lượng",
        data: [statisticProduct.active, statisticProduct.inactive],
        backgroundColor: ["rgb(60, 179, 113)", "rgb(255, 0, 0)"],
        hoverOffset: 4,
      },
    ],
  },
});

// char category
const ChartCategory = document.getElementById("ChartCategory");
const statisticCategory = JSON.parse(ChartCategory.dataset.statisticCategory);

new Chart(ChartCategory, {
  type: "pie",
  data: {
    labels: ["Hoạt động", "Dừng hoạt động"],
    datasets: [
      {
        label: "Số lượng",
        data: [statisticCategory.active, statisticCategory.inactive],
        backgroundColor: ["rgb(60, 179, 113)", "rgb(255, 0, 0)"],
        hoverOffset: 4,
      },
    ],
  },
});

// char category
const ChartAccount = document.getElementById("ChartAccount");
const statisticAccount = JSON.parse(ChartAccount.dataset.statisticAccount);

new Chart(ChartAccount, {
  type: "pie",
  data: {
    labels: ["Hoạt động", "Dừng hoạt động"],
    datasets: [
      {
        label: "Số lượng",
        data: [statisticAccount.active, statisticAccount.inactive],
        backgroundColor: ["rgb(60, 179, 113)", "rgb(255, 0, 0)"],
        hoverOffset: 4,
      },
    ],
  },
});

// char category
const ChartUser = document.getElementById("ChartUser");
const statisticUser = JSON.parse(ChartUser.dataset.statisticUser);

new Chart(ChartUser, {
  type: "pie",
  data: {
    labels: ["Hoạt động", "Dừng hoạt động"],
    datasets: [
      {
        label: "Số lượng",
        data: [statisticUser.active, statisticUser.inactive],
        backgroundColor: ["rgb(60, 179, 113)", "rgb(255, 0, 0)"],
        hoverOffset: 4,
      },
    ],
  },
});

// Chart product best seller
const ChartProductBestSeller = document.getElementById(
  "ChartProductBestSeller"
);
const statisticProductBestSeller = JSON.parse(
  ChartProductBestSeller.dataset.statisticProductBestSeller
);

// Extract titles and counts into separate arrays
const titles = statisticProductBestSeller.map((product) => product.title);
const counts = statisticProductBestSeller.map((product) => product.count);

new Chart(ChartProductBestSeller, {
  type: "line",
  data: {
    labels: titles,
    datasets: [
      {
        label: "Số lượng",
        data: counts,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
});
// End chart
