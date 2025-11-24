# OpenAPI Diff Viewer 🔍

Modern ve kullanıcı dostu bir OpenAPI/Swagger spesifikasyon karşılaştırma aracı.

## ✨ Özellikler

- 📤 **Dosya Yükleme**: Drag & drop veya tıklayarak dosya yükleme
- 📊 **Overview Report**: Kapsamlı özet rapor ekranı
- 🗂️ **Gruplandırılmış Değişiklikler**: Added, Updated, Deleted olarak kategorize edilmiş endpoint listesi
- 🎨 **Modern UI**: Gradient renkler ve smooth animasyonlar
- 📈 **Detaylı İstatistikler**: Görsel istatistik kartları
- 🔍 **Detaylı Analiz**: Endpoint değişikliklerini görselleştirme
- ⚠️ **Breaking Change Tespiti**: Kritik değişiklikleri vurgulama ve özel uyarılar
- 🔄 **Gerçek Zamanlı**: Backend API ile anlık analiz
- 📱 **Responsive**: Tüm ekran boyutlarında çalışır

## 🚀 Kurulum ve Çalıştırma

### Backend (FastAPI)

```bash
# Backend dizinine git
cd backend

# Virtual environment oluştur (ilk kez)
python -m venv venv

# Virtual environment'ı aktif et
# Windows:
.\\venv\\Scripts\\activate
# Linux/Mac:
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# Backend'i başlat
python main.py
```

Backend `http://localhost:8000` adresinde çalışacak.

### Frontend (React + Vite)

```bash
# Frontend dizinine git
cd frontend

# Bağımlılıkları yükle (ilk kez)
npm install

# Development server'ı başlat
npm run dev
```

Frontend `http://localhost:5174` adresinde çalışacak.

## 📖 Kullanım

1. **Backend'i Başlat**: Yukarıdaki komutlarla backend'i çalıştırın
2. **Frontend'i Başlat**: Frontend development server'ını başlatın
3. **Tarayıcıda Aç**: `http://localhost:5174` adresine gidin
4. **Dosyaları Yükle**: 
   - Old Specification: Eski OpenAPI spec dosyanızı yükleyin
   - New Specification: Yeni OpenAPI spec dosyanızı yükleyin
5. **Analiz Et**: "Compare Specifications" butonuna tıklayın
6. **Sonuçları İncele**: Değişiklikleri sidebar'dan seçerek detaylarını görün

## 📁 Proje Yapısı

```
openapi-diff-viewer/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── comparator.py        # OpenAPI karşılaştırma mantığı
│   ├── report_generator.py  # Rapor oluşturma
│   ├── generate_diff.py     # CLI tool (opsiyonel)
│   ├── requirements.txt     # Python bağımlılıkları
│   └── specs/               # Örnek spec dosyaları
│       ├── old.yaml
│       └── new.yaml
└── frontend/
    ├── src/
    │   ├── App.jsx          # Ana uygulama
    │   ├── components/
    │   │   ├── FileUpload.jsx   # Dosya yükleme ekranı
    │   │   ├── Sidebar.jsx      # Değişiklik listesi
    │   │   ├── DiffViewer.jsx   # Detay görünümü
    │   │   └── Badge.jsx        # HTTP method badge
    │   └── index.css        # Tailwind CSS
    └── package.json
```

## 🎯 API Endpoints

### POST /api/analyze

OpenAPI spec dosyalarını karşılaştırır.

**Request:**
- `old_file`: Eski OpenAPI spec (multipart/form-data)
- `new_file`: Yeni OpenAPI spec (multipart/form-data)

**Response:**
```json
{
  "summary": {
    "added_count": 1,
    "deleted_count": 1,
    "updated_count": 1,
    "breaking_count": 1
  },
  "changes": [
    {
      "id": "uuid",
      "path": "/users",
      "method": "POST",
      "status": "updated",
      "is_breaking": false,
      "summary_text": "...",
      "details": [...]
    }
  ]
}
```

## 🧪 Test

Örnek dosyalarla test etmek için:

```bash
# Backend dizininde
curl -X POST http://localhost:8000/api/analyze \
  -F "old_file=@specs/old.yaml" \
  -F "new_file=@specs/new.yaml"
```

## 🛠️ Teknolojiler

### Backend
- **FastAPI**: Modern Python web framework
- **Prance**: OpenAPI spec parser
- **DeepDiff**: Derin nesne karşılaştırma
- **Uvicorn**: ASGI server

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool
- **Tailwind CSS v4**: Styling
- **Lucide React**: İkonlar

## 📝 Notlar

- Backend ve frontend'in aynı anda çalışıyor olması gerekir
- Desteklenen formatlar: JSON, YAML
- CORS tüm originler için açık (production'da düzeltilmeli)
- Dosya boyutu limiti yok (production'da eklenebilir)

## 🎨 Özellikler

- ✅ Drag & drop dosya yükleme
- ✅ Gerçek zamanlı analiz
- ✅ Breaking change tespiti
- ✅ Detaylı değişiklik görünümü
- ✅ Filtreleme (sadece breaking changes)
- ✅ Özet istatistikler
- ✅ Modern ve responsive tasarım

## 🔄 Yeni Analiz

Sonuç ekranındayken "New Analysis" butonuna tıklayarak yeni bir karşılaştırma yapabilirsiniz.

---

**Made with ❤️ using FastAPI & React**
