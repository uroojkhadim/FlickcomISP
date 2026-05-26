import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';

/// ============================================================
/// Main Shell — Bottom Navigation wrapper for customer screens
/// ============================================================

class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/packages')) return 1;
    if (location.startsWith('/bills')) return 2;
    if (location.startsWith('/profile')) return 3;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/packages');
        break;
      case 2:
        context.go('/bills');
        break;
      case 3:
        context.go('/profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final int selectedIndex = _calculateSelectedIndex(context);

    return Scaffold(
      key: _scaffoldKey,
      drawer: _AppDrawer(onScaffoldKey: _scaffoldKey),
      body: widget.child,
      bottomNavigationBar: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        decoration: BoxDecoration(
          gradient: AppColors.gradientPrimary,
          borderRadius: BorderRadius.circular(40),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF3B82F6).withValues(alpha: 0.3),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(40),
          child: NavigationBarTheme(
            data: NavigationBarThemeData(
              indicatorColor: Colors.white.withValues(alpha: 0.15),
              labelTextStyle: WidgetStateProperty.resolveWith((states) {
                if (states.contains(WidgetState.selected)) {
                  return AppTypography.caption(color: Colors.white)
                      .copyWith(fontWeight: FontWeight.bold);
                }
                return AppTypography.caption(color: Colors.white.withValues(alpha: 0.7));
              }),
              iconTheme: WidgetStateProperty.resolveWith((states) {
                if (states.contains(WidgetState.selected)) {
                  return const IconThemeData(color: Colors.white, size: 26);
                }
                return IconThemeData(color: Colors.white.withValues(alpha: 0.7), size: 24);
              }),
            ),
            child: NavigationBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              selectedIndex: selectedIndex,
              onDestinationSelected: (idx) => _onItemTapped(idx, context),
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.dashboard_rounded),
                  label: 'Home',
                ),
                NavigationDestination(
                  icon: Icon(Icons.inventory_2_rounded),
                  label: 'Packages',
                ),
                NavigationDestination(
                  icon: Icon(Icons.receipt_long_rounded),
                  label: 'Bills',
                ),
                NavigationDestination(
                  icon: Icon(Icons.person_outline_rounded),
                  selectedIcon: Icon(Icons.person_rounded),
                  label: 'Profile',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AppDrawer extends StatelessWidget {
  final GlobalKey<ScaffoldState> onScaffoldKey;
  const _AppDrawer({required this.onScaffoldKey});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: AppColors.gradientPrimary,
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.flash_on_rounded, color: Colors.white, size: 40),
                  const SizedBox(height: 12),
                  Text(
                    'ISP FLICK',
                    style: AppTypography.h2(color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.speed_rounded, color: AppColors.primary500),
            title: const Text('Speed Test'),
            onTap: () {
              Navigator.pop(context);
              context.push('/speed-test');
            },
          ),
          ListTile(
            leading: const Icon(Icons.history_rounded, color: AppColors.accentIndigo),
            title: const Text('Package History'),
            onTap: () {
              Navigator.pop(context);
              context.push('/package-history');
            },
          ),
          ListTile(
            leading: const Icon(Icons.report_problem_outlined, color: AppColors.accentOrange),
            title: const Text('Complaints'),
            onTap: () {
              Navigator.pop(context);
              context.push('/complaints');
            },
          ),
          ListTile(
            leading: const Icon(Icons.notifications_none_rounded, color: AppColors.accentPurple),
            title: const Text('Notifications'),
            onTap: () {
              Navigator.pop(context);
              context.push('/notifications');
            },
          ),
          const Spacer(),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout_rounded, color: AppColors.accentRed),
            title: const Text('Logout'),
            onTap: () {
              // TODO: Implement logout
              Navigator.pop(context);
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
