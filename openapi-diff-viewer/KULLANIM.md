# OpenAPI Diff Viewer - Kullanım Kılavuzu

## 🎯 Hızlı Başlangıç

### 1. Backend'i Başlatın

```powershell
cd backend
.\\venv\\Scripts\\activate
python main.py
```

✅ Backend çalışıyor: `http://localhost:8000`

### 2. Frontend'i Başlatın

```powershell
cd frontend
npm run dev
```

✅ Frontend çalışıyor: `http://localhost:5174`

### 3. Tarayıcıda Açın

`http://localhost:5174` adresine gidin.

## 📤 Dosya Yükleme

### Adım 1: Dosyaları Seçin

İki yöntemle dosya yükleyebilirsiniz:

**Yöntem 1: Drag & Drop**
- Dosyayı sürükleyip ilgili alana bırakın

**Yöntem 2: Tıklayarak Seç**
- Yükleme alanına tıklayın
- Dosya gezgininden dosyayı seçin

### Adım 2: Her İki Dosyayı da Yükleyin

- **Old Specification**: Eski OpenAPI spec dosyanız
- **New Specification**: Yeni OpenAPI spec dosyanız

Desteklenen formatlar:
- `.json`
- `.yaml`
- `.yml`

### Adım 3: Karşılaştır

"Compare Specifications" butonuna tıklayın.

## 📊 Sonuçları İnceleme

### Sidebar (Sol Panel)

**Özet İstatistikler:**
- 🟢 **Added**: Yeni eklenen endpoint sayısı
- 🔴 **Deleted**: Silinen endpoint sayısı (Breaking!)
- 🔵 **Updated**: Güncellenen endpoint sayısı
- 🟠 **Breaking**: Breaking change sayısı

**Filtre:**
- ☑️ "Show Breaking Only" - Sadece breaking changes göster

**Endpoint Listesi:**
- Her endpoint için HTTP method badge
- Path bilgisi
- Breaking change uyarısı (⚠️)

### Ana Panel (Sağ)

**Endpoint Detayları:**
- HTTP Method + Path
- Status badge (Added/Deleted/Updated)
- Breaking change uyarısı
- Özet açıklama

**Değişiklik Tablosu:**
- **Location**: Değişikliğin yeri (JSON path)
- **Old Value**: Eski değer
- **New Value**: Yeni değer

## 🔄 Yeni Analiz

Yeni bir karşılaştırma yapmak için:
1. Sidebar'daki "New Analysis" butonuna tıklayın
2. Yeni dosyalar yükleyin
3. Tekrar karşılaştırın

## 💡 İpuçları

1. **Backend Kontrolü**: Backend çalışmıyorsa hata mesajı alırsınız
2. **Dosya Formatı**: JSON veya YAML formatında olmalı
3. **Geçerli Spec**: OpenAPI 3.0 standardına uygun olmalı
4. **Breaking Changes**: Kırmızı renkle vurgulanır

## 🐛 Sorun Giderme

### "Failed to analyze" Hatası

**Çözüm:**
- Backend'in çalıştığından emin olun (`http://localhost:8000`)
- Dosyaların geçerli OpenAPI spec olduğunu kontrol edin

### "CORS Error"

**Çözüm:**
- Backend ve frontend'in doğru portlarda çalıştığından emin olun
- Backend: 8000, Frontend: 5174

### Dosya Yüklenmiyor

**Çözüm:**
- Dosya formatını kontrol edin (.json, .yaml, .yml)
- Dosya boyutunun çok büyük olmadığından emin olun

## 📝 Örnek Kullanım

Proje ile birlikte gelen örnek dosyaları kullanabilirsiniz:

```
backend/specs/old.yaml  → Old Specification
backend/specs/new.yaml  → New Specification
```

Bu dosyalar şu değişiklikleri içerir:
- ✏️ POST /users - email tipi değişti (string → integer)
- ➕ POST /users - age alanı eklendi
- ❌ GET /items - endpoint silindi (BREAKING!)
- ➕ DELETE /items - yeni endpoint eklendi

---

**Keyifli kullanımlar! 🚀**
