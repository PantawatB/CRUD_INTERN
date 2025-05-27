<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">DataBase</h1>
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold">Get by id test:</h1>
        <!-- Search Box -->
        <div class="relative">
          <!-- q	string	ค้นหา title หรือ content -->
          <input
            type="text"
            v-model="queryParams.q"
            @keyup.enter="handleSearch"
            placeholder="Search id..."
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
          </tr>
        </thead>
        <!-- body ตาราง -->
        <!-- สร้างตัวแปร blog มาดูดข้อมูลที่ได้มาจากการดึง api ที่อยู่ใน  -->
        <!-- ที่ต้องวน loop ใน sortedData เพราะจะต้องมีการอัพเดท Data ทุกครั้งที่มีการ sort หรือ filter -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="blog in sortedData" :key="blog.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ blog.id }}</td>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- /////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <!-- Create/Edit Modal Popup -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <h2 class="text-xl font-bold mb-6">Add new blog post</h2>
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
            Create
          </button>
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
      <h2 class="text-xl font-bold mb-4">Delete member</h2>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this member? This action cannot be undone.
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
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////// -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { blogService } from '@/services/web.service'
import type { BlogList, Blog, BlogForm } from '@/models/web.model'

const dataList = ref<BlogList>({
  totalItems: 0,
  rows: [],
  totalPages: 0,
  currentPage: 0,
})

const queryParams = ref({
  page: 1,
  size: 1,
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
    const response = await blogService.getBlogsA()
    dataList.value = response.data
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }
}

// เอาไว้ handle searching by id
const handleSearch = async () => {
  try {
    if (queryParams.value.q && !isNaN(Number(queryParams.value.q))) {
      // ทีค่าและค่าต้องเป็นตัวเลข และ ไม่ใช่ is Not a Number คือต้องเป็นตัวเลข ตัวว่างยังถือว่าเป็น 0
      const response = await blogService.getbyid(Number(queryParams.value.q))
      if (response.data) {
        // ถ้ามี data ให้แสดงข้อมูล ไอเทมอันเดียว หน้าเดียว และ โชว์ข้อมูลนั้น
        dataList.value = {
          totalItems: 1,
          rows: [response.data],
          totalPages: 1,
          currentPage: 1,
        }
      }
    } else {
      // กดเฉยๆแบบไม่มีข้อมูลก็ get all มาก่อน
      await fetchBlogs()
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

// Computed property for sorted data
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
const formData = ref<BlogForm>({
  title: '',
  content: '',
  blog_img: new File([], ''),
}) //ค่าเริ่มต้น

const openModal = () => {
  showModal.value = true
  //เปิด form และไม่มีค่า
  formData.value = {
    title: '',
    content: '',
    blog_img: new File([], ''),
  }
}

const closeModal = () => {
  showModal.value = false
  //ปิด form และ ล้างค่า
  formData.value = {
    title: '',
    content: '',
    blog_img: new File([], ''),
  }
}
const handleSubmit = async () => {
  // handlesubmit จาก form "+ Add"
  try {
    const data = new FormData()
    //สร้าง new form data ยัดข้อมูลเข้าไป
    data.append('title', formData.value.title)
    data.append('content', formData.value.content)

    await blogService.create(data) //รอ create
    closeModal() // ปิดหน้าต่าง
    await fetchBlogs() // Refresh the list
  } catch (error) {
    console.error('Error creating blog:', error)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
}
</script>
