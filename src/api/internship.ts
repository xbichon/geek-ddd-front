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

// 论文选题相关接口
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

export interface TeamMemberParam {
  studentId: number
  responsibility: string
}

export interface TeamApplicationParam {
  reason: string
  members: TeamMemberParam[]
}

export interface ApplySelectionParams {
  thesisId: number
  achievementType: string
  selectionType: 'INDIVIDUAL' | 'GROUP'
  teamApplication?: TeamApplicationParam
}

export interface ApplySelectionResponse {
  code: number
  message: string
}

export function getThesisList(): Promise<ThesisListResponse> {
  return http.get('internship/thesis/list')
}

export function applySelection(params: ApplySelectionParams): Promise<ApplySelectionResponse> {
  return http.post('internship/thesis/applySelection', params)
}

// 检查选题状态接口
export interface CheckSelectionStatusResponse {
  code: number
  data: boolean
  message: string
}

export function checkSelectionStatus(): Promise<CheckSelectionStatusResponse> {
  return http.get('internship/thesis/checkSelectionStatus')
}

// 选题详情相关接口
export interface TeamMember {
  name: string
  responsibility: string
}

export interface TeamInfo {
  reason: string
  members: TeamMember[]
}

export interface SelectionDetail {
  studentName: string
  isGroup: boolean
  advisorName: string
  achievementType: string
  thesisTitle: string
  teamInfo: TeamInfo | null
}

export interface SelectionDetailResponse {
  code: number
  data: SelectionDetail
  message: string
}

export function getSelectionDetail(): Promise<SelectionDetailResponse> {
  return http.get('internship/thesis/getSelectionDetail')
}
