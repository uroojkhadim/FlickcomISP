// ============================================================
// Package Model
// ============================================================

class PackageModel {
  final String id;
  final String name;
  final String? description;
  final int mbLimit;
  final int validityDays;
  final double pricePkr;
  final double? oldCustomerPricePkr;
  final String status; // 'active' | 'discontinued'
  final int? displayOrder;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const PackageModel({
    required this.id,
    required this.name,
    this.description,
    required this.mbLimit,
    required this.validityDays,
    required this.pricePkr,
    this.oldCustomerPricePkr,
    this.status = 'active',
    this.displayOrder,
    this.createdAt,
    this.updatedAt,
  });

  bool get isActive => status == 'active';

  /// Human-readable MB display (e.g. "200 MB" or "1.5 GB")
  String get mbDisplay {
    if (mbLimit >= 1024) {
      final gb = mbLimit / 1024;
      return '${gb.toStringAsFixed(gb.truncateToDouble() == gb ? 0 : 1)} GB';
    }
    return '$mbLimit MB';
  }

  /// Human-readable validity (e.g. "30 Days")
  String get validityDisplay => '$validityDays Days';

  factory PackageModel.fromJson(Map<String, dynamic> json) {
    return PackageModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      mbLimit: json['mb_limit'] ?? 0,
      validityDays: json['validity_days'] ?? 30,
      pricePkr: (json['price_pkr'] ?? json['price'] ?? 0).toDouble(),
      oldCustomerPricePkr: json['old_customer_price_pkr'] != null
          ? (json['old_customer_price_pkr']).toDouble()
          : null,
      status: json['status'] ?? 'active',
      displayOrder: json['display_order'],
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
      'name': name,
      'description': description,
      'mb_limit': mbLimit,
      'validity_days': validityDays,
      'price_pkr': pricePkr,
      'old_customer_price_pkr': oldCustomerPricePkr,
      'status': status,
      'display_order': displayOrder,
    };
  }
}
