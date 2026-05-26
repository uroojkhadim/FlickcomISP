import 'package:flutter/material.dart';

/// ============================================================
/// AnimatedProgressBar — Gradient-filled progress indicator
/// ============================================================

class AnimatedProgressBar extends StatelessWidget {
  final double percentage;
  final Color backgroundColor;
  final Gradient fillGradient;
  final String? label;
  final double height;
  final bool showPercentage;

  const AnimatedProgressBar({
    super.key,
    required this.percentage,
    this.backgroundColor = const Color(0xFFE5E5E5),
    this.fillGradient = const LinearGradient(
      colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
    ),
    this.label,
    this.height = 10,
    this.showPercentage = true,
  });

  @override
  Widget build(BuildContext context) {
    final clampedPercentage = percentage.clamp(0.0, 100.0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Label + Percentage row ──
        if (label != null || showPercentage)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (label != null)
                  Text(
                    label!,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                if (showPercentage)
                  Text(
                    '${clampedPercentage.toStringAsFixed(1)}%',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: _getPercentageColor(clampedPercentage),
                        ),
                  ),
              ],
            ),
          ),

        // ── Bar ──
        Container(
          height: height,
          decoration: BoxDecoration(
            color: backgroundColor.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(height / 2),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(height / 2),
            child: Stack(
              children: [
                // Fill
                AnimatedFractionallySizedBox(
                  duration: const Duration(milliseconds: 800),
                  curve: Curves.easeOutCubic,
                  alignment: Alignment.centerLeft,
                  widthFactor: clampedPercentage / 100,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: fillGradient,
                      borderRadius: BorderRadius.circular(height / 2),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Color _getPercentageColor(double pct) {
    if (pct >= 90) return const Color(0xFFF44336); // Red
    if (pct >= 75) return const Color(0xFFFF9800); // Orange
    if (pct >= 50) return const Color(0xFF2196F3); // Blue
    return const Color(0xFF4CAF50); // Green
  }
}

/// Animated version of FractionallySizedBox
class AnimatedFractionallySizedBox extends ImplicitlyAnimatedWidget {
  final double widthFactor;
  final AlignmentGeometry alignment;
  final Widget child;

  const AnimatedFractionallySizedBox({
    super.key,
    required this.widthFactor,
    this.alignment = Alignment.center,
    required this.child,
    required super.duration,
    super.curve = Curves.linear,
  });

  @override
  AnimatedWidgetBaseState<AnimatedFractionallySizedBox> createState() =>
      _AnimatedFractionallySizedBoxState();
}

class _AnimatedFractionallySizedBoxState
    extends AnimatedWidgetBaseState<AnimatedFractionallySizedBox> {
  Tween<double>? _widthFactor;

  @override
  void forEachTween(TweenVisitor<dynamic> visitor) {
    _widthFactor = visitor(
      _widthFactor,
      widget.widthFactor,
      (dynamic value) => Tween<double>(begin: value as double),
    ) as Tween<double>?;
  }

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      alignment: widget.alignment,
      widthFactor: _widthFactor?.evaluate(animation) ?? widget.widthFactor,
      child: widget.child,
    );
  }
}
