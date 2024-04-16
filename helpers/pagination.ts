interface IObjectPagination {
  currentPage: number;
  limitItems: number;
  skip?: number;
  totalPage?: number;
}

const pagination = (query, countProduct) => {
  const objPagination: IObjectPagination = {
    currentPage: 1,
    limitItems: 3,
  };

  //Nếu tồn tại page trên url do client truyền vào
  if (query.page) {
    //Lấy ra giá trị page hiện tại trên url
    objPagination.currentPage = parseInt(query.page.toString());
  }

  //Tính vị trí bắt đầu lấy sản phẩm
  objPagination.skip =
    (objPagination.currentPage - 1) * objPagination.limitItems;

  //Tính tổng số page
  const totalPage = Math.ceil(countProduct / objPagination.limitItems);
  objPagination.totalPage = totalPage;

  return objPagination;
};
export default pagination;
