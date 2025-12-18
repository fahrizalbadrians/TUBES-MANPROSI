// TODO Implement this library.
import 'package:flutter/material.dart';

Widget textField(String label, {bool obscure = false}) {
  return TextField(
    obscureText: obscure,
    decoration: InputDecoration(
      labelText: label,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
    ),
  );
}
