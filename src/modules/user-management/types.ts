/**
 * 用户管理类型定义 - 简化版
 */

// 用户基本信息
export interface User {
  email: string;
}

// Store 状态
export interface UserStoreState {
  users: User[];
  isLoading: boolean;
}

// Store Actions
export interface UserStoreActions {
  // 基础操作
  deleteUser: (email: string) => Promise<void>;
  addCurrentUser: () => Promise<void>;
  switchUser: (email: string) => Promise<void>;
  currentUser: () => Promise<string | null>;

  // 批量操作
  clearAllUsers: () => Promise<void>;

  // 查询
  getUsers: () => Promise<User[]>;
  searchUsers: (keyword: string) => User[];
}
