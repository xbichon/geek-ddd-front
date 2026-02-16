import { http } from '@/utils/request'

// 学生类型
export interface Student {
  id: number
  name: string
}

// 未选题学生列表响应类型
export interface UnselectedStudentsResult {
  code: number
  data: Student[]
  message: string
}

// 获取未选题学生列表
export function getUnselectedStudents(): Promise<UnselectedStudentsResult> {
  return http.get('internship/intern/unselectedList')
}
