module.exports = (query) => {
  let title = "";
  if(query.keyword) {
    let regex = new RegExp(query.keyword, "i")
    title = regex;
  }

  return title;
}