import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/notification_banner.dart';
import '../../services/api_service.dart';
import '../../utils/error_handler.dart';

/// ============================================================
/// Complaint Screen — Submit a new complaint
/// ============================================================

class ComplaintScreen extends StatefulWidget {
  const ComplaintScreen({super.key});

  @override
  State<ComplaintScreen> createState() => _ComplaintScreenState();
}

class _ComplaintScreenState extends State<ComplaintScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _messageController = TextEditingController();
  String _category = 'other';
  bool _isLoading = false;

  @override
  void dispose() {
    _titleController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await ApiService.submitComplaint(
        title: _titleController.text.trim(),
        message: _messageController.text.trim(),
        category: _category,
      );
      if (mounted) {
        showAppBanner(
          context,
          message: 'Complaint submitted successfully!',
          type: BannerType.success,
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        final error = ErrorHandler.handle(e);
        showAppBanner(context, message: error.message, type: BannerType.error);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ISPAppBar(
        title: 'New Complaint',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Info Header ──
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primary500.withValues(alpha: 0.05),
                  borderRadius: AppRadius.borderLg,
                  border: Border.all(color: AppColors.primary500.withValues(alpha: 0.1)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline_rounded, color: AppColors.primary500),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Submit your issue and our technical team will resolve it within 24-48 hours.',
                        style: AppTypography.bodySm(color: AppColors.primary600),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ── Category ──
              Text('Category', style: AppTypography.bodyLg()),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                children: [
                  _CategoryChip(
                    label: '💰 Billing',
                    value: 'billing',
                    selected: _category == 'billing',
                    onTap: () => setState(() => _category = 'billing'),
                  ),
                  _CategoryChip(
                    label: '⚡ Speed',
                    value: 'speed',
                    selected: _category == 'speed',
                    onTap: () => setState(() => _category = 'speed'),
                  ),
                  _CategoryChip(
                    label: '🔌 Disconnection',
                    value: 'disconnection',
                    selected: _category == 'disconnection',
                    onTap: () => setState(() => _category = 'disconnection'),
                  ),
                  _CategoryChip(
                    label: '📋 Other',
                    value: 'other',
                    selected: _category == 'other',
                    onTap: () => setState(() => _category = 'other'),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // ── Title ──
              Text('Title', style: AppTypography.bodyLg()),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                validator: Validators.complaintTitle,
                decoration: const InputDecoration(
                  hintText: 'Brief description of the issue',
                ),
              ),
              const SizedBox(height: 20),

              // ── Message ──
              Text('Details', style: AppTypography.bodyLg()),
              const SizedBox(height: 8),
              TextFormField(
                controller: _messageController,
                validator: Validators.complaintMessage,
                maxLines: 6,
                decoration: const InputDecoration(
                  hintText: 'Describe your issue in detail...',
                ),
              ),
              const SizedBox(height: 32),

              // ── Submit ──
              CustomButton(
                label: 'Submit Complaint',
                onPressed: _submit,
                isLoading: _isLoading,
                icon: Icons.send_rounded,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String label;
  final String value;
  final bool selected;
  final VoidCallback onTap;

  const _CategoryChip({
    required this.label,
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
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary500.withValues(alpha: 0.1)
              : Theme.of(context).cardColor,
          border: Border.all(
            color: selected ? AppColors.primary500 : AppColors.lightBorder,
            width: selected ? 2 : 1,
          ),
          borderRadius: AppRadius.borderFull,
        ),
        child: Text(
          label,
          style: AppTypography.bodySm(
            color: selected ? AppColors.primary500 : AppColors.lightTextSecondary,
          ).copyWith(fontWeight: selected ? FontWeight.w600 : FontWeight.w500),
        ),
      ),
    );
  }
}
