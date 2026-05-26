
import 'bill_model.dart';
import 'notification_model.dart';

/// ============================================================
/// Dashboard Model — Aggregated dashboard data
/// ============================================================

class DashboardModel {
  final DashboardUser user;
  final DashboardPackage? currentPackage;
  final DashboardUsage usage;
  final DashboardBills activeBills;
  final List<NotificationModel> recentNotifications;

  const DashboardModel({
    required this.user,
    this.currentPackage,
    required this.usage,
    required this.activeBills,
    this.recentNotifications = const [],
  });

  factory DashboardModel.fromJson(Map<String, dynamic> json) {
    return DashboardModel(
      user: DashboardUser.fromJson(json['user'] ?? {}),
      currentPackage: json['currentPackage'] != null
          ? DashboardPackage.fromJson(json['currentPackage'])
          : null,
      usage: DashboardUsage.fromJson(json['usage'] ?? {}),
      activeBills: DashboardBills.fromJson(json['activeBills'] ?? {}),
      recentNotifications: (json['recentNotifications'] as List?)
              ?.map((n) => NotificationModel.fromJson(n))
              .toList() ??
          [],
    );
  }
}

/// ── Dashboard User ──
class DashboardUser {
  final String id;
  final String userId;
  final String name;
  final String email;

  const DashboardUser({
    required this.id,
    required this.userId,
    required this.name,
    required this.email,
  });

  factory DashboardUser.fromJson(Map<String, dynamic> json) {
    return DashboardUser(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
    );
  }
}

/// ── Dashboard Package ──
class DashboardPackage {
  final String id;
  final String name;
  final int mbLimit;
  final DateTime startDate;
  final DateTime expiryDate;
  final int daysRemaining;

  const DashboardPackage({
    required this.id,
    required this.name,
    required this.mbLimit,
    required this.startDate,
    required this.expiryDate,
    required this.daysRemaining,
  });

  factory DashboardPackage.fromJson(Map<String, dynamic> json) {
    return DashboardPackage(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      mbLimit: json['mb_limit'] ?? 0,
      startDate: json['start_date'] != null
          ? DateTime.parse(json['start_date'])
          : DateTime.now(),
      expiryDate: json['expiry_date'] != null
          ? DateTime.parse(json['expiry_date'])
          : DateTime.now(),
      daysRemaining: json['days_remaining'] ?? 0,
    );
  }
}

/// ── Dashboard Usage ──
class DashboardUsage {
  final int totalMb;
  final int usedMb;
  final int remainingMb;
  final double percentageUsed;
  final String? resetDate;

  const DashboardUsage({
    this.totalMb = 0,
    this.usedMb = 0,
    this.remainingMb = 0,
    this.percentageUsed = 0,
    this.resetDate,
  });

  factory DashboardUsage.fromJson(Map<String, dynamic> json) {
    return DashboardUsage(
      totalMb: json['total_mb'] ?? 0,
      usedMb: json['used_mb'] ?? 0,
      remainingMb: json['remaining_mb'] ?? 0,
      percentageUsed: (json['percentage_used'] ?? 0).toDouble(),
      resetDate: json['reset_date'],
    );
  }
}

/// ── Dashboard Bills ──
class DashboardBills {
  final double total;
  final int count;
  final List<BillModel> bills;

  const DashboardBills({
    this.total = 0,
    this.count = 0,
    this.bills = const [],
  });

  bool get isEmpty => bills.isEmpty;
  bool get isNotEmpty => bills.isNotEmpty;

  factory DashboardBills.fromJson(Map<String, dynamic> json) {
    return DashboardBills(
      total: (json['total'] ?? 0).toDouble(),
      count: json['count'] ?? 0,
      bills: (json['bills'] as List?)
              ?.map((b) => BillModel.fromJson(b))
              .toList() ??
          [],
    );
  }
}
