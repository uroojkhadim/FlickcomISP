import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/theme.dart';
import '../../models/complaint_model.dart';
import '../../services/api_service.dart';
import '../../utils/date_formatter.dart';
import '../../utils/error_handler.dart';
import '../../widgets/loading_shimmer.dart';
import '../../widgets/error_widget.dart';
import '../../widgets/custom_app_bar.dart';
import 'package:go_router/go_router.dart';

/// Provider
final complaintsProvider =
    FutureProvider.autoDispose<List<ComplaintModel>>((ref) async {
  final response = await ApiService.getComplaints();
  return (response['complaints'] as List)
      .map((c) => ComplaintModel.fromJson(c))
      .toList();
});

/// ============================================================
/// Complaints List Screen
/// ============================================================

class ComplaintsListScreen extends ConsumerWidget {
  const ComplaintsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final complaintsAsync = ref.watch(complaintsProvider);

    return Scaffold(
      appBar: const ISPAppBar(
        title: 'My Complaints',
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/complaint/new'),
        icon: const Icon(Icons.add_rounded),
        label: const Text('New'),
        backgroundColor: AppColors.primary500,
        foregroundColor: Colors.white,
      ),
      body: complaintsAsync.when(
        data: (complaints) => _buildList(context, complaints),
        loading: () => const LoadingShimmer(layout: ShimmerLayout.list),
        error: (e, st) => AppErrorWidget(
          message: ErrorHandler.handle(e).message,
          onRetry: () => ref.invalidate(complaintsProvider),
        ),
      ),
    );
  }

  Widget _buildList(BuildContext context, List<ComplaintModel> complaints) {
    if (complaints.isEmpty) {
      return const EmptyStateWidget(
        title: 'No Complaints',
        subtitle: 'You haven\'t submitted any complaints yet.',
        icon: Icons.support_agent_rounded,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: complaints.length,
      itemBuilder: (context, index) {
        final c = complaints[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _ComplaintCard(complaint: c),
        );
      },
    );
  }
}

class _ComplaintCard extends StatelessWidget {
  final ComplaintModel complaint;

  const _ComplaintCard({required this.complaint});

  @override
  Widget build(BuildContext context) {
    final accentColor = complaint.isResolved 
        ? AppColors.accentGreen 
        : (complaint.status == 'in_progress' ? AppColors.accentOrange : AppColors.primary500);

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
            children: [
              Expanded(
                child: Text(complaint.title, style: AppTypography.bodyLg()),
              ),
              _StatusChip(status: complaint.status),
            ],
          ),
          const SizedBox(height: 8),

          // ── Category + Priority ──
          Row(
            children: [
              Text(complaint.categoryDisplay,
                  style: AppTypography.bodySm(
                      color: AppColors.lightTextSecondary)),
              const SizedBox(width: 12),
              Text(complaint.priorityDisplay,
                  style: AppTypography.bodySm(
                      color: AppColors.lightTextSecondary)),
            ],
          ),
          const SizedBox(height: 8),

          // ── Message preview ──
          Text(
            complaint.message,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: AppTypography.body(color: AppColors.lightTextSecondary),
          ),
          const SizedBox(height: 10),

          // ── Date + Assigned ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormatter.timeAgo(complaint.createdAt),
                style: AppTypography.caption(color: AppColors.lightTextTertiary),
              ),
              if (complaint.assignedToName != null)
                Text(
                  'Assigned: ${complaint.assignedToName}',
                  style: AppTypography.caption(
                      color: AppColors.lightTextTertiary),
                ),
            ],
          ),

          // ── Resolution Notes ──
          if (complaint.isResolved && complaint.resolutionNotes != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.accentGreen.withValues(alpha: 0.06),
                borderRadius: AppRadius.borderMd,
                border: Border.all(
                    color: AppColors.accentGreen.withValues(alpha: 0.2)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check_circle_rounded,
                      color: AppColors.accentGreen, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      complaint.resolutionNotes!,
                      style: AppTypography.bodySm(
                          color: AppColors.lightTextSecondary),
                    ),
                  ),
                ],
              ),
            ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String status;

  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (status) {
      case 'resolved':
        color = AppColors.accentGreen;
        break;
      case 'in_progress':
        color = AppColors.accentOrange;
        break;
      case 'closed':
        color = AppColors.lightTextTertiary;
        break;
      default:
        color = AppColors.primary500;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: AppRadius.borderFull,
      ),
      child: Text(
        status.replaceAll('_', ' '),
        style: AppTypography.caption(color: color)
            .copyWith(fontWeight: FontWeight.w600),
      ),
    );
  }
}
