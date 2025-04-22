<?php

declare(strict_types=1);

namespace App\Domain\OAuth2;

interface AppCredentialsRepositoryInterface
{
    public function getClientID(): string;
    public function getClientSecret(): string;
}
