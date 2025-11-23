use crate::path_utils::AppPaths;
use std::path::PathBuf;

/// 获取Antigravity应用数据目录（跨平台）
pub fn get_antigravity_data_dir() -> Option<PathBuf> {
    AppPaths::antigravity_data_dir()
}

/// 获取Antigravity状态数据库文件路径
/// 优先使用用户自定义路径，其次使用自动检测的路径
pub fn get_antigravity_db_path() -> Option<PathBuf> {
    // 1. 尝试从配置文件读取用户自定义路径
    if let Ok(Some(custom_path)) = crate::antigravity_path_config::get_custom_data_path() {
        let db_path = PathBuf::from(&custom_path).join("state.vscdb");
        if db_path.exists() && db_path.is_file() {
            tracing::info!("📍 使用自定义 Antigravity 数据路径: {}", custom_path);
            return Some(db_path);
        } else {
            tracing::warn!("⚠️ 自定义数据路径无效，回退到自动检测: {}", custom_path);
        }
    }
    
    // 2. 回退到自动检测路径
    get_antigravity_data_dir().map(|dir| dir.join("state.vscdb"))
}


/// 检查Antigravity是否安装并运行
pub fn is_antigravity_available() -> bool {
    get_antigravity_db_path()
        .map(|path| path.exists())
        .unwrap_or(false)
}

/// 搜索可能的Antigravity安装位置
pub fn find_antigravity_installations() -> Vec<PathBuf> {
    let mut possible_paths = Vec::new();

    // 用户数据目录
    if let Some(user_data) = dirs::data_dir() {
        possible_paths.push(user_data.join("Antigravity"));
    }

    // 配置目录
    if let Some(config_dir) = dirs::config_dir() {
        possible_paths.push(config_dir.join("Antigravity"));
    }

    possible_paths
}

/// 获取所有可能的Antigravity数据库路径
pub fn get_all_antigravity_db_paths() -> Vec<PathBuf> {
    let mut db_paths = Vec::new();

    // 主要路径
    if let Some(main_path) = get_antigravity_db_path() {
        db_paths.push(main_path);
    }

    // 搜索其他可能的位置
    for install_dir in find_antigravity_installations() {
        if install_dir.exists() {
            // 递归搜索state.vscdb文件
            if let Ok(entries) = std::fs::read_dir(&install_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_file() && path.file_name().is_some_and(|name| name == "state.vscdb")
                    {
                        db_paths.push(path);
                    }
                }
            }
        }
    }

    db_paths
}

/// 关闭Antigravity进程 - 使用sysinfo库实现跨平台统一处理
pub fn kill_antigravity_processes() -> Result<String, String> {
    tracing::info!("🔍 开始搜索并关闭 Antigravity 进程");

    // 使用sysinfo库获取所有进程
    let mut system = sysinfo::System::new_all();
    system.refresh_all();

    let mut killed_processes = Vec::new();

    // 定义需要关闭的进程模式（按优先级排序）
    let process_patterns = get_antigravity_process_patterns();

    for (pid, process) in system.processes() {
        let process_name = process.name();
        let process_cmd = process.cmd().join(" ");

        // 检查进程名或命令行是否匹配任何模式
        if matches_antigravity_process(process_name, &process_cmd, &process_patterns) {
            tracing::info!("🎯 找到目标进程: {} (PID: {})", process_name, pid);
            tracing::info!("📝 命令行: {}", process_cmd);

            // 尝试终止进程
            if process.kill() {
                killed_processes.push(format!("{} (PID: {})", process_name, pid));
                tracing::info!("✅ 成功终止进程: {} (PID: {})", process_name, pid);
            } else {
                tracing::warn!("⚠️ 终止进程失败: {} (PID: {})", process_name, pid);

                // 尝试多次终止（如果第一次失败）
                if process.kill() {
                    killed_processes.push(format!("{} (PID: {} - 强制)", process_name, pid));
                    tracing::info!("✅ 强制终止进程: {} (PID: {})", process_name, pid);
                } else {
                    tracing::error!("❌ 强制终止也失败: {} (PID: {})", process_name, pid);
                }
            }
        }
    }

    if killed_processes.is_empty() {
        tracing::info!("ℹ️ 未找到匹配的 Antigravity 进程");
        tracing::info!("🔍 搜索的进程模式: {:?}", process_patterns);
        Err("未找到Antigravity进程".to_string())
    } else {
        let success_msg = format!("已成功关闭Antigravity进程: {}", killed_processes.join(", "));
        tracing::info!("🎉 {}", success_msg);
        Ok(success_msg)
    }
}

/// 检查 Antigravity 进程是否正在运行（使用 sysinfo）
pub fn is_antigravity_running() -> bool {
    tracing::info!("🔍 检查 Antigravity 进程是否运行");

    let mut system = sysinfo::System::new_all();
    system.refresh_all();

    let process_patterns = get_antigravity_process_patterns();

    for (pid, process) in system.processes() {
        let process_name = process.name();
        let process_cmd = process.cmd().join(" ");

        if matches_antigravity_process(process_name, &process_cmd, &process_patterns) {
            tracing::info!("✅ 发现运行中的 Antigravity 进程: {} (PID: {})", process_name, pid);
            return true;
        }
    }

    tracing::info!("ℹ️ 未发现运行中的 Antigravity 进程");
    false
}

/// 获取 Antigravity 进程匹配模式
fn get_antigravity_process_patterns() -> Vec<ProcessPattern> {
    match std::env::consts::OS {
        "macos" => {
            vec![
                // 主要进程模式
                ProcessPattern::ExactName("Antigravity"),
                ProcessPattern::ExactName("Antigravity.app"),
                ProcessPattern::ExactName("Electron"), // 如果Electron进程包含Antigravity路径

                // macOS Electron 特有的进程名
                ProcessPattern::Contains("Antigravity"),
                ProcessPattern::Contains("Antigravity Helper"),
                ProcessPattern::EndsWith("(Renderer)"),
                ProcessPattern::EndsWith("(GPU)"),

                // 命令行匹配
                ProcessPattern::CmdContains("Antigravity.app"),
                ProcessPattern::CmdContains("/Applications/Antigravity"),
                ProcessPattern::CmdContains("Applications/Antigravity"),

                // .app 包路径匹配
                ProcessPattern::CmdEndsWith(".app/Contents/MacOS/Electron"),
                ProcessPattern::CmdEndsWith(".app/Contents/MacOS/Antigravity"),
            ]
        }
        "windows" => {
            vec![
                ProcessPattern::ExactName("Antigravity.exe"),
                ProcessPattern::ExactName("Antigravity"),
                ProcessPattern::Contains("Antigravity"),
                ProcessPattern::CmdContains("Antigravity.exe"),
            ]
        }
        "linux" => {
            vec![
                ProcessPattern::ExactName("antigravity"),
                ProcessPattern::ExactName("Antigravity"),
                ProcessPattern::Contains("Antigravity"),
                ProcessPattern::CmdContains("antigravity"),
                ProcessPattern::CmdContains("Antigravity.AppImage"),
            ]
        }
        _ => {
            vec![
                ProcessPattern::Contains("Antigravity"),
                ProcessPattern::Contains("antigravity"),
            ]
        }
    }
}

/// 检查进程是否匹配 Antigravity 模式
fn matches_antigravity_process(process_name: &str, process_cmd: &str, patterns: &[ProcessPattern]) -> bool {
    for pattern in patterns {
        match pattern {
            ProcessPattern::ExactName(name) => {
                if process_name == *name {
                    tracing::debug!("✅ 精确匹配进程名: {}", name);
                    return true;
                }
            }
            ProcessPattern::Contains(text) => {
                if process_name.contains(text) || process_cmd.contains(text) {
                    tracing::debug!("✅ 包含匹配: {}", text);
                    return true;
                }
            }
            ProcessPattern::EndsWith(suffix) => {
                if process_name.ends_with(suffix) || process_cmd.ends_with(suffix) {
                    tracing::debug!("✅ 后缀匹配: {}", suffix);
                    return true;
                }
            }
            ProcessPattern::CmdContains(text) => {
                if process_cmd.contains(text) {
                    tracing::debug!("✅ 命令行包含匹配: {}", text);
                    return true;
                }
            }
            ProcessPattern::CmdEndsWith(suffix) => {
                if process_cmd.ends_with(suffix) {
                    tracing::debug!("✅ 命令行后缀匹配: {}", suffix);
                    return true;
                }
            }
        }
    }
    false
}

/// 进程匹配模式
#[derive(Debug, Clone)]
pub enum ProcessPattern {
    ExactName(&'static str),    // 精确匹配进程名
    Contains(&'static str),      // 包含指定文本
    EndsWith(&'static str),      // 以指定文本结尾
    CmdContains(&'static str),   // 命令行包含指定文本
    CmdEndsWith(&'static str),   // 命令行以指定文本结尾
}

/// 获取 Antigravity 进程匹配模式（用于调试）
pub fn get_antigravity_process_patterns_for_debug() -> Vec<ProcessPattern> {
    get_antigravity_process_patterns()
}

/// 检查进程是否匹配 Antigravity 模式（用于调试）
pub fn matches_antigravity_process_for_debug(
    process_name: &str,
    process_cmd: &str,
    pattern: &ProcessPattern
) -> bool {
    matches_antigravity_process(process_name, process_cmd, &[pattern.clone()])
}
