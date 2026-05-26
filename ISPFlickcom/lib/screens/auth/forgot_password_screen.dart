import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/notification_banner.dart';
import '../../services/auth_service.dart';
import '../../utils/error_handler.dart';

/// ============================================================
/// Forgot Password Screen
/// ============================================================

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isLoading = false;
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _sendResetEmail() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await AuthService.forgotPassword(_emailController.text.trim());
      if (mounted) {
        setState(() {
          _isLoading = false;
          _emailSent = true;
        });
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
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0D47A1),
              Color(0xFF1565C0),
              Color(0xFF1976D2),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 24),

                // ── Back + Title ──
                Row(
                  children: [
                    IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(Icons.arrow_back_rounded,
                          color: Colors.white),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Reset Password',
                      style: AppTypography.h2(color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 60),

                // ── Icon ──
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _emailSent ? Icons.mark_email_read_rounded : Icons.lock_reset_rounded,
                    size: 40,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 32),

                if (_emailSent)
                  _buildSuccessState()
                else
                  _buildFormState(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormState() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.borderXl,
        boxShadow: AppShadows.xl,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            Text(
              'Enter your email address and we\'ll send you a reset link.',
              textAlign: TextAlign.center,
              style: AppTypography.body(color: AppColors.lightTextSecondary),
            ),
            const SizedBox(height: 24),
            TextFormField(
              controller: _emailController,
              validator: Validators.email,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                hintText: 'Enter your email',
                prefixIcon: Icon(Icons.email_outlined, size: 20),
              ),
            ),
            const SizedBox(height: 24),
            CustomButton(
              label: 'Send Reset Link',
              onPressed: _sendResetEmail,
              isLoading: _isLoading,
              icon: Icons.send_rounded,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessState() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.borderXl,
        boxShadow: AppShadows.xl,
      ),
      child: Column(
        children: [
          const Icon(
            Icons.check_circle_rounded,
            color: AppColors.accentGreen,
            size: 56,
          ),
          const SizedBox(height: 16),
          Text(
            'Email Sent!',
            style: AppTypography.h3(color: AppColors.lightTextPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            'Check your inbox for the password reset link. It may take a few minutes.',
            textAlign: TextAlign.center,
            style: AppTypography.body(color: AppColors.lightTextSecondary),
          ),
          const SizedBox(height: 24),
          CustomButton(
            label: 'Back to Login',
            onPressed: () => context.go('/login'),
            variant: ButtonVariant.secondary,
          ),
        ],
      ),
    );
  }
}
