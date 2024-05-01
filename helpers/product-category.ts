import ProductCategory from "../models/product-category.model";

interface IFind {
  parent_id: string;
  deleted: boolean;
  status: string;
}

const getCategory = async (parentId) => {
  const findSubs: IFind = {
    parent_id: parentId,
    deleted: false,
    status: "active",
  };

  const subs = await ProductCategory.find(findSubs);

  let allSub = [...subs];

  for (let sub of subs) {
    const childs = await getCategory(sub.id);
    allSub = allSub.concat(childs);
  }

  return allSub;
};

export const getSubCategory = async (parentId) => {
  const subs = await getCategory(parentId);
  return subs;
};
