import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/custom_app_bar.dart';
import '../../providers/auth_provider.dart';
import '../../services/storage_service.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _biometricsEnabled = false;
  String _language = 'English';

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final notifs = await StorageService.getBool('notifications_enabled');
    final biometrics = await StorageService.getBool('biometrics_enabled');
    final lang = await StorageService.getString('language');
    
    setState(() {
      if (notifs != null) _notificationsEnabled = notifs;
      if (biometrics != null) _biometricsEnabled = biometrics;
      if (lang != null) _language = lang;
    });
  }

  Future<void> _toggleNotifications(bool value) async {
    setState(() => _notificationsEnabled = value);
    await StorageService.setBool('notifications_enabled', value);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(value ? 'Notifications enabled' : 'Notifications disabled')),
      );
    }
  }

  Future<void> _toggleBiometrics(bool value) async {
    setState(() => _biometricsEnabled = value);
    await StorageService.setBool('biometrics_enabled', value);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(value ? 'Biometrics enabled for next login' : 'Biometrics disabled')),
      );
    }
  }

  void _showLanguageSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Select Language', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ListTile(
              title: const Text('English'),
              trailing: _language == 'English' ? Icon(Icons.check, color: Theme.of(context).primaryColor) : null,
              onTap: () async {
                setState(() => _language = 'English');
                await StorageService.setString('language', 'English');
                if (mounted) Navigator.pop(ctx);
              },
            ),
            ListTile(
              title: const Text('Urdu'),
              trailing: _language == 'Urdu' ? Icon(Icons.check, color: Theme.of(context).primaryColor) : null,
              onTap: () async {
                setState(() => _language = 'Urdu');
                await StorageService.setString('language', 'Urdu');
                if (mounted) Navigator.pop(ctx);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAboutApp() {
    showAboutDialog(
      context: context,
      applicationName: 'ISP Flick',
      applicationVersion: '1.0.0',
      applicationIcon: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.wifi, color: Colors.white, size: 30),
      ),
      children: [
        const Text('ISP Flick is a comprehensive customer management application for Internet Service Providers.'),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: const ISPAppBar(
        title: 'Settings',
        showBackButton: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            _buildSectionHeader('Preferences'),
            _buildSettingTile(
              context,
              icon: Icons.notifications_active_outlined,
              title: 'Notifications',
              subtitle: 'Manage your app notifications',
              onTap: () => _toggleNotifications(!_notificationsEnabled),
              trailing: Switch(
                value: _notificationsEnabled,
                onChanged: _toggleNotifications,
                activeTrackColor: Theme.of(context).primaryColor,
              ),
            ),
            _buildSettingTile(
              context,
              icon: Icons.language_outlined,
              title: 'Language',
              subtitle: _language,
              onTap: _showLanguageSelector,
            ),
            const SizedBox(height: 16),
            _buildSectionHeader('Security'),
            _buildSettingTile(
              context,
              icon: Icons.lock_outline_rounded,
              title: 'Change Password',
              subtitle: 'Update your login password',
              onTap: () => context.push('/forgot-password'),
            ),
            _buildSettingTile(
              context,
              icon: Icons.fingerprint_rounded,
              title: 'Biometric Login',
              subtitle: 'Use fingerprint or face ID',
              onTap: () => _toggleBiometrics(!_biometricsEnabled),
              trailing: Switch(
                value: _biometricsEnabled,
                onChanged: _toggleBiometrics,
              ),
            ),
            const SizedBox(height: 16),
            _buildSectionHeader('Support'),
            _buildSettingTile(
              context,
              icon: Icons.help_outline_rounded,
              title: 'Help Center',
              subtitle: 'FAQs and support guides',
              onTap: () => context.push('/complaints'),
            ),
            _buildSettingTile(
              context,
              icon: Icons.info_outline_rounded,
              title: 'About App',
              subtitle: 'Version 1.0.0',
              onTap: _showAboutApp,
            ),
            const SizedBox(height: 32),
            _buildLogoutButton(context, ref),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey[600],
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildSettingTile(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: Theme.of(context).primaryColor, size: 22),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: Colors.grey[500], fontSize: 12),
        ),
        trailing: trailing ?? const Icon(Icons.chevron_right_rounded, color: Colors.grey),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: TextButton(
        onPressed: () async {
          await ref.read(authProvider.notifier).logout();
          if (context.mounted) context.go('/login');
        },
        style: TextButton.styleFrom(
          foregroundColor: Colors.red,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.red.withValues(alpha: 0.5)),
          ),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout_rounded, size: 20),
            SizedBox(width: 8),
            Text('Logout Account', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
