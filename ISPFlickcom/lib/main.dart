import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'config/theme.dart';
import 'config/router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'https://tbyxzyaeaiahhjvkjzzj.supabase.co',
    anonKey: 'sb_publishable_0cCer12C5c2Rgaw0zIJzkQ_NADLGaxd',
  );

  runApp(const ProviderScope(child: ISPApp()));
}

class ISPApp extends ConsumerWidget {
  const ISPApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'Source Plain Internet',
      debugShowCheckedModeBanner: false,
      theme: buildLightTheme(),
      darkTheme: buildDarkTheme(),
      themeMode: ThemeMode.light,
      routerConfig: router,
    );
  }
}
