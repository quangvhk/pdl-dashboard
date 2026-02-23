/**
 * API Endpoint Constants — FE-1.4 V2 Update
 * All API endpoint paths organized by feature domain.
 * Dynamic endpoints are functions that accept IDs and return the full path.
 */

const API_V1 = '/api/v1'

export const ENDPOINTS = {
  auth: {
    register: `${API_V1}/auth/register`,
    login: `${API_V1}/auth/login`,
    refresh: `${API_V1}/auth/refresh`,
    logout: `${API_V1}/auth/logout`,
    me: `${API_V1}/auth/me`,
    switchTenant: `${API_V1}/auth/switch-tenant`,
  },

  tenants: {
    list: `${API_V1}/tenants`,
    create: `${API_V1}/tenants`,
    detail: (id: string) => `${API_V1}/tenants/${id}`,
    update: (id: string) => `${API_V1}/tenants/${id}`,
    updateStatus: (id: string) => `${API_V1}/tenants/${id}/status`,
    transferOwnership: (id: string) => `${API_V1}/tenants/${id}/transfer-ownership`,
  },

  users: {
    list: `${API_V1}/users`,
    detail: (id: string) => `${API_V1}/users/${id}`,
    update: (id: string) => `${API_V1}/users/${id}`,
    deactivate: (id: string) => `${API_V1}/users/${id}`,
  },

  members: {
    list: `${API_V1}/members`,
    detail: (id: string) => `${API_V1}/members/${id}`,
    changeRole: (id: string) => `${API_V1}/members/${id}/role`,
    suspend: (id: string) => `${API_V1}/members/${id}/suspend`,
    activate: (id: string) => `${API_V1}/members/${id}/activate`,
    remove: (id: string) => `${API_V1}/members/${id}`,
  },

  invitations: {
    list: `${API_V1}/invitations`,
    create: `${API_V1}/invitations`,
    cancel: (id: string) => `${API_V1}/invitations/${id}`,
    accept: `${API_V1}/invitations/accept`,
  },

  roles: {
    list: `${API_V1}/roles`,
    create: `${API_V1}/roles`,
    detail: (id: string) => `${API_V1}/roles/${id}`,
    update: (id: string) => `${API_V1}/roles/${id}`,
    delete: (id: string) => `${API_V1}/roles/${id}`,
  },

  permissions: {
    list: `${API_V1}/permissions`,
    create: `${API_V1}/permissions`,
    detail: (id: string) => `${API_V1}/permissions/${id}`,
    delete: (id: string) => `${API_V1}/permissions/${id}`,
  },

  rolePermissions: {
    list: `${API_V1}/role-permissions`,
    assign: `${API_V1}/role-permissions`,
    remove: (id: string) => `${API_V1}/role-permissions/${id}`,
  },

  courses: {
    list: `${API_V1}/courses`,
    create: `${API_V1}/courses`,
    detail: (id: string) => `${API_V1}/courses/${id}`,
    update: (id: string) => `${API_V1}/courses/${id}`,
    delete: (id: string) => `${API_V1}/courses/${id}`,
    publish: (id: string) => `${API_V1}/courses/${id}/publish`,
    archive: (id: string) => `${API_V1}/courses/${id}/archive`,
    enrollments: (id: string) => `${API_V1}/courses/${id}/enrollments`,
  },

  sections: {
    list: (courseId: string) => `${API_V1}/courses/${courseId}/sections`,
    create: (courseId: string) => `${API_V1}/courses/${courseId}/sections`,
    update: (courseId: string, id: string) => `${API_V1}/courses/${courseId}/sections/${id}`,
    delete: (courseId: string, id: string) => `${API_V1}/courses/${courseId}/sections/${id}`,
  },

  lessons: {
    list: (courseId: string, sectionId: string) =>
      `${API_V1}/courses/${courseId}/sections/${sectionId}/lessons`,
    create: (courseId: string, sectionId: string) =>
      `${API_V1}/courses/${courseId}/sections/${sectionId}/lessons`,
    detail: (courseId: string, sectionId: string, id: string) =>
      `${API_V1}/courses/${courseId}/sections/${sectionId}/lessons/${id}`,
    update: (courseId: string, sectionId: string, id: string) =>
      `${API_V1}/courses/${courseId}/sections/${sectionId}/lessons/${id}`,
    delete: (courseId: string, sectionId: string, id: string) =>
      `${API_V1}/courses/${courseId}/sections/${sectionId}/lessons/${id}`,
  },

  quizzes: {
    create: (courseId: string, sectionId: string) =>
      `${API_V1}/courses/${courseId}/sections/${sectionId}/quizzes`,
    detail: (id: string) => `${API_V1}/quizzes/${id}`,
    update: (id: string) => `${API_V1}/quizzes/${id}`,
    delete: (id: string) => `${API_V1}/quizzes/${id}`,
    addQuestion: (id: string) => `${API_V1}/quizzes/${id}/questions`,
    updateQuestion: (id: string, qId: string) => `${API_V1}/quizzes/${id}/questions/${qId}`,
    deleteQuestion: (id: string, qId: string) => `${API_V1}/quizzes/${id}/questions/${qId}`,
    submitAttempt: (id: string) => `${API_V1}/quizzes/${id}/attempts`,
    listAttempts: (id: string) => `${API_V1}/quizzes/${id}/attempts`,
  },

  enrollments: {
    create: `${API_V1}/enrollments`,
    me: `${API_V1}/enrollments/me`,
    detail: (id: string) => `${API_V1}/enrollments/${id}`,
    updateProgress: (id: string) => `${API_V1}/enrollments/${id}/progress`,
  },

  health: {
    liveness: `${API_V1}/health`,
    readiness: `${API_V1}/health/ready`,
  },
} as const
