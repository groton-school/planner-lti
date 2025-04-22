<?php

namespace App\Domain\OAuth2;

class AppCredentials
{
    public const CANVAS_CLIENT_ID = 'CANVAS_CLIENT_ID';
    public const CANVAS_CLIENT_SECRET = 'CANVAS_CLIENT_SECRET';

    private string $clientId;
    private string $clientSecret;

    public function __construct(string $clientId, string $clientSecret)
    {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
    }

    public function getClientId()
    {
        return $this->clientId;
    }

    public function getClientSecret()
    {
        return $this->clientSecret;
    }
}
