import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/theme.dart';
import '../../models/bill_model.dart';
import '../../services/api_service.dart';
import '../../utils/currency_formatter.dart';
import '../../utils/date_formatter.dart';
import '../../utils/error_handler.dart';
import '../../widgets/loading_shimmer.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/error_widget.dart';

/// Provider
final billsProvider = FutureProvider.autoDispose<List<BillModel>>((ref) async {
  final response = await ApiService.getBills();
  return (response['bills'] as List)
      .map((b) => BillModel.fromJson(b))
      .toList();
});

/// ============================================================
/// Bills Screen — View customer bills with status
/// ============================================================

class BillsScreen extends ConsumerWidget {
  const BillsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final billsAsync = ref.watch(billsProvider);

    return Scaffold(
      appBar: ISPAppBar(
        title: 'My Bills',
        showBackButton: false,
        onMenuPressed: () => Scaffold.of(context).openDrawer(),
      ),
      body: billsAsync.when(
        data: (bills) => _buildList(context, bills),
        loading: () => const LoadingShimmer(layout: ShimmerLayout.list),
        error: (e, st) => AppErrorWidget(
          message: ErrorHandler.handle(e).message,
          onRetry: () => ref.invalidate(billsProvider),
        ),
      ),
    );
  }

  Widget _buildList(BuildContext context, List<BillModel> bills) {
    if (bills.isEmpty) {
      return const EmptyStateWidget(
        title: 'No Bills Yet',
        subtitle: 'Your bills will appear here once generated.',
        icon: Icons.receipt_long_outlined,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: bills.length,
      itemBuilder: (context, index) {
        final bill = bills[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _BillCard(bill: bill),
        );
      },
    );
  }
}

class _BillCard extends StatelessWidget {
  final BillModel bill;

  const _BillCard({required this.bill});

  @override
  Widget build(BuildContext context) {
    final accentColor = bill.isPaid 
        ? AppColors.accentGreen 
        : (bill.isOverdue ? AppColors.accentRed : AppColors.primary500);

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: AppRadius.borderLg,
        boxShadow: AppShadows.sm,
        border: Border.all(color: AppColors.lightBorder),
      ),
      child: ClipRRect(
        borderRadius: AppRadius.borderLg,
        child: Container(
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(color: accentColor, width: 6),
            ),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
          // ── Header ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(bill.billNumber, style: AppTypography.bodyLg()),
              _StatusBadge(status: bill.status),
            ],
          ),
          const SizedBox(height: 12),

          // ── Amount ──
          Text(
            CurrencyFormatter.format(bill.amountPkr),
            style: AppTypography.h2(),
          ),
          const SizedBox(height: 8),

          // ── Details ──
          Row(
            children: [
              Icon(Icons.calendar_today_rounded,
                  size: 14, color: AppColors.lightTextTertiary),
              const SizedBox(width: 6),
              Text(
                'Due: ${DateFormatter.format(bill.dueDate)}',
                style: AppTypography.bodySm(
                  color: bill.isOverdue
                      ? AppColors.accentRed
                      : AppColors.lightTextSecondary,
                ),
              ),
            ],
          ),

          if (bill.isOverdue) ...[
            const SizedBox(height: 6),
            Text(
              '${bill.daysOverdue} days overdue',
              style: AppTypography.bodySm(color: AppColors.accentRed)
                  .copyWith(fontWeight: FontWeight.w600),
            ),
          ],

          if (bill.remainingAmount > 0 &&
              bill.remainingAmount != bill.amountPkr) ...[
            const SizedBox(height: 8),
            Text(
              'Remaining: ${CurrencyFormatter.format(bill.remainingAmount)}',
              style: AppTypography.bodySm(color: AppColors.accentOrange),
            ),
          ],
        ],
          ),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color text;
    switch (status) {
      case 'paid':
        bg = AppColors.accentGreen.withValues(alpha: 0.1);
        text = AppColors.accentGreen;
        break;
      case 'overdue':
        bg = AppColors.accentRed.withValues(alpha: 0.1);
        text = AppColors.accentRed;
        break;
      case 'partially_paid':
        bg = AppColors.accentOrange.withValues(alpha: 0.1);
        text = AppColors.accentOrange;
        break;
      default:
        bg = AppColors.primary500.withValues(alpha: 0.1);
        text = AppColors.primary500;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.borderFull,
      ),
      child: Text(
        status.replaceAll('_', ' ').toUpperCase(),
        style: AppTypography.caption(color: text)
            .copyWith(fontWeight: FontWeight.w700, fontSize: 10),
      ),
    );
  }
}
