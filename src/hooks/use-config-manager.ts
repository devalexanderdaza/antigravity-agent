import { useState, useCallback, useEffect } from 'react';
import { ConfigManager } from '../services/config-export-manager';
import { AntigravityService } from '../services/antigravity-service';

interface ConfigLoadingState {
    isImporting: boolean;
    isExporting: boolean;
}

interface UseConfigManagerResult {
    configLoadingState: ConfigLoadingState;
    hasUserData: boolean;
    isCheckingData: boolean;
    importConfig: () => Promise<void>;
    exportConfig: () => Promise<void>;
}

interface PasswordDialogConfig {
    title: string;
    description?: string;
    requireConfirmation?: boolean;
    onSubmit: (password: string) => void;
    validatePassword?: (password: string) => { isValid: boolean; message?: string };
}

/**
 * 配置管理 Hook
 * 负责配置文件的导入、导出和用户数据检查
 */
export function useConfigManager(
    showStatus: (message: string, isError?: boolean) => void,
    showPasswordDialog: (config: PasswordDialogConfig) => void,
    closePasswordDialog: () => void,
    onRefresh: () => void,
    isRefreshing?: boolean
): UseConfigManagerResult {
    const [configLoadingState, setConfigLoadingState] = useState<ConfigLoadingState>({
        isImporting: false,
        isExporting: false
    });

    const [hasUserData, setHasUserData] = useState<boolean>(false);
    const [isCheckingData, setIsCheckingData] = useState<boolean>(false);

    // 配置管理器实例
    const [configManager] = useState(() => new ConfigManager());

    /**
     * 检查是否有用户数据可以导出
     */
    const checkUserData = useCallback(async () => {
        try {
            setIsCheckingData(true);
            const backupList = await AntigravityService.getBackupList();
            setHasUserData(backupList.length > 0);
        } catch (error) {
            console.error('检查用户数据失败:', error);
            setHasUserData(false);
        } finally {
            setIsCheckingData(false);
        }
    }, []);

    // 组件挂载时检查用户数据
    useEffect(() => {
        checkUserData();
    }, [checkUserData]);

    // 当刷新操作完成后，重新检查用户数据
    useEffect(() => {
        if (!isRefreshing) {
            const timer = setTimeout(() => {
                checkUserData();
            }, 500); // 延迟500ms确保刷新完成
            return () => clearTimeout(timer);
        }
    }, [isRefreshing, checkUserData]);

    /**
     * 导入配置文件
     */
    const importConfig = useCallback(async () => {
        console.log('🔍 [导入] 开始导入配置文件');
        try {
            const result = await configManager.importEncryptedConfig();
            console.log('📋 [导入] 文件选择结果:', result);

            if (!result.success) {
                console.log('❌ [导入] 文件选择失败:', result.message);
                showStatus(result.message, true);
                return;
            }

            // 使用密码对话框获取密码
            showPasswordDialog({
                title: '导入配置文件',
                description: '请输入配置文件的解密密码',
                requireConfirmation: false,
                validatePassword: (password) => configManager.validatePassword(password),
                onSubmit: async (password) => {
                    try {
                        closePasswordDialog();
                        setConfigLoadingState(prev => ({ ...prev, isImporting: true }));
                        showStatus('正在解密配置文件...');

                        const decryptResult = await configManager.decryptConfigData(result.encryptedData!, password);

                        if (decryptResult.success && decryptResult.configData) {
                            const configData = decryptResult.configData;
                            showStatus(`配置文件导入成功 (版本: ${configData.version})`);
                            console.log('导入的配置:', configData);

                            // 延迟刷新以确保数据完整性
                            setTimeout(() => {
                                onRefresh();
                            }, 500);
                        } else {
                            showStatus(decryptResult.message, true);
                        }

                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        showStatus(`导入配置文件失败: ${errorMessage}`, true);
                    } finally {
                        setConfigLoadingState(prev => ({ ...prev, isImporting: false }));
                    }
                }
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            showStatus(`选择文件失败: ${errorMessage}`, true);
        }
    }, [configManager, showStatus, onRefresh, showPasswordDialog, closePasswordDialog]);

    /**
     * 导出配置文件
     */
    const exportConfig = useCallback(async () => {
        // 检查是否有可导出的数据
        const hasData = await configManager.hasExportableData();
        if (!hasData) {
            showStatus('没有找到任何用户信息，无法导出配置文件', true);
            return;
        }

        // 使用密码对话框获取密码
        showPasswordDialog({
            title: '导出配置文件',
            description: '请设置导出密码，用于保护您的配置文件',
            requireConfirmation: true,
            validatePassword: (password) => configManager.validatePassword(password),
            onSubmit: async (password) => {
                try {
                    closePasswordDialog();
                    setConfigLoadingState(prev => ({ ...prev, isExporting: true }));
                    showStatus('正在生成加密配置文件...');

                    const exportResult = await configManager.exportEncryptedConfig(password);

                    if (exportResult.success) {
                        showStatus(`配置文件已保存: ${exportResult.filePath}`);
                    } else {
                        showStatus(exportResult.message, true);
                    }

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    showStatus(`导出配置文件失败: ${errorMessage}`, true);
                } finally {
                    setConfigLoadingState(prev => ({ ...prev, isExporting: false }));
                }
            }
        });
    }, [configManager, showStatus, showPasswordDialog, closePasswordDialog]);

    return {
        configLoadingState,
        hasUserData,
        isCheckingData,
        importConfig,
        exportConfig
    };
}
