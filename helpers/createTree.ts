let count: number = 0;

const createTree = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      ++count;
      const newItem = item;
      newItem.index = count; //Chỉ số của sản phầm để cho mọi sản phẩm luôn tăng
      const children = createTree(arr, item.id);
      if (children.length) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

const tree = (arr, parentId = "") => {
  count = 0; // reset count = 0
  const tree = createTree(arr, (parentId = ""));
  return tree;
};

export default tree;
