import { useEffect, useCallback, useState, useMemo } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { useDatabaseStore } from '../stores/databaseStore';
import { useAppActions } from './useAppActions';

/**
 * 数据库监听 Hook
 * 自动监听后端推送的数据库变化事件，并触发相应的界面更新
 */
export const useDatabaseListener = (refreshBackupList?: () => Promise<void>) => {
  const {
    setListening,
    setUnlistenFn,
    cleanup,
  } = useDatabaseStore();

  // 使用 useMemo 来稳定 actualRefreshBackupList 的引用
  const appActions = useAppActions();
  const actualRefreshBackupList = useMemo(() => {
    return refreshBackupList || appActions.refreshBackupList;
  }, [refreshBackupList, appActions.refreshBackupList]);

  // 处理数据库变化事件
  const handleDatabaseChange = useCallback(async (event: any) => {
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

    // 延迟确保数据库操作完成
    await new Promise(resolve => setTimeout(resolve, 300));

    // 重新加载备份列表（类似点击刷新的效果）
    await actualRefreshBackupList();

    console.log('✅ 数据库变化处理完成 - 界面已更新');
  }, [actualRefreshBackupList]);

  // 启动数据库监听
  const startListening = useCallback(async () => {
    try {
      console.log('🎧 启动数据库监听...');

      // 清理之前的监听器
      await cleanup();

      // 监听后端推送的数据库变化事件
      const unlistenFn = await listen('database-changed', handleDatabaseChange);

      setUnlistenFn(unlistenFn);
      setListening(true);

      console.log('✅ 数据库监听已启动');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ 启动数据库监听失败:', errorMessage);
      setListening(false);
    }
  }, [handleDatabaseChange, setListening, setUnlistenFn, cleanup]);

  // 停止数据库监听
  const stopListening = useCallback(async () => {
    try {
      console.log('⏹️ 停止数据库监听...');

      await cleanup();
      setListening(false);

      console.log('✅ 数据库监听已停止');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ 停止数据库监听失败:', errorMessage);
    }
  }, [cleanup, setListening]);

  // 重启监听（当设置改变时）
  const restartListening = useCallback(async () => {
    await stopListening();
    await startListening();
  }, [stopListening, startListening]);

  return {
    startListening,
    stopListening,
    restartListening,
    isListening: useDatabaseStore(state => state.isListening),
  };
};

/**
 * 自动数据库监听 Hook
 * 根据设置自动启动/停止数据库监听，并处理组件生命周期
 */
export const useAutoDatabaseListener = (refreshBackupList?: () => Promise<void>) => {
  const { startListening, stopListening } = useDatabaseListener(refreshBackupList);
  const isAutoRefreshEnabled = useDatabaseStore(state => state.isAutoRefreshEnabled);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 根据设置自动启动或停止监听
    const manageListening = async () => {
      if (!isInitialized) {
        // 首次初始化时，先启动后端监控
        console.log('🔧 初始化数据库监控...');
        try {
          // 启动后端监控
          await invoke('start_database_monitoring');
          console.log('✅ 后端数据库监控已启动');
        } catch (error) {
          console.warn('⚠️ 启动后端监控失败:', error);
        }
        setIsInitialized(true);
      }

      if (isAutoRefreshEnabled) {
        await startListening();
        console.log('✅ 前端数据库监听已启动');
      } else {
        await stopListening();
        console.log('ℹ️ 前端数据库监听已停止');
      }
    };

    manageListening();

    // 组件卸载时清理
    return () => {
      stopListening();
    };
  }, [isAutoRefreshEnabled, isInitialized]);

  // 页面可见性变化时的处理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📴 页面隐藏，暂停数据库监听');
      } else {
        console.log('📱 页面显示，恢复数据库监听');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};