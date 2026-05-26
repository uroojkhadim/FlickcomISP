import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/theme.dart';
import '../../models/dashboard_model.dart';
import '../../services/api_service.dart';
import '../../utils/date_formatter.dart';
import '../../utils/error_handler.dart';
import '../../widgets/loading_shimmer.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/error_widget.dart';

final packageHistoryProvider = FutureProvider.autoDispose<List<DashboardPackage>>((ref) async {
  final response = await ApiService.getPackageHistory();
  return (response['history'] as List)
      .map((p) => DashboardPackage.fromJson(p))
      .toList();
});

class PackageHistoryScreen extends ConsumerWidget {
  const PackageHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(packageHistoryProvider);

    return Scaffold(
      appBar: const ISPAppBar(title: 'Package History'),
      body: historyAsync.when(
        data: (history) => _buildList(context, history),
        loading: () => const LoadingShimmer(layout: ShimmerLayout.list),
        error: (e, st) => AppErrorWidget(
          message: ErrorHandler.handle(e).message,
          onRetry: () => ref.invalidate(packageHistoryProvider),
        ),
      ),
    );
  }

  Widget _buildList(BuildContext context, List<DashboardPackage> history) {
    if (history.isEmpty) {
      return const EmptyStateWidget(
        title: 'No History',
        subtitle: 'Your package history will appear here.',
        icon: Icons.history_rounded,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: history.length,
      itemBuilder: (context, index) {
        final pkg = history[index];
        final isActive = pkg.daysRemaining > 0;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: AppRadius.borderLg,
            border: Border.all(
              color: isActive ? AppColors.accentGreen.withValues(alpha: 0.3) : AppColors.lightBorder,
              width: isActive ? 2 : 1,
            ),
            boxShadow: AppShadows.sm,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(pkg.name, style: AppTypography.h3()),
                  _StatusChip(isActive: isActive),
                ],
              ),
              const SizedBox(height: 12),
              
              _infoRow(Icons.calendar_today_rounded, 'Started:', DateFormatter.format(pkg.startDate)),
              _infoRow(Icons.event_busy_rounded, 'Expires:', DateFormatter.format(pkg.expiryDate)),
              
              const Divider(height: 24),
              
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isActive ? 'Days Remaining' : 'Expired on',
                    style: AppTypography.caption(color: AppColors.lightTextTertiary),
                  ),
                  Text(
                    isActive ? '${pkg.daysRemaining} Days' : DateFormatter.format(pkg.expiryDate),
                    style: AppTypography.body().copyWith(
                      fontWeight: FontWeight.bold,
                      color: isActive ? AppColors.accentGreen : AppColors.lightTextSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(icon, size: 14, color: AppColors.lightTextTertiary),
          const SizedBox(width: 8),
          Text(label, style: AppTypography.caption(color: AppColors.lightTextSecondary)),
          const SizedBox(width: 8),
          Text(value, style: AppTypography.bodySm()),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final bool isActive;
  const _StatusChip({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isActive ? AppColors.accentGreen.withValues(alpha: 0.1) : Colors.grey.withValues(alpha: 0.1),
        borderRadius: AppRadius.borderFull,
      ),
      child: Text(
        isActive ? 'ACTIVE' : 'EXPIRED',
        style: AppTypography.caption(
          color: isActive ? AppColors.accentGreen : Colors.grey[600]!,
        ).copyWith(fontWeight: FontWeight.bold, fontSize: 10),
      ),
    );
  }
}
