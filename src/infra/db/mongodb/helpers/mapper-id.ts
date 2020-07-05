export default (collection: any): any => {
  return { id: collection._id, ...collection }
}
