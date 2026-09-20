<?php

namespace Database\Seeders;

use App\Enums\ContentType;
use App\Enums\Difficulty;
use App\Enums\LessonType;
use App\Enums\MaterialStatus;
use App\Models\Comment;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\Lesson;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Subject;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        [$smk, $university] = $this->seedEducationLevels();
        $departments = $this->seedDepartments($smk, $university);
        $subjects = $this->seedSubjects($departments);
        $users = $this->seedUsers($departments, $smk, $university);
        $materials = $this->seedMaterials($departments, $subjects, $users);

        $this->seedMikrotikScene($materials['mikrotik']);
        $quiz = $this->seedQuiz($materials['mikrotik']);
        $this->seedLessons($materials['mikrotik'], $quiz);
        $this->seedProgressAndComments($users, $materials);
        $this->seedTestimonials($users);
    }

    /**
     * @return array{0: EducationLevel, 1: EducationLevel}
     */
    private function seedEducationLevels(): array
    {
        $smk = EducationLevel::firstOrCreate(['slug' => 'smk'], ['name' => 'SMK']);
        $university = EducationLevel::firstOrCreate(['slug' => 'universitas'], ['name' => 'Universitas']);

        return [$smk, $university];
    }

    /**
     * @return array<string, Department>
     */
    private function seedDepartments(EducationLevel $smk, EducationLevel $university): array
    {
        $definitions = [
            'tjkt' => [$smk, 'TJKT'],
            'pplg' => [$smk, 'PPLG'],
            'dkv' => [$smk, 'DKV'],
            'akuntansi-smk' => [$smk, 'Akuntansi'],
            'informatika' => [$university, 'Informatika'],
            'sistem-informasi' => [$university, 'Sistem Informasi'],
            'teknik-mesin' => [$university, 'Teknik Mesin'],
        ];

        $departments = [];

        foreach ($definitions as $slug => [$level, $name]) {
            $departments[$slug] = Department::firstOrCreate(
                ['slug' => $slug],
                ['education_level_id' => $level->id, 'name' => $name]
            );
        }

        return $departments;
    }

    /**
     * @param  array<string, Department>  $departments
     * @return array<string, Subject>
     */
    private function seedSubjects(array $departments): array
    {
        $definitions = [
            'administrasi-infrastruktur-jaringan' => [$departments['tjkt'], 'Administrasi Infrastruktur Jaringan', 'Konfigurasi dan manajemen perangkat jaringan seperti MikroTik.'],
            'pemrograman-web' => [$departments['pplg'], 'Pemrograman Web', 'Dasar-dasar pengembangan aplikasi web modern.'],
            'desain-grafis' => [$departments['dkv'], 'Desain Grafis', 'Prinsip visual, tipografi, dan tata letak.'],
            'akuntansi-keuangan' => [$departments['akuntansi-smk'], 'Akuntansi Keuangan', 'Pencatatan dan pelaporan transaksi keuangan.'],
            'jaringan-komputer' => [$departments['informatika'], 'Jaringan Komputer', 'Konsep jaringan, routing, dan protokol komunikasi data.'],
            'struktur-data' => [$departments['informatika'], 'Struktur Data', 'Struktur data dan algoritma dasar.'],
            'basis-data' => [$departments['sistem-informasi'], 'Basis Data', 'Perancangan dan query basis data relasional.'],
            'elemen-mesin' => [$departments['teknik-mesin'], 'Elemen Mesin', 'Komponen dan prinsip kerja mesin.'],
        ];

        $subjects = [];

        foreach ($definitions as $slug => [$department, $name, $description]) {
            $subjects[$slug] = Subject::firstOrCreate(
                ['slug' => $slug],
                ['department_id' => $department->id, 'name' => $name, 'description' => $description]
            );
        }

        return $subjects;
    }

    /**
     * @param  array<string, Department>  $departments
     * @return array<string, User>
     */
    private function seedUsers(array $departments, EducationLevel $smk, EducationLevel $university): array
    {
        $users = [];

        $users['admin'] = User::factory()->admin()->create([
            'name' => 'Admin TechnoBrain',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
        ]);

        $users['teacher_tjkt'] = User::factory()->teacher()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@technobrain.test',
            'education_level_id' => $smk->id,
            'department_id' => $departments['tjkt']->id,
            'institution' => 'SMK Negeri 1',
        ]);

        $users['teacher_informatika'] = User::factory()->teacher()->create([
            'name' => 'Dr. Andi Wijaya',
            'email' => 'dr.andi@technobrain.test',
            'education_level_id' => $university->id,
            'department_id' => $departments['informatika']->id,
            'institution' => 'Universitas ABC',
        ]);

        $users['student_smk'] = User::factory()->student()->create([
            'name' => 'Budi',
            'email' => 'budi@technobrain.test',
            'education_level_id' => $smk->id,
            'department_id' => $departments['tjkt']->id,
            'institution' => 'SMK Negeri 1',
            'grade_or_semester' => 'XI',
        ]);

        $users['student_university'] = User::factory()->student()->create([
            'name' => 'Andi',
            'email' => 'andi@technobrain.test',
            'education_level_id' => $university->id,
            'department_id' => $departments['informatika']->id,
            'institution' => 'Universitas ABC',
            'grade_or_semester' => 'Semester 4',
        ]);

        $users['teacher_demo'] = User::factory()->teacher()->create([
            'name' => 'Pengajar Demo',
            'email' => 'teacher@example.com',
            'password' => Hash::make('teacher123'),
            'education_level_id' => $smk->id,
            'department_id' => $departments['tjkt']->id,
            'institution' => 'SMK Negeri 1',
        ]);

        $users['student_demo'] = User::factory()->student()->create([
            'name' => 'Siswa Demo',
            'email' => 'student@gmail.com',
            'password' => Hash::make('student123'),
            'education_level_id' => $smk->id,
            'department_id' => $departments['tjkt']->id,
            'institution' => 'SMK Negeri 1',
            'grade_or_semester' => 'XI',
        ]);

        return $users;
    }

    /**
     * @param  array<string, Department>  $departments
     * @param  array<string, Subject>  $subjects
     * @param  array<string, User>  $users
     * @return array<string, Material>
     */
    private function seedMaterials(array $departments, array $subjects, array $users): array
    {
        $definitions = [
            'mikrotik' => [
                'title' => 'MikroTik Dasar',
                'description' => 'Belajar dasar konfigurasi MikroTik dan RouterOS melalui visualisasi 3D interaktif.',
                'content' => 'MikroTik RouterOS adalah sistem operasi untuk perangkat router yang banyak digunakan pada laboratorium jaringan sekolah. Pada materi ini kamu akan mengenal bagian-bagian fisik router melalui model 3D interaktif, lalu mempelajari konfigurasi dasar seperti DHCP dan routing.',
                'thumbnail' => '/images/hero/hero-1.png',
                'content_type' => ContentType::ThreeD,
                'department' => $departments['tjkt'],
                'subject' => $subjects['administrasi-infrastruktur-jaringan'],
                'category' => 'Jaringan',
                'difficulty' => Difficulty::Beginner,
                'author' => $users['teacher_tjkt'],
            ],
        ];

        $materials = [];

        foreach ($definitions as $key => $definition) {
            $materials[$key] = Material::firstOrCreate(
                ['slug' => str($definition['title'])->slug()],
                [
                    'title' => $definition['title'],
                    'description' => $definition['description'],
                    'content' => $definition['content'],
                    'thumbnail' => $definition['thumbnail'] ?? null,
                    'content_type' => $definition['content_type'],
                    'education_level_id' => $definition['department']->education_level_id,
                    'department_id' => $definition['department']->id,
                    'subject_id' => $definition['subject']->id,
                    'category' => $definition['category'],
                    'difficulty' => $definition['difficulty'],
                    'status' => MaterialStatus::Published,
                    'author_id' => $definition['author']->id,
                ]
            );
        }

        return $materials;
    }

    private function seedMikrotikScene(Material $mikrotik): void
    {
        $mikrotik->update([
            'scene_config' => [
                'objects' => [
                    [
                        'key' => 'body',
                        'label' => 'Router Body',
                        'model' => '/3dmodel/Mikrotik.glb',
                        'position' => [0, -0.1, 0],
                        'clickable' => false,
                        // Keys must match actual node names inside the GLB file.
                        'components' => [
                            'Port_1' => ['label' => 'Ethernet Port 1', 'info' => 'Port LAN untuk menghubungkan router ke perangkat lain seperti switch, komputer, atau access point.'],
                            'Port_2' => ['label' => 'Ethernet Port 2', 'info' => 'Port LAN tambahan untuk memperluas jaringan kabel ke perangkat lain.'],
                            'Port_3' => ['label' => 'Ethernet Port 3', 'info' => 'Port LAN tambahan, biasa dipakai untuk menyambungkan switch tambahan atau perangkat lain.'],
                            'Port_4' => ['label' => 'Ethernet Port 4', 'info' => 'Port LAN tambahan pada baris terakhir, umumnya dipakai sebagai jalur uplink ke modem.'],
                            'PoE' => ['label' => 'Port PoE', 'info' => 'Power over Ethernet — port yang bisa mengalirkan daya listrik sekaligus data lewat satu kabel, biasa dipakai untuk access point.'],
                            'PWR' => ['label' => 'Lampu Indikator Power (PWR)', 'info' => 'Indikator bahwa perangkat sudah dialiri arus listrik dan aktif.'],
                            'Power' => ['label' => 'Colokan Power', 'info' => 'Tempat menyambungkan adaptor listrik untuk mengalirkan daya (tenaga listrik) agar perangkat router dapat menyala dan bekerja.'],
                            'ACT' => ['label' => 'Lampu Indikator (ACT)', 'info' => 'Lampu indikator yang berkedip saat ada aktivitas transfer data pada router.'],
                            'RES' => ['label' => 'Tombol Reset (RES)', 'info' => 'Tombol reset — ditekan dan ditahan beberapa detik untuk mengembalikan router ke pengaturan pabrik (factory reset).'],
                        ],
                    ],
                ],
            ],
        ]);
    }

    private function seedQuiz(Material $mikrotik): Quiz
    {
        $quiz = Quiz::firstOrCreate(
            ['material_id' => $mikrotik->id, 'title' => 'Quiz MikroTik Dasar'],
            ['description' => 'Uji pemahamanmu tentang dasar-dasar MikroTik.']
        );

        $question = QuizQuestion::firstOrCreate(
            ['quiz_id' => $quiz->id, 'question' => 'Apa fungsi DHCP Server?'],
            ['order' => 0]
        );

        if ($question->answers()->count() === 0) {
            $question->answers()->createMany([
                ['answer_text' => 'Mengatur tampilan website', 'is_correct' => false, 'order' => 0],
                ['answer_text' => 'Memberikan IP address secara otomatis', 'is_correct' => true, 'order' => 1],
                ['answer_text' => 'Menghapus firewall', 'is_correct' => false, 'order' => 2],
                ['answer_text' => 'Membuat database', 'is_correct' => false, 'order' => 3],
            ]);
        }

        $question2 = QuizQuestion::firstOrCreate(
            ['quiz_id' => $quiz->id, 'question' => 'Perangkat apa yang digunakan untuk menghubungkan beberapa jaringan dan meneruskan paket data?'],
            ['order' => 1]
        );

        if ($question2->answers()->count() === 0) {
            $question2->answers()->createMany([
                ['answer_text' => 'Router', 'is_correct' => true, 'order' => 0],
                ['answer_text' => 'Keyboard', 'is_correct' => false, 'order' => 1],
                ['answer_text' => 'Monitor', 'is_correct' => false, 'order' => 2],
                ['answer_text' => 'Printer', 'is_correct' => false, 'order' => 3],
            ]);
        }

        return $quiz;
    }

    private function seedLessons(Material $mikrotik, Quiz $quiz): void
    {
        Lesson::firstOrCreate(
            ['material_id' => $mikrotik->id, 'type' => LessonType::Video],
            [
                'title' => 'Pengenalan Dunia Jaringan',
                'body' => 'Sebelum masuk ke MikroTik, kenali dulu dasar-dasar jaringan komputer lewat video singkat berikut.',
                'video_url' => 'https://youtu.be/3jsI6h2EwGA?si=g6sFVgNlK2OIt8Jm',
                'order' => 0,
            ]
        );

        Lesson::firstOrCreate(
            ['material_id' => $mikrotik->id, 'type' => LessonType::Quiz],
            [
                'title' => $quiz->title,
                'body' => 'Uji pemahamanmu tentang dasar-dasar MikroTik yang sudah dipelajari.',
                'quiz_id' => $quiz->id,
                'order' => 1,
            ]
        );
    }

    /**
     * @param  array<string, User>  $users
     * @param  array<string, Material>  $materials
     */
    private function seedProgressAndComments(array $users, array $materials): void
    {
        $mikrotikLessons = $materials['mikrotik']->lessons()->orderBy('order')->get();

        // Budi (SMK) has only finished the first lesson — in-progress.
        $mikrotikLessons->take(1)->each(fn (Lesson $lesson) => $lesson->completeFor($users['student_smk']));

        // Andi (university) has finished the whole curriculum.
        $mikrotikLessons->each(fn (Lesson $lesson) => $lesson->completeFor($users['student_university']));

        Comment::firstOrCreate(
            ['user_id' => $users['student_smk']->id, 'material_id' => $materials['mikrotik']->id, 'body' => 'Materinya jelas banget, jadi lebih paham bagian-bagian router MikroTik!'],
        );

        Comment::firstOrCreate(
            ['user_id' => $users['student_university']->id, 'material_id' => $materials['mikrotik']->id, 'body' => 'Model 3D-nya bikin lebih gampang paham fungsi tiap port di router.'],
        );
    }

    /**
     * @param  array<string, User>  $users
     */
    private function seedTestimonials(array $users): void
    {
        Testimonial::firstOrCreate(
            ['user_id' => $users['student_smk']->id],
            ['body' => 'TechnoBrain bikin belajar MikroTik jadi jauh lebih gampang dipahami lewat model 3D-nya. Seru banget!']
        );

        Testimonial::firstOrCreate(
            ['user_id' => $users['student_university']->id],
            ['body' => 'Materinya lengkap dari jaringan sampai pemrograman. Progress belajar juga kelihatan jelas di dashboard.']
        );

        Testimonial::firstOrCreate(
            ['user_id' => $users['teacher_tjkt']->id],
            ['body' => 'Sebagai pengajar, saya bisa dengan mudah membuat dan mengedit materi baru untuk siswa TJKT tanpa perlu bantuan developer.']
        );
    }
}
