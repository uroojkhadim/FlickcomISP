// ============================================================
// Input Validators
// ============================================================

class Validators {
  Validators._();

  /// Email validation
  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Enter a valid email address';
    }
    return null;
  }

  /// Password validation (min 8 chars, uppercase, lowercase, number, special)
  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Password must contain an uppercase letter';
    }
    if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Password must contain a lowercase letter';
    }
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return 'Password must contain a number';
    }
    if (!RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(value)) {
      return 'Password must contain a special character';
    }
    return null;
  }

  /// Confirm password
  static String? confirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    if (value != password) {
      return 'Passwords do not match';
    }
    return null;
  }

  /// Name validation
  static String? name(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Name is required';
    }
    if (value.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }
    if (value.trim().length > 100) {
      return 'Name must be less than 100 characters';
    }
    return null;
  }

  /// CNIC validation (Pakistan format: 12345-6789012-3)
  static String? cnic(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'CNIC is required';
    }
    final cnicRegex = RegExp(r'^\d{5}-\d{7}-\d{1}$');
    if (!cnicRegex.hasMatch(value.trim())) {
      return 'Enter valid CNIC (e.g., 12345-6789012-3)';
    }
    return null;
  }

  /// Phone validation (Pakistan format: +923001234567)
  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Phone number is required';
    }
    final phoneRegex = RegExp(r'^\+92\d{10}$');
    if (!phoneRegex.hasMatch(value.trim())) {
      return 'Enter valid phone (e.g., +923001234567)';
    }
    return null;
  }

  /// Address validation
  static String? address(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Address is required';
    }
    if (value.trim().length < 10) {
      return 'Please enter a complete address';
    }
    return null;
  }

  /// Required field
  static String? required(String? value, [String fieldName = 'This field']) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  /// Complaint title
  static String? complaintTitle(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Title is required';
    }
    if (value.trim().length < 5) {
      return 'Title must be at least 5 characters';
    }
    if (value.trim().length > 200) {
      return 'Title must be less than 200 characters';
    }
    return null;
  }

  /// Complaint message
  static String? complaintMessage(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please describe your issue';
    }
    if (value.trim().length < 20) {
      return 'Please provide more details (at least 20 characters)';
    }
    return null;
  }
}
