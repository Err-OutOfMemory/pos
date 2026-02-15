<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEmployees, createEmployee, updateEmployee } from '@/api/employee.api'
import { Plus, Search, LockKeyhole, Edit2, Trash2, X } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import type { Employee } from '@/types/employee'
import Pagination from '@/components/common/Pagination.vue'

const employees = ref<Employee[]>([])
const loading = ref(false)
const searchQuery = ref('')
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const fetchEmployees = async () => {
  loading.value = true
  try {
    const res = await getEmployees({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: searchQuery.value,
    })
    employees.value = res.data.data
    pagination.value.total = res.data.total
  } catch (error) {
    Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลพนักงานได้', 'error')
  } finally {
    loading.value = false
  }
}
const isModalOpen = ref(false)
const isEditMode = ref(false)

interface EmployeeForm {
  id: number | null
  name: string
  role: string
  phonenum: string
  status: 'active' | 'inactive'
}

const form = ref<EmployeeForm>({
  id: null,
  name: '',
  role: 'cashier',
  phonenum: '',
  status: 'active',
})

const clearSearch = () => {
  searchQuery.value = ''
  fetchEmployees()
}

//เปิด Modal สำหรับเพิ่ม
const openAddModal = () => {
  isEditMode.value = false
  form.value = { id: null, name: '', role: 'cashier', phonenum: '', status: 'active' }
  isModalOpen.value = true
}

//เปิด Modal สำหรับแก้ไข
const openEditModal = (emp: Employee) => {
  isEditMode.value = true
  form.value = {
    id: emp.id,
    name: emp.name,
    role: emp.role,
    phonenum: emp.phonenum,
    status: emp.status as 'active' | 'inactive',
  }
  isModalOpen.value = true
}

const saveEmployee = async () => {
  if (!form.value.name) {
    Swal.fire('คำเตือน', 'กรุณากรอกชื่อพนักงานให้ครบถ้วน', 'warning')
    return
  }

  loading.value = true
  try {
    if (isEditMode.value && form.value.id) {
      await updateEmployee(form.value.id!, form.value as any)
    } else {
      await createEmployee(form.value)
    }

    isModalOpen.value = false

    await Swal.fire({
      title: 'สำเร็จ!',
      text: isEditMode.value ? 'แก้ไขข้อมูลเรียบร้อย' : 'เพิ่มพนักงานเรียบร้อย',
      icon: 'success',
      confirmButtonColor: '#8B735B',
    })
    await fetchEmployees()
  } catch (error: any) {
    console.error(error)
    Swal.fire(
      'ผิดพลาด',
      'ไม่สามารถบันทึกข้อมูลได้: ' + (error.response?.data?.error || error.message),
      'error',
    )
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  pagination.value.page = newPage
  fetchEmployees()
}

onMounted(fetchEmployees)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">พนักงาน</h1>
        <p class="text-sm text-gray-500">จัดการข้อมูลพนักงานและสิทธิ์การเข้าใช้งาน</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center justify-center gap-2 bg-[#8B735B] text-white px-4 py-2 rounded-lg hover:bg-[#725e4a] transition shadow-sm"
      >
        <Plus class="h-4 w-4" />
        เพิ่มพนักงานใหม่
      </button>
    </div>

    <div
      class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4"
    >
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          @keyup.enter="fetchEmployees"
          type="text"
          placeholder="ค้นหาชื่อ หรือรหัสพนักงาน..."
          class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9B59C]/50"
        />

        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-20 flex justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B735B]"></div>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#F9F8F6] text-gray-600 text-sm uppercase">
            <th class="px-6 py-4 font-semibold">พนักงาน</th>
            <th class="px-6 py-4 font-semibold">รหัสพนักงาน</th>
            <th class="px-6 py-4 font-semibold">ตำแหน่ง</th>
            <th class="px-6 py-4 font-semibold">เบอร์โทร</th>
            <th class="px-6 py-4 font-semibold">สถานะ</th>
            <th class="px-6 py-4 font-semibold text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="emp in employees" :key="emp.id" class="hover:bg-gray-50/50 transition">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-[#efe9e3] flex items-center justify-center text-[#8B735B] font-bold"
                >
                  {{ emp.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-gray-800">{{ emp.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="font-bold text-gray-800">{{ emp.emp_code }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-1 rounded-md text-xs font-medium uppercase"
                :class="
                  emp.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                "
              >
                {{ emp.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ emp.phonenum || '-' }}
            </td>
            <td class="px-6 py-4">
              <span class="flex items-center gap-1.5">
                <span
                  class="h-2 w-2 rounded-full"
                  :class="emp.status === 'active' ? 'bg-green-500' : 'bg-red-400'"
                ></span>
                <span class="text-sm text-gray-700 capitalize">{{ emp.status }}</span>
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button v-if="emp.user && emp.user.failed_attempts >= 5" class="p-2 text-red-500">
                  <LockKeyhole class="h-4 w-4" />
                </button>
                <button
                  @click="openEditModal(emp)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition"
                >
                  <Edit2 class="h-4 w-4" />
                </button>
                <button class="p-2 text-gray-400 hover:text-red-500 transition">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination
        v-if="!loading && employees.length > 0"
        :current-page="pagination.page"
        :total-items="pagination.total"
        :items-per-page="pagination.limit"
        @change-page="handlePageChange"
      />
      
      <div v-if="!loading && employees.length === 0" class="p-20 text-center text-gray-500">
        ไม่พบข้อมูลพนักงาน
      </div>
    </div>
  </div>

  <!-- Modal สำหรับเพิ่ม/แก้ไขพนักงาน -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      <div
        class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F9F8F6]"
      >
        <h3 class="font-bold text-gray-800">
          {{ isEditMode ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงานใหม่' }}
        </h3>
        <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <form @submit.prevent="saveEmployee" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-1"
            >ชื่อพนักงาน</label
          >
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-1"
            >เบอร์โทรศัพท์</label
          >
          <input
            v-model="form.phonenum"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">ตำแหน่ง</label>
            <select
              v-model="form.role"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none capitalize"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1"
              >สถานะการใช้งาน</label
            >
            <div class="flex gap-4 mt-2">
              <label class="flex items-center cursor-pointer">
                <input type="radio" v-model="form.status" value="active" class="hidden peer" />
                <span
                  class="px-4 py-2 rounded-lg border peer-checked:bg-green-50 peer-checked:border-green-500 peer-checked:text-green-700 transition-all text-sm"
                  >Active</span
                >
              </label>
              <label class="flex items-center cursor-pointer">
                <input type="radio" v-model="form.status" value="inactive" class="hidden peer" />
                <span
                  class="px-4 py-2 rounded-lg border peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 transition-all text-sm"
                  >Inactive</span
                >
              </label>
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button
            type="button"
            @click="isModalOpen = false"
            class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-[#8B735B] text-white rounded-lg hover:opacity-90 transition"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
