<?php

namespace App\Infrastructure\Persistence;

use App\Domain\OAuth2\AppCredentials;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use Battis\LazySecrets\Cache;

class SecretsAppCredentials implements AppCredentialsRepositoryInterface
{
    private Cache $secrets;

    public function __construct()
    {
        $this->secrets = new Cache();
    }

    public function getClientID(): string
    {
        return $this->secrets->get(AppCredentials::CANVAS_CLIENT_ID);
    }

    public function getClientSecret(): string
    {
        return $this->secrets->get(AppCredentials::CANVAS_CLIENT_SECRET);
    }
}
