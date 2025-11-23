import React, { useState, useEffect } from 'react';
import { Settings, FolderOpen, FileCode, Shield, Database, Zap, Monitor, Check, AlertCircle, Info } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { AntigravityPathService } from '../../services/antigravity-path-service';
import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/base-ui/BaseDialog';
import { BaseButton } from '@/components/base-ui/BaseButton';
import { BaseSpinner } from '@/components/base-ui/BaseSpinner';
import { SystemTrayService } from '../../services/system-tray-service';

interface BusinessSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BusinessSettingsDialog: React.FC<BusinessSettingsDialogProps> = ({
  isOpen,
  onOpenChange
}) => {
  const [dataPath, setDataPath] = useState<string>('');
  const [execPath, setExecPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // 监控设置状态
  const [isDbMonitoringEnabled, setIsDbMonitoringEnabled] = useState(true);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  // 系统托盘状态
  const [isSystemTrayEnabled, setIsSystemTrayEnabled] = useState(true);
  const [isTrayLoading, setIsTrayLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCurrentPaths();
      loadCurrentSettings();
      loadSystemTraySettings();
    }
  }, [isOpen]);

  const loadCurrentPaths = async () => {
    setIsLoading(true);
    try {
      // 获取用户自定义路径
      const paths = await AntigravityPathService.getCurrentPaths();

      // 如果没有自定义路径，尝试获取自动检测的路径
      let finalDataPath = paths.dataPath;
      let finalExecPath = paths.executablePath;

      if (!finalDataPath) {
        const detectedData = await AntigravityPathService.detectAntigravityPath();
        if (detectedData.found && detectedData.path) {
          finalDataPath = detectedData.path + ' (自动检测)';
        }
      }

      if (!finalExecPath) {
        const detectedExec = await AntigravityPathService.detectExecutable();
        if (detectedExec.found && detectedExec.path) {
          finalExecPath = detectedExec.path + ' (自动检测)';
        }
      }

      setDataPath(finalDataPath || '未设置');
      setExecPath(finalExecPath || '未设置');
    } catch (error) {
      console.error('加载路径失败:', error);
      setDataPath('加载失败');
      setExecPath('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentSettings = async () => {
    setIsSettingsLoading(true);
    try {
      // 加载数据库监控状态
      const dbMonitoringEnabled = await invoke<boolean>('is_db_monitoring_enabled');
      setIsDbMonitoringEnabled(dbMonitoringEnabled);
    } catch (error) {
      console.error('加载设置失败:', error);
      // 使用默认值
      setIsDbMonitoringEnabled(true);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  const handleDbMonitoringToggle = async (enabled: boolean) => {
    try {
      const result = await invoke<string>('save_db_monitoring_state', { enabled });
      setIsDbMonitoringEnabled(enabled);
      setMessage(`${result}`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`设置失败: ${error}`);
      setMessageType('error');
    }
  };

  const loadSystemTraySettings = async () => {
    try {
      // 加载系统托盘状态
      const trayEnabled = await SystemTrayService.getSystemTrayState();
      setIsSystemTrayEnabled(trayEnabled);
    } catch (error) {
      console.error('加载系统托盘设置失败:', error);
      // 使用默认值
      setIsSystemTrayEnabled(false);
    }
  };

  const handleSystemTrayToggle = async () => {
    setIsTrayLoading(true);
    try {
      const result = await SystemTrayService.toggleSystemTray();
      setIsSystemTrayEnabled(result.enabled);
      setMessage(result.message);
      setMessageType(result.enabled ? 'success' : 'info');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`系统托盘切换失败: ${error}`);
      setMessageType('error');
    } finally {
      setIsTrayLoading(false);
    }
  };

  const handleBrowseDataPath = async () => {
    try {
      const result = await open({
        directory: true,
        multiple: false,
        title: '选择 Antigravity 数据目录',
      });

      if (result && typeof result === 'string') {
        const valid = await AntigravityPathService.validatePath(result);

        if (valid) {
          // 立即保存有效路径
          await AntigravityPathService.savePath(result);
          setDataPath(result);
          setMessage('数据库路径已更新');
          setMessageType('success');
          setTimeout(() => setMessage(''), 2000);
        } else {
          setMessage('无效的数据目录：未找到 state.vscdb 文件');
          setMessageType('warning');
        }
      }
    } catch (error) {
      setMessage(`选择失败: ${error}`);
      setMessageType('error');
    }
  };

  const handleBrowseExecPath = async () => {
    try {
      const result = await open({
        directory: false,
        multiple: false,
        title: '选择 Antigravity 可执行文件',
        filters: [
          { name: '可执行文件', extensions: ['exe', 'app', ''] },
          { name: '所有文件', extensions: ['*'] }
        ]
      });

      if (result && typeof result === 'string') {
        const valid = await AntigravityPathService.validateExecutable(result);

        if (valid) {
          // 立即保存有效路径
          await AntigravityPathService.saveExecutable(result);
          setExecPath(result);
          setMessage('可执行文件路径已更新');
          setMessageType('success');
          setTimeout(() => setMessage(''), 2000);
        } else {
          setMessage('无效的可执行文件');
          setMessageType('warning');
        }
      }
    } catch (error) {
      setMessage(`选择失败: ${error}`);
      setMessageType('error');
    }
  };

  const handleClose = () => {
    // 重置状态
    setMessage('');
    onOpenChange(false);
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getMessageColorClasses = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  return (
    <BaseDialog open={isOpen} onOpenChange={onOpenChange}>
      <BaseDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <BaseDialogHeader className="px-6 pt-6 pb-2">
          <BaseDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-antigravity-blue" />
            设置
          </BaseDialogTitle>
        </BaseDialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <BaseSpinner size="lg" />
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">正在加载设置...</p>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-5">
            {/* 消息提示区域 */}
            {message && (
              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getMessageColorClasses()}`}>
                {getMessageIcon()}
                <p className="font-medium text-sm">{message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 数据库路径设置卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Database className="h-5 w-5 text-antigravity-blue dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">数据库路径</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">当前路径</div>
                    <div className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                      {dataPath}
                    </div>
                  </div>

                  <BaseButton
                    variant="outline"
                    onClick={handleBrowseDataPath}
                    className="w-full justify-center gap-2 h-9"
                    leftIcon={<FolderOpen className="h-4 w-4" />}
                  >
                    选择数据库路径
                  </BaseButton>
                </div>
              </div>

              {/* 可执行文件路径设置卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">可执行文件</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">当前路径</div>
                    <div className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                      {execPath}
                    </div>
                  </div>

                  <BaseButton
                    variant="outline"
                    onClick={handleBrowseExecPath}
                    className="w-full justify-center gap-2 h-9"
                    leftIcon={<FileCode className="h-4 w-4" />}
                  >
                    选择可执行文件
                  </BaseButton>
                </div>
              </div>
            </div>

            {/* 数据库监控设置 - 全宽卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">智能监控</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">自动监控数据库变化</span>
                  {isDbMonitoringEnabled ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-xs font-medium">已启用</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                      <span className="text-xs font-medium">已禁用</span>
                    </div>
                  )}
                </div>

                {isSettingsLoading ? (
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                    <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-antigravity-blue"></div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDbMonitoringToggle(!isDbMonitoringEnabled)}
                    disabled={isSettingsLoading}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-antigravity-blue focus:ring-offset-2 ${
                      isDbMonitoringEnabled ? 'bg-antigravity-blue shadow-lg shadow-antigravity-blue/30' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 ${
                        isDbMonitoringEnabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* 系统托盘设置 - 全宽卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Monitor className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">系统托盘</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">最小化到托盘</span>
                  {isSystemTrayEnabled ? (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
                      </div>
                      <span className="text-xs font-medium">已启用</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                      <span className="text-xs font-medium">已禁用</span>
                    </div>
                  )}
                </div>

                {isTrayLoading ? (
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                    <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-amber-600"></div>
                  </div>
                ) : (
                  <button
                    onClick={handleSystemTrayToggle}
                    disabled={isTrayLoading}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      isSystemTrayEnabled ? 'bg-amber-600 shadow-lg shadow-amber-600/30' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 ${
                        isSystemTrayEnabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </BaseDialogContent>
    </BaseDialog>
  );
};

export default BusinessSettingsDialog;
