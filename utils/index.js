export function getImageUri (url) {
  return `http://kit.imgix.net/${url}`
}

export function getUserFullName (user) {
  let name = ''
  if (user.firstname) {
  	name += `${user.firstname} `
  }
  if (user.lastname) {
  	name += user.lastname
  }
  return name.trim()
}