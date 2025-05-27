export interface BlogForm {
  title: string
  content: string
  blog_img: File
}

export interface Blog {
  id: number
  title: string
  content: string
  hit: number
  pin: boolean
  active: boolean
  createdAt: string
  updatedAt: string
  Img?: {
    url: string
  }
}
export interface BlogList {
  totalItems: number
  rows: Blog[]
  totalPages: number
  currentPage: number
}
