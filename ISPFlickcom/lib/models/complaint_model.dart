// ============================================================
// Complaint Model
// ============================================================

class ComplaintModel {
  final String id;
  final String userId;
  final String title;
  final String message;
  final String category; // 'billing' | 'speed' | 'disconnection' | 'other'
  final String status; // 'open' | 'in_progress' | 'resolved' | 'closed'
  final String priority; // 'low' | 'medium' | 'high'
  final String? assignedTo;
  final String? assignedToName;
  final String? resolutionNotes;
  final DateTime? resolvedAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const ComplaintModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.message,
    this.category = 'other',
    this.status = 'open',
    this.priority = 'medium',
    this.assignedTo,
    this.assignedToName,
    this.resolutionNotes,
    this.resolvedAt,
    this.createdAt,
    this.updatedAt,
  });

  bool get isOpen => status == 'open';
  bool get isInProgress => status == 'in_progress';
  bool get isResolved => status == 'resolved';

  /// Category display with emoji
  String get categoryDisplay {
    switch (category) {
      case 'billing':
        return '💰 Billing';
      case 'speed':
        return '⚡ Speed';
      case 'disconnection':
        return '🔌 Disconnection';
      default:
        return '📋 Other';
    }
  }

  /// Priority display with color context
  String get priorityDisplay {
    switch (priority) {
      case 'high':
        return '🔴 High';
      case 'medium':
        return '🟡 Medium';
      case 'low':
        return '🟢 Low';
      default:
        return priority;
    }
  }

  /// Status display
  String get statusDisplay {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  }

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      category: json['category'] ?? 'other',
      status: json['status'] ?? 'open',
      priority: json['priority'] ?? 'medium',
      assignedTo: json['assigned_to'] is Map
          ? json['assigned_to']['id']
          : json['assigned_to'],
      assignedToName: json['assigned_to'] is Map
          ? json['assigned_to']['name']
          : null,
      resolutionNotes: json['resolution_notes'],
      resolvedAt: json['resolved_at'] != null
          ? DateTime.tryParse(json['resolved_at'])
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'message': message,
      'category': category,
    };
  }
}
