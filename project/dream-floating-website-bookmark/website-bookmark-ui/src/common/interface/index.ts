/**
 * 响应结果对象
 */
export interface ResponseResult {
  code: number
  message: string
  data: any
}

export interface WebsiteInfo {
  id: string
  url: string
  title: string
  description: string
  keywords: string
  tags: string
  type: string
  createTime: string
  updateTime: string
  orderNumber: number
}
