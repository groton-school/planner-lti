<?php

declare(strict_types=1);

namespace App\Application\Actions\Calendar;

use App\Application\Actions\AbstractAuthenticatedViewAction;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\CalendarListEntry;
use Psr\Http\Message\ResponseInterface;

class Events extends AbstractAuthenticatedViewAction
{
    private Calendar $calendar;
    private AppCredentialsRepositoryInterface $credentials;

    public function  __construct(
        LaunchDataRepositoryInterface $launchData,
        UserRepositoryInterface $users,
        Client $client,
        AppCredentialsRepositoryInterface $credentials
    ) {
        parent::__construct($launchData, $users);
        $client->setScopes('https://www.googleapis.com/auth/calendar');
        $this->calendar = new Calendar($client);
        $this->credentials = $credentials;
    }

    protected function authenticatedAction(): ResponseInterface
    {
        $params = $this->request->getQueryParams();
        if (isset($params['q'])) {
            $params['q'] = $this->getLaunchData()->getUserEmail() . ' ' . $params['q'];
        } else {
            $params['q'] = $this->getLaunchData()->getUserEmail();
        }
        $events =  $this->calendar->events->listEvents(
            $this->credentials->getCalendarId(),
            $params
        );
        $this->response->getBody()->write(json_encode($events));
        return $this->response;
    }
}
