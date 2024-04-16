// change status
const allBtnChangeStatus = document.querySelectorAll("[button-change-status]");

if (allBtnChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("path");

  for (let btn of allBtnChangeStatus) {
    btn.addEventListener("click", (e) => {
      const status = btn.getAttribute("data-status");
      const id = btn.getAttribute("data-id");

      const statusChange = status === "active" ? "inactive" : "active";

      formChangeStatus.action = `${path}/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.submit();
    });
  }
}
// End change status

// Delete product
const allBtnDeleteProduct = document.querySelectorAll("[btn-delete]");

if (allBtnDeleteProduct.length > 0) {
  const formDeleteProduct = document.querySelector("#form-delete-product");
  const path = formDeleteProduct.getAttribute("path");

  for (let btn of allBtnDeleteProduct) {
    btn.addEventListener("click", (e) => {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này!");
      if (isConfirm) {
        const id = btn.getAttribute("data-id");
        formDeleteProduct.action = `${path}/${id}?_method=DELETE`;
        formDeleteProduct.submit();
      }
    });
  }
}
// End delete product
