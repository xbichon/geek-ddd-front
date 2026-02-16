import { http } from '@/utils/request'

// 团队成员类型
export interface TeamMember {
  name: string
  responsibility: string
}

// 团队申请信息类型
export interface TeamInfo {
  reason: string
  members: TeamMember[]
}

// 选题详情类型
export interface SelectionDetail {
  studentName: string
  isGroup: boolean
  advisorName: string
  achievementType: string
  thesisTitle: string
  teamInfo: TeamInfo | null
}

// 选题相关参数类型
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

// 选题相关响应类型
export interface ApplySelectionResponse {
  code: number
  message: string
}

export interface CheckSelectionStatusResponse {
  code: number
  data: boolean
  message: string
}

export interface SelectionDetailResponse {
  code: number
  data: SelectionDetail
  message: string
}

// 申请选题
export function applySelection(params: ApplySelectionParams): Promise<ApplySelectionResponse> {
  return http.post('internship/selection/apply', params)
}

// 检查选题状态
export function checkSelectionStatus(): Promise<CheckSelectionStatusResponse> {
  return http.get('internship/selection/status')
}

// 获取选题详情
export function getSelectionDetail(): Promise<SelectionDetailResponse> {
  return http.get('internship/selection/detail')
}
