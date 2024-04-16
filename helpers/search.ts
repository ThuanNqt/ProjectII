interface IObjectSearch {
  keyword: string;
  regex: RegExp | string;
}

const searchHelper = (query) => {
  const objSearch: IObjectSearch = {
    keyword: "",
    regex: "",
  };

  if (query.keyword) {
    objSearch.keyword = query.keyword;
    objSearch.regex = RegExp(objSearch.keyword, "i");
  }

  return objSearch;
};
export default searchHelper;
