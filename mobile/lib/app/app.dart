import 'package:flutter/material.dart';
import 'package:diskdabba/app/theme.dart';
import 'package:diskdabba/app/router.dart';

class DiskDabbaApp extends StatelessWidget {
  const DiskDabbaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'DiskDabba',
      debugShowCheckedModeBanner: false,
      theme: DiskDabbaTheme.lightTheme,
      darkTheme: DiskDabbaTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
    );
  }
}
