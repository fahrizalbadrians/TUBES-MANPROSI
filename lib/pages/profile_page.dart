import 'package:flutter/material.dart';
import '../routes/app_routes.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F7F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text("Profil Saya", style: TextStyle(color: Colors.black)),
      ),

      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // 🔹 AVATAR
            const CircleAvatar(
              radius: 40,
              backgroundImage: AssetImage('assets/images/avatar.jpg'),
            ),

            const SizedBox(height: 12),

            const Text(
              "Wirya",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 4),

            const Text(
              "wirya@gmail.com",
              style: TextStyle(color: Colors.black54),
            ),

            const SizedBox(height: 30),

            // 🔹 MENU LIST
            _profileMenu(
              icon: Icons.person,
              title: "Edit Profil",
              color: Colors.blue,
              onTap: () {
                Navigator.pushNamed(context, AppRoutes.editProfile);
              },
            ),

            _profileMenu(
              icon: Icons.lock,
              title: "Ubah Password",
              color: Colors.orange,
              onTap: () {},
            ),

            _profileMenu(
              icon: Icons.logout,
              title: "Keluar",
              color: Colors.red,
              onTap: () {
                // logout dummy
                Navigator.pushReplacementNamed(context, AppRoutes.login);
              },
            ),
          ],
        ),
      ),

      // 🔹 BOTTOM NAV
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2,
        selectedItemColor: const Color(0xFF0A8F62),
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          if (index == 0) {
            Navigator.pushReplacementNamed(context, AppRoutes.home);
          }
          if (index == 2) {
            // stay
          }
        },
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

  // 🔹 ITEM MENU
  Widget _profileMenu({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.1),
          child: Icon(icon, color: color),
        ),
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
