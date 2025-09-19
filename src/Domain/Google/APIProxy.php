<?php

declare(strict_types=1);

namespace App\Domain\Google;

use GrotonSchool\Slim\OAuth2\APIProxy\Domain\Provider\Defaults;
use GrotonSchool\Slim\OAuth2\APIProxy\Domain\Provider\ProviderInterface;
use League\OAuth2\Client\Provider\Google;

class APIProxy extends Google implements ProviderInterface
{
    use Defaults\Headers;
    use Defaults\AccessTokenRepository;

    public const SLUG = 'google';

    public function getAuthorizedRedirect(): string
    {
        return '/google/login/complete';
    }

    public function getSlug(): string
    {
        return self::SLUG;
    }

    public function getBaseApiUrl(): string
    {
        return 'https://www.googleapis.com';
    }
}
