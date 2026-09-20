<?php

namespace App\Http\Controllers\Teacher;

use App\Enums\GameStatus;
use App\Http\Controllers\Controller;
use App\Models\GameRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Teacher/Games/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'default_seconds' => ['required', 'integer', 'min:5', 'max:120'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string', 'max:500'],
            'questions.*.options' => ['required', 'array', 'min:2', 'max:6'],
            'questions.*.options.*' => ['required', 'string', 'max:255'],
            'questions.*.correct_index' => ['required', 'integer', 'min:0'],
            'questions.*.seconds' => ['nullable', 'integer', 'min:5', 'max:120'],
        ]);

        $room = GameRoom::create([
            'code' => GameRoom::generateCode(),
            'title' => $validated['title'],
            'host_id' => Auth::id(),
            'status' => GameStatus::Lobby,
            'default_seconds' => $validated['default_seconds'],
        ]);

        foreach ($validated['questions'] as $index => $question) {
            $room->questions()->create([
                'question' => $question['question'],
                'options' => array_values($question['options']),
                'correct_index' => $question['correct_index'],
                'seconds' => $question['seconds'] ?? null,
                'order' => $index,
            ]);
        }

        return redirect()->route('teacher.games.manage', $room->code)->with('status', 'Room kuis berhasil dibuat.');
    }

    public function manage(GameRoom $room): Response
    {
        $this->authorizeHost($room);

        return Inertia::render('Teacher/Games/Manage', [
            'room' => $this->presentRoomForHost($room),
        ]);
    }

    public function state(GameRoom $room): JsonResponse
    {
        $this->authorizeHost($room);

        return response()->json($this->presentRoomForHost($room));
    }

    public function start(GameRoom $room): RedirectResponse
    {
        $this->authorizeHost($room);
        abort_if($room->questions()->count() === 0, 422);

        $room->update([
            'status' => GameStatus::Active,
            'current_question_index' => 0,
            'current_question_started_at' => now(),
        ]);

        return back();
    }

    public function next(GameRoom $room): RedirectResponse
    {
        $this->authorizeHost($room);

        $nextIndex = $room->current_question_index + 1;

        if ($nextIndex >= $room->questions()->count()) {
            $room->update(['status' => GameStatus::Finished]);
        } else {
            $room->update(['current_question_index' => $nextIndex, 'current_question_started_at' => now()]);
        }

        return back();
    }

    public function finish(GameRoom $room): RedirectResponse
    {
        $this->authorizeHost($room);

        $room->update(['status' => GameStatus::Finished]);

        return back();
    }

    public function destroy(GameRoom $room): RedirectResponse
    {
        $this->authorizeHost($room);

        $room->delete();

        return redirect()->route('games.index')->with('status', 'Room kuis dihapus.');
    }

    private function authorizeHost(GameRoom $room): void
    {
        abort_unless($room->host_id === Auth::id(), 403);
    }

    private function presentRoomForHost(GameRoom $room): array
    {
        $room->load(['questions', 'participants.user:id,name,nickname,avatar']);
        $question = $room->currentQuestion();
        $ranked = $room->participants->sortByDesc('score')->values();

        return [
            'code' => $room->code,
            'title' => $room->title,
            'status' => $room->status->value,
            'currentIndex' => $room->current_question_index,
            'totalQuestions' => $room->questions->count(),
            'secondsRemaining' => $room->secondsRemaining(),
            'question' => $question ? [
                'question' => $question->question,
                'options' => $question->options,
                'correctIndex' => $question->correct_index,
                'seconds' => $room->questionSeconds($question),
                'answeredCount' => $question->answers()->count(),
            ] : null,
            'participants' => $ranked->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->user->display_name,
                'avatarUrl' => $p->user->avatar_url,
                'score' => $p->score,
            ])->values(),
            'leaderboard' => $room->status === GameStatus::Finished
                ? $ranked->take(3)->map(fn ($p, $i) => [
                    'rank' => $i + 1,
                    'name' => $p->user->display_name,
                    'avatarUrl' => $p->user->avatar_url,
                    'score' => $p->score,
                ])->values()
                : null,
        ];
    }
}
