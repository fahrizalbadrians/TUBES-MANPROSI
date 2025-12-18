import 'package:flutter/material.dart';
import '../routes/app_routes.dart';

class StartPage extends StatelessWidget {
  const StartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: InkWell(
        onTap: () {
          Navigator.pushReplacementNamed(context, AppRoutes.welcome);
        },
        child: Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF0A8F62), Color(0xFF066F4D)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 🔹 FOTO / LOGO
              Image.asset(
                'assets/images/thumbs_up_green.png',
                width: 140,
                height: 140,
              ),

              const SizedBox(height: 20),

              // 🔹 TEKS APLIKASI
              const Text(
                "GOSYANDU",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),

              const SizedBox(height: 8),

              const Text(
                "Solusi Kesehatan Keluarga",
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
