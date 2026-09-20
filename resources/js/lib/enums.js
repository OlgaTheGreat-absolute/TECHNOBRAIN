export const contentTypeLabels = {
    '3d': '3D Interaktif',
    image: 'Gambar',
};

export const difficultyLabels = {
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Lanjutan',
};

export const roleLabels = {
    admin: 'Admin',
    teacher: 'Pengajar',
    student: 'Siswa/Mahasiswa',
};

export const progressStatusLabels = {
    not_started: 'Belum Dimulai',
    in_progress: 'Sedang Berjalan',
    completed: 'Selesai',
};

export const lessonTypeLabels = {
    video: 'Video',
    pdf: 'PDF',
    quiz: 'Quiz',
};

export function lessonTypeLabel(value) {
    return lessonTypeLabels[value] ?? value;
}

export function contentTypeLabel(value) {
    return contentTypeLabels[value] ?? value;
}

export function difficultyLabel(value) {
    return difficultyLabels[value] ?? value;
}

export function roleLabel(value) {
    return roleLabels[value] ?? value;
}
