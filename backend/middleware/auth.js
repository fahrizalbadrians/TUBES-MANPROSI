// NOTE:
// Demo auth menggunakan localStorage + header x-user-id.
// Untuk demo, frontend mengirim x-user-id (dan boleh mengirim x-user-role).
// DI BACKEND: kita JANGAN percaya x-user-role dari client (mudah salah/nyangkut).
// Kita ambil role asli dari database berdasarkan user_id agar tidak muncul bug:
// - dropdown warga kosong
// - "Forbidden: role not allowed" padahal login pegawai

let _pool = null;

function normalizeRole(role) {
  const r = String(role || "").trim().toUpperCase();
  if (r === "PEGAWAI") return "PEGAWAI_POSYANDU";
  if (r === "WARGA") return "MASYARAKAT";
  return r;
}

export function initAuth(pool) {
  _pool = pool;
}

async function loadUserFromDb(userId) {
  if (!_pool) return null;
  const [rows] = await _pool.execute(
    "SELECT id, full_name, email, role FROM users WHERE id=? LIMIT 1",
    [userId]
  );
  return rows?.[0] || null;
}

export async function requireAuth(req, res, next) {
  const rawId = req.header("x-user-id");
  const userId = Number(rawId);
  if (!rawId || !Number.isFinite(userId) || userId <= 0) {
    return res.status(401).json({ message: "Missing/invalid x-user-id header (login dulu)." });
  }

  req.userId = userId;

  // Ambil role dari DB agar konsisten
  try {
    const u = await loadUserFromDb(userId);
    if (!u) return res.status(401).json({ message: "User tidak ditemukan (cek x-user-id)." });
    req.user = u;
    req.userRole = normalizeRole(u.role);
  } catch (e) {
    // Fallback jika DB error (tetap jangan crash)
    console.error("Auth DB lookup failed:", e?.message || e);
    req.userRole = normalizeRole(req.header("x-user-role"));
  }

  next();
}

export function requireRole(requiredRole) {
  const required = normalizeRole(requiredRole);
  return (req, res, next) => {
    const role = normalizeRole(req.userRole || req.header("x-user-role"));
    if (!role) return res.status(401).json({ message: "Unauthorized." });
    if (role !== required) {
      return res.status(403).json({ message: "Forbidden: role not allowed." });
    }
    next();
  };
}

export function requireAnyRole(roles = []) {
  const allowed = new Set((roles || []).map(normalizeRole));
  return (req, res, next) => {
    const role = normalizeRole(req.userRole || req.header("x-user-role"));
    if (!role) return res.status(401).json({ message: "Unauthorized." });
    if (!allowed.has(role)) {
      return res.status(403).json({ message: "Forbidden: role not allowed." });
    }
    next();
  };
}

export { normalizeRole };
