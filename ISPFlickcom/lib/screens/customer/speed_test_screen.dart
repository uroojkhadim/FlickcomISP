import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_internet_speed_test/flutter_internet_speed_test.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_button.dart';

class SpeedTestScreen extends StatefulWidget {
  const SpeedTestScreen({super.key});

  @override
  State<SpeedTestScreen> createState() => _SpeedTestScreenState();
}

class _SpeedTestScreenState extends State<SpeedTestScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final internetSpeedTest = FlutterInternetSpeedTest()..enableLog();
  
  bool _isTesting = false;
  double _currentSpeed = 0.0;
  double _downloadSpeed = 0.0;
  double _uploadSpeed = 0.0;
  int _ping = 0;
  String _unit = 'Mbps';
  String _testStatus = 'Idle';
  double _testPercent = 0.0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _startTest() {
    if (_isTesting) return;

    setState(() {
      _isTesting = true;
      _currentSpeed = 0.0;
      _downloadSpeed = 0.0;
      _uploadSpeed = 0.0;
      _ping = 0;
      _testStatus = 'Starting...';
      _testPercent = 0.0;
    });

    internetSpeedTest.startTesting(
      useFastApi: false, // More reliable for international/local servers than Fast API
      downloadTestServer: '', // Empty for auto-selection
      uploadTestServer: '', 

      onStarted: () {
        setState(() {
          _isTesting = true;
          _testStatus = 'Test Started';
        });
      },
      onCompleted: (TestResult download, TestResult upload) {
        setState(() {
          _isTesting = false;
          _downloadSpeed = download.transferRate;
          _uploadSpeed = upload.transferRate;
          _currentSpeed = 0.0;
          _testStatus = 'Completed';
          _testPercent = 100.0;
        });
      },
      onProgress: (double percent, TestResult data) {
        setState(() {
          _unit = data.unit == SpeedUnit.mbps ? 'Mbps' : 'Kbps';
          _testPercent = percent;
          if (data.type == TestType.download) {
            _downloadSpeed = data.transferRate;
            _testStatus = 'Downloading...';
          } else {
            _uploadSpeed = data.transferRate;
            _testStatus = 'Uploading...';
          }
          _currentSpeed = data.transferRate;
        });
      },
      onError: (String errorMessage, String speedTestError) {
        setState(() {
          _isTesting = false;
          _testStatus = 'Error occurred';
        });
        debugPrint('SpeedTest Error: $errorMessage ($speedTestError)');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Test Error: $errorMessage'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      },
      onDefaultServerSelectionInProgress: () {
        setState(() => _testStatus = 'Selecting Server...');
      },
      onDefaultServerSelectionDone: (Client? client) {
        setState(() {
          _ping = client?.latency ?? 0;
          _testStatus = 'Server Selected';
        });
      },
      onDownloadComplete: (TestResult data) {
        setState(() => _downloadSpeed = data.transferRate);
      },
      onUploadComplete: (TestResult data) {
        setState(() => _uploadSpeed = data.transferRate);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ISPAppBar(
        title: 'Speed Test',
        showBackButton: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 20),
            
            // ── Speed Gauge ──
            Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                   SizedBox(
                    width: 300,
                    height: 300,
                    child: CustomPaint(
                      painter: SpeedGaugePainter(value: _currentSpeed),
                    ),
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _currentSpeed.toStringAsFixed(1),
                        style: AppTypography.h1(color: AppColors.primary600)
                            .copyWith(fontSize: 48, fontWeight: FontWeight.w900),
                      ),
                      Text(
                        _unit,
                        style: AppTypography.body(color: AppColors.lightTextSecondary),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            if (_isTesting)
              Text(
                _testStatus,
                style: AppTypography.body(color: AppColors.primary600)
                    .copyWith(fontWeight: FontWeight.bold),
              ),
            const SizedBox(height: 30),

            // ── Metrics ──
            Row(
              children: [
                Expanded(
                  child: _MetricCard(
                    label: 'PING',
                    value: '$_ping ms',
                    icon: Icons.timer_outlined,
                    color: AppColors.accentOrange,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _MetricCard(
                    label: 'DOWNLOAD',
                    value: '${_downloadSpeed.toStringAsFixed(1)} $_unit',
                    icon: Icons.download_rounded,
                    color: AppColors.primary500,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _MetricCard(
                    label: 'UPLOAD',
                    value: '${_uploadSpeed.toStringAsFixed(1)} $_unit',
                    icon: Icons.upload_rounded,
                    color: AppColors.accentPurple,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),

            // ── Test Button ──
            CustomButton(
              label: _isTesting ? 'Testing...' : 'Start Speed Test',
              onPressed: _isTesting ? null : _startTest,
              icon: Icons.bolt_rounded,
            ),
            
            const SizedBox(height: 24),
            Text(
              'Testing server: Faisalabad, PK\nISP: source_plain_internet',
              textAlign: TextAlign.center,
              style: AppTypography.caption(color: AppColors.lightTextTertiary),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _MetricCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.05),
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: color.withValues(alpha: 0.1)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(label, style: AppTypography.caption(color: AppColors.lightTextTertiary)),
          const SizedBox(height: 4),
          Text(
            value,
            style: AppTypography.bodySm().copyWith(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

class SpeedGaugePainter extends CustomPainter {
  final double value; // 0 to 100 Mbps
  SpeedGaugePainter({required this.value});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final strokeWidth = 15.0;

    // Background track
    final bgPaint = Paint()
      ..color = Colors.grey.withValues(alpha: 0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius - strokeWidth),
      math.pi * 0.8,
      math.pi * 1.4,
      false,
      bgPaint,
    );

    // Progress track
    final progressPaint = Paint()
      ..shader = AppColors.gradientPrimary.createShader(
        Rect.fromCircle(center: center, radius: radius),
      )
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final sweepAngle = (value / 100).clamp(0.0, 1.0) * math.pi * 1.4;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius - strokeWidth),
      math.pi * 0.8,
      sweepAngle,
      false,
      progressPaint,
    );

    // Draw ticks
    final tickPaint = Paint()
      ..color = AppColors.lightTextTertiary.withValues(alpha: 0.3)
      ..strokeWidth = 2;

    for (var i = 0; i <= 10; i++) {
      final angle = math.pi * 0.8 + (i / 10) * math.pi * 1.4;
      final start = Offset(
        center.dx + (radius - 40) * math.cos(angle),
        center.dy + (radius - 40) * math.sin(angle),
      );
      final end = Offset(
        center.dx + (radius - 30) * math.cos(angle),
        center.dy + (radius - 30) * math.sin(angle),
      );
      canvas.drawLine(start, end, tickPaint);
    }
  }

  @override
  bool shouldRepaint(covariant SpeedGaugePainter oldDelegate) => oldDelegate.value != value;
}
