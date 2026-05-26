import 'package:intl/intl.dart';

/// ============================================================
/// Date Formatting Utilities
/// ============================================================

class DateFormatter {
  DateFormatter._();

  /// Format to "20 Apr 2025"
  static String format(DateTime? date) {
    if (date == null) return '-';
    return DateFormat('dd MMM yyyy').format(date);
  }

  /// Format to "20 Apr 2025, 02:30 PM"
  static String formatWithTime(DateTime? date) {
    if (date == null) return '-';
    return DateFormat('dd MMM yyyy, hh:mm a').format(date);
  }

  /// Format to "2025-04-20" (API format)
  static String formatApi(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  /// Relative time (e.g., "2 hours ago", "3 days ago")
  static String timeAgo(DateTime? date) {
    if (date == null) return '-';
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inSeconds < 60) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    if (diff.inDays < 30) return '${(diff.inDays / 7).floor()}w ago';
    if (diff.inDays < 365) return '${(diff.inDays / 30).floor()}mo ago';
    return '${(diff.inDays / 365).floor()}y ago';
  }

  /// Days remaining until a date
  static String daysRemaining(DateTime? date) {
    if (date == null) return '-';
    final diff = date.difference(DateTime.now()).inDays;
    if (diff <= 0) return 'Expired';
    if (diff == 1) return '1 day left';
    return '$diff days left';
  }

  /// Duration display (e.g., "30 Days")
  static String durationDays(int days) {
    if (days == 1) return '1 Day';
    return '$days Days';
  }
}
