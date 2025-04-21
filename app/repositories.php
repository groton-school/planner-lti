<?php

declare(strict_types=1);

use App\Domain\AppCredentials\AppCredentialsRepositoryInterface;
use App\Infrastructure\Persistence\SecretsAppCredentials;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        AppCredentialsRepositoryInterface::class => DI\autowire(SecretsAppCredentials::class),
    ]);
};
