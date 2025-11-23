import React, { useState, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { AntigravityPathService } from '../services/antigravity-path-service';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const [dataPath, setDataPath] = useState<string>('');
    const [execPath, setExecPath] = useState<string>('');
    const [newDataPath, setNewDataPath] = useState<string>('');
    const [newExecPath, setNewExecPath] = useState<string>('');
    const [isDataPathValid, setIsDataPathValid] = useState(false);
    const [isExecPathValid, setIsExecPathValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            loadCurrentPaths();
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
            setNewDataPath('');
            setNewExecPath('');
        } catch (error) {
            console.error('加载路径失败:', error);
            setDataPath('加载失败');
            setExecPath('加载失败');
        } finally {
            setIsLoading(false);
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
                setNewDataPath(result);
                const valid = await AntigravityPathService.validatePath(result);
                setIsDataPathValid(valid);
                if (!valid) {
                    setMessage('⚠️ 无效的数据目录：未找到 state.vscdb 文件');
                } else {
                    setMessage('');
                }
            }
        } catch (error) {
            setMessage(`选择失败: ${error}`);
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
                setNewExecPath(result);
                const valid = await AntigravityPathService.validateExecutable(result);
                setIsExecPathValid(valid);
                if (!valid) {
                    setMessage('⚠️ 无效的可执行文件');
                } else {
                    setMessage('');
                }
            }
        } catch (error) {
            setMessage(`选择失败: ${error}`);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');

        try {
            // 保存数据路径
            if (newDataPath && isDataPathValid) {
                await AntigravityPathService.savePath(newDataPath);
                setDataPath(newDataPath);
            }

            // 保存可执行文件路径
            if (newExecPath && isExecPathValid) {
                await AntigravityPathService.saveExecutable(newExecPath);
                setExecPath(newExecPath);
            }

            setMessage('✅ 设置已保存');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            setMessage(`❌ 保存失败: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const hasChanges = (newDataPath && isDataPathValid) || (newExecPath && isExecPathValid);

    return (
        <div className="DialogOverlay">
            <div className="DialogContent" style={{ maxWidth: '600px' }}>
                <div className="DialogTitle">设置</div>

                {isLoading ? (
                    <div className="text-center py-8">加载中...</div>
                ) : (
                    <>
                        {/* 数据库路径 */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-white mb-2">
                                数据库路径
                            </h3>
                            <div className="text-xs bg-gray-700 p-3 rounded mb-2 break-all">
                                {dataPath}
                            </div>
                            <button
                                onClick={handleBrowseDataPath}
                                disabled={isSaving}
                                className="Button Button--secondary w-full"
                            >
                                修改数据库路径
                            </button>
                            {newDataPath && (
                                <div className="mt-2 text-xs bg-gray-800 p-2 rounded">
                                    <div className="text-gray-400 mb-1">新路径：</div>
                                    <div className="break-all">{newDataPath}</div>
                                    {isDataPathValid && (
                                        <div className="text-green-400 mt-1">✅ 有效</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 可执行文件路径 */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-white mb-2">
                                可执行文件路径
                            </h3>
                            <div className="text-xs bg-gray-700 p-3 rounded mb-2 break-all">
                                {execPath}
                            </div>
                            <button
                                onClick={handleBrowseExecPath}
                                disabled={isSaving}
                                className="Button Button--secondary w-full"
                            >
                                修改可执行文件路径
                            </button>
                            {newExecPath && (
                                <div className="mt-2 text-xs bg-gray-800 p-2 rounded">
                                    <div className="text-gray-400 mb-1">新路径：</div>
                                    <div className="break-all">{newExecPath}</div>
                                    {isExecPathValid && (
                                        <div className="text-green-400 mt-1">✅ 有效</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {message && (
                            <div className="mb-4 p-2 bg-gray-800 border border-gray-600 rounded">
                                <p className="text-sm">{message}</p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                disabled={isSaving}
                                className="Button Button--secondary flex-1"
                            >
                                关闭
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className="Button bg-blue-600 hover:bg-blue-700 text-white flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? '保存中...' : '保存'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SettingsDialog;
