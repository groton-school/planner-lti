<?php

declare(strict_types=1);

use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Infrastructure\Persistence\FirestoreUserRepository;
use App\Infrastructure\Persistence\SecretsAppCredentials;
use App\Infrastructure\Session\SessionLaunchDataRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LaunchDataRepositoryInterface::class => DI\autowire(SessionLaunchDataRepository::class),
        AppCredentialsRepositoryInterface::class => DI\autowire(SecretsAppCredentials::class),
        UserRepositoryInterface::class => DI\autowire(FirestoreUserRepository::class),
    ]);
};
