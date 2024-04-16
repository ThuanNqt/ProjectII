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
