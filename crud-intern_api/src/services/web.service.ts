import type { Blog, BlogForm, BlogList } from '@/models/web.model'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const blogService = {
  // Get all
  getBlogsA: (page = 1, size = 200, q = '', show = 'active') =>
    axios.get<BlogList>(`${API_URL}/blogs`, {
      params: { page, size, q, show },
    }),

  // Get single
  // async getBlog(id: number) {
  //   const response = await axios.get(`${API_URL}/blogs/${id}`)
  //   return response.data
  // },
  one: (id: number) => axios.get<BlogList>(`${API_URL}/blogs/${id}`),

  // Create
  // async createBlog(data: FormData) {
  //   const response = await axios.post(`${API_URL}/blogs`, data)
  //   return response.data
  // },
  create: (data: FormData) => axios.post(`${API_URL}/blogs`, data),

  // Update
  // async updateBlog(id: number, data: FormData) {
  //   const response = await axios.put(`${API_URL}/blogs/${id}`, data)
  //   return response.data
  // },
  update: (id: number, data: FormData) => axios.put(`${API_URL}/blogs/${id}`, data),

  // Delete
  // async deleteBlog(id: number) {
  //   await axios.delete(`${API_URL}/blogs/${id}`)
  // },
  delete: (id: number) => axios.delete(`${API_URL}/blogs/${id}`),

  // Delete multiple
  // async deleteMultipleBlogs(ids: number[]) {
  //   await axios.post(`${API_URL}/blogs/delete`, { ids })
  // },
  deleteMultiple: (ids: number[]) => axios.post(`${API_URL}/blogs/delete`, { ids }),
}

// const getBlogsA = (page = 1, size = 10, q = '', show = 'active') =>
//   axios.get<BlogList>(`${API_URL}/blogs`, {
//     params: { page, size, q, show },
//   })
