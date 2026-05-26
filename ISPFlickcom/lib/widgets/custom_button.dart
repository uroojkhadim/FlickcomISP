import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/theme.dart';

/// ============================================================
/// CustomButton — Primary / Secondary / Danger Variants
/// ============================================================

enum ButtonVariant { primary, secondary, danger, ghost }

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final bool fullWidth;
  final double? height;

  const CustomButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.fullWidth = true,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: height ?? 52,
      child: _buildButton(context),
    );
  }

  Widget _buildButton(BuildContext context) {
    switch (variant) {
      case ButtonVariant.primary:
        return _primaryButton(context);
      case ButtonVariant.secondary:
        return _secondaryButton(context);
      case ButtonVariant.danger:
        return _dangerButton(context);
      case ButtonVariant.ghost:
        return _ghostButton(context);
    }
  }

  Widget _primaryButton(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: (onPressed != null && !isLoading) ? AppColors.gradientPrimary : null,
        color: (onPressed == null || isLoading) ? Colors.grey.shade300 : null,
        borderRadius: AppRadius.borderLg,
        boxShadow: (onPressed != null && !isLoading) 
          ? [BoxShadow(color: const Color(0xFF3B82F6).withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4))] 
          : null,
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          shadowColor: Colors.transparent, // Disable default shadow
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: AppRadius.borderLg,
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
        child: _buildContent(Colors.white),
      ),
    );
  }

  Widget _secondaryButton(BuildContext context) {
    return OutlinedButton(
      onPressed: isLoading ? null : onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primary500,
        side: const BorderSide(color: AppColors.primary500, width: 1.5),
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
      child: _buildContent(AppColors.primary500),
    );
  }

  Widget _dangerButton(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.accentRed,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
      child: _buildContent(Colors.white),
    );
  }

  Widget _ghostButton(BuildContext context) {
    return TextButton(
      onPressed: isLoading ? null : onPressed,
      style: TextButton.styleFrom(
        foregroundColor: AppColors.primary500,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
      child: _buildContent(AppColors.primary500),
    );
  }

  Widget _buildContent(Color color) {
    if (isLoading) {
      return SizedBox(
        width: 22,
        height: 22,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          valueColor: AlwaysStoppedAnimation(color),
        ),
      );
    }

    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 8),
          Text(label),
        ],
      );
    }

    return Text(label);
  }
}
