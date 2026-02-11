import request from '@/utils/request'

export interface Student {
  id: number
  name: string
}

export interface UnselectedStudentsResult {
  code: number
  data: Student[]
  message: string
}

export function getUnselectedStudents(): Promise<UnselectedStudentsResult> {
  return request.get('/internship/thesis/unselectedStudent')
}
