import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../config/theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/notification_banner.dart';

/// ============================================================
/// Register Screen — Full customer registration
/// ============================================================

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _cnicController = TextEditingController();
  final _addressController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _nameController.dispose();
    _cnicController.dispose();
    _addressController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authProvider.notifier).register(
          name: _nameController.text.trim(),
          cnic: _cnicController.text.trim(),
          address: _addressController.text.trim(),
          email: _emailController.text.trim(),
          phone: _phoneController.text.trim(),
          password: _passwordController.text,
        );

    if (success && mounted) {
      showAppBanner(
        context,
        message: 'Account created! Awaiting admin approval.',
        type: BannerType.success,
      );
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

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
                      'Create Account',
                      style: AppTypography.h2(color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.only(left: 56),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Fill in your details to get started',
                      style: AppTypography.body(
                        color: Colors.white.withValues(alpha: 0.7),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // ── Error Banner ──
                if (authState.error != null) ...[
                  NotificationBanner(
                    message: authState.error!,
                    type: BannerType.error,
                    onDismiss: () =>
                        ref.read(authProvider.notifier).clearError(),
                  ),
                  const SizedBox(height: 16),
                ],

                // ── Form Card ──
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: AppRadius.borderXl,
                    boxShadow: AppShadows.xl,
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Full Name
                        _buildLabel('Full Name'),
                        TextFormField(
                          controller: _nameController,
                          validator: Validators.name,
                          textCapitalization: TextCapitalization.words,
                          decoration: const InputDecoration(
                            hintText: 'e.g., Ahmed Ali',
                            prefixIcon: Icon(Icons.person_outline, size: 20),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // CNIC
                        _buildLabel('CNIC Number'),
                        TextFormField(
                          controller: _cnicController,
                          validator: Validators.cnic,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            hintText: 'e.g., 12345-6789012-3',
                            prefixIcon:
                                Icon(Icons.badge_outlined, size: 20),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Address
                        _buildLabel('Address'),
                        TextFormField(
                          controller: _addressController,
                          validator: Validators.address,
                          maxLines: 2,
                          decoration: const InputDecoration(
                            hintText: 'Your full address',
                            prefixIcon:
                                Icon(Icons.location_on_outlined, size: 20),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Email
                        _buildLabel('Email'),
                        TextFormField(
                          controller: _emailController,
                          validator: Validators.email,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            hintText: 'e.g., ahmed@example.com',
                            prefixIcon:
                                Icon(Icons.email_outlined, size: 20),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Phone
                        _buildLabel('Phone Number'),
                        TextFormField(
                          controller: _phoneController,
                          validator: Validators.phone,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                            hintText: 'e.g., +923001234567',
                            prefixIcon:
                                Icon(Icons.phone_outlined, size: 20),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Password
                        _buildLabel('Password'),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          validator: Validators.password,
                          decoration: InputDecoration(
                            hintText: 'Min 8 chars, uppercase, number, special',
                            prefixIcon:
                                const Icon(Icons.lock_outline, size: 20),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                size: 20,
                              ),
                              onPressed: () => setState(
                                  () => _obscurePassword = !_obscurePassword),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Confirm Password
                        _buildLabel('Confirm Password'),
                        TextFormField(
                          controller: _confirmPasswordController,
                          obscureText: _obscureConfirm,
                          validator: (v) => Validators.confirmPassword(
                              v, _passwordController.text),
                          decoration: InputDecoration(
                            hintText: 'Re-enter your password',
                            prefixIcon:
                                const Icon(Icons.lock_outline, size: 20),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscureConfirm
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                size: 20,
                              ),
                              onPressed: () => setState(
                                  () => _obscureConfirm = !_obscureConfirm),
                            ),
                          ),
                        ),
                        const SizedBox(height: 28),

                        // Register Button
                        CustomButton(
                          label: 'Create Account',
                          onPressed: _register,
                          isLoading: authState.isLoading,
                          icon: Icons.person_add_rounded,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // ── Login Link ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already have an account? ',
                      style: AppTypography.body(
                        color: Colors.white.withValues(alpha: 0.7),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.go('/login'),
                      child: Text(
                        'Sign In',
                        style: AppTypography.bodyLg(color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: AppTypography.bodySm(color: AppColors.lightTextSecondary),
      ),
    );
  }
}
