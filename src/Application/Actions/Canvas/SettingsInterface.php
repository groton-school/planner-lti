<?php

declare(strict_types=1);

namespace App\Application\Actions\Canvas;

interface SettingsInterface
{
    public function logRequests(): bool;
}
