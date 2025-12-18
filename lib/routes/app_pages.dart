import 'package:flutter/material.dart';
//import '../pages/start_page.dart';
import '../pages/welcome_page.dart';
import '../pages/login_page.dart';
import '../pages/register_page.dart';
//import '../pages/forgot_password_page.dart';
import '../pages/homepage.dart';
import '../pages/profile_page.dart';
import '../pages/edit_profile_page.dart';
import '../pages/notification_page.dart';
//import '../pages/edukasi_video_page.dart';
//import '../pages/edukasi_artikel_page.dart';
import '../pages/dashboard_page.dart';
import '../pages/auth_choice_page.dart';
import 'app_routes.dart';

class AppPages {
  static Map<String, WidgetBuilder> routes = {
    //AppRoutes.start: (_) => const StartPage(),
    AppRoutes.welcome: (_) => const WelcomePage(),
    AppRoutes.authChoice: (_) => const AuthChoicePage(),
    AppRoutes.login: (_) => const LoginPage(),
    AppRoutes.register: (_) => const RegisterPage(),
    //AppRoutes.forgot: (_) => const ForgotPasswordPage(),
    AppRoutes.home: (_) => const HomePage(),
    AppRoutes.profile: (_) => const ProfilePage(),
    AppRoutes.editProfile: (_) => const EditProfilePage(),
    AppRoutes.notification: (_) => const NotificationPage(),
    //AppRoutes.edukasiVideo: (_) => const EdukasiVideoPage(),
    //AppRoutes.edukasiArtikel: (_) => const EdukasiArtikelPage(),
    AppRoutes.dashboard: (_) => const DashboardPage(),
  };
}
