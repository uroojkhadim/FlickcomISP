import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/splash_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/customer/dashboard_screen.dart';
import '../screens/customer/packages_screen.dart';
import '../screens/customer/payment_screen.dart';
import '../screens/customer/bills_screen.dart';
import '../screens/customer/complaint_screen.dart';
import '../screens/customer/complaints_list_screen.dart';
import '../screens/customer/profile_screen.dart';
import '../screens/customer/notifications_screen.dart';
import '../screens/customer/main_shell.dart';
import '../screens/customer/speed_test_screen.dart';
import '../screens/customer/package_history_screen.dart';
import '../screens/customer/chat_screen.dart';
import '../screens/customer/edit_profile_screen.dart';
import '../screens/customer/settings_screen.dart';

// ============================================================
// App Router (GoRouter)
// ============================================================

class RouterNotifier extends ChangeNotifier {
  final Ref _ref;
  RouterNotifier(this._ref) {
    _ref.listen(authProvider, (previous, next) => notifyListeners());
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = RouterNotifier(ref);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: notifier,
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final isAuthenticated = authState.isAuthenticated;
      final isInitialized = authState.isInitialized;
      final path = state.uri.path;

      // Still initializing — show splash
      if (!isInitialized) return '/';

      // Auth routes
      final isAuthRoute =
          path == '/login' || path == '/register' || path == '/forgot-password';

      // If not authenticated, redirect everything except auth routes to login
      if (!isAuthenticated) {
        return isAuthRoute ? null : '/login';
      }

      // If authenticated, redirect auth routes and splash to dashboard
      if (isAuthenticated) {
        return isAuthRoute || path == '/' ? '/dashboard' : null;
      }

      return null;
    },
    routes: [
      // ── Splash ──
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),

      // ── Auth Routes ──
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),

      // ── Customer Shell (Bottom Navigation) ──
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/packages',
            builder: (context, state) => const PackagesScreen(),
          ),
          GoRoute(
            path: '/bills',
            builder: (context, state) => const BillsScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),

      // ── Standalone screens (no bottom nav) ──
      GoRoute(
        path: '/payment',
        builder: (context, state) => const PaymentScreen(),
      ),
      GoRoute(
        path: '/complaints',
        builder: (context, state) => const ComplaintsListScreen(),
      ),
      GoRoute(
        path: '/complaint/new',
        builder: (context, state) => const ComplaintScreen(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/speed-test',
        builder: (context, state) => const SpeedTestScreen(),
      ),
      GoRoute(
        path: '/package-history',
        builder: (context, state) => const PackageHistoryScreen(),
      ),
      GoRoute(
        path: '/chat',
        builder: (context, state) => const ChatScreen(),
      ),
      GoRoute(
        path: '/profile/edit',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});
