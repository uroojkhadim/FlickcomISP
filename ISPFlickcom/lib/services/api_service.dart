import 'package:dio/dio.dart' as dio;
import '../config/dio_client.dart';
import '../config/constants.dart';
import 'package:http_parser/http_parser.dart'; // Standard for MediaType

/// ============================================================
/// API Service — Generic HTTP helper for all API calls
/// ============================================================

class ApiService {
  /// GET request
  static Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, dynamic>? queryParams,
  }) async {
    final response = await DioClient.instance.get(
      endpoint,
      queryParameters: queryParams,
    );
    return response.data;
  }

  /// POST request
  static Future<Map<String, dynamic>> post(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    final response = await DioClient.instance.post(
      endpoint,
      data: data,
    );
    return response.data;
  }

  /// PUT request
  static Future<Map<String, dynamic>> put(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    final response = await DioClient.instance.put(
      endpoint,
      data: data,
    );
    return response.data;
  }

  /// DELETE request
  static Future<Map<String, dynamic>> delete(String endpoint) async {
    final response = await DioClient.instance.delete(endpoint);
    return response.data;
  }

  // ── Convenience methods for common endpoints ──

  /// Fetch customer dashboard
  static Future<Map<String, dynamic>> getDashboard() async {
    return get(ApiEndpoints.dashboard);
  }

  /// Fetch all packages
  static Future<Map<String, dynamic>> getPackages() async {
    return get(ApiEndpoints.packages);
  }

  /// Fetch customer payments
  static Future<Map<String, dynamic>> getPayments() async {
    return get(ApiEndpoints.payments);
  }

  /// Fetch customer bills
  static Future<Map<String, dynamic>> getBills() async {
    return get(ApiEndpoints.bills);
  }

  /// Fetch customer complaints
  static Future<Map<String, dynamic>> getComplaints() async {
    return get(ApiEndpoints.complaints);
  }

  /// Submit a new complaint
  static Future<Map<String, dynamic>> submitComplaint({
    required String title,
    required String message,
    required String category,
  }) async {
    return post(ApiEndpoints.complaints, data: {
      'title': title,
      'message': message,
      'category': category,
    });
  }

  /// Fetch notifications
  static Future<Map<String, dynamic>> getNotifications({
    int limit = 10,
    int offset = 0,
    bool unreadOnly = false,
  }) async {
    return get(ApiEndpoints.notifications, queryParams: {
      'limit': limit,
      'offset': offset,
      'unread_only': unreadOnly,
    });
  }

  /// Mark notification as read
  static Future<Map<String, dynamic>> markNotificationRead(String id) async {
    return put(ApiEndpoints.markNotificationRead(id));
  }

  /// Mark all notifications as read
  static Future<Map<String, dynamic>> markAllNotificationsRead() async {
    return post(ApiEndpoints.markAllNotificationsRead);
  }

  /// Fetch package history
  static Future<Map<String, dynamic>> getPackageHistory() async {
    return get(ApiEndpoints.packageHistory);
  }

  /// Initiate payment
  static Future<Map<String, dynamic>> initiatePayment({
    required String packageId,
    required String paymentMethod,
    required String phone,
  }) async {
    return post(ApiEndpoints.initiatePayment, data: {
      'package_id': packageId,
      'payment_method': paymentMethod,
      'phone': phone,
    });
  }

  /// Fetch chat messages
  static Future<Map<String, dynamic>> getChatMessages() async {
    return get(ApiEndpoints.chatMessages);
  }

  /// Send a chat message
  static Future<Map<String, dynamic>> sendChatMessage(String message) async {
    return post(ApiEndpoints.sendMessage, data: {'message': message});
  }

  /// Update customer profile
  static Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? address,
    String? phone,
    String? avatarUrl,
  }) async {
    final Map<String, dynamic> data = {};
    if (name != null) data['name'] = name;
    if (address != null) data['address'] = address;
    if (phone != null) data['phone'] = phone;
    if (avatarUrl != null) data['avatar_url'] = avatarUrl;

    return put(ApiEndpoints.updateProfile, data: data);
  }

  /// Upload Avatar Image (Cross-platform)
  static Future<Map<String, dynamic>> uploadAvatar({
    required List<int> bytes,
    required String fileName,
  }) async {
    final formData = dio.FormData.fromMap({
      'avatar': dio.MultipartFile.fromBytes(
        bytes,
        filename: fileName,
        contentType: MediaType('image', 'jpeg'),
      ),
    });

    final response = await DioClient.instance.post(
      '/customer/profile/upload-avatar',
      data: formData,
    );
    return response.data;
  }
}
