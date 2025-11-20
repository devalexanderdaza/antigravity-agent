import { check, Update, DownloadEvent } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export interface UpdateInfo {
    version: string;
    currentVersion: string;
    date: string;
    body: string;
}

export type UpdateState =
    | 'no-update'
    | 'update-available'
    | 'downloading'
    | 'ready-to-install'
    | 'error';

export interface DownloadProgress {
    downloaded: number;
    total: number;
    percentage: number;
}

class UpdateService {
    private pendingUpdate: Update | null = null;

    /**
     * 检查是否有可用更新
     */
    async checkForUpdates(): Promise<UpdateInfo | null> {
        try {
            const update = await check();

            if (update === null) {
                console.log('没有可用更新');
                return null;
            }

            this.pendingUpdate = update;

            return {
                version: update.version,
                currentVersion: update.currentVersion,
                date: update.date,
                body: update.body || '暂无更新说明',
            };
        } catch (error) {
            console.error('检查更新失败:', error);
            throw new Error(`检查更新失败: ${error}`);
        }
    }

    /**
     * 下载更新包
     * @param onProgress 进度回调
     */
    async downloadUpdate(
        onProgress: (progress: DownloadProgress) => void
    ): Promise<void> {
        if (!this.pendingUpdate) {
            throw new Error('没有待下载的更新');
        }

        let downloaded = 0;
        let total = 0;

        try {
            await this.pendingUpdate.download((event: DownloadEvent) => {
                switch (event.event) {
                    case 'Started':
                        total = event.data.contentLength || 0;
                        console.log(`开始下载，总大小: ${total} 字节`);
                        onProgress({ downloaded: 0, total, percentage: 0 });
                        break;

                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        const percentage = total > 0 ? Math.round((downloaded / total) * 100) : 0;
                        console.log(`下载进度: ${downloaded}/${total} (${percentage}%)`);
                        onProgress({ downloaded, total, percentage });
                        break;

                    case 'Finished':
                        console.log('下载完成');
                        onProgress({ downloaded: total, total, percentage: 100 });
                        break;
                }
            });
        } catch (error) {
            console.error('下载更新失败:', error);
            throw new Error(`下载更新失败: ${error}`);
        }
    }

    /**
     * 安装更新并重启应用
     */
    async installAndRelaunch(): Promise<void> {
        if (!this.pendingUpdate) {
            throw new Error('没有待安装的更新');
        }

        try {
            console.log('开始安装更新...');
            await this.pendingUpdate.install();

            console.log('安装完成，准备重启...');
            // 等待一小段时间确保安装完成
            await new Promise(resolve => setTimeout(resolve, 500));

            // 重启应用
            await relaunch();
        } catch (error) {
            console.error('安装更新失败:', error);
            throw new Error(`安装更新失败: ${error}`);
        }
    }

    /**
     * 清除待处理的更新
     */
    clearPendingUpdate(): void {
        this.pendingUpdate = null;
    }
}

export const updateService = new UpdateService();
