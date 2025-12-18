import 'package:flutter/material.dart';
import '../widgets/text_field_widget.dart';

class EditProfilePage extends StatelessWidget {
  const EditProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text("Edit Profil", style: TextStyle(color: Colors.black)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            textField("Nama Lengkap"),
            const SizedBox(height: 15),
            textField("Email"),
            const SizedBox(height: 15),
            textField("No Handphone"),
            const SizedBox(height: 25),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0A8F62),
                ),
                onPressed: () {},
                child: const Text("Simpan"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
