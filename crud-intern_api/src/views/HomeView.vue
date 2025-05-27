<template>
  <div>
    <div>{{ dataList }}</div>
    <!-- <div>{{ dataList.rows }}</div> -->
    <!-- <button @click="moreSize">+</button>
  <div>{{ queryParams }}</div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { blogService } from '@/services/web.service'
import type { BlogList } from '@/models/web.model'

onMounted(() => {
  fetchBlogs()
})
const fetchBlogs = async () => {
  try {
    const response = await blogService.getBlogsA() //เรียก Get all
    console.log('response', response.data) //ดักข้อมูลการทำงาน
    dataList.value = response.data
    // const data = await response.json()
    // contacts.value = data
  } catch (error) {
    console.error('Error fetching contacts:', error)
  }
}

const queryParams = ref({
  page: 1,
  size: 1,
  q: '',
  show: 'active',
})

const moreSize = () => {
  queryParams.value.size = queryParams.value.size + 1
  fetchBlogs()
}

const dataList = ref<BlogList>({
  //Default
  totalItems: 0,
  rows: [],
  totalPages: 0,
  currentPage: 0,
})
</script>
