import 'package:intl/intl.dart';

/// ============================================================
/// Currency Formatting Utilities (PKR)
/// ============================================================

class CurrencyFormatter {
  CurrencyFormatter._();

  static final _formatter = NumberFormat('#,##0.00', 'en_PK');
  static final _formatterNoDecimal = NumberFormat('#,##0', 'en_PK');

  /// Format to "Rs. 1,500.00"
  static String format(double amount) {
    return 'Rs. ${_formatter.format(amount)}';
  }

  /// Format without decimals: "Rs. 1,500"
  static String formatShort(double amount) {
    return 'Rs. ${_formatterNoDecimal.format(amount)}';
  }

  /// Format compact: "1.5K" / "1.8M"
  static String formatCompact(double amount) {
    if (amount >= 1000000) {
      return '${(amount / 1000000).toStringAsFixed(1)}M PKR';
    }
    if (amount >= 1000) {
      return '${(amount / 1000).toStringAsFixed(1)}K PKR';
    }
    return '${amount.toStringAsFixed(0)} PKR';
  }

  /// Format just the number (no currency symbol)
  static String formatNumber(double amount) {
    return _formatter.format(amount);
  }
}
