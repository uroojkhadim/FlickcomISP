// ============================================================
// Bill Model
// ============================================================

class BillModel {
  final String id;
  final String userId;
  final String billNumber;
  final String? packageId;
  final double amountPkr;
  final DateTime dueDate;
  final String status; // 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
  final double totalPaid;
  final double remainingAmount;
  final DateTime? billPeriodStart;
  final DateTime? billPeriodEnd;
  final DateTime? createdAt;
  final String? generatedBy;

  const BillModel({
    required this.id,
    required this.userId,
    required this.billNumber,
    this.packageId,
    required this.amountPkr,
    required this.dueDate,
    this.status = 'pending',
    this.totalPaid = 0,
    this.remainingAmount = 0,
    this.billPeriodStart,
    this.billPeriodEnd,
    this.createdAt,
    this.generatedBy,
  });

  bool get isPaid => status == 'paid';
  bool get isOverdue => status == 'overdue';
  bool get isPending => status == 'pending';

  /// Days until due (negative if overdue)
  int get daysUntilDue {
    return dueDate.difference(DateTime.now()).inDays;
  }

  /// Days overdue (0 if not overdue)
  int get daysOverdue {
    if (daysUntilDue >= 0) return 0;
    return daysUntilDue.abs();
  }

  factory BillModel.fromJson(Map<String, dynamic> json) {
    return BillModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      billNumber: json['bill_number'] ?? '',
      packageId: json['package_id'],
      amountPkr: (json['amount_pkr'] ?? json['amount'] ?? 0).toDouble(),
      dueDate: json['due_date'] != null
          ? DateTime.parse(json['due_date'])
          : DateTime.now(),
      status: json['status'] ?? 'pending',
      totalPaid: (json['total_paid'] ?? json['paid_amount'] ?? 0).toDouble(),
      remainingAmount:
          (json['remaining_amount'] ?? json['amount'] ?? 0).toDouble(),
      billPeriodStart: json['bill_period_start'] != null
          ? DateTime.tryParse(json['bill_period_start'])
          : null,
      billPeriodEnd: json['bill_period_end'] != null
          ? DateTime.tryParse(json['bill_period_end'])
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      generatedBy: json['generated_by'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'bill_number': billNumber,
      'package_id': packageId,
      'amount_pkr': amountPkr,
      'due_date': dueDate.toIso8601String(),
      'status': status,
      'total_paid': totalPaid,
      'remaining_amount': remainingAmount,
    };
  }
}
