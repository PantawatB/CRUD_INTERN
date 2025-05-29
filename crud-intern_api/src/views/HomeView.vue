<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <button @click="reloadData" class="text-3xl font-bold">DataBase</button>
      <div class="flex items-center gap-4">
        <!-- Search Box -->
        <div class="relative">
          <!-- q	string	ค้นหา title หรือ content -->
          <input
            type="text"
            v-model="queryParams.q"
            @keyup.enter="handleSearch"
            placeholder="Search by ID, title, or content..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <svg
            class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div class="relative">
          <button
            @click="handleSearch"
            class="flex items-center gap-2 bg-slate-600 text-white border px-5 py-5 rounded-lg hover:bg-slate-800"
          >
            <svg
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Filter Button -->
        <div class="relative">
          <!-- Toggle เปิด/ปิด -->
          <button
            @click="showFilterMenu = !showFilterMenu"
            class="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span class="text-gray-700">Filter & Sort</span>
          </button>

          <!-- Filter Dropdown -->
          <!-- เริ่มมาจะปิดก่อนเมื่อมีการเปิดคจะแสดงค่าตัวเลือก -->
          <div
            v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border p-4 z-10"
          >
            <!-- ID Sort -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort by ID</label>
              <!-- อัปเดต sortOptions.id อัตโนมัติ -->
              <select
                v-model="sortOptions.id"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">None</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>

            <!-- Title Sort -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort by Title</label>
              <select
                v-model="sortOptions.title"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">None</option>
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </select>
            </div>

            <!-- Content Sort -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort by Content</label>
              <select
                v-model="sortOptions.content"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">None</option>
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </select>
            </div>

            <!-- Date Sort -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort by Date</label>
              <select
                v-model="sortOptions.date"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">None</option>
                <option value="created_asc">Created (Oldest First)</option>
                <option value="created_desc">Created (Newest First)</option>
                <option value="updated_asc">Updated (Oldest First)</option>
                <option value="updated_desc">Updated (Newest First)</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <!-- sortOptions กลับเป็นค่าว่าง -->
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <button
          class="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
          @click="openModal"
        >
          <span class="font-semibold">+ Add</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- หัวตาราง -->
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profile
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Content
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Updated At
            </th>
            <th
              class="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <!-- body ตาราง -->
        <!-- สร้างตัวแปร blog มาดูดข้อมูลที่ได้มาจากการดึง api ที่อยู่ใน  -->
        <!-- ที่ต้องวน loop ใน sortedData เพราะจะต้องมีการอัพเดท Data ทุกครั้งที่มีการ sort หรือ filter -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="paginatedBlogs.length === 0">
            <td colspan="7" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p class="text-xl font-medium text-gray-500">No blogs found</p>
                <p class="text-sm text-gray-400">
                  {{
                    hasActiveFilters
                      ? 'Try adjusting your filters or search query'
                      : 'Add a blog post to get started'
                  }}
                </p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="blog in paginatedBlogs" :key="blog.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ blog.id }}</td>
            <!-- Profile ↓↓↓ -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <!-- ถ้ามีรูปภาพให้แสดงรูป ถ้าไม่มีให้แสดงรูป default -->
              <div class="flex items-center justify-center">
                <div v-if="blog.Img?.url" class="w-12 h-12 relative">
                  <img
                    :src="`https://exam-api.dev.mis.cmu.ac.th${blog.Img.url}`"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div
                  v-else
                  class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </td>
            <!-- Profile ^^^^^ -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ blog.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <div class="max-w-xs overflow-hidden text-ellipsis">{{ blog.content }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(blog.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(blog.updatedAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <!-- View Button ↓↓↓ เอามาแทรกอยู่ก่อน edit -->
                <button
                  @click="viewBlogDetails(blog)"
                  class="flex items-center gap-1 bg-gray-100 border text-black px-3 py-2 rounded-lg hover:bg-gray-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <!-- View Button ^^^^ -->
                <!-- Edit ↓↓↓ -->
                <button
                  @click="editBlog(blog)"
                  class="flex items-center gap-1 bg-slate-600 border text-white px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                  <span>Edit</span>
                </button>
                <!-- Edit ^^^^ -->
                <button
                  @click="deleteBlog(blog)"
                  class="flex items-center gap-1 bg-red-600 border text-white px-3 py-2 rounded-lg hover:bg-red-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-white border-t border-gray-200">
        <div class="flex items-center justify-between">
          <!-- ไม่แสดงผลเมื่อไม่มีข้อมูล -->
          <div class="text-sm text-gray-500">
            {{
              paginatedBlogs.length === 0
                ? 'No results'
                : `Showing ${(dataList.currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    dataList.currentPage * itemsPerPage,
                    dataList.totalItems,
                  )} of ${dataList.totalItems} results`
            }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPage(Math.max(1, currentPage - 1))"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 rounded-lg border',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Previous
            </button>
            <div class="flex items-center gap-1">
              <!-- ปุ่มกลาง -->
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 rounded-lg border',
                  currentPage === page
                    ? 'bg-slate-600 text-white border-slate-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="goToPage(Math.min(totalPages, currentPage + 1))"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 rounded-lg border',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- /////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <!-- Create/Edit Modal Popup -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <!-- ดูว่าถูกเรียกใช้ในโหมดไหน Edit หรือ Create -->
      <h2 class="text-xl font-bold mb-6">
        {{ isEditing ? 'Edit blog post' : 'Add new blog post' }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <!-- formData เป็น BlogForm -->
            <input
              type="text"
              v-model="formData.title"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              v-model="formData.content"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter content"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <!-- input type file เป็น ตัวทริกเกอร์อีเว้นท์ -->
            <!-- accept="image/*" รับเฉพาะไฟล์รูปภาพเท่านั้น -->
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <!-- แสดง <p> นี้ ก็ต่อเมื่อ มีไฟล์อยู่ใน formData.blog_img -->
            <p v-if="formData.blog_img" class="mt-1 text-sm text-gray-500">
              Selected file: {{ formData.blog_img.name }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
          <!-- ดูว่าถูกเรียกใช้ในโหมดไหน Edit หรือ Create -->
        </div>
      </form>
    </div>
  </div>
  <!-- Delete Modal Popup -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </div>
      </div>
      <h2 class="text-xl font-bold mb-4">Delete blog post</h2>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this blog post? This action cannot be undone.
      </p>
      <div class="flex justify-center gap-3">
        <button
          @click="cancelDelete"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- View Modal Popup -->
  <div
    v-if="showViewModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Blog Details</h2>
        <!-- ปุ่ม X -->
        <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div v-if="selectedBlog" class="space-y-6">
        <!-- Profile Image -->
        <div class="flex justify-center">
          <div v-if="selectedBlog.Img?.url" class="w-32 h-32 relative">
            <img
              :src="`https://exam-api.dev.mis.cmu.ac.th${selectedBlog.Img.url}`"
              :alt="selectedBlog.title"
              class="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
          <div v-else class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              class="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <!-- Blog Details -->
        <div class="grid gap-4">
          <div>
            <p class="font-medium text-gray-600">ID</p>
            <p class="text-gray-900">{{ selectedBlog.id }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Hit Count</p>
            <p class="text-gray-900">{{ selectedBlog.hit }}</p>
          </div>
          <div class="col-span-2">
            <!-- เผื่อ Title ยาว -->
            <p class="font-medium text-gray-600">Title</p>
            <p class="text-gray-900">{{ selectedBlog.title }}</p>
          </div>
          <div class="col-span-2">
            <!-- เผื่อ Content ยาว -->
            <p class="font-medium text-gray-600">Content</p>
            <p class="text-gray-900 whitespace-pre-wrap">{{ selectedBlog.content }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Created At</p>
            <p class="text-gray-900">
              {{ new Date(selectedBlog.createdAt).toLocaleString() }}
            </p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Updated At</p>
            <p class="text-gray-900">
              {{ new Date(selectedBlog.updatedAt).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- View Modal Popup -->
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////// -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { blogService } from '@/services/web.service'
import type { BlogList, Blog, BlogForm } from '@/models/web.model'

const currentPage = ref(1) // หน้าปัจจุบันเริ่มที่ 1
const itemsPerPage = 10 // จำนวนรายการต่อหน้า = 10

const dataList = ref<BlogList>({
  totalItems: 0,
  rows: [],
  totalPages: 0,
  currentPage: 0,
})

const queryParams = ref({
  page: 1,
  size: 10,
  q: '',
  show: 'active',
})

// Filter-related data
const showFilterMenu = ref(false)
//ค่าที่เราสามารถ Search ได้
const sortOptions = ref({
  id: '',
  title: '',
  content: '',
  date: '',
})

// ตรวจว่ามีการ Search ไหม
const hasActiveFilters = computed(() => {
  return Object.values(sortOptions.value).some((value) => value !== '')
  //ดูว่า มีค่าที่ไม่เท่ากับ '' ไหม ใน sortOptions.value
})

const activeFiltersCount = computed(() => {
  return Object.values(sortOptions.value).filter((value) => value !== '').length
  // ใช้ filter เพื่อกรองเฉพาะค่าที่ไม่ว่าง คือมีข้อมูลในนั้น
})

// Actions
const clearFilters = () => {
  sortOptions.value = {
    id: '',
    title: '',
    content: '',
    date: '',
  }
}

const fetchBlogs = async () => {
  try {
    if (hasActiveFilters.value) {
      currentPage.value = 1 // รีเซ็ตกลับไปหน้า 1 เมื่อมีการ filter
    }

    const response = await blogService.getBlogsA(
      currentPage.value, // หน้าปัจจุบัน
      itemsPerPage, // จำนวนรายการต่อหน้า (10)
      queryParams.value.q, // คำค้นหา
      queryParams.value.show, // สถานะที่ต้องการแสดง ('active')
    )
    dataList.value = response.data // เก็บข้อมูลที่ได้จาก API ไว้ใน dataList
  } catch (error) {
    console.error('Error fetching blogs:', error)
    dataList.value = {
      totalItems: 0,
      rows: [], // กรณี error ไม่เจอข้อมูล
      totalPages: 0,
      currentPage: 0,
    }
  }
}
const reloadData = async () => {
  await fetchBlogs()
}
// เอาไว้ handle searching by id
const handleSearch = async () => {
  try {
    if (!queryParams.value.q) {
      // ถ้าไม่มีค่าค้นหา ให้แสดงทั้งหมด (ดึง Get all มาแสดง)
      await fetchBlogs()
      return
    }

    if (!isNaN(Number(queryParams.value.q))) {
      // ถ้าเป็นตัวเลข ให้ค้นหาด้วย ID (ไม่ใช่ is not a number คือต้องเป็นตัวเลขเท่านั้น)
      try {
        const response = await blogService.getbyid(Number(queryParams.value.q))
        if (response.data) {
          dataList.value = {
            //แสดงข้อมูลเดียว
            totalItems: 1,
            rows: [response.data], //แสดงข้อมูลที่หาเจอ
            totalPages: 1,
            currentPage: 1,
          }
          return
        }
      } catch (error) {
        console.error('Blog not found with ID:', error)
      }
    }

    // ถ้าไม่ใช่ ID หรือหา ID ไม่เจอ ให้ค้นหาในข้อมูลทั้งหมด
    await fetchBlogs() // get all มา
    const searchText = queryParams.value.q.toLowerCase() // เอาคำที่ user พิมพ์มาเก็บไว้ใน
    // เอาข้อมูลจาก api มาแสดง โดยเพิ่มสิ่งที่ user พิมพ์มาแสดง
    const filteredRows = dataList.value.rows.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchText) ||
        blog.content.toLowerCase().includes(searchText),
    )

    dataList.value = {
      totalItems: filteredRows.length,
      rows: filteredRows,
      totalPages: 1,
      currentPage: 1,
    }
  } catch (error) {
    console.error('Error searching blogs:', error)
    //โชว์ error ที่เกิดขึ้น
    dataList.value = {
      totalItems: 0,
      rows: [],
      totalPages: 0,
      currentPage: 0,
    }
    //ไม่ก็ทำเป็นข้อมูลว่าง
  }
}

// Update filtered and paginated data
const totalPages = computed(() => dataList.value.totalPages) // เก็บค่า totalPages
const paginatedBlogs = computed(() => dataList.value.rows) // เก็บค่า rows

// Client-side sorting of current page data
const sortedData = computed(() => {
  let result = [...dataList.value.rows]
  // copy dataList.value.rows ไปไว้ใน result เพื่อให้การเปลี่ยนค่าจากการ sort ไม่กระทบข้อมูลเดิม

  // Sort by ID
  if (sortOptions.value.id) {
    result.sort((a, b) => {
      return sortOptions.value.id === 'asc' ? a.id - b.id : b.id - a.id
    })
  }

  // Sort by Title
  if (sortOptions.value.title) {
    result.sort((a, b) => {
      if (sortOptions.value.title === 'asc') {
        return a.title.localeCompare(b.title)
      }
      return b.title.localeCompare(a.title)
    })
  }

  // Sort by Content
  if (sortOptions.value.content) {
    result.sort((a, b) => {
      if (sortOptions.value.content === 'asc') {
        return a.content.localeCompare(b.content)
      }
      return b.content.localeCompare(a.content)
    })
  }

  // Sort by Date
  if (sortOptions.value.date) {
    result.sort((a, b) => {
      const dateA = sortOptions.value.date.startsWith('created')
        ? new Date(a.createdAt)
        : new Date(a.updatedAt)
      const dateB = sortOptions.value.date.startsWith('created')
        ? new Date(b.createdAt)
        : new Date(b.updatedAt)

      return sortOptions.value.date.endsWith('asc')
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    })
  }

  return result
})

onMounted(() => {
  fetchBlogs()
})
//////////////////////////////////////////////////////////////////////////////////////////////
const showModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false) // track สถานะการเปิดปิดของ ตอนเรียกตา
const blogToDelete = ref<Blog | null>(null)
const blogToEdit = ref<Blog | null>(null)
const selectedBlog = ref<Blog | null>(null) // ค่าที่เลือกมาจากตอนกดตา
const isEditing = ref(false)
const formData = ref<BlogForm>({
  title: '',
  content: '',
  blog_img: null, // แก้ไขให้เริ่มเป็น null
})

const handleImageUpload = (event: Event) => {
  //ใส่ค่าใน formdata ส่วนรูปภาพ
  const input = event.target as HTMLInputElement //ทำให้เป็นประเภท HTMLInputElement เข้าถึง .value .files
  if (input.files && input.files.length > 0) {
    //'input.files' is possibly 'null'
    // เช็กว่า input.files มีค่า และมีไฟล์มากกว่า 0 รายการ
    formData.value.blog_img = input.files[0] // formData (BlogForm) ได้ข้อมูลมาแล้ว
  }
}

const editBlog = (blog: Blog) => {
  // ตอนกดปุ่ม Edit จะเรียกฟังก์ชั่นนี้ก่อน
  isEditing.value = true
  blogToEdit.value = blog
  formData.value = {
    title: blog.title,
    content: blog.content,
    blog_img: new File([], ''),
  }
  showModal.value = true // โชว์หน้าต่างขึ้นมา
}

const openModal = () => {
  isEditing.value = false
  blogToEdit.value = null
  showModal.value = true
  //เปิด form และไม่มีค่า
  formData.value = {
    //formData คือ Blogform
    title: '',
    content: '',
    blog_img: new File([], ''),
  }
}

const closeModal = () => {
  //ล้างค่าต่างๆในเรียบร้อย
  showModal.value = false //ปิดหน้าต่าง
  isEditing.value = false //ไม่ได้อยู่ในโหมด edit แล้ว
  blogToEdit.value = null //
  formData.value = {
    title: '',
    content: '',
    blog_img: null,
  }
}
const handleSubmit = async () => {
  // handlesubmit จาก form "+ Add"
  try {
    const data = new FormData()
    //สร้าง new form data ยัดข้อมูลเข้าไป
    data.append('title', formData.value.title)
    data.append('content', formData.value.content)
    if (formData.value.blog_img) {
      // ป้องกันไม่ให้แนบ null หรือ undefined เข้าไปใน FormData
      data.append('blog_img', formData.value.blog_img) // โดยปกติแล้ว default จะเป็น null อยู่แล้ว
    }

    /////////////////////เลือกว่าจะยิงไปที่ไหน//////////////////////////////////////////////////////////////////
    if (isEditing.value && blogToEdit.value) {
      //กำลัง edit และมีข้อมูลที่ edit ให้ส่งไปตามนี้
      await blogService.update(blogToEdit.value.id, data)
    } else {
      //ถ้าไม่ใช้ก็เป็นโหมด create
      await blogService.create(data)
    }
    //////////////////เลือกว่าจะยิงไปที่ไหน///////////////////////////////////////////////////////////
    closeModal() // ปิดหน้าต่าง
    await fetchBlogs() // Refresh the list
  } catch (error) {
    console.error('Error blog:', error)
  }
}

const deleteBlog = (blog: Blog) => {
  blogToDelete.value = blog
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  blogToDelete.value = null
}

const confirmDelete = async () => {
  if (!blogToDelete.value) return

  try {
    await blogService.delete(blogToDelete.value.id)
    showDeleteModal.value = false
    blogToDelete.value = null
    await fetchBlogs() // Refresh the list
  } catch (error) {
    console.error('Error deleting blog:', error)
  }
}

const viewBlogDetails = async (blog: Blog) => {
  try {
    // เรียก API เพื่อดึงข้อมูลล่าสุดของ blog นั้น
    const response = await blogService.getbyid(blog.id)
    selectedBlog.value = response.data
    showViewModal.value = true
  } catch (error) {
    console.error('Error fetching blog details:', error)
  }
}

const closeViewModal = () => {
  // ปิดและล้างค่า
  showViewModal.value = false
  selectedBlog.value = null
}

// Add page navigation handlers that will refetch data
const goToPage = async (page: number) => {
  currentPage.value = page // อัพเดทหน้าปัจจุบัน
  await fetchBlogs() // ดึงข้อมูลใหม่ตามหน้าที่เลือก
}

// Watch for filter changes to refetch data
watch(
  // ติดตามการเปลี่ยนแปลงของ 2 ค่านี้
  [sortOptions, queryParams.value.q],
  () => {
    fetchBlogs() // ถ้ามีการเปลี่ยนแปลง ให้ดึงข้อมูลใหม่
  },
  { deep: true }, // ติดตามการเปลี่ยนแปลง
)
</script>
