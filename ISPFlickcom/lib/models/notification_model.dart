// ============================================================
// Notification Model
// ============================================================

class NotificationModel {
  final String id;
  final String userId;
  final String title;
  final String message;
  final String type;
  final String? relatedPaymentId;
  final String? relatedComplaintId;
  final String? relatedBillId;
  final bool isRead;
  final bool smsSent;
  final Map<String, dynamic>? notificationData;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const NotificationModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.message,
    required this.type,
    this.relatedPaymentId,
    this.relatedComplaintId,
    this.relatedBillId,
    this.isRead = false,
    this.smsSent = false,
    this.notificationData,
    this.createdAt,
    this.updatedAt,
  });

  /// Notification type → icon mapping
  String get typeIcon {
    switch (type) {
      case 'payment_successful':
        return '✅';
      case 'payment_failed':
        return '❌';
      case 'package_activated':
        return '📦';
      case 'package_expiring_soon':
        return '⏰';
      case 'package_expired':
        return '⛔';
      case 'complaint_resolved':
        return '🎉';
      case 'bill_generated':
        return '📄';
      case 'bill_overdue':
        return '⚠️';
      case 'system_alert':
        return '🔔';
      default:
        return '📬';
    }
  }

  /// Readable type name
  String get typeDisplay {
    switch (type) {
      case 'payment_successful':
        return 'Payment Successful';
      case 'payment_failed':
        return 'Payment Failed';
      case 'package_activated':
        return 'Package Activated';
      case 'package_expiring_soon':
        return 'Package Expiring Soon';
      case 'package_expired':
        return 'Package Expired';
      case 'complaint_resolved':
        return 'Complaint Resolved';
      case 'bill_generated':
        return 'Bill Generated';
      case 'bill_overdue':
        return 'Bill Overdue';
      case 'system_alert':
        return 'System Alert';
      default:
        return 'Notification';
    }
  }

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      type: json['type'] ?? 'system_alert',
      relatedPaymentId: json['related_payment_id'],
      relatedComplaintId: json['related_complaint_id'],
      relatedBillId: json['related_bill_id'],
      isRead: json['is_read'] ?? false,
      smsSent: json['sms_sent'] ?? false,
      notificationData: json['notification_data'],
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'is_read': isRead,
    };
  }

  NotificationModel copyWith({bool? isRead}) {
    return NotificationModel(
      id: id,
      userId: userId,
      title: title,
      message: message,
      type: type,
      relatedPaymentId: relatedPaymentId,
      relatedComplaintId: relatedComplaintId,
      relatedBillId: relatedBillId,
      isRead: isRead ?? this.isRead,
      smsSent: smsSent,
      notificationData: notificationData,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
