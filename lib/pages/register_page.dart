import 'package:flutter/material.dart';
import '../widgets/text_field_widget.dart';
import '../routes/app_routes.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text("GOSYANDU", style: TextStyle(color: Colors.black)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Buat Akun",
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                "Ayo daftarkan akun Anda dan dapatkan layanan kesehatan!",
                style: TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 25),
              textField("Email"),
              const SizedBox(height: 15),
              textField("Password", obscure: true),
              const SizedBox(height: 15),
              textField("Konfirmasi Password", obscure: true),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A8F62),
                  ),
                  onPressed: () {
                    Navigator.pushReplacementNamed(context, AppRoutes.home);
                  },
                  child: const Text("Buat Akun"),
                ),
              ),
              const SizedBox(height: 10),
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacementNamed(context, AppRoutes.login);
                  },
                  child: const Text("Sudah punya akun? Masuk"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
