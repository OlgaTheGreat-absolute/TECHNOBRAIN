<?php

use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizAttemptController;
use App\Http\Controllers\Teacher\ActivityController;
use App\Http\Controllers\Teacher\GameController as TeacherGameController;
use App\Http\Controllers\Teacher\LessonController as TeacherLessonController;
use App\Http\Controllers\Teacher\QuizController;
use App\Http\Controllers\Teacher\QuizResultController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/explore', [ExploreController::class, 'index'])->name('explore');
Route::get('/materi/{material:slug}', [MaterialController::class, 'show'])->name('materials.show');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('materi/{material:slug}/belajar/{lesson?}', [LessonController::class, 'show'])->name('materials.learn');
    Route::post('materi/{material:slug}/belajar/{lesson}/selesai', [LessonController::class, 'complete'])->name('materials.lessons.complete');

    Route::post('materi/{material:slug}/comments', [CommentController::class, 'store'])->name('materials.comments.store');
    Route::post('quizzes/{quiz}/attempt', [QuizAttemptController::class, 'store'])->name('quizzes.attempt');
    Route::post('testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');

    Route::get('kuis', [GameController::class, 'index'])->name('games.index');
    Route::post('kuis/gabung', [GameController::class, 'join'])->name('games.join');
    Route::get('kuis/{room:code}/main', [GameController::class, 'play'])->name('games.play');
    Route::get('kuis/{room:code}/state', [GameController::class, 'state'])->name('games.state');
    Route::post('kuis/{room:code}/jawab', [GameController::class, 'answer'])->name('games.answer');
    Route::post('kuis/{room:code}/skill', [GameController::class, 'usePowerup'])->name('games.powerup');

    Route::middleware('role:teacher,admin')->prefix('teacher')->name('teacher.')->group(function () {
        Route::resource('materials', App\Http\Controllers\Teacher\MaterialController::class)->except(['show']);
        Route::post('materials/{material}/activities', [ActivityController::class, 'store'])->name('materials.activities.store');
        Route::delete('materials/{material}/activities/{activity}', [ActivityController::class, 'destroy'])->name('materials.activities.destroy');
        Route::post('materials/{material}/lessons', [TeacherLessonController::class, 'store'])->name('materials.lessons.store');
        Route::put('materials/{material}/lessons/{lesson}', [TeacherLessonController::class, 'update'])->name('materials.lessons.update');
        Route::delete('materials/{material}/lessons/{lesson}', [TeacherLessonController::class, 'destroy'])->name('materials.lessons.destroy');
        Route::post('materials/{material}/quizzes', [QuizController::class, 'store'])->name('materials.quizzes.store');
        Route::delete('materials/{material}/quizzes/{quiz}', [QuizController::class, 'destroy'])->name('materials.quizzes.destroy');
        Route::post('materials/{material}/quizzes/{quiz}/questions', [QuizController::class, 'storeQuestion'])->name('materials.quizzes.questions.store');
        Route::put('materials/{material}/quizzes/{quiz}/questions/{question}', [QuizController::class, 'updateQuestion'])->name('materials.quizzes.questions.update');
        Route::delete('materials/{material}/quizzes/{quiz}/questions/{question}', [QuizController::class, 'destroyQuestion'])->name('materials.quizzes.questions.destroy');

        Route::get('nilai', [QuizResultController::class, 'index'])->name('grades.index');
        Route::get('nilai/{quiz}', [QuizResultController::class, 'show'])->name('grades.show');

        Route::get('kuis/buat', [TeacherGameController::class, 'create'])->name('games.create');
        Route::post('kuis', [TeacherGameController::class, 'store'])->name('games.store');
        Route::get('kuis/{room:code}/kelola', [TeacherGameController::class, 'manage'])->name('games.manage');
        Route::get('kuis/{room:code}/state', [TeacherGameController::class, 'state'])->name('games.state');
        Route::post('kuis/{room:code}/mulai', [TeacherGameController::class, 'start'])->name('games.start');
        Route::post('kuis/{room:code}/lanjut', [TeacherGameController::class, 'next'])->name('games.next');
        Route::post('kuis/{room:code}/selesai', [TeacherGameController::class, 'finish'])->name('games.finish');
        Route::delete('kuis/{room:code}', [TeacherGameController::class, 'destroy'])->name('games.destroy');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');

        Route::get('departments', [DepartmentController::class, 'index'])->name('departments.index');
        Route::post('departments', [DepartmentController::class, 'store'])->name('departments.store');
        Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

        Route::get('subjects', [SubjectController::class, 'index'])->name('subjects.index');
        Route::post('subjects', [SubjectController::class, 'store'])->name('subjects.store');
        Route::delete('subjects/{subject}', [SubjectController::class, 'destroy'])->name('subjects.destroy');
    });
});
