import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/notification_banner.dart';

/// ============================================================
/// Payment Screen — Select method & initiate payment
/// ============================================================

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String? _selectedMethod;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ISPAppBar(
        title: 'Payment',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Amount Summary ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppColors.gradientBlueCyan,
                borderRadius: AppRadius.borderXl,
              ),
              child: Column(
                children: [
                  Text('Amount Due',
                      style: AppTypography.body(
                          color: Colors.white.withValues(alpha: 0.8))),
                  const SizedBox(height: 8),
                  Text('Rs. 1,500.00',
                      style: AppTypography.h1(color: Colors.white)),
                  const SizedBox(height: 4),
                  Text('Pro Package • 200 MB • 30 Days',
                      style: AppTypography.bodySm(
                          color: Colors.white.withValues(alpha: 0.7))),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // ── Payment Methods ──
            Text('Select Payment Method',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),

            _PaymentMethodTile(
              icon: '🔷',
              name: 'JazzCash',
              subtitle: 'Fast & Secure',
              value: 'jazzcash',
              selected: _selectedMethod == 'jazzcash',
              onTap: () => setState(() => _selectedMethod = 'jazzcash'),
            ),
            const SizedBox(height: 12),

            _PaymentMethodTile(
              icon: '🔶',
              name: 'EasyPaisa',
              subtitle: 'Mobile Payment',
              value: 'easypaisa',
              selected: _selectedMethod == 'easypaisa',
              onTap: () => setState(() => _selectedMethod = 'easypaisa'),
            ),
            const SizedBox(height: 12),

            _PaymentMethodTile(
              icon: '🏦',
              name: 'Bank Transfer',
              subtitle: 'Direct Transfer',
              value: 'bank',
              selected: _selectedMethod == 'bank',
              onTap: () => setState(() => _selectedMethod = 'bank'),
            ),
            const SizedBox(height: 32),

            // ── Proceed Button ──
            CustomButton(
              label: 'Proceed to Pay',
              onPressed: _selectedMethod != null
                  ? () {
                      showAppBanner(
                        context,
                        message: 'Payment initiated! Redirecting...',
                        type: BannerType.info,
                      );
                      // TODO: Call ApiService.initiatePayment
                    }
                  : null,
              icon: Icons.payment_rounded,
            ),
            const SizedBox(height: 16),

            // ── Security note ──
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.lock_rounded,
                    size: 14,
                    color: AppColors.lightTextTertiary),
                const SizedBox(width: 6),
                Text(
                  'Secured with SSL encryption',
                  style: AppTypography.caption(
                      color: AppColors.lightTextTertiary),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentMethodTile extends StatelessWidget {
  final String icon;
  final String name;
  final String subtitle;
  final String value;
  final bool selected;
  final VoidCallback onTap;

  const _PaymentMethodTile({
    required this.icon,
    required this.name,
    required this.subtitle,
    required this.value,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary500.withValues(alpha: 0.06)
              : Theme.of(context).cardColor,
          border: Border.all(
            color: selected ? AppColors.primary500 : AppColors.lightBorder,
            width: selected ? 2 : 1,
          ),
          borderRadius: AppRadius.borderLg,
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 28)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: AppTypography.bodyLg()),
                  const SizedBox(height: 2),
                  Text(subtitle,
                      style: AppTypography.caption(
                          color: AppColors.lightTextTertiary)),
                ],
              ),
            ),
            if (selected)
              const Icon(Icons.check_circle_rounded,
                  color: AppColors.primary500, size: 24),
          ],
        ),
      ),
    );
  }
}
