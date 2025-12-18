import 'package:flutter/material.dart';

class VideoEducationPage extends StatelessWidget {
  const VideoEducationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text("Edukasi Pilihan", style: TextStyle(color: Colors.black)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Image.asset("assets/edu.png"),
            const SizedBox(height: 20),
            const Text(
              "Apa Sih Perbedaan antara Wasting dan Stunting?",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              "Penjelasan lengkap dari Dokter Mangga.",
              style: TextStyle(color: Colors.black54),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A8F62)),
                onPressed: () {},
                child: const Text("Tonton Sekarang"),
              ),
            )
          ],
        ),
      ),
    );
  }
}
