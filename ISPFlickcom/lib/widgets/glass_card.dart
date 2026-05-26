import 'dart:ui';
import 'package:flutter/material.dart';

/// ============================================================
/// GlassCard — Animated Glassmorphism Card with Shimmer Effect
/// ============================================================

class GlassCard extends StatefulWidget {
  final Gradient gradient;
  final Widget child;
  final VoidCallback? onTap;
  final double glowIntensity;
  final EdgeInsetsGeometry padding;
  final double borderRadius;

  const GlassCard({
    super.key,
    required this.gradient,
    required this.child,
    this.onTap,
    this.glowIntensity = 0.15, // Reduced from 0.3 for a more professional look
    this.padding = const EdgeInsets.all(16),
    this.borderRadius = 16,
  });

  @override
  State<GlassCard> createState() => _GlassCardState();
}

class _GlassCardState extends State<GlassCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();
    _shimmerController = AnimationController(
      duration: const Duration(seconds: 4), // Slower shimmer
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Extract first color from gradient for glow
    final glowColor = (widget.gradient as LinearGradient).colors.first;

    return GestureDetector(
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _shimmerController,
        builder: (context, child) {
          return Container(
            decoration: BoxDecoration(
              gradient: widget.gradient,
              borderRadius: BorderRadius.circular(widget.borderRadius),
              boxShadow: [
                BoxShadow(
                  color: glowColor.withValues(alpha: widget.glowIntensity),
                  blurRadius: 15, // Reduced from 20
                  spreadRadius: 1, // Reduced from 2
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(widget.borderRadius),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8), // Slightly reduced blur
                child: Stack(
                  children: [
                    // ── Glass border ──
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.15), // Reduced from 0.2
                          width: 1,
                        ),
                        borderRadius: BorderRadius.circular(widget.borderRadius),
                      ),
                    ),

                    // ── Shimmer overlay ──
                    Positioned.fill(
                      child: _buildShimmer(),
                    ),

                    // ── Content ──
                    Padding(
                      padding: widget.padding,
                      child: widget.child,
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildShimmer() {
    return AnimatedBuilder(
      animation: _shimmerController,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.transparent,
                Colors.white.withValues(alpha: 0.05), // Reduced from 0.08
                Colors.transparent,
              ],
              stops: [
                _shimmerController.value - 0.2,
                _shimmerController.value,
                _shimmerController.value + 0.2,
              ].map((s) => s.clamp(0.0, 1.0)).toList(),
            ).createShader(bounds);
          },
          blendMode: BlendMode.srcATop,
          child: Container(
            color: Colors.white.withValues(alpha: 0.02), // Reduced from 0.05
          ),
        );
      },
    );
  }
}
