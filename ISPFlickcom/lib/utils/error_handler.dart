import 'package:dio/dio.dart';

/// ============================================================
/// Error Handler — Maps API/network errors to user messages
/// ============================================================

class AppError {
  final String type;
  final String message;
  final int? statusCode;

  const AppError({
    required this.type,
    required this.message,
    this.statusCode,
  });

  @override
  String toString() => message;
}

class ErrorHandler {
  ErrorHandler._();

  /// Convert any exception to a user-friendly AppError
  static AppError handle(dynamic error) {
    if (error is DioException) {
      return _handleDioError(error);
    }
    if (error is AppError) {
      return error;
    }
    return AppError(
      type: 'unknown',
      message: 'Something went wrong. Please try again.',
    );
  }

  static AppError _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const AppError(
          type: 'timeout',
          message: 'Connection timed out. Please check your internet.',
        );

      case DioExceptionType.connectionError:
        return const AppError(
          type: 'network',
          message: 'No internet connection. Please check your network.',
        );

      case DioExceptionType.badResponse:
        return _handleStatusCode(error.response);

      case DioExceptionType.cancel:
        return const AppError(
          type: 'cancelled',
          message: 'Request was cancelled.',
        );

      default:
        return const AppError(
          type: 'unknown',
          message: 'Something went wrong. Please try again.',
        );
    }
  }

  static AppError _handleStatusCode(Response? response) {
    final statusCode = response?.statusCode ?? 0;
    final data = response?.data;
    final serverMessage = data is Map ? (data['error'] ?? data['message']) : null;

    switch (statusCode) {
      case 400:
        return AppError(
          type: 'validation',
          message: serverMessage ?? 'Invalid request. Please check your input.',
          statusCode: 400,
        );
      case 401:
        return AppError(
          type: 'auth',
          message: serverMessage ?? 'Session expired. Please login again.',
          statusCode: 401,
        );
      case 403:
        return AppError(
          type: 'forbidden',
          message: serverMessage ?? 'Access denied.',
          statusCode: 403,
        );
      case 404:
        return AppError(
          type: 'not_found',
          message: serverMessage ?? 'Resource not found.',
          statusCode: 404,
        );
      case 409:
        return AppError(
          type: 'conflict',
          message: serverMessage ?? 'This resource already exists.',
          statusCode: 409,
        );
      case 422:
        return AppError(
          type: 'validation',
          message: serverMessage ?? 'Validation failed. Please check your input.',
          statusCode: 422,
        );
      case 429:
        return AppError(
          type: 'rate_limit',
          message: 'Too many requests. Please wait and try again.',
          statusCode: 429,
        );
      case 500:
      case 502:
      case 503:
        return AppError(
          type: 'server',
          message: 'Server error. Please try again later.',
          statusCode: statusCode,
        );
      default:
        return AppError(
          type: 'unknown',
          message: serverMessage ?? 'An unexpected error occurred.',
          statusCode: statusCode,
        );
    }
  }
}
