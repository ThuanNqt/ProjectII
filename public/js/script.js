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

// range price
document.addEventListener("DOMContentLoaded", function () {
  let priceSlider = document.getElementById("priceSlider");

  noUiSlider.create(priceSlider, {
    start: [0, 25000000],
    connect: true,
    range: {
      min: 0,
      max: 50000000,
    },
  });

  function formatCurrency(value) {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  // Lắng nghe sự kiện thay đổi giá trị và cập nhật giao diện nếu cần
  priceSlider.noUiSlider.on("update", function (values, handle) {
    let valueMin = values[0],
      valueMax = values[1];
    document.getElementById("sliderValueMin").textContent = formatCurrency(
      parseInt(valueMin)
    );
    document.getElementById("sliderValueMax").textContent = formatCurrency(
      parseInt(valueMax)
    );
  });

  let url = new URL(window.location.href);
  const rangePrice = document.querySelector("[range-price]");
  if (rangePrice) {
    rangePrice.addEventListener("click", (e) => {
      const priceMin = parseInt(priceSlider.noUiSlider.get()[0]);
      const priceMax = parseInt(priceSlider.noUiSlider.get()[1]);
      url.searchParams.set("priceMin", priceMin);
      url.searchParams.set("priceMax", priceMax);
      window.location.href = url.href;
    });
  }
});
