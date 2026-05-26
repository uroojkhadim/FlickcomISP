import 'package:flutter/material.dart';
import '../config/theme.dart';

/// ============================================================
/// NotificationBanner — Top alert banners (success, warning, error, info)
/// ============================================================

enum BannerType { success, warning, error, info }

class NotificationBanner extends StatelessWidget {
  final String message;
  final BannerType type;
  final VoidCallback? onDismiss;
  final VoidCallback? onAction;
  final String? actionLabel;

  const NotificationBanner({
    super.key,
    required this.message,
    this.type = BannerType.info,
    this.onDismiss,
    this.onAction,
    this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: _backgroundColor,
        border: Border.all(color: _borderColor, width: 1),
        borderRadius: AppRadius.borderLg,
      ),
      child: Row(
        children: [
          // ── Icon ──
          Icon(_icon, color: _iconColor, size: 22),
          const SizedBox(width: 12),

          // ── Message ──
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                color: _textColor,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),

          // ── Action ──
          if (actionLabel != null && onAction != null) ...[
            const SizedBox(width: 8),
            TextButton(
              onPressed: onAction,
              style: TextButton.styleFrom(
                foregroundColor: _iconColor,
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                minimumSize: Size.zero,
                textStyle: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
              child: Text(actionLabel!),
            ),
          ],

          // ── Dismiss ──
          if (onDismiss != null) ...[
            const SizedBox(width: 4),
            GestureDetector(
              onTap: onDismiss,
              child: Icon(
                Icons.close_rounded,
                size: 18,
                color: _iconColor.withValues(alpha: 0.6),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Color get _backgroundColor {
    switch (type) {
      case BannerType.success:
        return const Color(0xFFE8F5E9);
      case BannerType.warning:
        return const Color(0xFFFFF3E0);
      case BannerType.error:
        return const Color(0xFFFFEBEE);
      case BannerType.info:
        return const Color(0xFFE3F2FD);
    }
  }

  Color get _borderColor {
    switch (type) {
      case BannerType.success:
        return AppColors.accentGreen.withValues(alpha: 0.3);
      case BannerType.warning:
        return AppColors.accentOrange.withValues(alpha: 0.3);
      case BannerType.error:
        return AppColors.accentRed.withValues(alpha: 0.3);
      case BannerType.info:
        return AppColors.primary500.withValues(alpha: 0.3);
    }
  }

  Color get _iconColor {
    switch (type) {
      case BannerType.success:
        return AppColors.accentGreen;
      case BannerType.warning:
        return AppColors.accentOrange;
      case BannerType.error:
        return AppColors.accentRed;
      case BannerType.info:
        return AppColors.primary500;
    }
  }

  Color get _textColor {
    switch (type) {
      case BannerType.success:
        return const Color(0xFF1B5E20);
      case BannerType.warning:
        return const Color(0xFFE65100);
      case BannerType.error:
        return const Color(0xFFB71C1C);
      case BannerType.info:
        return const Color(0xFF0D47A1);
    }
  }

  IconData get _icon {
    switch (type) {
      case BannerType.success:
        return Icons.check_circle_rounded;
      case BannerType.warning:
        return Icons.warning_rounded;
      case BannerType.error:
        return Icons.error_rounded;
      case BannerType.info:
        return Icons.info_rounded;
    }
  }
}

/// Show a snackbar-style banner
void showAppBanner(
  BuildContext context, {
  required String message,
  BannerType type = BannerType.info,
  Duration duration = const Duration(seconds: 4),
}) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: NotificationBanner(message: message, type: type),
      backgroundColor: Colors.transparent,
      elevation: 0,
      behavior: SnackBarBehavior.floating,
      duration: duration,
      padding: EdgeInsets.zero,
    ),
  );
}
