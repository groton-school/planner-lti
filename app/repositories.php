<?php

declare(strict_types=1);

use App\Domain\AppCredentials\AppCredentialsRepositoryInterface;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Infrastructure\Persistence\FirestoreUserRepository;
use App\Infrastructure\Persistence\SecretsAppCredentials;
use App\Infrastructure\Session\SessionLaunchDataRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        AppCredentialsRepositoryInterface::class => DI\autowire(SecretsAppCredentials::class),
        UserRepositoryInterface::class => DI\autowire(FirestoreUserRepository::class),
    ]);
};
