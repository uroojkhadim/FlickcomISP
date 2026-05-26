import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../models/dashboard_model.dart';
import '../../services/api_service.dart';
import '../../utils/currency_formatter.dart';
import '../../utils/date_formatter.dart';
import '../../utils/error_handler.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/animated_progress_bar.dart';
import '../../widgets/loading_shimmer.dart';
import '../../widgets/error_widget.dart';
import '../../widgets/custom_app_bar.dart';
import '../../providers/auth_provider.dart';

/// ============================================================
/// Dashboard Provider
/// ============================================================
final dashboardProvider = FutureProvider.autoDispose<DashboardModel>((ref) async {
  final response = await ApiService.getDashboard();
  return DashboardModel.fromJson(response['dashboard']);
});

/// ============================================================
/// Dashboard Screen — Main customer landing page
/// ============================================================

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardAsync = ref.watch(dashboardProvider);
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: ISPAppBar(
        titleWidget: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, ${authState.user?.name ?? 'User'}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            Row(
              children: [
                const Icon(Icons.calendar_month_rounded, color: Colors.white70, size: 12),
                const SizedBox(width: 4),
                Text(
                  DateFormatter.format(DateTime.now()),
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
        showBackButton: false,
        onMenuPressed: () => Scaffold.of(context).openDrawer(),
        actions: [
          IconButton(
            icon: const Icon(Icons.support_agent_rounded),
            onPressed: () => context.push('/complaints'),
            tooltip: 'Complaints',
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.push('/notifications'),
            tooltip: 'Notifications',
          ),
        ],
      ),
      body: dashboardAsync.when(
        data: (dashboard) => _buildContent(context, dashboard, authState),
        loading: () => const LoadingShimmer(layout: ShimmerLayout.dashboard),
        error: (e, st) => AppErrorWidget(
          message: ErrorHandler.handle(e).message,
          onRetry: () => ref.invalidate(dashboardProvider),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/chat'),
        backgroundColor: Theme.of(context).primaryColor,
        icon: const Icon(Icons.chat_bubble_rounded, color: Colors.white),
        label: const Text('Chat Support',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        elevation: 4,
      ),
    );
  }

  Widget _buildContent(
      BuildContext context, DashboardModel dashboard, AuthState authState) {
    return RefreshIndicator(
      onRefresh: () async {
        // Invalidate provider
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Stats Grid ──

            // ── Stats Grid ──
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 1.3,
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
              children: [
                _StatCard(
                  gradient: AppColors.gradientBlueCyan,
                  title: 'Total MBs',
                  value: '${dashboard.usage.totalMb} MB',
                  icon: Icons.cloud_rounded,
                ),
                _StatCard(
                  gradient: AppColors.gradientPurplePink,
                  title: 'Used MBs',
                  value: '${dashboard.usage.usedMb} MB',
                  icon: Icons.trending_up_rounded,
                ),
                _StatCard(
                  gradient: AppColors.gradientGreenLime,
                  title: 'Remaining',
                  value: '${dashboard.usage.remainingMb} MB',
                  icon: Icons.flash_on_rounded,
                ),
                _StatCard(
                  gradient: AppColors.gradientOrangeRed,
                  title: 'Package',
                  value: dashboard.currentPackage?.name ?? 'None',
                  icon: Icons.inventory_2_rounded,
                ),
              ],
            ),
            const SizedBox(height: 24),

            // ── Usage Progress Bar ──
            AnimatedProgressBar(
              percentage: dashboard.usage.percentageUsed,
              label: 'Data Usage',
              fillGradient: AppColors.gradientBlueCyan,
            ),
            const SizedBox(height: 24),

            // ── Package Details Card ──
            if (dashboard.currentPackage != null)
              GlassCard(
                gradient: AppColors.gradientIndigoPurple,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.inventory_2_rounded,
                            color: Colors.white, size: 22),
                        const SizedBox(width: 10),
                        Text(
                          'Package Details',
                          style: AppTypography.h3(color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _DetailRow(
                        label: 'Package',
                        value: dashboard.currentPackage!.name),
                    _DetailRow(
                      label: 'Start Date',
                      value:
                          DateFormatter.format(dashboard.currentPackage!.startDate),
                    ),
                    _DetailRow(
                      label: 'Expiry Date',
                      value: DateFormatter.format(
                          dashboard.currentPackage!.expiryDate),
                    ),
                    _DetailRow(
                      label: 'Days Left',
                      value:
                          '${dashboard.currentPackage!.daysRemaining} days',
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 20),

            // ── Overdue Bills Alert ──
            if (dashboard.activeBills.isNotEmpty) ...[
              GestureDetector(
                onTap: () => context.push('/bills'),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFEBEE),
                    border:
                        Border.all(color: AppColors.accentRed.withValues(alpha: 0.3)),
                    borderRadius: AppRadius.borderLg,
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.accentRed.withValues(alpha: 0.15),
                          borderRadius: AppRadius.borderMd,
                        ),
                        child: const Icon(Icons.warning_rounded,
                            color: AppColors.accentRed, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '⚠️ Demand Notice',
                              style: AppTypography.bodyLg(
                                  color: const Color(0xFFB71C1C)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Due: ${CurrencyFormatter.format(dashboard.activeBills.total)}',
                              style: AppTypography.bodySm(
                                  color: const Color(0xFFC62828)),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.chevron_right_rounded,
                          color: AppColors.accentRed.withValues(alpha: 0.6)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // ── Quick Actions ──
            Text(
              'Quick Actions',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _QuickAction(
                    icon: Icons.payment_rounded,
                    label: 'Pay Now',
                    color: AppColors.accentGreen,
                    onTap: () => context.push('/payment'),
                  ),
                ),
                const SizedBox(width: 12),
                    Expanded(
                      child: _QuickAction(
                        icon: Icons.history_rounded,
                        label: 'History',
                        color: AppColors.accentIndigo,
                        onTap: () => context.push('/package-history'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _QuickAction(
                        icon: Icons.report_problem_outlined,
                        label: 'Support',
                        color: AppColors.accentOrange,
                        onTap: () => context.push('/complaints'),
                        useGradient: true,
                      ),
                    ),
              ],
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

/// ── Stat Card (inside Grid) ──
class _StatCard extends StatelessWidget {
  final LinearGradient gradient;
  final String title;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.gradient,
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      gradient: gradient,
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: Colors.white, size: 26),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: AppTypography.caption(
                      color: Colors.white.withValues(alpha: 0.8))),
              const SizedBox(height: 2),
              Text(value,
                  style:
                      AppTypography.bodyLg(color: Colors.white).copyWith(fontSize: 17)),
            ],
          ),
        ],
      ),
    );
  }
}

/// ── Package Detail Row ──
class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: AppTypography.bodySm(
                  color: Colors.white.withValues(alpha: 0.7))),
          Text(value,
              style: AppTypography.bodySm(color: Colors.white)
                  .copyWith(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

/// ── Quick Action Button ──
class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  final bool useGradient;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
    this.useGradient = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: useGradient ? null : color.withValues(alpha: 0.08),
          gradient: useGradient ? LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, color.withValues(alpha: 0.8)],
          ) : null,
          border: Border.all(color: color.withValues(alpha: 0.2)),
          borderRadius: AppRadius.borderLg,
          boxShadow: useGradient ? [
            BoxShadow(color: color.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4))
          ] : null,
        ),
        child: Column(
          children: [
            Icon(icon, color: useGradient ? Colors.white : color, size: 28),
            const SizedBox(height: 8),
            Text(
              label,
              style: AppTypography.bodySm(color: useGradient ? Colors.white : color)
                  .copyWith(fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}
