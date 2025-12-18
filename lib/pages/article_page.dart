import 'package:flutter/material.dart';

class ArticlePage extends StatelessWidget {
  const ArticlePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          "Artikel Edukasi",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Image.asset("assets/edu.png"),
            const SizedBox(height: 20),
            const Text(
              "Apa Sih Perbedaan antara Wasting dan Stunting?",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 15),
            const Text(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
              " (isi artikel panjang, sesuai kebutuhan)",
              style: TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}
