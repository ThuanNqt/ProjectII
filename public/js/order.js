// Cancel order
const allBtnCancelOrder = document.querySelectorAll("[btn-cancel-order]");

if (allBtnCancelOrder.length > 0) {
  const formCancelOrder = document.querySelector("#form-cancel-order");
  const path = formCancelOrder.getAttribute("path");

  for (let btn of allBtnCancelOrder) {
    btn.addEventListener("click", (e) => {
      const isConfirm = confirm("Bạn có chắc muốn hủy đơn này!");
      if (isConfirm) {
        const order_id = btn.getAttribute("data-id");
        formCancelOrder.action = `${path}/${order_id}?_method=DELETE`;
        formCancelOrder.submit();
      }
    });
  }
}
// End cancel order
