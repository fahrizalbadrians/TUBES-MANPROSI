import 'package:flutter/material.dart';
import 'routes/app_pages.dart';
import 'routes/app_routes.dart';

void main() {
  runApp(const GosyanduApp());
}

class GosyanduApp extends StatelessWidget {
  const GosyanduApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: AppRoutes.start,
      routes: AppPages.routes,
    );
  }
}
