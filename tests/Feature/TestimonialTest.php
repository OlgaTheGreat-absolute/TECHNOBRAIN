<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_post_a_testimonial(): void
    {
        $user = User::factory()->student()->create();

        $response = $this->actingAs($user)->post(route('testimonials.store'), [
            'body' => 'Belajar di TechnoBrain sangat menyenangkan!',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('testimonials', [
            'user_id' => $user->id,
            'body' => 'Belajar di TechnoBrain sangat menyenangkan!',
        ]);
    }

    public function test_guest_cannot_post_a_testimonial(): void
    {
        $response = $this->post(route('testimonials.store'), ['body' => 'Test']);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('testimonials', 0);
    }

    public function test_home_page_lists_featured_testimonials(): void
    {
        $user = User::factory()->student()->create(['name' => 'Siswa Testimoni']);
        $user->testimonials()->create(['body' => 'Materinya sangat membantu.', 'is_featured' => true]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Materinya sangat membantu.');
        $response->assertSee('Siswa Testimoni');
    }
}
