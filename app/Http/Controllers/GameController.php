<?php

namespace App\Http\Controllers;

use App\Enums\GameStatus;
use App\Enums\Powerup;
use App\Models\GameAnswer;
use App\Models\GameParticipant;
use App\Models\GameRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $canHost = $user->isTeacher() || $user->isAdmin();

        $recentRooms = $canHost
            ? GameRoom::where('host_id', $user->id)->withCount(['questions', 'participants'])->latest()->take(10)->get()
            : [];

        $joined = ! $canHost
            ? GameParticipant::where('user_id', $user->id)->with('room')->latest()->take(5)->get()
                ->map(fn (GameParticipant $p) => ['code' => $p->room->code, 'title' => $p->room->title, 'status' => $p->room->status->value, 'score' => $p->score])
            : [];

        return Inertia::render('Games/Index', [
            'isTeacher' => $canHost,
            'recentRooms' => $recentRooms,
            'joined' => $joined,
        ]);
    }

    public function join(Request $request): RedirectResponse
    {
        $validated = $request->validate(['code' => ['required', 'string', 'max:8']]);

        $room = GameRoom::where('code', strtoupper($validated['code']))->first();

        if (! $room) {
            return back()->withErrors(['code' => 'Kode room tidak ditemukan.']);
        }

        if ($room->status === GameStatus::Finished) {
            return back()->withErrors(['code' => 'Kuis ini sudah selesai.']);
        }

        GameParticipant::firstOrCreate(
            ['game_room_id' => $room->id, 'user_id' => Auth::id()],
            ['powerup' => collect(Powerup::cases())->random()->value]
        );

        return redirect()->route('games.play', $room->code);
    }

    public function play(GameRoom $room): Response
    {
        $this->authorizeParticipant($room);

        return Inertia::render('Games/Play', [
            'roomCode' => $room->code,
            'roomTitle' => $room->title,
        ]);
    }

    public function state(GameRoom $room): JsonResponse
    {
        return response()->json($this->presentRoomForPlayer($room));
    }

    public function answer(Request $request, GameRoom $room): JsonResponse
    {
        $participant = $this->authorizeParticipant($room);

        $validated = $request->validate(['selected_index' => ['required', 'integer', 'min:0']]);

        $question = $room->currentQuestion();
        abort_unless($question, 422);

        $alreadyAnswered = GameAnswer::where('game_participant_id', $participant->id)
            ->where('game_question_id', $question->id)
            ->exists();

        if ($alreadyAnswered) {
            return response()->json(['error' => 'Sudah dijawab.'], 422);
        }

        $questionSeconds = $room->questionSeconds($question);
        $remaining = $room->secondsRemaining();
        $isCorrect = (int) $validated['selected_index'] === $question->correct_index;

        $points = 0;

        if ($isCorrect) {
            $points = max(100, (int) round(1000 * ($remaining / max(1, $questionSeconds))));

            if ($participant->powerup === Powerup::DoublePoints && $participant->powerup_used) {
                $points *= 2;
            }
        }

        GameAnswer::create([
            'game_participant_id' => $participant->id,
            'game_question_id' => $question->id,
            'selected_index' => $validated['selected_index'],
            'is_correct' => $isCorrect,
            'points_awarded' => $points,
            'time_taken_ms' => max(0, ($questionSeconds - $remaining)) * 1000,
        ]);

        if ($points > 0) {
            $participant->increment('score', $points);
        }

        return response()->json(['correct' => $isCorrect, 'points' => $points, 'correctIndex' => $question->correct_index]);
    }

    public function usePowerup(GameRoom $room): JsonResponse
    {
        $participant = $this->authorizeParticipant($room);

        abort_if(! $participant->powerup || $participant->powerup_used, 422);

        $participant->update(['powerup_used' => true]);

        $payload = ['powerup' => $participant->powerup->value];

        if ($participant->powerup === Powerup::FiftyFifty) {
            $question = $room->currentQuestion();

            $payload['eliminate'] = collect(range(0, count($question->options) - 1))
                ->reject(fn ($i) => $i === $question->correct_index)
                ->shuffle()
                ->take(2)
                ->values();
        }

        return response()->json($payload);
    }

    private function authorizeParticipant(GameRoom $room): GameParticipant
    {
        $participant = GameParticipant::where('game_room_id', $room->id)->where('user_id', Auth::id())->first();

        abort_unless($participant, 403);

        return $participant;
    }

    private function presentRoomForPlayer(GameRoom $room): array
    {
        $participant = $this->authorizeParticipant($room);
        $question = $room->currentQuestion();

        $alreadyAnswered = $question
            ? GameAnswer::where('game_participant_id', $participant->id)->where('game_question_id', $question->id)->exists()
            : false;

        $data = [
            'code' => $room->code,
            'title' => $room->title,
            'status' => $room->status->value,
            'totalQuestions' => $room->questions()->count(),
            'currentIndex' => $room->current_question_index,
            'secondsRemaining' => $room->secondsRemaining(),
            'myScore' => $participant->score,
            'myPowerup' => $participant->powerup?->value,
            'myPowerupUsed' => $participant->powerup_used,
            'alreadyAnswered' => $alreadyAnswered,
            'question' => $question ? [
                'id' => $question->id,
                'question' => $question->question,
                'options' => $question->options,
                'seconds' => $room->questionSeconds($question),
            ] : null,
        ];

        if ($room->status === GameStatus::Finished) {
            $ranked = $room->participants()->with('user:id,name,nickname,avatar')->orderByDesc('score')->get()->values();

            $data['leaderboard'] = $ranked->take(3)->map(fn ($p, $i) => [
                'rank' => $i + 1,
                'name' => $p->user->display_name,
                'avatarUrl' => $p->user->avatar_url,
                'score' => $p->score,
            ]);

            $myRank = $ranked->search(fn ($p) => $p->id === $participant->id);
            $data['myRank'] = $myRank === false ? null : $myRank + 1;
            $data['totalParticipants'] = $ranked->count();
        }

        return $data;
    }
}
