import React, {useMemo, useState} from 'react';
import {Download, Plus, RefreshCw, Upload} from 'lucide-react';
import BusinessUpdateDialog from './business/UpdateDialog';
import BusinessConfirmDialog from './business/ConfirmDialog';
import BusinessActionButton from './business/ActionButton';
import {TooltipProvider} from './ui/tooltip';
import ToolbarTitle from './ui/toolbar-title';
import {useUpdateChecker} from '../hooks/useUpdateChecker';
import {useUserManagement} from '@/modules/user-management/store';
import {useDbMonitoringStore} from "@/modules/db-monitoring-store.ts";

interface LoadingState {
  isProcessLoading: boolean;
  isImporting: boolean;
  isExporting: boolean;
}

interface ToolbarProps {
  // 配置管理
  onImport: () => void;
  onExport: () => void;
  hasUserData: boolean;
  isCheckingData: boolean;

  // 进程管理（登录新账户）
  onBackupAndRestart: () => void;

  // 状态
  loadingState: LoadingState;
  showStatus: (message: string, isError?: boolean) => void;

  // 设置
  onSettingsClick?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onImport,
  onExport,
  hasUserData,
  isCheckingData,
  onBackupAndRestart,
  loadingState = { isProcessLoading: false, isImporting: false, isExporting: false },
  showStatus,
  onSettingsClick
}) => {
  const {addCurrentUser} = useUserManagement();
  const {dbMonitoringEnabled} = useDbMonitoringStore();

  // 确认对话框状态（用于"登录新账户"操作）
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { }
  });

  
  // 处理登录新账户按钮点击
  const handleBackupAndRestartClick = () => {
    console.log('🔘 用户点击登录新账户按钮，显示确认对话框');

    setConfirmDialog({
      isOpen: true,
      title: '登录新账户',
      description: `确定要关闭 Antigravity 并登录新账户吗？

此操作将会：
1. 关闭所有 Antigravity 进程
2. 自动备份当前账户信息
3. 清除 Antigravity 用户信息
4. 自动重新启动 Antigravity

登录新账户后点击 "刷新" 即可保存新账户
注意：系统将自动启动 Antigravity，请确保已保存所有重要工作`,
      onConfirm: async () => {
        console.log('✅ 用户确认登录新账户操作');
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        onBackupAndRestart();
      }
    });
  };

  // 使用自动更新检查 Hook
  const {
    updateState,
    updateInfo,
    downloadProgress,
    error: updateError,
    startDownload,
    installAndRelaunch,
    dismissUpdate,
  } = useUpdateChecker(true); // 启用自动检查

  // 更新对话框状态
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // 处理更新徽章点击
  const handleUpdateBadgeClick = () => {
    setIsUpdateDialogOpen(true);
  };

  // 处理开始下载
  const handleStartDownload = async () => {
    try {
      await startDownload();
      showStatus('更新包下载完成，点击重启按钮安装', false);
    } catch (error) {
      // 只在控制台打印错误，不提示用户
      console.error('下载失败:', error);
    }
  };

  // 处理安装并重启
  const handleInstallAndRelaunch = async () => {
    try {
      showStatus('正在安装更新并重启应用...', false);
      await installAndRelaunch();
      // 如果成功，应用会重启，这里的代码不会执行
    } catch (error) {
      // 只在控制台打印错误，不提示用户
      console.error('安装失败:', error);
    }
  };

  // 计算全局加载状态
  const isAnyLoading = useMemo(() => {
    return loadingState.isProcessLoading ||
      loadingState.isImporting ||
        loadingState.isExporting;
  }, [loadingState]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="toolbar bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
        <div className="toolbar-content max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-row">
              <ToolbarTitle
                updateState={updateState}
                downloadProgress={downloadProgress}
                onUpdateClick={handleUpdateBadgeClick}
              />

              {/* 添加当前用户按钮 */}
              <button
                onClick={async () => {
                  try {
                    await addCurrentUser();
                    showStatus('已添加当前用户', false);
                  } catch (error) {
                    showStatus(`添加当前用户失败: ${error}`, true);
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={dbMonitoringEnabled ? "数据库监控中 - 添加当前用户" : "添加当前用户"}
              >
                <RefreshCw
                  className={`w-3 h-3 ${dbMonitoringEnabled ? 'animate-spin' : ''}`}
                  style={dbMonitoringEnabled ? {
                    animationDuration: '2s'
                  } : {}}
                />
              </button>

            </div>

            <div className="flex items-center gap-2">

              {/* 操作按钮 */}
              <BusinessActionButton
                onClick={handleBackupAndRestartClick}
                variant="default"
                icon={<Plus className="h-4 w-4" />}
                tooltip="关闭 Antigravity，备份当前用户，清除用户信息，并自动重新启动"
                isLoading={loadingState.isProcessLoading}
                loadingText="处理中..."
                isAnyLoading={isAnyLoading}
              >
                登录新账户
              </BusinessActionButton>

              <BusinessActionButton
                onClick={onImport}
                variant="secondary"
                icon={<Upload className="h-4 w-4" />}
                tooltip="导入加密的配置文件"
                isLoading={loadingState.isImporting}
                loadingText="导入中..."
                isAnyLoading={isAnyLoading}
              >
                导入
              </BusinessActionButton>

              <BusinessActionButton
                onClick={onExport}
                variant="secondary"
                icon={<Download className="h-4 w-4" />}
                tooltip={hasUserData ? "导出为加密配置文件" : "没有用户信息可以导出"}
                disabled={!hasUserData}
                isLoading={loadingState.isExporting || isCheckingData}
                loadingText={isCheckingData ? "检查中..." : "导出中..."}
                isAnyLoading={isAnyLoading}
              >
                导出
              </BusinessActionButton>

              {/* 设置按钮 */}
              {onSettingsClick && (
                <button
                  onClick={onSettingsClick}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="设置"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 确认对话框 */}
      <BusinessConfirmDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        }}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => {
          console.log('❌ 用户取消了登录新账户操作');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }}
      />

  
      {/* 更新对话框 */}
      <BusinessUpdateDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        state={updateState}
        updateInfo={updateInfo}
        progress={downloadProgress}
        error={updateError}
        onDownload={handleStartDownload}
        onInstall={handleInstallAndRelaunch}
        onDismiss={() => {
          dismissUpdate();
          setIsUpdateDialogOpen(false);
        }}
      />
    </TooltipProvider>
  );
};

export default Toolbar;
