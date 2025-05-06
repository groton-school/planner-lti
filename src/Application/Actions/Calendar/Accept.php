<?php

declare(strict_types=1);

namespace App\Application\Actions\Calendar;

use App\Application\Actions\AbstractAction;
use App\Application\Actions\ViewsTrait;
use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\CalendarListEntry;
use Psr\Http\Message\ResponseInterface;

class Accept extends AbstractAction
{
    use ViewsTrait;

    private Calendar $calendar;
    private AppCredentialsRepositoryInterface $credentials;

    public function  __construct(
        Client $client,
        AppCredentialsRepositoryInterface $credentials
    ) {
        $this->initViews();

        $client->setScopes('https://www.googleapis.com/auth/calendar');
        $this->calendar = new Calendar($client);
        $this->credentials = $credentials;
    }

    protected function action(): ResponseInterface
    {
        // FIXME this is a one-time configuration step
        $entry = new CalendarListEntry();
        $entry->setId($this->credentials->getCalendarId());
        $this->calendar->calendarList->insert($entry);
        return $this->renderView($this->response, 'calendarInserted.php');
    }
}
