import { type LinksApp } from '@/features/links/types/link.types'

export const generateBookmarksFile = (
  webappsByCategory: Record<string, LinksApp[]>
) => {
  let bookmarksHtml = `
    <!DOCTYPE NETSCAPE-Bookmark-file-1>
    <!-- This is an automatically generated file.
         It will be read and overwritten.
         DO NOT EDIT! -->
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>
    <DL><p>
  `

  Object.entries(webappsByCategory).forEach(([categoryName, links]) => {
    bookmarksHtml += `<DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">${categoryName}</H3><DL><p>`
    links.forEach(link => {
      bookmarksHtml += `<DT><A HREF="${link.environments?.production}" ADD_DATE="${Math.floor(Date.now() / 1000)}" ICON="${link.icon}">${link.name}</A></DT>`
    })
    bookmarksHtml += '</DL><p>'
  })

  bookmarksHtml += '</DL><p>'
  return bookmarksHtml
}
