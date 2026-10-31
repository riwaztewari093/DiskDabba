import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:diskdabba/app/app.dart';

void main() {
  testWidgets('App renders without crashing', (WidgetTester tester) async {
    await tester.pumpWidget(const DiskDabbaApp());
    expect(find.text('DiskDabba'), findsOneWidget);
  });
}
