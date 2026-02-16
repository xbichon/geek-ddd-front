import { http } from '@/utils/request'

// 论文相关类型定义
export interface Paper {
  id: number
  title: string
  maxSelections: number
  currentSelections: number
  achievementTypes: string[]
}

export interface ThesisListResponse {
  code: number
  data: Paper[]
  message: string
}

// 获取论文列表
export function getThesisList(): Promise<ThesisListResponse> {
  return http.get('internship/thesis/list')
}
