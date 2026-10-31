import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Manages the Supabase client instance.
///
/// Call [initialize] once at app startup (in main.dart).
/// Then use [client] anywhere to access the Supabase client.
class SupabaseClientManager {
  SupabaseClientManager._();

  static SupabaseClient get client => Supabase.instance.client;

  static Future<void> initialize() async {
    final url = dotenv.env['SUPABASE_URL'];
    final anonKey = dotenv.env['SUPABASE_ANON_KEY'];

    if (url == null || url.isEmpty) {
      throw Exception(
        'SUPABASE_URL is not set. Copy .env.example to .env and fill in your credentials.',
      );
    }
    if (anonKey == null || anonKey.isEmpty) {
      throw Exception(
        'SUPABASE_ANON_KEY is not set. Copy .env.example to .env and fill in your credentials.',
      );
    }

    await Supabase.initialize(
      url: url,
      anonKey: anonKey,
    );
  }
}
