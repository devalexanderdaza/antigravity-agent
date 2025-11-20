import React from 'react';
import { X, Download, RotateCw, AlertTriangle } from 'lucide-react';
import { UpdateState, UpdateInfo, DownloadProgress } from '../services/updateService';

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    state: UpdateState;
    updateInfo: UpdateInfo | null;
    progress: DownloadProgress | null;
    error: string | null;
    onDownload: () => void;
    onInstall: () => void;
    onDismiss: () => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({
    isOpen,
    onClose,
    state,
    updateInfo,
    progress,
    error,
    onDownload,
    onInstall,
    onDismiss,
}) => {
    if (!isOpen) return null;

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const renderContent = () => {
        if (error) {
            return (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                                更新失败
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {error}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            关闭
                        </button>
                    </div>
                </div>
            );
        }

        if (state === 'update-available' && updateInfo) {
            return (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">当前版本:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                v{updateInfo.currentVersion}
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">最新版本:</span>
                            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                v{updateInfo.version}
                            </span>
                        </div>
                    </div>

                    {updateInfo.body && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                更新内容:
                            </h4>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                                    {updateInfo.body}
                                </pre>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onDismiss}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            忽略此版本
                        </button>
                        <button
                            onClick={onDownload}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            立即更新
                        </button>
                    </div>
                </div>
            );
        }

        if (state === 'downloading' && progress) {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">下载进度</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {progress.percentage}%
                            </span>
                        </div>

                        {/* 进度条 */}
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatFileSize(progress.downloaded)}</span>
                            <span>{formatFileSize(progress.total)}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        正在下载更新包，请稍候...
                    </p>
                </div>
            );
        }

        if (state === 'ready-to-install') {
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                                <Download className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
                                更新已下载完成
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                点击"立即重启"将安装新版本
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            稍后重启
                        </button>
                        <button
                            onClick={onInstall}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RotateCw className="w-4 h-4" />
                            立即重启
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            {/* 遮罩层 */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* 对话框 */}
            <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 p-6">
                {/* 标题栏 */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-500" />
                        应用更新
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* 内容区域 */}
                {renderContent()}
            </div>
        </>
    );
};

export default UpdateDialog;
