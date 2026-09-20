# TechnoBrain
## Interactive Learning Platform for SMK Students & University Students

> **TechnoBrain** adalah platform pembelajaran interaktif yang dirancang untuk membantu **siswa SMK dan mahasiswa** mempelajari berbagai bidang keilmuan melalui materi digital, visualisasi interaktif, simulasi 3D, dan pengalaman belajar yang modern.

TechnoBrain tidak terbatas pada satu jurusan.

Platform harus memiliki arsitektur yang memungkinkan guru, dosen, atau pengajar membuat dan mengelola materi untuk berbagai bidang pembelajaran.

---

# 1. Target Pengguna

TechnoBrain ditujukan untuk:

### Siswa SMK

Mencakup berbagai program keahlian, seperti:

- TJKT
- PPLG
- DKV
- Akuntansi
- Teknik Elektronika
- Teknik Mesin
- Teknik Otomotif
- Tata Boga
- Perhotelan
- Bisnis dan Manajemen
- dan jurusan lainnya

### Mahasiswa

Mencakup berbagai bidang:

- Informatika
- Sistem Informasi
- Teknik
- Pendidikan
- Bisnis
- Akuntansi
- Desain
- Sains
- dan bidang lainnya

Platform harus dirancang agar materi tidak terikat pada satu jenjang atau jurusan.

---

# 2. Konsep Utama

TechnoBrain memiliki konsep:

```text
LEARN
  ↓
EXPLORE
  ↓
INTERACT
  ↓
PRACTICE
  ↓
UNDERSTAND
```

Pembelajaran tidak hanya berupa membaca teks.

Siswa dan mahasiswa dapat:

- membaca materi
- melihat ilustrasi
- mengeksplorasi objek 3D
- melakukan simulasi
- mengikuti aktivitas pembelajaran
- melihat video
- menyelesaikan latihan
- memantau progress belajar

---

# 3. Struktur Materi

Materi tidak boleh dikunci hanya untuk MikroTik.

Struktur:

```text
Program Pendidikan
        ↓
Bidang / Jurusan
        ↓
Mata Pelajaran / Mata Kuliah
        ↓
Materi
        ↓
Submateri
        ↓
Aktivitas
```

Contoh SMK:

```text
SMK
 ↓
TJKT
 ↓
Administrasi Infrastruktur Jaringan
 ↓
MikroTik
 ↓
Konfigurasi DHCP
```

Contoh lainnya:

```text
SMK
 ↓
PPLG
 ↓
Pemrograman Web
 ↓
React
 ↓
Component & Props
```

Contoh mahasiswa:

```text
Universitas
 ↓
Informatika
 ↓
Jaringan Komputer
 ↓
Routing
 ↓
Static Routing
```

---

# 4. Education Level

Database harus mendukung:

```text
smk
university
```

Namun dapat dikembangkan menjadi:

```text
smp
smk
university
professional
general
```

---

# 5. Category System

Materi memiliki:

```text
education_level
department
subject
category
```

Contoh:

| Level | Department | Subject | Material |
|---|---|---|---|
| SMK | TJKT | Jaringan | MikroTik |
| SMK | PPLG | Pemrograman | React |
| SMK | DKV | Desain | Tipografi |
| Universitas | Informatika | Jaringan Komputer | Routing |
| Universitas | Sistem Informasi | Database | SQL |
| Universitas | Akuntansi | Akuntansi Keuangan | Jurnal |

---

# 6. Flexible Material System

Guru/dosen harus dapat membuat materi baru tanpa mengubah source code.

Form:

```text
Judul
Deskripsi
Jenjang
Jurusan
Mata Pelajaran / Mata Kuliah
Kategori
Isi Materi
Thumbnail
Media
Status
```

Guru/dosen dapat membuat:

```text
Materi
Submateri
Quiz
Latihan
Simulasi
```

---

# 7. Teacher / Lecturer Role

Role pengajar dapat digunakan untuk:

```text
teacher
```

Namun secara konsep dapat mewakili:

- Guru SMK
- Dosen
- Instruktur
- Pengajar

Admin dapat menentukan bidang pengajar.

Contoh:

```text
Nama:
Budi Santoso

Role:
Teacher

Education Level:
SMK

Department:
TJKT
```

atau:

```text
Nama:
Dr. Andi

Role:
Teacher

Education Level:
University

Department:
Informatika
```

---

# 8. Student Profile

Profil siswa/mahasiswa memiliki:

```text
Nama
Email
Education Level
Institution
Department
Semester / Grade
```

Contoh siswa SMK:

```text
Nama:
Budi

Jenjang:
SMK

Sekolah:
SMK Negeri 1

Jurusan:
TJKT

Kelas:
XI
```

Contoh mahasiswa:

```text
Nama:
Andi

Jenjang:
University

Universitas:
Universitas ABC

Program Studi:
Informatika

Semester:
4
```

---

# 9. Personalized Learning Dashboard

Dashboard siswa/mahasiswa harus menyesuaikan profil pengguna.

Contoh:

```text
Selamat datang, Budi

Materi untuk kamu
────────────────────────

Jaringan Komputer
MikroTik
DHCP
Routing
```

Jika mahasiswa Informatika:

```text
Selamat datang, Andi

Materi untuk kamu
────────────────────────

Pemrograman
React
Database
Algoritma
Jaringan Komputer
```

---

# 10. Explore Materials

Tambahkan halaman:

```text
/explore
```

Pengguna dapat menjelajahi semua materi.

Filter:

```text
Jenjang
Jurusan
Mata Pelajaran
Kategori
Level Kesulitan
```

Contoh:

```text
┌────────────────────────────────────┐
│ Explore Learning                  │
│                                    │
│ [ Semua ] [ SMK ] [ Universitas ] │
│                                    │
│ Jurusan: [Semua ▼]                │
│                                    │
│ ┌─────────┐ ┌─────────┐            │
│ │ MikroTik│ │ React   │            │
│ └─────────┘ └─────────┘            │
└────────────────────────────────────┘
```

---

# 11. Search

Tambahkan global search.

Pengguna dapat mencari:

```text
MikroTik
React
Python
Database
Routing
Akuntansi
Desain
Matematika
```

Search harus mengambil data dari database.

---

# 12. Material Card

Card materi:

```text
Thumbnail

MikroTik Dasar
SMK · TJKT

Belajar dasar konfigurasi
MikroTik dan RouterOS.

[Mulai Belajar]
```

Contoh lainnya:

```text
React Fundamental
Universitas · Informatika

Memahami component,
props, dan state.

[Mulai Belajar]
```

---

# 13. Interactive Learning

Tidak semua materi harus memiliki 3D.

Materi dapat menggunakan:

```text
Text
Image
Video
Animation
Interactive Diagram
Simulation
3D Model
Quiz
Code Playground
```

Jenis media disimpan di database.

Contoh:

```text
content_type
```

dengan:

```text
text
video
simulation
3d
quiz
interactive
```

---

# 14. Three.js sebagai Platform Interactive Engine

Three.js jangan dibuat hanya untuk MikroTik.

Buat sistem yang dapat mendukung berbagai objek 3D.

Contoh:

### TJKT

```text
MikroTik
Router
Switch
Server
Network topology
```

### Elektronika

```text
Arduino
PCB
Sensor
Microcontroller
```

### Teknik Mesin

```text
Engine
Gear
Mechanical parts
```

### DKV

```text
3D object
Typography environment
Design visualization
```

### Sains

```text
Molecule
Human anatomy
Solar system
```

Dengan demikian Three.js menjadi **interactive learning engine**, bukan sekadar fitur MikroTik.

---

# 15. Interactive 3D Material

Struktur:

```text
Interactive 3D
       ↓
3D Scene
       ↓
Objects
       ↓
Clickable Components
       ↓
Information
       ↓
Learning Activity
```

Contoh MikroTik:

```text
Router
├── Ethernet
├── Power
├── USB
└── Reset
```

Contoh engine:

```text
Engine
├── Piston
├── Cylinder
├── Crankshaft
└── Valve
```

---

# 16. Learning Activity

Setiap materi dapat memiliki aktivitas.

Contoh:

```text
Materi MikroTik
      ↓
Pelajari Ethernet
      ↓
Klik port Ethernet
      ↓
Baca informasi
      ↓
Jawab pertanyaan
      ↓
Selesai
```

Aktivitas dapat disimpan:

```text
activities
```

---

# 17. Quiz

Tambahkan sistem quiz.

Question:

```text
Apa fungsi DHCP Server?
```

Options:

```text
A. Mengatur tampilan website
B. Memberikan IP address secara otomatis
C. Menghapus firewall
D. Membuat database
```

Setelah menjawab:

```text
✓ Jawaban benar
```

atau:

```text
✕ Jawaban kurang tepat
```

Score disimpan ke database.

---

# 18. Progress System

Progress pengguna mencakup:

```text
Materi selesai
Quiz
Score
Learning streak
```

Contoh:

```text
Learning Progress

████████████░░░░ 75%

6 / 8 Materi selesai
```

---

# 19. Cross-Subject Architecture

Platform harus memungkinkan satu akun mengakses berbagai materi.

Contoh:

```text
Budi
│
├── Jaringan
│   └── MikroTik
│
├── Pemrograman
│   └── React
│
└── Database
    └── SQL
```

Materi tidak boleh dikunci berdasarkan role.

Role menentukan **permission**, sedangkan kategori pendidikan menentukan **materi yang relevan**.

---

# 20. Teacher / Lecturer Material Management

Pengajar dapat membuat materi untuk bidangnya.

Contoh:

```text
Guru TJKT
→ Materi MikroTik

Guru PPLG
→ Materi React

Dosen Informatika
→ Materi Algoritma

Dosen Akuntansi
→ Materi Akuntansi
```

---

# 21. Material Ownership

Materi memiliki:

```text
author_id
```

dan dapat memiliki:

```text
department_id
subject_id
```

Sehingga sistem mengetahui:

```text
Siapa yang membuat?
Materi untuk siapa?
Bidang apa?
Mata pelajaran apa?
```

---

# 22. Updated Database Structure

Tambahkan tabel:

```text
users
materials
comments
progress
activities
quizzes
quiz_questions
quiz_answers
departments
subjects
education_levels
```

---

# 23. Users

```text
users
├── id
├── name
├── email
├── password
├── role
├── education_level_id
├── institution
├── department_id
├── grade_or_semester
├── is_active
├── created_at
└── updated_at
```

---

# 24. Education Levels

```text
education_levels
├── id
├── name
└── slug
```

Seed:

```text
SMK
Universitas
```

---

# 25. Departments

```text
departments
├── id
├── education_level_id
├── name
├── slug
└── created_at
```

Contoh:

```text
TJKT
PPLG
DKV
Akuntansi
Informatika
Sistem Informasi
Teknik Mesin
```

---

# 26. Subjects

```text
subjects
├── id
├── department_id
├── name
├── description
└── created_at
```

---

# 27. Materials

```text
materials
├── id
├── title
├── slug
├── description
├── content
├── thumbnail
├── content_type
├── education_level_id
├── department_id
├── subject_id
├── category
├── difficulty
├── status
├── author_id
├── created_at
└── updated_at
```

---

# 28. Material Difficulty

Gunakan:

```text
Beginner
Intermediate
Advanced
```

---

# 29. Student Experience

Dashboard siswa/mahasiswa harus memprioritaskan:

```text
Continue Learning
Recommended
Recent Materials
My Progress
Completed
Explore
```

Contoh:

```text
Continue Learning

MikroTik Dasar
████████░░ 80%

[Continue]
```

---

# 30. Recommendation

Sistem dapat menampilkan rekomendasi berdasarkan:

```text
Education Level
Department
Subject
Learning History
Completed Materials
```

Contoh:

```text
Karena kamu belajar MikroTik:

→ DHCP MikroTik
→ Routing Dasar
→ Firewall
→ NAT
```

---

# 31. Global Learning Library

Tambahkan:

```text
Library
```

Pengguna dapat menemukan materi lintas bidang.

Contoh:

```text
Explore

Networking
Programming
Design
Accounting
Engineering
Science
Business
```

---

# 32. Landing Page Message

Jangan menggunakan wording:

```text
Media pembelajaran khusus TJKT
```

Gunakan:

```text
Media pembelajaran interaktif
untuk siswa SMK dan mahasiswa.
```

Hero:

```text
Belajar Teknologi.
Bangun Masa Depan.
```

Subheadline:

```text
TechnoBrain menghadirkan pengalaman belajar
interaktif untuk siswa SMK dan mahasiswa melalui
materi digital, simulasi, visualisasi 3D,
dan pengalaman belajar yang lebih menarik.
```

---

# 33. Landing Page Feature

Feature cards:

### Learn

Materi pembelajaran terstruktur untuk berbagai bidang.

### Explore

Temukan materi berdasarkan jurusan, mata pelajaran, dan minat.

### Interact

Belajar melalui simulasi, visualisasi, dan objek 3D.

### Practice

Uji pemahaman melalui aktivitas dan quiz.

---

# 34. Educational Scope

TechnoBrain harus bersifat:

```text
Multi-level
Multi-department
Multi-subject
Multi-content
```

Struktur:

```text
TechnoBrain
│
├── SMK
│   ├── TJKT
│   ├── PPLG
│   ├── DKV
│   ├── Akuntansi
│   └── Teknik
│
└── Universitas
    ├── Informatika
    ├── Sistem Informasi
    ├── Teknik
    ├── Bisnis
    ├── Pendidikan
    └── Sains
```

---

# 35. Important Architecture Rule

**Jangan membuat sistem dengan asumsi bahwa semua materi adalah MikroTik.**

MikroTik hanya merupakan:

```text
Contoh materi awal
```

Sistem harus dapat berkembang menjadi:

```text
MikroTik
React
Python
Database
Arduino
PCB
Akuntansi
Desain
Matematika
Fisika
dan bidang lainnya.
```

---

# 36. Final Product Vision

TechnoBrain adalah:

> **Interactive learning platform untuk siswa SMK dan mahasiswa yang menggabungkan materi pembelajaran, multimedia, simulasi, quiz, dan teknologi 3D dalam satu pengalaman belajar digital.**

Konsep:

```text
                    TECHNOBRAIN
                         │
          ┌──────────────┼──────────────┐
          │              │              │
         LEARN         EXPLORE       INTERACT
          │              │              │
       Materi         Library          3D
          │              │              │
          └──────────────┼──────────────┘
                         │
                       PRACTICE
                         │
                        QUIZ
                         │
                    PROGRESS
                         │
                    UNDERSTAND
```

---

# 37. Updated Acceptance Criteria

Website dianggap berhasil jika:

- [ ] Mendukung siswa SMK
- [ ] Mendukung mahasiswa
- [ ] Tidak terbatas pada TJKT
- [ ] Mendukung berbagai jurusan
- [ ] Mendukung berbagai mata pelajaran/mata kuliah
- [ ] Guru dapat membuat materi
- [ ] Guru dapat mengedit materi
- [ ] Materi berasal dari database
- [ ] Materi dapat dikategorikan berdasarkan jenjang
- [ ] Materi dapat dikategorikan berdasarkan jurusan
- [ ] Materi dapat dikategorikan berdasarkan mata pelajaran
- [ ] Siswa dapat mencari materi
- [ ] Siswa dapat memfilter materi
- [ ] Siswa dapat mengikuti materi
- [ ] Siswa dapat melihat progress
- [ ] Siswa dapat mengerjakan quiz
- [ ] Three.js mendukung berbagai jenis objek
- [ ] MikroTik tersedia sebagai contoh interactive 3D
- [ ] Komentar siswa tersedia
- [ ] Admin dapat mengelola akun
- [ ] Admin dapat membuat akun siswa
- [ ] Admin dapat membuat akun guru/pengajar
- [ ] Admin dapat reset password
- [ ] SQLite terhubung
- [ ] Responsive mobile
- [ ] Responsive tablet
- [ ] Responsive desktop
- [ ] Awwwards-inspired animation
- [ ] Reduced motion
- [ ] Performance optimized
- [ ] Accessible