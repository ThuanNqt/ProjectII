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
