import 'package:flutter/material.dart';
import '../widgets/text_field_widget.dart';
import '../routes/app_routes.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

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
                "Masuk",
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                "Masukkan email dan password Anda untuk melanjutkan.",
                style: TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 25),

              // EMAIL
              textField("Email"),

              const SizedBox(height: 15),

              // PASSWORD
              textField("Password", obscure: true),

              const SizedBox(height: 5),

              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // nanti bisa arahkan ke forgot password
                  },
                  child: const Text("Lupa Password?"),
                ),
              ),

              const SizedBox(height: 10),

              // 🔹 BUTTON MASUK
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A8F62),
                    foregroundColor: Colors.white,
                  ),
                  onPressed: () {
                    // 🔥 INI YANG SEBELUMNYA KOSONG
                    Navigator.pushReplacementNamed(context, AppRoutes.home);
                  },
                  child: const Text("Masuk", style: TextStyle(fontSize: 16)),
                ),
              ),

              const SizedBox(height: 12),

              // 🔹 REGISTER LINK (HANYA KLIK "Daftar")
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Belum punya akun? "),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushReplacementNamed(
                        context,
                        AppRoutes.register,
                      );
                    },
                    child: const Text(
                      "Daftar",
                      style: TextStyle(
                        color: Color(0xFF0A8F62),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
