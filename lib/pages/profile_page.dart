import 'package:flutter/material.dart';
import 'edit_profile_page.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text("Profil Saya", style: TextStyle(color: Colors.black)),
      ),
      body: Column(
        children: [
          const SizedBox(height: 20),
          CircleAvatar(
            radius: 55,
            backgroundImage: AssetImage("assets/user.png"),
          ),
          const SizedBox(height: 10),
          const Text(
            "Wirya",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const Text("wirya@gmail.com", style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 20),

          profileItem(
            context,
            "Edit Profil",
            Icons.edit,
            const EditProfilePage(),
          ),
          profileItem(context, "Ubah Password", Icons.lock, null),
          profileItem(context, "Pusat Bantuan", Icons.help, null),
          profileItem(context, "Keluar", Icons.logout, null, isRed: true),
        ],
      ),
    );
  }

  Widget profileItem(
    BuildContext context,
    String text,
    IconData icon,
    Widget? page, {
    bool isRed = false,
  }) {
    return ListTile(
      leading: Icon(icon, color: isRed ? Colors.red : Colors.black),
      title: Text(
        text,
        style: TextStyle(color: isRed ? Colors.red : Colors.black),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: page != null
          ? () =>
                Navigator.push(context, MaterialPageRoute(builder: (_) => page))
          : null,
    );
  }
}
