<?php

try {
    require __DIR__.'/../public/index.php';
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain');
    echo 'DIAGNOSTIC: '.get_class($e).': '.$e->getMessage()."\n";
    echo $e->getFile().':'.$e->getLine()."\n\n";
    echo $e->getTraceAsString();
}
