import '../config/dio_client.dart';
import '../config/constants.dart';
import 'storage_service.dart';

/// ============================================================
/// Auth Service — Login, Register, Refresh, Logout API calls
/// ============================================================

class AuthService {
  /// Register a new customer
  static Future<Map<String, dynamic>> register({
    required String name,
    required String cnic,
    required String address,
    required String email,
    required String phone,
    required String password,
  }) async {
    final response = await DioClient.instance.post(
      ApiEndpoints.register,
      data: {
        'name': name,
        'cnic': cnic,
        'address': address,
        'email': email,
        'phone': phone,
        'password': password,
      },
    );
    return response.data;
  }

  /// Login with email and password
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await DioClient.instance.post(
      ApiEndpoints.login,
      data: {
        'email': email,
        'password': password,
      },
    );

    final data = response.data;

    // Save tokens
    if (data['tokens'] != null) {
      await StorageService.saveTokens(
        data['tokens']['accessToken'],
        data['tokens']['refreshToken'],
      );
      DioClient.accessToken = data['tokens']['accessToken'];
    }

    // Save user data
    if (data['user'] != null) {
      await StorageService.saveUserData(data['user']);
    }

    return data;
  }

  /// Refresh the access token
  static Future<String?> refreshToken() async {
    final refreshToken = await StorageService.getRefreshToken();
    if (refreshToken == null) return null;

    try {
      final response = await DioClient.instance.post(
        ApiEndpoints.refreshToken,
        data: {'refreshToken': refreshToken},
      );

      final newAccessToken = response.data['accessToken'];
      if (newAccessToken != null) {
        await StorageService.saveTokens(newAccessToken, refreshToken);
        DioClient.accessToken = newAccessToken;
        return newAccessToken;
      }
    } catch (e) {
      // Refresh failed — user needs to re-login
      await logout();
    }
    return null;
  }

  /// Logout
  static Future<void> logout() async {
    try {
      await DioClient.instance.post(ApiEndpoints.logout);
    } catch (_) {
      // Ignore errors during logout
    } finally {
      await StorageService.clearAll();
      DioClient.reset();
    }
  }

  /// Forgot password
  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    final response = await DioClient.instance.post(
      ApiEndpoints.forgotPassword,
      data: {'email': email},
    );
    return response.data;
  }

  /// Reset password
  static Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    final response = await DioClient.instance.post(
      ApiEndpoints.resetPassword,
      data: {
        'token': token,
        'newPassword': newPassword,
      },
    );
    return response.data;
  }

  /// Check if user is already logged in (on app start)
  static Future<bool> isLoggedIn() async {
    final token = await StorageService.getAccessToken();
    if (token != null) {
      DioClient.accessToken = token;
      return true;
    }
    return false;
  }
}
