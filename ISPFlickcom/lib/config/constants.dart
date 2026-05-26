import 'package:flutter/foundation.dart';

class AppConstants {
  AppConstants._();

  static const String appName = 'Source Plain Internet';
  static const String appVersion = '1.0.0';

  // ── Dynamic API URL ──
  static String get apiBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api';
    } else {
      // 10.0.2.2 is the default IP for Android Emulator to access localhost
      // For physical devices, you must replace this with your machine's actual IP
      // or use a tunneling service like ngrok.
      return 'http://10.0.2.2:3000/api'; 
    }
  }
  
  static const String apiVersion = 'v1';

  // ── JWT ──
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const int tokenExpiryHours = 24;
  static const int refreshTokenExpiryDays = 7;

  // ... (baki sara code bilkul same rahega niche)
  static const int defaultPageSize = 20;
  static const int notificationPageSize = 10;
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 128;
  static const int minNameLength = 3;
  static const int maxNameLength = 100;
  static const String cnicPattern = r'^\d{5}-\d{7}-\d{1}$';
  static const String phonePattern = r'^\+92\d{10}$';
  static const String dateFormat = 'dd MMM yyyy';
  static const String dateTimeFormat = 'dd MMM yyyy, hh:mm a';
  static const String apiDateFormat = 'yyyy-MM-dd';
  static const String apiDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'";
  static const String currencyCode = 'PKR';
  static const String currencySymbol = 'Rs.';
  static const String jazzcash = 'jazzcash';
  static const String easypaisa = 'easypaisa';
  static const String bank = 'bank';
  static const List<String> complaintCategories = ['billing','speed','disconnection','other'];
  static const List<String> complaintPriorities = ['low', 'medium', 'high'];
  static const List<String> userStatuses = ['active', 'suspended', 'inactive', 'pending_approval'];
  static const List<String> packageStatuses = ['active', 'discontinued'];
  static const List<String> billStatuses = ['pending', 'partially_paid', 'paid', 'overdue', 'cancelled'];
}

class ApiEndpoints {
  ApiEndpoints._();
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String refreshToken = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String dashboard = '/customer/dashboard';
  static const String payments = '/customer/payments';
  static const String initiatePayment = '/customer/initiate-payment';
  static const String confirmPayment = '/customer/confirm-payment';
  static const String paymentFailed = '/customer/payment-failed';
  static const String bills = '/customer/bills';
  static const String complaints = '/customer/complaints';
  static const String notifications = '/customer/notifications';
  static String markNotificationRead(String id) => '/customer/notifications/$id/read';
  static const String markAllNotificationsRead = '/customer/notifications/read-all';
  static const String packageHistory = '/customer/package-history';
  static const String chatMessages = '/customer/chat/messages';
  static const String sendMessage = '/customer/chat/send';
  static const String updateProfile = '/customer/profile/update';
  static const String packages = '/packages';
  static const String adminDashboard = '/admin/dashboard';
  static const String adminCustomers = '/admin/customers';
  static String adminCustomerDetail(String id) => '/admin/customers/$id';
  static String adminCustomerApprove(String id) => '/admin/customers/$id/approve';
  static const String adminPackages = '/admin/packages';
  static String adminPackageDetail(String id) => '/admin/packages/$id';
  static const String adminBillGenerate = '/admin/bills/generate';
  static const String adminComplaints = '/admin/complaints';
  static String adminComplaintDetail(String id) => '/admin/complaints/$id';
  static String adminComplaintResolve(String id) => '/admin/complaints/$id/resolve';
  static const String adminChangePassword = '/admin/change-password';
}
