import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'constants.dart';

// ============================================================
// Dio HTTP Client Configuration
// ============================================================

class DioClient {
  static Dio? _instance;

  /// Token setter/getter — set by auth service on login/refresh
  static String? accessToken;

  /// Get or create the Dio singleton
  static Dio get instance {
    _instance ??= _createDio();
    return _instance!;
  }

  /// Reset client (on logout)
  static void reset() {
    accessToken = null;
    _instance?.close();
    _instance = null;
  }

  static Dio _createDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        sendTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // ── Request Interceptor ──
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // Inject JWT token
          if (accessToken != null) {
            options.headers['Authorization'] = 'Bearer $accessToken';
          }

          if (kDebugMode) {
            debugPrint('➡️ ${options.method} ${options.path}');
          }

          handler.next(options);
        },
        onResponse: (response, handler) {
          if (kDebugMode) {
            debugPrint('✅ ${response.statusCode} ${response.requestOptions.path}');
          }
          handler.next(response);
        },
        onError: (error, handler) {
          if (kDebugMode) {
            debugPrint('❌ ${error.response?.statusCode} ${error.requestOptions.path}');
            debugPrint('   ${error.response?.data}');
          }

          // Handle 401 — token expired → try refresh
          if (error.response?.statusCode == 401) {
            // TODO: Implement token refresh logic here
            // For now, just pass through
          }

          handler.next(error);
        },
      ),
    );

    return dio;
  }
}
