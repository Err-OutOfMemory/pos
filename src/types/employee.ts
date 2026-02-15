export interface UserAccount {
  id: number
  employee_id: number
  failed_attempts: number
  locked_until: string | null
  updated_at: string
}

export interface Employee {
  id: number
  emp_code: string
  name: string
  role: string
  phonenum: string
  status: string
  created_at: string
  updated_at: string
  user: UserAccount | null
}
