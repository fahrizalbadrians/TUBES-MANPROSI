import 'package:flutter/material.dart';
import '../routes/app_routes.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F7F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              "Selamat Datang!",
              style: TextStyle(fontSize: 14, color: Colors.black54),
            ),
            Text(
              "Wirya",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0A8F62),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.black),
            onPressed: () {
              Navigator.pushNamed(context, AppRoutes.notification);
            },
          ),
        ],
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔹 TEKS PEMBUKA
            const Text(
              "Ayo mulai perhatikan kesehatan\norang terdekatmu sekarang!",
              style: TextStyle(fontSize: 14),
            ),

            const SizedBox(height: 20),

            // 🔹 CARD MONITORING
            _menuCard(
              title: "Monitoring Status Kesehatan",
              subtitle: "Pantau kesehatan tumbuh kembang orang terdekat",
              color: const Color(0xFF0A8F62),
              icon: Icons.favorite,
              onTap: () {},
            ),

            const SizedBox(height: 12),

            // 🔹 CARD TRACKING
            _menuCard(
              title: "Tracking Pemeriksaan",
              subtitle: "Lacak riwayat pemeriksaan dan imunisasi",
              color: const Color(0xFF2F6FED),
              icon: Icons.assignment,
              onTap: () {},
            ),

            const SizedBox(height: 12),

            // 🔹 CARD KONSULTASI
            _menuCard(
              title: "Konsultasi dengan Ahli",
              subtitle: "Diskusikan kondisi kesehatan dengan tenaga ahli",
              color: const Color(0xFFF2994A),
              icon: Icons.chat,
              onTap: () {},
            ),

            const SizedBox(height: 24),

            // 🔹 EDUKASI
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Edukasi Untuk Anda",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, AppRoutes.edukasiArtikel);
                  },
                  child: const Text("Lihat Semua"),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // 🔹 CARD EDUKASI
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                    child: Image.asset(
                      'assets/images/edukasi_stunting.jpg',
                      height: 100,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Apa Sih Perbedaan antara Wasting & Stunting?",
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          "Kenali perbedaan wasting dan stunting pada anak sejak dini.",
                          style: TextStyle(fontSize: 12, color: Colors.black54),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 40,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0A8F62),
                            ),
                            onPressed: () {
                              Navigator.pushNamed(
                                context,
                                AppRoutes.edukasiArtikel,
                              );
                            },
                            child: const Text("Baca Selengkapnya"),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),

      // 🔹 BOTTOM NAVIGATION
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF0A8F62),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Beranda"),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment),
            label: "Riwayat",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profil"),
        ],
      ),
    );
  }

  // 🔹 WIDGET CARD MENU
  Widget _menuCard({
    required String title,
    required String subtitle,
    required Color color,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.white, size: 36),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white),
          ],
        ),
      ),
    );
  }
}
