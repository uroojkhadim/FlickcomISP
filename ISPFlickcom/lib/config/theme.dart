import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// ============================================================
/// ISP Service Platform — Design Token System
/// ============================================================

class AppColors {
  AppColors._();

  // ── Primary Orange Scale (Matching Admin Panel) ──
  static const Color primary50 = Color(0xFFFFF7ED);
  static const Color primary100 = Color(0xFFFFEDD5);
  static const Color primary200 = Color(0xFFFED7AA);
  static const Color primary300 = Color(0xFFFDBA74);
  static const Color primary400 = Color(0xFFFB923C);
  static const Color primary500 = Color(0xFFF59E0B);
  static const Color primary600 = Color(0xFFD97706);
  static const Color primary700 = Color(0xFFB45309);
  static const Color primary800 = Color(0xFF92400E);
  static const Color primary900 = Color(0xFF78350F);

  // ── Accent Colors ──
  static const Color accentPurple = Color(0xFF8B5CF6);
  static const Color accentCyan = Color(0xFF00BCD4);
  static const Color accentGreen = Color(0xFF10B981);
  static const Color accentBlue = Color(0xFF3B82F6);
  static const Color accentRed = Color(0xFFEF4444);
  static const Color accentPink = Color(0xFFE91E63);
  static const Color accentLime = Color(0xFF8BC34A);
  static const Color accentIndigo = Color(0xFF3F51B5);

  // ── Light Theme ──
  static const Color lightBg = Color(0xFFFFFFFF);
  static const Color lightBgSecondary = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF64748B);
  static const Color lightTextTertiary = Color(0xFF94A3B8);
  static const Color lightBorder = Color(0xFFE2E8F0);

  // ── Dark Theme ──
  static const Color darkBg = Color(0xFF0F172A);
  static const Color darkBgSecondary = Color(0xFF1E293B);
  static const Color darkBgTertiary = Color(0xFF334155);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF94A3B8);
  static const Color darkBorder = Color(0xFF334155);

  // ── Status Colors ──
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // ── Primary Gradient ──
  static const LinearGradient gradientPrimary = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF59E0B), Color(0xFF78350F)], // Match admin sidebar orange
  );

  // ── Card Gradients (Professional Tones) ──
  static const LinearGradient gradientBlueCyan = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF3B82F6), Color(0xFF1E40AF)], // Professional Blue
  );

  static const LinearGradient gradientPurplePink = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF8B5CF6), Color(0xFF5B21B6)], // Deep Purple
  );

  static const LinearGradient gradientGreenLime = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF10B981), Color(0xFF065F46)], // Modern Emerald
  );

  static const LinearGradient gradientOrangeRed = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF59E0B), Color(0xFF9A3412)], // Deep Amber/Orange
  );

  static const LinearGradient gradientIndigoPurple = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4F46E5), Color(0xFF3730A3)], // Executive Indigo
  );
}

/// ============================================================
/// Spacing Tokens
/// ============================================================
class AppSpacing {
  AppSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
  static const double xxxl = 48;
}

/// ============================================================
/// Radius Tokens
/// ============================================================
class AppRadius {
  AppRadius._();

  static const double sm = 4;
  static const double md = 8;
  static const double lg = 12;
  static const double xl = 16;
  static const double full = 999;

  static final BorderRadius borderSm = BorderRadius.circular(sm);
  static final BorderRadius borderMd = BorderRadius.circular(md);
  static final BorderRadius borderLg = BorderRadius.circular(lg);
  static final BorderRadius borderXl = BorderRadius.circular(xl);
  static final BorderRadius borderFull = BorderRadius.circular(full);
}

/// ============================================================
/// Shadow Tokens
/// ============================================================
class AppShadows {
  AppShadows._();

  static const List<BoxShadow> sm = [
    BoxShadow(color: Color(0x14000000), blurRadius: 8, offset: Offset(0, 2)),
  ];

  static const List<BoxShadow> md = [
    BoxShadow(color: Color(0x1F000000), blurRadius: 16, offset: Offset(0, 4)),
  ];

  static const List<BoxShadow> lg = [
    BoxShadow(color: Color(0x29000000), blurRadius: 32, offset: Offset(0, 8)),
  ];

  static const List<BoxShadow> xl = [
    BoxShadow(color: Color(0x33000000), blurRadius: 48, offset: Offset(0, 12)),
  ];

  static List<BoxShadow> glow(Color color, {double intensity = 0.15}) {
    return [
      BoxShadow(
        color: color.withValues(alpha: intensity),
        blurRadius: 15,
        spreadRadius: 2,
      ),
    ];
  }
}

/// ============================================================
/// Typography
/// ============================================================
class AppTypography {
  AppTypography._();

  static TextStyle get _baseStyle => GoogleFonts.outfit();

  // Headings
  static TextStyle h1({Color? color}) => _baseStyle.copyWith(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        height: 1.2,
        color: color,
      );

  static TextStyle h2({Color? color}) => _baseStyle.copyWith(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        height: 1.3,
        color: color,
      );

  static TextStyle h3({Color? color}) => _baseStyle.copyWith(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: color,
      );

  // Body
  static TextStyle bodyLg({Color? color}) => _baseStyle.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: color,
      );

  static TextStyle body({Color? color}) => _baseStyle.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: color,
      );

  static TextStyle bodySm({Color? color}) => _baseStyle.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: color,
      );

  static TextStyle caption({Color? color}) => _baseStyle.copyWith(
        fontSize: 11,
        fontWeight: FontWeight.w400,
        color: color,
      );
}

/// ============================================================
/// Theme Data — Light
/// ============================================================
ThemeData buildLightTheme() {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: AppColors.primary500,
    scaffoldBackgroundColor: const Color(0xFFF0F7FF), // Light Sky Blue Tint
    cardColor: AppColors.lightSurface,
    colorScheme: ColorScheme.light(
      primary: AppColors.primary500,
      secondary: const Color(0xFF0EA5E9), // Sky Blue
      error: AppColors.error,
      surface: AppColors.lightSurface,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.lightBg,
      foregroundColor: AppColors.lightTextPrimary,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: AppColors.lightTextPrimary,
      ),
      iconTheme: const IconThemeData(color: AppColors.lightTextPrimary),
    ),
    textTheme: TextTheme(
      headlineLarge: AppTypography.h1(color: AppColors.lightTextPrimary),
      headlineMedium: AppTypography.h2(color: AppColors.lightTextPrimary),
      headlineSmall: AppTypography.h3(color: AppColors.lightTextPrimary),
      bodyLarge: AppTypography.bodyLg(color: AppColors.lightTextPrimary),
      bodyMedium: AppTypography.body(color: AppColors.lightTextSecondary),
      bodySmall: AppTypography.bodySm(color: AppColors.lightTextTertiary),
      labelSmall: AppTypography.caption(color: AppColors.lightTextTertiary),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary500,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primary500,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        side: const BorderSide(color: AppColors.primary500, width: 1.5),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.lightBg,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.lightBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.lightBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.primary500, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.error),
      ),
      hintStyle: AppTypography.body(color: AppColors.lightTextTertiary),
      labelStyle: AppTypography.body(color: AppColors.lightTextSecondary),
    ),
    cardTheme: CardThemeData(
      color: AppColors.lightSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.borderXl,
        side: const BorderSide(color: AppColors.lightBorder, width: 1),
      ),
    ),
    dividerTheme: const DividerThemeData(
      color: AppColors.lightBorder,
      thickness: 1,
    ),
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: AppColors.lightBg,
      selectedItemColor: AppColors.primary500,
      unselectedItemColor: AppColors.lightTextTertiary,
      elevation: 8,
      type: BottomNavigationBarType.fixed,
      selectedLabelStyle: AppTypography.caption(),
      unselectedLabelStyle: AppTypography.caption(),
    ),
  );
}

/// ============================================================
/// Theme Data — Dark (Midnight Aurora)
/// ============================================================
ThemeData buildDarkTheme() {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: AppColors.accentCyan,
    scaffoldBackgroundColor: AppColors.darkBg,
    cardColor: AppColors.darkBgSecondary,
    colorScheme: ColorScheme.dark(
      primary: AppColors.accentCyan,
      secondary: AppColors.primary400,
      error: AppColors.error,
      surface: AppColors.darkBgSecondary,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.darkBg,
      foregroundColor: AppColors.darkTextPrimary,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: AppColors.darkTextPrimary,
      ),
      iconTheme: const IconThemeData(color: AppColors.darkTextPrimary),
    ),
    textTheme: TextTheme(
      headlineLarge: AppTypography.h1(color: AppColors.darkTextPrimary),
      headlineMedium: AppTypography.h2(color: AppColors.darkTextPrimary),
      headlineSmall: AppTypography.h3(color: AppColors.darkTextPrimary),
      bodyLarge: AppTypography.bodyLg(color: AppColors.darkTextPrimary),
      bodyMedium: AppTypography.body(color: AppColors.darkTextSecondary),
      bodySmall: AppTypography.bodySm(color: AppColors.darkTextSecondary),
      labelSmall: AppTypography.caption(color: AppColors.darkTextSecondary),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.accentCyan,
        foregroundColor: AppColors.darkBg,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.accentCyan,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.borderLg,
        ),
        side: const BorderSide(color: AppColors.accentCyan, width: 1.5),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.darkBgTertiary,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.accentCyan, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: AppRadius.borderLg,
        borderSide: const BorderSide(color: AppColors.error),
      ),
      hintStyle: AppTypography.body(color: AppColors.darkTextSecondary),
      labelStyle: AppTypography.body(color: AppColors.darkTextSecondary),
    ),
    cardTheme: CardThemeData(
      color: AppColors.darkBgSecondary,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.borderXl,
        side: const BorderSide(color: AppColors.darkBorder, width: 1),
      ),
    ),
    dividerTheme: const DividerThemeData(
      color: AppColors.darkBorder,
      thickness: 1,
    ),
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: AppColors.darkBgSecondary,
      selectedItemColor: AppColors.accentCyan,
      unselectedItemColor: AppColors.darkTextSecondary,
      elevation: 8,
      type: BottomNavigationBarType.fixed,
      selectedLabelStyle: AppTypography.caption(),
      unselectedLabelStyle: AppTypography.caption(),
    ),
  );
}
