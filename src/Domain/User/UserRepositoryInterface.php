<?php

declare(strict_types=1);

namespace App\Domain\User;

interface UserRepositoryInterface
{
    public function getLocator(string $consumerHostname, string $id): string;

    public function findUser(string $consumerHostname, string $id): User|null;

    public function createUser(string $consumerHostname, string $id, array $data = []): User;

    public function saveUser(User $user): bool;
}
