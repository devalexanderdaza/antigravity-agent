/**
 * 数据库监控设置 Store
 * 合并了数据库监控设置和数据库监听状态管理
 */

import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import {listen, UnlistenFn} from '@tauri-apps/api/event';
import { EventEmitter } from 'events';

// 数据库变化事件数据接口
export interface DatabaseChangeEvent {
    timestamp: number;
    old_data?: any;
    new_data?: any;
}

// 导出事件相关类型
export type { DatabaseEventMap, DatabaseEventListener };

// 全局数据库事件发射器
const databaseEventEmitter = new EventEmitter();

// 全局 unlistenFn 变量
let globalUnlistenFn: UnlistenFn | null = null;

// 数据库事件类型
export const DATABASE_EVENTS = {
  DATA_CHANGED: 'database:data-changed',
} as const;

// 事件类型映射
type DatabaseEventMap = {
  [DATABASE_EVENTS.DATA_CHANGED]: DatabaseChangeEvent;
};

// 事件监听器类型
type DatabaseEventListener<T extends keyof DatabaseEventMap> = (data: DatabaseEventMap[T]) => void;

// 状态接口
interface DbMonitoringState {
  // 数据库监控设置
  dbMonitoringEnabled: boolean;
}

// 操作接口
interface DbMonitoringActions {
  // 数据库监控操作
  loadSettings: () => Promise<boolean>;
  setDbMonitoringEnabled: (enabled: boolean) => Promise<void>;
  toggleDbMonitoring: () => Promise<void>;

  // 数据库监听操作
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  cleanup: () => Promise<void>;

  addListener: <T extends keyof DatabaseEventMap>(
    event: T,
    listener: DatabaseEventListener<T>
  ) => (() => void);
}

// 创建 Store
export const useDbMonitoringStore = create<DbMonitoringState & DbMonitoringActions>()(
  (set, get) => ({
      // 初始状态
      // 数据库监控设置
      dbMonitoringEnabled: true, // 默认启用

      // 加载数据库监控设置
      loadSettings: async (): Promise<boolean> => {
        try {
          // 加载数据库监控设置
          const dbMonitoringEnabled = await invoke<boolean>('is_db_monitoring_enabled');

          set({ dbMonitoringEnabled });

          if (dbMonitoringEnabled) {
            get().startListening()
          }

          console.log('📋 数据库监控设置已同步:', dbMonitoringEnabled);
          return dbMonitoringEnabled
        } catch (error) {
          console.error('加载监控设置失败:', error);
          // 使用默认值
          set({ dbMonitoringEnabled: true });
        }
      },

      // 设置数据库监控启用状态
      setDbMonitoringEnabled: async (enabled: boolean): Promise<void> => {
        try {
          // 调用后端设置
          await invoke('set_db_monitoring_enabled', { enabled });
          if (!enabled) {
            get().stopListening()
          }
          set({ dbMonitoringEnabled: enabled });

          console.log('📋 数据库监控设置已更新:', enabled);
        } catch (error) {
          console.error('设置监控状态失败:', error);
          throw error;
        }
      },

      // 切换数据库监控状态
      toggleDbMonitoring: async (): Promise<void> => {
        const currentEnabled = get().dbMonitoringEnabled;
        await get().setDbMonitoringEnabled(!currentEnabled);
      },

      // 数据库监听操作
      startListening: async (): Promise<void> => {
        try {
          console.log('🎧 启动数据库监听...');

          // 清理之前的监听器
          await get().cleanup();

          // 处理数据库变化事件
          const handleDatabaseChange = async (event: any) => {
            console.log('📡 接收到数据库变化事件', event);

            // 解析事件数据：newData, oldData, diff
            const { newData, oldData, diff } = event.payload;

            if (diff) {
              console.log('📊 变化摘要:', {
                hasChanges: diff.hasChanges,
                changedFields: diff.changedFields,
                summary: diff.summary
              });
            }

            // 触发界面更新（不管有没有变化）
            console.log('🔄 数据库变化事件，触发界面更新');

            // 发射内部数据库变化事件
            databaseEventEmitter.emit(DATABASE_EVENTS.DATA_CHANGED, {
              timestamp: Date.now(),
              newData,
              oldData,
              diff,
              originalEvent: event
            });

            console.log('✅ 数据库变化事件已发射');
          };

          // 监听后端推送的数据库变化事件
          globalUnlistenFn = await listen('database-changed', handleDatabaseChange);

          invoke('start_database_monitoring');
          console.log('✅ 数据库监听已启动');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('❌ 启动数据库监听失败:', errorMessage);
        }
      },

      stopListening: async (): Promise<void> => {
        try {
          console.log('⏹️ 停止数据库监听...');

          await get().cleanup();

          console.log('✅ 数据库监听已停止');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('❌ 停止数据库监听失败:', errorMessage);
        }
      },

      // 清理资源
      cleanup: async (): Promise<void> => {
        if (globalUnlistenFn) {
          try {
            await globalUnlistenFn();
            globalUnlistenFn = null;
            console.log('🧹 数据库监听器已清理');
          } catch (error) {
            console.error('⚠️ 清理数据库监听器失败:', error);
          }
        }
      },

      addListener: <T extends keyof DatabaseEventMap>(
        event: T,
        listener: DatabaseEventListener<T>
      ): (() => void) => {
        databaseEventEmitter.on(event, listener);

        // 返回取消订阅函数
        return () => {
          databaseEventEmitter.off(event, listener);
        };
      },
    }),
);
