<?php

declare(strict_types=1);

namespace App\Application\Actions\Canvas;

use App\Application\Actions\OAuth2\SettingsInterface;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\LTI\LaunchDataTrait;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\OAuth2\OAuth2Trait;
use App\Domain\User\UnauthorizedException;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\User\UsersTrait;
use GrotonSchool\Slim\Actions\AbstractAction;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

class Proxy extends AbstractAction
{
    use UsersTrait;
    use OAuth2Trait;
    use LaunchDataTrait;

    protected Client $client;

    public function __construct(
        LaunchDataRepositoryInterface $launchData,
        UserRepositoryInterface $users,
        AppCredentialsRepositoryInterface $credentials,
        SettingsInterface $settings,
        private LoggerInterface $logger
    ) {
        $this->initLaunchData($launchData);
        $this->initUsers($launchData, $users);
        $this->initOAuth2($settings, $credentials, $launchData);
        $this->client = new Client();
    }

    protected function action(): ResponseInterface
    {
        try {
            $request = $this->canvas->getAuthenticatedRequest(
                $this->request->getMethod(),
                $this->getCanvasUri(),
                $this->getUserToken(),
                $this->getBodyOptions()
            );
            try {
                $response = $this->client->send($request);
                return $this->logRequest($request, $response);
            } catch (RequestException $exception) {
                return $this->logRequest($request, $exception->getResponse());
            }
        } catch (UnauthorizedException $e) {
            return $this->response->withStatus(401);
        }
    }

    private function getUserToken()
    {
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
            return $user->getTokens();
        }
        throw new UnauthorizedException();
    }

    private function getCanvasUri()
    {
        return $this->request->getUri()
            ->withHost($this->getLaunchData()->getConsumerInstanceHostname())
            ->withPort(443)
            ->withPath(str_replace('/canvas/', '/', $this->request->getUri()->getPath()));
    }

    private function getBodyOptions()
    {
        $options = [
            // bodyParsingMiddleware destroys the raw body in the process
            'body' => (string)$this->request->getBody()
        ];
        $contentType = $this->request->getHeader('Content-Type');
        $contentType = array_pop($contentType);
        if ($contentType && strlen($contentType)) {
            $options['headers'] = [
                'Content-Type' => $contentType
            ];
        }
        return $options;
    }

    private function logRequest(RequestInterface $request, ResponseInterface $response)
    {
        if ($this->settings->logRequests()) {
            $this->logger->debug($request->getMethod() . ' ' . $request->getUri(), [
                'received' => [
                    'uri' => $this->request->getUri(),
                    'headers' => $this->request->getHeaders(),
                    'body' => (string) $this->request->getBody(),
                ],
                'sent' => [
                    'uri' => $request->getUri(),
                    'headers' => $request->getHeaders(),
                    'body' => $request->getBody()
                ],
                'response' => [
                    'status' => $response->getStatusCode(),
                    'headers' => $response->getHeaders(),
                    'body' => $response->getBody()
                ]
            ]);
        }
        return $response;
    }
}
