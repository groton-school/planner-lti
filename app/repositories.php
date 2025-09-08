<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use GrotonSchool\Slim\LTI\Domain\User\UserRepositoryInterface;
use GrotonSchool\Slim\LTI\Infrastructure\GAE\Firestore\FirestoreUserRepository;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        UserRepositoryInterface::class => DI\autowire(FirestoreUserRepository::class),
    ]);
};
