//! 窗口状态管理命令
//! 负责窗口位置、大小、状态等信息的保存和加载

use crate::window_state_manager::{WindowState, load_window_state as load_ws, save_window_state as save_ws};

/// 保存窗口状态
#[tauri::command]
async fn save_window_state(
    x: f64,
    y: f64,
    width: f64,
    height: f64,
    maximized: bool,
) -> Result<(), String> {
    let window_state = WindowState {
        x,
        y,
        width,
        height,
        maximized,
        system_tray_enabled: true, // 使用默认值，因为系统托盘状态有专门的持久化机制
    };

    // 使用带防抖的窗口状态管理器
    save_ws(window_state).await
}

/// 加载窗口状态
#[tauri::command]
async fn load_window_state() -> Result<WindowState, String> {
    // 使用窗口状态管理器加载状态
    load_ws().await
}
