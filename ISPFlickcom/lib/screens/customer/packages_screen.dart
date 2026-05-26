import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../models/package_model.dart';
import '../../services/api_service.dart';
import '../../utils/currency_formatter.dart';
import '../../utils/error_handler.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/loading_shimmer.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/error_widget.dart';

/// Provider
final packagesProvider = FutureProvider.autoDispose<List<PackageModel>>((ref) async {
  final response = await ApiService.getPackages();
  return (response['packages'] as List)
      .map((p) => PackageModel.fromJson(p))
      .toList();
});

/// ============================================================
/// Packages Screen — Browse available packages
/// ============================================================

class PackagesScreen extends ConsumerStatefulWidget {
  const PackagesScreen({super.key});

  @override
  ConsumerState<PackagesScreen> createState() => _PackagesScreenState();
}

class _PackagesScreenState extends ConsumerState<PackagesScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';

  static const _gradients = [
    AppColors.gradientBlueCyan,
    AppColors.gradientPurplePink,
    AppColors.gradientGreenLime,
    AppColors.gradientOrangeRed,
    AppColors.gradientIndigoPurple,
  ];

  final List<String> _categories = ['All', 'Basic', 'Pro', 'Premium'];

  @override
  Widget build(BuildContext context) {
    final packagesAsync = ref.watch(packagesProvider);

    return Scaffold(
      appBar: ISPAppBar(
        title: 'Packages',
        showBackButton: false,
        onMenuPressed: () => Scaffold.of(context).openDrawer(),
      ),
      body: packagesAsync.when(
        data: (packages) {
          final filteredPackages = packages.where((pkg) {
            final matchesSearch = pkg.name.toLowerCase().contains(_searchQuery.toLowerCase());
            final matchesCategory = _selectedCategory == 'All' || 
                                   pkg.name.toLowerCase().contains(_selectedCategory.toLowerCase());
            return matchesSearch && matchesCategory;
          }).toList();

          return Column(
            children: [
              // ── Search & Filter Bar ──
              _buildSearchBar(),
              _buildFilterChips(),
              
              Expanded(
                child: _buildList(context, filteredPackages),
              ),
            ],
          );
        },
        loading: () => const LoadingShimmer(layout: ShimmerLayout.list),
        error: (e, st) => AppErrorWidget(
          message: ErrorHandler.handle(e).message,
          onRetry: () => ref.invalidate(packagesProvider),
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: TextField(
        onChanged: (val) => setState(() => _searchQuery = val),
        decoration: InputDecoration(
          hintText: 'Search packages...',
          prefixIcon: const Icon(Icons.search_rounded, color: AppColors.primary500),
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: AppRadius.borderLg,
            borderSide: BorderSide(color: AppColors.primary500.withValues(alpha: 0.1)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: AppRadius.borderLg,
            borderSide: BorderSide(color: AppColors.primary500.withValues(alpha: 0.1)),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: _categories.map((cat) {
          final isSelected = _selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(cat),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) setState(() => _selectedCategory = cat);
              },
              selectedColor: AppColors.primary500,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : AppColors.lightTextSecondary,
                fontWeight: FontWeight.w600,
              ),
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: AppRadius.borderFull,
                side: BorderSide(
                  color: isSelected ? AppColors.primary500 : AppColors.lightBorder,
                ),
              ),
              showCheckmark: false,
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildList(BuildContext context, List<PackageModel> packages) {
    if (packages.isEmpty) {
      return const EmptyStateWidget(
        title: 'No Packages Found',
        subtitle: 'Try adjusting your search or filters.',
        icon: Icons.search_off_rounded,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: packages.length,
      itemBuilder: (context, index) {
        final pkg = packages[index];
        final gradient = _gradients[index % _gradients.length];

        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: GlassCard(
            gradient: gradient,
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Header ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      pkg.name,
                      style: AppTypography.h2(color: Colors.white),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: AppRadius.borderFull,
                      ),
                      child: Text(
                        pkg.mbDisplay,
                        style: AppTypography.bodySm(color: Colors.white)
                            .copyWith(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // ── Description ──
                if (pkg.description != null)
                  Text(
                    pkg.description!,
                    style: AppTypography.body(
                      color: Colors.white.withValues(alpha: 0.8),
                    ),
                  ),
                const SizedBox(height: 16),

                // ── Details ──
                Row(
                  children: [
                    _InfoChip(
                      icon: Icons.calendar_month_rounded,
                      label: pkg.validityDisplay,
                    ),
                    const SizedBox(width: 12),
                    _InfoChip(
                      icon: Icons.data_usage_rounded,
                      label: pkg.mbDisplay,
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // ── Price + Subscribe ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          CurrencyFormatter.format(pkg.pricePkr),
                          style: AppTypography.h2(color: Colors.white),
                        ),
                        Text(
                          '/ ${pkg.validityDisplay}',
                          style: AppTypography.caption(
                            color: Colors.white.withValues(alpha: 0.6),
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      onPressed: () => context.push('/payment'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: (gradient).colors.first,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: AppRadius.borderFull,
                        ),
                      ),
                      child: const Text('Subscribe'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.15),
        borderRadius: AppRadius.borderFull,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 14),
          const SizedBox(width: 6),
          Text(label,
              style: AppTypography.caption(color: Colors.white)
                  .copyWith(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
