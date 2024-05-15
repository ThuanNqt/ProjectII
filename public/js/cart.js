// update quantity of product in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product_id");
      const quantity = parseInt(input.value);

      if (quantity < 1) {
        quantity = 1;
        input.value = 1;
      }
      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
//End  update quantity of product in cart
