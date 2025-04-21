<?php

namespace App\Infrastructure\Persistence;

use App\Domain\AppCredentials\AppCredentials;
use App\Domain\AppCredentials\AppCredentialsRepositoryInterface;
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
