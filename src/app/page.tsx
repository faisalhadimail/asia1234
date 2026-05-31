export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '700px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '1rem', margin: 0 }}>
          🔥 Firebase Setup
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.25rem', marginBottom: '2rem' }}>
          PropertiHub siap menggunakan Firebase sebagai database backend!
        </p>

        <div style={{ background: '#fef3c7', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#92400e' }}>⚠️ Langkah Pertama:</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
            <li>Buka <a href="https://console.firebase.google.com/project/kprasia-f50c2/firestore/rules" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Firebase Console → Firestore Rules</a></li>
            <li>Klik "Start collection" atau "Edit rules"</li>
            <li>Paste rules berikut:
              <pre style={{ background: '#1f2937', color: '#10b981', padding: '10px', borderRadius: '6px', overflowX: 'auto', fontSize: '0.85rem' }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
              </pre>
            </li>
            <li>Klik "Publish" untuk menyimpan rules</li>
          </ol>
        </div>

        <div style={{ background: '#dbeafe', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e40af' }}>📝 Langkah Kedua:</h3>
          <p style={{ margin: '0 0 1rem 0' }}>Buka halaman seeding untuk mengisi data dummy ke Firebase:</p>
          <a 
            href="/seed-firebase.html"
            style={{ 
              display: 'inline-block', 
              background: '#2563eb', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            📊 Seed Data ke Firebase
          </a>
        </div>

        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>📊 Data yang akan diisi:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
            <li>✅ 4 Property Types (Rumah, Apartemen, Tanah, Ruko)</li>
            <li>✅ 3 Locations (Bandung, Bogor, Bekasi)</li>
            <li>✅ 3 Promos aktif</li>
            <li>✅ 2 Agents properti</li>
            <li>✅ 5 Properties listing</li>
            <li>✅ 2 Visitor leads</li>
            <li>✅ 1 Admin User (admin/admin123)</li>
            <li>✅ 2 Articles blog</li>
            <li>✅ 3 Reviews testimoni</li>
            <li>✅ Agency & SEO settings</li>
          </ul>
        </div>

        <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🔐 Login Admin:</h3>
          <p style={{ margin: '0.5rem 0' }}>Username: <strong style={{ background: 'white', padding: '4px 8px', borderRadius: '4px' }}>admin</strong></p>
          <p style={{ margin: '0.5rem 0' }}>Password: <strong style={{ background: 'white', padding: '4px 8px', borderRadius: '4px' }}>admin123</strong></p>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>ℹ️ <strong>Catatan:</strong> Setelah seeding selesai, data akan tersimpan di cloud Firebase dan dapat diakses dari mana saja.</p>
          <p style={{ marginTop: '0.5rem' }}>📚 Lihat <code>FIREBASE_SETUP.md</code> untuk dokumentasi lengkap.</p>
        </div>
      </div>
    </div>
  )
}