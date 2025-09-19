<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use GrotonSchool\Slim\OAuth2\APIProxy\GAE\AbstractUserIdentifierMiddleware;
use Psr\Http\Message\ServerRequestInterface;
use GrotonSchool\Slim\LTI\Domain\User\User;
use App\Domain\LTI\LaunchData;

class ApiProxyUserIdentifier extends AbstractUserIdentifierMiddleware
{
    protected function getIdentifier(ServerRequestInterface $request): string
    {
        /** @var User $user */
        $user = $request->getAttribute(Authenticated::USER);
        /** @var LaunchData $launch */
        $launch = $request->getAttribute(Authenticated::LAUNCH_MESSAGE);
        return  $launch->getConsumerInstanceHostname() . '::' . $user->getId();
    }
}
