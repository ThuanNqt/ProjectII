// Delete role
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa nhóm quyền này?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        formDeleteItem.action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.submit();
      }
    });
  });
}
