import {http} from '@/utils/request'

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
  return http.get('internship/thesis/unselectedStudent')
}
