//Delete account
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("path");
  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        formDeleteItem.action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.submit();
      }
    });
  });
}
//End delete account

// Change Account Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
const formChangeStatus = document.querySelector("#form-change-status");
const path = formChangeStatus.getAttribute("path");

buttonsChangeStatus.forEach((button) => {
  button.addEventListener("click", () => {
    const statusCurrent = button.getAttribute("data-status");
    const id = button.getAttribute("data-id");
    const changeStatus = statusCurrent === "active" ? "inactive" : "active";
    formChangeStatus.action = `${path}/${changeStatus}/${id}?_method=PATCH`;
    formChangeStatus.submit();
  });
});
// End change account status
