import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:diskdabba/core/supabase/supabase_client.dart';
import 'package:diskdabba/app/app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: '.env');

  // Initialize Supabase
  await SupabaseClientManager.initialize();

  runApp(
    const ProviderScope(
      child: DiskDabbaApp(),
    ),
  );
}
