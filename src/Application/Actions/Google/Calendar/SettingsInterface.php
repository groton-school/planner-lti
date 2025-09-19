<?php

declare(strict_types=1);

namespace App\Application\Actions\Google\Calendar;

interface SettingsInterface
{
    public function getCalendarId(): string;
}
