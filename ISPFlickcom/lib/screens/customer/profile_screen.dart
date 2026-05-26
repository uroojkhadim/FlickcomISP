import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      appBar: ISPAppBar(
        title: 'Profile',
        showBackButton: false,
        onMenuPressed: () => Scaffold.of(context).openDrawer(),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: AppColors.gradientBlueCyan,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      )
                    ],
                    image: user?.avatarUrl != null
                        ? DecorationImage(
                            image: NetworkImage(user!.avatarUrl!),
                            fit: BoxFit.cover)
                        : null,
                  ),
                  child: user?.avatarUrl == null
                      ? Center(
                          child: Text(
                            (user?.name ?? 'U')[0].toUpperCase(),
                            style: AppTypography.h1(color: Colors.white),
                          ),
                        )
                      : null,
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: GestureDetector(
                    onTap: () => context.push('/profile/edit'),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.primary500,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: const Icon(Icons.edit_rounded,
                          color: Colors.white, size: 16),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(user?.name ?? 'User',
                style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 4),
            Text(user?.email ?? '',
                style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 32),
            _tile(Icons.phone_outlined, 'Phone', user?.phone ?? '-'),
            _tile(Icons.badge_outlined, 'CNIC', user?.cnic ?? '-'),
            _tile(Icons.location_on_outlined, 'Address', user?.address ?? '-'),
            _tile(Icons.person_outline, 'Type',
                (user?.customerType ?? 'new').toUpperCase()),
            const SizedBox(height: 20),
            _actionTile(context, Icons.help_outline_rounded, 'Help & Support',
                () => context.push('/complaints')),
            _actionTile(context, Icons.lock_reset_rounded, 'Security Settings',
                () => context.push('/settings')),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: () async {
                  await ref.read(authProvider.notifier).logout();
                  if (context.mounted) context.go('/login');
                },
                icon: const Icon(Icons.logout_rounded),
                label: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentRed,
                  foregroundColor: Colors.white,
                  shape:
                      RoundedRectangleBorder(borderRadius: AppRadius.borderLg),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _actionTile(
      BuildContext context, IconData icon, String title, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: AppRadius.borderLg,
        ),
        child: Row(
          children: [
            Icon(icon, size: 22, color: Colors.grey[700]),
            const SizedBox(width: 14),
            Text(title,
                style: const TextStyle(
                    fontWeight: FontWeight.w600, color: Colors.black87)),
            const Spacer(),
            const Icon(Icons.chevron_right_rounded, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  Widget _tile(IconData icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppColors.lightBorder),
        borderRadius: AppRadius.borderLg,
      ),
      child: Row(children: [
        Icon(icon, size: 20, color: AppColors.primary500),
        const SizedBox(width: 14),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: AppTypography.caption(color: AppColors.lightTextTertiary)),
          Text(value, style: AppTypography.body().copyWith(fontWeight: FontWeight.w600)),
        ]),
      ]),
    );
  }
}
