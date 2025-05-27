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
            <!-- <span
              v-if="hasActiveFilters"
              class="bg-slate-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ activeFiltersCount }}
            </span> -->
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { blogService } from '@/services/web.service'
import type { BlogList } from '@/models/web.model'

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

// Computed property for sorted
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
</script>
