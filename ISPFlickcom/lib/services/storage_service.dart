import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../config/constants.dart';

/// ============================================================
/// Storage Service — Secure token + user data persistence
/// ============================================================

class StorageService {
  static const _storage = FlutterSecureStorage();
  static SharedPreferences? _prefs;

  static Future<SharedPreferences> get prefs async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }

  // ── Token Storage (Secure) ──

  static Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _storage.write(key: AppConstants.accessTokenKey, value: accessToken);
    await _storage.write(key: AppConstants.refreshTokenKey, value: refreshToken);
  }

  static Future<String?> getAccessToken() async {
    return await _storage.read(key: AppConstants.accessTokenKey);
  }

  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: AppConstants.refreshTokenKey);
  }

  static Future<void> clearTokens() async {
    await _storage.delete(key: AppConstants.accessTokenKey);
    await _storage.delete(key: AppConstants.refreshTokenKey);
  }

  // ── User Data Storage ──

  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    final p = await prefs;
    await p.setString(AppConstants.userDataKey, jsonEncode(userData));
  }

  static Future<Map<String, dynamic>?> getUserData() async {
    final p = await prefs;
    final data = p.getString(AppConstants.userDataKey);
    if (data != null) {
      return jsonDecode(data) as Map<String, dynamic>;
    }
    return null;
  }

  static Future<void> clearUserData() async {
    final p = await prefs;
    await p.remove(AppConstants.userDataKey);
  }

  // ── Clear All ──

  static Future<void> clearAll() async {
    await clearTokens();
    await clearUserData();
  }

  // ── General KV Storage ──

  static Future<void> setString(String key, String value) async {
    final p = await prefs;
    await p.setString(key, value);
  }

  static Future<String?> getString(String key) async {
    final p = await prefs;
    return p.getString(key);
  }

  static Future<void> setBool(String key, bool value) async {
    final p = await prefs;
    await p.setBool(key, value);
  }

  static Future<bool?> getBool(String key) async {
    final p = await prefs;
    return p.getBool(key);
  }
}
