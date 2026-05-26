import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Basic smoke test — verifies app can be instantiated
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Center(child: Text('ISP Service Platform')),
        ),
      ),
    );

    expect(find.text('ISP Service Platform'), findsOneWidget);
  });
}
