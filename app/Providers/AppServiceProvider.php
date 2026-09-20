<?php

namespace App\Providers;

use AsyncAws\S3\S3Client;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\AsyncAwsS3\AsyncAwsS3Adapter;
use League\Flysystem\Filesystem;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Storage::extend('supabase-s3', function ($app, array $config) {
            unset($config['root']);

            $client = new S3Client([
                'region' => $config['region'],
                'accessKeyId' => $config['key'],
                'accessKeySecret' => $config['secret'],
                'endpoint' => $config['endpoint'],
                'pathStyleEndpoint' => $config['use_path_style_endpoint'] ?? true,
            ]);

            $adapter = new AsyncAwsS3Adapter($client, $config['bucket']);

            return new class(new Filesystem($adapter, $config), $adapter, $config) extends FilesystemAdapter
            {
                public function url($path): string
                {
                    return isset($this->config['url'])
                        ? $this->concatPathToUrl($this->config['url'], $this->prefixer->prefixPath($path))
                        : parent::url($path);
                }
            };
        });
    }
}
