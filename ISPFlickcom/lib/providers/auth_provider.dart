import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';
import '../utils/error_handler.dart';

/// ============================================================
/// Auth State
/// ============================================================

class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final bool isInitialized;
  final UserModel? user;
  final String? accessToken;
  final String? error;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.isInitialized = false,
    this.user,
    this.accessToken,
    this.error,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    bool? isInitialized,
    UserModel? user,
    String? accessToken,
    String? error,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isInitialized: isInitialized ?? this.isInitialized,
      user: user ?? this.user,
      accessToken: accessToken ?? this.accessToken,
      error: error,
    );
  }
}

/// ============================================================
/// Auth Notifier (Riverpod StateNotifier)
/// ============================================================

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  /// Initialize — check if user is already logged in
  Future<void> initialize() async {
    try {
      final isLoggedIn = await AuthService.isLoggedIn();
      if (isLoggedIn) {
        final userData = await StorageService.getUserData();
        if (userData != null) {
          state = AuthState(
            isAuthenticated: true,
            isInitialized: true,
            user: UserModel.fromJson(userData),
            accessToken: await StorageService.getAccessToken(),
          );
          return;
        }
      }
      state = const AuthState(isInitialized: true);
    } catch (e) {
      state = const AuthState(isInitialized: true);
    }
  }

  /// Login
  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final data = await AuthService.login(email: email, password: password);
      final user = UserModel.fromJson(data['user']);
      state = AuthState(
        isAuthenticated: true,
        isInitialized: true,
        user: user,
        accessToken: data['tokens']['accessToken'],
      );
      return true;
    } catch (e) {
      final error = ErrorHandler.handle(e);
      state = state.copyWith(isLoading: false, error: error.message);
      return false;
    }
  }

  /// Register
  Future<bool> register({
    required String name,
    required String cnic,
    required String address,
    required String email,
    required String phone,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await AuthService.register(
        name: name,
        cnic: cnic,
        address: address,
        email: email,
        phone: phone,
        password: password,
      );
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      final error = ErrorHandler.handle(e);
      state = state.copyWith(isLoading: false, error: error.message);
      return false;
    }
  }

  /// Logout
  Future<void> logout() async {
    await AuthService.logout();
    state = const AuthState(isInitialized: true);
  }

  /// Update User Data
  Future<void> updateUser(UserModel user) async {
    state = state.copyWith(user: user);
    await StorageService.saveUserData(user.toJson());
  }

  /// Clear error
  void clearError() {
    state = state.copyWith(error: null);
  }
}

/// ============================================================
/// Provider
/// ============================================================

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
