<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Jujutsu Database</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name..."
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

        <!-- Filter Button -->
        <div class="relative">
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
            <span class="text-gray-700">Filter</span>
            <span
              v-if="selectedRole || selectedSchool"
              class="bg-slate-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ (selectedRole ? 1 : 0) + (selectedSchool ? 1 : 0) }}
            </span>
          </button>

          <!-- Filter Dropdown -->
          <div
            v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border p-4 z-10"
          >
            <!-- Role Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                v-model="selectedRole"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All Roles</option>
                <option v-for="role in uniqueRoles" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </div>

            <!-- School Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">School</label>
              <select
                v-model="selectedSchool"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All Schools</option>
                <option v-for="school in uniqueSchools" :key="school" :value="school">
                  {{ school }}
                </option>
              </select>
            </div>

            <!-- Clear Filters -->
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
    <!-- กล่องข้อมูลของ list -->
    <div class="bg-gray-50 rounded-xl shadow-md overflow-hidden">
      <!-- ส่วน header -->
      <table class="min-w-full divide-y divide-gray-300">
        <!-- สี header -->
        <thead class="bg-gray-100">
          <tr>
            <th
              class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              School
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              Created Date
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="contact in filteredContacts" :key="contact.email" class="hover:bg-gray-100">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-medium"
                >
                  {{ contact.name.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="{
                  'text-purple-800 font-semibold': contact.role.toLowerCase().includes('teacher'),
                  'text-cyan-400 font-semibold': contact.role.toLowerCase().includes('1st year'),
                  'text-blue-500 font-semibold': contact.role.toLowerCase().includes('2nd year'),
                  'text-indigo-800 font-semibold': contact.role.toLowerCase().includes('3rd year'),
                  'text-red-600 font-semibold': contact.role.toLowerCase().includes('curse'),
                  'text-gray-500 font-semibold':
                    contact.role.toLowerCase().includes('alumnus') ||
                    contact.role.toLowerCase().includes('former'),
                  'text-emerald-600 font-semibold': contact.role.toLowerCase().includes('medical'),
                  'text-amber-600 font-semibold': contact.role.toLowerCase().includes('principal'),
                  'text-gray-300': !contact.role
                    .toLowerCase()
                    .match(
                      /(teacher|instructor|1st year|2nd year|3rd year|curse|alumnus|former|medical|principal)/,
                    ),
                }"
              >
                {{ contact.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <span v-if="contact.school.includes('Kyoto')" class="text-lg">🎌</span>
                <span v-else-if="contact.school.includes('Tokyo')" class="text-lg">⛩</span>
                {{ contact.school }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.createdDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-6">Add New Contact</h2>
        <form @submit.prevent="addContact">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                v-model="newContact.name"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="newContact.role"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select Role</option>
                <option v-for="role in uniqueRoles" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                v-model="newContact.email"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">School</label>
              <select
                v-model="newContact.school"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select School</option>
                <option v-for="school in uniqueSchools" :key="school" :value="school">
                  {{ school }}
                </option>
              </select>
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
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Contact {
  name: string
  role: string
  email: string
  school: string
  createdDate: string
}

const contacts = ref<Contact[]>([
  {
    name: 'Yuji Itadori',
    role: '1st Year Student',
    email: 'yuji_itadori@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-06-14',
  },
  {
    name: 'Megumi Fushiguro',
    role: '1st Year Student',
    email: 'megumi_fushiguro@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-06-15',
  },
  {
    name: 'Nobara Kugisaki',
    role: '1st Year Student',
    email: 'nobara_kugisaki@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-07-01',
  },
  {
    name: 'Satoru Gojo',
    role: 'Teacher',
    email: 'satoru_gojo@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-05-28',
  },
  {
    name: 'Ryomen Sukuna',
    role: 'Special Grade Curse',
    email: 'ryomen_sukuna@curse.realm',
    school: '-',
    createdDate: '2023-03-03',
  },
  {
    name: 'Toge Inumaki',
    role: '2nd Year Student',
    email: 'toge_inumaki@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-04-10',
  },
  {
    name: 'Maki Zenin',
    role: '2nd Year Student',
    email: 'maki_zenin@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-04-11',
  },
  {
    name: 'Panda',
    role: '2nd Year Student',
    email: 'panda@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-04-12',
  },
  {
    name: 'Kento Nanami',
    role: 'Alumnus',
    email: 'kento_nanami@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-10-20',
  },
  {
    name: 'Suguru Geto',
    role: 'Former Student',
    email: 'suguru_geto@ex.jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2021-12-12',
  },
  {
    name: 'Shoko Ieiri',
    role: 'Medical Staff',
    email: 'shoko_ieiri@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-11-07',
  },
  {
    name: 'Aoi Todo',
    role: '3rd Year Student',
    email: 'aoi_todo@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-08',
  },
  {
    name: 'Mai Zenin',
    role: '2nd Year Student',
    email: 'mai_zenin@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-12',
  },
  {
    name: 'Kasumi Miwa',
    role: '2nd Year Student',
    email: 'kasumi_miwa@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-20',
  },
  {
    name: 'Noritoshi Kamo',
    role: '2nd Year Student',
    email: 'noritoshi_kamo@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-22',
  },
  {
    name: 'Kinji Hakari',
    role: '3rd Year Student',
    email: 'kinji_hakari@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-02-03',
  },
  {
    name: 'Yuta Okkotsu',
    role: '2nd Year Student',
    email: 'yuta_okkotsu@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-02-10',
  },
  {
    name: 'Rika Orimoto',
    role: 'Cursed Spirit',
    email: 'rika_orimoto@curse.realm',
    school: '-',
    createdDate: '2022-09-09',
  },
  {
    name: 'Utahime Iori',
    role: 'Teacher',
    email: 'utahime_iori@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2022-06-30',
  },
  {
    name: 'Masamichi Yaga',
    role: 'Principal',
    email: 'masamichi_yaga@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-03-15',
  },
])

const showModal = ref(false)
const newContact = ref<Contact>({
  name: '',
  role: '',
  email: '',
  school: '',
  createdDate: new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
})

const searchQuery = ref('')
const showFilterMenu = ref(false)
const selectedRole = ref('')
const selectedSchool = ref('')

// สร้าง unique roles และ schools สำหรับ filter
const uniqueRoles = computed(() => {
  const roles = new Set(contacts.value.map((contact) => contact.role))
  return Array.from(roles)
})

const uniqueSchools = computed(() => {
  const schools = new Set(contacts.value.map((contact) => contact.school))
  return Array.from(schools)
})

// กรองข้อมูลตาม search query และ filters
const filteredContacts = computed(() => {
  return contacts.value.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || contact.role === selectedRole.value
    const matchesSchool = !selectedSchool.value || contact.school === selectedSchool.value
    return matchesSearch && matchesRole && matchesSchool
  })
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  // Reset form
  newContact.value = {
    name: '',
    role: '',
    email: '',
    school: '',
    createdDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  }
}

const addContact = () => {
  contacts.value.push({ ...newContact.value })
  closeModal()
}

const clearFilters = () => {
  selectedRole.value = ''
  selectedSchool.value = ''
  searchQuery.value = ''
}
</script>
