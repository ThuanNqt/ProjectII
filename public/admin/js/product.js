// change status
const allBtnChangeStatus = document.querySelectorAll("[button-change-status]");
const formChangeStatus = document.querySelector("#form-change-status");
const path = formChangeStatus.getAttribute("path");

if (allBtnChangeStatus.length > 0) {
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
