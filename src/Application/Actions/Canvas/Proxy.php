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
        $uri = $this->request->getUri();
        $partial = str_replace('/canvas', '', $uri->getPath());
        if (strlen($query = $uri->getQuery())) {
            $partial .= "?$query";
        }
        return $this->proxyRequest(
            $this->request->getMethod(),
            $partial,
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
                $request = $this->canvas->getAuthenticatedRequest(
                    $method,
                    $url,
                    $user->getTokens(),
                    $options
                );
                $response = $this->client->send($request);
                if ($this->settings->logRequests()) {
                    $this->logger->debug($request->getMethod() . ' ' . $request->getUri(), [
                        'headers' => $request->getHeaders(),
                        'body' => $request->getBody(),
                        'response' => [
                            'status' => $response->getStatusCode(),
                            'headers' => $response->getHeaders(),
                            'body' => $response->getBody()
                        ]
                    ]);
                }
                return $response;
            } catch (RequestException $exception) {
                $this->logger->error($request->getMethod() . ' ' . $request->getUri(), [
                    'headers' => $request->getHeaders(),
                    'body' => $request->getBody(),
                    'response' => [
                        'status' => $exception->getResponse()->getStatusCode(),
                        'headers' => $exception->getResponse()->getHeaders(),
                        'body' => $exception->getResponse()->getBody()
                    ]
                ]);
                return $exception->getResponse();
            }
        }
        return $this->response->withStatus(401);
    }
}
