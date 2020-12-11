import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin'
/* 
得到要显示的网页title
*/
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
