// ============================================================
// User Model
// ============================================================

class UserModel {
  final String id;
  final String userId;
  final String name;
  final String? cnic;
  final String? address;
  final String email;
  final String phone;
  final String role; // 'customer' | 'admin'
  final String status; // 'active' | 'suspended' | 'inactive' | 'pending_approval'
  final String? avatarUrl;

  // Package Info
  final String? currentPackageId;
  final DateTime? packageStartDate;
  final DateTime? packageExpiryDate;

  // Usage
  final int totalMbUsed;
  final int currentMonthUsage;
  final DateTime? lastUsageReset;

  // Classification
  final String customerType; // 'old' | 'new'
  final DateTime? signupDate;

  // Security
  final DateTime? lastLogin;

  final DateTime? createdAt;
  final DateTime? updatedAt;

  const UserModel({
    required this.id,
    required this.userId,
    required this.name,
    this.cnic,
    this.address,
    required this.email,
    required this.phone,
    this.role = 'customer',
    this.status = 'active',
    this.currentPackageId,
    this.packageStartDate,
    this.packageExpiryDate,
    this.totalMbUsed = 0,
    this.currentMonthUsage = 0,
    this.lastUsageReset,
    this.customerType = 'new',
    this.signupDate,
    this.lastLogin,
    this.createdAt,
    this.updatedAt,
    this.avatarUrl,
  });

  bool get isAdmin => role == 'admin';
  bool get isActive => status == 'active';
  bool get isPendingApproval => status == 'pending_approval';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      name: json['name'] ?? '',
      cnic: json['cnic'],
      address: json['address'],
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'customer',
      status: json['status'] ?? 'active',
      currentPackageId: json['current_package_id'],
      packageStartDate: json['package_start_date'] != null
          ? DateTime.tryParse(json['package_start_date'])
          : null,
      packageExpiryDate: json['package_expiry_date'] != null
          ? DateTime.tryParse(json['package_expiry_date'])
          : null,
      totalMbUsed: json['total_mb_used'] ?? 0,
      currentMonthUsage: json['current_month_usage'] ?? 0,
      lastUsageReset: json['last_usage_reset'] != null
          ? DateTime.tryParse(json['last_usage_reset'])
          : null,
      customerType: json['customer_type'] ?? 'new',
      signupDate: json['signup_date'] != null
          ? DateTime.tryParse(json['signup_date'])
          : null,
      lastLogin: json['last_login'] != null
          ? DateTime.tryParse(json['last_login'])
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
      avatarUrl: json['avatar_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'cnic': cnic,
      'address': address,
      'email': email,
      'phone': phone,
      'role': role,
      'status': status,
      'current_package_id': currentPackageId,
      'package_start_date': packageStartDate?.toIso8601String(),
      'package_expiry_date': packageExpiryDate?.toIso8601String(),
      'total_mb_used': totalMbUsed,
      'current_month_usage': currentMonthUsage,
      'customer_type': customerType,
      'signup_date': signupDate?.toIso8601String(),
      'avatar_url': avatarUrl,
    };
  }

  UserModel copyWith({
    String? name,
    String? email,
    String? phone,
    String? cnic,
    String? address,
    String? status,
    String? customerType,
    String? currentPackageId,
    String? avatarUrl,
    bool clearAvatar = false,
  }) {
    return UserModel(
      id: id,
      userId: userId,
      name: name ?? this.name,
      cnic: cnic ?? this.cnic,
      address: address ?? this.address,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role,
      status: status ?? this.status,
      currentPackageId: currentPackageId ?? this.currentPackageId,
      packageStartDate: packageStartDate,
      packageExpiryDate: packageExpiryDate,
      totalMbUsed: totalMbUsed,
      currentMonthUsage: currentMonthUsage,
      lastUsageReset: lastUsageReset,
      customerType: customerType ?? this.customerType,
      signupDate: signupDate,
      lastLogin: lastLogin,
      createdAt: createdAt,
      updatedAt: updatedAt,
      avatarUrl: clearAvatar ? null : (avatarUrl ?? this.avatarUrl),
    );
  }
}
