import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

/// ============================================================
/// LoadingShimmer — Skeleton placeholder for loading states
/// ============================================================

class LoadingShimmer extends StatelessWidget {
  final int itemCount;
  final ShimmerLayout layout;

  const LoadingShimmer({
    super.key,
    this.itemCount = 4,
    this.layout = ShimmerLayout.dashboard,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? const Color(0xFF242A35) : Colors.grey.shade200;
    final highlightColor =
        isDark ? const Color(0xFF333B4A) : Colors.grey.shade50;

    return Shimmer.fromColors(
      baseColor: baseColor,
      highlightColor: highlightColor,
      child: _buildLayout(context),
    );
  }

  Widget _buildLayout(BuildContext context) {
    switch (layout) {
      case ShimmerLayout.dashboard:
        return _dashboardShimmer();
      case ShimmerLayout.list:
        return _listShimmer();
      case ShimmerLayout.card:
        return _cardShimmer();
      case ShimmerLayout.profile:
        return _profileShimmer();
    }
  }

  Widget _dashboardShimmer() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome text placeholder
          Container(
            width: 200,
            height: 28,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: 150,
            height: 16,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(height: 24),

          // Grid cards placeholder
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.3,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            children: List.generate(
              4,
              (i) => Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Progress bar placeholder
          Container(
            width: double.infinity,
            height: 10,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(5),
            ),
          ),
          const SizedBox(height: 24),

          // Large card placeholder
          Container(
            width: double.infinity,
            height: 160,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ],
      ),
    );
  }

  Widget _listShimmer() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: itemCount,
      itemBuilder: (context, index) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Container(
          height: 80,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Widget _cardShimmer() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  Widget _profileShimmer() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Avatar
          const CircleAvatar(radius: 48, backgroundColor: Colors.white),
          const SizedBox(height: 16),
          Container(
            width: 160,
            height: 22,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: 120,
            height: 14,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(height: 32),
          // Info rows
          ...List.generate(
            5,
            (i) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Container(
                width: double.infinity,
                height: 52,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

enum ShimmerLayout { dashboard, list, card, profile }
