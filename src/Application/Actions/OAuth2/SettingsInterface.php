<?php

declare(strict_types=1);

namespace App\Application\Actions\OAuth2;

interface SettingsInterface
{
    public function getOAuth2RedirectUri(): string;
}
