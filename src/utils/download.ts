const getFileName = (url: string) => {
  return url.substring(url.lastIndexOf('/') + 1)
}

export const saveFile = async (url: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(url)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
