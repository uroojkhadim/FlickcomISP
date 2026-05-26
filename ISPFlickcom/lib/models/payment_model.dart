// ============================================================
// Payment Model
// ============================================================

class PaymentModel {
  final String id;
  final String userId;
  final String packageId;
  final double amountPkr;
  final String paymentMethod; // 'jazzcash' | 'easypaisa' | 'bank'
  final String? transactionId;
  final String? gatewayReference;
  final Map<String, dynamic>? gatewayResponse;
  final String status; // 'pending' | 'success' | 'failed' | 'cancelled'
  final String? statusReason;
  final String? customerPhone;
  final String? customerEmail;
  final String? packageName; // Joined field
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? completedAt;

  const PaymentModel({
    required this.id,
    required this.userId,
    required this.packageId,
    required this.amountPkr,
    required this.paymentMethod,
    this.transactionId,
    this.gatewayReference,
    this.gatewayResponse,
    this.status = 'pending',
    this.statusReason,
    this.customerPhone,
    this.customerEmail,
    this.packageName,
    this.createdAt,
    this.updatedAt,
    this.completedAt,
  });

  bool get isSuccess => status == 'success';
  bool get isPending => status == 'pending';
  bool get isFailed => status == 'failed';

  /// Payment method display name
  String get methodDisplay {
    switch (paymentMethod) {
      case 'jazzcash':
        return 'JazzCash';
      case 'easypaisa':
        return 'EasyPaisa';
      case 'bank':
        return 'Bank Transfer';
      default:
        return paymentMethod;
    }
  }

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      packageId: json['package_id'] ?? '',
      amountPkr: (json['amount_pkr'] ?? json['amount'] ?? 0).toDouble(),
      paymentMethod: json['payment_method'] ?? json['method'] ?? '',
      transactionId: json['transaction_id'],
      gatewayReference: json['gateway_reference'],
      gatewayResponse: json['gateway_response'],
      status: json['status'] ?? 'pending',
      statusReason: json['status_reason'],
      customerPhone: json['customer_phone'],
      customerEmail: json['customer_email'],
      packageName: json['package'] ?? json['package_name'],
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
      completedAt: json['completed_at'] != null
          ? DateTime.tryParse(json['completed_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'package_id': packageId,
      'amount_pkr': amountPkr,
      'payment_method': paymentMethod,
      'transaction_id': transactionId,
      'status': status,
    };
  }
}
