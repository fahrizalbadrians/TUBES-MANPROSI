import express from "express";

export default function diagnoseRoutes(pool){
  const r = express.Router();

  r.get("/", async (_req,res)=>{
    try{
      // Cek tabel-tabel penting agar demo tidak error karena missing table
      const requiredTables = [
        "users",
        "children",
        "pregnant_mothers",
        "elderly",
        "measurements",
        "vaccine_types",
        "vaccine_schedules",
        "immunizations",
        "pmt",
        "education_posts",
        "notifications",
        "consult_threads",
        "consult_messages",
      ];

      const [tables] = await pool.execute(
        "SELECT table_name FROM information_schema.tables WHERE table_schema=DATABASE()"
      );
      const existing = new Set(tables.map(t=>t.table_name));
      const missing_tables = requiredTables.filter(t=>!existing.has(t));

      // Cek kolom penting (untuk sinkronisasi frontend-backend-DB)
      const requiredColumns = {
        children: ["id","created_by","parent_id","name","birth_date"],
        pregnant_mothers: ["id","created_by","user_id","name"],
        elderly: ["id","created_by","user_id","name"],
        measurements: ["id","person_type","person_id","recorded_by","blood_pressure","blood_sugar","cholesterol"],
        notifications: ["id","recipient_id","is_read","related_type","related_id"],
        immunizations: ["id","child_id","vaccine","schedule_id","vaccine_type_id","given_at"],
        vaccine_schedules: ["id","vaccine_type_id","recommended_age_weeks"],
      };
      const missing_columns = {};
      for(const [table, cols] of Object.entries(requiredColumns)){
        if(!existing.has(table)) continue;
        const [rows] = await pool.execute(
          "SELECT column_name FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name=?",
          [table]
        );
        const have = new Set(rows.map(r=>r.column_name));
        const miss = cols.filter(c=>!have.has(c));
        if(miss.length) missing_columns[table]=miss;
      }

      res.json({ok: missing_tables.length===0 && Object.keys(missing_columns).length===0, missing_tables, missing_columns});
    }catch(e){
      res.status(500).json({message:"Server error", detail:String(e?.message||e)});
    }
  });

  return r;
}
