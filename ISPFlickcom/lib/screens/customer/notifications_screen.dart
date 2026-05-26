import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/theme.dart';
import '../../models/notification_model.dart';
import '../../services/api_service.dart';
import '../../utils/date_formatter.dart';
import '../../utils/error_handler.dart';
import '../../widgets/loading_shimmer.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/error_widget.dart';

final notificationsProvider =
    FutureProvider.autoDispose<List<NotificationModel>>((ref) async {
  final response = await ApiService.getNotifications();
  return (response['notifications'] as List)
      .map((n) => NotificationModel.fromJson(n))
      .toList();
});

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(notificationsProvider);

    return Scaffold(
      appBar: ISPAppBar(
        title: 'Notifications',
        actions: [
          TextButton(
            onPressed: () async {
              await ApiService.markAllNotificationsRead();
              ref.invalidate(notificationsProvider);
            },
            child: const Text('Read All', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: async.when(
        data: (items) => items.isEmpty
            ? const EmptyStateWidget(
                title: 'No Notifications', icon: Icons.notifications_off_outlined)
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: items.length,
                itemBuilder: (ctx, i) => _NotifTile(notif: items[i], ref: ref),
              ),
        loading: () => const LoadingShimmer(layout: ShimmerLayout.list),
        error: (e, st) => AppErrorWidget(
          message: ErrorHandler.handle(e).message,
          onRetry: () => ref.invalidate(notificationsProvider),
        ),
      ),
    );
  }
}

class _NotifTile extends StatelessWidget {
  final NotificationModel notif;
  final WidgetRef ref;
  const _NotifTile({required this.notif, required this.ref});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        if (!notif.isRead) {
          await ApiService.markNotificationRead(notif.id);
          ref.invalidate(notificationsProvider);
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: notif.isRead ? Theme.of(context).cardColor : AppColors.primary50,
          border: Border.all(color: AppColors.lightBorder),
          borderRadius: AppRadius.borderLg,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(notif.typeIcon, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(notif.title, style: AppTypography.bodyLg()),
                  const SizedBox(height: 4),
                  Text(notif.message,
                      style: AppTypography.bodySm(color: AppColors.lightTextSecondary),
                      maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 6),
                  Text(DateFormatter.timeAgo(notif.createdAt),
                      style: AppTypography.caption(color: AppColors.lightTextTertiary)),
                ],
              ),
            ),
            if (!notif.isRead)
              Container(
                width: 8, height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.primary500, shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
