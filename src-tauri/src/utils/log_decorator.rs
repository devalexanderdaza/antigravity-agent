//! 日志装饰器工具
//! 使用 tracing 提供命令执行的自动日志记录功能，包含智能脱敏

/// 替代原来的 log_async_command! 宏（带脱敏）
/// 使用简洁的实现来避免类型推断问题
#[macro_export]
macro_rules! log_async_command {
    ($command_name:expr, $future:expr) => {{
        let start_time = std::time::Instant::now();
        tracing::info!("🔧 开始执行命令: {}", $command_name);

        // 直接处理future，避免类型推断问题
        let (result, duration) = match $future.await {
            Ok(r) => (Ok(r), start_time.elapsed()),
            Err(e) => {
                let duration = start_time.elapsed();
                // 简化错误处理，避免字符串操作的类型推断
                let error_msg = format!("命令执行失败");
                tracing::error!(
                    "❌ 命令失败: {} (耗时: {:?}) - 错误: {}",
                    $command_name,
                    duration,
                    error_msg
                );
                (Err(e), duration)
            }
        };

        if result.is_ok() {
            tracing::info!("✅ 命令完成: {} (耗时: {:?})", $command_name, duration);
        }

        result
    }};
}

/// 带用户上下文的日志记录（带脱敏）
#[macro_export]
macro_rules! log_user_command {
    ($command_name:expr, $user_email:expr, $future:expr) => {{
        let start_time = std::time::Instant::now();
        let sanitizer = $crate::utils::log_sanitizer::LogSanitizer::new();
        let masked_email = sanitizer.sanitize_email($user_email);
        tracing::info!("🔧 用户操作: {} | 用户: {}", $command_name, masked_email);

        match $future.await {
            Ok(result) => {
                let duration = start_time.elapsed();
                tracing::info!("✅ 用户操作完成: {} (耗时: {:?})", $command_name, duration);
                Ok(result)
            }
            Err(e) => {
                let duration = start_time.elapsed();
                let error_msg = format!("用户操作失败");
                tracing::error!(
                    "❌ 用户操作失败: {} (耗时: {:?}) - 错误: {}",
                    $command_name,
                    duration,
                    error_msg
                );
                Err(e)
            }
        }
    }};
}

