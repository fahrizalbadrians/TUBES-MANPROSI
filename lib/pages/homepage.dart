import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F4F4),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Selamat Datang!",
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),

              const Text(
                "Ayo mulai perhatikan kesehatan keluargamu sekarang!",
                style: TextStyle(color: Colors.black54),
              ),

              const SizedBox(height: 20),

              homeCard(context, "Monitoring Status Kesehatan", Colors.green),
              homeCard(context, "Tracking Pemeriksaan", Colors.orange),
              homeCard(context, "Konsultasi dengan Ahli", Colors.red),
              homeCard(context, "Edukasi Untuk Anda", Colors.blue),
            ],
          ),
        ),
      ),
    );
  }

  Widget homeCard(BuildContext context, String title, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }
}
