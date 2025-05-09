<?php

declare(strict_types=1);

namespace App\Application\Actions\Canvas;

use App\Application\Actions\AbstractAction;
use App\Application\Actions\OAuth2\SettingsInterface;
use App\Application\LoggerTrait;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\LTI\LaunchDataTrait;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\OAuth2\OAuth2Trait;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\User\UsersTrait;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

class Proxy extends AbstractAction
{
    use LoggerTrait, UsersTrait, OAuth2Trait, LaunchDataTrait;

    protected Client $client;

    public function __construct(
        LaunchDataRepositoryInterface $launchData,
        UserRepositoryInterface $users,
        AppCredentialsRepositoryInterface $credentials,
        SettingsInterface $settings,
        LoggerInterface $logger
    ) {
        $this->initLogger($logger);
        $this->initLaunchData($launchData);
        $this->initUsers($launchData, $users);
        $this->initOAuth2($settings, $credentials, $launchData);
        $this->client = new Client([
            'base_uri' => $this->launchData->getLaunchData()->getConsumerInstanceUrl()
        ]);
    }

    protected function action(): ResponseInterface
    {
        return $this->proxyRequest(
            $this->request->getMethod(),
            $this->args['path'],
            ['body' => $this->request->getBody()]
        );
    }

    protected function proxyRequest(
        string $method,
        string $url,
        array $options = []
    ) {
        $user = $this->getCurrentUser();
        if ($user) {
            if ($user->getTokens()->hasExpired()) {
                $user->setTokens($this->canvas->getAccessToken(
                    'refresh_token',
                    ['refresh_token' => $user->getTokens()->getRefreshToken()]
                ));
                $this->users->saveUser($user);
                $this->logger->info('Refreshed token for ' . $user->getLocator());
            }
            try {
                return $this->client->send(
                    $this->canvas->getAuthenticatedRequest(
                        $method,
                        "$url?" . http_build_query($this->request->getQueryParams()),
                        $user->getTokens(),
                        $options
                    )
                );
            } catch (RequestException $exception) {
                return $exception->getResponse();
            }
        }
        return $this->response->withStatus(401);
    }
}
