import axios from './axios'

export const checkUser = (employeeCode: string) =>
  axios.post('/auth/check_user', {
    emp_code: employeeCode,
  })

export const login = (emp_code: string, pin: string) =>
  axios.post('/auth/login', {
    emp_code: emp_code,
    pin,
  })

export const registerPin = (employeeId: number, pin: string) =>
  axios.post('/auth/set_pin', {
    employee_id: employeeId,
    pin,
  })
